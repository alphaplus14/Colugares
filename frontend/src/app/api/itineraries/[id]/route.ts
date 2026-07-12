import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { serializeItinerary } from "@/lib/itinerary/serialize";
import { requireViajeroSession } from "@/lib/session-guards";
import type { ItineraryDocument } from "@/types/itinerary.types";
import type { UserDocument } from "@/types/user.types";

interface RouteParams {
  params: { id: string };
}

/**
 * @swagger
 * /api/itineraries/{id}:
 *   get:
 *     summary: Detalle de un itinerario guardado del viajero autenticado
 *     tags: [Itinerarios]
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
 *         description: Itinerario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   $ref: '#/components/schemas/ItineraryDetail'
 *       400:
 *         description: ID de itinerario inválido
 *       401:
 *         description: Sesión requerida
 *       403:
 *         description: El planner es exclusivo para viajeros
 *       404:
 *         description: Itinerario no encontrado (o no pertenece al usuario)
 *       500:
 *         description: No pudimos cargar el itinerario
 *   delete:
 *     summary: Eliminar un itinerario del historial del viajero
 *     tags: [Itinerarios]
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
 *         description: Itinerario eliminado
 *       400:
 *         description: ID de itinerario inválido
 *       401:
 *         description: Sesión requerida
 *       403:
 *         description: El planner es exclusivo para viajeros
 *       404:
 *         description: Itinerario no encontrado
 *       500:
 *         description: No pudimos eliminar el itinerario
 */
export async function GET(
  _request: Request,
  { params }: RouteParams,
) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID de itinerario inválido" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const doc = await db.collection<ItineraryDocument>("itineraries").findOne({
      _id: new ObjectId(params.id),
      user_id: new ObjectId(authResult.userId),
    });

    if (!doc) {
      return NextResponse.json(
        { status: "error", message: "Itinerario no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      status: "success",
      data: serializeItinerary(doc),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar el itinerario" },
      { status: 500 },
    );
  }
}

/** Elimina un itinerario del historial del viajero */
export async function DELETE(
  _request: Request,
  { params }: RouteParams,
) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json(
      { status: "error", message: "ID de itinerario inválido" },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const itineraryId = new ObjectId(params.id);

    const result = await db.collection<ItineraryDocument>("itineraries").deleteOne({
      _id: itineraryId,
      user_id: new ObjectId(authResult.userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { status: "error", message: "Itinerario no encontrado" },
        { status: 404 },
      );
    }

    await db.collection<UserDocument>("users").updateOne(
      { _id: new ObjectId(authResult.userId) },
      { $pull: { saved_itineraries: itineraryId } },
    );

    return NextResponse.json({
      status: "success",
      message: "Itinerario eliminado",
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos eliminar el itinerario" },
      { status: 500 },
    );
  }
}
