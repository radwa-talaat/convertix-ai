import Link from "next/link";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";
import { marketingNavItems, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <Container className="py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <nav className="flex flex-wrap gap-5">
            {marketingNavItems.map((item) => (
              <Link
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <Separator className="my-8" />
        <p className="text-sm text-muted-foreground">
          {siteConfig.name} foundation. Built for a focused SaaS product team.
        </p>
      </Container>
    </footer>
  );
}
