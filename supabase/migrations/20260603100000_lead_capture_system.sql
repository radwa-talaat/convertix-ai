do $$
begin
  create type public.lead_status as enum (
    'new',
    'contacted',
    'converted',
    'archived'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null,
  page_id uuid not null,
  page_slug text not null check (char_length(page_slug) between 1 and 140),
  landing_page_title text not null default '',
  product_name text,
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_email text check (
    customer_email is null
    or customer_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  ),
  customer_phone text check (
    customer_phone is null
    or char_length(customer_phone) between 7 and 32
  ),
  message text,
  source text not null default 'landing_page',
  status public.lead_status not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (project_id, user_id)
    references public.projects(id, user_id)
    on delete cascade,
  foreign key (page_id, user_id)
    references public.pages(id, user_id)
    on delete cascade
);

create index if not exists leads_user_created_idx
on public.leads (user_id, created_at desc);

create index if not exists leads_project_created_idx
on public.leads (project_id, created_at desc);

create index if not exists leads_page_created_idx
on public.leads (page_id, created_at desc);

create index if not exists leads_status_created_idx
on public.leads (user_id, status, created_at desc);

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

create policy "Users can read their own leads"
on public.leads for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can update their own leads"
on public.leads for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own leads"
on public.leads for delete
to authenticated
using ((select auth.uid()) = user_id);
