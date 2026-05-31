import { unstable_cache, revalidatePath } from "next/cache";

import {
  checkPublishRateLimit,
  createPathPublicUrl,
  ensureValidSlug,
} from "@/lib/publishing";
import { buildPublishedPageStructuredData } from "@/lib/seo";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import { getPublishingDashboardSnapshot } from "@/services/publishing/publishing-fixtures";
import type { Json, Tables } from "@/types/database";
import type {
  PublishedPage,
  PublishRequest,
  PublishResult,
  PublishVersion,
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

export const getPublishedPageBySlug = unstable_cache(
  async (slug: string): Promise<PublishedPage | null> => {
    const snapshot = getPublishingDashboardSnapshot();
    return snapshot.pages.find((page) => page.slug === slug) ?? null;
  },
  ["published-page-by-slug"],
  {
    revalidate: 60,
    tags: ["published-pages"],
  },
);

export const listPublishedPages = unstable_cache(
  async (): Promise<PublishedPage[]> =>
    getPublishingDashboardSnapshot().pages.filter(
      (page) => page.mode === "published",
    ),
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
