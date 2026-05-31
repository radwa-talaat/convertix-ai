import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { logError } from "@/lib/monitoring/logger";

export function apiErrorResponse(error: unknown, fallbackMessage: string) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload.",
      },
      { status: 422 },
    );
  }

  logError(error);

  return NextResponse.json(
    {
      code: "INTERNAL_ERROR",
      message: fallbackMessage,
    },
    { status: 500 },
  );
}
