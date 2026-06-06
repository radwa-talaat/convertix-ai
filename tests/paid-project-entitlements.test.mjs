import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/20260606110000_landing_page_bundle_plans.sql",
  import.meta.url,
);
const migration = await readFile(migrationUrl, "utf8");

test("project creation requires an entitlement and consumes one credit atomically", () => {
  assert.match(migration, /create_paid_project/);
  assert.match(migration, /remaining_quantity = remaining_quantity - 1/);
  assert.match(migration, /consumed = consumed \+ 1/);
  assert.match(migration, /PAYMENT_REQUIRED/);
  assert.match(migration, /insert into public\.project_entitlements/);
});

test("all verified paid bundles can grant finite credits", () => {
  assert.match(migration, /grant_landing_page_credits/);
  assert.match(migration, /plan in \('free', 'pro', 'agency'\)/);
  assert.match(migration, /status = 'paid'/);
  assert.match(migration, /landing_page_quantity = credit_quantity/);
  assert.match(migration, /landing_page_credit_lots/);
  assert.match(migration, /to service_role/);
});

test("project domain limits follow the purchased bundle", () => {
  assert.match(migration, /enforce_project_domain_limit/);
  assert.match(migration, /when entitlement_plan = 'agency' then 25/);
  assert.match(migration, /else 1/);
  assert.match(migration, /DOMAIN_LIMIT_REACHED/);
});
