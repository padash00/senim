-- ============================================================================
-- Senim — schema
-- All tables: id uuid pk, created_at/updated_at with trigger.
-- Translations live in *_kk / *_ru / *_en columns; kk is canonical.
-- ============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type public.application_status as enum
    ('new', 'in_progress', 'contacted', 'scheduled', 'closed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.preferred_contact as enum ('phone', 'whatsapp', 'telegram');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.locale_code as enum ('kk', 'ru', 'en');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.admin_role as enum ('admin', 'editor');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- admin_profiles — wires Supabase Auth users to roles for the /admin UI
-- ----------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      citext,
  full_name  text,
  role       public.admin_role not null default 'admin',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles where user_id = auth.uid()
  );
$$;

-- Sync email/full_name from auth.users into admin_profiles row when present.
create or replace function public.handle_admin_profile_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is null then
    select email into new.email from auth.users where id = new.user_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_admin_profiles_email on public.admin_profiles;
create trigger trg_admin_profiles_email
  before insert on public.admin_profiles
  for each row execute function public.handle_admin_profile_email();

-- ----------------------------------------------------------------------------
-- site_settings — single row holding global SEO + locale + name
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id              uuid primary key default gen_random_uuid(),
  site_name       text not null default 'Сенім',
  default_locale  public.locale_code not null default 'kk',
  seo_title_kk    text,
  seo_title_ru    text,
  seo_title_en    text,
  seo_description_kk text,
  seo_description_ru text,
  seo_description_en text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- contacts — also a single editable row
