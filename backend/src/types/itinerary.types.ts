import { ObjectId } from "mongodb";

/** Franja horaria — alineado con el schema del frontend */
export type ItinerarySlotPeriod = "mañana" | "tarde" | "noche";

export interface ItinerarySlot {
  period: ItinerarySlotPeriod;
  place_id?: ObjectId;
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

/** Documento de itinerario en MongoDB — compatible con frontend */
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
