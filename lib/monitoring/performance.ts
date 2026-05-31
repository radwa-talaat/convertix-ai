import { logEvent } from "@/lib/monitoring/logger";

export async function measureAsync<T>(
  name: string,
  operation: () => Promise<T>,
): Promise<T> {
  const start = performance.now();

  try {
    return await operation();
  } finally {
    logEvent("info", "performance.measure", {
      durationMs: Math.round(performance.now() - start),
      name,
    });
  }
}
