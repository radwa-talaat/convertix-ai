import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { assertSupabaseSecretEnv, env } from "@/lib/env";
import type { Database } from "@/types/database";

export function createAdminClient() {
  assertSupabaseSecretEnv();

  return createSupabaseClient<Database>(
    env.supabaseUrl,
    env.supabaseSecretKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
