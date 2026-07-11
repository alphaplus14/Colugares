import type { Db } from "mongodb";
import { ObjectId } from "mongodb";
import type { PlaceDocument } from "@/types/place-document.types";
import type { ColombiaRegion } from "@/types/place.types";
import { cosineSimilarity } from "@/lib/rag/cosine";

const USE_ATLAS_VECTOR_SEARCH =
  process.env.USE_ATLAS_VECTOR_SEARCH === "true";

interface RetrieveOptions {
  regions: ColombiaRegion[];
  excludeIds: ObjectId[];
  limit: number;
  numCandidates?: number;
}

/** Filtro base de negocio: solo lugares suscritos, activos e indexados */
function basePlaceFilter(excludeIds: ObjectId[], regions: ColombiaRegion[]) {
  return {
    region: { $in: regions },
    _id: { $nin: excludeIds },
    is_subscriber: true,
    active: true,
    embedding_status: "ready" as const,
    vector_embedding: { $exists: true },
  };
}

/** Recupera lugares relevantes para el mensaje del usuario (primary o secondary pool) */
export async function retrievePlaces(
  db: Db,
  queryEmbedding: number[],
  options: RetrieveOptions,
): Promise<PlaceDocument[]> {
  if (options.regions.length === 0) {
    return [];
  }

  if (USE_ATLAS_VECTOR_SEARCH) {
    return retrieveWithAtlas(db, queryEmbedding, options);
  }

  return retrieveWithCosine(db, queryEmbedding, options);
}

async function retrieveWithAtlas(
  db: Db,
  queryEmbedding: number[],
  options: RetrieveOptions,
): Promise<PlaceDocument[]> {
  const pipeline = [
    {
      $vectorSearch: {
        index: "places_vector_idx",
        path: "vector_embedding",
        queryVector: queryEmbedding,
        numCandidates: options.numCandidates ?? 50,
        limit: options.limit,
        filter: basePlaceFilter(options.excludeIds, options.regions),
      },
    },
    {
      $project: {
        vector_embedding: 0,
      },
    },
  ];

  return db
    .collection<PlaceDocument>("places")
    .aggregate<PlaceDocument>(pipeline)
    .toArray();
}

/** Fallback dev: similitud coseno in-memory (MongoDB Community no tiene $vectorSearch) */
async function retrieveWithCosine(
  db: Db,
  queryEmbedding: number[],
  options: RetrieveOptions,
): Promise<PlaceDocument[]> {
  const places = await db
    .collection<PlaceDocument>("places")
    .find(basePlaceFilter(options.excludeIds, options.regions))
    .toArray();

  return places
    .map((place) => ({
      place,
      score: cosineSimilarity(queryEmbedding, place.vector_embedding ?? []),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit)
    .map(({ place }) => place);
}

/** Resuelve nombres de lugares ya visitados para el system prompt */
export async function resolveVisitedPlaceNames(
  db: Db,
  visitedIds: ObjectId[],
): Promise<string[]> {
  if (visitedIds.length === 0) {
    return [];
  }

  const places = await db
    .collection<PlaceDocument>("places")
    .find({ _id: { $in: visitedIds } })
    .project({ name: 1 })
    .toArray();

  return places.map((p) => p.name);
}
