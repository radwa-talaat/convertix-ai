import { redirect } from "next/navigation";

import { createLocalizedPathname } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default async function SettingsPage() {
  const locale = await getRequestLocale();

  redirect(createLocalizedPathname("/dashboard", locale));
}
