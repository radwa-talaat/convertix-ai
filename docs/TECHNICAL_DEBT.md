# Technical Debt Report

## Known Debt

- Dashboard data is still partly fixture-backed where production records are not available.
- Rate limiting is in-memory and should move to a shared store.
- Tests cover core logic, but full browser E2E coverage is not yet present.
- Paymob checkout uses default billing form data in the demo upgrade action.
- Analytics dashboard uses demo report snapshots until real aggregation queries are wired.

## Recommended Fix Order

1. Replace fixture dashboards with Supabase queries.
2. Add Redis/KV-backed rate limits.
3. Add Playwright E2E tests for auth, publish, billing, and analytics.
4. Add webhook idempotency records.
5. Add materialized analytics rollups.
