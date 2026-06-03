import "server-only";

import { createHash } from "crypto";

import { env } from "@/lib/env";
import { toAiError } from "@/lib/ai/errors";
import { createFallbackLandingPageGeneration } from "@/lib/ai/fallback";
import { parseAiJsonResponse } from "@/lib/ai/parser";
import { assertAiRateLimit } from "@/lib/ai/rate-limit";
import { aiGenerationInputSchema } from "@/lib/ai/schema";
import { withRetry } from "@/lib/ai/retry";
import { generateStructuredLandingPageContent } from "@/services/openai";
import { buildLandingPagePrompt } from "@/services/prompts";
import { trackAiTokenUsage } from "@/services/ai/token-usage.service";
import type { AiGenerationInput, AiGenerationResult } from "@/types/ai";

type GenerateLandingPageContentParams = {
  identifier: string;
  input: unknown;
};

function hashIdentifier(identifier: string) {
  return createHash("sha256").update(identifier).digest("hex").slice(0, 64);
}

export async function generateLandingPageContent({
  identifier,
  input,
}: GenerateLandingPageContentParams): Promise<AiGenerationResult> {
  const parsedInput = aiGenerationInputSchema.parse(input);
  const stableIdentifier = hashIdentifier(identifier);

  assertAiRateLimit(stableIdentifier);

  if (!env.openaiApiKey) {
    return buildFallbackResult(parsedInput, "Missing OPENAI_API_KEY.");
  }

  const prompt = buildLandingPagePrompt(parsedInput);

  try {
    const response = await withRetry(
      () =>
        generateStructuredLandingPageContent({
          model: env.openaiModel,
          promptCacheKey: `landing-page:${parsedInput.language}`,
          safetyIdentifier: stableIdentifier,
          system: prompt.system,
          user: prompt.user,
        }),
      {
        attempts: 2,
        baseDelayMs: 600,
      },
    );

    const generated = parseAiJsonResponse(response.outputText);
    trackAiTokenUsage(stableIdentifier, response.usage);

    return {
      content: generated.content,
      design: generated.design,
      fallbackUsed: false,
      model: env.openaiModel,
      requestId: response.id,
      usage: response.usage,
    };
  } catch (error) {
    const aiError = toAiError(error);

    if (
      aiError.code === "AI_VALIDATION_ERROR" ||
      aiError.code === "AI_PROVIDER_ERROR"
    ) {
      return buildFallbackResult(parsedInput, aiError.message);
    }

    throw aiError;
  }
}

function buildFallbackResult(
  input: AiGenerationInput,
  reason: string,
): AiGenerationResult {
  const generated = createFallbackLandingPageGeneration(input);

  return {
    content: generated.content,
    design: generated.design,
    fallbackUsed: true,
    model: "fallback",
    requestId: reason,
    usage: {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    },
  };
}
