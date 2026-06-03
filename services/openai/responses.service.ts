import "server-only";

import type { ResponseUsage } from "openai/resources/responses/responses";

import { aiLandingPageJsonSchema } from "@/lib/ai/schema";
import { createOpenAiClient } from "@/services/openai/client";
import type { AiTokenUsage } from "@/types/ai";

type GenerateStructuredContentParams = {
  model: string;
  promptCacheKey: string;
  safetyIdentifier: string;
  system: string;
  user: string;
};

function mapUsage(usage?: ResponseUsage): AiTokenUsage {
  return {
    inputTokens: usage?.input_tokens ?? 0,
    outputTokens: usage?.output_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0,
  };
}

export async function generateStructuredLandingPageContent({
  model,
  promptCacheKey,
  safetyIdentifier,
  system,
  user,
}: GenerateStructuredContentParams) {
  const openai = createOpenAiClient();

  const response = await openai.responses.create({
    input: user,
    instructions: system,
    max_output_tokens: 2600,
    model,
    prompt_cache_key: promptCacheKey,
    safety_identifier: safetyIdentifier,
    store: false,
    text: {
      format: {
        description:
          "Product-aware landing page copy and design direction for a SaaS page builder.",
        name: "landing_page_generation",
        schema: aiLandingPageJsonSchema,
        strict: true,
        type: "json_schema",
      },
    },
  });

  return {
    id: response.id,
    outputText: response.output_text,
    usage: mapUsage(response.usage),
  };
}
