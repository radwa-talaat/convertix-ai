"use server";

import { revalidatePath } from "next/cache";

import { generateSlug } from "@/lib/publishing";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";

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

export async function createProjectAction(name: string) {
  const user = await ensureUserProfile();
  const supabase = createClient();
  const projectName = cleanProjectName(name);
  const slug = await createAvailableSlug(user.id, projectName);

  const { error } = await supabase.from("projects").insert({
    name: projectName,
    slug,
    status: "draft",
    user_id: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/projects");
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
