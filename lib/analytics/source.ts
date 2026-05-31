import type { AnalyticsTrafficSource, UtmParams } from "@/types/analytics";

export function parseUtmParams(searchParams: URLSearchParams): UtmParams {
  return {
    campaign: searchParams.get("utm_campaign") ?? undefined,
    content: searchParams.get("utm_content") ?? undefined,
    medium: searchParams.get("utm_medium") ?? undefined,
    source: searchParams.get("utm_source") ?? undefined,
    term: searchParams.get("utm_term") ?? undefined,
  };
}

export function detectTrafficSource(
  referrer: string,
  utm: UtmParams,
): AnalyticsTrafficSource {
  if (utm.source) {
    const source = utm.source.toLowerCase();

    if (source.includes("google")) {
      return "google";
    }

    if (
      ["facebook", "instagram", "linkedin", "x", "twitter", "tiktok"].some(
        (name) => source.includes(name),
      )
    ) {
      return "social";
    }

    return "referral";
  }

  if (!referrer) {
    return "direct";
  }

  try {
    const hostname = new URL(referrer).hostname;

    if (hostname.includes("google.")) {
      return "google";
    }

    if (
      ["facebook", "instagram", "linkedin", "twitter", "tiktok", "x.com"].some(
        (name) => hostname.includes(name),
      )
    ) {
      return "social";
    }

    return "referral";
  } catch {
    return "direct";
  }
}
