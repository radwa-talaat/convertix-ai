alter table public.users
  add column if not exists locale text not null default 'en'
  check (locale in ('en', 'ar'));

alter table public.projects
  add column if not exists locale text not null default 'en'
  check (locale in ('en', 'ar'));

alter table public.pages
  add column if not exists locale text not null default 'en'
  check (locale in ('en', 'ar'));

alter table public.templates
  add column if not exists locale text not null default 'en'
  check (locale in ('en', 'ar')),
  add column if not exists translations jsonb not null default '{}'::jsonb;

create index if not exists users_locale_idx on public.users (locale);
create index if not exists projects_user_locale_idx on public.projects (user_id, locale);
create index if not exists pages_project_locale_idx on public.pages (project_id, locale);
create index if not exists templates_locale_idx on public.templates (locale);
