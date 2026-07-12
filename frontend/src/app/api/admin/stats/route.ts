import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/session-guards";
import type { EventDocument } from "@/types/event.types";
import type { ItineraryDocument } from "@/types/itinerary.types";
import type { UserDocument } from "@/types/user.types";

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Métricas agregadas para el dashboard del CMS
 *     tags: [Admin - Estadísticas]
 *     security:
 *       - sessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Métricas calculadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: object
 *                   properties:
 *                     places:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         active: { type: integer }
 *                     events:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                         active: { type: integer }
 *                     itineraries:
 *                       type: object
 *                       properties:
 *                         total: { type: integer }
 *                     users:
 *                       type: object
 *                       properties:
 *                         viajeros: { type: integer }
 *                         empleados: { type: integer }
 *                         admins: { type: integer }
 *                         total: { type: integer }
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error al calcular las métricas
 */
export async function GET() {
  const staff = await requireStaffAuth();
  if (staff.error) return staff.error;

  try {
    const db = await getDb();

    const [
      placesTotal,
      placesActive,
      eventsTotal,
      eventsActive,
      itinerariesTotal,
      viajeros,
      empleados,
      admins,
    ] = await Promise.all([
      db.collection("places").countDocuments({}),
      db.collection("places").countDocuments({ active: true }),
      db.collection<EventDocument>("events").countDocuments({}),
      db.collection<EventDocument>("events").countDocuments({ active: true }),
      db.collection<ItineraryDocument>("itineraries").countDocuments({}),
      db.collection<UserDocument>("users").countDocuments({ role: "viajero" }),
      db.collection<UserDocument>("users").countDocuments({ role: "empleado" }),
      db.collection<UserDocument>("users").countDocuments({ role: "admin" }),
    ]);

    return NextResponse.json({
      status: "success",
      data: {
        places: { total: placesTotal, active: placesActive },
        events: { total: eventsTotal, active: eventsActive },
        itineraries: { total: itinerariesTotal },
        users: {
          viajeros,
          empleados,
          admins,
          total: viajeros + empleados + admins,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No se pudieron cargar las métricas" },
      { status: 500 },
    );
  }
}
