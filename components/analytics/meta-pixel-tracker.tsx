"use client";

import * as React from "react";

import {
  isValidMetaPixelId,
  META_PIXEL_EVENT,
  type MetaPixelEventDetail,
} from "@/lib/analytics/meta-pixel";
import { shouldTrackAnalytics } from "@/lib/analytics";

type MetaPixelFunction = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  push?: MetaPixelFunction;
  queue?: unknown[];
  version?: string;
};

declare global {
  interface Window {
    _fbq?: MetaPixelFunction;
    __convertixMetaPixelIds?: Set<string>;
    fbq?: MetaPixelFunction;
  }
}

export function MetaPixelTracker({
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
      !isValidMetaPixelId(pixelId)
    ) {
      return;
    }

    const fbq = ensureMetaPixelFunction();
    const initializedIds = window.__convertixMetaPixelIds ?? new Set<string>();
    window.__convertixMetaPixelIds = initializedIds;

    if (!initializedIds.has(pixelId)) {
      fbq("init", pixelId);
      initializedIds.add(pixelId);
    }

    fbq("track", "PageView");
    fbq("track", "ViewContent", {
      content_ids: [pageId],
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

    function handleMetaEvent(event: Event) {
      if (!initialized.current || !window.fbq) {
        return;
      }

      const { eventName, parameters } = (
        event as CustomEvent<MetaPixelEventDetail>
      ).detail;

      if (eventName === "CTAClick") {
        window.fbq("trackCustom", eventName, parameters);
        return;
      }

      window.fbq("track", eventName, parameters);
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const action = target?.closest("a,button");

      if (!action || !initialized.current || !window.fbq) {
        return;
      }

      const label = action.textContent?.trim().slice(0, 100) || "CTA";
      const href =
        action instanceof HTMLAnchorElement ? action.href : undefined;

      if (!isLikelyCallToAction(label, action)) {
        return;
      }

      window.fbq("trackCustom", "CTAClick", { href, label });
    }

    window.addEventListener("convertix:analytics-consent", handleConsent);
    window.addEventListener(META_PIXEL_EVENT, handleMetaEvent);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("convertix:analytics-consent", handleConsent);
      window.removeEventListener(META_PIXEL_EVENT, handleMetaEvent);
      window.removeEventListener("click", handleClick);
    };
  }, [initialize]);

  return null;
}

function ensureMetaPixelFunction() {
  if (window.fbq) {
    return window.fbq;
  }

  const fbq: MetaPixelFunction = (...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue?.push(args);
  };

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);

  return fbq;
}

function isLikelyCallToAction(label: string, action: Element) {
  if (action.closest("[data-meta-pixel-ignore]")) {
    return false;
  }

  return /start|build|launch|try|subscribe|upgrade|get|buy|order|contact|book|اطلب|ابدأ|اشتر|تواصل|احجز|اشترك|جرّب|جرب/i.test(
    label,
  );
}
