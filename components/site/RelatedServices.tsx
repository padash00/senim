import { listServices } from "@/lib/db/queries";
import { ServiceCard } from "./ServiceCard";
import { Container } from "./Container";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  currentSlug: string;
  locale: Locale;
};

const RELATED_MAP: Record<string, string[]> = {
  aba:               ["sensory", "psychologist", "individual-program"],
  logoped:           ["defektolog", "logomassage", "school-prep"],
  defektolog:        ["logoped", "neuropsy", "school-prep"],
  afk:               ["sensory", "individual-program", "group-classes"],
  sensory:           ["afk", "aba", "neuropsy"],
  logomassage:       ["logoped", "defektolog", "afk"],
  neuropsy:          ["psychologist", "defektolog", "school-prep"],
  psychologist:      ["neuropsy", "aba", "individual-program"],
  "school-prep":     ["defektolog", "neuropsy", "logoped"],
  "individual-program": ["aba", "afk", "psychologist"],
  "group-classes":   ["afk", "school-prep", "psychologist"],
};

export async function RelatedServices({ currentSlug, locale }: Props) {
  const all = await listServices();
  const wantSlugs = RELATED_MAP[currentSlug] ?? [];
  const related = wantSlugs
    .map((slug) => all.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="border-t border-border/60 bg-secondary/30 py-16 md:py-20">
      <Container>
        <p className="mb-8 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          {locale === "kk" ? "Сондай-ақ қарастырыңыз" : locale === "en" ? "You may also consider" : "Также может подойти"}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((s) => (
            <ServiceCard key={s.id} service={s} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
