import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/** Valida sesión de viajero para rutas del AI Planner */
export async function requireViajeroSession(): Promise<
  | { userId: string; userName: string; error?: never }
  | { error: NextResponse; userId?: never; userName?: never }
> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { status: "error", message: "Debes iniciar sesión para usar el planner" },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "viajero") {
    return {
      error: NextResponse.json(
        { status: "error", message: "El planner es exclusivo para viajeros" },
        { status: 403 },
      ),
    };
  }

  return {
    userId: session.user.id,
    userName: session.user.name ?? "Viajero",
  };
}
