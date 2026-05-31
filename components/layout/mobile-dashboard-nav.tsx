"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardNavSections } from "@/config/site";
import { cn } from "@/lib/utils";

const dashboardNavItems = dashboardNavSections.flatMap(
  (section) => section.items,
);

export function MobileDashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <div className="flex gap-2 overflow-x-auto">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                isActive &&
                  "border-border bg-secondary text-foreground shadow-luxury-sm",
              )}
              href={item.href}
              key={item.href}
            >
              {Icon ? <Icon className="size-4" /> : null}
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
