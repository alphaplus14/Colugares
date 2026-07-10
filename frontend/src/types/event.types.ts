import { ObjectId } from "mongodb";
import type { ColombiaRegion } from "@/types/place.types";

/** Documento de festividad tal como se almacena en MongoDB */
export interface EventDocument {
  _id: ObjectId;
  name: string;
  region: ColombiaRegion;
  city: string;
  start_date: Date;
  end_date: Date;
  description: string;
  tags: string[];
  active: boolean;
}

/** Evento serializado para API pública y home */
export interface EventListItem {
  _id: string;
  name: string;
  region: ColombiaRegion;
  city: string;
  start_date: string;
  end_date: string;
  description: string;
  tags: string[];
  month_label: string;
}

/** Rango de fechas inferido del mensaje del usuario */
export interface TripDateRange {
  start: Date;
  end: Date;
  /** Cómo se obtuvo el rango — útil para logging y ajustes futuros */
  source: "explicit_range" | "month" | "default_upcoming";
}
