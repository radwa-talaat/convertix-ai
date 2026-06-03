import { revalidatePath } from "next/cache";

import { env } from "@/lib/env";
import { verifyPaymobHmac } from "@/lib/paymob";
import { parsePaymobWebhook } from "@/lib/paymob/webhook";
import {
  calculateCheckoutAmount,
  defaultBillingCurrency,
  getBillingPlan,
  isBillingCurrency,
  normalizeLandingPageQuantity,
} from "@/lib/payments";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import { createPaymobIntention } from "@/services/paymob";
import { activateSubscriptionPlan } from "@/services/subscriptions";
import type { Json } from "@/types/database";
import type {
  BillingPlanId,
  CheckoutSession,
  CreateCheckoutInput,
} from "@/types/billing";

export async function createCheckoutSession(
  supabase: SupabaseDatabaseClient,
  userId: string,
  input: CreateCheckoutInput,
): Promise<CheckoutSession> {
  const plan = getBillingPlan(input.planId);
  const currency = isBillingCurrency(input.currency)
    ? input.currency
    : defaultBillingCurrency;
  const landingPageQuantity =
    plan.id === "free"
      ? normalizeLandingPageQuantity(input.landingPageQuantity)
      : 1;

  if (plan.priceUsd <= 0) {
    throw new Error("This plan does not require checkout.");
  }

  const amountCents = calculateCheckoutAmount({
    currency,
    planPriceUsd: plan.priceUsd,
    quantity: landingPageQuantity,
  });
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      amount_cents: amountCents,
      currency,
      plan: plan.id,
      status: "open",
      subscription_id: subscription?.id ?? null,
      user_id: userId,
    })
    .select("*")
    .single();

  if (invoiceError || !invoice) {
    throw new Error(invoiceError?.message ?? "Invoice creation failed.");
  }

  const merchantOrderId = `sub_${userId}_${invoice.id}`;
  const checkout = await createPaymobIntention({
    amountCents,
    billingData: input.billingData,
    currency,
    landingPageQuantity,
    merchantOrderId,
    plan,
    userId,
  });

  const { error: paymentError } = await supabase.from("payments").insert({
    amount_cents: amountCents,
    currency,
    invoice_id: invoice.id,
    plan: plan.id,
    provider: "paymob",
    provider_intention_id: checkout.intentionId,
    status: "pending",
    subscription_id: subscription?.id ?? null,
    user_id: userId,
  });

  if (paymentError) {
    throw new Error(paymentError.message);
  }

  return checkout;
}

export async function handlePaymobWebhook(
  supabase: SupabaseDatabaseClient,
  payload: Record<string, unknown>,
  hmac: string | null,
) {
  if (!verifyPaymobHmac(payload, hmac, env.paymobHmacSecret)) {
    throw new Error("Invalid Paymob webhook signature.");
  }

  const event = parsePaymobWebhook(payload, hmac);

  if (!event.intentionId) {
    throw new Error("Paymob webhook is missing intention id.");
  }

  const { data: payment, error: paymentLookupError } = await supabase
    .from("payments")
    .select("*")
    .eq("provider_intention_id", event.intentionId)
    .maybeSingle();

  if (paymentLookupError || !payment) {
    throw new Error(paymentLookupError?.message ?? "Payment not found.");
  }

  const nextStatus = event.isSuccess ? "paid" : "failed";

  const { data: updatedPayment, error: updatePaymentError } = await supabase
    .from("payments")
    .update({
      provider_order_id: event.orderId,
      provider_transaction_id: event.transactionId,
      raw_payload: payload as Json,
      status: nextStatus,
    })
    .eq("id", payment.id)
    .select("*")
    .single();

  if (updatePaymentError || !updatedPayment) {
    throw new Error(updatePaymentError?.message ?? "Payment update failed.");
  }

  if (payment.invoice_id) {
    await supabase
      .from("invoices")
      .update({
        paid_at: event.isSuccess ? new Date().toISOString() : null,
        payment_id: payment.id,
        status: event.isSuccess ? "paid" : "failed",
      })
      .eq("id", payment.invoice_id);
  }

  if (event.isSuccess) {
    await activateSubscriptionPlan(
      supabase,
      payment.user_id,
      payment.plan as BillingPlanId,
    );
  }

  revalidatePath("/dashboard/billing");

  return updatedPayment;
}
