# Deployment Guide

## Vercel

1. Import the repository into Vercel.
2. Set all production environment variables in Vercel. `NEXT_PUBLIC_APP_URL`
   is recommended for a custom production domain, but Vercel preview
   deployments can fall back to `VERCEL_URL` automatically.
3. Run `npm run check:prod-env` locally before deployment.
4. Configure Supabase auth callback URLs:
   - `https://your-domain.com/auth/callback`
5. Configure Paymob webhook URL:
   - `https://your-domain.com/api/paymob/webhook`
6. Enable wildcard domains if using `project-name.yourapp.com`.

## Local Parity

1. Copy `.env.local.example` to `.env.local`.
2. Keep `NEXT_PUBLIC_APP_URL=http://localhost:3000` locally.
3. Use relative API calls in client components; the shared `createApiPath`
   helper keeps requests on the current host in both localhost and Vercel.

## Build

```bash
npm run format:check
npm run typecheck
npm run lint
npm test
npm run build
```

## Caching

Published pages use ISR. Sitemap and analytics reports are cache-aware and can
be revalidated after publishing.

## Security

The middleware applies secure headers globally. Keep secrets server-side and do
not expose Paymob secret keys with `NEXT_PUBLIC_`.
