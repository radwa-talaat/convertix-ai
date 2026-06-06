import { env } from "@/lib/env";
import type { BillingPlan, BillingPlanId } from "@/types/billing";

export const billingPlans: BillingPlan[] = [
  {
    cta: "Buy 1 landing page",
    description: "A complete AI landing page package for a single campaign.",
    features: [
      "1 landing page",
      "Connect 1 custom domain",
      "AI copy generation",
      "Product image upload",
      "Editor access",
    ],
    id: "free",
    interval: "month",
    limits: {
      aiCredits: 75,
      customDomains: 1,
      landingPages: 1,
      premiumTemplates: false,
      teamMembers: 1,
      watermark: false,
      whiteLabel: false,
    },
    name: "Single",
    paymobIntegrationIdEnv: "PAYMOB_CARD_INTEGRATION_ID",
    priceUsd: 2,
    trialDays: 0,
  },
  {
    cta: "Buy 5 landing pages",
    description: "A better-value bundle for multiple products and campaigns.",
    features: [
      "5 landing pages",
      "Connect 1 custom domain per landing page",
      "Premium templates",
      "AI rewrite",
      "Product image upload",
    ],
    id: "pro",
    interval: "month",
    limits: {
      aiCredits: 1000,
      customDomains: 5,
      landingPages: 5,
      premiumTemplates: true,
      teamMembers: 1,
      watermark: false,
      whiteLabel: false,
    },
    name: "Growth",
    paymobIntegrationIdEnv: "PAYMOB_CARD_INTEGRATION_ID",
    priceUsd: 8,
    trialDays: 0,
  },
  {
    cta: "Buy 10 landing pages",
    description:
      "The advanced bundle for teams, agencies, and larger launches.",
    features: [
      "10 landing pages",
      "Connect multiple domains per landing page",
      "Team feature entitlement",
      "Advanced AI credits",
      "Premium templates",
    ],
    id: "agency",
    interval: "month",
    limits: {
      aiCredits: 5000,
      customDomains: 25,
      landingPages: 10,
      premiumTemplates: true,
      teamMembers: 10,
      watermark: false,
      whiteLabel: true,
    },
    name: "Team",
    paymobIntegrationIdEnv: "PAYMOB_CARD_INTEGRATION_ID",
    priceUsd: 15,
    trialDays: 0,
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
  ]
    .filter(Boolean)
    .map(Number)
    .filter(
      (integrationId) =>
        Number.isSafeInteger(integrationId) && integrationId > 0,
    );
}
