import { PaymentResult } from "@/components/billing";

export default function BillingSuccessPage() {
  return (
    <PaymentResult
      description="Paymob has returned a successful payment response. Your subscription will be activated after the secure webhook verification completes."
      title="Payment successful"
    />
  );
}
