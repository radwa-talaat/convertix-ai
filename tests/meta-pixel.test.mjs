import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationPath = new URL(
  "../supabase/migrations/20260606130000_meta_pixel_tracking.sql",
  import.meta.url,
);
const trackerPath = new URL(
  "../components/analytics/meta-pixel-tracker.tsx",
  import.meta.url,
);

test("Meta Pixel migration only accepts numeric pixel IDs", async () => {
  const migration = await readFile(migrationPath, "utf8");

  assert.match(migration, /\^\[0-9\]\{5,32\}\$/);
  assert.match(migration, /meta_pixel_enabled boolean not null default false/);
});

test("Meta Pixel tracker sends core conversion events after consent", async () => {
  const tracker = await readFile(trackerPath, "utf8");

  assert.match(tracker, /shouldTrackAnalytics\(\)/);
  assert.match(tracker, /"PageView"/);
  assert.match(tracker, /"ViewContent"/);
  assert.match(tracker, /"CTAClick"/);
});
