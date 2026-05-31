import {
  calculateAiConversionScore,
  generateAiAnalyticsInsights,
} from "@/lib/analytics";
import type {
  AnalyticsDashboardSnapshot,
  ConversionFunnelStep,
  DeviceMetric,
  PageMetricSummary,
  TimeSeriesPoint,
  TopPageMetric,
  TrafficSourceMetric,
} from "@/types/analytics";

export function getAnalyticsDashboardSnapshot(): AnalyticsDashboardSnapshot {
  const timeseries: TimeSeriesPoint[] = [
    { conversions: 8, date: "Mon", views: 140 },
    { conversions: 12, date: "Tue", views: 180 },
    { conversions: 10, date: "Wed", views: 165 },
    { conversions: 18, date: "Thu", views: 230 },
    { conversions: 24, date: "Fri", views: 310 },
    { conversions: 19, date: "Sat", views: 260 },
    { conversions: 27, date: "Sun", views: 340 },
  ];
  const metrics: PageMetricSummary = {
    averageTimeOnPage: 94,
    bounceRate: 38,
    ctaClicks: 118,
    formSubmissions: 34,
    sessions: 912,
    uniqueVisitors: 786,
    views: 1625,
  };
  const devices: DeviceMetric[] = [
    { device: "desktop", visitors: 410 },
    { device: "mobile", visitors: 292 },
    { device: "tablet", visitors: 84 },
  ];
  const sources: TrafficSourceMetric[] = [
    { source: "direct", visitors: 310 },
    { source: "google", visitors: 246 },
    { source: "social", visitors: 152 },
    { source: "referral", visitors: 78 },
  ];
  const topPages: TopPageMetric[] = [
    {
      conversionRate: 9.4,
      slug: "launch-os",
      title: "LaunchOS",
      views: 920,
    },
    {
      conversionRate: 6.8,
      slug: "saas-waitlist",
      title: "SaaS Waitlist",
      views: 412,
    },
    {
      conversionRate: 4.1,
      slug: "agency-offer",
      title: "Agency Offer",
      views: 293,
    },
  ];
  const funnel: ConversionFunnelStep[] = [
    { label: "Views", value: metrics.views },
    { label: "CTA clicks", value: metrics.ctaClicks },
    { label: "Forms", value: metrics.formSubmissions },
    { label: "Qualified leads", value: 19 },
  ];

  return {
    aiConversionScore: calculateAiConversionScore(metrics),
    dateRange: "7d",
    devices,
    funnel,
    insights: generateAiAnalyticsInsights({ metrics, timeseries }),
    metrics,
    realtimeVisitors: 17,
    sources,
    timeseries,
    topPages,
  };
}
