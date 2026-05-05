import type { MetadataRoute } from "next";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/utils";

const STATIC_PATHS = ["", "/about", "/services", "/parents", "/contacts"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseAnonClient();
  const { data: services } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("is_published", true);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((p) =>
    locales.map((loc) => ({
      url: absoluteUrl(`/${loc}${p}`),
      lastModified: now,
      changeFrequency: p === "" ? "weekly" : "monthly",
      priority: p === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}${p}`)])),
      },
    })),
  );

  const serviceEntries: MetadataRoute.Sitemap = (services ?? []).flatMap((s: { slug: string; updated_at: string | null }) =>
    locales.map((loc) => ({
      url: absoluteUrl(`/${loc}/services/${s.slug}`),
      lastModified: s.updated_at ? new Date(s.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}/services/${s.slug}`)])),
      },
    })),
  );

  return [...staticEntries, ...serviceEntries];
}
