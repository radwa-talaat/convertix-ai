import type { AnalyticsConsentState } from "@/types/analytics";

const CONSENT_KEY = "ai-builder-analytics-consent";

export function getAnalyticsConsent(): AnalyticsConsentState {
  if (typeof window === "undefined") {
    return "unknown";
  }

  return (
    (window.localStorage.getItem(
      CONSENT_KEY,
    ) as AnalyticsConsentState | null) ?? "unknown"
  );
}

export function setAnalyticsConsent(
  consent: Exclude<AnalyticsConsentState, "unknown">,
) {
  window.localStorage.setItem(CONSENT_KEY, consent);
}

export function shouldTrackAnalytics() {
  if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") {
    return false;
  }

  return getAnalyticsConsent() === "accepted";
}
