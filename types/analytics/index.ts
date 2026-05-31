export type TrackingEventType =
  | "page_view"
  | "cta_click"
  | "form_submission"
  | "custom"
  | "performance";

export type TrackingDeviceType = "desktop" | "mobile" | "tablet";

export type AnalyticsTrafficSource =
  | "direct"
  | "google"
  | "referral"
  | "social";

export type AnalyticsDateRange = "24h" | "7d" | "30d" | "90d";

export type AnalyticsEventPayload = {
  eventType: TrackingEventType;
  metadata?: Record<string, unknown>;
  pageId?: string | null;
  pageSlug: string;
  projectId: string;
  timestamp: string;
  visitorId: string;
};

export type AnalyticsBatchPayload = {
  anonymous: boolean;
  events: AnalyticsEventPayload[];
  sessionId: string;
  source: AnalyticsTrafficSource;
  utm: UtmParams;
};

export type UtmParams = {
  campaign?: string;
  content?: string;
  medium?: string;
  source?: string;
  term?: string;
};

export type PageMetricSummary = {
  averageTimeOnPage: number;
  bounceRate: number;
  ctaClicks: number;
  formSubmissions: number;
  sessions: number;
  uniqueVisitors: number;
  views: number;
};

export type DeviceMetric = {
  device: TrackingDeviceType;
  visitors: number;
};

export type TrafficSourceMetric = {
  source: AnalyticsTrafficSource;
  visitors: number;
};

export type TimeSeriesPoint = {
  date: string;
  conversions: number;
  views: number;
};

export type TopPageMetric = {
  conversionRate: number;
  slug: string;
  title: string;
  views: number;
};

export type ConversionFunnelStep = {
  label: string;
  value: number;
};

export type AiAnalyticsInsight = {
  category: "cta" | "traffic" | "performance" | "conversion";
  priority: "low" | "medium" | "high";
  recommendation: string;
  title: string;
};

export type AnalyticsDashboardSnapshot = {
  aiConversionScore: number;
  dateRange: AnalyticsDateRange;
  devices: DeviceMetric[];
  funnel: ConversionFunnelStep[];
  insights: AiAnalyticsInsight[];
  metrics: PageMetricSummary;
  realtimeVisitors: number;
  sources: TrafficSourceMetric[];
  timeseries: TimeSeriesPoint[];
  topPages: TopPageMetric[];
};

export type AnalyticsConsentState = "accepted" | "declined" | "unknown";
