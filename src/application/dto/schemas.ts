/**
 * Contratos de entrada de la capa de aplicación.
 * Los formularios del admin y las rutas de API validan contra estos esquemas,
 * de modo que el dominio nunca recibe datos sin sanear.
 */

import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .optional();

export const projectSchema = z.object({
  title: z.string().trim().min(2, "El título es obligatorio"),
  slug: z.string().trim().optional(),
  location: z.string().trim().min(2, "La ubicación es obligatoria"),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Año no válido")
    .max(2100, "Año no válido"),
  size: optionalText,
  client: optionalText,
  collaborators: optionalText,
  status: z
    .enum(["DELIVERED", "IN_OPERATION", "FOR_SALE", "IN_PROGRESS"])
    .default("DELIVERED"),
  state: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().default(0),
  excerpt: optionalText,
  description: optionalText,
  coverImage: z.string().trim().min(1, "La imagen de portada es obligatoria"),
  coverPosition: z.enum(["center", "top", "bottom"]).default("center"),
  categoryId: optionalText,
  images: z
    .array(
      z.object({
        url: z.string().trim().min(1),
        caption: optionalText,
        alt: optionalText,
        order: z.coerce.number().int().default(0),
      }),
    )
    .optional(),
});

export type ProjectFormInput = z.input<typeof projectSchema>;
export type ProjectFormOutput = z.output<typeof projectSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio"),
  slug: z.string().trim().optional(),
  description: optionalText,
  order: z.coerce.number().int().default(0),
  parentId: optionalText,
});




export const contactSchema = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre"),
  email: z.string().trim().email("Escribe un correo válido"),
  phone: optionalText,
  subject: optionalText,
  message: z.string().trim().min(10, "Cuéntanos un poco más sobre tu proyecto"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Correo no válido"),
  password: z.string().min(1, "Escribe tu contraseña"),
});

export type ContactInput = z.output<typeof contactSchema>;
export type LoginInput = z.output<typeof loginSchema>;
