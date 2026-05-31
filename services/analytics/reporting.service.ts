import { unstable_cache } from "next/cache";

import { getAnalyticsDashboardSnapshot } from "@/services/analytics/analytics-fixtures";
import type { AnalyticsDashboardSnapshot } from "@/types/analytics";

export const getAnalyticsReport = unstable_cache(
  async (): Promise<AnalyticsDashboardSnapshot> =>
    getAnalyticsDashboardSnapshot(),
  ["analytics-dashboard-report"],
  {
    revalidate: 30,
    tags: ["analytics"],
  },
);

export function exportAnalyticsCsv(snapshot: AnalyticsDashboardSnapshot) {
  const rows = [
    ["metric", "value"],
    ["views", snapshot.metrics.views],
    ["unique_visitors", snapshot.metrics.uniqueVisitors],
    ["sessions", snapshot.metrics.sessions],
    ["bounce_rate", snapshot.metrics.bounceRate],
    ["cta_clicks", snapshot.metrics.ctaClicks],
    ["form_submissions", snapshot.metrics.formSubmissions],
    ["ai_conversion_score", snapshot.aiConversionScore],
  ];

  return rows.map((row) => row.join(",")).join("\n");
}
