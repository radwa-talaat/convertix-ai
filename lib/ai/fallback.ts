import type {
  AiGeneratedLandingPage,
  AiGenerationInput,
  AiLandingPageContent,
  AiLandingPageDesign,
} from "@/types/ai";

export function createFallbackLandingPageGeneration(
  input: AiGenerationInput,
): AiGeneratedLandingPage {
  return {
    content: createFallbackLandingPageContent(input),
    design: createFallbackLandingPageDesign(input),
  };
}

export function createFallbackLandingPageContent(
  input: AiGenerationInput,
): AiLandingPageContent {
  const isArabic = input.language === "ar";
  const offerCopy = createFallbackOfferCopy(input, isArabic);

  if (isArabic) {
    return {
      headline: `${input.businessName} يساعدك على تحقيق ${input.goal}`,
      subheadline: `حل عملي ومصمم بعناية لـ ${input.targetAudience}، يجمع بين الوضوح والسرعة وأسلوب ${input.brandStyle}.`,
      cta: "ابدأ الآن",
      features: [
        {
          title: "رسالة واضحة",
          description: "صياغة مباشرة تشرح القيمة الأساسية بدون تعقيد.",
        },
        {
          title: "تجربة موثوقة",
          description: "محتوى منظم يساعد الزائر على فهم العرض واتخاذ القرار.",
        },
        {
          title: "جاهزية للنمو",
          description: "هيكل محتوى قابل للتطوير مع الحملات القادمة.",
        },
      ],
      benefits: [
        {
          title: "زيادة الثقة",
          description: "يعرض الفوائد بشكل مقنع ومناسب للجمهور المستهدف.",
        },
        {
          title: "تقليل التشتت",
          description: "يركز على هدف واحد واضح داخل الصفحة.",
        },
        {
          title: "تحسين التحويل",
          description: "يدعم مسار قرار بسيط من العنوان إلى الدعوة للإجراء.",
        },
      ],
      faq: [
        {
          question: `هل يناسب ${input.businessName} احتياجاتي؟`,
          answer: `نعم، تم تصميم الرسالة لتناسب ${input.targetAudience} وهدف ${input.goal}.`,
        },
        {
          question: "ما الذي يميز هذا العرض؟",
          answer: `يجمع بين أسلوب ${input.brandStyle} ونبرة ${input.toneOfVoice} بشكل واضح.`,
        },
        {
          question: "كيف أبدأ؟",
          answer: "استخدم الدعوة للإجراء وابدأ بتجربة العرض الأساسي.",
        },
      ],
      testimonials: [
        {
          quote: "الرسالة أصبحت أوضح وأسهل في الفهم من أول زيارة.",
          author: "عميل تجريبي",
          role: input.businessType,
        },
        {
          quote: "ساعدنا التركيز على قيمة واحدة في تحسين تجربة الصفحة.",
          author: "فريق النمو",
          role: "Growth Team",
        },
      ],
      pricingCopy: offerCopy,
      seo: {
        title: `${input.businessName} | ${input.goal}`,
        description: `${input.businessName} يقدم حلاً واضحاً لـ ${input.targetAudience} بأسلوب ${input.brandStyle}.`,
      },
    };
  }

  return {
    headline: `${input.businessName} helps you achieve ${input.goal}`,
    subheadline: `A focused ${input.businessType} solution for ${input.targetAudience}, shaped with a ${input.brandStyle} brand style and ${input.toneOfVoice} voice.`,
    cta: "Get Started",
    features: [
      {
        title: "Clear positioning",
        description:
          "Communicate the core value in a direct, conversion-focused way.",
      },
      {
        title: "Trust-led structure",
        description:
          "Guide visitors through proof, value, and action without friction.",
      },
      {
        title: "Campaign-ready copy",
        description:
          "Use a scalable content foundation for future landing page tests.",
      },
    ],
    benefits: [
      {
        title: "Increase clarity",
        description:
          "Make the offer easier to understand for the target audience.",
      },
      {
        title: "Reduce hesitation",
        description: "Answer key objections before visitors reach the CTA.",
      },
      {
        title: "Improve conversion intent",
        description: "Align every section around a single measurable goal.",
      },
    ],
    faq: [
      {
        question: `Who is ${input.businessName} for?`,
        answer: `It is positioned for ${input.targetAudience} who want to achieve ${input.goal}.`,
      },
      {
        question: "What makes this offer different?",
        answer: `The messaging combines ${input.brandStyle} positioning with a ${input.toneOfVoice} tone.`,
      },
      {
        question: "How do I get started?",
        answer: "Use the primary call to action and begin with the core offer.",
      },
    ],
    testimonials: [
      {
        quote:
          "The page made the offer easier to understand from the first visit.",
        author: "Pilot Customer",
        role: input.businessType,
      },
      {
        quote:
          "The sharper message helped our team focus on the right conversion goal.",
        author: "Growth Team",
        role: "Marketing",
      },
    ],
    pricingCopy: offerCopy,
    seo: {
      title: `${input.businessName} | ${input.goal}`,
      description: `${input.businessName} helps ${input.targetAudience} achieve ${input.goal} with a focused ${input.businessType} solution.`,
    },
  };
}

