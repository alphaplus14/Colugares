import type {
  ItineraryDay,
  ItineraryMapMarker,
  ItinerarySlot,
  ItinerarySlotPeriod,
  PlaceCatalogEntry,
} from "@/types/itinerary.types";

const PERIODS: ItinerarySlotPeriod[] = ["mañana", "tarde", "noche"];

/** Acepta **Día 1 — Título** o Día 1 - Título */
const DAY_HEADER_REGEX =
  /(?:\*\*)?\s*D[ií]a\s+(\d+)\s*[—–:\-]\s*([^\n*]+?)(?:\*\*)?/gi;

/** Actividades genéricas: no deben generar marcador ni match falso */
const GENERIC_ACTIVITY_REGEX =
  /\b(tiempo libre|explorar (la |el )?(ciudad|pueblo|zona)|relajarse|por definir|sin plan|desayuno en el hotel|noche libre|tarde libre|mañana libre|cena (en )?(un )?restaurante local|almuerzo libre)\b/i;

function normalizeText(value: string): string {
  return value
    .replace(/\*\*/g, "")
    .replace(/[_`]/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * Matching estricto: el nombre del lugar debe aparecer completo en la actividad.
 * Evita falsos positivos por substrings cortos o genéricos.
 */
function matchPlace(
  activityText: string,
  catalog: PlaceCatalogEntry[],
): PlaceCatalogEntry | undefined {
  const normalizedActivity = normalizeText(activityText);
  if (!normalizedActivity || GENERIC_ACTIVITY_REGEX.test(activityText)) {
    return undefined;
  }

  const sorted = [...catalog].sort(
    (a, b) => b.name.length - a.name.length,
  );

  for (const place of sorted) {
    const normalizedName = normalizeText(place.name);
    // Nombres muy cortos (< 5) son peligrosos (ej. "Agua", "Café")
    if (normalizedName.length < 5) {
      continue;
    }
    if (!normalizedActivity.includes(normalizedName)) {
      continue;
    }

    // Exigir límite de palabra aproximado: no matchear fragmento dentro de otra palabra
    const escaped = normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const boundary = new RegExp(
      `(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`,
      "i",
    );
    if (boundary.test(normalizedActivity)) {
      return place;
    }
  }

  return undefined;
}

function extractPriceLabel(activityText: string): string | undefined {
  const priceMatch = activityText.match(/[—–-]\s*([^—–\n]+)$/);
  return priceMatch?.[1]?.trim();
}

function buildSlot(
  period: ItinerarySlotPeriod,
  rawActivity: string,
  catalog: PlaceCatalogEntry[],
): ItinerarySlot {
  const matched = matchPlace(rawActivity, catalog);
  const priceLabel = extractPriceLabel(rawActivity);
  const placeName =
    matched?.name ??
    rawActivity.split(/[—–-]/)[0]?.trim() ??
    rawActivity;

  return {
    period,
    place_id: matched?._id,
    place_name: placeName,
    activity: rawActivity.trim(),
    price_label: priceLabel,
    coordinates: matched?.coordinates,
  };
}

function parseSlotLine(
  line: string,
  catalog: PlaceCatalogEntry[],
): ItinerarySlot | null {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  for (const period of PERIODS) {
    const patterns = [
      new RegExp(`🌅\\s*${period}:\\s*(.+)`, "i"),
      new RegExp(`☀️\\s*${period}:\\s*(.+)`, "i"),
      new RegExp(`🌙\\s*${period}:\\s*(.+)`, "i"),
      new RegExp(`^${period}:\\s*(.+)`, "i"),
    ];

    if (period === "tarde") {
      patterns.unshift(/☀\s*Tarde:\s*(.+)/i);
    }

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match?.[1]) {
        return buildSlot(period, match[1], catalog);
      }
    }
  }

  return null;
}

function parseDayBlock(
  dayNumber: number,
  title: string,
  block: string,
  catalog: PlaceCatalogEntry[],
): ItineraryDay {
  const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
  const slots: ItinerarySlot[] = [];

  for (const line of lines) {
    const slot = parseSlotLine(line, catalog);
    if (slot) {
      slots.push(slot);
    }
  }

  return {
    day_number: dayNumber,
    title: title.trim(),
    slots,
  };
}

/** Fallback: un marcador por lugar mencionado (solo si no hay días parseados) */
function extractMarkersByMention(
  content: string,
  catalog: PlaceCatalogEntry[],
): ItineraryMapMarker[] {
  const normalizedContent = normalizeText(content);
  const mentioned: PlaceCatalogEntry[] = [];

  const sorted = [...catalog].sort((a, b) => b.name.length - a.name.length);

  for (const place of sorted) {
    const normalizedName = normalizeText(place.name);
    if (normalizedName.length < 5) {
      continue;
    }
    if (normalizedContent.includes(normalizedName)) {
      if (!mentioned.some((item) => item._id === place._id)) {
        mentioned.push(place);
      }
    }
  }

  // Limitar a 8 para no saturar el mapa en fallback
  return mentioned.slice(0, 8).map((place, index) => ({
    order: index + 1,
    place_id: place._id,
    name: place.name,
    lat: place.coordinates.lat,
    lng: place.coordinates.lng,
    day_number: index + 1,
    period: "mañana" as const,
    activity: place.name,
  }));
}

export interface ParsedItinerary {
  title: string;
  region: string;
  days: ItineraryDay[];
  markers: ItineraryMapMarker[];
}

export function parseItineraryFromMarkdown(
  content: string,
  catalog: PlaceCatalogEntry[],
  defaultRegion = "caribe",
): ParsedItinerary {
  const days: ItineraryDay[] = [];
  const dayMatches = [...content.matchAll(DAY_HEADER_REGEX)];

  if (dayMatches.length > 0) {
    for (let i = 0; i < dayMatches.length; i += 1) {
      const match = dayMatches[i];
      if (!match) continue;

      const dayNumber = Number.parseInt(match[1] ?? "1", 10);
      const dayTitle = match[2] ?? `Día ${dayNumber}`;
      const startIndex = (match.index ?? 0) + match[0].length;
      const endIndex = dayMatches[i + 1]?.index ?? content.length;
      const block = content.slice(startIndex, endIndex);

      days.push(parseDayBlock(dayNumber, dayTitle, block, catalog));
    }
  }

  const firstTitle = days[0]?.title ?? "Mi viaje por Colombia";
  const regionFromCatalog =
    catalog.find((place) =>
      normalizeText(firstTitle).includes(normalizeText(place.city)),
    )?.region ?? defaultRegion;

  let markers = buildMapMarkers(days);

  // Si Colu no siguió el formato exacto, matchear por nombres en el texto
  if (markers.length === 0) {
    markers = extractMarkersByMention(content, catalog);
  }

  return {
    title: firstTitle,
    region: regionFromCatalog,
    days,
    markers,
  };
}

/**
 * Un marcador por día = el número del pin coincide con "Día N".
 * Usa el primer lugar del catálogo encontrado en mañana → tarde → noche.
 * Así 4 días → máximo 4 pines; el pin 2 = actividad principal del Día 2.
 */
export function buildMapMarkers(days: ItineraryDay[]): ItineraryMapMarker[] {
  const periodOrder: Record<ItinerarySlotPeriod, number> = {
    mañana: 0,
    tarde: 1,
    noche: 2,
  };

  const markers: ItineraryMapMarker[] = [];
  const sortedDays = [...days].sort((a, b) => a.day_number - b.day_number);

  for (const day of sortedDays) {
    const sortedSlots = [...day.slots].sort(
      (a, b) => periodOrder[a.period] - periodOrder[b.period],
    );

    const primary = sortedSlots.find(
      (slot) =>
        Boolean(slot.coordinates) &&
        Boolean(slot.place_id) &&
        !GENERIC_ACTIVITY_REGEX.test(slot.activity),
    );

    if (!primary?.coordinates) {
      continue;
    }

    markers.push({
      // El número visible en el mapa = número del día del itinerario
      order: day.day_number,
      place_id: primary.place_id,
      name: primary.place_name,
      lat: primary.coordinates.lat,
      lng: primary.coordinates.lng,
      day_number: day.day_number,
      period: primary.period,
      activity: primary.activity,
    });
  }

  return markers;
}

export function previewItineraryFromContent(
  content: string,
  catalog: PlaceCatalogEntry[],
  defaultRegion?: string,
): ParsedItinerary {
  return parseItineraryFromMarkdown(content, catalog, defaultRegion);
}
