import type { BillingPlanId, UsageMetric, UsageRecord } from "@/types/billing";
import { canUseFeature, isUsageAllowed } from "@/lib/payments/feature-access";

export function assertFeatureAccess(
  planId: BillingPlanId,
  usage: UsageRecord[],
  metric: UsageMetric,
) {
  if (!canUseFeature(planId, metric) || !isUsageAllowed(usage, metric)) {
    throw new Error(`Current plan does not allow more ${metric}.`);
  }
}
