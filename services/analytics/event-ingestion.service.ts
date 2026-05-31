import { detectDeviceType } from "@/lib/analytics";
import type { SupabaseDatabaseClient } from "@/services/database/types";
import type { Json } from "@/types/database";
import type { AnalyticsBatchPayload } from "@/types/analytics";

export async function ingestAnalyticsBatch({
  payload,
  referrer,
  supabase,
  userAgent,
}: {
  payload: AnalyticsBatchPayload;
  referrer: string | null;
  supabase: SupabaseDatabaseClient;
  userAgent: string;
}) {
  const deviceType = detectDeviceType(userAgent);
  const events = payload.events.slice(0, 25);

  if (events.length === 0) {
    return { inserted: 0 };
  }

  await supabase.from("analytics_events").insert(
    events.map((event) => ({
      device_type: deviceType,
      event_type: event.eventType,
      metadata: (event.metadata ?? {}) as Json,
      occurred_at: event.timestamp,
      page_id: event.pageId ?? null,
      page_slug: event.pageSlug,
      project_id: event.projectId,
      session_id: payload.sessionId,
      source: payload.source,
      utm: payload.utm as Json,
      visitor_id: event.visitorId,
    })),
  );

  const pageViews = events.filter((event) => event.eventType === "page_view");
  const conversions = events.filter(
    (event) =>
      event.eventType === "cta_click" || event.eventType === "form_submission",
  );

  if (pageViews.length > 0) {
    await supabase.from("page_views").insert(
      pageViews.map((event) => ({
        bounced: false,
        device_type: deviceType,
        occurred_at: event.timestamp,
        page_id: event.pageId ?? null,
        page_slug: event.pageSlug,
        project_id: event.projectId,
        referrer,
        session_id: payload.sessionId,
        source: payload.source,
        time_on_page_seconds: Number(event.metadata?.timeOnPageSeconds ?? 0),
        utm: payload.utm as Json,
        visitor_id: event.visitorId,
      })),
    );
  }

  if (conversions.length > 0) {
    await supabase.from("conversions").insert(
      conversions.map((event) => ({
        conversion_type: event.eventType,
        metadata: (event.metadata ?? {}) as Json,
        occurred_at: event.timestamp,
        page_id: event.pageId ?? null,
        page_slug: event.pageSlug,
        project_id: event.projectId,
        session_id: payload.sessionId,
        visitor_id: event.visitorId,
      })),
    );
  }

  return { inserted: events.length };
}
