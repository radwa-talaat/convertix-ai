alter table public.pages
  add column if not exists tiktok_pixel_id text,
  add column if not exists tiktok_pixel_enabled boolean not null default false,
  add column if not exists snapchat_pixel_id text,
  add column if not exists snapchat_pixel_enabled boolean not null default false;

alter table public.pages
  drop constraint if exists pages_tiktok_pixel_id_format_check;

alter table public.pages
  add constraint pages_tiktok_pixel_id_format_check
  check (
    tiktok_pixel_id is null
    or tiktok_pixel_id ~ '^[A-Za-z0-9_-]{5,80}$'
  );

alter table public.pages
  drop constraint if exists pages_snapchat_pixel_id_format_check;

alter table public.pages
  add constraint pages_snapchat_pixel_id_format_check
  check (
    snapchat_pixel_id is null
    or snapchat_pixel_id ~ '^[A-Za-z0-9_-]{5,80}$'
  );

comment on column public.pages.tiktok_pixel_id is
  'Validated TikTok Pixel ID. Raw tracking scripts are never stored.';

comment on column public.pages.tiktok_pixel_enabled is
  'Controls TikTok Pixel loading on the published landing page.';

comment on column public.pages.snapchat_pixel_id is
  'Validated Snapchat Pixel ID. Raw tracking scripts are never stored.';

comment on column public.pages.snapchat_pixel_enabled is
  'Controls Snapchat Pixel loading on the published landing page.';
