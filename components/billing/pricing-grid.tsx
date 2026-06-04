"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { PlanCard } from "@/components/billing/plan-card";
import {
  billingPlans,
  currencyOptions,
  defaultBillingCurrency,
  detectCurrencyFromLocale,
} from "@/lib/payments";
import type { BillingCurrency, BillingPlanId } from "@/types/billing";

export function PricingGrid({
  currentPlanId,
  initialCurrency,
}: {
  currentPlanId?: BillingPlanId;
  initialCurrency?: BillingCurrency;
}) {
  const t = useTranslations("billing");
  const [currency, setCurrency] = React.useState<BillingCurrency>(
    initialCurrency ?? defaultBillingCurrency,
  );

  React.useEffect(() => {
    if (initialCurrency) {
      return;
    }

    const detected = detectCurrencyFromLocale(window.navigator.language);
    setCurrency(detected);
  }, [initialCurrency]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-background p-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold">{t("localCurrency")}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("localCurrencyDescription")}
          </p>
        </div>
        <select
          className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event) =>
            setCurrency(event.target.value as BillingCurrency)
          }
          value={currency}
        >
          {currencyOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.code} - {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {billingPlans.map((plan) => (
          <PlanCard
            currency={currency}
            current={plan.id !== "free" && plan.id === currentPlanId}
            key={plan.id}
            plan={plan}
          />
        ))}
      </div>
    </div>
  );
}
