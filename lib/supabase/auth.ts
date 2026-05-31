import "server-only";

import { redirect } from "next/navigation";

import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getClaims() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    return null;
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return null;
  }

  return data.claims;
}

export async function getCurrentUser() {
  if (!env.supabaseUrl || !env.supabasePublishableKey) {
    return null;
  }

  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
