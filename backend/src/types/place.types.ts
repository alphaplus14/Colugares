import { ObjectId } from "mongodb";

export type PlaceType =
  | "hotel"
  | "restaurante"
  | "actividad"
  | "atractivo"
  | "agencia";

export type ColombiaRegion =
  | "caribe"
  | "andina"
  | "pacifico"
  | "amazonia"
  | "llanos"
  | "eje_cafetero";

export type BudgetTier = "bajo" | "medio" | "alto";

export type PriceUnit = "noche" | "persona" | "grupo" | "dia";

export interface PlacePrice {
  amount: number;
  unit: PriceUnit;
  currency: "COP";
  season_note?: string;
}

export interface PlaceCoordinates {
  lat: number;
  lng: number;
}

export interface PlaceContact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Place {
  _id: ObjectId;
  name: string;
  type: PlaceType;
  region: ColombiaRegion;
  department: string;
  city: string;
  description: string;
  tags: string[];
  budget_tier: BudgetTier;
  price_real?: PlacePrice;
  coordinates: PlaceCoordinates;
  photos: string[];
  contact: PlaceContact;
  recommended_transport: string[];
  vector_embedding?: number[];
  embedding_status: "pending" | "ready" | "failed";
  is_subscriber: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type PlaceDocument = Place;

export type CreatePlaceInput = Omit<
  Place,
  "_id" | "vector_embedding" | "embedding_status" | "created_at" | "updated_at"
>;

export interface PlacePublicResponse {
  _id: string;
  name: string;
  type: PlaceDocument["type"];
  region: PlaceDocument["region"];
  department: string;
  city: string;
  description: string;
  tags: string[];
  budget_tier: PlaceDocument["budget_tier"];
  price_real?: PlaceDocument["price_real"];
  coordinates: PlaceDocument["coordinates"];
  photos: string[];
  contact: PlaceDocument["contact"];
  recommended_transport: string[];
  embedding_status: PlaceDocument["embedding_status"];
  is_subscriber: boolean;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
