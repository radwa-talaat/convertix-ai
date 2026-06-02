import { PlanCard } from "@/components/billing/plan-card";
import { billingPlans } from "@/lib/payments";
import type { BillingPlanId } from "@/types/billing";

export function PricingGrid({
  currentPlanId,
}: {
  currentPlanId?: BillingPlanId;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {billingPlans.map((plan) => (
        <PlanCard
          current={plan.id === currentPlanId}
          key={plan.id}
          plan={plan}
        />
      ))}
    </div>
  );
}
