import { z } from "zod";

const itinerarySlotPeriodSchema = z.enum(["mañana", "tarde", "noche"]);

const itinerarySlotSchema = z.object({
  period: itinerarySlotPeriodSchema,
  place_id: z.string().optional(),
  place_name: z.string().min(1),
  activity: z.string().min(1),
  price_label: z.string().optional(),
  coordinates: z
    .object({ lat: z.number(), lng: z.number() })
    .optional(),
});

const itineraryDaySchema = z.object({
  day_number: z.number().int().positive(),
  title: z.string().min(1),
  slots: z.array(itinerarySlotSchema),
});

/** Body para guardar itinerario desde el texto de Colu */
export const saveItinerarySchema = z.object({
  title: z.string().min(3).max(120).optional(),
  region: z.string().min(2).max(40).optional(),
  raw_content: z.string().min(20).max(50000),
});

export type SaveItineraryInput = z.infer<typeof saveItinerarySchema>;

export { itineraryDaySchema, itinerarySlotSchema };
