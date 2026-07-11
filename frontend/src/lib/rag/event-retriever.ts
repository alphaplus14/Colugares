import type { Db } from "mongodb";
import {
  formatEventDateRange,
  retrieveRelevantEvents,
} from "@/lib/events/repository";
import { extractTripDateRange } from "@/lib/rag/date-extractor";
import type { EventDocument } from "@/types/event.types";
import type { ColombiaRegion } from "@/types/place.types";

interface RetrieveEventsInput {
  userMessage: string;
  regions: ColombiaRegion[];
}

/** Busca festividades que coincidan con fechas y regiones del viajero */
export async function retrieveEventsForMessage(
  db: Db,
  input: RetrieveEventsInput,
): Promise<EventDocument[]> {
  const dateRange = extractTripDateRange(input.userMessage);

  return retrieveRelevantEvents(db, {
    regions: input.regions,
    dateRange: dateRange ?? undefined,
    limit: 5,
  });
}

/** Formatea eventos para inyectar en el contexto RAG del LLM */
export function formatEventsForContext(events: EventDocument[]): string[] {
  return events.map((event, index) => {
    const dates = formatEventDateRange(event.start_date, event.end_date);
    return [
      `${index + 1}. **${event.name}** (${event.city}, región ${event.region})`,
      `   Fechas: ${dates}`,
      `   Descripción: ${event.description}`,
      `   Tags: ${event.tags.join(", ")}`,
    ].join("\n");
  });
}
