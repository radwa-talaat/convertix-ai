alter table public.domains
  add column if not exists page_id uuid;

alter table public.domains
  drop constraint if exists domains_page_id_user_id_fkey;

alter table public.domains
  add constraint domains_page_id_user_id_fkey
  foreign key (page_id, user_id)
  references public.pages(id, user_id)
  on delete cascade;

create index if not exists domains_page_id_idx
on public.domains (page_id);

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
  where user_id = new.user_id
    and (
      (new.page_id is not null and page_id = new.page_id)
      or (new.page_id is null and project_id = new.project_id)
    )
    and id <> coalesce(new.id, gen_random_uuid());

  if existing_domains >= domain_limit then
    raise exception 'DOMAIN_LIMIT_REACHED: This package allows % custom domain(s) per landing page.', domain_limit;
  end if;

  return new;
end;
$$;

drop trigger if exists domains_enforce_project_limit on public.domains;

create trigger domains_enforce_project_limit
before insert or update of project_id, user_id, page_id on public.domains
for each row execute function public.enforce_project_domain_limit();
