import { domainInsertSchema } from "@/lib/validators/database";
import type { SupabaseDatabaseClient } from "@/services/database/types";

export async function listDomainsByProject(
  supabase: SupabaseDatabaseClient,
  projectId: string,
) {
  return supabase
    .from("domains")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
}

export async function createDomain(
  supabase: SupabaseDatabaseClient,
  userId: string,
  input: unknown,
) {
  const domain = domainInsertSchema.parse(input);

  return supabase
    .from("domains")
    .insert({
      hostname: domain.hostname,
      project_id: domain.projectId,
      user_id: userId,
    })
    .select("*")
    .single();
}
