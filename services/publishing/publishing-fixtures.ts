import { createPathPublicUrl, createProjectPublicUrl } from "@/lib/publishing";
import { getSampleLandingPageTemplate } from "@/services/rendering";
import type {
  PublishedPage,
  PublishingDashboardSnapshot,
  PublishVersion,
  SeoSettings,
} from "@/types/publishing";

export function getDemoPublishingDashboardSnapshot(): PublishingDashboardSnapshot {
  const now = new Date().toISOString();
  const template = getSampleLandingPageTemplate();
  const publicUrl = createPathPublicUrl(template.slug);
  const version: PublishVersion = {
    createdAt: now,
    id: "version-demo-1",
    pageId: "11111111-1111-4111-8111-111111111111",
    publishedUrl: publicUrl,
    snapshot: template,
    status: "published",
    version: 1,
  };
  const page: PublishedPage = {
    customDomain: "launch.example.com",
    id: "11111111-1111-4111-8111-111111111111",
    mode: "published",
    metaPixel: {
      enabled: false,
      pixelId: null,
    },
    trackingPixels: {
      meta: {
        enabled: false,
        pixelId: null,
      },
      snapchat: {
        enabled: false,
        pixelId: null,
      },
      tiktok: {
        enabled: false,
        pixelId: null,
      },
    },
    projectId: "22222222-2222-4222-8222-222222222222",
    publicUrl,
    publishedAt: now,
    seo: template.seo,
    slug: template.slug,
    status: "published",
    template,
    title: template.name,
    updatedAt: now,
    versions: [version],
  };
  const seo: SeoSettings = {
    ...template.seo,
    indexing: true,
    twitterCard: "summary_large_image",
  };

  return {
    domains: [
      {
        dnsRecords: [
          {
            host: "launch",
            type: "CNAME",
            value: new URL(createProjectPublicUrl(template.slug)).hostname,
          },
          {
            host: "_ai-builder-verify",
            type: "TXT",
            value: "ai-builder-verification=demo-token",
          },
        ],
        hostname: "launch.example.com",
        id: "domain-demo-1",
        pageId: page.id,
        projectId: page.projectId,
        sslStatus: "issued",
        status: "active",
        verificationToken: "demo-token",
        verifiedAt: now,
      },
    ],
    metaPixelPages: [
      {
        id: page.id,
        metaPixel: page.metaPixel,
        slug: page.slug,
        status: page.status,
        title: page.title,
      },
    ],
    pages: [page],
    seo,
  };
}
