import { env } from "@/lib/env";
import { paymobRequest } from "@/lib/paymob";
import { egpToCents, getPaymentIntegrationIds } from "@/lib/payments";
import { createAppUrl } from "@/lib/urls";
import type {
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
  billingData,
  merchantOrderId,
  plan,
  userId,
}: {
  billingData: PaymobBillingData;
  merchantOrderId: string;
  plan: BillingPlan;
  userId: string;
}): Promise<CheckoutSession> {
  const amountCents = egpToCents(plan.priceEgp);
  const callbackUrl = createAppUrl("/billing/success", env.appUrl);
  const notificationUrl = createAppUrl("/api/paymob/webhook", env.appUrl);
  const integrationIds = getPaymentIntegrationIds();

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
        currency: "EGP",
        extras: {
          plan_id: plan.id,
          user_id: userId,
        },
        items: [
          {
            amount: amountCents,
            description: `${plan.name} monthly subscription`,
            name: `${plan.name} Plan`,
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
