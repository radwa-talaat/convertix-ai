import assert from "node:assert/strict";
import test from "node:test";

const plans = {
  agency: { customDomains: 25, landingPages: 10, priceEgp: 750 },
  free: { customDomains: 1, landingPages: 1, priceEgp: 100 },
  pro: { customDomains: 5, landingPages: 5, priceEgp: 400 },
};

function canUseFeature(planId, feature) {
  const limits = plans[planId];
  return feature === "custom_domains"
    ? limits.customDomains > 0
    : limits.landingPages > 0;
}

test("all paid bundles can use custom domains", () => {
  assert.equal(canUseFeature("free", "custom_domains"), true);
  assert.equal(canUseFeature("pro", "custom_domains"), true);
  assert.equal(canUseFeature("agency", "custom_domains"), true);
});

test("bundles grant the requested finite landing page quantities", () => {
  assert.equal(plans.free.landingPages, 1);
  assert.equal(plans.pro.landingPages, 5);
  assert.equal(plans.agency.landingPages, 10);
});

test("bundle prices are 100, 400, and 750 EGP", () => {
  assert.equal(plans.free.priceEgp, 100);
  assert.equal(plans.pro.priceEgp, 400);
  assert.equal(plans.agency.priceEgp, 750);
});
