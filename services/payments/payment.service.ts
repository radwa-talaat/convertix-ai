import { revalidatePath } from "next/cache";

import { env } from "@/lib/env";
import { verifyPaymobHmac } from "@/lib/paymob";
import { parsePaymobWebhook } from "@/lib/paymob/webhook";
import {
  calculateCheckoutAmount,
  defaultBillingCurrency,
  getBillingPlan,
  isBillingCurrency,
} from "@/lib/payments";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import { createPaymobIntention } from "@/services/paymob";
import type { Json } from "@/types/database";
import type { CheckoutSession, CreateCheckoutInput } from "@/types/billing";

export async function createCheckoutSession(
  supabase: SupabaseDatabaseClient,
  userId: string,
  input: CreateCheckoutInput,
): Promise<CheckoutSession> {
  const plan = getBillingPlan(input.planId);
  const currency = isBillingCurrency(input.currency)
    ? input.currency
    : defaultBillingCurrency;
  const landingPageQuantity = plan.limits.landingPages;

  if (plan.priceUsd <= 0) {
    throw new Error("This plan does not require checkout.");
  }

  const amountCents = calculateCheckoutAmount({
    currency,
    planPriceUsd: plan.priceUsd,
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
      landing_page_quantity: landingPageQuantity,
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
  let checkout: CheckoutSession;

  try {
    checkout = await createPaymobIntention({
      amountCents,
      billingData: input.billingData,
      currency,
      landingPageQuantity,
      merchantOrderId,
      plan,
      userId,
    });
  } catch (error) {
    await supabase
      .from("invoices")
      .update({ status: "failed" })
      .eq("id", invoice.id);

    throw error;
  }

  const { error: paymentError } = await supabase.from("payments").insert({
    amount_cents: amountCents,
    currency,
    invoice_id: invoice.id,
    landing_page_quantity: landingPageQuantity,
    plan: plan.id,
    provider: "paymob",
    provider_intention_id: checkout.intentionId,
    provider_order_id: checkout.orderId ?? null,
    provider_transaction_id: checkout.transactionId ?? null,
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

  let paymentQuery = supabase.from("payments").select("*");

  if (event.intentionId) {
    paymentQuery = paymentQuery.eq("provider_intention_id", event.intentionId);
  } else if (event.transactionId) {
    paymentQuery = paymentQuery.eq(
      "provider_transaction_id",
      event.transactionId,
    );
  } else if (event.orderId) {
    paymentQuery = paymentQuery.eq("provider_order_id", event.orderId);
  } else {
    throw new Error("Paymob webhook is missing payment identifiers.");
  }

  const { data: payment, error: paymentLookupError } =
    await paymentQuery.maybeSingle();

  if (paymentLookupError || !payment) {
    throw new Error(paymentLookupError?.message ?? "Payment not found.");
  }

  if (payment.status === "paid" && !event.isSuccess) {
    return payment;
  }

  if (
    event.isSuccess &&
    (event.amountCents !== payment.amount_cents ||
      event.currency.toUpperCase() !== payment.currency.toUpperCase())
  ) {
    throw new Error("Paymob payment amount or currency does not match.");
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
    const { error: creditError } = await supabase.rpc(
      "grant_landing_page_credits",
      {
        credit_quantity: payment.landing_page_quantity,
        target_payment_id: payment.id,
        target_user_id: payment.user_id,
      },
    );

    if (creditError) {
      throw new Error(
        `Landing page credit grant failed: ${creditError.message}`,
      );
    }
  }

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard/projects");

  return updatedPayment;
}
