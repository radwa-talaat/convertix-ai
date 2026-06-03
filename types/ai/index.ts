export type AiLanguage = "en" | "ar";

export type AiGenerationInput = {
  businessName: string;
  businessType: string;
  targetAudience: string;
  goal: string;
  brandStyle: string;
  customerProblem?: string;
  keyBenefits?: string;
  language: AiLanguage;
  offer?: string;
  orderMethod?: string;
  productCategory?: string;
  productImageUrl?: string;
  productPrice?: string;
  salesCountry?: string;
  dialect?: string;
  toneOfVoice: string;
};

export type AiFeature = {
  title: string;
  description: string;
};

export type AiBenefit = {
  title: string;
  description: string;
};

export type AiFaqItem = {
  question: string;
  answer: string;
};

export type AiTestimonial = {
  quote: string;
  author: string;
  role: string;
};

export type AiLandingPageContent = {
  headline: string;
  subheadline: string;
  cta: string;
  features: AiFeature[];
  benefits: AiBenefit[];
  faq: AiFaqItem[];
  testimonials: AiTestimonial[];
  pricingCopy: string;
  seo: {
    title: string;
    description: string;
  };
};

export type AiLandingPageDesign = {
  theme: "luxury" | "medical" | "bold" | "minimal" | "organic" | "tech";
  backgroundStyle: string;
  layoutVariant:
    | "split"
    | "centered"
    | "product-showcase"
    | "editorial"
    | "stacked";
  imagePlacement: "right" | "left" | "center" | "floating";
  heroBadge: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    accent: string;
    surface: string;
    border: string;
    muted: string;
  };
  typographyStyle: "bold" | "elegant" | "clean" | "playful";
  textScale: number;
  sectionStyles: Record<
    "hero" | "features" | "pricing" | "cta",
    {
      backgroundColor: string;
      align: "start" | "center" | "end";
      textScale: number;
    }
  >;
  sectionOrder: Array<
    | "hero"
    | "features"
    | "benefits"
    | "pricing"
    | "testimonials"
    | "faq"
    | "lead-form"
    | "cta"
  >;
  imagePrompts: {
    heroBackground: string;
    productScene: string;
    sectionMotifs: string[];
  };
  designNotes: string[];
};

export type AiGeneratedLandingPage = {
  content: AiLandingPageContent;
  design: AiLandingPageDesign;
};

export type AiTokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type AiGenerationResult = {
  content: AiLandingPageContent;
  design: AiLandingPageDesign;
  fallbackUsed: boolean;
  model: string;
  requestId?: string;
  usage: AiTokenUsage;
};

export type AiGenerationErrorCode =
  | "AI_AUTH_REQUIRED"
  | "AI_CONFIG_MISSING"
  | "AI_RATE_LIMITED"
  | "AI_PROVIDER_ERROR"
  | "AI_VALIDATION_ERROR"
  | "AI_UNKNOWN_ERROR";
