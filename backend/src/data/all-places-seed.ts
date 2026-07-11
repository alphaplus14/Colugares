import { andinaSeedPlaces } from "./andina-seed";
import { amazoniaSeedPlaces } from "./amazonia-seed";
import { caribeSeedPlaces } from "./caribe-seed";
import { ejeCafeteroSeedPlaces } from "./eje-cafetero-seed";
import { llanosSeedPlaces } from "./llanos-seed";
import { pacificoSeedPlaces } from "./pacifico-seed";
import type { CreatePlaceSchema } from "../validators/place.schema";

/** Catálogo completo de lugares suscritos — las 6 regiones de Colombia */
export const allPlacesSeed: CreatePlaceSchema[] = [
  ...caribeSeedPlaces,
  ...andinaSeedPlaces,
  ...ejeCafeteroSeedPlaces,
  ...pacificoSeedPlaces,
  ...amazoniaSeedPlaces,
  ...llanosSeedPlaces,
];

/** Conteo por región — útil para logs del script de seed */
export const placesSeedStats = {
  caribe: caribeSeedPlaces.length,
  andina: andinaSeedPlaces.length,
  eje_cafetero: ejeCafeteroSeedPlaces.length,
  pacifico: pacificoSeedPlaces.length,
  amazonia: amazoniaSeedPlaces.length,
  llanos: llanosSeedPlaces.length,
  total: allPlacesSeed.length,
} as const;
