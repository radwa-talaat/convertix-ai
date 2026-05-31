import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import type { LandingPageTemplate } from "@/types/rendering";

export function buildLandingPageMetadata(
  template: LandingPageTemplate,
): Metadata {
  const canonicalUrl = new URL(template.seo.canonicalPath, siteConfig.url);

  return {
    alternates: {
      canonical: canonicalUrl,
    },
    description: template.seo.description,
    openGraph: {
      description: template.seo.description,
      images: template.seo.ogImage ? [template.seo.ogImage] : undefined,
      title: template.seo.title,
      type: "website",
      url: canonicalUrl,
    },
    title: template.seo.title,
    twitter: {
      card: "summary_large_image",
      description: template.seo.description,
      title: template.seo.title,
    },
  };
}

export function buildLandingPageStructuredData(template: LandingPageTemplate) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    description: template.seo.description,
    inLanguage: template.direction === "rtl" ? "ar" : "en",
    name: template.seo.title,
    url: new URL(template.seo.canonicalPath, siteConfig.url).toString(),
  };
}
