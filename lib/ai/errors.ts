import type { AiGenerationErrorCode } from "@/types/ai";

export class AiError extends Error {
  constructor(
    message: string,
    public readonly code: AiGenerationErrorCode,
    public readonly status = 500,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export function toAiError(error: unknown) {
  if (error instanceof AiError) {
    return error;
  }

  if (error instanceof Error) {
    return new AiError(error.message, "AI_PROVIDER_ERROR", 502);
  }

  return new AiError(
    "Unexpected AI generation error.",
    "AI_UNKNOWN_ERROR",
    500,
  );
}
