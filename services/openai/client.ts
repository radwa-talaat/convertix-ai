import "server-only";

import OpenAI from "openai";

import { assertOpenAiEnv, env } from "@/lib/env";

export function createOpenAiClient() {
  assertOpenAiEnv();

  return new OpenAI({
    apiKey: env.openaiApiKey,
  });
}
