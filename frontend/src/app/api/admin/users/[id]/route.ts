import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { requireAdminAuth } from "@/lib/session-guards";
import { updateUserSchema } from "@/lib/validators/admin-user.schema";
import type { UserDocument } from "@/types/user.types";

interface RouteContext {
  params: { id: string };
}

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
 * /api/admin/users/{id}:
 *   put:
 *     summary: Actualizar nombre o estado activo de un usuario (solo super-admin)
 *     tags: [Admin - Usuarios]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, minLength: 2, maxLength: 80 }
 *               active: { type: boolean }
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   $ref: '#/components/schemas/AdminUser'
 *       400:
 *         description: Datos inválidos, ID inválido, o intento de auto-desactivarse
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Eliminar un usuario (no admins, no la propia cuenta)
 *     tags: [Admin - Usuarios]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       400:
 *         description: ID inválido o intento de eliminar la propia cuenta
 *       403:
 *         description: No autorizado, o intento de eliminar una cuenta super-admin
 *       404:
 *         description: Usuario no encontrado
 */
export async function PUT(request: Request, context: RouteContext) {
  const admin = await requireAdminAuth();
  if (admin.error) return admin.error;

  if (!ObjectId.isValid(context.params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID inválido" },
      { status: 400 },
    );
  }

  try {
    const body: unknown = await request.json();
    const parsed = updateUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: parsed.error.issues[0]?.message ?? "Datos inválidos",
        },
        { status: 400 },
      );
    }

    const db = await getDb();
    const target = await db
      .collection<UserDocument>("users")
      .findOne({ _id: new ObjectId(context.params.id) });

    if (!target) {
      return NextResponse.json(
        { status: "error", message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    // No desactivar al propio super-admin
    if (
      target._id.toString() === admin.userId &&
      parsed.data.active === false
    ) {
      return NextResponse.json(
        { status: "error", message: "No puedes desactivar tu propia cuenta" },
        { status: 400 },
      );
    }

    const $set: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) $set.name = parsed.data.name;
    if (parsed.data.active !== undefined) $set.active = parsed.data.active;

    const result = await db
      .collection<UserDocument>("users")
      .findOneAndUpdate(
        { _id: target._id },
        { $set },
        { returnDocument: "after" },
      );

    if (!result) {
      return NextResponse.json(
        { status: "error", message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: serializeUser(result),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudo actualizar el usuario" },
      { status: 500 },
    );
  }
}

/** DELETE — solo admin; no borra admins ni a sí mismo */
export async function DELETE(_request: Request, context: RouteContext) {
  const admin = await requireAdminAuth();
  if (admin.error) return admin.error;

  if (!ObjectId.isValid(context.params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID inválido" },
      { status: 400 },
    );
  }

  if (context.params.id === admin.userId) {
    return NextResponse.json(
      { status: "error", message: "No puedes eliminar tu propia cuenta" },
      { status: 400 },
    );
  }

  const db = await getDb();
  const target = await db
    .collection<UserDocument>("users")
    .findOne({ _id: new ObjectId(context.params.id) });

  if (!target) {
    return NextResponse.json(
      { status: "error", message: "Usuario no encontrado" },
      { status: 404 },
    );
  }

  if (target.role === "admin") {
    return NextResponse.json(
      { status: "error", message: "No se pueden eliminar cuentas super-admin" },
      { status: 403 },
    );
  }

  await db.collection<UserDocument>("users").deleteOne({ _id: target._id });

  return NextResponse.json({
    status: "success",
    message: "Usuario eliminado",
  });
}
