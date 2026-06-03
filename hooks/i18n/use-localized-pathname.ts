"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { createLocalizedPathname, type AppLocale } from "@/lib/i18n/config";

export function useLocalizedPathname() {
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();

  return (href: string, nextLocale: AppLocale = locale) => {
    if (href.startsWith("#") || href.startsWith("http")) {
      return href;
    }

    return createLocalizedPathname(href || pathname, nextLocale);
  };
}
