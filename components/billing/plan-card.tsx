"use client";

import { Check, Loader2 } from "lucide-react";
import { useTransition } from "react";

import { createCheckoutAction } from "@/app/dashboard/billing/actions";
import { Button } from "@/components/ui/button";
import { formatEgp } from "@/lib/payments";
import type { BillingPlan, PaymobBillingData } from "@/types/billing";

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
  current,
  plan,
}: {
  current: boolean;
  plan: BillingPlan;
}) {
  const [pending, startTransition] = useTransition();
  const isFree = plan.id === "free";

  function handleUpgrade() {
    if (isFree) {
      return;
    }

    startTransition(() => {
      if (plan.id === "free") {
        return;
      }

      void createCheckoutAction({
        billingData: defaultBillingData,
        planId: plan.id,
      });
    });
  }

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-background p-5 shadow-luxury-sm">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          {current ? (
            <span className="rounded bg-secondary px-2 py-1 text-xs font-medium">
              Current
            </span>
          ) : null}
        </div>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {plan.description}
        </p>
        <p className="mt-5 text-3xl font-semibold">
          {plan.priceEgp === 0 ? "Free" : formatEgp(plan.priceEgp * 100)}
          {plan.priceEgp > 0 ? (
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          ) : null}
        </p>
      </div>
      <ul className="mt-5 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li className="flex gap-2 text-sm" key={feature}>
            <Check className="mt-0.5 size-4 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className="mt-6"
        disabled={current || isFree || pending}
        onClick={handleUpgrade}
        type="button"
        variant={current ? "outline" : "default"}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {current ? "Current plan" : plan.cta}
      </Button>
    </article>
  );
}
