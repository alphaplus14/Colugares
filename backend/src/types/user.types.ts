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
  created_at: Date;
  last_login: Date;
}

export type UserDocument = User;

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
