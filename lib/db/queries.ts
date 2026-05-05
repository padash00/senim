import "server-only";

import { unstable_cache } from "next/cache";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { REVALIDATE_TAGS } from "@/lib/constants";
import type {
  Certificate,
  Contacts,
  Faq,
  GalleryItem,
  HomepageSection,
  PageSeo,
  Service,
  SiteSettings,
  Specialist,
} from "@/lib/supabase/database.types";

/* ----------------------------------------------------------------------------
 * Public, RLS-safe reads. Wrapped with unstable_cache so we can revalidate
 * by tag from the admin actions.
 * --------------------------------------------------------------------------*/

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase.from("site_settings").select("*").maybeSingle();
    return data;
  },
  ["site_settings"],
  { tags: [REVALIDATE_TAGS.settings], revalidate: 3600 },
);

export const getContacts = unstable_cache(
  async (): Promise<Contacts | null> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase.from("contacts").select("*").maybeSingle();
    return data;
  },
  ["contacts"],
  { tags: [REVALIDATE_TAGS.contacts], revalidate: 3600 },
);

export const getHomepageSections = unstable_cache(
  async (): Promise<HomepageSection[]> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("homepage_sections")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["homepage_sections"],
  { tags: [REVALIDATE_TAGS.homepage], revalidate: 3600 },
);

export const listServices = unstable_cache(
  async (): Promise<Service[]> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["services"],
  { tags: [REVALIDATE_TAGS.services], revalidate: 3600 },
);

export const getServiceBySlug = unstable_cache(
  async (slug: string): Promise<Service | null> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase.from("services").select("*").eq("slug", slug).maybeSingle();
    return data;
  },
  ["service_by_slug"],
  { tags: [REVALIDATE_TAGS.services], revalidate: 3600 },
);

export const listSpecialists = unstable_cache(
  async (): Promise<Specialist[]> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("specialists")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["specialists"],
  { tags: [REVALIDATE_TAGS.specialists], revalidate: 3600 },
);

export const listCertificates = unstable_cache(
  async (): Promise<Certificate[]> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("certificates")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["certificates"],
  { tags: [REVALIDATE_TAGS.certificates], revalidate: 3600 },
);

export const listFaqs = unstable_cache(
  async (): Promise<Faq[]> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["faqs"],
  { tags: [REVALIDATE_TAGS.faqs], revalidate: 3600 },
);

export const listGallery = unstable_cache(
  async (): Promise<GalleryItem[]> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  },
  ["gallery_items"],
  { tags: [REVALIDATE_TAGS.gallery], revalidate: 3600 },
);

export const getPageSeo = unstable_cache(
  async (path: string): Promise<PageSeo | null> => {
    const supabase = createSupabaseAnonClient();
    const { data } = await supabase.from("pages_seo").select("*").eq("path", path).maybeSingle();
    return data;
  },
  ["page_seo"],
  { tags: [REVALIDATE_TAGS.pagesSeo], revalidate: 3600 },
);
