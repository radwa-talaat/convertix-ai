import "server-only";

import { env } from "@/lib/env";
import { createOpenAiClient } from "@/services/openai/client";

type GenerateLandingPageImageParams = {
  prompt: string;
};

export async function generateLandingPageImage({
  prompt,
}: GenerateLandingPageImageParams) {
  const openai = createOpenAiClient();
  const response = await openai.images.generate({
    model: env.openaiImageModel,
    prompt,
    quality: "low",
    size: "1024x1024",
    ...(env.openaiImageModel.startsWith("gpt-image")
      ? {
          output_format: "webp",
        }
      : {}),
  } as never);
  const image = response.data?.[0];
  const b64Json = image && "b64_json" in image ? image.b64_json : undefined;

  if (!b64Json) {
    throw new Error("OpenAI did not return an image.");
  }

  return {
    dataUrl: `data:image/webp;base64,${b64Json}`,
    model: env.openaiImageModel,
  };
}
