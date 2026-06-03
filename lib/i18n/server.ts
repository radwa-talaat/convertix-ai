import "server-only";

import type { AbstractIntlMessages } from "next-intl";
import { headers } from "next/headers";

import {
  defaultLocale,
  getLocaleDirection,
  isAppLocale,
  type AppLocale,
} from "@/lib/i18n/config";
import { loadMessages, type MessageNamespace } from "@/lib/i18n/messages";

export function getRequestLocale(): AppLocale {
  const headerLocale = headers().get("x-app-locale");
  if (headerLocale && isAppLocale(headerLocale)) {
    return headerLocale;
  }

  return defaultLocale;
}

export function getRequestDirection() {
  return getLocaleDirection(getRequestLocale());
}

export async function getServerMessages() {
  return loadMessages(getRequestLocale());
}

export async function getServerTranslator(namespace: MessageNamespace) {
  const messages = await getServerMessages();
  const scoped = messages[namespace] as AbstractIntlMessages | undefined;

  return (key: string) => {
    const value = key.split(".").reduce<unknown>((current, part) => {
      if (!current || typeof current !== "object") {
        return undefined;
      }

      return (current as Record<string, unknown>)[part];
    }, scoped);

    return typeof value === "string" ? value : key;
  };
}
