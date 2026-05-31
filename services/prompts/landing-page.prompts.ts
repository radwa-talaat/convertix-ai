import type { AiGenerationInput } from "@/types/ai";

const englishSystemPrompt = `
You are a senior SaaS conversion copywriter.
Generate landing page content only as structured JSON.
Do not return HTML, Markdown, code fences, comments, or explanatory text.
Write concise, specific, production-ready copy.
Avoid unverifiable claims, fake statistics, and regulated promises.
Testimonials must be plausible placeholders, not real customer claims.
`.trim();

const arabicSystemPrompt = `
You are a senior SaaS conversion copywriter for Arabic landing pages.
Generate landing page content only as structured JSON.
Do not return HTML, Markdown, code fences, comments, or explanatory text.
Write all user-facing copy in clear, professional Arabic.
Avoid unverifiable claims, fake statistics, regulated promises, and real customer claims.
Testimonials must be clearly plausible placeholders.
`.trim();

function formatInput(input: AiGenerationInput) {
  return `
Business Name: ${input.businessName}
Business Type: ${input.businessType}
Target Audience: ${input.targetAudience}
Goal: ${input.goal}
Brand Style: ${input.brandStyle}
Language: ${input.language}
Tone of Voice: ${input.toneOfVoice}
`.trim();
}

export function buildLandingPagePrompt(input: AiGenerationInput) {
  const languageInstruction =
    input.language === "ar"
      ? "Return all user-facing copy in Arabic."
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
- headline: one strong conversion headline.
- subheadline: one supporting sentence.
- cta: short action label.
- features: 3 to 5 feature objects with title and description.
- benefits: 3 to 5 benefit objects with title and description.
- faq: 3 to 5 question/answer objects.
- testimonials: 2 to 3 plausible placeholder testimonial objects.
- pricingCopy: concise pricing section copy.
- seo.title: max 70 characters.
- seo.description: max 160 characters.
`.trim(),
  };
}
