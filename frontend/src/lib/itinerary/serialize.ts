import { ObjectId } from "mongodb";
import type {
  ItineraryDocument,
  ItineraryMapMarker,
  ItineraryResponse,
} from "@/types/itinerary.types";
import { buildMapMarkers } from "@/lib/itinerary/parser";

/** Serializa itinerario de MongoDB para respuestas JSON */
export function serializeItinerary(doc: ItineraryDocument): ItineraryResponse {
  const days = doc.days.map((day) => ({
    day_number: day.day_number,
    title: day.title,
    slots: day.slots.map((slot) => ({
      period: slot.period,
      place_id: slot.place_id?.toString(),
      place_name: slot.place_name,
      activity: slot.activity,
      price_label: slot.price_label,
      coordinates: slot.coordinates,
    })),
  }));

  const markers: ItineraryMapMarker[] = buildMapMarkers(doc.days);

  return {
    _id: doc._id.toString(),
    title: doc.title,
    region: doc.region,
    days,
    places_used: doc.places_used.map((id) => id.toString()),
    geography_warnings: doc.geography_warnings,
    markers,
    created_at: doc.created_at.toISOString(),
    updated_at: doc.updated_at.toISOString(),
  };
}

/** Convierte place_id string opcional a ObjectId para persistencia */
export function toObjectId(value: string | undefined): ObjectId | undefined {
  if (!value || !ObjectId.isValid(value)) {
    return undefined;
  }
  return new ObjectId(value);
}
