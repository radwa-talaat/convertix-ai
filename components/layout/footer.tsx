"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { marketingNavItems, siteConfig } from "@/config/site";
import { useLocalizedPathname } from "@/hooks/i18n";

export function Footer() {
  const t = useTranslations("landing");
  const localizedPath = useLocalizedPathname();

  return (
    <footer className="border-t border-border bg-secondary/30">
      <Container className="py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <nav className="flex flex-wrap gap-5">
            {marketingNavItems.map((item) => (
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href={localizedPath(item.href)}
                key={item.href}
              >
                {t(item.title.toLowerCase())}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-8" />
        <p className="text-sm text-muted-foreground">
          {siteConfig.name}. {t("footerTagline")}
        </p>
      </Container>
    </footer>
  );
}
