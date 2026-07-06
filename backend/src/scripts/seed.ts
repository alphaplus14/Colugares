import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb, getDb } from "../config/mongodb";
import { caribeSeedPlaces } from "../data/caribe-seed";
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
  const existingCount = await collection.countDocuments({ region: "caribe" });

  if (existingCount >= caribeSeedPlaces.length) {
    console.log(`=> Lugares Caribe ya existen (${existingCount}). Saltando seed.`);
    return;
  }

  await collection.deleteMany({ region: "caribe" });

  const now = new Date();
  const docs = caribeSeedPlaces.map((place) => ({
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

  console.log(`=> ${ids.length} lugares del Caribe insertados`);

  if (process.env.GEMINI_API_KEY) {
    console.log("=> Encolando embeddings (requiere GEMINI_API_KEY)...");
    for (const id of ids) {
      scheduleEmbeddingJob(id);
    }
    console.log("=> Jobs de embedding iniciados en background");
  } else {
    console.log("=> GEMINI_API_KEY no definida — embeddings quedan en pending");
  }
}

async function main(): Promise<void> {
  await connectDb();
  const db = await getDb();

  await seedAdmin(db);
  await seedPlaces(db);

  console.log("\n=== Índice vectorial en Atlas (ejecutar manualmente en M10+) ===");
  console.log(`
db.places.createSearchIndex({
  name: "places_vector_idx",
  type: "vectorSearch",
  definition: {
    fields: [{
      type: "vector",
      path: "vector_embedding",
      numDimensions: 768,
      similarity: "cosine"
    }, {
      type: "filter",
      path: "region"
    }, {
      type: "filter",
      path: "is_subscriber"
    }, {
      type: "filter",
      path: "active"
    }]
  }
});
  `);

  process.exit(0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Seed falló: ${message}`);
  process.exit(1);
});
