# Production Recommendations

## Security

- Move rate limiting to Upstash Redis or Vercel KV for multi-instance accuracy.
- Add Sentry or Axiom for persistent error and performance monitoring.
- Configure strict CSP nonces after Paymob checkout behavior is fully verified.
- Rotate Supabase and Paymob secrets regularly.

## Performance

- Add Lighthouse CI to the deployment pipeline.
- Track Web Vitals through the analytics ingestion endpoint.
- Add image CDN policies for user uploaded assets.

## Reliability

- Add webhook replay handling with a dedicated idempotency table.
- Add queue-based async processing for heavy analytics aggregation.
- Add database read replicas if analytics volume grows.
