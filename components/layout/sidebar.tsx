"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/layout/brand-mark";
import { Separator } from "@/components/ui/separator";
import { dashboardNavSections } from "@/config/site";
import { useLocalizedPathname } from "@/hooks/i18n";
import { stripLocaleFromPathname } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

type SidebarProps = {
  isAdmin?: boolean;
};

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const localizedPath = useLocalizedPathname();
  const cleanPathname = stripLocaleFromPathname(pathname);

  return (
    <aside className="hidden min-h-screen w-72 border-e border-border bg-secondary/30 lg:flex lg:flex-col">
      <div className="px-6 py-5">
        <BrandMark />
      </div>
      <Separator />
      <nav className="flex-1 space-y-7 px-4 py-6">
        {dashboardNavSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {t(section.title.toLowerCase())}
            </p>
            <div className="mt-3 space-y-1">
              {section.items
                .filter((item) => !item.adminOnly || isAdmin)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/dashboard"
                      ? cleanPathname === item.href
                      : cleanPathname.startsWith(item.href);

                  return (
                    <Link
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                        isActive &&
                          "bg-background text-foreground shadow-luxury-sm",
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
          </div>
        ))}
      </nav>
    </aside>
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
