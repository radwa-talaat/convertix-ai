import { env } from "@/lib/env";
import { paymobRequest } from "@/lib/paymob";
import { getPaymentIntegrationIds } from "@/lib/payments";
import { createAppUrl } from "@/lib/urls";
import type {
  BillingCurrency,
  BillingPlan,
  CheckoutSession,
  PaymobBillingData,
} from "@/types/billing";

type PaymobIntentionResponse = {
  client_secret: string;
  id: string;
  payment_keys?: Array<{ integration: number; key: string }>;
};

export async function createPaymobIntention({
  amountCents,
  billingData,
  currency,
  landingPageQuantity,
  merchantOrderId,
  plan,
  userId,
}: {
  amountCents: number;
  billingData: PaymobBillingData;
  currency: BillingCurrency;
  landingPageQuantity: number;
  merchantOrderId: string;
  plan: BillingPlan;
  userId: string;
}): Promise<CheckoutSession> {
  const callbackUrl = createAppUrl("/billing/success", env.appUrl);
  const notificationUrl = createAppUrl("/api/paymob/webhook", env.appUrl);
  const integrationIds = getPaymentIntegrationIds();

  if (integrationIds.length === 0) {
    throw new Error(
      "Paymob checkout is not ready. Add PAYMOB_CARD_INTEGRATION_ID from Paymob Payment Devices.",
    );
  }

  const itemDescription = `${landingPageQuantity} AI landing page package`;

  const response = await paymobRequest<PaymobIntentionResponse>(
    "/v1/intention/",
    {
      body: {
        amount: amountCents,
        billing_data: {
          apartment: billingData.apartment ?? "NA",
          building: billingData.building ?? "NA",
          city: billingData.city,
          country: billingData.country,
          email: billingData.email,
          first_name: billingData.firstName,
          floor: billingData.floor ?? "NA",
          last_name: billingData.lastName,
          phone_number: billingData.phoneNumber,
          state: billingData.state,
          street: billingData.street,
        },
        currency,
        extras: {
          landing_page_quantity: landingPageQuantity,
          plan_id: plan.id,
          user_id: userId,
        },
        items: [
          {
            amount: amountCents,
            description: itemDescription,
            name: `${plan.name} Package`,
            quantity: 1,
          },
        ],
        notification_url: notificationUrl,
        payment_methods: integrationIds,
        redirection_url: callbackUrl,
        special_reference: merchantOrderId,
      },
      method: "POST",
    },
  );

  return {
    clientSecret: response.client_secret,
    expiresAt: null,
    intentionId: response.id,
    paymentUrl: `${env.paymobBaseUrl}/unifiedcheckout/?publicKey=${env.paymobPublicKey}&clientSecret=${response.client_secret}`,
  };
}
