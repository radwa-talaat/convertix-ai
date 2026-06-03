import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

import { defaultLocale, isAppLocale } from "@/lib/i18n/config";
import { loadMessages } from "@/lib/i18n/messages";

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const headerLocale = headers().get("x-app-locale");
  const locale = isAppLocale(requestedLocale)
    ? requestedLocale
    : headerLocale && isAppLocale(headerLocale)
      ? headerLocale
      : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
