import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { resolvePlacePhotos } from "@/lib/places/local-photos";
import { requireViajeroSession } from "@/lib/session-guards";
import type { PlaceCatalogEntry } from "@/types/itinerary.types";
import type { PlaceDocument } from "@/types/place-document.types";

/** Catálogo público de places suscritos — para mapa y parser del planner */
export async function GET() {
  const authResult = await requireViajeroSession();
  if (authResult.error) {
    return authResult.error;
  }

  try {
    const db = await getDb();
    const places = await db
      .collection<PlaceDocument>("places")
      .find({
        is_subscriber: true,
        active: true,
      })
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

    const catalog: PlaceCatalogEntry[] = places.map((place) => ({
      _id: place._id.toString(),
      name: place.name,
      type: place.type,
      city: place.city,
      region: place.region,
      description: place.description,
      tags: place.tags,
      budget_tier: place.budget_tier,
      price_real: place.price_real,
      // Prioriza fotos locales en public/images/places/...
      photos: resolvePlacePhotos(place.region, place.name, place.photos),
      coordinates: place.coordinates,
    }));

    return NextResponse.json({ status: "success", data: catalog });
  } catch {
    return NextResponse.json(
      { status: "error", message: "No pudimos cargar el catálogo de lugares" },
      { status: 500 },
    );
  }
}
