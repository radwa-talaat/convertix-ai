import type { ComponentType } from "react";

import {
  BenefitsSection,
  CtaSection,
  FaqSection,
  FeaturesSection,
  FooterSection,
  HeroRenderSection,
  LeadFormSection,
  NavbarSection,
  PricingSection,
  TestimonialsSection,
} from "@/components/landing-page/sections";
import type {
  LandingPageSectionProps,
  LandingPageSectionType,
} from "@/types/rendering";

export type RegisteredSection = {
  component: ComponentType<LandingPageSectionProps<unknown>>;
  label: string;
};

export const sectionRegistry: Record<
  LandingPageSectionType,
  RegisteredSection
> = {
  benefits: {
    component: BenefitsSection as ComponentType<
      LandingPageSectionProps<unknown>
    >,
    label: "Benefits",
  },
  cta: {
    component: CtaSection as ComponentType<LandingPageSectionProps<unknown>>,
    label: "CTA",
  },
  faq: {
    component: FaqSection as ComponentType<LandingPageSectionProps<unknown>>,
    label: "FAQ",
  },
  features: {
    component: FeaturesSection as ComponentType<
      LandingPageSectionProps<unknown>
    >,
    label: "Features",
  },
  footer: {
    component: FooterSection as ComponentType<LandingPageSectionProps<unknown>>,
    label: "Footer",
  },
  hero: {
    component: HeroRenderSection as ComponentType<
      LandingPageSectionProps<unknown>
    >,
    label: "Hero",
  },
  "lead-form": {
    component: LeadFormSection as ComponentType<
      LandingPageSectionProps<unknown>
    >,
    label: "Lead Form",
  },
  navbar: {
    component: NavbarSection as ComponentType<LandingPageSectionProps<unknown>>,
    label: "Navbar",
  },
  pricing: {
    component: PricingSection as ComponentType<
      LandingPageSectionProps<unknown>
    >,
    label: "Pricing",
  },
  testimonials: {
    component: TestimonialsSection as ComponentType<
      LandingPageSectionProps<unknown>
    >,
    label: "Testimonials",
  },
};
