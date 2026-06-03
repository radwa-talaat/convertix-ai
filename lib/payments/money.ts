import { getCurrencyOption } from "@/lib/payments/currencies";
import type { BillingCurrency } from "@/types/billing";

export function usdToMinorUnits(
  amountUsd: number,
  currency: BillingCurrency,
): number {
  const option = getCurrencyOption(currency);

  return Math.round(amountUsd * option.rateFromUsd * 100);
}

export function formatMoney(
  amountUsd: number,
  currency: BillingCurrency,
): string {
  return formatMinorUnits(usdToMinorUnits(amountUsd, currency), currency);
}

export function formatMinorUnits(
  amountMinorUnits: number,
  currency: BillingCurrency,
): string {
  const option = getCurrencyOption(currency);

  return new Intl.NumberFormat(option.locale, {
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: amountMinorUnits % 100 === 0 ? 0 : 2,
    style: "currency",
  }).format(amountMinorUnits / 100);
}

export function normalizeLandingPageQuantity(value?: number) {
  if (!value || Number.isNaN(value)) {
    return 1;
  }

  return Math.max(1, Math.min(100, Math.floor(value)));
}

export function calculateCheckoutAmount({
  currency,
  planPriceUsd,
  quantity = 1,
}: {
  currency: BillingCurrency;
  planPriceUsd: number;
  quantity?: number;
}) {
  return usdToMinorUnits(
    planPriceUsd * normalizeLandingPageQuantity(quantity),
    currency,
  );
}
