"use client";

import Link from "next/link";
import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    setCollapsed(window.localStorage.getItem("dashboard-sidebar") === "closed");
  }, []);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(
        "dashboard-sidebar",
        next ? "closed" : "open",
      );
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "hidden min-h-screen border-e border-border bg-secondary/30 transition-[width] duration-200 lg:flex lg:flex-col",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-5">
        <div className={cn("min-w-0", collapsed && "w-10 overflow-hidden")}>
          <BrandMark />
        </div>
        <button
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-luxury-sm transition-colors hover:bg-secondary hover:text-foreground"
          onClick={toggleCollapsed}
          title={collapsed ? "Open sidebar" : "Close sidebar"}
          type="button"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
      </div>
      <Separator />
      <nav className="flex-1 space-y-7 px-3 py-6">
        {dashboardNavSections.map((section) => (
          <div key={section.title}>
            {!collapsed ? (
              <p className="px-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t(section.title.toLowerCase())}
              </p>
            ) : null}
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
                        collapsed && "justify-center px-0",
                        isActive &&
                          "bg-background text-foreground shadow-luxury-sm",
                      )}
                      href={localizedPath(item.href)}
                      key={item.href}
                      title={getDashboardNavLabel(t, item.title, locale)}
                    >
                      {Icon ? <Icon className="size-4" /> : null}
                      {!collapsed
                        ? getDashboardNavLabel(t, item.title, locale)
                        : null}
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
