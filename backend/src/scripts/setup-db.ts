import dotenv from "dotenv";
import { connectDb, getDb } from "../config/mongodb";
import { eventsSeed } from "../data/events-seed";

dotenv.config();

/** Crea índices recomendados y colecciones vacías (itineraries) */
async function setupIndexes(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  await db.collection("users").createIndex({ email: 1 }, { unique: true });
  await db.collection("users").createIndex({ role: 1 });

  await db.collection("places").createIndex({ region: 1, active: 1, is_subscriber: 1 });
  await db.collection("places").createIndex({ embedding_status: 1 });
  await db.collection("places").createIndex({ city: 1 });

  await db.collection("itineraries").createIndex({ user_id: 1, created_at: -1 });

  await db.collection("events").createIndex({ region: 1, active: 1 });
  await db.collection("events").createIndex({ start_date: 1, end_date: 1 });

  console.log("=> Índices creados en users, places, itineraries, events");
}

async function seedEvents(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  const collection = db.collection("events");
  const existing = await collection.countDocuments();

  if (existing > 0) {
    console.log(`=> Eventos ya existen (${existing}). Saltando seed.`);
    return;
  }

  await collection.insertMany(eventsSeed.map((event) => ({ ...event })));
  console.log(`=> ${eventsSeed.length} eventos de festividades insertados`);
}

async function ensureItinerariesCollection(
  db: Awaited<ReturnType<typeof getDb>>,
): Promise<void> {
  const collections = await db.listCollections({ name: "itineraries" }).toArray();
  if (collections.length === 0) {
    await db.createCollection("itineraries");
    console.log("=> Colección itineraries creada (vacía — Fase 4)");
  } else {
    console.log("=> Colección itineraries ya existe");
  }
}

async function main(): Promise<void> {
  await connectDb();
  const db = await getDb();

  await setupIndexes(db);
  await ensureItinerariesCollection(db);
  await seedEvents(db);

  const stats = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("places").countDocuments(),
    db.collection("events").countDocuments(),
    db.collection("itineraries").countDocuments(),
  ]);

  console.log("\n=== Estado de la base de datos ===");
  console.log(`   users:       ${stats[0]}`);
  console.log(`   places:      ${stats[1]}`);
  console.log(`   events:      ${stats[2]}`);
  console.log(`   itineraries: ${stats[3]}`);
  process.exit(0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Setup falló: ${message}`);
  process.exit(1);
});
