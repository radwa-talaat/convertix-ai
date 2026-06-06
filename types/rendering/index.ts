import type {
  AiBenefit,
  AiFaqItem,
  AiFeature,
  AiTestimonial,
} from "@/types/ai";
import type { EditorSectionStyle, EditorThemeTokens } from "@/types/editor";
import type { ReactNode } from "react";

export type LandingPageSectionType =
  | "navbar"
  | "hero"
  | "features"
  | "benefits"
  | "pricing"
  | "testimonials"
  | "faq"
  | "lead-form"
  | "cta"
  | "footer";

export type LandingPageThemeId = "linear" | "framer" | "midnight";

export type LandingPageDirection = "ltr" | "rtl";

export type LandingPageSection<TData = unknown> = {
  id: string;
  type: LandingPageSectionType;
  data: TData;
  order: number;
  visible: boolean;
};

export type LandingPageSeo = {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
};

export type LandingPageTemplate = {
  id: string;
  slug: string;
  name: string;
  direction: LandingPageDirection;
  editorState?: {
    sectionStyles?: Record<string, EditorSectionStyle>;
    themeTokens?: EditorThemeTokens;
  };
  themeId: LandingPageThemeId;
  seo: LandingPageSeo;
  sections: LandingPageSection[];
};

export type LandingPageTheme = {
  id: LandingPageThemeId;
  name: string;
  colors: {
    background: string;
    foreground: string;
    muted: string;
    surface: string;
    border: string;
    primary: string;
    primaryForeground: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
    textScale?: number;
  };
  radius: string;
};

export type NavbarSectionData = {
  brandName: string;
  links: Array<{ label: string; href: string }>;
  cta: string;
};

export type HeroSectionData = {
  badge?: string;
  headline: string;
  imageAlt?: string;
  imageUrl?: string;
  layoutVariant?:
    | "split"
    | "centered"
    | "product-showcase"
    | "editorial"
    | "stacked";
  visualPrompt?: string;
  subheadline: string;
  cta: string;
  secondaryCta?: string;
};

export type FeaturesSectionData = {
  eyebrow: string;
  title: string;
  items: AiFeature[];
};

export type BenefitsSectionData = {
  eyebrow: string;
  title: string;
  items: AiBenefit[];
};

export type PricingSectionData = {
  eyebrow: string;
  title: string;
  copy: string;
  cta: string;
};

export type TestimonialsSectionData = {
  eyebrow: string;
  title: string;
  items: AiTestimonial[];
};

export type FaqSectionData = {
  eyebrow: string;
  title: string;
  items: AiFaqItem[];
};

export type CtaSectionField = {
  id: string;
  label: string;
  value: string;
};

export type CtaSectionData = {
  title: string;
  description: string;
  cta: string;
  fields?: CtaSectionField[];
};

export type LeadFormSectionData = {
  eyebrow: string;
  title: string;
  description: string;
  productName?: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  successMessage: string;
};

export type FooterSectionData = {
  brandName: string;
  description: string;
  links: Array<{ label: string; href: string }>;
};

export type LandingPageSectionProps<TData = unknown> = {
  data: TData;
  direction: LandingPageDirection;
  editor?: {
    renderText: (options: LandingPageEditableTextOptions) => ReactNode;
  };
  renderContext?: LandingPageRenderContext;
  sectionId: string;
  theme: LandingPageTheme;
};

export type LandingPageRenderContext = {
  landingPageTitle?: string;
  pageId?: string;
  pageSlug?: string;
  projectId?: string;
};

export type LandingPageEditableTextOptions = {
  className?: string;
  multiline?: boolean;
  path: string;
  value: string;
};

export type PreviewDevice = "desktop" | "tablet" | "mobile";
