import assert from "node:assert/strict";
import test from "node:test";

function detectTrafficSource(referrer, utm = {}) {
  if (utm.source?.toLowerCase().includes("google")) return "google";
  if (!referrer) return "direct";
  const hostname = new URL(referrer).hostname;
  if (hostname.includes("google.")) return "google";
  if (hostname.includes("facebook") || hostname.includes("instagram")) {
    return "social";
  }
  return "referral";
}

function calculateAiConversionScore(metrics) {
  const conversionRate =
    metrics.views > 0
      ? ((metrics.ctaClicks + metrics.formSubmissions) / metrics.views) * 100
      : 0;
  const bouncePenalty = metrics.bounceRate * 0.35;
  const engagementBonus = Math.min(20, metrics.averageTimeOnPage / 6);
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(conversionRate * 6 + engagementBonus - bouncePenalty),
    ),
  );
}

test("traffic source detection classifies direct, google, social, and referral", () => {
  assert.equal(detectTrafficSource("", {}), "direct");
  assert.equal(detectTrafficSource("", { source: "google" }), "google");
  assert.equal(detectTrafficSource("https://facebook.com/post", {}), "social");
  assert.equal(detectTrafficSource("https://example.com/blog", {}), "referral");
});

test("AI conversion score stays in a 0-100 range", () => {
  const score = calculateAiConversionScore({
    averageTimeOnPage: 90,
    bounceRate: 40,
    ctaClicks: 50,
    formSubmissions: 10,
    views: 1000,
  });
  assert.equal(score >= 0 && score <= 100, true);
});
