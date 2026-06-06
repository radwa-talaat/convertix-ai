import type { EditorTextField } from "@/types/editor";
import type {
  BenefitsSectionData,
  CtaSectionData,
  FaqSectionData,
  FeaturesSectionData,
  FooterSectionData,
  HeroSectionData,
  LandingPageSection,
  LeadFormSectionData,
  NavbarSectionData,
  PricingSectionData,
  TestimonialsSectionData,
} from "@/types/rendering";

export function getEditableTextFields(
  section?: LandingPageSection,
): EditorTextField[] {
  if (!section) {
    return [];
  }

  switch (section.type) {
    case "navbar": {
      const data = section.data as NavbarSectionData;

      return [
        { label: "Brand", path: "brandName", value: data.brandName },
        { label: "Button", path: "cta", value: data.cta },
        ...data.links.map((link, index) => ({
          label: `Link ${index + 1}`,
          path: `links.${index}.label`,
          value: link.label,
        })),
      ];
    }
    case "hero": {
      const data = section.data as HeroSectionData;

      return [
        {
          label: "Headline",
          multiline: true,
          path: "headline",
          value: data.headline,
        },
        {
          label: "Subheadline",
          multiline: true,
          path: "subheadline",
          value: data.subheadline,
        },
        { label: "CTA", path: "cta", value: data.cta },
        {
          label: "Product image URL",
          path: "imageUrl",
          value: data.imageUrl ?? "",
        },
        {
          label: "Secondary CTA",
          path: "secondaryCta",
          value: data.secondaryCta ?? "",
        },
      ];
    }
    case "features": {
      const data = section.data as FeaturesSectionData;

      return [
        { label: "Eyebrow", path: "eyebrow", value: data.eyebrow },
        { label: "Title", path: "title", value: data.title },
        ...data.items.flatMap((item, index) => [
          {
            label: `Feature ${index + 1} title`,
            path: `items.${index}.title`,
            value: item.title,
          },
          {
            label: `Feature ${index + 1} description`,
            multiline: true,
            path: `items.${index}.description`,
            value: item.description,
          },
        ]),
      ];
    }
    case "benefits": {
      const data = section.data as BenefitsSectionData;

      return [
        { label: "Eyebrow", path: "eyebrow", value: data.eyebrow },
        { label: "Title", path: "title", value: data.title },
        ...data.items.flatMap((item, index) => [
          {
            label: `Benefit ${index + 1} title`,
            path: `items.${index}.title`,
            value: item.title,
          },
          {
            label: `Benefit ${index + 1} description`,
            multiline: true,
            path: `items.${index}.description`,
            value: item.description,
          },
        ]),
      ];
    }
    case "pricing": {
      const data = section.data as PricingSectionData;

      return [
        { label: "Eyebrow", path: "eyebrow", value: data.eyebrow },
        { label: "Title", path: "title", value: data.title },
        { label: "Copy", multiline: true, path: "copy", value: data.copy },
        { label: "CTA", path: "cta", value: data.cta },
      ];
    }
    case "testimonials": {
      const data = section.data as TestimonialsSectionData;

      return [
        { label: "Eyebrow", path: "eyebrow", value: data.eyebrow },
        { label: "Title", path: "title", value: data.title },
        ...data.items.flatMap((item, index) => [
          {
            label: `Quote ${index + 1}`,
            multiline: true,
            path: `items.${index}.quote`,
            value: item.quote,
          },
          {
            label: `Author ${index + 1}`,
            path: `items.${index}.author`,
            value: item.author,
          },
          {
            label: `Role ${index + 1}`,
            path: `items.${index}.role`,
            value: item.role,
          },
        ]),
      ];
    }
    case "faq": {
      const data = section.data as FaqSectionData;

      return [
        { label: "Eyebrow", path: "eyebrow", value: data.eyebrow },
        { label: "Title", path: "title", value: data.title },
        ...data.items.flatMap((item, index) => [
          {
            label: `Question ${index + 1}`,
            path: `items.${index}.question`,
            value: item.question,
          },
          {
            label: `Answer ${index + 1}`,
            multiline: true,
            path: `items.${index}.answer`,
            value: item.answer,
          },
        ]),
      ];
    }
    case "cta": {
      const data = section.data as CtaSectionData;

      return [
        { label: "Title", multiline: true, path: "title", value: data.title },
        {
          label: "Description",
          multiline: true,
          path: "description",
          value: data.description,
        },
        { label: "CTA", path: "cta", value: data.cta },
        ...(data.fields ?? []).flatMap((field, index) => [
          {
            label: `CTA field ${index + 1} label`,
            path: `fields.${index}.label`,
            value: field.label,
          },
          {
            label: `CTA field ${index + 1} value`,
            multiline: true,
            path: `fields.${index}.value`,
            value: field.value,
          },
        ]),
      ];
    }
    case "lead-form": {
      const data = section.data as LeadFormSectionData;

      return [
        { label: "Eyebrow", path: "eyebrow", value: data.eyebrow },
        { label: "Title", multiline: true, path: "title", value: data.title },
        {
          label: "Description",
          multiline: true,
          path: "description",
          value: data.description,
        },
        {
          label: "Product name",
          path: "productName",
          value: data.productName ?? "",
        },
        { label: "Name label", path: "nameLabel", value: data.nameLabel },
        { label: "Phone label", path: "phoneLabel", value: data.phoneLabel },
        { label: "Email label", path: "emailLabel", value: data.emailLabel },
        {
          label: "Message label",
          path: "messageLabel",
          value: data.messageLabel,
        },
        {
          label: "Submit button",
          path: "submitLabel",
          value: data.submitLabel,
        },
        {
          label: "Success message",
          path: "successMessage",
          value: data.successMessage,
        },
      ];
    }
    case "footer": {
      const data = section.data as FooterSectionData;

      return [
        { label: "Brand", path: "brandName", value: data.brandName },
        {
          label: "Description",
          multiline: true,
          path: "description",
          value: data.description,
        },
        ...data.links.map((link, index) => ({
          label: `Link ${index + 1}`,
          path: `links.${index}.label`,
          value: link.label,
        })),
      ];
    }
    default:
      return [];
  }
}
