import type { MetadataRoute } from "next";

import { getAppOrigin } from "@/lib/publishing";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppOrigin();

  return {
    host: baseUrl,
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
