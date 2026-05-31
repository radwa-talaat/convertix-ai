import { BillingDashboard } from "@/components/billing";
import { PageHeader } from "@/components/dashboard/page-header";
import { getBillingDashboardSnapshot } from "@/services/subscriptions";

export default function BillingPage() {
  const snapshot = getBillingDashboardSnapshot();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <PageHeader
        description="Manage Paymob subscriptions, Egyptian local payments, usage limits, invoices, and plan upgrades."
        eyebrow="Account"
        title="Billing"
      />
      <BillingDashboard snapshot={snapshot} />
    </div>
  );
}
