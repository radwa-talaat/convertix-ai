# Environment Variables

## Public

- `NEXT_PUBLIC_APP_URL` for local development. On Vercel this can be omitted
  when `VERCEL_URL`, `VERCEL_BRANCH_URL`, or `VERCEL_PROJECT_PRODUCTION_URL` is
  available.
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Server Only

- `SUPABASE_SECRET_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `AI_RATE_LIMIT_MAX_REQUESTS`
- `AI_RATE_LIMIT_WINDOW_SECONDS`
- `PAYMOB_BASE_URL`
- `PAYMOB_PUBLIC_KEY`
- `PAYMOB_SECRET_KEY`
- `PAYMOB_HMAC_SECRET`
- `PAYMOB_CARD_INTEGRATION_ID`
- `PAYMOB_WALLET_INTEGRATION_ID`
- `PAYMOB_APPLE_PAY_INTEGRATION_ID`

## Validation

Run:

```bash
npm run check:prod-env
```

Use `.env.local.example` for local development and `.env.example` as the
canonical deployment template. Next.js loads `.env.local` automatically during
local development, while Vercel injects production values from the project
settings.
