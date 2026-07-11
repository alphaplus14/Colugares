import { ObjectId } from "mongodb";

export type UserRole = "admin" | "empleado" | "viajero";

export type BudgetRange = "bajo" | "medio" | "alto";
export type TravelPace = "intenso" | "relajado";
export type GroupType = "solo" | "pareja" | "familia" | "amigos";

export interface TravelProfile {
  primary_interests: string[];
  secondary_interests: string[];
  budget_range: BudgetRange;
  travel_pace: TravelPace;
  group_type: GroupType;
  onboarding_completed: boolean;
}

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password_hash?: string;
  role: UserRole;
  travel_profile?: TravelProfile;
  visited_places: ObjectId[];
  saved_itineraries: ObjectId[];
  /** false = cuenta desactivada (no puede iniciar sesión) */
  active?: boolean;
  created_at: Date;
  last_login: Date;
}

/** Documento de usuario tal como se persiste en MongoDB */
export type UserDocument = User;

/** Usuario serializado para Auth.js (sin campos sensibles) */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
