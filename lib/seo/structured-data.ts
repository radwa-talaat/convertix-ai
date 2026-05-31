import type { PublishedPage } from "@/types/publishing";

export function buildPublishedPageStructuredData(page: PublishedPage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    dateModified: page.updatedAt,
    datePublished: page.publishedAt ?? page.updatedAt,
    description: page.seo.description,
    inLanguage: page.template.direction === "rtl" ? "ar" : "en",
    name: page.seo.title,
    url: page.publicUrl,
  };
}
