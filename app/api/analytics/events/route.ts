import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { apiErrorResponse } from "@/lib/monitoring";
import { checkRateLimit } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { ingestAnalyticsBatch } from "@/services/analytics";

const utmSchema = z.object({
  campaign: z.string().optional(),
  content: z.string().optional(),
  medium: z.string().optional(),
  source: z.string().optional(),
  term: z.string().optional(),
});

const analyticsEventSchema = z.object({
  eventType: z.enum([
    "page_view",
    "cta_click",
    "form_submission",
    "custom",
    "performance",
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
  pageId: z.string().uuid().nullable().optional(),
  pageSlug: z.string().min(1).max(120),
  projectId: z.string().uuid(),
  timestamp: z.string().datetime(),
  visitorId: z.string().min(8).max(120),
});

const analyticsBatchSchema = z.object({
  anonymous: z.boolean(),
  events: z.array(analyticsEventSchema).min(1).max(25),
  sessionId: z.string().min(8).max(120),
  source: z.enum(["direct", "google", "referral", "social"]),
  utm: utmSchema,
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const limit = checkRateLimit({
      key: `analytics:${ip}`,
      limit: 120,
      windowMs: 60_000,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many analytics requests." },
        { status: 429 },
      );
    }

    const payload = analyticsBatchSchema.parse(await request.json());
    const supabase = createAdminClient();
    const result = await ingestAnalyticsBatch({
      payload,
      referrer: request.headers.get("referer"),
      supabase,
      userAgent: request.headers.get("user-agent") ?? "",
    });

    return NextResponse.json(result);
  } catch (error) {
    return apiErrorResponse(error, "Analytics ingestion failed.");
  }
}
