import { env, assertPaymobWalletEnv } from "@/lib/env";
import type {
  BillingCurrency,
  BillingPlan,
  CheckoutSession,
  PaymobBillingData,
} from "@/types/billing";

type PaymobAuthResponse = {
  token: string;
};

type PaymobOrderResponse = {
  id: number;
};

type PaymobPaymentKeyResponse = {
  token: string;
};

type PaymobWalletPaymentResponse = {
  id?: number;
  pending?: boolean;
  redirect_url?: string;
  success?: boolean;
  iframe_redirection_url?: string;
  data?: {
    redirect_url?: string;
  };
};

export async function createPaymobWalletPayment({
  amountCents,
  billingData,
  currency,
  landingPageQuantity,
  merchantOrderId,
  plan,
  walletPhoneNumber,
}: {
  amountCents: number;
  billingData: PaymobBillingData;
  currency: BillingCurrency;
  landingPageQuantity: number;
  merchantOrderId: string;
  plan: BillingPlan;
  walletPhoneNumber: string;
}): Promise<CheckoutSession> {
  assertPaymobWalletEnv();

  if (currency !== "EGP") {
    throw new Error("Mobile wallet payments are currently available in EGP.");
  }

  const integrationId = Number(env.paymobWalletIntegrationId);

  if (!Number.isSafeInteger(integrationId) || integrationId <= 0) {
    throw new Error("PAYMOB_WALLET_INTEGRATION_ID must be a valid number.");
  }

  const auth = await legacyPaymobRequest<PaymobAuthResponse>(
    "/api/auth/tokens",
    {
      api_key: env.paymobApiKey,
    },
  );

  const order = await legacyPaymobRequest<PaymobOrderResponse>(
    "/api/ecommerce/orders",
    {
      amount_cents: amountCents,
      auth_token: auth.token,
      currency,
      delivery_needed: false,
      items: [
        {
          amount_cents: amountCents,
          description: `${landingPageQuantity} AI landing page package`,
          name: `${plan.name} Package`,
          quantity: 1,
        },
      ],
      merchant_order_id: merchantOrderId,
    },
  );

  const paymentKey = await legacyPaymobRequest<PaymobPaymentKeyResponse>(
    "/api/acceptance/payment_keys",
    {
      amount_cents: amountCents,
      auth_token: auth.token,
      billing_data: toLegacyBillingData(billingData, walletPhoneNumber),
      currency,
      expiration: 3600,
      integration_id: integrationId,
      order_id: order.id,
    },
  );

  const walletPayment = await legacyPaymobRequest<PaymobWalletPaymentResponse>(
    "/api/acceptance/payments/pay",
    {
      payment_token: paymentKey.token,
      source: {
        identifier: normalizeEgyptWalletIdentifier(walletPhoneNumber),
        subtype: "WALLET",
      },
    },
  );
  const paymentUrl =
    walletPayment.redirect_url ??
    walletPayment.iframe_redirection_url ??
    walletPayment.data?.redirect_url ??
    "";

  if (!paymentUrl) {
    throw new Error(
      "Paymob wallet did not return a verification page. Check that the wallet number is registered.",
    );
  }

  return {
    clientSecret: paymentKey.token,
    expiresAt: null,
    intentionId: `wallet:${order.id}`,
    orderId: String(order.id),
    paymentUrl,
    transactionId: walletPayment.id ? String(walletPayment.id) : null,
  };
}

async function legacyPaymobRequest<TResponse>(
  path: string,
  body: Record<string, unknown>,
): Promise<TResponse> {
  const response = await fetch(`${env.paymobBaseUrl}${path}`, {
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const text = (await response.text()).trim();

  if (!response.ok) {
    throw new Error(
      `Paymob wallet request failed (${response.status}): ${
        text || response.statusText
      }`,
    );
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    throw new Error("Paymob wallet returned an invalid JSON response.");
  }
}

function toLegacyBillingData(
  billingData: PaymobBillingData,
  walletPhoneNumber: string,
) {
  return {
    apartment: billingData.apartment ?? "NA",
    building: billingData.building ?? "NA",
    city: billingData.city,
    country: billingData.country,
    email: billingData.email,
    first_name: billingData.firstName,
    floor: billingData.floor ?? "NA",
    last_name: billingData.lastName,
    phone_number: normalizeEgyptPhoneInternational(walletPhoneNumber),
    postal_code: "NA",
    shipping_method: "NA",
    state: billingData.state,
    street: billingData.street,
  };
}

function normalizeEgyptWalletIdentifier(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("20")) {
    return `0${digits.slice(2)}`;
  }

  if (digits.startsWith("0")) {
    return digits;
  }

  return `0${digits}`;
}

function normalizeEgyptPhoneInternational(value: string) {
  const localNumber = normalizeEgyptWalletIdentifier(value);

  return `+20${localNumber.slice(1)}`;
}
