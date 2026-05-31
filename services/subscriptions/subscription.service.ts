import { createTrialEndDate, getBillingPlan } from "@/lib/payments";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { BillingPlanId, UsageMetric } from "@/types/billing";

export async function getCurrentSubscription(
  supabase: SupabaseDatabaseClient,
  userId: string,
) {
  return supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
}

export async function activateSubscriptionPlan(
  supabase: SupabaseDatabaseClient,
  userId: string,
  planId: BillingPlanId,
) {
  const plan = getBillingPlan(planId);
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { data: existing } = await getCurrentSubscription(supabase, userId);

  if (existing) {
    return supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: false,
        canceled_at: null,
        current_period_end: periodEnd.toISOString(),
        current_period_start: now.toISOString(),
        plan: plan.id,
        status: "active",
        trial_ends_at: createTrialEndDate(plan.trialDays),
      })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select("*")
      .single();
  }

  return supabase
    .from("subscriptions")
    .insert({
      cancel_at_period_end: false,
      current_period_end: periodEnd.toISOString(),
      current_period_start: now.toISOString(),
      plan: plan.id,
      status: plan.trialDays > 0 ? "trialing" : "active",
      trial_ends_at: createTrialEndDate(plan.trialDays),
      user_id: userId,
    })
    .select("*")
    .single();
}

export async function cancelSubscription(
  supabase: SupabaseDatabaseClient,
  userId: string,
  subscriptionId: string,
) {
  return supabase
    .from("subscriptions")
    .update({
      cancel_at_period_end: true,
      canceled_at: new Date().toISOString(),
      status: "canceled",
    })
    .eq("id", subscriptionId)
    .eq("user_id", userId)
    .select("*")
    .single();
}

export async function recordUsage(
  supabase: SupabaseDatabaseClient,
  userId: string,
  metric: UsageMetric,
  increment = 1,
) {
  const { data: current } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", userId)
    .eq("metric", metric)
    .gte("period_end", new Date().toISOString())
    .order("period_end", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!current) {
    throw new Error(`Usage metric is not initialized: ${metric}`);
  }

  return supabase
    .from("usage_tracking")
    .update({
      used: current.used + increment,
    })
    .eq("id", current.id)
    .eq("user_id", userId)
    .select("*")
    .single();
}
