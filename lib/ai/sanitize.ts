import type { AiLandingPageContent, AiLandingPageDesign } from "@/types/ai";

const htmlTagPattern = /<[^>]*>/g;
const whitespacePattern = /\s+/g;

function sanitizeText(value: string) {
  return value
    .replace(htmlTagPattern, "")
    .replace(whitespacePattern, " ")
    .trim();
}

export function sanitizeLandingPageContent(
  content: AiLandingPageContent,
): AiLandingPageContent {
  return {
    headline: sanitizeText(content.headline),
    subheadline: sanitizeText(content.subheadline),
    cta: sanitizeText(content.cta),
    features: content.features.map((feature) => ({
      title: sanitizeText(feature.title),
      description: sanitizeText(feature.description),
    })),
    benefits: content.benefits.map((benefit) => ({
      title: sanitizeText(benefit.title),
      description: sanitizeText(benefit.description),
    })),
    faq: content.faq.map((item) => ({
      question: sanitizeText(item.question),
      answer: sanitizeText(item.answer),
    })),
    testimonials: content.testimonials.map((testimonial) => ({
      quote: sanitizeText(testimonial.quote),
      author: sanitizeText(testimonial.author),
      role: sanitizeText(testimonial.role),
    })),
    pricingCopy: sanitizeText(content.pricingCopy),
    seo: {
      title: sanitizeText(content.seo.title),
      description: sanitizeText(content.seo.description),
    },
  };
}

function sanitizeColor(value: string, fallback: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
}

function sanitizeScale(value: number) {
  return Math.max(80, Math.min(150, Math.round(value)));
}

export function sanitizeLandingPageDesign(
  design: AiLandingPageDesign,
): AiLandingPageDesign {
  return {
    ...design,
    backgroundStyle: sanitizeText(design.backgroundStyle),
    colors: {
      accent: sanitizeColor(design.colors.accent, "#d7fb72"),
      background: sanitizeColor(design.colors.background, "#f7f7f2"),
      border: sanitizeColor(design.colors.border, "#deded4"),
      foreground: sanitizeColor(design.colors.foreground, "#10100e"),
      muted: sanitizeColor(design.colors.muted, "#68685f"),
      primary: sanitizeColor(design.colors.primary, "#111111"),
      primaryForeground: sanitizeColor(
        design.colors.primaryForeground,
        "#ffffff",
      ),
      surface: sanitizeColor(design.colors.surface, "#ffffff"),
    },
    designNotes: design.designNotes.map(sanitizeText),
    heroBadge: sanitizeText(design.heroBadge),
    imagePrompts: {
      heroBackground: sanitizeText(design.imagePrompts.heroBackground),
      productScene: sanitizeText(design.imagePrompts.productScene),
      sectionMotifs: design.imagePrompts.sectionMotifs.map(sanitizeText),
    },
    sectionStyles: {
      cta: {
        ...design.sectionStyles.cta,
        backgroundColor: sanitizeColor(
          design.sectionStyles.cta.backgroundColor,
          design.colors.primary,
        ),
        textScale: sanitizeScale(design.sectionStyles.cta.textScale),
      },
      features: {
        ...design.sectionStyles.features,
        backgroundColor: sanitizeColor(
          design.sectionStyles.features.backgroundColor,
          design.colors.surface,
        ),
        textScale: sanitizeScale(design.sectionStyles.features.textScale),
      },
      hero: {
        ...design.sectionStyles.hero,
        backgroundColor: sanitizeColor(
          design.sectionStyles.hero.backgroundColor,
          design.colors.background,
        ),
        textScale: sanitizeScale(design.sectionStyles.hero.textScale),
      },
      pricing: {
        ...design.sectionStyles.pricing,
        backgroundColor: sanitizeColor(
          design.sectionStyles.pricing.backgroundColor,
          design.colors.surface,
        ),
        textScale: sanitizeScale(design.sectionStyles.pricing.textScale),
      },
    },
    sectionOrder: sanitizeSectionOrder(design.sectionOrder),
    textScale: sanitizeScale(design.textScale),
  };
}

function sanitizeSectionOrder(
  sectionOrder: AiLandingPageDesign["sectionOrder"],
): AiLandingPageDesign["sectionOrder"] {
  const allowed = new Set([
    "hero",
    "features",
    "benefits",
    "pricing",
    "testimonials",
    "faq",
    "lead-form",
    "cta",
  ]);
  const unique = sectionOrder.filter(
    (section, index) =>
      allowed.has(section) && sectionOrder.indexOf(section) === index,
  );

  return unique.length >= 6
    ? unique
    : [
        "hero",
        "features",
        "benefits",
        "pricing",
        "lead-form",
        "faq",
        "testimonials",
        "cta",
      ];
}
