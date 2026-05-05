import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowDown, ArrowUpRight, Heart, ShieldCheck, Users2 } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { CTAButton } from "@/components/site/CTAButton";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { JsonLd } from "@/components/site/JsonLd";
import {
  getContacts,
  getHomepageSections,
  listServices,
  listSpecialists,
} from "@/lib/db/queries";
import { tField } from "@/lib/i18n/translated";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({ path: "/", locale: locale as Locale });
}

/* ────────────────────────────────────────────────────────────────
 * Editorial copy. Each block speaks to a parent who is tired of
 * looking, feels alone, and needs a calm voice on the other end.
 * ──────────────────────────────────────────────────────────────── */

const COPY = {
  hero: {
    eyebrow: { kk: "Шымкент · Бейбітшілік 14/1", ru: "Шымкент · Бейбитшилик 14/1", en: "Shymkent · Beybitshilik 14/1" },
    pretitle: { kk: "Сенім орталығы", ru: "Центр Сенім", en: "Senim centre" },
    line1: { kk: "Сіздің балаңыз —", ru: "Ваш ребёнок —", en: "Your child is" },
    line2: { kk: "біздің ең басты", ru: "наша самая", en: "our most" },
    line3: { kk: "жұмысымыз.", ru: "важная работа.", en: "important work." },
    sub: {
      kk: "Сөйлеу. Зейін. Эмоциялар. Қарым-қатынас. Әр баланың жолы өзіндік. Біз сол жолды жанұямен бірге жайбарақат, нақты қадамдармен жүреміз.",
      ru: "Речь. Внимание. Эмоции. Общение. У каждого ребёнка свой путь. Мы проходим его вместе с семьёй — спокойно, понятными шагами.",
      en: "Speech. Attention. Emotions. Connection. Every child's path is unique. We walk it with the family — calmly, in clear steps.",
    },
    reassure: {
      kk: "Алғашқы консультация — бұл диагноз емес. Бұл бастапқы әңгіме.",
      ru: "Первая встреча — не диагноз. Это просто разговор.",
      en: "The first meeting isn't a diagnosis. It's just a conversation.",
    },
  },
  trust: [
    {
      icon: Heart,
      label: { kk: "Жеке тәсіл", ru: "Индивидуально", en: "One-to-one" },
      sub: { kk: "Әр балаға өз бағдарламасы", ru: "Своя программа каждому ребёнку", en: "Custom programme per child" },
    },
    {
      icon: Users2,
      label: { kk: "Команда мамандар", ru: "Команда специалистов", en: "Team of specialists" },
      sub: { kk: "Логопед · Дефектолог · ABA · Нейропсихолог", ru: "Логопед · Дефектолог · ABA · Нейропсихолог", en: "Speech · Special-needs · ABA · Neuropsychology" },
    },
    {
      icon: ShieldCheck,
      label: { kk: "Жайбарақат орта", ru: "Спокойная среда", en: "Calm environment" },
      sub: { kk: "Балаға таныс және қауіпсіз", ru: "Знакомая и безопасная для ребёнка", en: "Familiar and safe for the child" },
    },
  ],
  audience: {
    eyebrow: { kk: "Біз көмектесеміз", ru: "Мы помогаем", en: "We help" },
    headline: {
      kk: "Бала дамуының барлық саласында:",
      ru: "Во всех сферах развития ребёнка:",
      en: "Across every area of a child's growth:",
    },
    words: {
      kk: ["Сөйлеу", "Зейін", "Қарым-қатынас", "Қозғалыс", "Сенсорика", "Мінез-құлық", "Оқу", "Дербестік"],
      ru: ["Речь", "Внимание", "Коммуникация", "Моторика", "Сенсорика", "Поведение", "Обучение", "Самостоятельность"],
      en: ["Speech", "Attention", "Communication", "Motor skills", "Sensory", "Behaviour", "Learning", "Independence"],
    },
    note: {
      kk: "Әр балаға — өз жолы. Бағдарлама бастапқы консультациядан кейін қалыптасады.",
      ru: "Каждому ребёнку — свой путь. Программу подбираем после первичной консультации.",
      en: "Every child has their own path. We design the programme after the first consultation.",
    },
  },
  stats: [
    {
      number: "8+",
      label: { kk: "жыл тәжірибе", ru: "лет опыта", en: "years of practice" },
    },
    {
      number: "11",
      label: { kk: "бағдарлама бағыты", ru: "программ и направлений", en: "programmes & directions" },
    },
    {
      number: "3",
      label: { kk: "тілде жұмыс істейміз", ru: "языка работы с семьёй", en: "languages we work in" },
    },
  ],
  services: {
    eyebrow: { kk: "Қызметтер", ru: "Услуги", en: "Services" },
    headline: { kk: "Бағдарламалар", ru: "Программы", en: "Programmes" },
    sub: {
      kk: "Жеке және шағын топтық сабақтар. Маман таңдау бастапқы консультациядан кейін.",
      ru: "Индивидуальные и малогрупповые занятия. Специалист подбирается после первичной консультации.",
      en: "One-to-one and small-group sessions. The specialist is matched after the first consultation.",
    },
  },
  process: {
    eyebrow: { kk: "Жұмыс қалай жүреді", ru: "Как проходит работа", en: "How we work" },
    headline: { kk: "Алты қадам — алаңдаушылықсыз", ru: "Шесть шагов без тревоги", en: "Six steps, without stress" },
    steps: [
      { kk: "Бастапқы консультация", ru: "Первичная консультация", en: "Initial consultation" },
      { kk: "Диагностика және бақылау", ru: "Диагностика и наблюдение", en: "Assessment and observation" },
      { kk: "Жеке бағдарлама", ru: "Индивидуальная программа", en: "Individual programme" },
      { kk: "Жүйелі сабақтар", ru: "Регулярные занятия", en: "Regular sessions" },
      { kk: "Прогресті бақылау", ru: "Отслеживание прогресса", en: "Progress tracking" },
      { kk: "Ата-анаға ұсыныстар", ru: "Рекомендации родителям", en: "Parent recommendations" },
    ],
    stepDesc: [
      { kk: "Танысамыз, балаңыз туралы әңгімелесеміз. Қысым жоқ.", ru: "Знакомимся, говорим о ребёнке. Никакого давления.", en: "We meet, we talk about your child. No pressure." },
      { kk: "Маман баланы бақылайды, мақсаттарды нақтылайды.", ru: "Специалист наблюдает за ребёнком и формулирует цели.", en: "The specialist observes the child and shapes the goals." },
      { kk: "Сізге түсінікті бағдарлама ұсынамыз.", ru: "Предлагаем понятную программу.", en: "We propose a programme you can follow." },
      { kk: "Балаға ыңғайлы кестеде сабақтарды бастаймыз.", ru: "Начинаем занятия в комфортном для ребёнка ритме.", en: "Sessions begin at a pace that suits the child." },
      { kk: "Әр айдағы өзгерістерді бірге көреміз.", ru: "Каждый месяц вместе видим изменения.", en: "Every month we see the changes together." },
      { kk: "Үйде не істеуге болатыны туралы кеңес береміз.", ru: "Подсказываем, что делать дома.", en: "We share what helps at home." },
    ],
  },
  philosophy: {
    quote: {
      kk: "Біз балаларды «емдемейміз». Біз олардың дамуына көмектесеміз. Әрбір бала — жол. Әрбір отбасы — команда.",
      ru: "Мы не «лечим» детей. Мы помогаем им расти. Каждый ребёнок — путь. Каждая семья — команда.",
      en: "We don't \"treat\" children. We help them grow. Every child is a path. Every family is a team.",
    },
    sign: { kk: "— Сенім орталығы", ru: "— Центр Сенім", en: "— Senim centre" },
  },
  finalCta: {
    headline: {
      kk: "Бір қоңыраудан бастаңыз.",
      ru: "Начните с одного звонка.",
      en: "Start with one call.",
    },
    sub: {
      kk: "Жұмыс күндері 1 сағат ішінде хабарласамыз. Бағдарлама мен баға бастапқы консультациядан кейін айқындалады.",
      ru: "Свяжемся в течение часа в рабочее время. Программа и стоимость определяются после первичной консультации.",
      en: "We respond within an hour during working hours. Programme and price are agreed after the initial consultation.",
    },
  },
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [tCta, sections, services, specialists, contacts] = await Promise.all([
    getTranslations("cta"),
    getHomepageSections(),
    listServices(),
    listSpecialists(),
    getContacts(),
  ]);

  const heroDb = sections.find((s) => s.key === "hero");
  const whatsapp = contacts?.whatsapp || env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  // Stat numbers — let admin override "11" if they edit homepage_sections.
  const stats = [...COPY.stats];
  stats[1] = { ...stats[1], number: String(services.length || 11) };

  // CMS overrides for hero (admin can rewrite headline / subtitle from /admin/homepage)
  const heroOverrideTitle = tField(heroDb, "title", loc);
  const heroOverrideSub = tField(heroDb, "subtitle", loc);

  return (
    <main id="main">
      <JsonLd contacts={contacts} locale={loc} />

      {/* ═══════════════ HERO — editorial, full-bleed ═══════════════ */}
      <section className="relative overflow-hidden">
        {/* Soft warm glow background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[820px] bg-gradient-to-b from-accent/30 via-background to-background" />
        <div className="pointer-events-none absolute -right-32 -top-20 -z-10 h-[36rem] w-[36rem] rounded-full bg-accent/40 blur-3xl float-soft" />
        <div className="pointer-events-none absolute -left-32 top-72 -z-10 h-[24rem] w-[24rem] rounded-full bg-primary-soft/60 blur-3xl float-soft" style={{ animationDelay: "-3s" }} />

        <Container className="relative pt-12 md:pt-20 lg:pt-28">
          <div className="reveal flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 pulse-ring" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            {COPY.hero.eyebrow[loc]}
            <span className="ml-auto hidden text-muted-foreground/60 md:inline">{COPY.hero.pretitle[loc]} · 2026</span>
          </div>

          {heroOverrideTitle ? (
            <h1 className="reveal mt-12 max-w-[18ch] font-display text-[2.8rem] font-semibold leading-[1.02] tracking-tight md:text-[5rem] lg:text-[6.5rem]">
              {heroOverrideTitle}
            </h1>
          ) : (
            <h1 className="reveal mt-12 font-display text-[2.8rem] font-semibold leading-[1.02] tracking-tight md:text-[5rem] lg:text-[6.5rem]">
              <span className="block">{COPY.hero.line1[loc]}</span>
              <span className="block text-muted-foreground/55">{COPY.hero.line2[loc]}</span>
              <span className="block">{COPY.hero.line3[loc]}</span>
            </h1>
          )}

          <div className="reveal mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[2fr_1fr] lg:items-end">
            <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {heroOverrideSub || COPY.hero.sub[loc]}
            </p>

            <div className="flex flex-col items-start gap-4 lg:items-end">
              <div className="flex flex-wrap items-center gap-3">
                <CTAButton href="/contacts#apply" size="lg" showArrow>
                  {tCta("apply")}
                </CTAButton>
                <WhatsAppButton phone={whatsapp} label={tCta("whatsapp")} variant="outline" size="lg" />
              </div>
              <p className="max-w-xs text-sm leading-snug text-muted-foreground/85 lg:text-right">
                {COPY.hero.reassure[loc]}
              </p>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="reveal mt-20 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground/60">
            <span className="h-px w-12 bg-border" />
            <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
            <span>{loc === "kk" ? "Төмен қарай" : loc === "en" ? "Scroll" : "Скролл"}</span>
          </div>
        </Container>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="border-y border-border/50 bg-card">
        <Container>
          <div className="reveal-stagger grid gap-0 sm:grid-cols-3 sm:divide-x sm:divide-border/50">
            {COPY.trust.map(({ icon: Icon, label, sub }, i) => (
              <div key={i} className="flex items-start gap-4 py-7 sm:px-7 sm:first:pl-0 sm:last:pr-0">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <p className="font-display text-base font-semibold leading-tight">{label[loc]}</p>
                  <p className="text-sm leading-snug text-muted-foreground">{sub[loc]}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ AUDIENCE — big-type manifesto ═══════════════ */}
      <section className="py-28 md:py-36">
        <Container>
          <div className="reveal max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {COPY.audience.eyebrow[loc]}
            </p>
            <p className="font-display text-2xl font-medium leading-snug text-muted-foreground md:text-3xl">
              {COPY.audience.headline[loc]}
            </p>
          </div>

          <ul className="reveal mt-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 font-display text-[2.5rem] font-semibold leading-[1.05] tracking-tight md:gap-x-10 md:text-[4rem] lg:text-[5rem]">
            {COPY.audience.words[loc].map((w, i) => (
              <li key={w} className="group inline-flex items-baseline gap-3 transition-colors">
                <span className="text-foreground transition-colors duration-300 group-hover:text-primary">{w}</span>
                {i < COPY.audience.words[loc].length - 1 && (
                  <span aria-hidden className="text-2xl text-accent-foreground/30 md:text-4xl">·</span>
                )}
              </li>
            ))}
          </ul>

          <p className="reveal mt-14 max-w-xl text-base leading-relaxed text-muted-foreground">
            {COPY.audience.note[loc]}
          </p>
        </Container>
      </section>

      {/* ═══════════════ STATS — quietly confident numbers ═══════════════ */}
      <section className="border-y border-border/50 bg-primary-soft/30 py-20 md:py-24">
        <Container>
          <div className="reveal-stagger grid gap-10 md:grid-cols-3 md:gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-start gap-2">
                <span className="font-display text-7xl font-semibold leading-none tracking-tight text-primary md:text-8xl">
                  {s.number}
                </span>
                <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  {s.label[loc]}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ SERVICES — asymmetric grid ═══════════════ */}
      <section className="py-28 md:py-36">
        <Container>
          <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {COPY.services.eyebrow[loc]}
              </p>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {COPY.services.headline[loc]}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">{COPY.services.sub[loc]}</p>
            </div>
            <CTAButton href="/services" variant="outline" size="sm" showArrow>
              {tCta("more")}
            </CTAButton>
          </div>

          {/* Asymmetric grid: first card spans 2x2, others are 1x1 → cinematic 3-column rhythm */}
          <div className="reveal-stagger mt-12 grid gap-4 md:grid-cols-3 md:grid-rows-2">
            {services.slice(0, 6).map((s, i) => (
              <div
                key={s.id}
                className={
                  "lift " +
                  (i === 0 ? "md:col-span-2 md:row-span-2" : "")
                }
              >
                <ServiceCard service={s} locale={loc} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════ PROCESS — vertical timeline ═══════════════ */}
      <section className="bg-secondary/40 py-28 md:py-36">
        <Container>
          <div className="reveal grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {COPY.process.eyebrow[loc]}
              </p>
              <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {COPY.process.headline[loc]}
              </h2>
            </div>

            <ol className="reveal-stagger relative space-y-3 border-l border-dashed border-border/80 pl-8 lg:pl-12">
              {COPY.process.steps.map((step, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.6rem] top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 bg-background font-mono text-[11px] font-semibold text-primary lg:-left-[3.4rem] lg:h-9 lg:w-9 lg:text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="rounded-2xl bg-card px-6 py-5 shadow-soft lift">
                    <p className="font-display text-lg font-semibold leading-tight">{step[loc]}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {COPY.process.stepDesc[i]?.[loc]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* ═══════════════ PHILOSOPHY — single quote, full-bleed ═══════════════ */}
      <section className="relative overflow-hidden py-28 md:py-36">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-accent/15 to-background" />
        <Container className="max-w-4xl text-center">
          <p className="reveal font-display text-3xl font-medium leading-[1.25] tracking-tight text-foreground md:text-5xl">
            <span className="text-accent-foreground/40">“</span>
            {COPY.philosophy.quote[loc]}
            <span className="text-accent-foreground/40">”</span>
          </p>
          <p className="reveal mt-8 text-sm uppercase tracking-[0.2em] text-muted-foreground">
            {COPY.philosophy.sign[loc]}
          </p>
        </Container>
      </section>

      {/* ═══════════════ FINAL CTA + FORM — cinematic split ═══════════════ */}
      <section id="apply" className="border-t border-border/60 bg-secondary/40 py-24 md:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-20">
          <div className="reveal space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {tCta("apply")}
            </p>
            <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              {COPY.finalCta.headline[loc]}
            </h2>
            <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              {COPY.finalCta.sub[loc]}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <WhatsAppButton phone={whatsapp} label={tCta("whatsapp")} size="lg" />
              {contacts?.phone && (
                <a
                  href={`tel:${contacts.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary"
                >
                  {contacts.phone} <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
            {/* Lightweight signal: mention specialists exist, even though we
                deleted the standalone /specialists page. */}
            {specialists.length > 0 && (
              <p className="pt-6 text-xs uppercase tracking-wider text-muted-foreground">
                {loc === "kk" ? `${specialists.length} маман сізді күтеді` : loc === "en" ? `${specialists.length} specialists are ready to help` : `${specialists.length} специалистов готовы помочь`}
              </p>
            )}
          </div>

          <div className="reveal">
            <ApplicationForm whatsappNumber={whatsapp} source="home" defaultLanguage={loc} />
          </div>
        </Container>
      </section>
    </main>
  );
}
