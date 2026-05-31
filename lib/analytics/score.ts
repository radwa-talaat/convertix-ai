import type {
  AiAnalyticsInsight,
  PageMetricSummary,
  TimeSeriesPoint,
} from "@/types/analytics";

export function calculateAiConversionScore(metrics: PageMetricSummary) {
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

export function generateAiAnalyticsInsights({
  metrics,
  timeseries,
}: {
  metrics: PageMetricSummary;
  timeseries: TimeSeriesPoint[];
}): AiAnalyticsInsight[] {
  const conversionRate =
    metrics.views > 0
      ? ((metrics.ctaClicks + metrics.formSubmissions) / metrics.views) * 100
      : 0;
  const latest = timeseries.at(-1);
  const previous = timeseries.at(-2);
  const insights: AiAnalyticsInsight[] = [];

  if (conversionRate < 3) {
    insights.push({
      category: "cta",
      priority: "high",
      recommendation:
        "Make the primary CTA more specific and repeat it after the benefits section.",
      title: "Weak CTA detected",
    });
  }

  if (metrics.bounceRate > 55) {
    insights.push({
      category: "performance",
      priority: "medium",
      recommendation:
        "Move proof points higher on the page and shorten the hero copy for faster scanning.",
      title: "High bounce rate",
    });
  }

  if (latest && previous && latest.views < previous.views) {
    insights.push({
      category: "traffic",
      priority: "medium",
      recommendation:
        "Review traffic sources and refresh campaign links with UTM tags to isolate the drop.",
      title: "Traffic softened",
    });
  }

  if (insights.length === 0) {
    insights.push({
      category: "conversion",
      priority: "low",
      recommendation:
        "Conversion health looks stable. Test a sharper headline variant next.",
      title: "Healthy funnel",
    });
  }

  return insights;
}
