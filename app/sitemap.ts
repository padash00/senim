import type { MetadataRoute } from "next";
import { createSupabaseAnonClient } from "@/lib/supabase/anon";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/utils";

const STATIC_PATHS = ["", "/about", "/services", "/specialists", "/parents", "/reviews", "/contacts", "/blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabaseAnonClient();
  const [{ data: services }, { data: posts }] = await Promise.all([
    supabase.from("services").select("slug, updated_at").eq("is_published", true),
    supabase
      .from("blog_posts")
      .select("slug, updated_at, published_at")
      .eq("is_published", true),
  ]);

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

  const serviceEntries: MetadataRoute.Sitemap = (services ?? []).flatMap((s) =>
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

  const blogEntries: MetadataRoute.Sitemap = (posts ?? []).flatMap((p) =>
    locales.map((loc) => ({
      url: absoluteUrl(`/${loc}/blog/${p.slug}`),
      lastModified: p.updated_at ? new Date(p.updated_at) : p.published_at ? new Date(p.published_at) : now,
      changeFrequency: "monthly",
      priority: 0.5,
    })),
  );

  return [...staticEntries, ...serviceEntries, ...blogEntries];
}
