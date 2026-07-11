import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { UserRole } from "@/types/user.types";

type StaffRole = Extract<UserRole, "admin" | "empleado">;

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

/** Staff (admin | empleado) para CMS en Next — sin INTERNAL_API_KEY */
export async function requireStaffAuth(): Promise<
  | { userId: string; role: StaffRole; error?: never }
  | { error: NextResponse; userId?: never; role?: never }
> {
  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user?.id || (role !== "admin" && role !== "empleado")) {
    return {
      error: NextResponse.json(
        { status: "error", message: "No autorizado" },
        { status: 403 },
      ),
    };
  }

  return { userId: session.user.id, role };
}

/** Solo super-admin */
export async function requireAdminAuth(): Promise<
  | { userId: string; role: "admin"; error?: never }
  | { error: NextResponse; userId?: never; role?: never }
> {
  const staff = await requireStaffAuth();
  if (staff.error) {
    return staff;
  }

  if (staff.role !== "admin") {
    return {
      error: NextResponse.json(
        {
          status: "error",
          message: "Solo el super-admin puede realizar esta acción",
        },
        { status: 403 },
      ),
    };
  }

  return { userId: staff.userId, role: "admin" };
}
