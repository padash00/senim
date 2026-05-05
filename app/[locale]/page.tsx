import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Activity,
  Brain,
  GraduationCap,
  Heart,
  MessageCircle,
  Shield,
  Sparkles,
  Users2,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { CTAButton } from "@/components/site/CTAButton";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { ServiceCard } from "@/components/site/ServiceCard";
import { SpecialistCard } from "@/components/site/SpecialistCard";
import { ReviewCard } from "@/components/site/ReviewCard";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { JsonLd } from "@/components/site/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import {
  getContacts,
  getHomepageSections,
  listReviews,
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

const AUDIENCE: { icon: LucideIcon; key: string; titleKk: string; titleRu: string; titleEn: string }[] = [
  { icon: MessageCircle, key: "speech", titleKk: "Сөйлеу", titleRu: "Речь", titleEn: "Speech" },
  { icon: Brain, key: "attention", titleKk: "Зейін", titleRu: "Внимание", titleEn: "Attention" },
  { icon: Users2, key: "communication", titleKk: "Қарым-қатынас", titleRu: "Коммуникация", titleEn: "Communication" },
  { icon: Activity, key: "motor", titleKk: "Қозғалыс", titleRu: "Моторика", titleEn: "Motor skills" },
  { icon: Waves, key: "sensory", titleKk: "Сенсорика", titleRu: "Сенсорика", titleEn: "Sensory" },
  { icon: Sparkles, key: "behavior", titleKk: "Мінез-құлық", titleRu: "Поведение", titleEn: "Behaviour" },
  { icon: GraduationCap, key: "learning", titleKk: "Оқу", titleRu: "Обучение", titleEn: "Learning" },
  { icon: Heart, key: "self_help", titleKk: "Дербестік", titleRu: "Самостоятельность", titleEn: "Independence" },
];

const PROCESS = [
  { kk: "Бастапқы консультация", ru: "Первичная консультация", en: "Initial consultation" },
  { kk: "Диагностика және бақылау", ru: "Диагностика и наблюдение", en: "Assessment and observation" },
  { kk: "Жеке бағдарлама", ru: "Индивидуальная программа", en: "Individual programme" },
  { kk: "Жүйелі сабақтар", ru: "Регулярные занятия", en: "Regular sessions" },
  { kk: "Прогресті бақылау", ru: "Отслеживание прогресса", en: "Progress tracking" },
  { kk: "Ата-анаға ұсыныстар", ru: "Рекомендации родителям", en: "Parent recommendations" },
];

// Re-written for emotional warmth — speaks directly to the parent.
const HERO_COPY = {
  badge: { kk: "Шымкент · Бейбітшілік 14/1", ru: "Шымкент · Бейбитшилик 14/1", en: "Shymkent · Beybitshilik 14/1" },
  headline: {
    kk: "Сіздің балаңыз — біздің ең басты жұмысымыз",
    ru: "Ваш ребёнок — наша самая важная работа",
    en: "Your child is our most important work",
  },
  sub: {
    kk: "Сөйлеу, зейін, эмоциялар, қарым-қатынас — әр баланың жолы өзіндік. Біз жанұямен бірге сол жолды жайбарақат, нақты қадамдармен жүреміз.",
    ru: "Речь, внимание, эмоции, общение — у каждого ребёнка свой путь. Мы проходим его вместе с семьёй — спокойно, понятными шагами.",
    en: "Speech, attention, emotions, connection — every child's path is unique. We walk it with the family in calm, clear steps.",
  },
  reassure: {
    kk: "Алғашқы консультация — бұл диагноз емес. Бұл бастапқы әңгіме.",
    ru: "Первая встреча — не диагноз. Это просто разговор, с которого всё начинается.",
    en: "The first meeting isn't a diagnosis. It's the conversation everything starts with.",
  },
};

const TRUST_BAR = [
  {
    icon: Heart,
    kk: "Жеке тәсіл",
    ru: "Индивидуально",
    en: "One-to-one",
    sub: { kk: "Әр балаға өз бағдарламасы", ru: "Своя программа каждому ребёнку", en: "Custom programme per child" },
  },
  {
    icon: Users2,
    kk: "Команда мамандар",
    ru: "Команда специалистов",
    en: "Team of specialists",
    sub: { kk: "Логопед, дефектолог, ABA, нейропсихолог", ru: "Логопед, дефектолог, ABA, нейропсихолог", en: "Speech, special-needs, ABA, neuropsychology" },
  },
  {
    icon: Shield,
    kk: "Жайбарақат орта",
    ru: "Спокойная среда",
    en: "Calm environment",
    sub: { kk: "Балаға таныс және қауіпсіз", ru: "Знакомая и безопасная для ребёнка", en: "Familiar and safe for the child" },
  },
];

