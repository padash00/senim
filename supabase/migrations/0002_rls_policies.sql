-- ============================================================================
-- Row Level Security
--   • anon  — read only published rows from public-facing tables
--           — INSERT-only on applications (form submissions)
--   • admin — full CRUD on everything (auth.uid() in admin_profiles)
-- ============================================================================

-- helper: authoritative admin check (defined in 0001)
-- public.is_admin() returns boolean

-- ----------------------------------------------------------------------------
-- Enable RLS on every public table
-- ----------------------------------------------------------------------------
alter table public.site_settings     enable row level security;
alter table public.contacts          enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.services          enable row level security;
alter table public.specialists       enable row level security;
alter table public.certificates      enable row level security;
alter table public.reviews           enable row level security;
alter table public.applications      enable row level security;
alter table public.faqs              enable row level security;
alter table public.blog_posts        enable row level security;
alter table public.gallery_items     enable row level security;
alter table public.pages_seo         enable row level security;
alter table public.admin_profiles    enable row level security;

-- ----------------------------------------------------------------------------
-- Helper macro-ish: drop-create policies idempotently
-- ----------------------------------------------------------------------------

-- site_settings ---------------------------------------------------------------
drop policy if exists "site_settings_read_public" on public.site_settings;
create policy "site_settings_read_public" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings_admin_write" on public.site_settings;
create policy "site_settings_admin_write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- contacts --------------------------------------------------------------------
drop policy if exists "contacts_read_public" on public.contacts;
create policy "contacts_read_public" on public.contacts
  for select to anon, authenticated using (true);

drop policy if exists "contacts_admin_write" on public.contacts;
create policy "contacts_admin_write" on public.contacts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- homepage_sections -----------------------------------------------------------
drop policy if exists "homepage_read_published" on public.homepage_sections;
create policy "homepage_read_published" on public.homepage_sections
  for select to anon using (is_published);
drop policy if exists "homepage_read_all_admin" on public.homepage_sections;
create policy "homepage_read_all_admin" on public.homepage_sections
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "homepage_admin_write" on public.homepage_sections;
create policy "homepage_admin_write" on public.homepage_sections
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- services --------------------------------------------------------------------
drop policy if exists "services_read_published" on public.services;
create policy "services_read_published" on public.services
  for select to anon using (is_published);
drop policy if exists "services_read_all_admin" on public.services;
create policy "services_read_all_admin" on public.services
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- specialists -----------------------------------------------------------------
drop policy if exists "specialists_read_published" on public.specialists;
create policy "specialists_read_published" on public.specialists
  for select to anon using (is_published);
drop policy if exists "specialists_read_all_admin" on public.specialists;
create policy "specialists_read_all_admin" on public.specialists
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "specialists_admin_write" on public.specialists;
create policy "specialists_admin_write" on public.specialists
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- certificates ----------------------------------------------------------------
drop policy if exists "certificates_read_published" on public.certificates;
create policy "certificates_read_published" on public.certificates
  for select to anon using (is_published);
drop policy if exists "certificates_read_all_admin" on public.certificates;
create policy "certificates_read_all_admin" on public.certificates
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "certificates_admin_write" on public.certificates;
create policy "certificates_admin_write" on public.certificates
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- reviews ---------------------------------------------------------------------
drop policy if exists "reviews_read_published" on public.reviews;
create policy "reviews_read_published" on public.reviews
  for select to anon using (is_published);
drop policy if exists "reviews_read_all_admin" on public.reviews;
create policy "reviews_read_all_admin" on public.reviews
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "reviews_admin_write" on public.reviews;
create policy "reviews_admin_write" on public.reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- applications ----------------------------------------------------------------
-- Public can INSERT only. Reading/updating is admin-only.
-- (We also use the service role from server actions for inserts so we can
--  add server-side anti-spam without leaking anon insert errors.)
drop policy if exists "applications_insert_public" on public.applications;
create policy "applications_insert_public" on public.applications
  for insert to anon, authenticated with check (true);

drop policy if exists "applications_read_admin" on public.applications;
create policy "applications_read_admin" on public.applications
  for select to authenticated using (public.is_admin());

drop policy if exists "applications_update_admin" on public.applications;
create policy "applications_update_admin" on public.applications
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "applications_delete_admin" on public.applications;
create policy "applications_delete_admin" on public.applications
  for delete to authenticated using (public.is_admin());

-- faqs ------------------------------------------------------------------------
drop policy if exists "faqs_read_published" on public.faqs;
create policy "faqs_read_published" on public.faqs
  for select to anon using (is_published);
drop policy if exists "faqs_read_all_admin" on public.faqs;
create policy "faqs_read_all_admin" on public.faqs
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "faqs_admin_write" on public.faqs;
create policy "faqs_admin_write" on public.faqs
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- blog_posts ------------------------------------------------------------------
drop policy if exists "blog_read_published" on public.blog_posts;
create policy "blog_read_published" on public.blog_posts
  for select to anon using (is_published);
drop policy if exists "blog_read_all_admin" on public.blog_posts;
create policy "blog_read_all_admin" on public.blog_posts
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "blog_admin_write" on public.blog_posts;
create policy "blog_admin_write" on public.blog_posts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- gallery_items ---------------------------------------------------------------
drop policy if exists "gallery_read_published" on public.gallery_items;
create policy "gallery_read_published" on public.gallery_items
  for select to anon using (is_published);
drop policy if exists "gallery_read_all_admin" on public.gallery_items;
create policy "gallery_read_all_admin" on public.gallery_items
  for select to authenticated using (public.is_admin() or is_published);
drop policy if exists "gallery_admin_write" on public.gallery_items;
create policy "gallery_admin_write" on public.gallery_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- pages_seo -------------------------------------------------------------------
drop policy if exists "pages_seo_read_public" on public.pages_seo;
create policy "pages_seo_read_public" on public.pages_seo
  for select to anon, authenticated using (true);
drop policy if exists "pages_seo_admin_write" on public.pages_seo;
create policy "pages_seo_admin_write" on public.pages_seo
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- admin_profiles --------------------------------------------------------------
-- Admins can see / manage admins. Nobody else can read this table.
drop policy if exists "admin_profiles_read_self_or_admin" on public.admin_profiles;
create policy "admin_profiles_read_self_or_admin" on public.admin_profiles
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "admin_profiles_admin_write" on public.admin_profiles;
create policy "admin_profiles_admin_write" on public.admin_profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- Storage buckets
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Public read on media bucket
drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

-- Only admins may upload / overwrite / delete
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
