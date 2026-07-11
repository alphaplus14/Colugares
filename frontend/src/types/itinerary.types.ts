import { ObjectId } from "mongodb";

import type { BudgetTier, PlacePrice, PlaceType } from "@/types/place.types";

/** Franja horaria de un día del itinerario */
export type ItinerarySlotPeriod = "mañana" | "tarde" | "noche";

export interface ItinerarySlot {
  period: ItinerarySlotPeriod;
  place_id?: string;
  place_name: string;
  activity: string;
  price_label?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  slots: ItinerarySlot[];
}

export interface ItineraryDocument {
  _id: ObjectId;
  user_id: ObjectId;
  title: string;
  region: string;
  days: ItineraryDay[];
  places_used: ObjectId[];
  geography_warnings: string[];
  raw_content: string;
  created_at: Date;
  updated_at: Date;
}

/** Catálogo de places para matching, mapa y tarjetas hover */
export interface PlaceCatalogEntry {
  _id: string;
  name: string;
  type: PlaceType;
  city: string;
  region: string;
  description: string;
  tags: string[];
  budget_tier: BudgetTier;
  price_real?: PlacePrice;
  photos: string[];
  coordinates: { lat: number; lng: number };
}

/** Marcador numerado para Mapbox */
export interface ItineraryMapMarker {
  order: number;
  place_id?: string;
  name: string;
  lat: number;
  lng: number;
  day_number: number;
  period: ItinerarySlotPeriod;
  activity: string;
}

/** Itinerario serializado para respuestas API */
export interface ItineraryResponse {
  _id: string;
  title: string;
  region: string;
  days: Array<{
    day_number: number;
    title: string;
    slots: Array<{
      period: ItinerarySlotPeriod;
      place_id?: string;
      place_name: string;
      activity: string;
      price_label?: string;
      coordinates?: { lat: number; lng: number };
    }>;
  }>;
  places_used: string[];
  geography_warnings: string[];
  markers: ItineraryMapMarker[];
  created_at: string;
  updated_at: string;
}

export interface ItineraryListItem {
  _id: string;
  title: string;
  region: string;
  days_count: number;
  created_at: string;
}
