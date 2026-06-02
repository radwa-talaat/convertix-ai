import { billingPlans, egpToCents, getBillingPlan } from "@/lib/payments";
import type {
  BillingDashboardSnapshot,
  BillingSubscription,
  InvoiceRecord,
  PaymentRecord,
  UsageRecord,
} from "@/types/billing";

export function getBillingDashboardSnapshot(): BillingDashboardSnapshot {
  const currentPlan = getBillingPlan("free");
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const subscription: BillingSubscription = {
    cancelAtPeriodEnd: false,
    currentPeriodEnd: periodEnd.toISOString(),
    currentPeriodStart: now.toISOString(),
    id: "subscription-demo-free",
    planId: "free",
    status: "free",
    trialEndsAt: null,
    userId: "demo-user",
  };
  const usage: UsageRecord[] = [
    {
      limit: currentPlan.limits.landingPages,
      metric: "landing_pages",
      periodEnd: periodEnd.toISOString(),
      periodStart: now.toISOString(),
      used: 1,
    },
    {
      limit: currentPlan.limits.aiCredits,
      metric: "ai_credits",
      periodEnd: periodEnd.toISOString(),
      periodStart: now.toISOString(),
      used: 8,
    },
    {
      limit: currentPlan.limits.customDomains,
      metric: "custom_domains",
      periodEnd: periodEnd.toISOString(),
      periodStart: now.toISOString(),
      used: 0,
    },
  ];
  const invoices: InvoiceRecord[] = billingPlans
    .filter((plan) => plan.priceEgp > 0)
    .slice(0, 1)
    .map((plan) => ({
      amountCents: egpToCents(plan.priceEgp),
      currency: "EGP",
      dueAt: null,
      id: "invoice-demo-1",
      paidAt: null,
      planId: plan.id,
      status: "open",
    }));
  const payments: PaymentRecord[] = [];

  return {
    currentPlan,
    invoices,
    payments,
    subscription,
    usage,
  };
}
