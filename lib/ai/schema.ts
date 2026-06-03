import { z } from "zod";

export const aiGenerationInputSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  businessType: z.string().trim().min(2).max(120),
  targetAudience: z.string().trim().min(2).max(240),
  goal: z.string().trim().min(2).max(240),
  brandStyle: z.string().trim().min(2).max(120),
  customerProblem: z.string().trim().max(320).optional(),
  keyBenefits: z.string().trim().max(420).optional(),
  language: z.enum(["en", "ar"]),
  offer: z.string().trim().max(240).optional(),
  orderMethod: z.string().trim().max(120).optional(),
  productCategory: z.string().trim().max(120).optional(),
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
  productPrice: z.string().trim().max(80).optional(),
  salesCountry: z.string().trim().max(120).optional(),
  dialect: z.string().trim().max(120).optional(),
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

const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9a-f]{6}$/i);

const designSectionStyleSchema = z.object({
  backgroundColor: hexColorSchema,
  align: z.enum(["start", "center", "end"]),
  textScale: z.number().int().min(80).max(150),
});

export const aiLandingPageDesignSchema = z.object({
  theme: z.enum(["luxury", "medical", "bold", "minimal", "organic", "tech"]),
  backgroundStyle: z.string().trim().min(4).max(120),
  imagePlacement: z.enum(["right", "left", "center", "floating"]),
  heroBadge: z.string().trim().min(2).max(60),
  colors: z.object({
    background: hexColorSchema,
    foreground: hexColorSchema,
    primary: hexColorSchema,
    primaryForeground: hexColorSchema,
    accent: hexColorSchema,
    surface: hexColorSchema,
    border: hexColorSchema,
    muted: hexColorSchema,
  }),
  typographyStyle: z.enum(["bold", "elegant", "clean", "playful"]),
  textScale: z.number().int().min(80).max(150),
  sectionStyles: z.object({
    hero: designSectionStyleSchema,
    features: designSectionStyleSchema,
    pricing: designSectionStyleSchema,
    cta: designSectionStyleSchema,
  }),
  designNotes: z.array(z.string().trim().min(4).max(120)).min(2).max(5),
});

export const aiLandingPageGenerationSchema = z.object({
  content: aiLandingPageContentSchema,
  design: aiLandingPageDesignSchema,
});

export const aiLandingPageJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["content", "design"],
  properties: {
    content: {
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
    },
    design: {
      type: "object",
      additionalProperties: false,
      required: [
        "theme",
        "backgroundStyle",
        "imagePlacement",
        "heroBadge",
        "colors",
        "typographyStyle",
        "textScale",
        "sectionStyles",
        "designNotes",
      ],
      properties: {
        theme: {
          type: "string",
          enum: ["luxury", "medical", "bold", "minimal", "organic", "tech"],
        },
        backgroundStyle: { type: "string" },
        imagePlacement: {
          type: "string",
          enum: ["right", "left", "center", "floating"],
        },
        heroBadge: { type: "string" },
        colors: {
          type: "object",
          additionalProperties: false,
          required: [
            "background",
            "foreground",
            "primary",
            "primaryForeground",
            "accent",
            "surface",
            "border",
            "muted",
          ],
          properties: {
            background: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            foreground: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            primary: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            primaryForeground: {
              type: "string",
              pattern: "^#[0-9a-fA-F]{6}$",
            },
            accent: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            surface: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            border: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            muted: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          },
        },
        typographyStyle: {
          type: "string",
          enum: ["bold", "elegant", "clean", "playful"],
        },
        textScale: { type: "integer", minimum: 80, maximum: 150 },
        sectionStyles: {
          type: "object",
          additionalProperties: false,
          required: ["hero", "features", "pricing", "cta"],
          properties: {
            hero: sectionStyleJsonSchema(),
            features: sectionStyleJsonSchema(),
            pricing: sectionStyleJsonSchema(),
            cta: sectionStyleJsonSchema(),
          },
        },
        designNotes: {
          type: "array",
          minItems: 2,
          maxItems: 5,
          items: { type: "string" },
        },
      },
    },
  },
} as const;

function sectionStyleJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["backgroundColor", "align", "textScale"],
    properties: {
      backgroundColor: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
      align: { type: "string", enum: ["start", "center", "end"] },
      textScale: { type: "integer", minimum: 80, maximum: 150 },
    },
  };
}
