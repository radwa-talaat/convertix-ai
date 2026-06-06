"use server";

import { revalidatePath } from "next/cache";

import {
  aiLandingPageContentSchema,
  aiLandingPageDesignSchema,
} from "@/lib/ai/schema";
import { getRequestLocale } from "@/lib/i18n/server";
import { generateSlug } from "@/lib/publishing";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { buildLandingPageTemplate } from "@/services/rendering";
import { hasPaidProjectAccess } from "@/services/subscriptions";
import type { AiLandingPageContent, AiLandingPageDesign } from "@/types/ai";
import type { Json } from "@/types/database";

function cleanProjectName(name: string) {
  const trimmed = name.trim();

  if (trimmed.length < 2 || trimmed.length > 120) {
    throw new Error("Project name must be between 2 and 120 characters.");
  }

  return trimmed;
}

async function ensureUserProfile() {
  const user = await requireUser();
  const admin = createAdminClient();

  await admin.from("users").upsert({
    avatar_url:
      typeof user.user_metadata.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    email: user.email ?? "",
    full_name:
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : null,
    id: user.id,
  });

  return user;
}

async function createAvailableSlug(
  userId: string,
  name: string,
  currentProjectId?: string,
) {
  const supabase = createClient();
  const baseSlug = generateSlug(name);
  const { data, error } = await supabase
    .from("projects")
    .select("id, slug")
    .eq("user_id", userId)
    .like("slug", `${baseSlug}%`);

  if (error) {
    throw new Error(error.message);
  }

  const existing = new Set(
    (data ?? [])
      .filter((project) => project.id !== currentProjectId)
      .map((project) => project.slug),
  );

  if (!existing.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;

  while (existing.has(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

async function createAvailablePageSlug(projectId: string, title: string) {
  const supabase = createClient();
  const baseSlug = generateSlug(title);
  const { data, error } = await supabase
    .from("pages")
    .select("slug")
    .eq("project_id", projectId)
    .like("slug", `${baseSlug}%`);

  if (error) {
    throw new Error(error.message);
  }

  const existing = new Set((data ?? []).map((page) => page.slug));

  if (!existing.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  let candidate = `${baseSlug}-${suffix}`;

  while (existing.has(candidate)) {
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }

  return candidate;
}

export async function createProjectAction(name: string) {
  const user = await ensureUserProfile();
  const supabase = createClient();
  const projectName = cleanProjectName(name);
  const slug = await createAvailableSlug(user.id, projectName);

  const { data: projectId, error } = await supabase.rpc("create_paid_project", {
    project_locale: getRequestLocale(),
    project_name: projectName,
    project_slug: slug,
  });

  if (error) {
    if (error.message.includes("PAYMENT_REQUIRED")) {
      throw new Error(
        "You need to buy a landing page before creating a new project.",
      );
    }

    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");

  return projectId;
}

export async function updateProjectNameAction(projectId: string, name: string) {
  const user = await requireUser();
  const supabase = createClient();
  const projectName = cleanProjectName(name);
  const slug = await createAvailableSlug(user.id, projectName, projectId);

  const { error } = await supabase
    .from("projects")
    .update({
      name: projectName,
      slug,
    })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");
}

export async function deleteProjectAction(projectId: string) {
  const user = await requireUser();
  const supabase = createClient();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");
}

export async function createLandingPageFromAiAction(
  projectId: string,
  content: AiLandingPageContent,
  language: "ar" | "en" = "en",
  heroImageUrl?: string,
  design?: AiLandingPageDesign,
  heroBackgroundImageUrl?: string,
) {
  const user = await requireUser();
  const supabase = createClient();
  const safeContent = aiLandingPageContentSchema.parse(content);
  const safeDesign = design
    ? aiLandingPageDesignSchema.parse(design)
    : undefined;
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id, name, slug")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (projectError || !project) {
    throw new Error(projectError?.message ?? "Project not found.");
  }

  if (!(await hasPaidProjectAccess(supabase, user.id, project.id))) {
    throw new Error(
      "Payment is required before creating a landing page in this project.",
    );
  }

  const { count: existingPageCount, error: pageCountError } = await supabase
    .from("pages")
    .select("id", { count: "exact", head: true })
    .eq("project_id", project.id)
    .eq("user_id", user.id);

  if (pageCountError) {
    throw new Error(pageCountError.message);
  }

  if ((existingPageCount ?? 0) > 0) {
    throw new Error(
      "This paid project already has a landing page. Open it in the editor instead.",
    );
  }

  const title = safeContent.seo.title || project.name;
  const pageSlug = await createAvailablePageSlug(project.id, title);
  const template = buildLandingPageTemplate({
    brandName: project.name,
    content: safeContent,
    design: safeDesign,
    direction: language === "ar" ? "rtl" : "ltr",
    heroBackgroundImageUrl,
    heroImageUrl,
    slug: pageSlug,
  });

  const admin = createAdminClient();
  const { data: page, error } = await admin
    .from("pages")
    .insert({
      content: template as unknown as Json,
      project_id: project.id,
      seo: template.seo as unknown as Json,
      slug: pageSlug,
      status: "draft",
      title,
      user_id: user.id,
    })
    .select("id, slug")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${project.id}`);

  return page;
}

export async function updateLandingPageDraftAction(
  pageId: string,
  content: Json,
  seo: Json,
) {
  const user = await requireUser();
  const supabase = createClient();
  const { data: page, error } = await supabase
    .from("pages")
    .update({
      content,
      seo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pageId)
    .eq("user_id", user.id)
    .select("id, project_id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${page.project_id}`);
  revalidatePath("/dashboard/editor");

  return page;
}
