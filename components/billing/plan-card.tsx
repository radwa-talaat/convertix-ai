"use client";

import { Check, ExternalLink, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { createCheckoutAction } from "@/app/dashboard/billing/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatMoney } from "@/lib/payments";
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
  const locale = useLocale();
  const t = useTranslations("billing");
  const { toast } = useToast();
  const [pending, startTransition] = useTransition();
  const quantity = plan.limits.landingPages;
  const isCheckoutDisabled = plan.priceUsd <= 0;
  const localizedPlan =
    locale === "ar"
      ? {
          agency: {
            description: "الباقة المتقدمة للفرق والوكالات والحملات الكبيرة.",
            features: [
              "10 صفحات هبوط",
              "توصيل أكثر من دومين لكل صفحة",
              "صلاحية استخدام ميزة الفريق",
              "رصيد ذكاء اصطناعي متقدم",
              "قوالب مميزة",
            ],
            name: "فريق",
          },
          free: {
            description: "باقة صفحة هبوط متكاملة لحملة أو منتج واحد.",
            features: [
              "صفحة هبوط واحدة",
              "توصيل دومين مخصص واحد",
              "إنشاء المحتوى بالذكاء الاصطناعي",
              "رفع صورة المنتج",
              "الوصول إلى المحرر",
            ],
            name: "فردي",
          },
          pro: {
            description: "باقة أوفر لعدة منتجات وحملات تسويقية.",
            features: [
              "5 صفحات هبوط",
              "توصيل دومين واحد لكل صفحة",
              "قوالب مميزة",
              "إعادة صياغة بالذكاء الاصطناعي",
              "رفع صور المنتجات",
            ],
            name: "نمو",
          },
        }[plan.id]
      : plan;

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

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-background p-5 shadow-luxury-sm">
      <div>
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">{localizedPlan.name}</h3>
          {current ? (
            <span className="rounded bg-secondary px-2 py-1 text-xs font-medium">
              {t("currentPlan")}
            </span>
          ) : null}
        </div>
        <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">
          {localizedPlan.description}
        </p>
        <p className="mt-5 text-3xl font-semibold">
          {formatMoney(plan.priceUsd, currency)}
          {plan.priceUsd > 0 ? (
            <span className="text-sm font-normal text-muted-foreground">
              {` / ${quantity} ${quantity === 1 ? t("landingPage") : t("landingPages")}`}
            </span>
          ) : null}
        </p>
      </div>
      <ul className="mt-5 flex-1 space-y-3">
        {localizedPlan.features.map((feature) => (
          <li className="flex gap-2 text-sm" key={feature}>
            <Check className="mt-0.5 size-4 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <Button
        className="mt-6"
        disabled={current || isCheckoutDisabled || pending}
        onClick={handleUpgrade}
        type="button"
        variant={current ? "outline" : "default"}
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        {!pending && !current ? <ExternalLink className="size-4" /> : null}
        {current ? t("currentPlan") : t("securePayment")}
      </Button>
    </article>
  );
}
