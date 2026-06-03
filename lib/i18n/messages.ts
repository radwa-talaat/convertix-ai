import "server-only";

import type { AbstractIntlMessages } from "next-intl";

import type { AppLocale } from "@/lib/i18n/config";

const namespaces = [
  "common",
  "dashboard",
  "auth",
  "editor",
  "billing",
  "landing",
] as const;

export type MessageNamespace = (typeof namespaces)[number];

const messageLoaders = {
  ar: {
    auth: () => import("@/locales/ar/auth.json"),
    billing: () => import("@/locales/ar/billing.json"),
    common: () => import("@/locales/ar/common.json"),
    dashboard: () => import("@/locales/ar/dashboard.json"),
    editor: () => import("@/locales/ar/editor.json"),
    landing: () => import("@/locales/ar/landing.json"),
  },
  en: {
    auth: () => import("@/locales/en/auth.json"),
    billing: () => import("@/locales/en/billing.json"),
    common: () => import("@/locales/en/common.json"),
    dashboard: () => import("@/locales/en/dashboard.json"),
    editor: () => import("@/locales/en/editor.json"),
    landing: () => import("@/locales/en/landing.json"),
  },
} satisfies Record<
  AppLocale,
  Record<MessageNamespace, () => Promise<{ default: AbstractIntlMessages }>>
>;

export async function loadMessages(
  locale: AppLocale,
): Promise<AbstractIntlMessages> {
  const entries = await Promise.all(
    namespaces.map(async (namespace) => {
      const messages = (await messageLoaders[locale][namespace]()).default;

      return [namespace, messages] as const;
    }),
  );

  return Object.fromEntries(entries);
}
