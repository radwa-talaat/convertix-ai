import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { marketingNavItems } from "@/config/site";

export function Navbar() {
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
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex" size="sm">
            <Link href="/dashboard">
              Open App
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
