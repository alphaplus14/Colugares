import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { connectDb, getDb } from "../config/mongodb";
import { caribeSeedPlaces } from "../data/caribe-seed";
import { eventsSeed } from "../data/events-seed";
import { itinerariesSeed } from "../data/itineraries-seed";
import { scheduleEmbeddingJob } from "../services/embeddingJob";
import type { ItineraryDay, ItinerarySlot } from "../types/itinerary.types";
import type { PlaceDocument } from "../types/place.types";
import type { UserDocument } from "../types/user.types";

dotenv.config();

const VIAJERO_EMAIL = "viajero@colugares.com";
const VIAJERO_PASSWORD = "Viajero123!";

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

async function seedViajero(db: Awaited<ReturnType<typeof getDb>>): Promise<ObjectId> {
  const existing = await db.collection<UserDocument>("users").findOne({ email: VIAJERO_EMAIL });

  if (existing) {
    console.log(`=> Viajero ya existe: ${VIAJERO_EMAIL}`);
    return existing._id;
  }

  const password_hash = await bcrypt.hash(VIAJERO_PASSWORD, 10);
  const now = new Date();

  const result = await db.collection("users").insertOne({
    name: "María Viajera",
    email: VIAJERO_EMAIL,
    password_hash,
    role: "viajero",
    travel_profile: {
      primary_interests: ["caribe", "gastronomia", "playa"],
      secondary_interests: ["historia", "naturaleza"],
      budget_range: "medio",
      travel_pace: "relajado",
      group_type: "pareja",
      onboarding_completed: true,
    },
    visited_places: [],
    saved_itineraries: [],
    created_at: now,
    last_login: now,
  });

  console.log(`=> Viajero creado: ${VIAJERO_EMAIL} / ${VIAJERO_PASSWORD}`);
  return result.insertedId;
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

async function seedEvents(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  const collection = db.collection("events");
  const seedNames = eventsSeed.map((event) => event.name);
  const existingCount = await collection.countDocuments({ name: { $in: seedNames } });

  if (existingCount >= eventsSeed.length) {
    console.log(`=> Eventos ya existen (${existingCount}). Saltando seed.`);
    return;
  }

  await collection.deleteMany({ name: { $in: seedNames } });
  const result = await collection.insertMany(eventsSeed);

  console.log(`=> ${result.insertedCount} eventos insertados`);
}

function buildSlot(
  template: {
    place_name?: string;
    activity: string;
    price?: number;
    price_type: "real" | "estimado";
    notes?: string;
  },
  placesByName: Map<string, PlaceDocument>,
): ItinerarySlot {
  const slot: ItinerarySlot = {
    activity: template.activity,
    price_type: template.price_type,
    notes: template.notes,
  };

  if (template.price !== undefined) {
    slot.price = template.price;
  }

  if (template.place_name) {
    const place = placesByName.get(template.place_name);
    if (!place) {
      throw new Error(`Lugar no encontrado para itinerario: ${template.place_name}`);
    }
    slot.place_id = place._id;
    slot.coordinates = place.coordinates;
  }

  return slot;
}

function calculateBudgets(days: ItineraryDay[]): {
  total_budget_real: number;
  total_budget_estimated: number;
} {
  let total_budget_real = 0;
  let total_budget_estimated = 0;

  for (const day of days) {
    for (const slot of [day.morning, day.afternoon, day.night]) {
      if (slot.price === undefined) continue;
      if (slot.price_type === "real") {
        total_budget_real += slot.price;
      } else {
        total_budget_estimated += slot.price;
      }
    }
  }

  return { total_budget_real, total_budget_estimated };
}

async function seedItineraries(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  const collection = db.collection("itineraries");
  const seedTitles = itinerariesSeed.map((itinerary) => itinerary.title);
  const existingCount = await collection.countDocuments({ title: { $in: seedTitles } });

  if (existingCount >= itinerariesSeed.length) {
    console.log(`=> Itinerarios ya existen (${existingCount}). Saltando seed.`);
    return;
  }

  const places = await db.collection<PlaceDocument>("places").find({ region: "caribe" }).toArray();
  if (places.length === 0) {
    console.log("=> Sin lugares en BD — saltando seed de itinerarios");
    return;
  }

  const placesByName = new Map(places.map((place) => [place.name, place]));
  await collection.deleteMany({ title: { $in: seedTitles } });

  const viajero = await db.collection<UserDocument>("users").findOne({ email: VIAJERO_EMAIL });
  if (!viajero) {
    console.log("=> Viajero no encontrado — saltando seed de itinerarios");
    return;
  }

  const now = new Date();
  const itineraryIds: ObjectId[] = [];

  for (const template of itinerariesSeed) {
    const days: ItineraryDay[] = template.days.map((day) => ({
      day_number: day.day_number,
      title: day.title,
      morning: buildSlot(day.morning, placesByName),
      afternoon: buildSlot(day.afternoon, placesByName),
      night: buildSlot(day.night, placesByName),
    }));

    const budgets = calculateBudgets(days);
    const places_used = [
      ...new Set(
        days
          .flatMap((day) => [day.morning, day.afternoon, day.night])
          .map((slot) => slot.place_id)
          .filter((id): id is ObjectId => id !== undefined),
      ),
    ];

    const result = await collection.insertOne({
      user_id: viajero._id,
      title: template.title,
      days,
      ...budgets,
      generated_at: now,
      places_used,
    });

    itineraryIds.push(result.insertedId);
  }

  await db.collection<UserDocument>("users").updateOne(
    { _id: viajero._id },
    { $set: { saved_itineraries: itineraryIds } },
  );

  console.log(`=> ${itineraryIds.length} itinerarios insertados para ${VIAJERO_EMAIL}`);
}

async function main(): Promise<void> {
  await connectDb();
  const db = await getDb();

  await seedAdmin(db);
  await seedViajero(db);
  await seedPlaces(db);
  await seedEvents(db);
  await seedItineraries(db);

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
