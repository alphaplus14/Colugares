import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { detectGeographyWarnings } from "@/lib/itinerary/geography";
import { parseItineraryFromMarkdown } from "@/lib/itinerary/parser";
import { serializeItinerary } from "@/lib/itinerary/serialize";
import { resolvePlacePhotos } from "@/lib/places/local-photos";
import { requireViajeroSession } from "@/lib/session-guards";
import { saveItinerarySchema } from "@/lib/validators/itinerary.schema";
import type {
  ItineraryDocument,
  ItineraryListItem,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";
import type { PlaceDocument } from "@/types/place-document.types";
import type { UserDocument } from "@/types/user.types";

async function loadCatalog(): Promise<PlaceCatalogEntry[]> {
  const db = await getDb();
  const places = await db
    .collection<PlaceDocument>("places")
    .find({ is_subscriber: true, active: true })
    .project({
      name: 1,
      type: 1,
      city: 1,
      region: 1,
      description: 1,
      tags: 1,
      budget_tier: 1,
      price_real: 1,
      photos: 1,
      coordinates: 1,
    })
    .toArray();

  return places.map((place) => ({
    _id: place._id.toString(),
    name: place.name,
    type: place.type,
    city: place.city,
    region: place.region,
    description: place.description,
    tags: place.tags,
    budget_tier: place.budget_tier,
    price_real: place.price_real,
    photos: resolvePlacePhotos(place.region, place.name, place.photos),
    coordinates: place.coordinates,
  }));
}

/**
 * @swagger
 * /api/itineraries:
 *   get:
 *     summary: Lista los itinerarios guardados del viajero autenticado
 *     tags: [Itinerarios]
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
 *                     $ref: '#/components/schemas/ItineraryListItem'
 *       401:
 *         description: Sesión requerida
 *       403:
 *         description: El planner es exclusivo para viajeros
 *       500:
 *         description: No pudimos cargar tus itinerarios
 */
export async function GET() {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const db = await getDb();
    const docs = await db
      .collection<ItineraryDocument>("itineraries")
      .find({ user_id: new ObjectId(authResult.userId) })
      .sort({ created_at: -1 })
      .toArray();

    const data: ItineraryListItem[] = docs.map((doc) => ({
      _id: doc._id.toString(),
      title: doc.title,
      region: doc.region,
      days_count: doc.days.length,
      created_at: doc.created_at.toISOString(),
    }));

    return NextResponse.json({ status: "success", data });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar tus itinerarios" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/itineraries:
 *   post:
 *     summary: Parsea y guarda un itinerario a partir del texto markdown generado por Colu (AI planner)
 *     tags: [Itinerarios]
 *     security:
 *       - sessionCookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [raw_content]
 *             properties:
 *               title: { type: string, minLength: 3, maxLength: 120 }
 *               region: { type: string, minLength: 2, maxLength: 40 }
 *               raw_content:
 *                 type: string
 *                 minLength: 20
 *                 maxLength: 50000
 *                 description: Respuesta en markdown del asistente, con días y actividades estructuradas
 *     responses:
 *       200:
 *         description: Itinerario guardado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: success }
 *                 message: { type: string }
 *                 data:
 *                   $ref: '#/components/schemas/ItineraryDetail'
 *       400:
 *         description: Datos inválidos, o no se detectaron días estructurados en raw_content
 *       401:
 *         description: Sesión requerida
 *       403:
 *         description: El planner es exclusivo para viajeros
 *       500:
 *         description: No pudimos guardar el itinerario
 */
export async function POST(request: Request) {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const body: unknown = await request.json();
    const parsed = saveItinerarySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "Datos del itinerario inválidos" },
        { status: 400 },
      );
    }

    const catalog = await loadCatalog();
    const db = await getDb();

    const user = await db.collection<UserDocument>("users").findOne({
      _id: new ObjectId(authResult.userId),
    });

    const defaultRegion =
      user?.travel_profile?.primary_interests[0] ?? "caribe";

    const parsedItinerary = parseItineraryFromMarkdown(
      parsed.data.raw_content,
      catalog,
      defaultRegion,
    );

    if (parsedItinerary.days.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "No encontramos días estructurados en la respuesta de Colu. Pide un plan día por día primero.",
        },
        { status: 400 },
      );
    }

    const geographyWarnings = detectGeographyWarnings(parsedItinerary.days);

    const placesUsed = new Set<string>();
    for (const day of parsedItinerary.days) {
      for (const slot of day.slots) {
        if (slot.place_id) {
          placesUsed.add(slot.place_id);
        }
      }
    }

    const now = new Date();
    const document: Omit<ItineraryDocument, "_id"> = {
      user_id: new ObjectId(authResult.userId),
      title: parsed.data.title ?? parsedItinerary.title,
      region: parsed.data.region ?? parsedItinerary.region,
      days: parsedItinerary.days,
      places_used: [...placesUsed].map((id) => new ObjectId(id)),
      geography_warnings: geographyWarnings,
      raw_content: parsed.data.raw_content,
      created_at: now,
      updated_at: now,
    };

    const insertResult = await db
      .collection<Omit<ItineraryDocument, "_id">>("itineraries")
      .insertOne(document);

    await db.collection<UserDocument>("users").updateOne(
      { _id: new ObjectId(authResult.userId) },
      {
        $addToSet: {
          saved_itineraries: insertResult.insertedId,
        },
      },
    );

    const saved: ItineraryDocument = {
      _id: insertResult.insertedId,
      ...document,
    };

    return NextResponse.json({
      status: "success",
      message: "Itinerario guardado correctamente",
      data: serializeItinerary(saved),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos guardar el itinerario" },
      { status: 500 },
    );
  }
}
