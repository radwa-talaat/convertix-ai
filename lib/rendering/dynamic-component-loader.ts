import dynamic from "next/dynamic";

export const dynamicSectionComponents = {
  benefits: dynamic(() =>
    import("@/components/landing-page/sections/benefits-section").then(
      (module) => module.BenefitsSection,
    ),
  ),
  cta: dynamic(() =>
    import("@/components/landing-page/sections/cta-section").then(
      (module) => module.CtaSection,
    ),
  ),
  faq: dynamic(() =>
    import("@/components/landing-page/sections/faq-section").then(
      (module) => module.FaqSection,
    ),
  ),
  features: dynamic(() =>
    import("@/components/landing-page/sections/features-section").then(
      (module) => module.FeaturesSection,
    ),
  ),
  footer: dynamic(() =>
    import("@/components/landing-page/sections/footer-section").then(
      (module) => module.FooterSection,
    ),
  ),
  hero: dynamic(() =>
    import("@/components/landing-page/sections/hero-render-section").then(
      (module) => module.HeroRenderSection,
    ),
  ),
  navbar: dynamic(() =>
    import("@/components/landing-page/sections/navbar-section").then(
      (module) => module.NavbarSection,
    ),
  ),
  pricing: dynamic(() =>
    import("@/components/landing-page/sections/pricing-section").then(
      (module) => module.PricingSection,
    ),
  ),
  testimonials: dynamic(() =>
    import("@/components/landing-page/sections/testimonials-section").then(
      (module) => module.TestimonialsSection,
    ),
  ),
};
