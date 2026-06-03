import type { BillingCurrency } from "@/types/billing";

export type CurrencyOption = {
  code: BillingCurrency;
  countryCodes: string[];
  label: string;
  locale: string;
  rateFromUsd: number;
  symbol: string;
};

export const currencyOptions: CurrencyOption[] = [
  {
    code: "USD",
    countryCodes: ["US"],
    label: "US Dollar",
    locale: "en-US",
    rateFromUsd: 1,
    symbol: "$",
  },
  {
    code: "EGP",
    countryCodes: ["EG"],
    label: "Egyptian Pound",
    locale: "ar-EG",
    rateFromUsd: 50,
    symbol: "E£",
  },
  {
    code: "SAR",
    countryCodes: ["SA"],
    label: "Saudi Riyal",
    locale: "ar-SA",
    rateFromUsd: 3.75,
    symbol: "SAR",
  },
  {
    code: "AED",
    countryCodes: ["AE"],
    label: "UAE Dirham",
    locale: "ar-AE",
    rateFromUsd: 3.67,
    symbol: "AED",
  },
  {
    code: "EUR",
    countryCodes: [
      "AT",
      "BE",
      "CY",
      "DE",
      "EE",
      "ES",
      "FI",
      "FR",
      "GR",
      "IE",
      "IT",
      "LT",
      "LU",
      "LV",
      "MT",
      "NL",
      "PT",
      "SI",
      "SK",
    ],
    label: "Euro",
    locale: "en-DE",
    rateFromUsd: 0.92,
    symbol: "EUR",
  },
  {
    code: "GBP",
    countryCodes: ["GB"],
    label: "British Pound",
    locale: "en-GB",
    rateFromUsd: 0.78,
    symbol: "£",
  },
];

export const defaultBillingCurrency: BillingCurrency = "USD";

export function getCurrencyOption(currency: BillingCurrency) {
  return (
    currencyOptions.find((option) => option.code === currency) ??
    currencyOptions[0]
  );
}

export function isBillingCurrency(value: unknown): value is BillingCurrency {
  return currencyOptions.some((option) => option.code === value);
}

export function detectCurrencyFromCountry(
  countryCode?: string | null,
): BillingCurrency {
  const normalizedCountry = countryCode?.toUpperCase();

  if (!normalizedCountry) {
    return defaultBillingCurrency;
  }

  return (
    currencyOptions.find((option) =>
      option.countryCodes.includes(normalizedCountry),
    )?.code ?? defaultBillingCurrency
  );
}

export function detectCurrencyFromLocale(locale?: string | null) {
  const match = locale?.match(/[-_]([A-Za-z]{2})$/);

  return detectCurrencyFromCountry(match?.[1]);
}