function createFallbackOfferCopy(input: AiGenerationInput, isArabic: boolean) {
  const suppliedOffer = [input.productPrice, input.offer]
    .filter(Boolean)
    .join(isArabic ? " مع " : " with ");

  if (suppliedOffer) {
    return isArabic
      ? `العرض واضح: ${suppliedOffer}. اطلب الآن وسيتم التواصل معك بالطريقة المناسبة.`
      : `Offer: ${suppliedOffer}. Order now and the team will follow up with the right next step.`;
  }

  return isArabic
    ? "عرض واضح ومباشر يساعد العميل على اتخاذ القرار بثقة."
    : "A clear, direct offer designed to help customers decide with confidence.";
}

export function createFallbackLandingPageDesign(
  input: AiGenerationInput,
): AiLandingPageDesign {
  const brief = [
    input.businessName,
    input.businessType,
    input.productCategory,
    input.brandStyle,
  ]
    .join(" ")
    .toLowerCase();

  if (/(perfume|fragrance|عطر|عطور|برفان)/i.test(brief)) {
    return createDesignPreset(input, {
      accent: "#d9b45f",
      background: "#f7f1e7",
      border: "#e2d4bd",
      foreground: "#18130d",
      muted: "#746756",
      primary: "#17120c",
      primaryForeground: "#ffffff",
      surface: "#fffaf2",
      theme: "luxury",
      typographyStyle: "elegant",
    });
  }

  if (/(medical|clinic|doctor|health|طبي|عيادة|صحة|دكتور)/i.test(brief)) {
    return createDesignPreset(input, {
      accent: "#9ddcff",
      background: "#edf8fb",
      border: "#c8e5ee",
      foreground: "#0d2430",
      muted: "#53717b",
      primary: "#0b5f79",
      primaryForeground: "#ffffff",
      surface: "#ffffff",
      theme: "medical",
      typographyStyle: "clean",
    });
  }

  if (/(men|male|max man|رجال|رجالي|ذكر|ذكور)/i.test(brief)) {
    return createDesignPreset(input, {
      accent: "#f6c453",
      background: "#111111",
      border: "#2c2c2c",
      foreground: "#fff9ed",
      muted: "#c0b7a7",
      primary: "#f04f32",
      primaryForeground: "#ffffff",
      surface: "#1b1b1b",
      theme: "bold",
      typographyStyle: "bold",
    });
  }

  return createDesignPreset(input, {
    accent: "#d7fb72",
    background: "#f7f7f2",
    border: "#deded4",
    foreground: "#10100e",
    muted: "#68685f",
    primary: "#111111",
    primaryForeground: "#ffffff",
    surface: "#ffffff",
    theme: "minimal",
    typographyStyle: "clean",
  });
}

function createDesignPreset(
  input: AiGenerationInput,
  preset: AiLandingPageDesign["colors"] & {
    theme: AiLandingPageDesign["theme"];
    typographyStyle: AiLandingPageDesign["typographyStyle"];
  },
): AiLandingPageDesign {
  const isArabic = input.language === "ar";

  return {
    backgroundStyle: isArabic
      ? "خلفية منتج نظيفة مع مساحة قوية للصورة والدعوة للشراء"
      : "Clean product-first background with strong image and CTA space",
    colors: {
      accent: preset.accent,
      background: preset.background,
      border: preset.border,
      foreground: preset.foreground,
      muted: preset.muted,
      primary: preset.primary,
      primaryForeground: preset.primaryForeground,
      surface: preset.surface,
    },
    designNotes: isArabic
      ? [
          "اجعل صورة المنتج واضحة في الهيرو.",
          "استخدم تباين قوي بين العنوان والزر.",
          "اعرض السعر أو العرض بالقرب من أول دعوة للشراء.",
        ]
      : [
          "Keep the product image visible in the hero.",
          "Use strong contrast between headline and CTA.",
          "Place price or offer close to the first action.",
        ],
    heroBadge:
      input.offer ||
      input.productPrice ||
      (isArabic ? "عرض خاص" : "Featured offer"),
    imagePrompts: {
      heroBackground: isArabic
        ? `خلفية إعلانية أنيقة لمنتج ${input.businessName} بألوان البراند ومساحة واضحة للنص`
        : `Elegant advertising background for ${input.businessName} using brand colors with clean copy space`,
      productScene: isArabic
        ? `مشهد منتج احترافي يعرض ${input.businessName} بطريقة مناسبة لفئة ${input.productCategory || input.businessType}`
        : `Professional product scene for ${input.businessName}, suitable for ${input.productCategory || input.businessType}`,
      sectionMotifs: isArabic
        ? ["تفاصيل قريبة من المنتج", "خلفية نظيفة عالية التباين"]
        : ["Product close-up details", "Clean high-contrast background"],
    },
    imagePlacement: isArabic ? "left" : "right",
    layoutVariant:
      preset.theme === "bold"
        ? "product-showcase"
        : preset.theme === "luxury"
          ? "editorial"
          : "split",
    sectionStyles: {
      cta: {
        align: "center",
        backgroundColor: preset.primary,
        textScale: 105,
      },
      features: {
        align: isArabic ? "end" : "start",
        backgroundColor: preset.surface,
        textScale: 100,
      },
      hero: {
        align: isArabic ? "end" : "start",
        backgroundColor: preset.background,
        textScale: 112,
      },
      pricing: {
        align: "center",
        backgroundColor: preset.surface,
        textScale: 102,
      },
    },
    sectionOrder: [
      "hero",
      preset.theme === "bold" ? "benefits" : "features",
      preset.theme === "bold" ? "features" : "benefits",
      "pricing",
      "lead-form",
      "faq",
      "testimonials",
      "cta",
    ],
    textScale: 108,
    theme: preset.theme,
    typographyStyle: preset.typographyStyle,
  };
}
