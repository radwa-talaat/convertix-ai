"use client";

import { createBrowserClient } from "@supabase/ssr";

import { env, assertPublicSupabaseEnv } from "@/lib/env";
import type { Database } from "@/types/database";

export function createClient() {
  assertPublicSupabaseEnv();

  return createBrowserClient<Database>(
    env.supabaseUrl,
    env.supabasePublishableKey,
  );
}
