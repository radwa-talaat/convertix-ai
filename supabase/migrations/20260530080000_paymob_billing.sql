create type public.payment_status as enum (
  'pending',
  'authorized',
  'paid',
  'failed',
  'refunded',
  'voided'
);

create type public.invoice_status as enum (
  'draft',
  'open',
  'paid',
  'void',
  'failed'
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  invoice_id uuid,
  provider text not null default 'paymob',
  provider_intention_id text,
  provider_order_id text,
  provider_transaction_id text,
  plan text not null check (plan in ('free', 'pro', 'agency')),
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EGP',
  status public.payment_status not null default 'pending',
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_transaction_id),
  unique (provider, provider_intention_id)
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null,
  provider text not null default 'paymob',
  plan text not null check (plan in ('free', 'pro', 'agency')),
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'EGP',
  status public.invoice_status not null default 'open',
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments
  add constraint payments_invoice_id_fkey
  foreign key (invoice_id) references public.invoices(id) on delete set null;

create table public.usage_tracking (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  metric text not null check (
    metric in ('landing_pages', 'ai_credits', 'custom_domains', 'team_members')
  ),
  used integer not null default 0 check (used >= 0),
  limit_value integer not null check (limit_value >= 0),
  period_start timestamptz not null default now(),
  period_end timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, metric, period_start)
);

alter table public.subscriptions
  add column if not exists trial_ends_at timestamptz,
  add column if not exists canceled_at timestamptz;

create index payments_user_created_idx on public.payments (user_id, created_at desc);
create index payments_intention_idx on public.payments (provider_intention_id)
where provider_intention_id is not null;
create index payments_transaction_idx on public.payments (provider_transaction_id)
where provider_transaction_id is not null;
create index invoices_user_created_idx on public.invoices (user_id, created_at desc);
create index usage_tracking_user_metric_idx on public.usage_tracking (
  user_id,
  metric,
  period_end desc
);

create trigger payments_set_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create trigger invoices_set_updated_at
before update on public.invoices
for each row execute function public.set_updated_at();

create trigger usage_tracking_set_updated_at
before update on public.usage_tracking
for each row execute function public.set_updated_at();

alter table public.payments enable row level security;
alter table public.invoices enable row level security;
alter table public.usage_tracking enable row level security;

create policy "Users can read their own payments"
on public.payments for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own pending payments"
on public.payments for insert
to authenticated
with check ((select auth.uid()) = user_id and status = 'pending');

create policy "Users can read their own invoices"
on public.invoices for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their own usage"
on public.usage_tracking for select
to authenticated
using ((select auth.uid()) = user_id);
