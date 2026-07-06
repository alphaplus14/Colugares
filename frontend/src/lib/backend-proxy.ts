import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/user.types";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

type AdminRole = Extract<UserRole, "admin" | "empleado">;

async function requireStaffSession(): Promise<
  { role: AdminRole; error?: never } | { error: NextResponse; role?: never }
> {
  const session = await auth();
  const role = session?.user?.role;

  if (!role || (role !== "admin" && role !== "empleado")) {
    return {
      error: NextResponse.json(
        { status: "error", message: "No autorizado" },
        { status: 403 },
      ),
    };
  }

  if (!INTERNAL_API_KEY) {
    return {
      error: NextResponse.json(
        { status: "error", message: "INTERNAL_API_KEY no configurada" },
        { status: 500 },
      ),
    };
  }

  return { role };
}

function backendHeaders(role: AdminRole): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Internal-Key": INTERNAL_API_KEY!,
    "X-User-Role": role,
  };
}

export async function proxyToBackend(
  path: string,
  options: RequestInit,
  role: AdminRole,
): Promise<NextResponse> {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      ...backendHeaders(role),
      ...(options.headers ?? {}),
    },
  });

  const data: unknown = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export { requireStaffSession };
