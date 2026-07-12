import { NextRequest } from "next/server";
import { proxyToBackend, requireStaffSession } from "@/lib/backend-proxy";

interface RouteParams {
  params: { id: string };
}

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Obtener un lugar por ID (proxy hacia el backend Express interno)
 *     tags: [Places (CMS)]
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
 *         description: Lugar encontrado (respuesta reenviada desde el backend)
 *       400:
 *         description: ID inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Lugar no encontrado
 *   put:
 *     summary: Actualizar un lugar (proxy hacia el backend Express interno)
 *     tags: [Places (CMS)]
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
 *             description: Igual a PlaceInput parcial del backend Express
 *     responses:
 *       200:
 *         description: Lugar actualizado (respuesta reenviada desde el backend)
 *       400:
 *         description: Datos inválidos o ID inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Lugar no encontrado
 *   delete:
 *     summary: Eliminar un lugar permanentemente (proxy — el backend exige rol admin)
 *     tags: [Places (CMS)]
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
 *         description: Lugar eliminado
 *       403:
 *         description: No autorizado (solo admin)
 *       404:
 *         description: Lugar no encontrado
 *   patch:
 *     summary: Desactivar, reindexar, o actualizar parcialmente un lugar
 *     description: >
 *       El comportamiento depende del query param 'action': 'deactivate' llama a
 *       /api/places/{id}/deactivate en el backend, 'reindex' llama (como POST) a
 *       /api/places/{id}/reindex, y cualquier otro valor hace un PATCH genérico.
 *     tags: [Places (CMS)]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [deactivate, reindex]
 *     responses:
 *       200:
 *         description: Operación realizada (respuesta reenviada desde el backend)
 *       400:
 *         description: ID inválido
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Lugar no encontrado
 */
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
