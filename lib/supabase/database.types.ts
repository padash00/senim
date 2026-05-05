/**
 * Placeholder generated from the SQL migrations in supabase/migrations.
 * Regenerate with the Supabase CLI after running the migrations:
 *
 *   supabase gen types typescript --project-id $SUPABASE_PROJECT_ID > lib/supabase/database.types.ts
 *
 * The hand-rolled definitions below match the migrations and let the app
 * compile and run end-to-end before you connect the CLI.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = {
  id: string;
  created_at: string;
  updated_at: string;
};

type Translatable<Bases extends string> = {
  [K in Bases as `${K}_kk`]: string | null;
} & {
  [K in Bases as `${K}_ru`]: string | null;
} & {
  [K in Bases as `${K}_en`]: string | null;
};

export type SiteSettings = Timestamps & {
  site_name: string;
  default_locale: string;
  seo_title_kk: string | null;
  seo_title_ru: string | null;
  seo_title_en: string | null;
  seo_description_kk: string | null;
  seo_description_ru: string | null;
  seo_description_en: string | null;
};

export type Contacts = Timestamps & {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  address_kk: string | null;
  address_ru: string | null;
  address_en: string | null;
  working_hours: Json | null;
  map_iframe: string | null;
};

export type HomepageSection = Timestamps &
  Translatable<"title" | "subtitle" | "body"> & {
    key: string;
    is_published: boolean;
    sort_order: number;
    image_url: string | null;
    cta_label_kk: string | null;
    cta_label_ru: string | null;
    cta_label_en: string | null;
    cta_href: string | null;
  };

export type Service = Timestamps &
  Translatable<
    | "title"
    | "short_description"
    | "full_description"
    | "suitable_for"
    | "skills_developed"
    | "how_it_works"
    | "result"
    | "price_note"
  > & {
    slug: string;
    icon: string | null;
    image_url: string | null;
    price: number | null;
    duration_minutes: number | null;
    age_range: string | null;
    is_published: boolean;
    sort_order: number;
  };

export type Specialist = Timestamps &
  Translatable<"full_name" | "position" | "bio" | "education" | "languages"> & {
    photo_url: string | null;
    experience_years: number | null;
    directions: string[] | null;
    certificates: string[] | null;
    is_published: boolean;
    sort_order: number;
  };

export type Certificate = Timestamps &
  Translatable<"title" | "description"> & {
    image_url: string | null;
    pdf_url: string | null;
    issued_at: string | null;
    specialist_id: string | null;
    is_published: boolean;
    sort_order: number;
  };

export type Review = Timestamps & {
  parent_name: string;
  rating: number | null;
  text_kk: string | null;
  text_ru: string | null;
  text_en: string | null;
  language: "kk" | "ru" | "en";
  is_featured: boolean;
  is_published: boolean;
  reviewed_at: string | null;
  photo_url: string | null;
};

export type ApplicationStatus = "new" | "in_progress" | "contacted" | "scheduled" | "closed";

export type Application = Timestamps & {
  parent_name: string;
  phone: string;
  child_age: number | null;
  comment: string | null;
  preferred_contact: "phone" | "whatsapp" | "telegram" | null;
  preferred_language: "kk" | "ru" | "en" | null;
  consent: boolean;
  service_id: string | null;
  specialist_id: string | null;
  source: string | null;
  status: ApplicationStatus;
  admin_note: string | null;
};

export type Faq = Timestamps &
  Translatable<"question" | "answer"> & {
    category: string | null;
    is_published: boolean;
    sort_order: number;
  };

export type BlogPost = Timestamps &
  Translatable<"title" | "excerpt" | "body"> & {
    slug: string;
    cover_url: string | null;
    seo_title_kk: string | null;
    seo_title_ru: string | null;
    seo_title_en: string | null;
    seo_description_kk: string | null;
    seo_description_ru: string | null;
    seo_description_en: string | null;
    is_published: boolean;
    published_at: string | null;
  };

export type GalleryItem = Timestamps &
  Translatable<"caption"> & {
    image_url: string;
    category: string | null;
    is_published: boolean;
    sort_order: number;
  };

export type PageSeo = Timestamps & {
  path: string;
  meta_title_kk: string | null;
  meta_title_ru: string | null;
  meta_title_en: string | null;
  meta_description_kk: string | null;
  meta_description_ru: string | null;
  meta_description_en: string | null;
  og_image_url: string | null;
  canonical_url: string | null;
  keywords: string[] | null;
};

export type AdminProfile = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "editor";
  created_at: string;
};

type Row<T> = { Row: T; Insert: Partial<T>; Update: Partial<T> };

export interface Database {
  public: {
    Tables: {
      site_settings: Row<SiteSettings>;
      contacts: Row<Contacts>;
      homepage_sections: Row<HomepageSection>;
      services: Row<Service>;
      specialists: Row<Specialist>;
      certificates: Row<Certificate>;
      reviews: Row<Review>;
      applications: Row<Application>;
      faqs: Row<Faq>;
      blog_posts: Row<BlogPost>;
      gallery_items: Row<GalleryItem>;
      pages_seo: Row<PageSeo>;
      admin_profiles: Row<AdminProfile>;
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      application_status: ApplicationStatus;
    };
  };
}
