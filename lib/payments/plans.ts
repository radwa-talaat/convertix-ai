import { env } from "@/lib/env";
import type { BillingPlan, BillingPlanId } from "@/types/billing";

export const billingPlans: BillingPlan[] = [
  {
    cta: "Start free",
    description: "Validate your first AI landing page with basic limits.",
    features: ["1 landing page", "Basic AI credits", "AI Builder watermark"],
    id: "free",
    interval: "month",
    limits: {
      aiCredits: 25,
      customDomains: 0,
      landingPages: 1,
      premiumTemplates: false,
      teamMembers: 1,
      watermark: true,
      whiteLabel: false,
    },
    name: "Free",
    paymobIntegrationIdEnv: "",
    priceEgp: 0,
    trialDays: 0,
  },
  {
    cta: "Upgrade to Pro",
    description: "For founders and marketers publishing multiple campaigns.",
    features: [
      "Unlimited pages",
      "Premium templates",
      "AI rewrite",
      "Custom domains",
    ],
    id: "pro",
    interval: "month",
    limits: {
      aiCredits: 1000,
      customDomains: 3,
      landingPages: Number.MAX_SAFE_INTEGER,
      premiumTemplates: true,
      teamMembers: 1,
      watermark: false,
      whiteLabel: false,
    },
    name: "Pro",
    paymobIntegrationIdEnv: "PAYMOB_CARD_INTEGRATION_ID",
    priceEgp: 499,
    trialDays: 7,
  },
  {
    cta: "Upgrade to Agency",
    description: "For studios managing client launches and multiple domains.",
    features: [
      "Team feature entitlement",
      "White label",
      "Advanced AI credits",
      "Multiple domains",
    ],
    id: "agency",
    interval: "month",
    limits: {
      aiCredits: 5000,
      customDomains: 25,
      landingPages: Number.MAX_SAFE_INTEGER,
      premiumTemplates: true,
      teamMembers: 10,
      watermark: false,
      whiteLabel: true,
    },
    name: "Agency",
    paymobIntegrationIdEnv: "PAYMOB_CARD_INTEGRATION_ID",
    priceEgp: 1499,
    trialDays: 7,
  },
];

export function getBillingPlan(planId: BillingPlanId): BillingPlan {
  const plan = billingPlans.find((item) => item.id === planId);

  if (!plan) {
    throw new Error(`Unknown billing plan: ${planId}`);
  }

  return plan;
}

export function getPaymentIntegrationIds() {
  return [
    env.paymobCardIntegrationId,
    env.paymobWalletIntegrationId,
    env.paymobApplePayIntegrationId,
  ].filter(Boolean);
}
