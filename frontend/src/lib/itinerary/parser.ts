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

function normalizeText(value: string): string {
  return value
    .replace(/\*\*/g, "")
    .replace(/[_`]/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function matchPlace(
  activityText: string,
  catalog: PlaceCatalogEntry[],
): PlaceCatalogEntry | undefined {
  const normalizedActivity = normalizeText(activityText);

  const sorted = [...catalog].sort(
    (a, b) => b.name.length - a.name.length,
  );

  for (const place of sorted) {
    const normalizedName = normalizeText(place.name);
    if (normalizedActivity.includes(normalizedName)) {
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

  return {
    period,
    place_id: matched?._id,
    place_name: matched?.name ?? rawActivity.split(/[—–-]/)[0]?.trim() ?? rawActivity,
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

/** Fallback: busca nombres de places mencionados en el texto completo */
function extractMarkersByMention(
  content: string,
  catalog: PlaceCatalogEntry[],
): ItineraryMapMarker[] {
  const normalizedContent = normalizeText(content);
  const mentioned: PlaceCatalogEntry[] = [];

  const sorted = [...catalog].sort((a, b) => b.name.length - a.name.length);

  for (const place of sorted) {
    if (normalizedContent.includes(normalizeText(place.name))) {
      if (!mentioned.some((item) => item._id === place._id)) {
        mentioned.push(place);
      }
    }
  }

  return mentioned.map((place, index) => ({
    order: index + 1,
    place_id: place._id,
    name: place.name,
    lat: place.coordinates.lat,
    lng: place.coordinates.lng,
    day_number: 1,
    period: "mañana",
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

export function buildMapMarkers(days: ItineraryDay[]): ItineraryMapMarker[] {
  const periodOrder: Record<ItinerarySlotPeriod, number> = {
    mañana: 0,
    tarde: 1,
    noche: 2,
  };

  const markers: ItineraryMapMarker[] = [];
  let order = 1;

  const sortedDays = [...days].sort((a, b) => a.day_number - b.day_number);

  for (const day of sortedDays) {
    const sortedSlots = [...day.slots].sort(
      (a, b) => periodOrder[a.period] - periodOrder[b.period],
    );

    for (const slot of sortedSlots) {
      if (!slot.coordinates) {
        continue;
      }

      markers.push({
        order,
        place_id: slot.place_id,
        name: slot.place_name,
        lat: slot.coordinates.lat,
        lng: slot.coordinates.lng,
        day_number: day.day_number,
        period: slot.period,
        activity: slot.activity,
      });
      order += 1;
    }
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
