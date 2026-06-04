"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { AiInsights } from "@/components/analytics/ai-insights";
import { AnalyticsStatCards } from "@/components/analytics/analytics-stat-cards";
import { BarChart } from "@/components/analytics/bar-chart";
import { ConversionFunnel } from "@/components/analytics/conversion-funnel";
import { HeatmapPlaceholder } from "@/components/analytics/heatmap-placeholder";
import { LineChart } from "@/components/analytics/line-chart";
import { PieChart } from "@/components/analytics/pie-chart";
import { RealtimeMetrics } from "@/components/analytics/realtime-metrics";
import { TopPages } from "@/components/analytics/top-pages";
import { Button } from "@/components/ui/button";
import type {
  AnalyticsDashboardSnapshot,
  AnalyticsDateRange,
} from "@/types/analytics";

const ranges: AnalyticsDateRange[] = ["24h", "7d", "30d", "90d"];

export function AnalyticsDashboard({
  snapshot,
}: {
  snapshot: AnalyticsDashboardSnapshot;
}) {
  const t = useTranslations("dashboard.analyticsPage");
  const [range, setRange] = React.useState<AnalyticsDateRange>(
    snapshot.dateRange,
  );

  function exportReport() {
    const csv = [
      "metric,value",
      `views,${snapshot.metrics.views}`,
      `unique_visitors,${snapshot.metrics.uniqueVisitors}`,
      `sessions,${snapshot.metrics.sessions}`,
      `bounce_rate,${snapshot.metrics.bounceRate}`,
      `cta_clicks,${snapshot.metrics.ctaClicks}`,
      `form_submissions,${snapshot.metrics.formSubmissions}`,
      `ai_conversion_score,${snapshot.aiConversionScore}`,
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `analytics-${range}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-md border border-border bg-secondary/50 p-1">
          {ranges.map((item) => (
            <button
              className={`rounded px-3 py-1.5 text-sm ${
                range === item
                  ? "bg-background shadow-luxury-sm"
                  : "text-muted-foreground"
              }`}
              key={item}
              onClick={() => setRange(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
        <Button onClick={exportReport} type="button" variant="outline">
          <Download className="size-4" />
          {t("exportReport")}
        </Button>
      </div>
      <RealtimeMetrics visitors={snapshot.realtimeVisitors} />

      <AnalyticsStatCards metrics={snapshot.metrics} />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <LineChart data={snapshot.timeseries} />
        <AiInsights
          insights={snapshot.insights}
          score={snapshot.aiConversionScore}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BarChart data={snapshot.sources} />
        <PieChart data={snapshot.devices} />
        <ConversionFunnel steps={snapshot.funnel} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <TopPages pages={snapshot.topPages} />
        <HeatmapPlaceholder />
      </div>
    </div>
  );
}
