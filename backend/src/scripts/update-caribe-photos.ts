/**
 * Actualiza photos de lugares Caribe con imágenes locales sin reseed completo.
 * Uso: npx tsx src/scripts/update-caribe-photos.ts
 */
import dotenv from "dotenv";
import { connectDb, getDb } from "../config/mongodb";

dotenv.config();

const photoByName: Record<string, string> = {
  "Hotel Boutique Casa San Agustín":
    "/images/lugares/hotel-boutique-casa-san-agustin.jpg",
  "Restaurante La Cevichería":
    "/images/lugares/restaurante-la-cevicheria.jpg",
  "Tour Islas del Rosario": "/images/lugares/islas-del-rosario.jpg",
  "Castillo de San Felipe de Barajas":
    "/images/lugares/castillo-san-felipe.jpg",
  "Hotel Irotama Resort": "/images/lugares/hotel-irotama.jpg",
  "Parque Nacional Natural Tayrona": "/images/lugares/parque-tayrona.jpg",
  "Restaurante Donde Wippy": "/images/lugares/restaurante-donde-wippy.jpg",
  "Johnny Cay Tour": "/images/lugares/johnny-cay-tour.jpg",
  "Hotel Las Américas Resort": "/images/lugares/hotel-las-americas.jpg",
  "Restaurante El Cactus": "/images/lugares/restaurante-el-cactus.jpg",
  "Playa Blanca Barú": "/images/lugares/playa-blanca-baru.jpg",
  "Agencia Caribe Tours": "/images/lugares/agencia-caribe-tours.jpg",
  "Hotel Zuana": "/images/lugares/hotel-zuana.jpg",
  "Restaurante Mistura": "/images/lugares/restaurante-mistura.jpg",
  "Providencia Island Dive Center":
    "/images/lugares/providencia-island.jpg",
  "Hostal Casa en el Aire": "/images/lugares/hostal-casa-en-el-aire.jpg",
  "Kitesurf Cartagena": "/images/lugares/kitesurf-cartagena.jpg",
  "Aviatur Caribe": "/images/lugares/aviatur-caribe.jpg",
  "Volcán de Lodo El Totumo": "/images/lugares/volcan-de-lodo.jpg",
};

async function main(): Promise<void> {
  await connectDb();
  const db = await getDb();
  const collection = db.collection("places");

  let updated = 0;
  let missing = 0;

  for (const [name, photo] of Object.entries(photoByName)) {
    const result = await collection.updateOne(
      { name },
      { $set: { photos: [photo], updated_at: new Date() } },
    );
    if (result.matchedCount === 0) {
      console.log(`✗ No encontrado: ${name}`);
      missing += 1;
    } else {
      console.log(`✓ ${name}`);
      updated += 1;
    }
  }

  console.log(`\n=> Actualizados: ${updated} | No encontrados: ${missing}`);
  process.exit(0);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(message);
  process.exit(1);
});
