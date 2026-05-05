import type { Contacts } from "@/lib/supabase/database.types";
import type { Locale } from "@/lib/i18n/config";
import { tField } from "@/lib/i18n/translated";
import { absoluteUrl } from "@/lib/utils";

type Props = {
  contacts: Contacts | null;
  locale: Locale;
  description?: string;
};

/**
 * Schema.org LocalBusiness markup. Helps Google show the centre on the
 * Knowledge Panel / Maps card with phone, address and opening hours.
 *
 * Designed to be embedded as a child of <head> via a server component:
 *   <JsonLd ... />
 *
 * Renders a <script type="application/ld+json">. React will not execute it.
 */
export function JsonLd({ contacts, locale, description }: Props) {
  const address = tField(contacts, "address", locale) || "Шымкент, ул. Бейбитшилик, 14/1";
  const wh = (contacts?.working_hours ?? {}) as Record<string, string | undefined>;
  const data = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "MedicalBusiness", "EducationalOrganization"],
    name: "Сенім",
    alternateName: "Senim",
    description:
      description ||
      "Коррекционно-развивающий центр для детей и подростков. Логопед, дефектолог, ABA, нейропсихолог.",
    url: absoluteUrl(`/${locale}`),
    telephone: contacts?.phone || undefined,
    email: contacts?.email || undefined,
    sameAs: contacts?.instagram ? [`https://instagram.com/${contacts.instagram}`] : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: "Шымкент",
      addressCountry: "KZ",
    },
    areaServed: { "@type": "City", name: "Шымкент" },
    openingHours: buildOpeningHours(wh),
    inLanguage: ["kk", "ru", "en"],
  };

  // Strip undefined to keep the JSON tidy.
  const json = JSON.stringify(data, (_, v) => (v === undefined ? undefined : v));
  return (
    <script
      type="application/ld+json"
      // Safe: we control the data shape; values come from typed DB rows / locale-bound strings.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

/**
 * Convert our working_hours JSONB to Schema.org openingHours strings.
 * The seed shape is {mon_fri_kk: '09:00–19:00', sat_kk: '10:00–16:00', sun_kk: 'выходной'}.
 * We try to extract the time range out of the localized string.
 */
function buildOpeningHours(wh: Record<string, string | undefined>): string[] {
  const ranges: string[] = [];
  const monFri = extractRange(wh.mon_fri_ru ?? wh.mon_fri_kk ?? wh.mon_fri_en);
  const sat = extractRange(wh.sat_ru ?? wh.sat_kk ?? wh.sat_en);
  if (monFri) ranges.push(`Mo-Fr ${monFri}`);
  if (sat) ranges.push(`Sa ${sat}`);
  return ranges;
}

function extractRange(s?: string): string | null {
  if (!s) return null;
  const m = s.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
  return m ? `${m[1]}-${m[2]}` : null;
}
