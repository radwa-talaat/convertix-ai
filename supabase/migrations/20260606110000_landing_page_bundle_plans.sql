alter table public.payment_credit_grants
  add column if not exists package_plan text;

alter table public.project_entitlements
  add column if not exists package_plan text;

update public.payment_credit_grants grants
set package_plan = payments.plan
from public.payments payments
where payments.id = grants.payment_id
  and grants.package_plan is null;

update public.project_entitlements entitlements
set package_plan = coalesce(
  (
    select subscriptions.plan
    from public.subscriptions subscriptions
    where subscriptions.user_id = entitlements.user_id
      and subscriptions.plan in ('free', 'pro', 'agency')
    order by subscriptions.created_at desc
    limit 1
  ),
  'free'
)
where entitlements.package_plan is null;

alter table public.payment_credit_grants
  alter column package_plan set default 'free',
  alter column package_plan set not null;

alter table public.project_entitlements
  alter column package_plan set default 'free',
  alter column package_plan set not null;

alter table public.payment_credit_grants
  drop constraint if exists payment_credit_grants_package_plan_check;

alter table public.payment_credit_grants
  add constraint payment_credit_grants_package_plan_check
  check (package_plan in ('free', 'pro', 'agency'));

alter table public.project_entitlements
  drop constraint if exists project_entitlements_package_plan_check;

alter table public.project_entitlements
  add constraint project_entitlements_package_plan_check
  check (package_plan in ('free', 'pro', 'agency'));

