import type { SupabaseDatabaseClient } from "@/services/database/types";
import { isAdminUser } from "@/services/admin";

export type ProjectCreationEntitlement = {
  canCreate: boolean;
  isUnlimited: boolean;
  remainingCredits: number;
};

export async function getProjectCreationEntitlement(
  supabase: SupabaseDatabaseClient,
  userId: string,
): Promise<ProjectCreationEntitlement> {
  if (await isAdminUser(userId)) {
    return {
      canCreate: true,
      isUnlimited: true,
      remainingCredits: 0,
    };
  }

  const { data: credits } = await supabase
    .from("landing_page_credits")
    .select("purchased, consumed")
    .eq("user_id", userId)
    .maybeSingle();

  const remainingCredits = Math.max(
    0,
    (credits?.purchased ?? 0) - (credits?.consumed ?? 0),
  );

  return {
    canCreate: remainingCredits > 0,
    isUnlimited: false,
    remainingCredits,
  };
}

export async function hasPaidProjectAccess(
  supabase: SupabaseDatabaseClient,
  userId: string,
  projectId: string,
) {
  if (await isAdminUser(userId)) {
    return true;
  }

  const { data: entitlement } = await supabase
    .from("project_entitlements")
    .select("source")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .maybeSingle();

  if (entitlement?.source === "credit") {
    return true;
  }

  if (entitlement?.source !== "subscription") {
    return false;
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .in("plan", ["pro", "agency"])
    .in("status", ["active", "trialing"])
    .or(
      `current_period_end.is.null,current_period_end.gt.${new Date().toISOString()}`,
    )
    .limit(1)
    .maybeSingle();

  return Boolean(subscription);
}
