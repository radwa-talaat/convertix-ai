import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
config({ path: ".env", quiet: true });

const required = [
  "PAYMOB_PUBLIC_KEY",
  "PAYMOB_SECRET_KEY",
  "PAYMOB_HMAC_SECRET",
];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`Missing Paymob variables: ${missing.join(", ")}`);
  process.exit(1);
}

const integrationIds = [
  process.env.PAYMOB_CARD_INTEGRATION_ID,
  process.env.PAYMOB_WALLET_INTEGRATION_ID,
  process.env.PAYMOB_APPLE_PAY_INTEGRATION_ID,
]
  .filter(Boolean)
  .map(Number)
  .filter((id) => Number.isSafeInteger(id) && id > 0);

if (integrationIds.length === 0) {
  console.log("Paymob credentials are configured.");
  console.log(
    "Next required value: PAYMOB_CARD_INTEGRATION_ID from Paymob > Payment Devices.",
  );
  process.exit(2);
}

const baseUrl = process.env.PAYMOB_BASE_URL ?? "https://accept.paymob.com";
const reference = `codex_test_${Date.now()}`;
const response = await fetch(`${baseUrl}/v1/intention/`, {
  body: JSON.stringify({
    amount: 100,
    billing_data: {
      apartment: "NA",
      building: "NA",
      city: "Cairo",
      country: "EG",
      email: "test@example.com",
      first_name: "Paymob",
      floor: "NA",
      last_name: "Test",
      phone_number: "+201000000000",
      state: "Cairo",
      street: "Test Street",
    },
    currency: "EGP",
    items: [
      {
        amount: 100,
        description: "Convertix Paymob sandbox connectivity test",
        name: "Sandbox Test",
        quantity: 1,
      },
    ],
    payment_methods: integrationIds,
    special_reference: reference,
  }),
  headers: {
    Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  method: "POST",
});
const text = (await response.text()).trim();

if (!response.ok) {
  console.error(
    `Paymob sandbox test failed (${response.status} ${response.statusText}).`,
  );
  console.error(text || "Paymob returned no error details.");
  process.exit(1);
}

let result;
try {
  result = JSON.parse(text);
} catch {
  console.error("Paymob returned an invalid JSON response.");
  process.exit(1);
}

console.log("Paymob sandbox connection succeeded.");
console.log(`Intention created: ${result.id ? "yes" : "no"}`);
console.log(
  `Checkout client secret returned: ${result.client_secret ? "yes" : "no"}`,
);

if (!result.client_secret) {
  process.exit(1);
}

const checkoutUrl = `${baseUrl}/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${result.client_secret}`;
const checkoutResponse = await fetch(checkoutUrl, { redirect: "manual" });
const checkoutReachable =
  checkoutResponse.ok ||
  (checkoutResponse.status >= 300 && checkoutResponse.status < 400);

console.log(`Hosted checkout reachable: ${checkoutReachable ? "yes" : "no"}`);

if (!checkoutReachable) {
  process.exit(1);
}
