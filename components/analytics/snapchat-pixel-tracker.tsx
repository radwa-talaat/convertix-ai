"use client";

import * as React from "react";

import {
  isValidExternalPixelId,
  META_PIXEL_EVENT,
  type MetaPixelEventDetail,
} from "@/lib/analytics/meta-pixel";
import { shouldTrackAnalytics } from "@/lib/analytics";

type SnapPixelFunction = {
  (...args: unknown[]): void;
  handleRequest?: (...args: unknown[]) => void;
  queue?: unknown[];
};

declare global {
  interface Window {
    __convertixSnapchatPixelIds?: Set<string>;
    snaptr?: SnapPixelFunction;
  }
}

export function SnapchatPixelTracker({
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

    const snaptr = ensureSnapchatPixelFunction();
    const initializedIds =
      window.__convertixSnapchatPixelIds ?? new Set<string>();
    window.__convertixSnapchatPixelIds = initializedIds;

    if (!initializedIds.has(pixelId)) {
      snaptr("init", pixelId);
      initializedIds.add(pixelId);
    }

    snaptr("track", "PAGE_VIEW");
    snaptr("track", "VIEW_CONTENT", {
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

    function handleSharedEvent(event: Event) {
      if (!initialized.current || !window.snaptr) {
        return;
      }

      const { eventName, parameters } = (
        event as CustomEvent<MetaPixelEventDetail>
      ).detail;

      if (eventName === "Lead") {
        window.snaptr("track", "SIGN_UP", parameters);
        return;
      }

      if (eventName === "CTAClick") {
        window.snaptr("track", "CUSTOM_EVENT_1", parameters);
      }
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const action = target?.closest("a,button");

      if (!action || !initialized.current || !window.snaptr) {
        return;
      }

      const label = action.textContent?.trim().slice(0, 100) || "CTA";
      const href =
        action instanceof HTMLAnchorElement ? action.href : undefined;

      if (!isLikelyCallToAction(label, action)) {
        return;
      }

      window.snaptr("track", "CUSTOM_EVENT_1", { href, label });
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

function ensureSnapchatPixelFunction() {
  if (window.snaptr) {
    return window.snaptr;
  }

  const snaptr: SnapPixelFunction = (...args: unknown[]) => {
    if (snaptr.handleRequest) {
      snaptr.handleRequest(...args);
      return;
    }

    snaptr.queue?.push(args);
  };

  snaptr.queue = [];
  window.snaptr = snaptr;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://sc-static.net/scevent.min.js";
  document.head.appendChild(script);

  return snaptr;
}

function isLikelyCallToAction(label: string, action: Element) {
  if (action.closest("[data-meta-pixel-ignore]")) {
    return false;
  }

  return /start|build|launch|try|subscribe|upgrade|get|buy|order|contact|book|اطلب|ابدأ|اشتر|تواصل|احجز|اشترك|جرّب|جرب/i.test(
    label,
  );
}
