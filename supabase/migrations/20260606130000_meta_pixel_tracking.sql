alter table public.pages
  add column if not exists meta_pixel_id text,
  add column if not exists meta_pixel_enabled boolean not null default false;

alter table public.pages
  drop constraint if exists pages_meta_pixel_id_format_check;

alter table public.pages
  add constraint pages_meta_pixel_id_format_check
  check (
    meta_pixel_id is null
    or meta_pixel_id ~ '^[0-9]{5,32}$'
  );

comment on column public.pages.meta_pixel_id is
  'Validated numeric Meta Pixel ID. Raw tracking scripts are never stored.';

comment on column public.pages.meta_pixel_enabled is
  'Controls Meta Pixel loading on the published landing page.';
