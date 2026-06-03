import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { apiErrorResponse } from "@/lib/monitoring";
import { checkRateLimit } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { captureLandingPageLead } from "@/services/leads";

const leadCaptureSchema = z.object({
  customerEmail: z.string().email().max(180).optional().or(z.literal("")),
  customerName: z.string().trim().min(2).max(120),
  customerPhone: z.string().trim().min(7).max(32).optional().or(z.literal("")),
  landingPageTitle: z.string().trim().max(140).optional(),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  pageId: z.string().uuid(),
  pageSlug: z.string().trim().min(1).max(140),
  productName: z.string().trim().max(140).optional(),
  projectId: z.string().uuid(),
  source: z.string().trim().max(80).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      "anonymous";
    const limit = checkRateLimit({
      key: `lead:${ip}`,
      limit: 12,
      windowMs: 60_000,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many lead requests." },
        { status: 429 },
      );
    }

    const input = leadCaptureSchema.parse(await request.json());
    const supabase = createAdminClient();
    const lead = await captureLandingPageLead({
      input,
      ipAddress: ip,
      supabase,
      userAgent: request.headers.get("user-agent"),
    });

    return NextResponse.json({ id: lead.id, ok: true });
  } catch (error) {
    return apiErrorResponse(error, "Lead capture failed.");
  }
}
