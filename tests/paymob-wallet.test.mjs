import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Paymob wallet service uses the legacy direct wallet flow", async () => {
  const source = await readFile(
    new URL("../services/paymob/paymob-wallet.service.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /\/api\/auth\/tokens/);
  assert.match(source, /\/api\/ecommerce\/orders/);
  assert.match(source, /\/api\/acceptance\/payment_keys/);
  assert.match(source, /\/api\/acceptance\/payments\/pay/);
  assert.match(source, /subtype:\s*"WALLET"/);
  assert.match(source, /PAYMOB_WALLET_INTEGRATION_ID/);
});
