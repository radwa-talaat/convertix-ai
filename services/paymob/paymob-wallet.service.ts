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
  detail?: string;
  error_occured?: boolean;
  id?: number;
  iframe_redirection_url?: string;
  message?: string;
  pending?: boolean;
  redirectUrl?: string;
  redirect_url?: string;
  redirection_url?: string;
  success?: boolean;
  data?: {
    message?: string;
    redirectUrl?: string;
    redirect_url?: string;
    redirection_url?: string;
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

  const walletIdentifiers = getEgyptWalletIdentifierVariants(walletPhoneNumber);
  let walletPayment: PaymobWalletPaymentResponse | null = null;
  let paymentUrl = "";
  let lastWalletMessage = "";

  for (const identifier of walletIdentifiers) {
    walletPayment = await legacyPaymobRequest<PaymobWalletPaymentResponse>(
      "/api/acceptance/payments/pay",
      {
        payment_token: paymentKey.token,
        source: {
          identifier,
          subtype: "WALLET",
        },
      },
    );
    paymentUrl = extractPaymobWalletUrl(walletPayment);

    if (paymentUrl) {
      break;
    }

    lastWalletMessage = extractPaymobWalletMessage(walletPayment);
  }

  if (!paymentUrl) {
    throw new Error(
      lastWalletMessage ||
        "Paymob wallet did not return a verification page. Check that the wallet number is registered.",
    );
  }

  return {
    clientSecret: paymentKey.token,
    expiresAt: null,
    intentionId: `wallet:${order.id}`,
    orderId: String(order.id),
    paymentUrl,
    transactionId: walletPayment?.id ? String(walletPayment.id) : null,
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

function getEgyptWalletIdentifierVariants(value: string) {
  const localNumber = normalizeEgyptWalletIdentifier(value);
  const countryNumber = `20${localNumber.slice(1)}`;

  return Array.from(new Set([localNumber, countryNumber, `+${countryNumber}`]));
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

function extractPaymobWalletUrl(response: PaymobWalletPaymentResponse) {
  return (
    response.redirect_url ??
    response.redirection_url ??
    response.redirectUrl ??
    response.iframe_redirection_url ??
    response.data?.redirect_url ??
    response.data?.redirection_url ??
    response.data?.redirectUrl ??
    ""
  );
}

function extractPaymobWalletMessage(response: PaymobWalletPaymentResponse) {
  return (
    response.data?.message ??
    response.message ??
    response.detail ??
    ""
  ).trim();
}
