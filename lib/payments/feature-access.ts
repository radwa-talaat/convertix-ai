import { getBillingPlan } from "@/lib/payments/plans";
import type { BillingPlanId, UsageMetric, UsageRecord } from "@/types/billing";

export function canUseFeature(planId: BillingPlanId, feature: UsageMetric) {
  const limits = getBillingPlan(planId).limits;

  switch (feature) {
    case "landing_pages":
      return limits.landingPages > 0;
    case "ai_credits":
      return limits.aiCredits > 0;
    case "custom_domains":
      return limits.customDomains > 0;
    case "team_members":
      return limits.teamMembers > 1;
    default:
      return false;
  }
}

export function isUsageAllowed(
  usage: UsageRecord[],
  metric: UsageMetric,
  increment = 1,
) {
  const record = usage.find((item) => item.metric === metric);

  if (!record) {
    return false;
  }

  return record.used + increment <= record.limit;
}
