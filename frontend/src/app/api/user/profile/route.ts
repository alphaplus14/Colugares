import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireViajeroSession } from "@/lib/session-guards";
import { onboardingSchema } from "@/lib/validators/onboarding.schema";
import type { TravelProfile, UserDocument } from "@/types/user.types";

/** Devuelve el perfil de viaje del viajero autenticado */
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

/** Actualiza preferencias de viaje — afectan el RAG inmediatamente */
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
