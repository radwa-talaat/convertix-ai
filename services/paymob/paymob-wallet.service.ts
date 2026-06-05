import { assertPaymobWalletEnv, env } from "@/lib/env";
import type {
  BillingCurrency,
  CheckoutSession,
  PaymobBillingData,
} from "@/types/billing";

type AuthResponse = { token: string };
type OrderResponse = { id: number };
type PaymentKeyResponse = { token: string };
type WalletPaymentResponse = {
  id: number;
  order: number | { id?: number };
  redirect_url?: string;
};

export async function createPaymobWalletPayment({
  amountCents,
  billingData,
  currency,
  merchantOrderId,
}: {
  amountCents: number;
  billingData: PaymobBillingData;
  currency: BillingCurrency;
  merchantOrderId: string;
}): Promise<CheckoutSession> {
  assertPaymobWalletEnv();

  if (currency !== "EGP") {
    throw new Error("Mobile wallet payments are currently available in EGP.");
  }

  const auth = await legacyPaymobRequest<AuthResponse>("/api/auth/tokens", {
    api_key: env.paymobApiKey,
  });
  const order = await legacyPaymobRequest<OrderResponse>(
    "/api/ecommerce/orders",
    {
      amount_cents: amountCents,
      auth_token: auth.token,
      currency,
      delivery_needed: false,
      items: [],
      merchant_order_id: merchantOrderId,
    },
  );
  const paymentKey = await legacyPaymobRequest<PaymentKeyResponse>(
    "/api/acceptance/payment_keys",
    {
      amount_cents: amountCents,
      auth_token: auth.token,
      billing_data: {
        apartment: billingData.apartment ?? "NA",
        building: billingData.building ?? "NA",
        city: billingData.city,
        country: billingData.country,
        email: billingData.email,
        first_name: billingData.firstName,
        floor: billingData.floor ?? "NA",
        last_name: billingData.lastName,
        phone_number: normalizeEgyptianPhone(billingData.phoneNumber),
        shipping_method: "NA",
        state: billingData.state,
        street: billingData.street,
      },
      currency,
      expiration: 3600,
      integration_id: Number(env.paymobWalletIntegrationId),
      order_id: order.id,
    },
  );
  const payment = await legacyPaymobRequest<WalletPaymentResponse>(
    "/api/acceptance/payments/pay",
    {
      payment_token: paymentKey.token,
      source: {
        identifier: normalizeEgyptianPhone(billingData.phoneNumber),
        subtype: "WALLET",
      },
    },
  );

  if (!payment.redirect_url) {
    throw new Error("Paymob wallet did not return a verification page.");
  }

  return {
    clientSecret: "",
    expiresAt: null,
    intentionId: `wallet_${payment.id}`,
    orderId:
      typeof payment.order === "object"
        ? String(payment.order.id ?? order.id)
        : String(payment.order ?? order.id),
    paymentUrl: payment.redirect_url,
    transactionId: String(payment.id),
  };
}

async function legacyPaymobRequest<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${env.paymobBaseUrl}${path}`, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const text = (await response.text()).trim();

  if (!response.ok) {
    throw new Error(
      `Paymob wallet request failed (${response.status}): ${text || response.statusText}`,
    );
  }

  return JSON.parse(text) as T;
}

function normalizeEgyptianPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.startsWith("20") && digits.length === 12) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("01") && digits.length === 11) {
    return digits;
  }

  throw new Error("Enter a valid Egyptian mobile wallet number.");
}