const TRUST = [
  { kk: "Жеке тәсіл", ru: "Индивидуальный подход", en: "Individual approach" },
  { kk: "Мамандар командасы", ru: "Команда специалистов", en: "Team of specialists" },
  { kk: "Жайбарақат орта", ru: "Спокойная среда", en: "Calm environment" },
  { kk: "Ата-анамен жұмыс", ru: "Работа с родителями", en: "Parent partnership" },
  { kk: "Өмірлік дағдылар", ru: "Развитие жизненных навыков", en: "Life-skill development" },
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tHome, tCta, tCommon, sections, services, specialists, reviews, contacts] = await Promise.all([
    getTranslations("home"),
    getTranslations("cta"),
    getTranslations("consultation"),
    getHomepageSections(),
    listServices(),
    listSpecialists(),
    listReviews(),
    getContacts(),
  ]);

  const heroDb = sections.find((s) => s.key === "hero");
  const audienceDb = sections.find((s) => s.key === "audience");
  const processDb = sections.find((s) => s.key === "process");
  const trustDb = sections.find((s) => s.key === "trust");
  const consultDb = sections.find((s) => s.key === "consultation");
  const loc = locale as Locale;
  const whatsapp = contacts?.whatsapp || env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const heroTitle = tField(heroDb, "title", loc) || HERO_COPY.headline[loc];
  const heroSub = tField(heroDb, "subtitle", loc) || HERO_COPY.sub[loc];

  return (
    <main id="main">
      <JsonLd contacts={contacts} locale={loc} />

      {/* HERO ============================================================ */}
      <section className="relative overflow-hidden pb-24 pt-10 md:pt-20 lg:pt-28">
        {/* Warm, soft background — not a flat color, not a gradient blob storm. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-gradient-to-b from-accent/20 via-background to-background" />
        <div className="pointer-events-none absolute -right-40 -top-32 -z-10 h-[28rem] w-[28rem] rounded-full bg-accent/40 blur-3xl float-soft" />
        <div className="pointer-events-none absolute -left-32 top-56 -z-10 h-[22rem] w-[22rem] rounded-full bg-primary-soft/70 blur-3xl float-soft" style={{ animationDelay: "-3s" }} />

        <Container className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div className="reveal space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <span className="relative inline-flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success/60 pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {HERO_COPY.badge[loc]}
            </div>

            <h1 className="font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-[3.8rem]">
              {heroTitle}
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">{heroSub}</p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/contacts#apply" size="lg" showArrow>
                {tCta("apply")}
              </CTAButton>
              <WhatsAppButton phone={whatsapp} label={tCta("whatsapp")} variant="outline" size="lg" />
            </div>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground/90">
              <span aria-hidden className="mr-1.5 inline-block h-1 w-1 rounded-full bg-accent-foreground/50 align-middle" />
              {HERO_COPY.reassure[loc]}
            </p>
          </div>

          <HeroIllustration loc={loc} />
        </Container>

        {/* TRUST BAR — appears immediately under the fold so the parent
            sees three concrete reassurances within the first scroll. */}
        <Container className="reveal mt-16 lg:mt-20">
          <div className="grid gap-3 rounded-3xl border border-border/60 bg-card p-3 shadow-soft sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border/60 sm:p-0">
            {TRUST_BAR.map(({ icon: Icon, sub, ...labels }, i) => (
              <div key={i} className="flex items-start gap-4 p-5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <p className="font-display text-sm font-semibold">{labels[loc]}</p>
                  <p className="text-xs leading-snug text-muted-foreground">{sub[loc]}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* AUDIENCE ======================================================== */}
      <Section>
        <Container>
          <div className="reveal">
            <SectionTitle
              eyebrow={tHome("audience.title")}
              title={tField(audienceDb, "title", loc) || tHome("audience.title")}
              subtitle={tField(audienceDb, "subtitle", loc) || tHome("audience.subtitle")}
            />
          </div>
          <ul className="reveal-stagger mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {AUDIENCE.map(({ icon: Icon, key, ...labels }) => (
              <li key={key}>
                <Card className="lift h-full">
                  <CardContent className="flex flex-col items-start gap-3 p-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium">{labels[`title${cap(loc)}` as keyof typeof labels]}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* SERVICES ======================================================== */}
      <Section bleed="muted">
        <Container>
          <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow={tHome("services.title")}
              title={tHome("services.title")}
              subtitle={tHome("services.subtitle")}
            />
            <CTAButton href="/services" variant="outline" size="sm" showArrow>
              {tCta("more")}
            </CTAButton>
          </div>
          <div className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <div key={s.id} className="lift">
                <ServiceCard service={s} locale={loc} />
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* PROCESS ========================================================= */}
      <Section>
        <Container>
          <div className="reveal">
            <SectionTitle
              eyebrow={tHome("process.title")}
              title={tField(processDb, "title", loc) || tHome("process.title")}
            />
          </div>
          <ol className="reveal-stagger mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step, i) => (
              <li key={i}>
                <Card className="lift h-full">
                  <CardContent className="flex h-full items-start gap-4 p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="text-base font-medium leading-snug">{step[loc]}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* TRUST =========================================================== */}
      <Section bleed="primary-soft">
        <Container>
          <div className="reveal">
            <SectionTitle
              align="center"
              eyebrow={tHome("trust.title")}
              title={tField(trustDb, "title", loc) || tHome("trust.title")}
            />
          </div>
          <div className="reveal-stagger mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((item, i) => (
              <Card key={i} className="lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <p className="font-medium">{item[loc]}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* SPECIALISTS ===================================================== */}
      {specialists.length > 0 && (
        <Section>
          <Container>
            <div className="reveal flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionTitle eyebrow={tHome("team.title")} title={tHome("team.title")} />
              <CTAButton href="/specialists" variant="outline" size="sm" showArrow>
                {tCta("more")}
              </CTAButton>
            </div>
            <div className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.slice(0, 3).map((sp) => (
                <div key={sp.id} className="lift">
                  <SpecialistCard specialist={sp} locale={loc} />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* REVIEWS ========================================================= */}
      {reviews.length > 0 && (
        <Section bleed="muted">
          <Container>
            <div className="reveal">
              <SectionTitle eyebrow={tHome("reviews.title")} title={tHome("reviews.title")} />
            </div>
            <div className="reveal-stagger mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="lift">
                  <ReviewCard review={r} locale={loc} />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CONSULTATION + APPLY =========================================== */}
      <Section id="apply">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="reveal space-y-5">
            <SectionTitle
              eyebrow={tCommon("title")}
              title={tField(consultDb, "title", loc) || tCommon("title")}
              subtitle={tField(consultDb, "subtitle", loc) || tCommon("body")}
            />
            <p className="text-sm leading-relaxed text-muted-foreground">{tCommon("body")}</p>
          </div>
          <div className="reveal">
            <ApplicationForm whatsappNumber={whatsapp} source="home" defaultLanguage={loc} />
          </div>
        </Container>
      </Section>
    </main>
  );
}

function cap<T extends string>(s: T): Capitalize<T> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;
}

const ILLUSTRATION_QUOTES: Record<Locale, { line: string; sub: string }> = {
  kk: { line: "Біз жанұя үшін осындамыз", sub: "Дамудың әр кезеңінде" },
  ru: { line: "Мы рядом с семьёй", sub: "На каждом этапе развития" },
  en: { line: "We are with the family", sub: "At every stage of growth" },
};

function HeroIllustration({ loc }: { loc: Locale }) {
  // Soft abstract composition with a quietly floating chip — no children's
  // faces, no shouting. Adds emotional weight without "AI cliché" gradients.
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <div className="absolute inset-0 rounded-[42%_58%_55%_45%/60%_40%_60%_40%] bg-primary-soft float-soft" />
      <div className="absolute inset-5 rounded-[55%_45%_60%_40%/45%_55%_45%_55%] bg-accent/70 float-soft" style={{ animationDelay: "-2s" }} />
      <div className="absolute inset-12 rounded-[60%_40%_45%_55%/55%_45%_55%_45%] bg-background shadow-card" />

      {/* Floating reassurance chip */}
      <div className="absolute -left-2 top-10 max-w-[230px] rounded-2xl border border-border/60 bg-background/95 px-4 py-3 shadow-card backdrop-blur lg:-left-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-success/15 text-success">
            <Heart className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold leading-tight">{ILLUSTRATION_QUOTES[loc].line}</p>
            <p className="text-[11px] text-muted-foreground">{ILLUSTRATION_QUOTES[loc].sub}</p>
          </div>
        </div>
      </div>

      {/* Floating "today" stat chip */}
      <div className="absolute -right-2 bottom-12 rounded-2xl border border-border/60 bg-background/95 px-4 py-3 shadow-card backdrop-blur lg:-right-6">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {loc === "kk" ? "Тәжірибе" : loc === "en" ? "Experience" : "Опыт"}
        </p>
        <p className="font-display text-xl font-semibold leading-none">
          8+{" "}
          <span className="text-xs font-medium text-muted-foreground">
            {loc === "kk" ? "жыл" : loc === "en" ? "yrs" : "лет"}
          </span>
        </p>
      </div>

      <div className="absolute right-10 top-14 h-14 w-14 rounded-full bg-primary/10 ring-1 ring-primary/20 float-soft" style={{ animationDelay: "-1.5s" }} />
      <div className="absolute bottom-16 left-12 h-9 w-9 rounded-full bg-accent ring-1 ring-accent-foreground/10 float-soft" style={{ animationDelay: "-4s" }} />
    </div>
  );
}
