import { notFound } from "next/navigation";

import { AnalyticsTracker, CookieConsent } from "@/components/analytics";
import { LayoutRenderer } from "@/components/landing-page";
import {
  buildPublishedPageMetadata,
  buildPublishedPageStructuredData,
} from "@/lib/seo";
import { getPublishedPageBySlug } from "@/services/publishing";

export const revalidate = 60;

type PublishedPageRouteProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PublishedPageRouteProps) {
  const page = await getPublishedPageBySlug(params.slug);

  if (!page) {
    return {};
  }

  return buildPublishedPageMetadata(page);
}

export default async function PublishedPageRoute({
  params,
}: PublishedPageRouteProps) {
  const page = await getPublishedPageBySlug(params.slug);

  if (!page || page.mode !== "published") {
    notFound();
  }

  const structuredData = buildPublishedPageStructuredData(page);

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <AnalyticsTracker
        pageId={page.id}
        pageSlug={page.slug}
        projectId={page.projectId}
      />
      <LayoutRenderer template={page.template} />
      <CookieConsent />
    </>
  );
}
