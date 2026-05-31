# Deployment Guide

## Vercel

1. Import the repository into Vercel.
2. Set all production environment variables.
3. Run `npm run check:prod-env` locally before deployment.
4. Configure Supabase auth callback URLs:
   - `https://your-domain.com/auth/callback`
5. Configure Paymob webhook URL:
   - `https://your-domain.com/api/paymob/webhook`
6. Enable wildcard domains if using `project-name.yourapp.com`.

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
