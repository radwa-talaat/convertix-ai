alter table public.users
  add column if not exists role text not null default 'user';

alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('user', 'admin'));

create index if not exists users_role_idx
on public.users (role);

alter table public.project_entitlements
  drop constraint if exists project_entitlements_source_check;

alter table public.project_entitlements
  add constraint project_entitlements_source_check
  check (source in ('credit', 'subscription', 'admin_test'));

create or replace function public.is_admin(target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = target_user_id
      and role = 'admin'
  );
$$;

create or replace function public.create_admin_project(
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
begin
  if current_user_id is null then
    raise exception using errcode = '28000', message = 'Authentication required.';
  end if;

  if not public.is_admin(current_user_id) then
    raise exception using errcode = '42501', message = 'Admin privileges required.';
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
    'admin_test',
    'agency'
  );

  return created_project_id;
end;
$$;

revoke all on function public.is_admin(uuid) from public, anon;
grant execute on function public.is_admin(uuid) to authenticated, service_role;

revoke all on function public.create_admin_project(text, text, text)
from public, anon;
grant execute on function public.create_admin_project(text, text, text)
to authenticated, service_role;

drop policy if exists "Admins can read all users" on public.users;
create policy "Admins can read all users"
on public.users for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read all projects" on public.projects;
create policy "Admins can read all projects"
on public.projects for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read all pages" on public.pages;
create policy "Admins can read all pages"
on public.pages for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read all payments" on public.payments;
create policy "Admins can read all payments"
on public.payments for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read all subscriptions" on public.subscriptions;
create policy "Admins can read all subscriptions"
on public.subscriptions for select
to authenticated
using (public.is_admin());
