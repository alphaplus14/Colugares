import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  buildPaginationMeta,
  parsePagination,
} from "@/lib/pagination";
import { requireAdminAuth, requireStaffAuth } from "@/lib/session-guards";
import { createEmployeeSchema } from "@/lib/validators/admin-user.schema";
import type { UserDocument, UserRole } from "@/types/user.types";

function serializeUser(doc: UserDocument) {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    active: doc.active !== false,
    onboarding_completed: Boolean(doc.travel_profile?.onboarding_completed),
    itineraries_count: doc.saved_itineraries?.length ?? 0,
    created_at: doc.created_at.toISOString(),
    last_login: doc.last_login.toISOString(),
  };
}

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listado paginado de usuarios (empleados solo ven viajeros)
 *     tags: [Admin - Usuarios]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         description: Ignorado si la sesión es de rol 'empleado' (siempre filtra viajero)
 *         schema:
 *           $ref: '#/components/schemas/UserRole'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminUser'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error al cargar los usuarios
 */
export async function GET(request: Request) {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") as UserRole | null;
    const { page, limit, skip } = parsePagination(searchParams, { limit: 10 });

    const filter: Record<string, unknown> = {};

    if (staff.role === "empleado") {
      filter.role = "viajero";
    } else if (role === "admin" || role === "empleado" || role === "viajero") {
      filter.role = role;
    }

    const db = await getDb();
    const collection = db.collection<UserDocument>("users");
    const total = await collection.countDocuments(filter);

    const docs = await collection
      .find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      status: "success",
      data: docs.map(serializeUser),
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudieron cargar los usuarios" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Crear un empleado nuevo (solo super-admin)
 *     tags: [Admin - Usuarios]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, confirmPassword]
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 80 }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8, maxLength: 72 }
 *               confirmPassword: { type: string }
 *     responses:
 *       201:
 *         description: Empleado creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   $ref: '#/components/schemas/AdminUser'
 *       400:
 *         description: Datos inválidos (incluye contraseñas no coincidentes)
 *       403:
 *         description: Solo el super-admin puede crear empleados
 *       409:
 *         description: Ya existe un usuario con ese correo
 *       500:
 *         description: Error al crear el empleado
 */
export async function POST(request: Request) {
  const admin = await requireAdminAuth();
  if (admin.error) return admin.error;

  try {
    const body: unknown = await request.json();
    const parsed = createEmployeeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: parsed.error.issues[0]?.message ?? "Datos inválidos",
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const db = await getDb();

    const existing = await db
      .collection<UserDocument>("users")
      .findOne({ email: normalizedEmail });

    if (existing) {
      return NextResponse.json(
        { status: "error", message: "Ya existe un usuario con ese correo" },
        { status: 409 },
      );
    }

    const now = new Date();
    const doc: UserDocument = {
      _id: new ObjectId(),
      name,
      email: normalizedEmail,
      password_hash: await bcrypt.hash(password, 12),
      role: "empleado",
      visited_places: [],
      saved_itineraries: [],
      active: true,
      created_at: now,
      last_login: now,
    };

    await db.collection<UserDocument>("users").insertOne(doc);

    return NextResponse.json(
      { status: "success", data: serializeUser(doc) },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudo crear el empleado" },
      { status: 500 },
    );
  }
}
