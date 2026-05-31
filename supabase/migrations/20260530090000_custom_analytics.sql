create type public.analytics_event_type as enum (
  'page_view',
  'cta_click',
  'form_submission',
  'custom',
  'performance'
);

create type public.analytics_device_type as enum (
  'desktop',
  'mobile',
  'tablet'
);

create type public.traffic_source_type as enum (
  'direct',
  'google',
  'referral',
  'social'
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  project_id uuid not null references public.projects(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  page_slug text not null,
  event_type public.analytics_event_type not null,
  visitor_id text not null,
  session_id text not null,
  device_type public.analytics_device_type not null,
  source public.traffic_source_type not null default 'direct',
  utm jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  project_id uuid not null references public.projects(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  page_slug text not null,
  visitor_id text not null,
  session_id text not null,
  device_type public.analytics_device_type not null,
  source public.traffic_source_type not null default 'direct',
  referrer text,
  utm jsonb not null default '{}'::jsonb,
  time_on_page_seconds integer not null default 0 check (time_on_page_seconds >= 0),
  bounced boolean not null default false,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  project_id uuid not null references public.projects(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  page_slug text not null,
  visitor_id text not null,
  session_id text not null,
  conversion_type text not null check (char_length(conversion_type) between 2 and 80),
  value numeric(12, 2),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.traffic_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  page_slug text not null,
  source public.traffic_source_type not null,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  visits integer not null default 1 check (visits >= 0),
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index analytics_events_project_occurred_idx
on public.analytics_events (project_id, occurred_at desc);
create index analytics_events_page_type_idx
on public.analytics_events (page_slug, event_type, occurred_at desc);
create index analytics_events_visitor_idx
on public.analytics_events (visitor_id, session_id);

create index page_views_project_occurred_idx
on public.page_views (project_id, occurred_at desc);
create index page_views_page_occurred_idx
on public.page_views (page_slug, occurred_at desc);
create index page_views_unique_visitor_idx
on public.page_views (project_id, visitor_id);

create index conversions_project_occurred_idx
on public.conversions (project_id, occurred_at desc);
create index conversions_page_type_idx
on public.conversions (page_slug, conversion_type, occurred_at desc);

create index traffic_sources_project_idx
on public.traffic_sources (project_id, last_seen_at desc);

create unique index traffic_sources_rollup_uidx
on public.traffic_sources (
  project_id,
  page_slug,
  source,
  coalesce(utm_source, ''),
  coalesce(utm_campaign, '')
);

alter table public.analytics_events enable row level security;
alter table public.page_views enable row level security;
alter table public.conversions enable row level security;
alter table public.traffic_sources enable row level security;

create policy "Users can read analytics for their own projects"
on public.analytics_events for select
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = analytics_events.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can read page views for their own projects"
on public.page_views for select
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = page_views.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can read conversions for their own projects"
on public.conversions for select
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = conversions.project_id
    and projects.user_id = (select auth.uid())
  )
);

create policy "Users can read traffic sources for their own projects"
on public.traffic_sources for select
to authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = traffic_sources.project_id
    and projects.user_id = (select auth.uid())
  )
);
