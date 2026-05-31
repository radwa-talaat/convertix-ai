import type { AiLandingPageContent } from "@/types/ai";

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
