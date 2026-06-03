"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

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
  const searchParams = useSearchParams();
  const t = useTranslations("common");
  const nextLocale = locale === "ar" ? "en" : "ar";
  const localizedPath = createLocalizedPathname(pathname, nextLocale);
  const href = searchParams.size
    ? `${localizedPath}?${searchParams.toString()}`
    : localizedPath;

  return (
    <Button
      aria-label={t("switchLanguage")}
      asChild
      size="sm"
      title={t("switchLanguage")}
      variant="outline"
    >
      <Link
        href={href}
        hrefLang={nextLocale}
        onClick={() => {
          document.cookie = `${localeCookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
        }}
      >
        <Languages />
        <span className="hidden sm:inline">{localeLabels[nextLocale]}</span>
      </Link>
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
