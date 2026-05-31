import type { AiGenerationInput, AiLandingPageContent } from "@/types/ai";

export function createFallbackLandingPageContent(
  input: AiGenerationInput,
): AiLandingPageContent {
  const isArabic = input.language === "ar";

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
      pricingCopy:
        "ابدأ بخطة مرنة تناسب المرحلة الحالية، ثم وسع الاستخدام عند الحاجة.",
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
    pricingCopy:
      "Start with a flexible plan built for your current stage, then scale when the campaign grows.",
    seo: {
      title: `${input.businessName} | ${input.goal}`,
      description: `${input.businessName} helps ${input.targetAudience} achieve ${input.goal} with a focused ${input.businessType} solution.`,
    },
  };
}
