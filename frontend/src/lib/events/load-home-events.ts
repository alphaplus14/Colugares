import { getUpcomingEvents } from "@/lib/events/repository";
import { getDb } from "@/lib/mongodb";
import type { EventListItem } from "@/types/event.types";

/** Carga eventos para la home (server component) */
export async function loadHomeEvents(limit = 6): Promise<EventListItem[]> {
  const db = await getDb();
  return getUpcomingEvents(db, limit);
}
