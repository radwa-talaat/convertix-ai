import { PricingGrid } from "@/components/billing";
import { Container } from "@/components/layout/container";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal">
            Build your landing page from 50 EGP
          </h1>
          <p className="mt-4 text-muted-foreground">
            Start with one AI-generated landing page for 50 EGP, then upgrade
            monthly when you need more pages, templates, domains, and advanced
            AI credits.
          </p>
        </div>
        <div className="mt-10">
          <PricingGrid />
        </div>
      </Container>
    </main>
  );
}
