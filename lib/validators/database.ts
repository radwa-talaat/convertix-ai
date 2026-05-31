import { z } from "zod";

export const uuidSchema = z.string().uuid();

export const projectInsertSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(500).nullable().optional(),
});

export const pageInsertSchema = z.object({
  projectId: uuidSchema,
  title: z.string().trim().min(2).max(140),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const domainInsertSchema = z.object({
  projectId: uuidSchema,
  hostname: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^(?!:\/\/)([a-z0-9-]+\.)+[a-z]{2,}$/),
});
