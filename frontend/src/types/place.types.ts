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
export type EmbeddingStatus = "pending" | "ready" | "failed";

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
  _id: string;
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
  embedding_status: EmbeddingStatus;
  is_subscriber: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlacesListResponse {
  status: string;
  count: number;
  data: Place[];
}

export interface PlaceFormData {
  name: string;
  type: PlaceType;
  region: ColombiaRegion;
  department: string;
  city: string;
  description: string;
  tags: string;
  budget_tier: BudgetTier;
  price_amount: string;
  price_unit: PriceUnit;
  price_season_note: string;
  lat: string;
  lng: string;
  photos: string;
  phone: string;
  email: string;
  website: string;
  recommended_transport: string;
  is_subscriber: boolean;
  active: boolean;
}

export const PLACE_TYPE_LABELS: Record<PlaceType, string> = {
  hotel: "Hotel",
  restaurante: "Restaurante",
  actividad: "Actividad",
  atractivo: "Atractivo",
  agencia: "Agencia",
};

export const REGION_LABELS: Record<ColombiaRegion, string> = {
  caribe: "Caribe",
  andina: "Andina",
  pacifico: "Pacífico",
  amazonia: "Amazonía",
  llanos: "Llanos",
  eje_cafetero: "Eje Cafetero",
};

export const EMBEDDING_STATUS_LABELS: Record<EmbeddingStatus, string> = {
  pending: "Indexando...",
  ready: "Indexado",
  failed: "Error",
};
