export type AiLanguage = "en" | "ar";

export type AiGenerationInput = {
  businessName: string;
  businessType: string;
  targetAudience: string;
  goal: string;
  brandStyle: string;
  language: AiLanguage;
  productImageUrl?: string;
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

export type AiTokenUsage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
};

export type AiGenerationResult = {
  content: AiLandingPageContent;
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
