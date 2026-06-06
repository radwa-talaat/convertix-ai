import { PaymentResult } from "@/components/billing";

export default function BillingSuccessPage() {
  return (
    <PaymentResult
      description="Paymob has returned a successful payment response. Your landing page credits will appear after payment verification completes."
      title="Payment successful"
    />
  );
}
