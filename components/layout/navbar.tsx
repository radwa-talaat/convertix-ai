"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { marketingNavItems } from "@/config/site";
import { useLocalizedPathname } from "@/hooks/i18n";

export function Navbar() {
  const t = useTranslations("landing");
  const localizedPath = useLocalizedPathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <BrandMark />
        <nav className="hidden items-center gap-6 md:flex">
          {marketingNavItems.map((item) => (
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {t(item.title.toLowerCase())}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href={localizedPath("/dashboard")}>
              {t("startBuilding")}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
