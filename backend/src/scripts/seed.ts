import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { connectDb, getDb } from "../config/mongodb";
import { allPlacesSeed, placesSeedStats } from "../data/all-places-seed";
import { eventsSeed } from "../data/events-seed";
import { itinerariesSeed } from "../data/itineraries-seed";
import { scheduleEmbeddingJob } from "../services/embeddingJob";
import type {
  ItineraryDay,
  ItinerarySlot,
  ItinerarySlotPeriod,
} from "../types/itinerary.types";
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
      primary_interests: ["caribe"],
      secondary_interests: ["andina"],
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

async function seedEvents(db: Awaited<ReturnType<typeof getDb>>): Promise<void> {
  const collection = db.collection("events");
  const seedNames = eventsSeed.map((event) => event.name);
  const existingCount = await collection.countDocuments({ name: { $in: seedNames } });

  if (existingCount >= eventsSeed.length) {
    console.log(`=> Eventos ya existen (${existingCount}). Saltando seed.`);
    return;
  }

  await collection.deleteMany({ name: { $in: seedNames } });
  await collection.insertMany(eventsSeed.map((event) => ({ ...event })));

  console.log(`=> ${eventsSeed.length} eventos insertados`);
}

interface SlotTemplate {
  place_name?: string;
  activity: string;
  price?: number;
  price_type: "real" | "estimado";
  notes?: string;
}

function formatPriceLabel(price: number, priceType: "real" | "estimado"): string {
  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
  return priceType === "estimado" ? `${formatted} (estimado)` : formatted;
}

function buildSlot(
  period: ItinerarySlotPeriod,
  template: SlotTemplate,
  placesByName: Map<string, PlaceDocument>,
): ItinerarySlot {
  const slot: ItinerarySlot = {
    period,
    place_name: template.place_name ?? template.activity,
    activity: template.notes
      ? `${template.activity} — ${template.notes}`
      : template.activity,
    price_label:
      template.price !== undefined && template.price > 0
        ? formatPriceLabel(template.price, template.price_type)
        : undefined,
  };

  if (template.place_name) {
    const place = placesByName.get(template.place_name);
    if (!place) {
      throw new Error(`Lugar no encontrado para itinerario: ${template.place_name}`);
    }
    slot.place_id = place._id;
    slot.place_name = place.name;
    slot.coordinates = place.coordinates;
  }

  return slot;
}

function buildDaySlots(
  day: {
    morning: SlotTemplate;
    afternoon: SlotTemplate;
    night: SlotTemplate;
  },
  placesByName: Map<string, PlaceDocument>,
): ItinerarySlot[] {
  return [
    buildSlot("mañana", day.morning, placesByName),
    buildSlot("tarde", day.afternoon, placesByName),
    buildSlot("noche", day.night, placesByName),
  ];
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
      slots: buildDaySlots(day, placesByName),
    }));

    const places_used = [
      ...new Set(
        days
          .flatMap((day) => day.slots)
          .map((slot) => slot.place_id)
          .filter((id): id is ObjectId => id !== undefined),
      ),
    ];

    const result = await collection.insertOne({
      user_id: viajero._id,
      title: template.title,
      region: "caribe",
      days,
      places_used,
      geography_warnings: [],
      raw_content: `Itinerario seed: ${template.title}`,
      created_at: now,
      updated_at: now,
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
