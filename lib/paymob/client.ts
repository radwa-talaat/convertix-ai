import { env, assertPaymobEnv } from "@/lib/env";

type PaymobRequestOptions = {
  body?: unknown;
  method?: "GET" | "POST" | "PUT";
};

export async function paymobRequest<TResponse>(
  path: string,
  options: PaymobRequestOptions = {},
): Promise<TResponse> {
  assertPaymobEnv();

  const response = await fetch(`${env.paymobBaseUrl}${path}`, {
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: {
      Authorization: `Token ${env.paymobSecretKey}`,
      "Content-Type": "application/json",
    },
    method: options.method ?? "GET",
  });

  if (!response.ok) {
    const errorText = (await response.text()).trim();
    const requestId =
      response.headers.get("x-request-id") ??
      response.headers.get("x-correlation-id");
    const details = errorText || response.statusText || "No response details";

    throw new Error(
      `Paymob request failed (${response.status}): ${details}${requestId ? ` [request: ${requestId}]` : ""}`,
    );
  }

  const responseText = await response.text();

  if (!responseText) {
    throw new Error("Paymob returned an empty successful response.");
  }

  try {
    return JSON.parse(responseText) as TResponse;
  } catch {
    throw new Error("Paymob returned an invalid JSON response.");
  }
}
