import dotenv from "dotenv";
import { connectDb, getDb } from "../config/mongodb";
import { allPlacesSeed, placesSeedStats } from "../data/all-places-seed";
import { generatePlaceEmbedding } from "../services/embeddings";
import type { PlaceDocument } from "../types/place.types";

dotenv.config();

/** Prepara documento de lugar para insertar en MongoDB */
function toPlaceDocument(place: (typeof allPlacesSeed)[number]) {
  const now = new Date();
  return {
    ...place,
    contact: {
      phone: place.contact.phone || undefined,
      email: place.contact.email || undefined,
      website: place.contact.website || undefined,
    },
    embedding_status: "pending" as const,
    created_at: now,
    updated_at: now,
  };
}

/** Reemplaza todos los lugares del seed e indexa embeddings */
async function main(): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: define GEMINI_API_KEY en backend/.env");
    process.exit(1);
  }

  await connectDb();
  const db = await getDb();
  const collection = db.collection<PlaceDocument>("places");

  const deleted = await collection.deleteMany({});
  console.log(`=> ${deleted.deletedCount} lugares anteriores eliminados`);

  const docs = allPlacesSeed.map(toPlaceDocument);
  const result = await collection.insertMany(docs);
  const insertedIds = Object.values(result.insertedIds);

  console.log(`=> ${insertedIds.length} lugares insertados:`);
  console.log(`   Caribe:       ${placesSeedStats.caribe}`);
  console.log(`   Andina:       ${placesSeedStats.andina}`);
  console.log(`   Eje Cafetero: ${placesSeedStats.eje_cafetero}`);
  console.log(`   Pacífico:     ${placesSeedStats.pacifico}`);
  console.log(`   Amazonía:     ${placesSeedStats.amazonia}`);
  console.log(`   Llanos:       ${placesSeedStats.llanos}`);
  console.log(`   TOTAL:        ${placesSeedStats.total}\n`);

  console.log("=> Generando embeddings (puede tardar varios minutos)...\n");

  let ok = 0;
  let failed = 0;

  const inserted = await collection.find({ _id: { $in: insertedIds } }).toArray();

  for (const place of inserted) {
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
      console.log(`   ✓ ${place.name} (${place.region})`);
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

  console.log(`\n=> Listo: ${ok} indexados, ${failed} fallidos de ${inserted.length}`);

  const byRegion = await collection
    .aggregate<{ _id: string; count: number }>([
      { $match: { embedding_status: "ready", active: true } },
      { $group: { _id: "$region", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray();

  console.log("\n=== Lugares listos por región ===");
  for (const row of byRegion) {
    console.log(`   ${row._id}: ${row.count}`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Reseed places falló: ${message}`);
  process.exit(1);
});
