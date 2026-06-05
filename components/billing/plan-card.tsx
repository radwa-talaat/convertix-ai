"use client";

import { Check, ExternalLink, Loader2, Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { createCheckoutAction } from "@/app/dashboard/billing/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatMoney, normalizeLandingPageQuantity } from "@/lib/payments";
import type {
  BillingCurrency,
  BillingPlan,
  PaymobBillingData,
} from "@/types/billing";

const defaultBillingData: PaymobBillingData = {
  city: "Cairo",
  country: "EG",
  email: "customer@example.com",
  firstName: "AI",
  lastName: "Builder",
  phoneNumber: "+201000000000",
  state: "Cairo",
  street: "Tahrir Square",
};

export function PlanCard({
  currency,
  current,
  plan,
}: {
  currency: BillingCurrency;
  current: boolean;
  plan: BillingPlan;
}) {
  const t = useTranslations("billing");
  const { toast } = useToast();
  const [landingPageQuantity, setLandingPageQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const isLandingPagePackage = plan.id === "free";
  const quantity = isLandingPagePackage ? landingPageQuantity : 1;
  const totalPriceUsd = plan.priceUsd * quantity;
  const isCheckoutDisabled = plan.priceUsd <= 0;

  function handleUpgrade() {
    if (isCheckoutDisabled) {
      return;
    }

    startTransition(async () => {
      const result = await createCheckoutAction({
        billingData: defaultBillingData,
        currency,
        landingPageQuantity: quantity,
        planId: plan.id,
      });

      if (!result.success) {
        toast({
          description: result.error,
          title: "Payment could not start",
          variant: "destructive",
        });
        return;
      }

      window.location.assign(result.paymentUrl);
    });
  }

  function updateQuantity(value: number) {
    setLandingPageQuantity(normalizeLandingPageQuantity(value));
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-background p-5 shadow-luxury-sm">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          {current ? (
            <span className="rounded bg-secondary px-2 py-1 text-xs font-medium">
              {t("currentPlan")}
            </span>
          ) : null}
        </div>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {plan.description}
        </p>
        <p className="mt-5 text-3xl font-semibold">
          {formatMoney(totalPriceUsd, currency)}
          {plan.priceUsd > 0 ? (
            <span className="text-sm font-normal text-muted-foreground">
              {isLandingPagePackage
                ? ` / ${quantity} ${t("landingPage")}`
                : ` /${t("month")}`}
            </span>
          ) : null}
        </p>
        {isLandingPagePackage ? (
          <div className="mt-4 rounded-md border border-border bg-secondary/30 p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{t("landingPages")}</span>
              <div className="inline-flex items-center rounded-md border border-border bg-background">
                <Button
                  className="size-9 rounded-none border-0"
                  onClick={() => updateQuantity(quantity - 1)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Minus className="size-4" />
                </Button>
                <input
                  className="h-9 w-14 border-x border-border bg-transparent text-center text-sm font-semibold outline-none"
                  min={1}
                  onChange={(event) =>
                    updateQuantity(Number(event.target.value))
                  }
                  type="number"
                  value={quantity}
                />
                <Button
                  className="size-9 rounded-none border-0"
                  onClick={() => updateQuantity(quantity + 1)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {formatMoney(plan.priceUsd, currency)} {t("each")}.{" "}
              {t("buyMoreCredits")}
            </p>
          </div>
        ) : null}
      </div>
      <ul className="mt-5 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li className="flex gap-2 text-sm" key={feature}>
            <Check className="mt-0.5 size-4 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-5 text-muted-foreground">
        Card and mobile-wallet options are securely displayed by Paymob based on
        the active Paymob account configuration.
      </p>
      <Button
        className="mt-3"
        disabled={current || isCheckoutDisabled || pending}
        onClick={handleUpgrade}
        type="button"
        variant={current ? "outline" : "default"}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {!pending && !current ? <ExternalLink className="size-4" /> : null}
        {current ? t("currentPlan") : "Continue to secure payment"}
      </Button>
    </article>
  );
}
