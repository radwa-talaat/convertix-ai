import { getAppOrigin } from "@/lib/publishing";

export function buildRobotsTxt() {
  const baseUrl = getAppOrigin();

  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
