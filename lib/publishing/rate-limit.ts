type Bucket = {
  count: number;
  resetAt: number;
};

const publishBuckets = new Map<string, Bucket>();

export function checkPublishRateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
) {
  const now = Date.now();
  const current = publishBuckets.get(key);

  if (!current || current.resetAt < now) {
    publishBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;

  return { allowed: true, remaining: limit - current.count };
}
