import { headers } from "next/headers";

import { BillingDashboard } from "@/components/billing";
import { PageHeader } from "@/components/dashboard/page-header";
import { detectCurrencyFromCountry } from "@/lib/payments";
import { getBillingDashboardSnapshot } from "@/services/subscriptions";

export default function BillingPage() {
  const snapshot = getBillingDashboardSnapshot();
  const country = headers().get("x-vercel-ip-country");
  const initialCurrency = detectCurrencyFromCountry(country);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description="Manage Paymob subscriptions, Egyptian local payments, usage limits, invoices, and plan upgrades."
        eyebrow="Account"
        title="Billing"
      />
      <BillingDashboard initialCurrency={initialCurrency} snapshot={snapshot} />
    </div>
  );
}
