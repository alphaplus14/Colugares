import { z } from "zod";

/** Actualización admin de un itinerario guardado */
export const adminItineraryUpdateSchema = z.object({
  title: z.string().trim().min(3).max(160).optional(),
  region: z.string().trim().min(2).max(80).optional(),
  raw_content: z.string().trim().min(20).optional(),
});

export type AdminItineraryUpdateInput = z.infer<typeof adminItineraryUpdateSchema>;
