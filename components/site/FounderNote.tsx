import { Quote } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

type Props = { locale: Locale };

const COPY: Record<Locale, { line: string; sign: string; role: string }> = {
  kk: {
    line: "«Әр бала — өзіндік жол. Біз сол жолды бірге, асықпай, үлкен сүйіспеншілікпен жүреміз.»",
    sign: "Сенім орталығының жетекшісі",
    role: "Психолог-педагог",
  },
  ru: {
    line: "«Каждый ребёнок — это свой путь. Мы проходим его вместе, не торопясь, с большой любовью.»",
    sign: "Руководитель центра «Сенім»",
    role: "Психолог-педагог",
  },
  en: {
    line: "“Every child is their own path. We walk it together — slowly, with great love.”",
    sign: "Director of Senim",
    role: "Psychologist-educator",
  },
};

export function FounderNote({ locale }: Props) {
  const copy = COPY[locale];
  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container max-w-4xl">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center md:gap-10">
          {/* Placeholder portrait — soft mono initials. Replace via /admin
              when a real photo is uploaded. */}
          <div className="relative mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-full border border-border/70 bg-gradient-to-br from-primary-soft via-accent to-primary-soft md:h-40 md:w-40">
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-5xl font-bold text-primary md:text-6xl">С</span>
            </div>
          </div>
          <div>
            <Quote className="h-6 w-6 text-accent-foreground/40" aria-hidden />
            <p className="mt-3 font-display text-xl font-medium leading-snug text-foreground md:text-2xl">
              {copy.line}
            </p>
            <div className="mt-5 flex flex-col text-sm">
              <span className="font-semibold">{copy.sign}</span>
              <span className="text-muted-foreground">{copy.role}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
