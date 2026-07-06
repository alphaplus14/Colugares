import { ObjectId } from "mongodb";
import { getDb } from "../config/mongodb";
import type { PlaceDocument } from "../types/place.types";
import { generatePlaceEmbedding } from "./embeddings";

/**
 * Job asíncrono: genera y persiste el embedding sin bloquear la respuesta HTTP.
 * Regla de negocio: al publicar un lugar queda indexable en cuanto el job termina.
 */
export function scheduleEmbeddingJob(placeId: ObjectId): void {
  void runEmbeddingJob(placeId).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error(`[embeddingJob] Falló para ${placeId.toString()}: ${message}`);
  });
}

async function runEmbeddingJob(placeId: ObjectId): Promise<void> {
  const db = await getDb();
  const collection = db.collection<PlaceDocument>("places");

  const place = await collection.findOne({ _id: placeId });
  if (!place) {
    return;
  }

  try {
    const vector = await generatePlaceEmbedding(place);

    await collection.updateOne(
      { _id: placeId },
      {
        $set: {
          vector_embedding: vector,
          embedding_status: "ready",
          updated_at: new Date(),
        },
      },
    );

    console.log(`[embeddingJob] Embedding listo: ${place.name}`);
  } catch {
    await collection.updateOne(
      { _id: placeId },
      {
        $set: {
          embedding_status: "failed",
          updated_at: new Date(),
        },
      },
    );
    throw new Error(`No se pudo generar embedding para ${place.name}`);
  }
}
