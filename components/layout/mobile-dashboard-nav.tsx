"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { dashboardNavSections } from "@/config/site";
import { useLocalizedPathname } from "@/hooks/i18n";
import { stripLocaleFromPathname } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type MobileDashboardNavProps = {
  isAdmin?: boolean;
};

export function MobileDashboardNav({
  isAdmin = false,
}: MobileDashboardNavProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const localizedPath = useLocalizedPathname();
  const cleanPathname = stripLocaleFromPathname(pathname);
  const dashboardNavItems = dashboardNavSections
    .flatMap((section) => section.items)
    .filter((item) => !item.adminOnly || isAdmin);

  return (
    <nav className="border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex gap-2 overflow-x-auto">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? cleanPathname === item.href
              : cleanPathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                isActive &&
                  "border-border bg-secondary text-foreground shadow-luxury-sm",
              )}
              href={localizedPath(item.href)}
              key={item.href}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {getDashboardNavLabel(t, item.title, locale)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function getDashboardNavLabel(
  t: ReturnType<typeof useTranslations>,
  title: string,
  locale: string,
) {
  const key = title.toLowerCase();

  if (key === "admin") {
    return locale === "ar" ? "الإدارة" : "Admin";
  }

  if (key === "projects") {
    return t("projects.title");
  }

  return t(key);
}
