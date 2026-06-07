import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

test("admin role migration enables admin-only test access", async () => {
  const migration = await readFile(
    new URL(
      "../supabase/migrations/20260606140000_admin_role_support.sql",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(migration, /add column if not exists role text/i);
  assert.match(migration, /check \(role in \('user', 'admin'\)\)/i);
  assert.match(migration, /create or replace function public\.is_admin/i);
  assert.match(
    migration,
    /create or replace function public\.create_admin_project/i,
  );
  assert.match(migration, /'admin_test'/i);
  assert.match(migration, /Admin privileges required/i);
});
