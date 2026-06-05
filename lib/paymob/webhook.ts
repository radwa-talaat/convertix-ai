import type { PaymobWebhookEvent } from "@/types/billing";

export function parsePaymobWebhook(
  payload: Record<string, unknown>,
  hmac: string | null,
): PaymobWebhookEvent {
  const obj =
    typeof payload.obj === "object" && payload.obj
      ? (payload.obj as Record<string, unknown>)
      : payload;
  const order =
    typeof obj.order === "object" && obj.order
      ? (obj.order as Record<string, unknown>)
      : null;

  return {
    amountCents: Number(obj.amount_cents ?? 0),
    currency: String(obj.currency ?? "EGP"),
    hmac,
    intentionId: firstString(
      readString(obj, "payment_key_claims.intention_id"),
      readString(obj, "intention.id"),
      readString(obj, "intention_id"),
      readString(payload, "intention_id"),
      readString(payload, "intention.id"),
    ),
    isSuccess: obj.success === true || obj.success === "true",
    orderId: order ? String(order.id ?? "") : String(obj.order ?? ""),
    raw: payload,
    transactionId: String(obj.id ?? ""),
  };
}

function firstString(...values: Array<string | null>) {
  return values.find(Boolean) ?? null;
}

function readString(payload: Record<string, unknown>, path: string) {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, payload);

  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : null;
}
