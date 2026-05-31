import { env } from "@/lib/env";

export function buildRobotsTxt() {
  const baseUrl = env.appUrl.replace(/\/$/, "");

  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
}
