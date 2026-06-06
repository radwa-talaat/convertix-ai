create table if not exists public.landing_page_credits (
  user_id uuid primary key references public.users(id) on delete cascade,
  purchased integer not null default 0 check (purchased >= 0),
  consumed integer not null default 0 check (consumed >= 0 and consumed <= purchased),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_credit_grants (
  payment_id uuid primary key references public.payments(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.project_entitlements (
  project_id uuid primary key references public.projects(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  source text not null check (source in ('credit', 'subscription')),
  created_at timestamptz not null default now(),
  foreign key (project_id, user_id)
    references public.projects(id, user_id)
    on delete cascade
);

alter table public.payments
  add column if not exists landing_page_quantity integer not null default 1
  check (landing_page_quantity > 0);

alter table public.invoices
  add column if not exists landing_page_quantity integer not null default 1
  check (landing_page_quantity > 0);

insert into public.payment_credit_grants (payment_id, user_id, quantity)
select id, user_id, landing_page_quantity
from public.payments
where status = 'paid' and plan = 'free'
on conflict (payment_id) do nothing;

insert into public.landing_page_credits (user_id, purchased, consumed)
select
  grants.user_id,
  sum(grants.quantity)::integer,
  least(
    sum(grants.quantity)::integer,
    (select count(*)::integer from public.projects where user_id = grants.user_id)
  )
from public.payment_credit_grants grants
group by grants.user_id
on conflict (user_id) do update
set
  purchased = excluded.purchased,
  consumed = excluded.consumed;

insert into public.project_entitlements (project_id, user_id, source)
select projects.id, projects.user_id, 'subscription'
from public.projects projects
where exists (
  select 1
  from public.subscriptions subscriptions
  where subscriptions.user_id = projects.user_id
    and subscriptions.status in ('active', 'trialing')
    and subscriptions.plan in ('pro', 'agency')
    and (
      subscriptions.current_period_end is null
      or subscriptions.current_period_end > now()
    )
)
on conflict (project_id) do nothing;

with ranked_projects as (
  select
    projects.id,
    projects.user_id,
    row_number() over (
      partition by projects.user_id
      order by projects.created_at asc, projects.id asc
    ) as project_number
  from public.projects projects
  where not exists (
    select 1
    from public.project_entitlements entitlements
    where entitlements.project_id = projects.id
  )
)
insert into public.project_entitlements (project_id, user_id, source)
select ranked.id, ranked.user_id, 'credit'
from ranked_projects ranked
join public.landing_page_credits credits on credits.user_id = ranked.user_id
where ranked.project_number <= credits.purchased
on conflict (project_id) do nothing;

update public.landing_page_credits credits
set consumed = least(
  credits.purchased,
  (
    select count(*)::integer
    from public.project_entitlements entitlements
    where entitlements.user_id = credits.user_id
      and entitlements.source = 'credit'
  )
);

create index if not exists payment_credit_grants_user_idx
on public.payment_credit_grants (user_id, created_at desc);

create index if not exists project_entitlements_user_idx
on public.project_entitlements (user_id, created_at desc);

create trigger landing_page_credits_set_updated_at
before update on public.landing_page_credits
for each row execute function public.set_updated_at();

alter table public.landing_page_credits enable row level security;
alter table public.payment_credit_grants enable row level security;
alter table public.project_entitlements enable row level security;

create policy "Users can read their own landing page credits"
on public.landing_page_credits for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their own payment credit grants"
on public.payment_credit_grants for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can read their own project entitlements"
on public.project_entitlements for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can manage their own projects" on public.projects;

create policy "Users can read their own projects"
on public.projects for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update their own projects"
on public.projects for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own projects"
on public.projects for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can manage their own pages" on public.pages;

create policy "Users can read their own pages"
on public.pages for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update their own pages"
on public.pages for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own pages"
on public.pages for delete
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
begin
  if credit_quantity <= 0 then
    raise exception 'Credit quantity must be greater than zero.';
  end if;

  if not exists (
    select 1
    from public.payments
    where id = target_payment_id
      and user_id = target_user_id
      and plan = 'free'
      and status = 'paid'
      and landing_page_quantity = credit_quantity
  ) then
    raise exception 'Only a verified paid landing-page payment can grant credits.';
  end if;

  insert into public.payment_credit_grants (payment_id, user_id, quantity)
  values (target_payment_id, target_user_id, credit_quantity)
  on conflict (payment_id) do nothing;

  if not found then
    return false;
  end if;

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
  entitlement_source text;
  has_unlimited_plan boolean;
begin
  if current_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required.';
  end if;

  select exists (
    select 1
    from public.subscriptions
    where user_id = current_user_id
      and status in ('active', 'trialing')
      and plan in ('pro', 'agency')
      and (current_period_end is null or current_period_end > now())
  ) into has_unlimited_plan;

  if not has_unlimited_plan then
    update public.landing_page_credits
    set consumed = consumed + 1
    where user_id = current_user_id
      and consumed < purchased;

    if not found then
      raise exception using
        errcode = 'P0001',
        message = 'PAYMENT_REQUIRED: Buy a landing page before creating a new project.';
    end if;

    entitlement_source := 'credit';
  else
    entitlement_source := 'subscription';
  end if;

  insert into public.projects (user_id, name, slug, locale, status)
  values (current_user_id, project_name, project_slug, project_locale, 'draft')
  returning id into created_project_id;

  insert into public.project_entitlements (project_id, user_id, source)
  values (created_project_id, current_user_id, entitlement_source);

  return created_project_id;
end;
$$;

revoke all on function public.grant_landing_page_credits(uuid, uuid, integer)
from public, anon, authenticated;
grant execute on function public.grant_landing_page_credits(uuid, uuid, integer)
to service_role;

revoke all on function public.create_paid_project(text, text, text)
from public, anon;
grant execute on function public.create_paid_project(text, text, text)
to authenticated, service_role;

grant select on public.landing_page_credits to authenticated;
grant select on public.payment_credit_grants to authenticated;
grant select on public.project_entitlements to authenticated;
grant all privileges on public.landing_page_credits to service_role;
grant all privileges on public.payment_credit_grants to service_role;
grant all privileges on public.project_entitlements to service_role;
