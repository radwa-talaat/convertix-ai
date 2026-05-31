import type { AiLandingPageContent } from "@/types/ai";

export const sampleAiContent: AiLandingPageContent = {
  headline: "Launch campaign pages without slowing your team down",
  subheadline:
    "Create focused, conversion-ready landing page copy for SaaS launches, waitlists, and product campaigns in minutes.",
  cta: "Start Building",
  features: [
    {
      title: "Structured content",
      description:
        "Every page starts from clean JSON, making sections easy to render, reorder, and validate.",
    },
    {
      title: "Reusable sections",
      description:
        "Hero, features, benefits, pricing, FAQ, testimonials, CTA, navbar, and footer all share one rendering contract.",
    },
    {
      title: "Responsive previews",
      description:
        "Review desktop, tablet, and mobile layouts before moving content into future editing workflows.",
    },
  ],
  benefits: [
    {
      title: "Move faster",
      description:
        "Turn a brief into a presentable landing page surface without hand-writing layout code each time.",
    },
    {
      title: "Stay consistent",
      description:
        "Themes and typography presets keep generated pages aligned across campaigns.",
    },
    {
      title: "Scale safely",
      description:
        "Conditional rendering and visibility controls make the system ready for template growth.",
    },
  ],
  faq: [
    {
      question: "Does this use raw HTML from AI?",
      answer:
        "No. The renderer only accepts structured JSON and maps it to trusted React components.",
    },
    {
      question: "Can sections be hidden or reordered?",
      answer:
        "Yes. Each section has order and visibility fields that the layout renderer respects.",
    },
    {
      question: "Is this an editor?",
      answer:
        "No. This phase focuses on rendering and preview only, not drag and drop editing.",
    },
  ],
  testimonials: [
    {
      quote:
        "The rendering foundation made it much easier to preview campaign pages from structured content.",
      author: "Maya Chen",
      role: "Growth Lead",
    },
    {
      quote:
        "The section system feels predictable, which is exactly what a page builder needs before editing is added.",
      author: "Omar Saleh",
      role: "Product Manager",
    },
  ],
  pricingCopy:
    "Start with a focused launch workflow, then scale into templates and publishing when your team is ready.",
  seo: {
    title: "AI Landing Page Builder Preview",
    description:
      "Preview structured AI landing page content rendered through reusable responsive React sections.",
  },
};
