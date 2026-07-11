import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireViajeroSession } from "@/lib/session-guards";
import { onboardingSchema } from "@/lib/validators/onboarding.schema";
import type { TravelProfile, UserDocument } from "@/types/user.types";

/** Guarda el perfil de viaje del viajero tras completar el quiz de onboarding */
export async function POST(request: Request) {
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
          message: "Datos del onboarding inválidos",
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
      message: "Perfil de viaje guardado correctamente",
      data: travelProfile,
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos guardar tu perfil. Intenta de nuevo." },
      { status: 500 },
    );
  }
}
