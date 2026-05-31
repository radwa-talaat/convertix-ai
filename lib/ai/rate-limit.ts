import { env } from "@/lib/env";
import { AiError } from "@/lib/ai/errors";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitRecord>();

export function assertAiRateLimit(identifier: string) {
  const now = Date.now();
  const windowMs = env.aiRateLimitWindowSeconds * 1000;
  const maxRequests = env.aiRateLimitMaxRequests;
  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (existing.count >= maxRequests) {
    throw new AiError(
      "AI generation rate limit exceeded. Try again later.",
      "AI_RATE_LIMITED",
      429,
    );
  }

  buckets.set(identifier, {
    ...existing,
    count: existing.count + 1,
  });
}
