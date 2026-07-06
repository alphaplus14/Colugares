import dotenv from "dotenv";
import { connectDb, getDb } from "../config/mongodb";
import { generatePlaceEmbedding } from "../services/embeddings";
import type { PlaceDocument } from "../types/place.types";

dotenv.config();

async function main(): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: define GEMINI_API_KEY en backend/.env antes de continuar.");
    console.error("Obtén la key en: https://aistudio.google.com/apikey");
    process.exit(1);
  }

  await connectDb();
  const db = await getDb();
  const collection = db.collection<PlaceDocument>("places");

  const pending = await collection
    .find({ embedding_status: { $in: ["pending", "failed"] } })
    .toArray();

  if (pending.length === 0) {
    console.log("=> No hay lugares pendientes de indexar.");
    process.exit(0);
  }

  console.log(`=> Generando embeddings para ${pending.length} lugares...\n`);

  let ok = 0;
  let failed = 0;

  for (const place of pending) {
    try {
      const vector = await generatePlaceEmbedding(place);
      await collection.updateOne(
        { _id: place._id },
        {
          $set: {
            vector_embedding: vector,
            embedding_status: "ready",
            updated_at: new Date(),
          },
        },
      );
      console.log(`   ✓ ${place.name}`);
      ok += 1;
    } catch (error: unknown) {
      await collection.updateOne(
        { _id: place._id },
        { $set: { embedding_status: "failed", updated_at: new Date() } },
      );
      const message = error instanceof Error ? error.message : "Error desconocido";
      console.log(`   ✗ ${place.name}: ${message}`);
      failed += 1;
    }
  }

  console.log(`\n=> Listo: ${ok} indexados, ${failed} fallidos`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Reindex falló: ${message}`);
  process.exit(1);
});
