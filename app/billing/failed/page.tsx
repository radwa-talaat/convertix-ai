import { PaymentResult } from "@/components/billing";

export default function BillingFailedPage() {
  return (
    <PaymentResult
      description="The payment was not completed. No subscription changes were applied, and you can safely retry from the billing dashboard."
      title="Payment failed"
    />
  );
}
