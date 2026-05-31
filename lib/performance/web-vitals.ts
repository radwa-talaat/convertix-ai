export type WebVitalMetric = {
  id: string;
  name: "CLS" | "FCP" | "FID" | "INP" | "LCP" | "TTFB";
  rating: "good" | "needs-improvement" | "poor";
  value: number;
};

export function getWebVitalRating(name: WebVitalMetric["name"], value: number) {
  const thresholds: Record<WebVitalMetric["name"], [number, number]> = {
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    FID: [100, 300],
    INP: [200, 500],
    LCP: [2500, 4000],
    TTFB: [800, 1800],
  };
  const [good, poor] = thresholds[name];

  if (value <= good) {
    return "good";
  }

  if (value <= poor) {
    return "needs-improvement";
  }

  return "poor";
}
