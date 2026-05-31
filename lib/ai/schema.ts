import { z } from "zod";

export const aiGenerationInputSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  businessType: z.string().trim().min(2).max(120),
  targetAudience: z.string().trim().min(2).max(240),
  goal: z.string().trim().min(2).max(240),
  brandStyle: z.string().trim().min(2).max(120),
  language: z.enum(["en", "ar"]),
  productImageUrl: z
    .string()
    .trim()
    .max(500_000)
    .optional()
    .refine(
      (value) =>
        !value ||
        value.startsWith("data:image/") ||
        /^https?:\/\/.+/i.test(value),
      "Product image must be an image upload or a valid URL.",
    ),
  toneOfVoice: z.string().trim().min(2).max(120),
});

const titledDescriptionSchema = z.object({
  title: z.string().trim().min(2).max(90),
  description: z.string().trim().min(10).max(220),
});

export const aiLandingPageContentSchema = z.object({
  headline: z.string().trim().min(8).max(100),
  subheadline: z.string().trim().min(20).max(220),
  cta: z.string().trim().min(2).max(40),
  features: z.array(titledDescriptionSchema).min(3).max(5),
  benefits: z.array(titledDescriptionSchema).min(3).max(5),
  faq: z
    .array(
      z.object({
        question: z.string().trim().min(8).max(140),
        answer: z.string().trim().min(16).max(260),
      }),
    )
    .min(3)
    .max(5),
  testimonials: z
    .array(
      z.object({
        quote: z.string().trim().min(16).max(220),
        author: z.string().trim().min(2).max(80),
        role: z.string().trim().min(2).max(90),
      }),
    )
    .min(2)
    .max(3),
  pricingCopy: z.string().trim().min(20).max(180),
  seo: z.object({
    title: z.string().trim().min(12).max(70),
    description: z.string().trim().min(40).max(160),
  }),
});

export const aiLandingPageJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "headline",
    "subheadline",
    "cta",
    "features",
    "benefits",
    "faq",
    "testimonials",
    "pricingCopy",
    "seo",
  ],
  properties: {
    headline: { type: "string" },
    subheadline: { type: "string" },
    cta: { type: "string" },
    features: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    benefits: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    faq: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer"],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
      },
    },
    testimonials: {
      type: "array",
      minItems: 2,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["quote", "author", "role"],
        properties: {
          quote: { type: "string" },
          author: { type: "string" },
          role: { type: "string" },
        },
      },
    },
    pricingCopy: { type: "string" },
    seo: {
      type: "object",
      additionalProperties: false,
      required: ["title", "description"],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    },
  },
} as const;
