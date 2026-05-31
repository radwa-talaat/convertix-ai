import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.")
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or less.");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  next: z.string().startsWith("/").optional().default("/dashboard"),
});

export const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
