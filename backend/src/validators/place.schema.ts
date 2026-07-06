import { z } from "zod";

const placeTypeEnum = z.enum([
  "hotel",
  "restaurante",
  "actividad",
  "atractivo",
  "agencia",
]);

const regionEnum = z.enum([
  "caribe",
  "andina",
  "pacifico",
  "amazonia",
  "llanos",
  "eje_cafetero",
]);

const budgetTierEnum = z.enum(["bajo", "medio", "alto"]);

const priceUnitEnum = z.enum(["noche", "persona", "grupo", "dia"]);

export const placePriceSchema = z.object({
  amount: z.number().positive("El precio debe ser mayor a 0"),
  unit: priceUnitEnum,
  currency: z.literal("COP"),
  season_note: z.string().max(200).optional(),
});

export const placeCoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const placeContactSchema = z.object({
  phone: z.string().max(30).optional(),
  email: z.string().email("Email de contacto inválido").optional().or(z.literal("")),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const createPlaceSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(120),
  type: placeTypeEnum,
  region: regionEnum,
  department: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  description: z.string().min(20, "Descripción muy corta para vectorizar").max(5000),
  tags: z.array(z.string().min(1).max(40)).min(1, "Al menos un tag"),
  budget_tier: budgetTierEnum,
  price_real: placePriceSchema.optional(),
  coordinates: placeCoordinatesSchema,
  photos: z.array(z.string().url()).default([]),
  contact: placeContactSchema.default({}),
  recommended_transport: z
    .array(z.string().min(1).max(60))
    .min(1, "Indica al menos un medio de transporte"),
  is_subscriber: z.boolean().default(true),
  active: z.boolean().default(true),
});

export const updatePlaceSchema = createPlaceSchema.partial();

export type CreatePlaceSchema = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceSchema = z.infer<typeof updatePlaceSchema>;
