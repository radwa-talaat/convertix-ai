import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const CSRF_COOKIE = "ai_builder_csrf";

export function createCsrfToken(secret: string) {
  const nonce = randomBytes(24).toString("hex");
  const signature = signCsrfNonce(nonce, secret);

  return `${nonce}.${signature}`;
}

export function verifyCsrfToken(token: string | null, secret: string) {
  if (!token || !secret) {
    return false;
  }

  const [nonce, signature] = token.split(".");

  if (!nonce || !signature) {
    return false;
  }

  const expected = signCsrfNonce(nonce, secret);
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === providedBuffer.length &&
    timingSafeEqual(expectedBuffer, providedBuffer)
  );
}

export function getCsrfCookieName() {
  return CSRF_COOKIE;
}

function signCsrfNonce(nonce: string, secret: string) {
  return createHmac("sha256", secret).update(nonce).digest("hex");
}
