import { headers } from "next/headers";

import { BillingDashboard } from "@/components/billing";
import { PageHeader } from "@/components/dashboard/page-header";
import { getServerTranslator } from "@/lib/i18n/server";
import { detectCurrencyFromCountry } from "@/lib/payments";
import { getBillingDashboardSnapshot } from "@/services/subscriptions";

export default async function BillingPage() {
  const t = await getServerTranslator("billing");
  const snapshot = getBillingDashboardSnapshot();
  const country = headers().get("x-vercel-ip-country");
  const initialCurrency = detectCurrencyFromCountry(country);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description={t("dashboardDescription")}
        eyebrow={t("account")}
        title={t("pricing")}
      />
      <BillingDashboard initialCurrency={initialCurrency} snapshot={snapshot} />
    </div>
  );
}
