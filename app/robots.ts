import type { MetadataRoute } from "next";

import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.appUrl.replace(/\/$/, "");

  return {
    host: baseUrl,
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
