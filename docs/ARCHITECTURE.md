# Architecture

## Layers

- `app`: Next.js App Router routes, API handlers, server actions, metadata.
- `components`: UI, dashboard, editor, landing page, billing, analytics, publishing.
- `services`: provider integrations and use-case orchestration.
- `lib`: framework-agnostic utilities for AI, security, payments, rendering, SEO, monitoring.
- `types`: shared TypeScript contracts.
- `supabase/migrations`: database schema and RLS policies.

## Clean Boundaries

- API routes validate and authorize.
- Services orchestrate business workflows.
- Lib modules hold pure helpers.
- Components remain mostly presentation-focused.

## Production Systems

- Auth and database: Supabase
- AI: OpenAI
- Billing: Paymob
- Rendering: trusted React components from structured JSON
- Publishing: ISR public routes and domain rewrite foundation
- Analytics: custom Supabase-backed tracking
