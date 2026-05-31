import { Boxes, Code2, Palette, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/typography";

const foundations = [
  {
    title: "Architecture",
    detail: "Typed layers for app, UI, services, hooks, store, and config.",
    icon: Boxes,
  },
  {
    title: "Design System",
    detail: "Tokenized color, spacing, typography, dark mode, and containers.",
    icon: Palette,
  },
  {
    title: "Developer Flow",
    detail: "ESLint, Prettier, TypeScript checks, and reusable primitives.",
    icon: Code2,
  },
  {
    title: "SaaS Ready",
    detail: "Dashboard shell and layout patterns ready for feature growth.",
    icon: ShieldCheck,
  },
];

export function FoundationSection() {
  return (
    <section className="py-20" id="product">
      <Container>
        <div className="max-w-2xl">
          <SectionTitle>Foundation built for product velocity.</SectionTitle>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {foundations.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-md bg-secondary">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="pt-4">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
