import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FoundationSection } from "@/components/landing-page/foundation-section";
import { HeroSection } from "@/components/landing-page/hero-section";

export function MarketingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FoundationSection />
      </main>
      <Footer />
    </div>
  );
}
