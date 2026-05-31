import type { MetadataRoute } from "next";

import { listPublishedPages } from "@/services/publishing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await listPublishedPages();

  return pages.map((page) => ({
    changeFrequency: "weekly",
    lastModified: new Date(page.updatedAt),
    priority: 0.8,
    url: page.publicUrl,
  }));
}
