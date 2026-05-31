import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Inserts, Updates } from "@/types/database";

export async function createAiGenerationRecord(
  supabase: SupabaseDatabaseClient,
  generation: Inserts<"ai_generations">,
) {
  return supabase
    .from("ai_generations")
    .insert(generation)
    .select("*")
    .single();
}

export async function updateAiGenerationRecord(
  supabase: SupabaseDatabaseClient,
  generationId: string,
  updates: Updates<"ai_generations">,
) {
  return supabase
    .from("ai_generations")
    .update(updates)
    .eq("id", generationId)
    .select("*")
    .single();
}

export async function listAiGenerationsByProject(
  supabase: SupabaseDatabaseClient,
  projectId: string,
) {
  return supabase
    .from("ai_generations")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
}
