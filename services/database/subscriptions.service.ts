import type { SupabaseDatabaseClient } from "@/services/database/types";

export async function getActiveSubscription(
  supabase: SupabaseDatabaseClient,
  userId: string,
) {
  return supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["trialing", "active"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}
