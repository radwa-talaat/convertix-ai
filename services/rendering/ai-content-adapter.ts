import { createDefaultSectionStyle } from "@/services/editor/template-mutators.service";
import { defaultEditorThemeTokens } from "@/services/editor/editor-tokens.service";
import type { AiLandingPageContent, AiLandingPageDesign } from "@/types/ai";
import type {
  EditorColorPalette,
  EditorSectionStyle,
  EditorThemeTokens,
  EditorTypographyScale,
} from "@/types/editor";
import type {
  BenefitsSectionData,
  CtaSectionData,
  FaqSectionData,
  FeaturesSectionData,
  FooterSectionData,
  HeroSectionData,
  LandingPageDirection,
  LandingPageSection,
  LandingPageTemplate,
  LandingPageThemeId,
  LeadFormSectionData,
  NavbarSectionData,
  PricingSectionData,
  TestimonialsSectionData,
} from "@/types/rendering";

type BuildLandingPageTemplateOptions = {
  brandName: string;
  content: AiLandingPageContent;
  design?: AiLandingPageDesign;
  direction?: LandingPageDirection;
  heroBackgroundImageUrl?: string;
  heroImageUrl?: string;
  sectionVisibility?: Partial<Record<LandingPageSection["type"], boolean>>;
  slug: string;
  themeId?: LandingPageThemeId;
};

const sectionCopy = {
  ltr: {
    benefits: "Benefits",
    benefitsTitle: "Why this offer matters",
    faq: "FAQ",
    faqTitle: "Clear answers",
    features: "Features",
    featuresTitle: "Everything needed to launch",
    leadForm: "Request",
    leadFormDescription:
      "Leave your details and the team will contact you with the right next step.",
    leadFormTitle: "Request this offer",
    pricing: "Pricing",
    pricingTitle: "Simple path to scale",
    secondaryCta: "View details",
    testimonials: "Testimonials",
    testimonialsTitle: "Trusted by teams moving fast",
  },
  rtl: {
    benefits: "الفوائد",
    benefitsTitle: "لماذا يهم هذا العرض",
    faq: "الأسئلة",
    faqTitle: "إجابات مباشرة",
    features: "المزايا",
    featuresTitle: "كل ما تحتاجه للانطلاق",
    leadForm: "طلب",
    leadFormDescription: "اترك بياناتك وسنتواصل معك بالخطوة المناسبة.",
    leadFormTitle: "اطلب هذا العرض",
    pricing: "السعر",
    pricingTitle: "خطة واضحة للنمو",
    secondaryCta: "شاهد التفاصيل",
    testimonials: "الشهادات",
    testimonialsTitle: "ثقة من فرق مشابهة",
  },
} as const;

