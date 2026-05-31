import { NextResponse, type NextRequest } from "next/server";
import { ZodError } from "zod";

import { AiError, toAiError } from "@/lib/ai/errors";
import { logError } from "@/lib/monitoring";
import { checkRateLimit, sanitizeObject } from "@/lib/security";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { generateLandingPageContent } from "@/services/ai";
import { createAiGenerationRecord } from "@/services/database/ai-generations.service";
import type { Json } from "@/types/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AiError("Authentication required.", "AI_AUTH_REQUIRED", 401);
    }

    const limit = checkRateLimit({
      key: `ai:${user.id}`,
      limit: 12,
      windowMs: 60 * 60 * 1000,
    });

    if (!limit.allowed) {
      throw new AiError("AI rate limit exceeded.", "AI_RATE_LIMITED", 429);
    }

    const body = sanitizeObject((await request.json()) as unknown);
    const result = await generateLandingPageContent({
      identifier: user.id,
      input: body,
    });

    await persistGenerationRecord(user.id, body, result).catch(() => null);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          code: "AI_VALIDATION_ERROR",
          message: "Invalid AI generation input.",
        },
        { status: 422 },
      );
    }

    const aiError = toAiError(error);

    if (aiError.status >= 500) {
      logError(error, { route: "ai.generate" });
    }

    return NextResponse.json(
      {
        code: aiError.code,
        message: aiError.message,
      },
      { status: aiError.status },
    );
  }
}

async function persistGenerationRecord(
  userId: string,
  input: unknown,
  result: Awaited<ReturnType<typeof generateLandingPageContent>>,
) {
  const supabase = createClient();

  await createAiGenerationRecord(supabase, {
    error_message: result.fallbackUsed ? result.requestId : null,
    input: input as Json,
    input_tokens: result.usage.inputTokens,
    output: result.content as unknown as Json,
    output_tokens: result.usage.outputTokens,
    prompt: "landing_page_content_generation",
    status: result.fallbackUsed ? "failed" : "completed",
    total_tokens: result.usage.totalTokens,
    user_id: userId,
  });
}
