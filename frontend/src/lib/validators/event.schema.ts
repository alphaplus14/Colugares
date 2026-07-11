import { z } from "zod";

const colombiaRegionSchema = z.enum([
  "caribe",
  "andina",
  "pacifico",
  "amazonia",
  "llanos",
  "eje_cafetero",
]);

const eventFieldsSchema = z.object({
  name: z.string().trim().min(3, "Nombre muy corto").max(120),
  region: colombiaRegionSchema,
  city: z.string().trim().min(2).max(80),
  start_date: z.string().min(1, "Fecha de inicio requerida"),
  end_date: z.string().min(1, "Fecha de fin requerida"),
  description: z
    .string()
    .trim()
    .min(20, "Descripción mínimo 20 caracteres")
    .max(2000),
  tags: z.array(z.string().trim().min(1)).default([]),
  active: z.boolean().default(true),
});

/** Crear festividad desde el CMS */
export const eventFormSchema = eventFieldsSchema.refine(
  (data) => new Date(data.end_date) >= new Date(data.start_date),
  {
    message: "La fecha de fin debe ser posterior o igual al inicio",
    path: ["end_date"],
  },
);

export type EventFormInput = z.infer<typeof eventFormSchema>;

/** Actualización parcial (sin refine de fechas si solo cambia un campo) */
export const updateEventSchema = eventFieldsSchema.partial();
