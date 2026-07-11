import { ObjectId } from "mongodb";
import type {
  BudgetTier,
  ColombiaRegion,
  PlaceContact,
  PlaceCoordinates,
  PlacePrice,
  PlaceType,
} from "@/types/place.types";

/** Documento Place tal como se almacena en MongoDB (consultas RAG) */
export interface PlaceDocument {
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
