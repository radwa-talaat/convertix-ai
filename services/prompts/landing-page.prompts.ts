import type { AiGenerationInput } from "@/types/ai";

const englishSystemPrompt = `
You are a senior direct-response copywriter and landing page art director.
Generate product-specific landing page content and design direction only as structured JSON.
Do not return HTML, Markdown, code fences, comments, or explanatory text.
Write concise, specific, production-ready copy.
Avoid unverifiable claims, fake statistics, and regulated promises.
Testimonials must be plausible placeholders, not real customer claims.
Design must be practical for a landing page builder: readable, responsive, and suitable for the product category.
`.trim();

const arabicSystemPrompt = `
You are a senior Arabic direct-response copywriter and landing page art director.
Generate product-specific landing page content and design direction only as structured JSON.
Do not return HTML, Markdown, code fences, comments, or explanatory text.
Write all user-facing copy in clear, professional Arabic.
Avoid unverifiable claims, fake statistics, regulated promises, and real customer claims.
Testimonials must be clearly plausible placeholders.
Design must be practical for a landing page builder: readable, responsive, and suitable for the product category.
`.trim();

function formatInput(input: AiGenerationInput) {
  const optionalRows = [
    ["Product Category", input.productCategory],
    ["Product Price", input.productPrice],
    ["Offer", input.offer],
    ["Customer Problem", input.customerProblem],
    ["Key Benefits", input.keyBenefits],
    ["Order Method", input.orderMethod],
    ["Sales Country", input.salesCountry],
    ["Dialect", input.dialect],
  ]
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Target Audience: ${input.targetAudience}
Goal: ${input.goal}
Brand Style: ${input.brandStyle}
Language: ${input.language}
Product Image Provided: ${input.productImageUrl ? "yes" : "no"}
Tone of Voice: ${input.toneOfVoice}
${optionalRows}
`.trim();
}

export function buildLandingPagePrompt(input: AiGenerationInput) {
  const languageInstruction =
    input.language === "ar"
      ? `Return all user-facing copy in Arabic${input.dialect ? ` using a natural ${input.dialect} flavor where appropriate` : ""}.`
      : "Return all user-facing copy in English.";

  return {
    system: input.language === "ar" ? arabicSystemPrompt : englishSystemPrompt,
    user: `
Create landing page content for the following business.

${formatInput(input)}

Requirements:
- ${languageInstruction}
- Return JSON only.
- Do not include HTML.
- Root object must contain exactly two keys: content and design.
- content.headline: one strong product-specific conversion headline.
- content.subheadline: one supporting sentence that explains the offer.
- content.cta: short action label aligned with the order method.
- content.features: 3 to 5 concrete feature objects with title and description.
- content.benefits: 3 to 5 benefit objects tied to the customer's problem.
- content.faq: 3 to 5 question/answer objects that reduce objections.
- content.testimonials: 2 to 3 plausible placeholder testimonial objects.
- content.pricingCopy: concise pricing or offer copy. Mention price/offer only if supplied.
- content.seo.title: max 70 characters.
- content.seo.description: max 160 characters.
- design.theme: choose one of luxury, medical, bold, minimal, organic, tech.
- design.backgroundStyle: describe the visual direction in one short phrase.
- design.imagePlacement: choose right, left, center, or floating based on language and product.
- design.heroBadge: short badge text, ideally offer/price/category specific.
- design.colors: use only accessible six-digit hex colors.
- design.typographyStyle: choose bold, elegant, clean, or playful.
- design.textScale: integer 80 to 150.
- design.sectionStyles: include hero, features, pricing, and cta with backgroundColor, align, and textScale.
- design.designNotes: 2 to 5 practical notes for placing product imagery and background.
- If a product image is provided, design around it; do not invent a different product image.
- Do not invent medical, financial, or guaranteed claims.
`.trim(),
  };
}
