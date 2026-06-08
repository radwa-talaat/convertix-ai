"use client";

import * as React from "react";

import {
  isValidExternalPixelId,
  META_PIXEL_EVENT,
  type MetaPixelEventDetail,
} from "@/lib/analytics/meta-pixel";
import { shouldTrackAnalytics } from "@/lib/analytics";

type TikTokPixelFunction = {
  (...args: unknown[]): void;
  _i?: Record<string, unknown>;
  _o?: Record<string, unknown>;
  _t?: Record<string, number>;
  debug?: boolean;
  instance?: (pixelId: string) => TikTokPixelFunction;
  load?: (pixelId: string, options?: Record<string, unknown>) => void;
  methods?: string[];
  page?: (...args: unknown[]) => void;
  track?: (eventName: string, parameters?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    __convertixTikTokPixelIds?: Set<string>;
    ttq?: TikTokPixelFunction;
  }
}

export function TikTokPixelTracker({
  pageId,
  pageSlug,
  pixelId,
}: {
  pageId: string;
  pageSlug: string;
  pixelId: string;
}) {
  const initialized = React.useRef(false);

  const initialize = React.useCallback(() => {
    if (
      initialized.current ||
      !shouldTrackAnalytics() ||
      !isValidExternalPixelId(pixelId)
    ) {
      return;
    }

    const ttq = ensureTikTokPixelFunction();
    const initializedIds = window.__convertixTikTokPixelIds ?? new Set<string>();
    window.__convertixTikTokPixelIds = initializedIds;

    if (!initializedIds.has(pixelId)) {
      ttq.load?.(pixelId);
      initializedIds.add(pixelId);
    }

    ttq.page?.();
    ttq.track?.("ViewContent", {
      content_id: pageId,
      content_name: pageSlug,
      content_type: "landing_page",
    });
    initialized.current = true;
  }, [pageId, pageSlug, pixelId]);

  React.useEffect(() => {
    initialize();

    function handleConsent() {
      initialize();
    }

    function handleSharedEvent(event: Event) {
      if (!initialized.current || !window.ttq) {
        return;
      }

      const { eventName, parameters } = (
        event as CustomEvent<MetaPixelEventDetail>
      ).detail;

      if (eventName === "Lead") {
        window.ttq.track?.("SubmitForm", parameters);
        return;
      }

      if (eventName === "CTAClick") {
        window.ttq.track?.("ClickButton", parameters);
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const action = target?.closest("a,button");

      if (!action || !initialized.current || !window.ttq) {
        return;
      }

      const label = action.textContent?.trim().slice(0, 100) || "CTA";
      const href =
        action instanceof HTMLAnchorElement ? action.href : undefined;

      if (!isLikelyCallToAction(label, action)) {
        return;
      }

      window.ttq.track?.("ClickButton", { href, label });
    }

    window.addEventListener("convertix:analytics-consent", handleConsent);
    window.addEventListener(META_PIXEL_EVENT, handleSharedEvent);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("convertix:analytics-consent", handleConsent);
      window.removeEventListener(META_PIXEL_EVENT, handleSharedEvent);
      window.removeEventListener("click", handleClick);
    };
  }, [initialize]);

  return null;
}

function ensureTikTokPixelFunction() {
  if (window.ttq) {
    return window.ttq;
  }

  const ttq = (...args: unknown[]) => {
    ttq.queue.push(args);
  };
  ttq.queue = [] as unknown[];

  const pixel = ttq as TikTokPixelFunction & { queue: unknown[] };
  const methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
    "holdConsent",
    "revokeConsent",
    "grantConsent",
  ];

  pixel.methods = methods;
  pixel._i = {};
  pixel._t = {};
  pixel._o = {};

  for (const method of methods) {
    pixel[method as "page" | "track"] = (...args: unknown[]) => {
      pixel.queue.push([method, ...args]);
    };
  }

  pixel.load = (id: string, options: Record<string, unknown> = {}) => {
    pixel._i = {
      ...pixel._i,
      [id]: [],
    };
    pixel._t = {
      ...pixel._t,
      [id]: Date.now(),
    };
    pixel._o = {
      ...pixel._o,
      [id]: options,
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://analytics.tiktok.com/i18n/pixel/events.js";
    document.head.appendChild(script);
  };

  window.ttq = pixel;

  return pixel;
}

function isLikelyCallToAction(label: string, action: Element) {
  if (action.closest("[data-meta-pixel-ignore]")) {
    return false;
  }

  return /start|build|launch|try|subscribe|upgrade|get|buy|order|contact|book|اطلب|ابدأ|اشتر|تواصل|احجز|اشترك|جرّب|جرب/i.test(
    label,
  );
}
