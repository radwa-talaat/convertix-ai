import type { MetadataRoute } from "next";

import { locales } from "@/lib/i18n/config";
import { getDeploymentAppUrl } from "@/lib/urls";
import { listPublishedPages } from "@/services/publishing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getDeploymentAppUrl();
  const localizedRoutes = ["/", "/dashboard", "/pricing"].flatMap((route) =>
    locales.map((locale) => {
      const path = route === "/" ? `/${locale}` : `/${locale}${route}`;

      return {
        alternates: {
          languages: Object.fromEntries(
            locales.map((item) => [
              item,
              `${baseUrl}${route === "/" ? `/${item}` : `/${item}${route}`}`,
            ]),
          ),
        },
        changeFrequency: "weekly" as const,
        lastModified: new Date(),
        priority: route === "/" ? 1 : 0.7,
        url: `${baseUrl}${path}`,
      };
    }),
  );
  const pages = await listPublishedPages();

  return [
    ...localizedRoutes,
    ...pages.map((page) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(page.updatedAt),
      priority: 0.8,
      url: page.publicUrl,
    })),
  ];
}