-- ----------------------------------------------------------------------------
create table if not exists public.contacts (
  id            uuid primary key default gen_random_uuid(),
  phone         text,
  whatsapp      text,
  email         text,
  instagram     text,
  address_kk    text,
  address_ru    text,
  address_en    text,
  -- working_hours is editable JSON, e.g.
  -- { "mon_fri": "09:00–19:00", "sat": "10:00–16:00", "sun": "выходной" }
  working_hours jsonb default '{}'::jsonb,
  map_iframe    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger trg_contacts_updated before update on public.contacts
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- homepage_sections — toggleable / reorderable blocks on the home page
-- ----------------------------------------------------------------------------
create table if not exists public.homepage_sections (
  id            uuid primary key default gen_random_uuid(),
  key           text not null unique,            -- 'hero' | 'audience' | 'services' | ...
  title_kk      text, title_ru text, title_en text,
  subtitle_kk   text, subtitle_ru text, subtitle_en text,
  body_kk       text, body_ru text, body_en text,
  cta_label_kk  text, cta_label_ru text, cta_label_en text,
  cta_href      text,
  image_url     text,
  is_published  boolean not null default true,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_homepage_sections_order
  on public.homepage_sections (is_published, sort_order);

create trigger trg_homepage_sections_updated before update on public.homepage_sections
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- services
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id                       uuid primary key default gen_random_uuid(),
  slug                     text not null unique,
  title_kk text, title_ru text, title_en text,
  short_description_kk text, short_description_ru text, short_description_en text,
  full_description_kk  text, full_description_ru  text, full_description_en  text,
  suitable_for_kk      text, suitable_for_ru      text, suitable_for_en      text,
  skills_developed_kk  text, skills_developed_ru  text, skills_developed_en  text,
  how_it_works_kk      text, how_it_works_ru      text, how_it_works_en      text,
  result_kk            text, result_ru            text, result_en            text,
  price_note_kk        text, price_note_ru        text, price_note_en        text,
  age_range            text,
  duration_minutes     int,
  price                numeric(12, 2),
  icon                 text,
  image_url            text,
  is_published         boolean not null default true,
  sort_order           int not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists idx_services_pub_order on public.services (is_published, sort_order);
create index if not exists idx_services_slug on public.services (slug);

create trigger trg_services_updated before update on public.services
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- specialists
-- ----------------------------------------------------------------------------
create table if not exists public.specialists (
  id               uuid primary key default gen_random_uuid(),
  full_name_kk text, full_name_ru text, full_name_en text,
  position_kk  text, position_ru  text, position_en  text,
  bio_kk       text, bio_ru       text, bio_en       text,
  education_kk text, education_ru text, education_en text,
  languages_kk text, languages_ru text, languages_en text,
  photo_url        text,
  experience_years int,
  directions       text[],     -- ['Логопед', 'Дефектолог']
  certificates     text[],     -- ['СГПИ, 2019', 'ABA Level 1']
  is_published     boolean not null default true,
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_specialists_pub_order on public.specialists (is_published, sort_order);

create trigger trg_specialists_updated before update on public.specialists
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- certificates
-- ----------------------------------------------------------------------------
create table if not exists public.certificates (
  id             uuid primary key default gen_random_uuid(),
  title_kk text, title_ru text, title_en text,
  description_kk text, description_ru text, description_en text,
  image_url      text,
  pdf_url        text,
  issued_at      date,
  specialist_id  uuid references public.specialists (id) on delete set null,
  is_published   boolean not null default true,
  sort_order     int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists idx_certificates_pub_order on public.certificates (is_published, sort_order);
create index if not exists idx_certificates_specialist on public.certificates (specialist_id);

create trigger trg_certificates_updated before update on public.certificates
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- reviews
-- ----------------------------------------------------------------------------
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  parent_name   text not null,
  rating        int check (rating between 1 and 5),
  text_kk       text,
  text_ru       text,
  text_en       text,
  language      public.locale_code not null default 'ru',
  reviewed_at   date,
  photo_url     text,
  is_featured   boolean not null default false,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_reviews_pub_featured on public.reviews (is_published, is_featured, reviewed_at desc);

create trigger trg_reviews_updated before update on public.reviews
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- applications
-- ----------------------------------------------------------------------------
create table if not exists public.applications (
  id                 uuid primary key default gen_random_uuid(),
  parent_name        text not null,
  phone              text not null,
  child_age          int,
  comment            text,
  preferred_contact  public.preferred_contact,
  preferred_language public.locale_code,
  consent            boolean not null default false,
  service_id         uuid references public.services (id) on delete set null,
  specialist_id      uuid references public.specialists (id) on delete set null,
  source             text,                                       -- '/services/aba', 'home-hero'
  status             public.application_status not null default 'new',
  admin_note         text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists idx_applications_status_created
  on public.applications (status, created_at desc);

create trigger trg_applications_updated before update on public.applications
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- faqs
-- ----------------------------------------------------------------------------
create table if not exists public.faqs (
  id           uuid primary key default gen_random_uuid(),
  question_kk text, question_ru text, question_en text,
  answer_kk   text, answer_ru   text, answer_en   text,
  category     text,
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_faqs_pub_order on public.faqs (is_published, sort_order);

create trigger trg_faqs_updated before update on public.faqs
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- blog_posts
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title_kk text, title_ru text, title_en text,
  excerpt_kk text, excerpt_ru text, excerpt_en text,
  body_kk text, body_ru text, body_en text,
  cover_url       text,
  seo_title_kk text, seo_title_ru text, seo_title_en text,
  seo_description_kk text, seo_description_ru text, seo_description_en text,
  is_published    boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_blog_pub_published_at
  on public.blog_posts (is_published, published_at desc);

create trigger trg_blog_updated before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- gallery_items
-- ----------------------------------------------------------------------------
create table if not exists public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  image_url    text not null,
  caption_kk   text, caption_ru text, caption_en text,
  category     text,                                  -- 'office', 'team', 'illustration'
  is_published boolean not null default true,
  sort_order   int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists idx_gallery_pub_order on public.gallery_items (is_published, sort_order);

create trigger trg_gallery_updated before update on public.gallery_items
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- pages_seo — per-route meta overrides
-- ----------------------------------------------------------------------------
create table if not exists public.pages_seo (
  id                  uuid primary key default gen_random_uuid(),
  path                text not null unique,           -- '/', '/services', '/contacts'
  meta_title_kk       text, meta_title_ru       text, meta_title_en       text,
  meta_description_kk text, meta_description_ru text, meta_description_en text,
  og_image_url        text,
  canonical_url       text,
  keywords            text[],
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger trg_pages_seo_updated before update on public.pages_seo
  for each row execute function public.set_updated_at();
