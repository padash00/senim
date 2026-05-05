import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  Activity,
  Brain,
  GraduationCap,
  Heart,
  MessageCircle,
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

  return (
    <main id="main">
      <JsonLd contacts={contacts} locale={loc} />
      {/* HERO ----------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-soft/40 via-background to-background pb-20 pt-12 md:pt-20">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-primary-soft/60 blur-3xl" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Шымкент
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {tField(heroDb, "title", loc) || tHome("hero.title")}
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              {tField(heroDb, "subtitle", loc) || tHome("hero.subtitle")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/contacts#apply" size="lg" showArrow>
                {tCta("apply")}
              </CTAButton>
              <WhatsAppButton phone={whatsapp} label={tCta("whatsapp")} variant="outline" size="lg" />
            </div>
          </div>
          <HeroIllustration />
        </Container>
      </section>

      {/* AUDIENCE ------------------------------------------------------- */}
      <Section>
        <Container>
          <SectionTitle
            eyebrow={tHome("audience.title")}
            title={
              tField(audienceDb, "title", loc) || tHome("audience.title")
            }
            subtitle={
              tField(audienceDb, "subtitle", loc) ||
              tHome("audience.subtitle")
            }
          />
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {AUDIENCE.map(({ icon: Icon, key, ...labels }) => (
              <li key={key}>
                <Card className="h-full">
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

      {/* SERVICES ------------------------------------------------------- */}
      <Section bleed="muted">
        <Container>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow={tHome("services.title")}
              title={tHome("services.title")}
              subtitle={tHome("services.subtitle")}
            />
            <CTAButton href="/services" variant="outline" size="sm" showArrow>
              {tCta("more")}
            </CTAButton>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <ServiceCard key={s.id} service={s} locale={loc} />
            ))}
          </div>
        </Container>
      </Section>

      {/* PROCESS -------------------------------------------------------- */}
      <Section>
        <Container>
          <SectionTitle
            eyebrow={tHome("process.title")}
            title={tField(processDb, "title", loc) || tHome("process.title")}
          />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map((step, i) => (
              <li key={i}>
                <Card className="h-full">
                  <CardContent className="flex h-full items-start gap-4 p-6">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="text-base font-medium">{step[loc]}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* TRUST ---------------------------------------------------------- */}
      <Section bleed="primary-soft">
        <Container>
          <SectionTitle
            align="center"
            eyebrow={tHome("trust.title")}
            title={tField(trustDb, "title", loc) || tHome("trust.title")}
          />
          <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TRUST.map((item, i) => (
              <Card key={i}>
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

      {/* SPECIALISTS ---------------------------------------------------- */}
      {specialists.length > 0 && (
        <Section>
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionTitle eyebrow={tHome("team.title")} title={tHome("team.title")} />
              <CTAButton href="/specialists" variant="outline" size="sm" showArrow>
                {tCta("more")}
              </CTAButton>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.slice(0, 3).map((sp) => (
                <SpecialistCard key={sp.id} specialist={sp} locale={loc} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* REVIEWS -------------------------------------------------------- */}
      {reviews.length > 0 && (
        <Section bleed="muted">
          <Container>
            <SectionTitle eyebrow={tHome("reviews.title")} title={tHome("reviews.title")} />
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 3).map((r) => (
                <ReviewCard key={r.id} review={r} locale={loc} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CONSULTATION + APPLY ------------------------------------------ */}
      <Section id="apply">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="space-y-5">
            <SectionTitle
              eyebrow={tCommon("title")}
              title={
                tField(consultDb, "title", loc) || tCommon("title")
              }
              subtitle={
                tField(consultDb, "subtitle", loc) || tCommon("body")
              }
            />
            <p className="text-sm leading-relaxed text-muted-foreground">{tCommon("body")}</p>
          </div>
          <ApplicationForm whatsappNumber={whatsapp} source="home" defaultLanguage={loc} />
        </Container>
      </Section>
    </main>
  );
}

function cap<T extends string>(s: T): Capitalize<T> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;
}

function HeroIllustration() {
  // Soft abstract composition — no external asset, no children's faces.
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-[40%_60%_55%_45%/60%_40%_60%_40%] bg-primary-soft" />
      <div className="absolute inset-6 rounded-[55%_45%_60%_40%/45%_55%_45%_55%] bg-accent/60" />
      <div className="absolute inset-14 rounded-[60%_40%_45%_55%/55%_45%_55%_45%] bg-background shadow-card" />
      <div className="absolute right-8 top-12 h-16 w-16 rounded-full bg-primary/10 ring-1 ring-primary/20" />
      <div className="absolute bottom-10 left-8 h-10 w-10 rounded-full bg-accent ring-1 ring-accent-foreground/10" />
    </div>
  );
}
