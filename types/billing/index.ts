export type BillingPlanId = "free" | "pro" | "agency";

export type BillingInterval = "month";

export type PaymentProvider = "paymob";

export type BillingCurrency = "USD" | "EGP" | "SAR" | "AED" | "EUR" | "GBP";

export type BillingPaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "voided";

export type BillingInvoiceStatus =
  | "draft"
  | "open"
  | "paid"
  | "void"
  | "failed";

export type UsageMetric =
  | "landing_pages"
  | "ai_credits"
  | "custom_domains"
  | "team_members";

export type BillingPlanLimits = {
  aiCredits: number;
  customDomains: number;
  landingPages: number;
  premiumTemplates: boolean;
  teamMembers: number;
  watermark: boolean;
  whiteLabel: boolean;
};

export type BillingPlan = {
  cta: string;
  description: string;
  features: string[];
  id: BillingPlanId;
  interval: BillingInterval;
  limits: BillingPlanLimits;
  name: string;
  paymobIntegrationIdEnv: string;
  priceUsd: number;
  trialDays: number;
};

export type SubscriptionState =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "expired"
  | "free";

export type BillingSubscription = {
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd: string | null;
  currentPeriodStart: string | null;
  id: string;
  planId: BillingPlanId;
  status: SubscriptionState;
  trialEndsAt: string | null;
  userId: string;
};

export type PaymentRecord = {
  amountCents: number;
  currency: BillingCurrency;
  id: string;
  invoiceId: string | null;
  paymobIntentionId: string | null;
  paymobOrderId: string | null;
  paymobTransactionId: string | null;
  planId: BillingPlanId;
  status: BillingPaymentStatus;
};

export type InvoiceRecord = {
  amountCents: number;
  currency: BillingCurrency;
  dueAt: string | null;
  id: string;
  paidAt: string | null;
  planId: BillingPlanId;
  status: BillingInvoiceStatus;
};

export type UsageRecord = {
  limit: number;
  metric: UsageMetric;
  periodEnd: string;
  periodStart: string;
  used: number;
};

export type BillingDashboardSnapshot = {
  currentPlan: BillingPlan;
  invoices: InvoiceRecord[];
  payments: PaymentRecord[];
  subscription: BillingSubscription;
  usage: UsageRecord[];
};

export type PaymobBillingData = {
  apartment?: string;
  building?: string;
  city: string;
  country: string;
  email: string;
  firstName: string;
  floor?: string;
  lastName: string;
  phoneNumber: string;
  state: string;
  street: string;
};

export type CreateCheckoutInput = {
  billingData: PaymobBillingData;
  currency?: BillingCurrency;
  landingPageQuantity?: number;
  planId: BillingPlanId;
};

export type CheckoutSession = {
  clientSecret: string;
  expiresAt: string | null;
  intentionId: string;
  paymentUrl: string;
};

export type PaymobWebhookEvent = {
  amountCents: number;
  currency: string;
  hmac: string | null;
  intentionId: string | null;
  isSuccess: boolean;
  orderId: string | null;
  raw: Record<string, unknown>;
  transactionId: string | null;
};
