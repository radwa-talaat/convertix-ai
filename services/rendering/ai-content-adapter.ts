import type { AiLandingPageContent } from "@/types/ai";
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
  direction?: LandingPageDirection;
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
  direction = "ltr",
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
      cta: content.cta,
      headline: content.headline,
      imageAlt: brandName,
      imageUrl: heroImageUrl,
      secondaryCta: copy.secondaryCta,
      subheadline: content.subheadline,
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
  ].map((section) => ({
    ...section,
    visible: sectionVisibility[section.type] ?? section.visible,
  }));

  return {
    direction,
    id: `${slug}-template`,
    name: brandName,
    sections,
    seo: {
      canonicalPath: `/preview/${slug}`,
      description: content.seo.description,
      title: content.seo.title,
    },
    slug,
    themeId,
  };
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