export function buildLandingPageTemplate({
  brandName,
  content,
  design,
  direction = "ltr",
  heroBackgroundImageUrl,
  heroImageUrl,
  sectionVisibility = {},
  slug,
  themeId = "linear",
}: BuildLandingPageTemplateOptions): LandingPageTemplate {
  const copy = sectionCopy[direction];
  const sections: LandingPageSection[] = [
    createSection<NavbarSectionData>("navbar", 0, {
      brandName,
      cta: content.cta,
      links: [
        { href: "#features", label: copy.features },
        { href: "#pricing", label: copy.pricing },
        { href: "#faq", label: copy.faq },
      ],
    }),
    createSection<HeroSectionData>("hero", 1, {
      badge: design?.heroBadge,
      cta: content.cta,
      headline: content.headline,
      imageAlt: brandName,
      imageUrl: heroImageUrl,
      layoutVariant: design?.layoutVariant,
      secondaryCta: copy.secondaryCta,
      subheadline: content.subheadline,
      visualPrompt: design?.imagePrompts.productScene,
    }),
    createSection<FeaturesSectionData>("features", 2, {
      eyebrow: copy.features,
      items: content.features,
      title: copy.featuresTitle,
    }),
    createSection<BenefitsSectionData>("benefits", 3, {
      eyebrow: copy.benefits,
      items: content.benefits,
      title: copy.benefitsTitle,
    }),
    createSection<PricingSectionData>("pricing", 4, {
      copy: content.pricingCopy,
      cta: content.cta,
      eyebrow: copy.pricing,
      title: copy.pricingTitle,
    }),
    createSection<TestimonialsSectionData>("testimonials", 5, {
      eyebrow: copy.testimonials,
      items: content.testimonials,
      title: copy.testimonialsTitle,
    }),
    createSection<FaqSectionData>("faq", 6, {
      eyebrow: copy.faq,
      items: content.faq,
      title: copy.faqTitle,
    }),
    createSection<LeadFormSectionData>("lead-form", 7, {
      description: copy.leadFormDescription,
      emailLabel: direction === "rtl" ? "البريد الإلكتروني" : "Email",
      eyebrow: copy.leadForm,
      messageLabel: direction === "rtl" ? "الرسالة" : "Message",
      nameLabel: direction === "rtl" ? "الاسم" : "Name",
      phoneLabel: direction === "rtl" ? "رقم الموبايل" : "Phone",
      productName: brandName,
      submitLabel: content.cta,
      successMessage:
        direction === "rtl"
          ? "تم استلام بياناتك بنجاح."
          : "Your request has been received.",
      title: copy.leadFormTitle,
    }),
    createSection<CtaSectionData>("cta", 8, {
      cta: content.cta,
      description: content.subheadline,
      title: content.headline,
    }),
    createSection<FooterSectionData>("footer", 9, {
      brandName,
      description: content.seo.description,
      links: [
        { href: "#features", label: copy.features },
        { href: "#testimonials", label: copy.testimonials },
        { href: "#faq", label: copy.faq },
      ],
    }),
  ];

  const orderedSections = design
    ? applyAiSectionOrder(sections, design.sectionOrder)
    : sections;

  const finalSections = orderedSections.map((section) => ({
    ...section,
    visible: sectionVisibility[section.type] ?? section.visible,
  }));

  const editorState = design
    ? createEditorStateFromDesign(
        finalSections,
        design,
        direction,
        heroImageUrl,
        heroBackgroundImageUrl,
      )
    : undefined;

  return {
    direction,
    editorState,
    id: `${slug}-template`,
    name: brandName,
    sections: finalSections,
    seo: {
      canonicalPath: `/preview/${slug}`,
      description: content.seo.description,
      title: content.seo.title,
    },
    slug,
    themeId,
  };
}

function applyAiSectionOrder(
  sections: LandingPageSection[],
  requestedOrder: AiLandingPageDesign["sectionOrder"],
) {
  const byType = new Map(sections.map((section) => [section.type, section]));
  const fixedStart = byType.get("navbar");
  const fixedEnd = byType.get("footer");
  const ordered = requestedOrder
    .map((type) => byType.get(type))
    .filter((section): section is LandingPageSection => Boolean(section));
  const missing = sections.filter(
    (section) =>
      section.type !== "navbar" &&
      section.type !== "footer" &&
      !ordered.some((item) => item.type === section.type),
  );
  const next = [fixedStart, ...ordered, ...missing, fixedEnd].filter(
    (section): section is LandingPageSection => Boolean(section),
  );

  return next.map((section, order) => ({ ...section, order }));
}

