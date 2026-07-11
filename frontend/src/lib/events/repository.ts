import type { Db } from "mongodb";
import type {
  EventDocument,
  EventListItem,
  TripDateRange,
} from "@/types/event.types";
import type { ColombiaRegion } from "@/types/place.types";

const MONTH_LABELS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

function toMonthLabel(date: Date): string {
  return MONTH_LABELS[date.getUTCMonth()] ?? "Próximamente";
}

function serializeEvent(doc: EventDocument): EventListItem {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    region: doc.region,
    city: doc.city,
    start_date: doc.start_date.toISOString(),
    end_date: doc.end_date.toISOString(),
    description: doc.description,
    tags: doc.tags,
    month_label: toMonthLabel(doc.start_date),
  };
}

interface EventQueryOptions {
  regions?: ColombiaRegion[];
  dateRange?: TripDateRange;
  limit?: number;
}

/** Construye filtro de solapamiento de fechas para eventos activos */
function buildEventFilter(options: EventQueryOptions) {
  const now = new Date();
  const defaultEnd = new Date(now);
  defaultEnd.setUTCFullYear(defaultEnd.getUTCFullYear() + 1);

  const rangeStart = options.dateRange?.start ?? now;
  const rangeEnd = options.dateRange?.end ?? defaultEnd;

  const filter: Record<string, unknown> = {
    active: true,
    start_date: { $lte: rangeEnd },
    end_date: { $gte: rangeStart },
  };

  if (options.regions && options.regions.length > 0) {
    filter.region = { $in: options.regions };
  }

  return filter;
}

/** Próximos eventos activos — usado en home y calendario público */
export async function getUpcomingEvents(
  db: Db,
  limit = 6,
): Promise<EventListItem[]> {
  const docs = await db
    .collection<EventDocument>("events")
    .find(buildEventFilter({ limit }))
    .sort({ start_date: 1 })
    .limit(limit)
    .toArray();

  return docs.map(serializeEvent);
}

/** Eventos relevantes para el RAG según regiones del viajero y fechas del mensaje */
export async function retrieveRelevantEvents(
  db: Db,
  options: EventQueryOptions,
): Promise<EventDocument[]> {
  const limit = options.limit ?? 5;

  return db
    .collection<EventDocument>("events")
    .find(buildEventFilter(options))
    .sort({ start_date: 1 })
    .limit(limit)
    .toArray();
}

export function formatEventDateRange(start: Date, end: Date): string {
  const startLabel = start.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  const endLabel = end.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  if (start.toISOString().slice(0, 10) === end.toISOString().slice(0, 10)) {
    return endLabel;
  }

  return `${startLabel} – ${endLabel}`;
}
