import { NextRequest } from "next/server";
import { proxyToBackend, requireStaffSession } from "@/lib/backend-proxy";

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireStaffSession();
  if (authResult.error) return authResult.error;

  return proxyToBackend(
    `/api/places/${params.id}`,
    { method: "GET" },
    authResult.role,
  );
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireStaffSession();
  if (authResult.error) return authResult.error;

  const body = await request.text();
  return proxyToBackend(
    `/api/places/${params.id}`,
    { method: "PUT", body },
    authResult.role,
  );
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const authResult = await requireStaffSession();
  if (authResult.error) return authResult.error;

  return proxyToBackend(
    `/api/places/${params.id}`,
    { method: "DELETE" },
    authResult.role,
  );
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const authResult = await requireStaffSession();
  if (authResult.error) return authResult.error;

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "deactivate") {
    return proxyToBackend(
      `/api/places/${params.id}/deactivate`,
      { method: "PATCH" },
      authResult.role,
    );
  }

  if (action === "reindex") {
    return proxyToBackend(
      `/api/places/${params.id}/reindex`,
      { method: "POST" },
      authResult.role,
    );
  }

  return proxyToBackend(
    `/api/places/${params.id}`,
    { method: "PATCH", body: await request.text() },
    authResult.role,
  );
}
