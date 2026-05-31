# API Documentation

## `POST /api/ai/generate`

Protected endpoint. Generates structured landing page JSON.

Security:

- Requires authenticated Supabase session
- Rate limited per user
- Validated and sanitized input

## `POST /api/paymob/webhook`

Public Paymob webhook.

Security:

- Rate limited per IP
- HMAC verification
- Uses Supabase admin client server-side
- Updates payments, invoices, and subscriptions

## `POST /api/analytics/events`

Public analytics ingestion endpoint.

Security:

- Rate limited per IP
- Zod payload validation
- Batches max 25 events
- Anonymous visitor/session identifiers

## Public Routes

- `/p/[slug]`: published landing page
- `/sitemap.xml`: dynamic sitemap
- `/robots.txt`: robots rules
