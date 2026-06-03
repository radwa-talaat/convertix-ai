export const locales = ["en", "ar"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";
export const localeCookieName = "NEXT_LOCALE";

export const localeLabels: Record<AppLocale, string> = {
  ar: "العربية",
  en: "English",
};

export const localeDirections: Record<AppLocale, "ltr" | "rtl"> = {
  ar: "rtl",
  en: "ltr",
};

export function isAppLocale(value: string | undefined): value is AppLocale {
  return Boolean(value && locales.includes(value as AppLocale));
}

export function getLocaleDirection(locale: AppLocale) {
  return localeDirections[locale];
}

export function stripLocaleFromPathname(pathname: string) {
  const [, maybeLocale, ...rest] = pathname.split("/");

  if (!isAppLocale(maybeLocale)) {
    return pathname;
  }

  const stripped = `/${rest.join("/")}`;
  return stripped === "/" ? "/" : stripped.replace(/\/$/, "");
}

export function getLocaleFromPathname(pathname: string): AppLocale | null {
  const [, maybeLocale] = pathname.split("/");
  return isAppLocale(maybeLocale) ? maybeLocale : null;
}

export function createLocalizedPathname(pathname: string, locale: AppLocale) {
  const cleanPathname = stripLocaleFromPathname(pathname);

  if (cleanPathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${cleanPathname}`;
}

export function detectLocale(acceptLanguage: string | null, cookie?: string) {
  if (isAppLocale(cookie)) {
    return cookie;
  }

  const preferred = acceptLanguage
    ?.split(",")
    .map((part) => part.trim().split(";")[0]?.toLowerCase())
    .find(Boolean);

  if (preferred?.startsWith("ar")) {
    return "ar";
  }

  return defaultLocale;
}
