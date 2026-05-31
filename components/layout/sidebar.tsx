"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/layout/brand-mark";
import { Separator } from "@/components/ui/separator";
import { dashboardNavSections } from "@/config/site";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 border-r border-border bg-secondary/30 lg:flex lg:flex-col">
      <div className="px-6 py-5">
        <BrandMark />
      </div>
      <Separator />
      <nav className="flex-1 space-y-7 px-4 py-6">
        {dashboardNavSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              {section.title}
            </p>
            <div className="mt-3 space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    className={cn(
                      "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                      isActive &&
                        "bg-background text-foreground shadow-luxury-sm",
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
          </div>
        ))}
      </nav>
    </aside>
  );
}
