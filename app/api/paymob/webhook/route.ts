import { NextResponse, type NextRequest } from "next/server";

import { logError } from "@/lib/monitoring";
import { checkRateLimit } from "@/lib/security";
import { createAdminClient } from "@/lib/supabase/admin";
import { handlePaymobWebhook } from "@/services/payments";

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ??
      request.headers.get("x-real-ip") ??
      "paymob";
    const limit = checkRateLimit({
      key: `paymob:${ip}`,
      limit: 60,
      windowMs: 60_000,
    });

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many webhook requests." },
        { status: 429 },
      );
    }

    const payload = (await request.json()) as Record<string, unknown>;
    const hmac =
      request.nextUrl.searchParams.get("hmac") ??
      request.headers.get("x-paymob-hmac");
    const supabase = createAdminClient();

    await handlePaymobWebhook(supabase, payload, hmac);

    return NextResponse.json({ received: true });
  } catch (error) {
    logError(error, { route: "paymob.webhook" });

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Paymob webhook failed.",
      },
      { status: 400 },
    );
  }
}
