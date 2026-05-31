import type { Json, Tables } from "@/types/database";
import type { LandingPageSeo, LandingPageTemplate } from "@/types/rendering";

export type PagePublishStatus =
  | "draft"
  | "publishing"
  | "published"
  | "unpublished"
  | "failed";

export type DomainConnectionStatus =
  | "pending"
  | "verified"
  | "failed"
  | "ssl_pending"
  | "active";

export type PublishedPageMode = "draft" | "published";

export type PublishVersion = {
  id: string;
  pageId: string;
  version: number;
  status: PagePublishStatus;
  snapshot: LandingPageTemplate;
  publishedUrl: string;
  createdAt: string;
};

export type PublishedPage = {
  id: string;
  projectId: string;
  title: string;
  slug: string;
  mode: PublishedPageMode;
  status: PagePublishStatus;
  seo: LandingPageSeo;
  template: LandingPageTemplate;
  publishedAt: string | null;
  updatedAt: string;
  publicUrl: string;
  customDomain?: string;
  versions: PublishVersion[];
};

export type DomainDnsRecord = {
  host: string;
  priority?: number;
  type: "A" | "AAAA" | "CNAME" | "TXT";
  value: string;
};

export type CustomDomain = {
  id: string;
  projectId: string;
  hostname: string;
  status: DomainConnectionStatus;
  verificationToken: string;
  sslStatus: "pending" | "issued" | "failed";
  verifiedAt: string | null;
  dnsRecords: DomainDnsRecord[];
};

export type SeoSettings = LandingPageSeo & {
  indexing: boolean;
  ogImage?: string;
  twitterCard: "summary" | "summary_large_image";
};

export type PublishRequest = {
  pageId: string;
  projectSlug: string;
  template: LandingPageTemplate;
};

export type PublishResult = {
  page: PublishedPage;
  version: PublishVersion;
};

export type PublishingDashboardSnapshot = {
  pages: PublishedPage[];
  domains: CustomDomain[];
  seo: SeoSettings;
};

export type PublishVersionRow = Tables<"publish_versions"> & {
  snapshot: Json;
};
