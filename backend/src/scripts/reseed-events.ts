import dotenv from "dotenv";
import { connectDb, getDb } from "../config/mongodb";
import { eventsSeed } from "../data/events-seed";

dotenv.config();

/** Reemplaza la colección events con el seed actualizado (Fase 5) */
async function main(): Promise<void> {
  await connectDb();
  const db = await getDb();

  await db.collection("events").deleteMany({});
  await db.collection("events").insertMany(eventsSeed.map((event) => ({ ...event })));

  console.log(`=> ${eventsSeed.length} eventos reinsertados`);
  process.exit(0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Reseed events falló: ${message}`);
  process.exit(1);
});
