import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Inserts, Updates } from "@/types/database";

export async function getUserProfile(
  supabase: SupabaseDatabaseClient,
  userId: string,
) {
  return supabase.from("users").select("*").eq("id", userId).single();
}

export async function upsertUserProfile(
  supabase: SupabaseDatabaseClient,
  profile: Inserts<"users">,
) {
  return supabase.from("users").upsert(profile).select("*").single();
}

export async function updateUserProfile(
  supabase: SupabaseDatabaseClient,
  userId: string,
  updates: Updates<"users">,
) {
  return supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();
}
