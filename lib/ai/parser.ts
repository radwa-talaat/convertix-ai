import { AiError } from "@/lib/ai/errors";
import { aiLandingPageContentSchema } from "@/lib/ai/schema";
import { sanitizeLandingPageContent } from "@/lib/ai/sanitize";
import type { AiLandingPageContent } from "@/types/ai";

export function parseAiJsonResponse(rawText: string): AiLandingPageContent {
  try {
    const parsed = JSON.parse(rawText) as unknown;
    const validated = aiLandingPageContentSchema.parse(parsed);
    return sanitizeLandingPageContent(validated);
  } catch {
    throw new AiError(
      "AI response did not match the required landing page schema.",
      "AI_VALIDATION_ERROR",
      422,
    );
  }
}
