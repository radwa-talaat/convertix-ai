import { CreditCard, ShieldCheck } from "lucide-react";

import { SubscriptionStatusBadge } from "@/components/billing/subscription-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/lib/payments";
import type {
  BillingCurrency,
  BillingPlan,
  BillingSubscription,
} from "@/types/billing";

export function CurrentPlanCard({
  currency = "USD",
  plan,
  subscription,
}: {
  currency?: BillingCurrency;
  plan: BillingPlan;
  subscription: BillingSubscription;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Current plan</CardTitle>
        <CreditCard className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-3xl font-semibold">{plan.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.priceUsd === 0
                ? "No active paid subscription"
                : `${formatMoney(plan.priceUsd, currency)}${
                    plan.id === "free" ? " per landing page" : " per month"
                  }`}
            </p>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
        <div className="mt-6 flex items-center gap-2 rounded-md border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
          <ShieldCheck className="size-4" />
          Payments are processed by Paymob with server-side webhook validation.
        </div>
      </CardContent>
    </Card>
  );
}
