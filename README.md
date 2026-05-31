# AI Landing Page Builder

Professional SaaS foundation built with Next.js 14 App Router, TypeScript,
Tailwind CSS, shadcn/ui primitives, ESLint, and Prettier.

## Production Docs

- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Environment Variables](docs/ENVIRONMENT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Documentation](docs/API.md)
- [Final Project Audit](docs/FINAL_PROJECT_AUDIT.md)
- [Launch Checklist](docs/LAUNCH_CHECKLIST.md)
- [Production Recommendations](docs/PRODUCTION_RECOMMENDATIONS.md)
- [Future Scaling](docs/FUTURE_SCALING.md)
- [Technical Debt](docs/TECHNICAL_DEBT.md)

## Scripts

```bash
npm run dev
npm run build
npm test
npm run check:prod-env
npm run lint
npm run typecheck
npm run format
```

## Architecture

- `app` contains App Router routes, metadata, and global styles.
- `components/ui` contains reusable shadcn-style primitives.
- `components/layout` contains product layout primitives.
- `components/dashboard` contains dashboard shell composition.
- `components/editor` is reserved for editor-specific UI.
- `components/landing-page` contains marketing shell composition.
- `config` centralizes app metadata and navigation.
- `hooks`, `services`, `store`, and `types` are ready for product layers.
- `lib` contains shared utilities and environment access.
- `styles` contains shared design system tokens.

## Environment

Copy `.env.local.example` to `.env.local` for local development. Vercel should
receive the same production secrets through Project Settings, and the app will
fall back to Vercel deployment URLs when `NEXT_PUBLIC_APP_URL` is not set.

## Supabase

Phase 2 adds a typed Supabase backend foundation:

- Auth pages: `/register`, `/login`, `/forgot-password`
- Auth callback route: `/auth/callback`
- Protected route middleware for `/dashboard`
- Supabase clients in `lib/supabase`
- Typed database and storage services in `services`
- Initial SQL migration in `supabase/migrations`

## Dashboard UI

Phase 3 adds the protected dashboard experience:

- `/dashboard`
- `/dashboard/projects`
- `/dashboard/templates`
- `/dashboard/billing`
- `/dashboard/settings`

Project management interactions are currently client-side UI only: create,
rename, delete, search, filter, loading states, empty states, and toast feedback.

## AI Engine

Phase 4 adds the protected AI content generation foundation:

- OpenAI Responses API integration through `services/openai`
- Prompt templates in `services/prompts`
- AI use-case layer in `services/ai`
- Schema validation, sanitization, retry, fallback, and rate limiting in `lib/ai`
- Protected API route at `/api/ai/generate`
- Dashboard AI generation form and preview panel

Set `OPENAI_API_KEY` and optionally `OPENAI_MODEL` in `.env.local` before
calling the AI endpoint.

## Rendering

Phase 5 adds the landing page rendering foundation:

- Section types and template contracts in `types/rendering`
- AI content adapter and sample template in `services/rendering`
- Section registry, resolver, ordering, dynamic loader, and SEO helpers in `lib/rendering`
- Reusable landing page sections in `components/landing-page/sections`
- Theme presets in `components/landing-page/themes`
- Dashboard live preview at `/dashboard/preview`
- Public SEO preview route at `/preview/launch-os`

## Editor

Phase 6 adds the protected drag and drop editor foundation:

- Editor route at `/dashboard/editor`
- Zustand state management in `store/editor`
- Draft autosave, change tracking, undo/redo history, and keyboard shortcuts
- Craft.js editor shell with `@dnd-kit` section reordering
- Live inline text editing on rendered landing page sections
- Left sidebar for sections, components, templates, and layers
- Top toolbar with save, undo, redo, preview, publish placeholder, and responsive modes
- Right properties panel for typography, colors, spacing, alignment, visibility, and backgrounds
- Desktop, tablet, and mobile canvas widths

Drafts are saved locally in this phase. Publishing, Stripe, analytics, and
backend editor persistence are intentionally out of scope.

## Publishing

Phase 7 adds the publishing and custom domain foundation:

- Protected dashboard route at `/dashboard/publishing`
- Public ISR route at `/p/[slug]`
- Slug validation, public URL helpers, publish rate limiting, and host rewrite helpers in `lib/publishing`
- Metadata, Open Graph, Twitter Card, structured data, sitemap, and robots helpers in `lib/seo`
- Supabase publish version history migration in `supabase/migrations`
- Publishing services in `services/publishing`
- Custom domain validation, DNS instruction generation, SSL status modeling, and domain services in `services/domains`
- Dashboard UI for published pages, domain setup, SEO settings, publish history, publish success modal, and copy URL actions

The code is prepared for Vercel ISR and wildcard/custom domain routing. Stripe,
analytics collection, and team workflows remain intentionally out of scope.

## Paymob Billing

Phase 8 adds the Paymob billing and subscriptions foundation:

- Paymob checkout/intention service in `services/paymob`
- Payment orchestration and webhook handling in `services/payments`
- Subscription, trial, and usage services in `services/subscriptions`
- Plan catalog, feature access, usage guards, and money helpers in `lib/payments`
- Paymob HMAC verification and webhook parsing in `lib/paymob`
- Billing UI in `components/billing`
- Protected billing dashboard at `/dashboard/billing`
- Public pricing page at `/pricing`
- Payment result screens at `/billing/success` and `/billing/failed`
- Secure webhook endpoint at `/api/paymob/webhook`
- Supabase billing migration for `payments`, `invoices`, and `usage_tracking`

The billing integration is Paymob-first for Egypt and local payment methods.
Stripe is intentionally not used.

## Analytics

Phase 9 adds a custom analytics and performance tracking foundation:

- Event ingestion endpoint at `/api/analytics/events`
- Anonymous visitor/session tracking with consent gating in `hooks/analytics`
- Public page tracker and cookie consent in `components/analytics`
- Analytics dashboard at `/dashboard/analytics`
- Custom charts for line, bar, pie, heatmap placeholder, and conversion funnel
- AI conversion score, weak CTA detection, and performance recommendations
- Supabase migration for `analytics_events`, `page_views`, `conversions`, and `traffic_sources`
- UTM parsing, traffic source detection, device detection, batching, and sendBeacon support

Analytics is custom and Supabase-backed. PostHog is not required for this phase.
