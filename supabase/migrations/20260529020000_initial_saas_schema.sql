create extension if not exists "pgcrypto";

create type public.project_status as enum ('draft', 'active', 'archived');
create type public.page_status as enum ('draft', 'published', 'archived');
create type public.template_visibility as enum ('private', 'team', 'public');
create type public.ai_generation_status as enum (
  'queued',
  'running',
  'completed',
  'failed'
);
create type public.subscription_status as enum (
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid'
);
create type public.domain_status as enum ('pending', 'verified', 'failed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text,
  status public.project_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug),
  unique (id, user_id)
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null,
  user_id uuid not null,
  title text not null check (char_length(title) between 2 and 140),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.page_status not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, slug),
  unique (id, user_id),
  foreign key (project_id, user_id)
    references public.projects(id, user_id)
    on delete cascade,
  foreign key (user_id) references public.users(id) on delete cascade
);

create table public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  description text,
  visibility public.template_visibility not null default 'private',
  thumbnail_path text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (visibility = 'public' and user_id is null)
    or (visibility <> 'public' and user_id is not null)
  )
);

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  page_id uuid references public.pages(id) on delete set null,
  prompt text not null check (char_length(prompt) <= 12000),
  status public.ai_generation_status not null default 'queued',
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  total_tokens integer not null default 0 check (total_tokens >= 0),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  provider text not null default 'stripe',
  provider_customer_id text,
  provider_subscription_id text,
  status public.subscription_status not null default 'trialing',
  plan text not null default 'free',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null,
  page_id uuid,
  event_name text not null check (char_length(event_name) between 2 and 80),
  event_data jsonb not null default '{}'::jsonb,
  visitor_id text,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  foreign key (project_id, user_id)
    references public.projects(id, user_id)
    on delete cascade,
  foreign key (page_id)
    references public.pages(id)
    on delete set null
);

create table public.domains (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null,
  hostname text not null,
  status public.domain_status not null default 'pending',
  verification_token text not null default encode(gen_random_bytes(24), 'hex'),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (hostname),
  foreign key (project_id, user_id)
    references public.projects(id, user_id)
    on delete cascade,
  check (hostname = lower(hostname)),
  check (hostname ~ '^(?!:\/\/)([a-z0-9-]+\.)+[a-z]{2,}$')
);

create index users_email_idx on public.users (email);
create index projects_user_id_idx on public.projects (user_id);
create index projects_user_status_updated_idx on public.projects (
  user_id,
  status,
  updated_at desc
);
create index pages_user_id_idx on public.pages (user_id);
create index pages_project_status_updated_idx on public.pages (
  project_id,
  status,
  updated_at desc
);
create index templates_user_id_idx on public.templates (user_id);
create index templates_visibility_created_idx on public.templates (
  visibility,
  created_at desc
);
create index ai_generations_user_created_idx on public.ai_generations (
  user_id,
  created_at desc
);
create index ai_generations_project_created_idx on public.ai_generations (
  project_id,
  created_at desc
);
create index ai_generations_page_created_idx on public.ai_generations (
  page_id,
  created_at desc
)
where page_id is not null;
create index subscriptions_user_status_idx on public.subscriptions (
  user_id,
  status
);
create index subscriptions_customer_idx on public.subscriptions (
  provider,
  provider_customer_id
)
where provider_customer_id is not null;
create unique index subscriptions_provider_subscription_uidx
on public.subscriptions (provider, provider_subscription_id)
where provider_subscription_id is not null;
create index analytics_user_created_idx on public.analytics (
  user_id,
  created_at desc
);
create index analytics_project_occurred_idx on public.analytics (
  project_id,
  occurred_at desc
);
create index analytics_page_occurred_idx on public.analytics (
  page_id,
  occurred_at desc
)
where page_id is not null;
create index domains_user_id_idx on public.domains (user_id);
create index domains_project_id_idx on public.domains (project_id);
create index domains_hostname_idx on public.domains (hostname);

create trigger users_set_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

create trigger templates_set_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

create trigger ai_generations_set_updated_at
before update on public.ai_generations
for each row execute function public.set_updated_at();

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create trigger domains_set_updated_at
before update on public.domains
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.pages enable row level security;
alter table public.templates enable row level security;
alter table public.ai_generations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.analytics enable row level security;
alter table public.domains enable row level security;

create policy "Users can read their own profile"
on public.users for select
to authenticated
using ((select auth.uid()) = id);

create policy "Users can update their own profile"
on public.users for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can manage their own projects"
on public.projects for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage their own pages"
on public.pages for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Anyone can read public templates"
on public.templates for select
to anon, authenticated
using (visibility = 'public');

create policy "Users can manage their own templates"
on public.templates for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage their own generation records"
on public.ai_generations for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can read their own subscriptions"
on public.subscriptions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can manage their own analytics"
on public.analytics for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can manage their own domains"
on public.domains for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'page-assets',
  'page-assets',
  false,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read their own page assets" on storage.objects;
drop policy if exists "Users can insert their own page assets" on storage.objects;
drop policy if exists "Users can update their own page assets" on storage.objects;
drop policy if exists "Users can delete their own page assets" on storage.objects;

create policy "Users can read their own page assets"
on storage.objects for select
to authenticated
using (
  bucket_id = 'page-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can insert their own page assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'page-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can update their own page assets"
on storage.objects for update
to authenticated
using (
  bucket_id = 'page-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'page-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can delete their own page assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'page-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
