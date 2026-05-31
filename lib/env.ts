import { getDeploymentAppUrl } from "@/lib/urls";

export const env = {
  appUrl: getDeploymentAppUrl(),
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  supabaseSecretKey: process.env.SUPABASE_SECRET_KEY ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
  aiRateLimitMaxRequests: Number(
    process.env.AI_RATE_LIMIT_MAX_REQUESTS ?? "10",
  ),
  aiRateLimitWindowSeconds: Number(
    process.env.AI_RATE_LIMIT_WINDOW_SECONDS ?? "3600",
  ),
  paymobApiKey: process.env.PAYMOB_API_KEY ?? "",
  paymobBaseUrl: process.env.PAYMOB_BASE_URL ?? "https://accept.paymob.com",
  paymobHmacSecret: process.env.PAYMOB_HMAC_SECRET ?? "",
  paymobPublicKey: process.env.PAYMOB_PUBLIC_KEY ?? "",
  paymobSecretKey: process.env.PAYMOB_SECRET_KEY ?? "",
  paymobCardIntegrationId: process.env.PAYMOB_CARD_INTEGRATION_ID ?? "",
  paymobWalletIntegrationId: process.env.PAYMOB_WALLET_INTEGRATION_ID ?? "",
  paymobApplePayIntegrationId:
    process.env.PAYMOB_APPLE_PAY_INTEGRATION_ID ?? "",
} as const;

export function assertPublicSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
}

export function assertSupabaseSecretEnv() {
  if (!env.supabaseUrl || !env.supabaseSecretKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY.");
  }
}

export function assertOpenAiEnv() {
  if (!env.openaiApiKey) {
    throw new Error("Missing OPENAI_API_KEY.");
  }
}

export function assertPaymobEnv() {
  if (!env.paymobSecretKey || !env.paymobPublicKey || !env.paymobHmacSecret) {
    throw new Error(
      "Missing PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, or PAYMOB_HMAC_SECRET.",
    );
  }
}
