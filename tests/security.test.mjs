import assert from "node:assert/strict";
import test from "node:test";

function sanitizePlainText(input, maxLength = 5000) {
  return input
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function isValidSlug(slug) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;
}

test("sanitizePlainText removes angle brackets and normalizes spacing", () => {
  assert.equal(
    sanitizePlainText(" <script> hello   world </script> "),
    "script hello world /script",
  );
});

test("slug validation accepts production-safe slugs", () => {
  assert.equal(isValidSlug("launch-os"), true);
  assert.equal(isValidSlug("../admin"), false);
  assert.equal(isValidSlug("Bad Slug"), false);
});
