import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/mongodb";
import { requireViajeroSession } from "@/lib/session-guards";
import type { PlaceDocument } from "@/types/place-document.types";
import type { UserDocument } from "@/types/user.types";
import type { PublicPlaceSummary } from "@/lib/places/load-public-places";

const placeIdSchema = z.object({
  place_id: z.string().min(1),
});

function toSummary(place: PlaceDocument): PublicPlaceSummary {
  return {
    _id: place._id.toString(),
    name: place.name,
    type: place.type,
    region: place.region,
    department: place.department,
    city: place.city,
    description: place.description,
    tags: place.tags,
    budget_tier: place.budget_tier,
    photos: place.photos,
    coordinates: place.coordinates,
  };
}

/**
 * @swagger
 * /api/user/visited-places:
 *   get:
 *     summary: Lista los lugares que el viajero marcó como visitados (excluidos del RAG)
 *     tags: [Usuario]
 *     security:
 *       - sessionCookieAuth: []
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PlaceSummary'
 *       401:
 *         description: Sesión requerida
 *       500:
 *         description: No pudimos cargar tus lugares visitados
 */
export async function GET() {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const db = await getDb();
    const user = await db.collection<UserDocument>("users").findOne(
      { _id: new ObjectId(authResult.userId) },
      { projection: { visited_places: 1 } },
    );

    const ids = user?.visited_places ?? [];
    if (ids.length === 0) {
      return NextResponse.json({ status: "success", data: [] });
    }

    const places = (await db
      .collection("places")
      .find({ _id: { $in: ids } })
      .project({
        name: 1,
        type: 1,
        region: 1,
        department: 1,
        city: 1,
        description: 1,
        tags: 1,
        budget_tier: 1,
        photos: 1,
        coordinates: 1,
      })
      .toArray()) as PlaceDocument[];

    return NextResponse.json({
      status: "success",
      data: places.map(toSummary),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar tus lugares visitados" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/user/visited-places:
 *   post:
 *     summary: Marca un lugar como visitado (Colu dejará de recomendarlo en el RAG)
 *     tags: [Usuario]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [place_id]
 *             properties:
 *               place_id: { type: string }
 *     responses:
 *       200:
 *         description: Lugar marcado como visitado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/PlaceSummary'
 *       400:
 *         description: ID de lugar inválido
 *       401:
 *         description: Sesión requerida
 *       404:
 *         description: Lugar no encontrado (o inactivo)
 *       500:
 *         description: No pudimos marcar el lugar
 *   delete:
 *     summary: Quita un lugar de visitados (vuelve a ser elegible en el RAG)
 *     tags: [Usuario]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [place_id]
 *             properties:
 *               place_id: { type: string }
 *     responses:
 *       200:
 *         description: Lugar quitado de visitados
 *       400:
 *         description: ID de lugar inválido
 *       401:
 *         description: Sesión requerida
 *       500:
 *         description: No pudimos actualizar visitados
 */
export async function POST(request: Request) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body: unknown = await request.json();
    const parsed = placeIdSchema.safeParse(body);

    if (!parsed.success || !ObjectId.isValid(parsed.data.place_id)) {
      return NextResponse.json(
        { status: "error", message: "ID de lugar inválido" },
        { status: 400 },
      );
    }

    const placeOid = new ObjectId(parsed.data.place_id);
    const db = await getDb();

    const place = await db.collection<PlaceDocument>("places").findOne({
      _id: placeOid,
      active: true,
    });

    if (!place) {
      return NextResponse.json(
        { status: "error", message: "Lugar no encontrado" },
        { status: 404 },
      );
    }

    await db.collection<UserDocument>("users").updateOne(
      { _id: new ObjectId(authResult.userId) },
      { $addToSet: { visited_places: placeOid } },
    );

    return NextResponse.json({
      status: "success",
      message: "Lugar marcado como visitado",
      data: toSummary(place),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos marcar el lugar" },
      { status: 500 },
    );
  }
}

/** Quita un lugar de visitados — vuelve a ser elegible en el RAG */
export async function DELETE(request: Request) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body: unknown = await request.json();
    const parsed = placeIdSchema.safeParse(body);

    if (!parsed.success || !ObjectId.isValid(parsed.data.place_id)) {
      return NextResponse.json(
        { status: "error", message: "ID de lugar inválido" },
        { status: 400 },
      );
    }

    const db = await getDb();
    await db.collection<UserDocument>("users").updateOne(
      { _id: new ObjectId(authResult.userId) },
      { $pull: { visited_places: new ObjectId(parsed.data.place_id) } },
    );

    return NextResponse.json({
      status: "success",
      message: "Lugar quitado de visitados",
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos actualizar visitados" },
      { status: 500 },
    );
  }
}
