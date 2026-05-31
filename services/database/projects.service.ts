import { projectInsertSchema } from "@/lib/validators/database";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Updates } from "@/types/database";

export async function listProjects(
  supabase: SupabaseDatabaseClient,
  userId: string,
) {
  return supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
}

export async function getProjectById(
  supabase: SupabaseDatabaseClient,
  projectId: string,
) {
  return supabase.from("projects").select("*").eq("id", projectId).single();
}

export async function createProject(
  supabase: SupabaseDatabaseClient,
  userId: string,
  input: unknown,
) {
  const project = projectInsertSchema.parse(input);

  return supabase
    .from("projects")
    .insert({
      user_id: userId,
      ...project,
    })
    .select("*")
    .single();
}

export async function updateProject(
  supabase: SupabaseDatabaseClient,
  projectId: string,
  updates: Updates<"projects">,
) {
  return supabase
    .from("projects")
    .update(updates)
    .eq("id", projectId)
    .select("*")
    .single();
}
