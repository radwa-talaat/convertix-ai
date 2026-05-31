import type { SupabaseDatabaseClient } from "@/services/database/types";

export async function listAvailableTemplates(
  supabase: SupabaseDatabaseClient,
  userId: string,
) {
  return supabase
    .from("templates")
    .select("*")
    .or(`visibility.eq.public,user_id.eq.${userId}`)
    .order("created_at", { ascending: false });
}

export async function getTemplateById(
  supabase: SupabaseDatabaseClient,
  templateId: string,
) {
  return supabase.from("templates").select("*").eq("id", templateId).single();
}
