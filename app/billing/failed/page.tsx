import { PaymentResult } from "@/components/billing";

export default function BillingFailedPage() {
  return (
    <PaymentResult
      description="The payment was not completed. No landing page credits were added, and you can safely retry from the billing dashboard."
      title="Payment failed"
    />
  );
}
