import { BillingHistory } from "@/components/billing/billing-history";
import { CurrentPlanCard } from "@/components/billing/current-plan-card";
import { PricingGrid } from "@/components/billing/pricing-grid";
import { UsageStatistics } from "@/components/billing/usage-statistics";
import type {
  BillingCurrency,
  BillingDashboardSnapshot,
} from "@/types/billing";

export function BillingDashboard({
  initialCurrency,
  snapshot,
}: {
  initialCurrency?: BillingCurrency;
  snapshot: BillingDashboardSnapshot;
}) {
  return (
    <div className="space-y-6">
      <CurrentPlanCard
        currency={initialCurrency}
        plan={snapshot.currentPlan}
        subscription={snapshot.subscription}
      />
      <PricingGrid initialCurrency={initialCurrency} />
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <UsageStatistics usage={snapshot.usage} />
        <BillingHistory
          invoices={snapshot.invoices}
          payments={snapshot.payments}
        />
      </div>
    </div>
  );
}
