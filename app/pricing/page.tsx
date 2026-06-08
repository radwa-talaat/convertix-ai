import { headers } from "next/headers";

import { PricingGrid } from "@/components/billing";
import { Container } from "@/components/layout/container";
import { getServerTranslator } from "@/lib/i18n/server";
import { detectCurrencyFromCountry } from "@/lib/payments";
import { getCurrentUser } from "@/lib/supabase/auth";

export default async function PricingPage() {
  const t = await getServerTranslator("billing");
  const user = await getCurrentUser();
  const country = headers().get("x-vercel-ip-country");
  const initialCurrency = detectCurrencyFromCountry(country);

  return (
    <main className="min-h-screen bg-background py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("pricing")}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">
            {t("headline")}
          </h1>
          <p className="mt-4 text-muted-foreground">{t("description")}</p>
        </div>
        <div className="mt-10">
          <PricingGrid
            initialCurrency={initialCurrency}
            isAuthenticated={Boolean(user)}
          />
        </div>
      </Container>
    </main>
  );
}
