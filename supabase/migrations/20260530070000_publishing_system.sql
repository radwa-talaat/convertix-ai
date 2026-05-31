create type public.publish_status as enum (
  'draft',
  'publishing',
  'published',
  'unpublished',
  'failed'
);

create table public.publish_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid not null,
  page_id uuid not null,
  version integer not null check (version > 0),
  status public.publish_status not null default 'published',
  snapshot jsonb not null default '{}'::jsonb,
  published_url text not null,
  created_at timestamptz not null default now(),
  unique (page_id, version),
  foreign key (project_id, user_id)
    references public.projects(id, user_id)
    on delete cascade,
  foreign key (page_id, user_id)
    references public.pages(id, user_id)
    on delete cascade
);

alter table public.pages
  add column if not exists published_content jsonb not null default '{}'::jsonb,
  add column if not exists published_url text,
  add column if not exists version integer not null default 0 check (version >= 0);

alter table public.domains
  add column if not exists ssl_status text not null default 'pending'
    check (ssl_status in ('pending', 'issued', 'failed')),
  add column if not exists dns_records jsonb not null default '[]'::jsonb;

create index publish_versions_user_created_idx
on public.publish_versions (user_id, created_at desc);

create index publish_versions_page_version_idx
on public.publish_versions (page_id, version desc);

create index pages_public_slug_idx
on public.pages (slug)
where status = 'published';

create index pages_published_updated_idx
on public.pages (published_at desc)
where status = 'published';

alter table public.publish_versions enable row level security;

create policy "Users can read their own publish versions"
on public.publish_versions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own publish versions"
on public.publish_versions for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Anyone can read published pages"
on public.pages for select
to anon, authenticated
using (status = 'published' and published_at is not null);

create policy "Anyone can read verified domains"
on public.domains for select
to anon, authenticated
using (status = 'verified' and verified_at is not null);
