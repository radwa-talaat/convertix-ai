import { AiError } from "@/lib/ai/errors";
import { aiLandingPageGenerationSchema } from "@/lib/ai/schema";
import {
  sanitizeLandingPageContent,
  sanitizeLandingPageDesign,
} from "@/lib/ai/sanitize";
import type { AiGeneratedLandingPage } from "@/types/ai";

export function parseAiJsonResponse(rawText: string): AiGeneratedLandingPage {
  try {
    const parsed = JSON.parse(rawText) as unknown;
    const validated = aiLandingPageGenerationSchema.parse(parsed);

    return {
      content: sanitizeLandingPageContent(validated.content),
      design: sanitizeLandingPageDesign(validated.design),
    };
  } catch {
    throw new AiError(
      "AI response did not match the required landing page schema.",
      "AI_VALIDATION_ERROR",
      422,
    );
  }
}
