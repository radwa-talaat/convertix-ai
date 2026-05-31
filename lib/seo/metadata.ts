import type { Metadata } from "next";

import type { PublishedPage, SeoSettings } from "@/types/publishing";

export function buildPublishedPageMetadata(page: PublishedPage): Metadata {
  const title = page.seo.title;
  const description = page.seo.description;

  return {
    alternates: {
      canonical: page.publicUrl,
    },
    description,
    openGraph: {
      description,
      title,
      type: "website",
      url: page.publicUrl,
    },
    robots: page.mode === "published" ? "index, follow" : "noindex, nofollow",
    title,
    twitter: {
      card: "summary_large_image",
      description,
      title,
    },
  };
}

export function buildSeoSettingsMetadata(seo: SeoSettings): Metadata {
  return {
    alternates: {
      canonical: seo.canonicalPath,
    },
    description: seo.description,
    openGraph: {
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
      title: seo.title,
    },
    robots: seo.indexing ? "index, follow" : "noindex, nofollow",
    title: seo.title,
    twitter: {
      card: seo.twitterCard,
      description: seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
      title: seo.title,
    },
  };
}
