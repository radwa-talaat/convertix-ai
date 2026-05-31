type LogLevel = "debug" | "error" | "info" | "warn";

type LogContext = Record<string, unknown>;

export function logEvent(
  level: LogLevel,
  message: string,
  context: LogContext = {},
) {
  const payload = {
    context,
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export function logError(error: unknown, context: LogContext = {}) {
  logEvent("error", error instanceof Error ? error.message : "Unknown error", {
    ...context,
    stack: error instanceof Error ? error.stack : undefined,
  });
}
