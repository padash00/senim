export const locales = ["kk", "ru", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "kk";

export const localeLabels: Record<Locale, string> = {
  kk: "KZ",
  ru: "RU",
  en: "EN",
};

export const localeFullLabels: Record<Locale, string> = {
  kk: "Қазақша",
  ru: "Русский",
  en: "English",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
