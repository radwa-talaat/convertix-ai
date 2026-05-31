import assert from "node:assert/strict";
import test from "node:test";

const plans = {
  agency: { customDomains: 25, landingPages: Number.MAX_SAFE_INTEGER },
  free: { customDomains: 0, landingPages: 1 },
  pro: { customDomains: 3, landingPages: Number.MAX_SAFE_INTEGER },
};

function canUseFeature(planId, feature) {
  const limits = plans[planId];
  return feature === "custom_domains"
    ? limits.customDomains > 0
    : limits.landingPages > 0;
}

test("free plan cannot use custom domains", () => {
  assert.equal(canUseFeature("free", "custom_domains"), false);
});

test("pro and agency can use custom domains", () => {
  assert.equal(canUseFeature("pro", "custom_domains"), true);
  assert.equal(canUseFeature("agency", "custom_domains"), true);
});
