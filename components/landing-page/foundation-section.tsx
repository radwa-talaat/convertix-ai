"use client";

import { Boxes, Code2, Palette, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/typography";

const foundations = [
  {
    detailKey: "foundationArchitectureDetail",
    icon: Boxes,
    titleKey: "foundationArchitectureTitle",
  },
  {
    detailKey: "foundationDesignDetail",
    icon: Palette,
    titleKey: "foundationDesignTitle",
  },
  {
    detailKey: "foundationFlowDetail",
    icon: Code2,
    titleKey: "foundationFlowTitle",
  },
  {
    detailKey: "foundationSaasDetail",
    icon: ShieldCheck,
    titleKey: "foundationSaasTitle",
  },
];

export function FoundationSection() {
  const t = useTranslations("landing");

  return (
    <section className="py-20" id="product">
      <Container>
        <div className="max-w-2xl">
          <SectionTitle>{t("foundationTitle")}</SectionTitle>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {foundations.map((item) => {
            const Icon = item.icon;
            const title = t(item.titleKey);

            return (
              <Card key={item.titleKey}>
                <CardHeader>
                  <span className="flex size-10 items-center justify-center rounded-md bg-secondary">
                    <Icon className="size-4" />
                  </span>
                  <CardTitle className="pt-4">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {t(item.detailKey)}
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
