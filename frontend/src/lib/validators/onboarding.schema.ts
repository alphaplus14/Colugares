import { z } from "zod";

const colombiaRegionSchema = z.enum([
  "caribe",
  "andina",
  "pacifico",
  "amazonia",
  "llanos",
  "eje_cafetero",
]);

/** Quiz de onboarding — 4 preguntas que definen el perfil RAG del viajero */
export const onboardingSchema = z.object({
  primary_interests: z
    .array(colombiaRegionSchema)
    .min(1, "Selecciona al menos una región principal"),
  secondary_interests: z.array(colombiaRegionSchema).default([]),
  budget_range: z.enum(["bajo", "medio", "alto"]),
  group_type: z.enum(["solo", "pareja", "familia", "amigos"]),
  travel_pace: z.enum(["intenso", "relajado"]),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
