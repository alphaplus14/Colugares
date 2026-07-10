import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb, getDb } from "../config/mongodb";
import { allPlacesSeed, placesSeedStats } from "../data/all-places-seed";
import { scheduleEmbeddingJob } from "../services/embeddingJob";
import type { UserDocument } from "../types/user.types";

dotenv.config();

async function seedAdmin(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@colugares.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const existing = await db.collection<UserDocument>("users").findOne({ email });

  if (existing) {
    console.log(`=> Admin ya existe: ${email}`);
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const now = new Date();

  await db.collection("users").insertOne({
    name: "Administrador Colugares",
    email,
    password_hash,
    role: "admin",
    visited_places: [],
    saved_itineraries: [],
    created_at: now,
    last_login: now,
  });

  console.log(`=> Admin creado: ${email} / ${password}`);
}

async function seedPlaces(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  const collection = db.collection("places");
  const existingCount = await collection.countDocuments();

  if (existingCount >= placesSeedStats.total) {
    const readyCount = await collection.countDocuments({ embedding_status: "ready" });
    console.log(
      `=> Lugares ya existen (${existingCount}, ${readyCount} indexados). Usa npm run reseed-places para reemplazar.`,
    );
    return;
  }

  const now = new Date();
  const docs = allPlacesSeed.map((place) => ({
    ...place,
    contact: {
      phone: place.contact.phone || undefined,
      email: place.contact.email || undefined,
      website: place.contact.website || undefined,
    },
    embedding_status: "pending" as const,
    created_at: now,
    updated_at: now,
  }));

  const result = await collection.insertMany(docs);
  const ids = Object.values(result.insertedIds);

  console.log(`=> ${ids.length} lugares insertados (6 regiones)`);

  if (process.env.GEMINI_API_KEY) {
    console.log("=> Encolando embeddings (requiere GEMINI_API_KEY)...");
    for (const id of ids) {
      scheduleEmbeddingJob(id);
    }
    console.log("=> Jobs de embedding iniciados — ejecuta npm run reindex para completar");
  } else {
    console.log("=> GEMINI_API_KEY no definida — embeddings quedan en pending");
  }
}

async function main(): Promise<void> {
  await connectDb();
  const db = await getDb();

  await seedAdmin(db);
  await seedPlaces(db);

  console.log("\n=== Catálogo seed ===");
  console.log(`   Total lugares definidos: ${placesSeedStats.total}`);
  console.log("   Regiones: caribe, andina, eje_cafetero, pacifico, amazonia, llanos");

  process.exit(0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Seed falló: ${message}`);
  process.exit(1);
});
