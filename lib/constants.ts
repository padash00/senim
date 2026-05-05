import type { Locale } from "./i18n/config";

export const SITE_NAME = "Сенім";
export const SITE_NAME_KK = "Сенім";
export const SITE_TAGLINE_KK = "түзету-дамыту орталығы";
export const SITE_TAGLINE_RU = "коррекционно-развивающий центр";
export const SITE_TAGLINE_EN = "developmental support centre";

export const DEFAULT_ADDRESS = "Шымкент, ул. Бейбитшилик, 14/1";
export const DEFAULT_INSTAGRAM = "senim_damytu_ortalygy";

export const LOCALE_TAGLINE: Record<Locale, string> = {
  kk: SITE_TAGLINE_KK,
  ru: SITE_TAGLINE_RU,
  en: SITE_TAGLINE_EN,
};

export const REVALIDATE_TAGS = {
  contacts: "contacts",
  settings: "site_settings",
  services: "services",
  specialists: "specialists",
  certificates: "certificates",
  reviews: "reviews",
  faqs: "faqs",
  blog: "blog_posts",
  gallery: "gallery_items",
  homepage: "homepage_sections",
  pagesSeo: "pages_seo",
} as const;
