import { pageInsertSchema } from "@/lib/validators/database";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Updates } from "@/types/database";

export async function listPagesByProject(
  supabase: SupabaseDatabaseClient,
  projectId: string,
) {
  return supabase
    .from("pages")
    .select("*")
    .eq("project_id", projectId)
    .order("updated_at", { ascending: false });
}

export async function getPageById(
  supabase: SupabaseDatabaseClient,
  pageId: string,
) {
  return supabase.from("pages").select("*").eq("id", pageId).single();
}

export async function createPage(
  supabase: SupabaseDatabaseClient,
  userId: string,
  input: unknown,
) {
  const page = pageInsertSchema.parse(input);

  return supabase
    .from("pages")
    .insert({
      project_id: page.projectId,
      slug: page.slug,
      title: page.title,
      user_id: userId,
    })
    .select("*")
    .single();
}

export async function updatePage(
  supabase: SupabaseDatabaseClient,
  pageId: string,
  updates: Updates<"pages">,
) {
  return supabase
    .from("pages")
    .update(updates)
    .eq("id", pageId)
    .select("*")
    .single();
}
