import { createHmac, timingSafeEqual } from "crypto";

const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
] as const;

export function createPaymobHmac(
  payload: Record<string, unknown>,
  hmacSecret: string,
) {
  const transaction = unwrapPaymobObject(payload);
  const message = HMAC_FIELDS.map((field) =>
    String(readPath(transaction, field) ?? ""),
  ).join("");

  return createHmac("sha512", hmacSecret).update(message).digest("hex");
}

export function verifyPaymobHmac(
  payload: Record<string, unknown>,
  providedHmac: string | null,
  hmacSecret: string,
) {
  if (!providedHmac || !hmacSecret) {
    return false;
  }

  const expected = createPaymobHmac(payload, hmacSecret);
  const expectedBuffer = Buffer.from(expected, "hex");
  const providedBuffer = Buffer.from(providedHmac, "hex");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

function unwrapPaymobObject(payload: Record<string, unknown>) {
  return payload.obj && typeof payload.obj === "object"
    ? (payload.obj as Record<string, unknown>)
    : payload;
}

function readPath(payload: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, payload);
}
