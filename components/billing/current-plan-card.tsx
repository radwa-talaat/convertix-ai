"use client";

import { CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("billing");

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{t("currentPlan")}</CardTitle>
        <CreditCard className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-3xl font-semibold">{plan.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.priceUsd === 0
                ? t("noActiveSubscription")
                : `${formatMoney(plan.priceUsd, currency)}${
                    plan.id === "free"
                      ? ` ${t("perLandingPage")}`
                      : ` ${t("perMonth")}`
                  }`}
            </p>
          </div>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>
      </CardContent>
    </Card>
  );
}
