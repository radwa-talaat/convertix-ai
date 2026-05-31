import type { AiTokenUsage } from "@/types/ai";

type TokenUsageRecord = AiTokenUsage & {
  requests: number;
};

const usageByIdentifier = new Map<string, TokenUsageRecord>();

export function trackAiTokenUsage(identifier: string, usage: AiTokenUsage) {
  const current = usageByIdentifier.get(identifier) ?? {
    inputTokens: 0,
    outputTokens: 0,
    requests: 0,
    totalTokens: 0,
  };

  usageByIdentifier.set(identifier, {
    inputTokens: current.inputTokens + usage.inputTokens,
    outputTokens: current.outputTokens + usage.outputTokens,
    requests: current.requests + 1,
    totalTokens: current.totalTokens + usage.totalTokens,
  });
}

export function getAiTokenUsage(identifier: string) {
  return usageByIdentifier.get(identifier) ?? null;
}
