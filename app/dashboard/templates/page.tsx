import { redirect } from "next/navigation";

import { createLocalizedPathname } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";

export default function TemplatesPage() {
  redirect(createLocalizedPathname("/dashboard/projects", getRequestLocale()));
}
