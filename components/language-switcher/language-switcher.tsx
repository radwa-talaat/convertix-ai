"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createLocalizedPathname,
  localeCookieName,
  localeLabels,
  locales,
  type AppLocale,
} from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("common");
  const nextLocale = locale === "ar" ? "en" : "ar";
  const localizedPath = createLocalizedPathname(pathname, nextLocale);
  const href = searchParams.size
    ? `${localizedPath}?${searchParams.toString()}`
    : localizedPath;

  function switchLanguage() {
    document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.push(href);
    router.refresh();
  }

  return (
    <Button
      aria-label={t("switchLanguage")}
      onClick={switchLanguage}
      size="sm"
      title={t("switchLanguage")}
      type="button"
      variant="outline"
    >
      <Languages />
      <span className="hidden sm:inline">{localeLabels[nextLocale]}</span>
    </Button>
  );
}

export function LocaleAlternates({ path }: { path: string }) {
  return (
    <>
      {locales.map((item) => (
        <link
          href={createLocalizedPathname(path, item)}
          hrefLang={item}
          key={item}
          rel="alternate"
        />
      ))}
    </>
  );
}
