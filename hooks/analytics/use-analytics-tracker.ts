"use client";

import * as React from "react";

import {
  detectTrafficSource,
  getOrCreateSessionId,
  getOrCreateVisitorId,
  parseUtmParams,
  shouldTrackAnalytics,
} from "@/lib/analytics";
import { createApiPath } from "@/lib/api/urls";
import type {
  AnalyticsBatchPayload,
  AnalyticsEventPayload,
  TrackingEventType,
} from "@/types/analytics";

type UseAnalyticsTrackerOptions = {
  pageId?: string | null;
  pageSlug: string;
  projectId: string;
};

export function useAnalyticsTracker({
  pageId,
  pageSlug,
  projectId,
}: UseAnalyticsTrackerOptions) {
  const queue = React.useRef<AnalyticsEventPayload[]>([]);
  const startedAt = React.useRef<number>(Date.now());

  const flush = React.useCallback(() => {
    if (!shouldTrackAnalytics() || queue.current.length === 0) {
      return;
    }

    const events = queue.current.splice(0, 25);
    const utm = parseUtmParams(new URLSearchParams(window.location.search));
    const payload: AnalyticsBatchPayload = {
      anonymous: true,
      events,
      sessionId: getOrCreateSessionId(),
      source: detectTrafficSource(document.referrer, utm),
      utm,
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(createApiPath("/analytics/events"), body);
      return;
    }

    void fetch(createApiPath("/analytics/events"), {
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    });
  }, []);

  const track = React.useCallback(
    (eventType: TrackingEventType, metadata: Record<string, unknown> = {}) => {
      if (!shouldTrackAnalytics()) {
        return;
      }

      queue.current.push({
        eventType,
        metadata,
        pageId,
        pageSlug,
        projectId,
        timestamp: new Date().toISOString(),
        visitorId: getOrCreateVisitorId(),
      });

      if (queue.current.length >= 5) {
        flush();
      }
    },
    [flush, pageId, pageSlug, projectId],
  );

  React.useEffect(() => {
    track("page_view");

    const interval = window.setInterval(flush, 5000);

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        track("performance", {
          timeOnPageSeconds: Math.round(
            (Date.now() - startedAt.current) / 1000,
          ),
        });
        flush();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      track("performance", {
        timeOnPageSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
      flush();
    };
  }, [flush, track]);

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a,button");

      if (!link) {
        return;
      }

      const label = link.textContent?.trim().slice(0, 80) ?? "Unknown CTA";
      const href = link instanceof HTMLAnchorElement ? link.href : undefined;

      if (/start|build|launch|try|subscribe|upgrade|get/i.test(label)) {
        track("cta_click", { href, label });
      }
    }

    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [track]);

  return { flush, track };
}
