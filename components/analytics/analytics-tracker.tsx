"use client";

import { useAnalyticsTracker } from "@/hooks/analytics";

export function AnalyticsTracker({
  pageId,
  pageSlug,
  projectId,
}: {
  pageId?: string | null;
  pageSlug: string;
  projectId: string;
}) {
  useAnalyticsTracker({ pageId, pageSlug, projectId });

  return null;
}
