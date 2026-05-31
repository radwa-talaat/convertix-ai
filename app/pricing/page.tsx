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
            Plans built for Egyptian SaaS payments
          </h1>
          <p className="mt-4 text-muted-foreground">
            Subscribe monthly with Paymob support for bank cards, local payment
            methods, wallets, and Apple Pay where enabled on your merchant
            account.
          </p>
        </div>
        <div className="mt-10">
          <PricingGrid currentPlanId="free" />
        </div>
      </Container>
    </main>
  );
}
