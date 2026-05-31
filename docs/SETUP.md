# Setup Guide

## Requirements

- Node.js 20+
- npm
- Supabase project
- OpenAI API key
- Paymob merchant account

## Install

```bash
npm install
cp .env.example .env.local
npm run typecheck
npm run lint
npm run build
```

## Local Development

```bash
npm run dev -- --port 3000
```

Open `http://localhost:3000`.

## Supabase

Run migrations in order from `supabase/migrations`.

Required tables include auth profiles, projects, pages, templates, AI generations,
subscriptions, payments, invoices, usage tracking, publishing history, domains,
and analytics events.
