import { NextRequest } from "next/server";
import { proxyToBackend, requireStaffSession } from "@/lib/backend-proxy";

export async function GET(request: NextRequest) {
  const authResult = await requireStaffSession();
  if (authResult.error) return authResult.error;

  const query = request.nextUrl.search;
  return proxyToBackend(`/api/places${query}`, { method: "GET" }, authResult.role);
}

export async function POST(request: NextRequest) {
  const authResult = await requireStaffSession();
  if (authResult.error) return authResult.error;

  const body = await request.text();
  return proxyToBackend(
    "/api/places",
    { method: "POST", body },
    authResult.role,
  );
}
