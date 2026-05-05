import "server-only";
import type { Metadata } from "next";
import { tField } from "@/lib/i18n/translated";
import type { Locale } from "@/lib/i18n/config";
import { locales } from "@/lib/i18n/config";
import { getPageSeo, getSiteSettings } from "@/lib/db/queries";

type Args = {
  path: string;          // logical route, e.g. '/services'
  locale: Locale;
  fallbackTitle?: string;
  fallbackDescription?: string;
};

export async function buildMetadata({
  path,
  locale,
  fallbackTitle,
  fallbackDescription,
}: Args): Promise<Metadata> {
  const [seo, settings] = await Promise.all([getPageSeo(path), getSiteSettings()]);

  const title =
    tField(seo, "meta_title", locale) ||
    tField(settings, "seo_title", locale) ||
    fallbackTitle ||
    "Сенім";

  const description =
    tField(seo, "meta_description", locale) ||
    tField(settings, "seo_description", locale) ||
    fallbackDescription ||
    undefined;

  const canonical = seo?.canonical_url || `${path === "/" ? "" : path}`;
  const languages = Object.fromEntries(
    locales.map((l) => [l, `/${l}${path === "/" ? "" : path}`]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path === "/" ? "" : path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: seo?.og_image_url ? [{ url: seo.og_image_url }] : undefined,
      locale: locale === "kk" ? "kk_KZ" : locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: seo?.og_image_url ? [seo.og_image_url] : undefined,
    },
    keywords: seo?.keywords ?? undefined,
  };
}
