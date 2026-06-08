import { notFound } from "next/navigation";

import {
  AnalyticsTracker,
  CookieConsent,
  MetaPixelTracker,
  SnapchatPixelTracker,
  TikTokPixelTracker,
} from "@/components/analytics";
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
      {page.metaPixel.enabled && page.metaPixel.pixelId ? (
        <MetaPixelTracker
          pageId={page.id}
          pageSlug={page.slug}
          pixelId={page.metaPixel.pixelId}
        />
      ) : null}
      {page.trackingPixels.tiktok.enabled &&
      page.trackingPixels.tiktok.pixelId ? (
        <TikTokPixelTracker
          pageId={page.id}
          pageSlug={page.slug}
          pixelId={page.trackingPixels.tiktok.pixelId}
        />
      ) : null}
      {page.trackingPixels.snapchat.enabled &&
      page.trackingPixels.snapchat.pixelId ? (
        <SnapchatPixelTracker
          pageId={page.id}
          pageSlug={page.slug}
          pixelId={page.trackingPixels.snapchat.pixelId}
        />
      ) : null}
      <LayoutRenderer
        renderContext={{
          landingPageTitle: page.title,
          pageId: page.id,
          pageSlug: page.slug,
          projectId: page.projectId,
        }}
        template={page.template}
      />
      <CookieConsent />
    </>
  );
}
