import { z } from "zod";

/** Crear empleado — solo super-admin */
export const createEmployeeSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateUserSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  active: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
