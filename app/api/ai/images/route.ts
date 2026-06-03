import { NextResponse, type NextRequest } from "next/server";
import { z, ZodError } from "zod";

import { AiError, toAiError } from "@/lib/ai/errors";
import { logError } from "@/lib/monitoring";
import { checkRateLimit, sanitizeObject } from "@/lib/security";
import { getCurrentUser } from "@/lib/supabase/auth";
import { generateLandingPageImage } from "@/services/openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const imageRequestSchema = z.object({
  prompt: z.string().trim().min(12).max(900),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AiError("Authentication required.", "AI_AUTH_REQUIRED", 401);
    }

    const limit = checkRateLimit({
      key: `ai-image:${user.id}`,
      limit: 6,
      windowMs: 60 * 60 * 1000,
    });

    if (!limit.allowed) {
      throw new AiError(
        "AI image rate limit exceeded.",
        "AI_RATE_LIMITED",
        429,
      );
    }

    const body = imageRequestSchema.parse(
      sanitizeObject((await request.json()) as unknown),
    );
    const image = await generateLandingPageImage({
      prompt: buildLandingPageImagePrompt(body.prompt),
    });

    return NextResponse.json(image);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          code: "AI_VALIDATION_ERROR",
          message: "Invalid image generation prompt.",
        },
        { status: 422 },
      );
    }

    const aiError = toAiError(error);

    if (aiError.status >= 500) {
      logError(error, { route: "ai.images" });
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

function buildLandingPageImagePrompt(prompt: string) {
  return [
    prompt,
    "Create a premium landing page hero visual.",
    "No text, no letters, no logos, no watermarks.",
    "Leave clean negative space for headline and call-to-action.",
    "High-end commercial advertising style, responsive-friendly composition.",
  ].join(" ");
}
