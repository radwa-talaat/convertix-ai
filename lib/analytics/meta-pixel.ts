"use client";

import { shouldTrackAnalytics } from "@/lib/analytics/consent";

export const META_PIXEL_EVENT = "convertix:meta-pixel-event";

export type MetaPixelEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "CTAClick";

type MetaPixelEventDetail = {
  eventName: MetaPixelEventName;
  parameters?: Record<string, unknown>;
};

export function isValidMetaPixelId(value: string) {
  return /^[0-9]{5,32}$/.test(value.trim());
}

export function trackMetaPixelEvent(
  eventName: MetaPixelEventName,
  parameters: Record<string, unknown> = {},
) {
  if (typeof window === "undefined" || !shouldTrackAnalytics()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<MetaPixelEventDetail>(META_PIXEL_EVENT, {
      detail: { eventName, parameters },
    }),
  );
}

export type { MetaPixelEventDetail };
