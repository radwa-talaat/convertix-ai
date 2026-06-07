import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers3, WandSparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { BodyText, DisplayText, Eyebrow } from "@/components/ui/typography";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <Container className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1fr_0.86fr] lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-6 max-w-md">
            <Image
              alt="Convertix"
              className="h-auto w-full object-contain"
              height={120}
              src="/brand/convertix-wordmark.png"
              width={720}
            />
          </div>
          <Eyebrow>AI landing pages that convert</Eyebrow>
          <DisplayText className="mt-5">
            A premium workspace for faster campaign pages.
          </DisplayText>
          <BodyText className="mt-6 max-w-2xl text-lg">
            Plan, draft, refine, and launch high-converting landing pages from a
            refined SaaS foundation built for scale.
          </BodyText>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open Dashboard
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#product">View Structure</Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-lg border border-border/60 bg-secondary/40 blur-2xl" />
          <div className="relative rounded-lg border border-border bg-card p-4 shadow-luxury-md">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <p className="text-sm font-medium">Campaign Console</p>
                <p className="text-xs text-muted-foreground">
                  Brand, copy, layout, publish
                </p>
              </div>
              <WandSparkles className="size-5 text-accent-foreground" />
            </div>
            <div className="grid gap-3 py-4">
              {[
                "Audience brief",
                "AI content blocks",
                "Responsive preview",
              ].map((item) => (
                <div
                  className="flex items-center gap-3 rounded-md bg-secondary/60 p-3"
                  key={item}
                >
                  <span className="flex size-8 items-center justify-center rounded-md bg-background">
                    <Layers3 className="size-4" />
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-20 rounded-md bg-primary" />
              <div className="h-20 rounded-md bg-accent" />
              <div className="h-20 rounded-md border border-border bg-background" />
            </div>
          </div>
        </div>
      </Container>
      <div className="surface-line h-px" />
    </section>
  );
}
