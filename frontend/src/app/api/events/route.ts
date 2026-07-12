import { NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/events/repository";
import { getDb } from "@/lib/mongodb";

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Calendario público de próximas festividades (sin autenticación)
 *     tags: [Eventos]
 *     security: []
 *     responses:
 *       200:
 *         description: Próximos eventos activos (máximo 6)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Evento público serializado (subconjunto de AdminEvent)
 *       500:
 *         description: No pudimos cargar el calendario de eventos
 */
export async function GET() {
  try {
    const db = await getDb();
    const events = await getUpcomingEvents(db, 6);

    return NextResponse.json({ status: "success", data: events });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar el calendario de eventos" },
      { status: 500 },
    );
  }
}
