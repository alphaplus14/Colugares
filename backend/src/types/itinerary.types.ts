import { ObjectId } from "mongodb";

export interface ItinerarySlot {
  place_id?: ObjectId;
  activity: string;
  price?: number;
  price_type: "real" | "estimado";
  notes?: string;
  coordinates?: { lat: number; lng: number };
}

export interface ItineraryDay {
  day_number: number;
  title: string;
  morning: ItinerarySlot;
  afternoon: ItinerarySlot;
  night: ItinerarySlot;
}

export interface Itinerary {
  _id: ObjectId;
  user_id: ObjectId;
  title: string;
  days: ItineraryDay[];
  total_budget_real: number;
  total_budget_estimated: number;
  generated_at: Date;
  places_used: ObjectId[];
}

export type ItineraryDocument = Itinerary;
