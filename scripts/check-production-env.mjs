import { config } from "dotenv";
import { z } from "zod";

config({ path: ".env.local" });
config({ path: ".env" });

const optionalNonEmptyString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

const envSchema = z
  .object({
    AI_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(10),
    AI_RATE_LIMIT_WINDOW_SECONDS: z.coerce
      .number()
      .int()
      .positive()
      .default(3600),
    NEXT_PUBLIC_APP_URL: optionalUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_MODEL: z.string().min(1).default("gpt-4.1-mini"),
    PAYMOB_HMAC_SECRET: z.string().min(1),
    PAYMOB_PUBLIC_KEY: z.string().min(1),
    PAYMOB_SECRET_KEY: z.string().min(1),
    SUPABASE_SECRET_KEY: z.string().min(1),
    VERCEL_BRANCH_URL: optionalNonEmptyString,
    VERCEL_PROJECT_PRODUCTION_URL: optionalNonEmptyString,
    VERCEL_URL: optionalNonEmptyString,
  })
  .refine(
    (env) =>
      Boolean(
        env.NEXT_PUBLIC_APP_URL ??
        env.VERCEL_PROJECT_PRODUCTION_URL ??
        env.VERCEL_BRANCH_URL ??
        env.VERCEL_URL,
      ),
    {
      message:
        "Set NEXT_PUBLIC_APP_URL locally or rely on VERCEL_URL/VERCEL_PROJECT_PRODUCTION_URL in Vercel.",
      path: ["NEXT_PUBLIC_APP_URL"],
    },
  );

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Production environment validation failed.");
  console.error(result.error.flatten().fieldErrors);
  process.exit(1);
}

console.log("Production environment validation passed.");