function createEditorStateFromDesign(
  sections: LandingPageSection[],
  design: AiLandingPageDesign,
  direction: LandingPageDirection,
  heroImageUrl?: string,
  heroBackgroundImageUrl?: string,
): LandingPageTemplate["editorState"] {
  const sectionStyles = Object.fromEntries(
    sections.map((section) => [section.id, createDefaultSectionStyle()]),
  ) as Record<string, EditorSectionStyle>;

  const heroId = findSectionId(sections, "hero");
  const featuresId = findSectionId(sections, "features");
  const pricingId = findSectionId(sections, "pricing");
  const ctaId = findSectionId(sections, "cta");

  if (heroId) {
    sectionStyles[heroId] = {
      ...sectionStyles[heroId],
      ...mapDesignSectionStyle(design.sectionStyles.hero),
      backgroundImageUrl: heroBackgroundImageUrl,
      customTexts: design.heroBadge
        ? [
            {
              color: design.colors.primaryForeground,
              fontSize: 16,
              id: "ai-hero-badge",
              text: design.heroBadge,
              x: direction === "rtl" ? 82 : 18,
              y: 22,
            },
          ]
        : [],
      foregroundImageUrl: heroImageUrl,
      foregroundImageWidth:
        design.imagePlacement === "center"
          ? 360
          : design.imagePlacement === "floating"
            ? 300
            : 320,
      foregroundImageX: resolveImageX(design.imagePlacement, direction),
      foregroundImageY: design.imagePlacement === "center" ? 72 : 58,
      padding: "spacious",
    };
  }

  if (featuresId) {
    sectionStyles[featuresId] = {
      ...sectionStyles[featuresId],
      ...mapDesignSectionStyle(design.sectionStyles.features),
    };
  }

  if (pricingId) {
    sectionStyles[pricingId] = {
      ...sectionStyles[pricingId],
      ...mapDesignSectionStyle(design.sectionStyles.pricing),
    };
  }

  if (ctaId) {
    sectionStyles[ctaId] = {
      ...sectionStyles[ctaId],
      ...mapDesignSectionStyle(design.sectionStyles.cta),
      padding: "spacious",
    };
  }

  return {
    sectionStyles,
    themeTokens: createEditorThemeTokensFromDesign(design),
  };
}

function findSectionId(
  sections: LandingPageSection[],
  type: LandingPageSection["type"],
) {
  return sections.find((section) => section.type === type)?.id;
}

function mapDesignSectionStyle(
  style: AiLandingPageDesign["sectionStyles"]["hero"],
): Partial<EditorSectionStyle> {
  return {
    align: style.align,
    backgroundColor: style.backgroundColor,
    textScale: style.textScale,
  };
}

function createEditorThemeTokensFromDesign(
  design: AiLandingPageDesign,
): EditorThemeTokens {
  const colorPalette: EditorColorPalette = {
    ...design.colors,
    id: `ai-${design.theme}`,
    name: design.theme[0].toUpperCase() + design.theme.slice(1),
  };
  const typography = resolveTypography(design.typographyStyle);

  return {
    ...defaultEditorThemeTokens,
    colorPalette,
    radius: design.theme === "bold" ? "6px" : "16px",
    typography,
  };
}

function resolveTypography(
  style: AiLandingPageDesign["typographyStyle"],
): EditorTypographyScale {
  switch (style) {
    case "bold":
      return {
        body: "Inter, ui-sans-serif, system-ui, sans-serif",
        heading: "Inter, ui-sans-serif, system-ui, sans-serif",
        id: "ai-bold",
        name: "AI Bold",
      };
    case "elegant":
      return {
        body: "Georgia, Cambria, serif",
        heading: "Georgia, Cambria, serif",
        id: "ai-elegant",
        name: "AI Elegant",
      };
    case "playful":
      return {
        body: "Trebuchet MS, Inter, ui-sans-serif, system-ui, sans-serif",
        heading: "Trebuchet MS, Inter, ui-sans-serif, system-ui, sans-serif",
        id: "ai-playful",
        name: "AI Playful",
      };
    case "clean":
    default:
      return {
        body: "Inter, ui-sans-serif, system-ui, sans-serif",
        heading: "Inter, ui-sans-serif, system-ui, sans-serif",
        id: "ai-clean",
        name: "AI Clean",
      };
  }
}

function resolveImageX(
  placement: AiLandingPageDesign["imagePlacement"],
  direction: LandingPageDirection,
) {
  if (placement === "center") {
    return 50;
  }

  if (placement === "floating") {
    return direction === "rtl" ? 20 : 80;
  }

  if (placement === "left") {
    return 22;
  }

  return 78;
}

function createSection<TData>(
  type: LandingPageSection["type"],
  order: number,
  data: TData,
): LandingPageSection<TData> {
  return {
    data,
    id: `${type}-${order}`,
    order,
    type,
    visible: true,
  };
}
