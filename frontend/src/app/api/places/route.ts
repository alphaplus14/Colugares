import { NextRequest } from "next/server";
import { proxyToBackend, requireStaffSession } from "@/lib/backend-proxy";

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Listado CMS de lugares (proxy hacia el backend Express interno)
 *     description: >
 *       Valida la sesión de staff (admin|empleado) vía Auth.js y reenvía la petición
 *       al microservicio de Places agregando los headers X-Internal-Key y X-User-Role.
 *       Soporta los mismos query params que el backend (region, type, active, page, limit).
 *     tags: [Places (CMS)]
 *     security:
 *       - sessionCookieAuth: []
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           $ref: '#/components/schemas/ColombiaRegion'
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [hotel, restaurante, actividad, atractivo, agencia]
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Respuesta reenviada tal cual desde el backend Express (ver Places API)
 *       403:
 *         description: No autorizado, o INTERNAL_API_KEY no configurada en el servidor
 *   post:
 *     summary: Crear un lugar nuevo (proxy hacia el backend Express interno)
 *     tags: [Places (CMS)]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Igual a PlaceInput del backend Express
 *     responses:
 *       201:
 *         description: Lugar creado (respuesta reenviada desde el backend)
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: No autorizado
 */
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
