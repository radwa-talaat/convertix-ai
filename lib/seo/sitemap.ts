import type { PublishedPage } from "@/types/publishing";

export function buildSitemapXml(pages: PublishedPage[]): string {
  const urls = pages
    .filter((page) => page.mode === "published")
    .map(
      (page) => `<url>
  <loc>${escapeXml(page.publicUrl)}</loc>
  <lastmod>${new Date(page.updatedAt).toISOString()}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
