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
  NavbarSectionData,
  PricingSectionData,
  TestimonialsSectionData,
} from "@/types/rendering";

type BuildLandingPageTemplateOptions = {
  brandName: string;
  content: AiLandingPageContent;
  direction?: LandingPageDirection;
  sectionVisibility?: Partial<Record<LandingPageSection["type"], boolean>>;
  slug: string;
  themeId?: LandingPageThemeId;
};

export function buildLandingPageTemplate({
  brandName,
  content,
  direction = "ltr",
  sectionVisibility = {},
  slug,
  themeId = "linear",
}: BuildLandingPageTemplateOptions): LandingPageTemplate {
  const sections: LandingPageSection[] = [
    createSection<NavbarSectionData>("navbar", 0, {
      brandName,
      cta: content.cta,
      links: [
        {
          href: "#features",
          label: direction === "rtl" ? "المزايا" : "Features",
        },
        { href: "#pricing", label: direction === "rtl" ? "السعر" : "Pricing" },
        { href: "#faq", label: direction === "rtl" ? "الأسئلة" : "FAQ" },
      ],
    }),
    createSection<HeroSectionData>("hero", 1, {
      cta: content.cta,
      headline: content.headline,
      secondaryCta: direction === "rtl" ? "شاهد التفاصيل" : "View details",
      subheadline: content.subheadline,
    }),
    createSection<FeaturesSectionData>("features", 2, {
      eyebrow: direction === "rtl" ? "المزايا" : "Features",
      items: content.features,
      title:
        direction === "rtl"
          ? "كل ما تحتاجه للانطلاق"
          : "Everything needed to launch",
    }),
    createSection<BenefitsSectionData>("benefits", 3, {
      eyebrow: direction === "rtl" ? "الفوائد" : "Benefits",
      items: content.benefits,
      title:
        direction === "rtl" ? "لماذا يهم هذا العرض" : "Why this offer matters",
    }),
    createSection<PricingSectionData>("pricing", 4, {
      copy: content.pricingCopy,
      cta: content.cta,
      eyebrow: direction === "rtl" ? "التسعير" : "Pricing",
      title: direction === "rtl" ? "خطة واضحة للنمو" : "Simple path to scale",
    }),
    createSection<TestimonialsSectionData>("testimonials", 5, {
      eyebrow: direction === "rtl" ? "آراء العملاء" : "Testimonials",
      items: content.testimonials,
      title:
        direction === "rtl"
          ? "ثقة من فرق مشابهة"
          : "Trusted by teams moving fast",
    }),
    createSection<FaqSectionData>("faq", 6, {
      eyebrow: direction === "rtl" ? "الأسئلة الشائعة" : "FAQ",
      items: content.faq,
      title: direction === "rtl" ? "إجابات مباشرة" : "Clear answers",
    }),
    createSection<CtaSectionData>("cta", 7, {
      cta: content.cta,
      description: content.subheadline,
      title: content.headline,
    }),
    createSection<FooterSectionData>("footer", 8, {
      brandName,
      description: content.seo.description,
      links: [
        {
          href: "#features",
          label: direction === "rtl" ? "المزايا" : "Features",
        },
        {
          href: "#testimonials",
          label: direction === "rtl" ? "الشهادات" : "Testimonials",
        },
        { href: "#faq", label: direction === "rtl" ? "الأسئلة" : "FAQ" },
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
