import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireViajeroSession } from "@/lib/session-guards";
import { onboardingSchema } from "@/lib/validators/onboarding.schema";
import type { TravelProfile, UserDocument } from "@/types/user.types";

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Perfil de viaje del viajero autenticado
 *     tags: [Usuario]
 *     security:
 *       - sessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     email: { type: string }
 *                     travel_profile:
 *                       $ref: '#/components/schemas/TravelProfile'
 *       401:
 *         description: Sesión requerida
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: No pudimos cargar tu perfil
 */
export async function GET() {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const db = await getDb();
    const user = await db.collection<UserDocument>("users").findOne(
      { _id: new ObjectId(authResult.userId) },
      { projection: { travel_profile: 1, name: 1, email: 1 } },
    );

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: {
        name: user.name,
        email: user.email,
        travel_profile: user.travel_profile ?? null,
      },
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar tu perfil" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Actualiza las preferencias de viaje (afectan el RAG del planner de inmediato)
 *     tags: [Usuario]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [primary_interests, budget_range, group_type, travel_pace]
 *             properties:
 *               primary_interests:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ColombiaRegion'
 *               secondary_interests:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ColombiaRegion'
 *               budget_range: { type: string, enum: [bajo, medio, alto] }
 *               group_type: { type: string, enum: [solo, pareja, familia, amigos] }
 *               travel_pace: { type: string, enum: [intenso, relajado] }
 *     responses:
 *       200:
 *         description: Preferencias actualizadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/TravelProfile'
 *       400:
 *         description: Preferencias inválidas
 *       401:
 *         description: Sesión requerida
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: No pudimos actualizar tus preferencias
 */
export async function PUT(request: Request) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body: unknown = await request.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          status: "error",
          message: "Preferencias inválidas",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const travelProfile: TravelProfile = {
      primary_interests: parsed.data.primary_interests,
      secondary_interests: parsed.data.secondary_interests,
      budget_range: parsed.data.budget_range,
      group_type: parsed.data.group_type,
      travel_pace: parsed.data.travel_pace,
      onboarding_completed: true,
    };

    const db = await getDb();
    const result = await db.collection<UserDocument>("users").updateOne(
      { _id: new ObjectId(authResult.userId) },
      { $set: { travel_profile: travelProfile } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { status: "error", message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Preferencias actualizadas",
      data: travelProfile,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos actualizar tus preferencias" },
      { status: 500 },
    );
  }
}