create table if not exists public.landing_page_credit_lots (
  payment_id uuid primary key references public.payments(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  package_plan text not null check (package_plan in ('free', 'pro', 'agency')),
  total_quantity integer not null check (total_quantity > 0),
  remaining_quantity integer not null
    check (remaining_quantity >= 0 and remaining_quantity <= total_quantity),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

with grant_usage as (
  select
    grants.payment_id,
    grants.user_id,
    grants.package_plan,
    grants.quantity,
    coalesce(
      sum(grants.quantity) over (
        partition by grants.user_id
        order by grants.created_at asc, grants.payment_id asc
        rows between unbounded preceding and 1 preceding
      ),
      0
    )::integer as credits_before,
    (
      select count(*)::integer
      from public.project_entitlements entitlements
      where entitlements.user_id = grants.user_id
    ) as used_credits
  from public.payment_credit_grants grants
)
insert into public.landing_page_credit_lots (
  payment_id,
  user_id,
  package_plan,
  total_quantity,
  remaining_quantity
)
select
  grant_usage.payment_id,
  grant_usage.user_id,
  grant_usage.package_plan,
  grant_usage.quantity,
  greatest(
    0,
    grant_usage.quantity - greatest(
      0,
      least(
        grant_usage.quantity,
        grant_usage.used_credits - grant_usage.credits_before
      )
    )
  )
from grant_usage
on conflict (payment_id) do nothing;

create index if not exists landing_page_credit_lots_available_idx
on public.landing_page_credit_lots (
  user_id,
  package_plan,
  created_at
)
where remaining_quantity > 0;

drop trigger if exists landing_page_credit_lots_set_updated_at
on public.landing_page_credit_lots;

create trigger landing_page_credit_lots_set_updated_at
before update on public.landing_page_credit_lots
for each row execute function public.set_updated_at();

alter table public.landing_page_credit_lots enable row level security;

drop policy if exists "Users can read their own landing page credit lots"
on public.landing_page_credit_lots;

create policy "Users can read their own landing page credit lots"
on public.landing_page_credit_lots for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.grant_landing_page_credits(
  target_payment_id uuid,
  target_user_id uuid,
  credit_quantity integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  paid_plan text;
begin
  if credit_quantity <= 0 then
    raise exception 'Credit quantity must be greater than zero.';
  end if;

  select plan into paid_plan
  from public.payments
  where id = target_payment_id
    and user_id = target_user_id
    and plan in ('free', 'pro', 'agency')
    and status = 'paid'
    and landing_page_quantity = credit_quantity;

  if paid_plan is null then
    raise exception 'Only a verified paid landing-page package can grant credits.';
  end if;

  insert into public.payment_credit_grants (
    payment_id,
    user_id,
    quantity,
    package_plan
  )
  values (target_payment_id, target_user_id, credit_quantity, paid_plan)
  on conflict (payment_id) do nothing;

  if not found then
    return false;
  end if;

  insert into public.landing_page_credit_lots (
    payment_id,
    user_id,
    package_plan,
    total_quantity,
    remaining_quantity
  )
  values (
    target_payment_id,
    target_user_id,
    paid_plan,
    credit_quantity,
    credit_quantity
  );

  insert into public.landing_page_credits (user_id, purchased, consumed)
  values (target_user_id, credit_quantity, 0)
  on conflict (user_id) do update
  set purchased = public.landing_page_credits.purchased + excluded.purchased;

  return true;
end;
$$;

create or replace function public.create_paid_project(
  project_name text,
  project_slug text,
  project_locale text default 'en'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  created_project_id uuid;
  selected_payment_id uuid;
  selected_package_plan text;
begin
  if current_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required.';
  end if;

  select payment_id, package_plan
  into selected_payment_id, selected_package_plan
  from public.landing_page_credit_lots
  where user_id = current_user_id
    and remaining_quantity > 0
  order by
    case package_plan
      when 'agency' then 1
      when 'pro' then 2
      else 3
    end,
    created_at asc
  for update skip locked
  limit 1;

  if selected_payment_id is null then
    raise exception using
      errcode = 'P0001',
      message = 'PAYMENT_REQUIRED: Buy a landing page package before creating a new project.';
  end if;

  update public.landing_page_credit_lots
  set remaining_quantity = remaining_quantity - 1
  where payment_id = selected_payment_id;

  update public.landing_page_credits
  set consumed = consumed + 1
  where user_id = current_user_id
    and consumed < purchased;

  if not found then
    raise exception 'Landing page credit totals are inconsistent.';
  end if;

  insert into public.projects (user_id, name, slug, locale, status)
  values (current_user_id, project_name, project_slug, project_locale, 'draft')
  returning id into created_project_id;

  insert into public.project_entitlements (
    project_id,
    user_id,
    source,
    package_plan
  )
  values (
    created_project_id,
    current_user_id,
    'credit',
    selected_package_plan
  );

  return created_project_id;
end;
$$;

create or replace function public.enforce_project_domain_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  entitlement_plan text;
  existing_domains integer;
  domain_limit integer;
begin
  select package_plan into entitlement_plan
  from public.project_entitlements
  where project_id = new.project_id
    and user_id = new.user_id;

  if entitlement_plan is null then
    raise exception 'A paid project entitlement is required before connecting a domain.';
  end if;

  domain_limit := case
    when entitlement_plan = 'agency' then 25
    else 1
  end;

  select count(*)::integer into existing_domains
  from public.domains
  where project_id = new.project_id
    and id <> coalesce(new.id, gen_random_uuid());

  if existing_domains >= domain_limit then
    raise exception 'DOMAIN_LIMIT_REACHED: This package allows % custom domain(s) per landing page.', domain_limit;
  end if;

  return new;
end;
$$;

drop trigger if exists domains_enforce_project_limit on public.domains;

create trigger domains_enforce_project_limit
before insert or update of project_id, user_id on public.domains
for each row execute function public.enforce_project_domain_limit();

revoke all on function public.grant_landing_page_credits(uuid, uuid, integer)
from public, anon, authenticated;
grant execute on function public.grant_landing_page_credits(uuid, uuid, integer)
to service_role;

revoke all on function public.create_paid_project(text, text, text)
from public, anon;
grant execute on function public.create_paid_project(text, text, text)
to authenticated, service_role;

grant select on public.landing_page_credit_lots to authenticated;
grant all privileges on public.landing_page_credit_lots to service_role;
