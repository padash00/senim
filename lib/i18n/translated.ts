import { defaultLocale, type Locale } from "./config";

/**
 * Pick a localized field from a row that stores per-language columns:
 *   { title_kk, title_ru, title_en }
 *
 * Falls back to the default locale (kk) if the requested locale is empty.
 *
 * Accepts `unknown` so callers can pass typed rows like Service or Specialist
 * without manual casts to Record<string, unknown>.
 */
export function tField(row: unknown, base: string, locale: Locale): string {
  if (!row || typeof row !== "object") return "";
  const r = row as Record<string, unknown>;
  const requested = r[`${base}_${locale}`];
  if (typeof requested === "string" && requested.trim().length > 0) {
    return requested;
  }
  const fallback = r[`${base}_${defaultLocale}`];
  return typeof fallback === "string" ? fallback : "";
}
