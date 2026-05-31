import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Inserts } from "@/types/database";

export async function createAnalyticsEvent(
  supabase: SupabaseDatabaseClient,
  event: Inserts<"analytics">,
) {
  return supabase.from("analytics").insert(event).select("*").single();
}

export async function listRecentAnalytics(
  supabase: SupabaseDatabaseClient,
  projectId: string,
) {
  return supabase
    .from("analytics")
    .select("*")
    .eq("project_id", projectId)
    .order("occurred_at", { ascending: false })
    .limit(100);
}
