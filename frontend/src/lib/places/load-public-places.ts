import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import type { PlaceDocument } from "@/types/place-document.types";
import type {
  BudgetTier,
  ColombiaRegion,
  PlaceType,
} from "@/types/place.types";

/** Resumen público de un lugar suscrito (home / destinos) */
export interface PublicPlaceSummary {
  _id: string;
  name: string;
  type: PlaceType;
  region: ColombiaRegion;
  department: string;
  city: string;
  description: string;
  tags: string[];
  budget_tier: BudgetTier;
  photos: string[];
  coordinates: { lat: number; lng: number };
}

export interface PublicPlacesFilter {
  region?: ColombiaRegion;
  type?: PlaceType;
  limit?: number;
}

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

/** Lista lugares activos y suscritos para el portal público */
export async function loadPublicPlaces(
  filter: PublicPlacesFilter = {},
): Promise<PublicPlaceSummary[]> {
  const db = await getDb();
  const query: Record<string, unknown> = {
    is_subscriber: true,
    active: true,
  };

  if (filter.region) {
    query.region = filter.region;
  }
  if (filter.type) {
    query.type = filter.type;
  }

  const places = (await db
    .collection("places")
    .find(query)
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
    .sort({ name: 1 })
    .limit(filter.limit ?? 120)
    .toArray()) as PlaceDocument[];

  return places.map(toSummary);
}

/** Detalle de un lugar público por id */
export async function loadPublicPlaceById(
  id: string,
): Promise<(PublicPlaceSummary & {
  price_real?: PlaceDocument["price_real"];
  contact: PlaceDocument["contact"];
  recommended_transport: string[];
}) | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const db = await getDb();
  const place = await db.collection<PlaceDocument>("places").findOne({
    _id: new ObjectId(id),
    is_subscriber: true,
    active: true,
  });

  if (!place) {
    return null;
  }

  return {
    ...toSummary(place),
    price_real: place.price_real,
    contact: place.contact,
    recommended_transport: place.recommended_transport,
  };
}
