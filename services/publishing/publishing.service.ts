import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";

import {
  checkPublishRateLimit,
  createPathPublicUrl,
  ensureValidSlug,
} from "@/lib/publishing";
import { buildPublishedPageStructuredData } from "@/lib/seo";
import { createAdminClient } from "@/lib/supabase/admin";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import { parseLandingPageTemplate } from "@/services/rendering";
import type { Json, Tables } from "@/types/database";
import type {
  CustomDomain,
  DomainDnsRecord,
  MetaPixelPage,
  PublishedPage,
  PublishingDashboardSnapshot,
  PublishRequest,
  PublishResult,
  PublishVersion,
  SeoSettings,
} from "@/types/publishing";
import type { LandingPageTemplate } from "@/types/rendering";

export async function publishPage(
  supabase: SupabaseDatabaseClient,
  userId: string,
  request: PublishRequest,
): Promise<PublishResult> {
  const rateLimit = checkPublishRateLimit(userId);

  if (!rateLimit.allowed) {
    throw new Error("Publish rate limit exceeded. Try again shortly.");
  }

  const slug = ensureValidSlug(request.template.slug);
  const publicUrl = createPathPublicUrl(slug);
  const { data: currentPage, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("id", request.pageId)
    .eq("user_id", userId)
    .single();

  if (pageError || !currentPage) {
    throw new Error(pageError?.message ?? "Page not found.");
  }

  const versionNumber = currentPage.version + 1;
  const now = new Date().toISOString();

  const { data: updatedPage, error: updateError } = await supabase
    .from("pages")
    .update({
      content: request.template as unknown as Json,
      published_at: now,
      published_content: request.template as unknown as Json,
      published_url: publicUrl,
      seo: request.template.seo as unknown as Json,
      slug,
      status: "published",
      version: versionNumber,
    })
    .eq("id", request.pageId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (updateError || !updatedPage) {
    throw new Error(updateError?.message ?? "Publish failed.");
  }

  const { data: versionRow, error: versionError } = await supabase
    .from("publish_versions")
    .insert({
      page_id: updatedPage.id,
      project_id: updatedPage.project_id,
      published_url: publicUrl,
      snapshot: request.template as unknown as Json,
      status: "published",
      user_id: userId,
      version: versionNumber,
    })
    .select("*")
    .single();

  if (versionError || !versionRow) {
    throw new Error(versionError?.message ?? "Version history write failed.");
  }

  revalidatePath(`/p/${slug}`);
  revalidatePath("/sitemap.xml");
  revalidateTag("published-pages");

  const page = mapPublishedPage(updatedPage, request.template, [
    mapPublishVersion(versionRow),
  ]);

  return {
    page,
    version: mapPublishVersion(versionRow),
  };
}

export async function unpublishPage(
  supabase: SupabaseDatabaseClient,
  userId: string,
  pageId: string,
) {
  const { data, error } = await supabase
    .from("pages")
    .update({
      published_at: null,
      status: "draft",
    })
    .eq("id", pageId)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unpublish failed.");
  }

  revalidatePath(`/p/${data.slug}`);
  revalidatePath("/sitemap.xml");
  revalidateTag("published-pages");

  return data;
}

export async function republishPage(
  supabase: SupabaseDatabaseClient,
  userId: string,
  pageId: string,
) {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("id", pageId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Page not found.");
  }

  return publishPage(supabase, userId, {
    pageId,
    projectSlug: data.slug,
    template: data.content as unknown as LandingPageTemplate,
  });
}

export async function getPublishingDashboardSnapshot(
  supabase: SupabaseDatabaseClient,
  userId: string,
): Promise<PublishingDashboardSnapshot> {
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  const publishedRows = (pages ?? []).filter(
    (page) => page.status === "published" && page.published_at,
  );
  const pageIds = publishedRows.map((page) => page.id);
  const { data: versions } = pageIds.length
    ? await supabase
        .from("publish_versions")
        .select("*")
        .eq("user_id", userId)
        .in("page_id", pageIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  const { data: domains } = await supabase
    .from("domains")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const versionsByPageId = new Map<string, PublishVersion[]>();

  for (const version of versions ?? []) {
    const mapped = mapPublishVersion(version);
    versionsByPageId.set(version.page_id, [
      ...(versionsByPageId.get(version.page_id) ?? []),
      mapped,
    ]);
  }

  const publishedPages = publishedRows.flatMap((row) => {
    const template = parseLandingPageTemplate(row.published_content);

    if (!template) {
      return [];
    }

    return [
      mapPublishedPage(row, template, versionsByPageId.get(row.id) ?? []),
    ];
  });

  return {
    domains: (domains ?? []).map(mapCustomDomain),
    metaPixelPages: (pages ?? []).map(mapMetaPixelPage),
    pages: publishedPages,
    seo: createDefaultSeoSettings(publishedPages[0]),
  };
}

function mapMetaPixelPage(row: Tables<"pages">): MetaPixelPage {
  return {
    id: row.id,
    metaPixel: {
      enabled: row.meta_pixel_enabled,
      pixelId: row.meta_pixel_id,
    },
    slug: row.slug,
    status: row.status === "published" ? "published" : "draft",
    title: row.title,
  };
}

export const getPublishedPageBySlug = unstable_cache(
  async (slug: string): Promise<PublishedPage | null> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const template = parseLandingPageTemplate(data.published_content);

    if (!template) {
      return null;
    }

    return mapPublishedPage(data, template, []);
  },
  ["published-page-by-slug"],
  {
    revalidate: 60,
    tags: ["published-pages"],
  },
);

export const listPublishedPages = unstable_cache(
  async (): Promise<PublishedPage[]> => {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("status", "published")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.flatMap((row) => {
      const template = parseLandingPageTemplate(row.published_content);
      return template ? [mapPublishedPage(row, template, [])] : [];
    });
  },
  ["published-pages"],
  {
    revalidate: 60,
    tags: ["published-pages"],
  },
);

export function createPublishedPageStructuredData(page: PublishedPage) {
  return buildPublishedPageStructuredData(page);
}

function mapPublishedPage(
  row: Tables<"pages">,
  template: LandingPageTemplate,
  versions: PublishVersion[],
): PublishedPage {
  return {
    id: row.id,
    mode: row.status === "published" ? "published" : "draft",
    metaPixel: {
      enabled: row.meta_pixel_enabled,
      pixelId: row.meta_pixel_id,
    },
    projectId: row.project_id,
    publicUrl: row.published_url ?? createPathPublicUrl(row.slug),
    publishedAt: row.published_at,
    seo: template.seo,
    slug: row.slug,
    status: row.status === "published" ? "published" : "draft",
    template,
    title: row.title,
    updatedAt: row.updated_at,
    versions,
  };
}

function mapPublishVersion(row: Tables<"publish_versions">): PublishVersion {
  return {
    createdAt: row.created_at,
    id: row.id,
    pageId: row.page_id,
    publishedUrl: row.published_url,
    snapshot: row.snapshot as unknown as LandingPageTemplate,
    status: row.status,
    version: row.version,
  };
}

function mapCustomDomain(row: Tables<"domains">): CustomDomain {
  return {
    dnsRecords: parseDnsRecords(row.dns_records),
    hostname: row.hostname,
    id: row.id,
    projectId: row.project_id,
    sslStatus: row.ssl_status,
    status: row.status,
    verificationToken: row.verification_token,
    verifiedAt: row.verified_at,
  };
}

function parseDnsRecords(value: Json): DomainDnsRecord[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((record) => {
    if (!record || typeof record !== "object") {
      return [];
    }

    const candidate = record as Record<string, unknown>;

    if (
      typeof candidate.host !== "string" ||
      typeof candidate.value !== "string" ||
      !["A", "AAAA", "CNAME", "TXT"].includes(String(candidate.type))
    ) {
      return [];
    }

    return [
      {
        host: candidate.host,
        priority:
          typeof candidate.priority === "number"
            ? candidate.priority
            : undefined,
        type: candidate.type as DomainDnsRecord["type"],
        value: candidate.value,
      },
    ];
  });
}

function createDefaultSeoSettings(page?: PublishedPage): SeoSettings {
  return {
    canonicalPath: page ? `/p/${page.slug}` : "/dashboard/publishing",
    description:
      page?.seo.description ??
      "Published landing pages rendered by AI Landing Page Builder.",
    indexing: true,
    title: page?.seo.title ?? "Published landing pages",
    twitterCard: "summary_large_image",
  };
}
