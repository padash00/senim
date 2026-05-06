import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Award, HandHeart, Leaf, ShieldCheck, Users2 } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { SpecialistCard } from "@/components/site/SpecialistCard";
import { Card, CardContent } from "@/components/ui/card";
import { listCertificates, listGallery, listSpecialists } from "@/lib/db/queries";
import { tField } from "@/lib/i18n/translated";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { FounderNote } from "@/components/site/FounderNote";
import { DayTimeline } from "@/components/site/DayTimeline";
import { Stamp } from "@/components/site/Stamp";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/about",
    locale: locale as Locale,
    fallbackTitle: "О центре · Сенім",
    fallbackDescription: "Миссия, ценности и команда коррекционно-развивающего центра Сенім.",
  });
}

const VALUES = [
  { icon: HandHeart, kk: "Жанашырлық", ru: "Бережность", en: "Care" },
  { icon: ShieldCheck, kk: "Сенімділік", ru: "Доверие", en: "Trust" },
  { icon: Leaf, kk: "Жайбарақат орта", ru: "Спокойствие", en: "Calmness" },
  { icon: Users2, kk: "Командалық жұмыс", ru: "Командная работа", en: "Teamwork" },
  { icon: Award, kk: "Кәсібилік", ru: "Профессионализм", en: "Professionalism" },
];

const MISSION = {
  kk: "Біз балалардың және отбасылардың тыныш әрі қолдау көрсететін ортада дамуына көмектесеміз. Әрбір бағдарлама нақты мақсаттарға, бақылауға және ата-анамен серіктестікке негізделеді.",
  ru: "Мы помогаем детям и семьям расти в спокойной и поддерживающей среде. Каждая программа основана на чётких целях, наблюдении и партнёрстве с родителями.",
  en: "We help children and families grow in a calm and supportive environment. Every programme is built on clear goals, observation and partnership with parents.",
};

const APPROACH = {
  kk: "Біз медициналық диагноз қоймаймыз. Біз күнделікті өмірге қажет дағдыларды дамытамыз: қарым-қатынас, зейін, өзін-өзі реттеу, өзіндік дағдылар.",
  ru: "Мы не ставим медицинских диагнозов. Мы развиваем навыки, важные для повседневной жизни: коммуникацию, внимание, саморегуляцию, бытовые навыки.",
  en: "We do not provide medical diagnoses. We grow the skills children need every day: communication, attention, self-regulation, daily-living skills.",
};

const SPACE = {
  kk: "Орталық үш кабинетті, сенсорлық бөлмені және ата-аналарға арналған күту аймағын қамтиды. Біз балаларға таныс ортада өздерін еркін сезінуге көмектесеміз.",
  ru: "Центр включает три кабинета, сенсорную комнату и зону ожидания для родителей. Мы создаём знакомую среду, в которой ребёнку комфортно.",
  en: "The centre has three therapy rooms, a sensory room and a parents' waiting area. We design a familiar environment where the child feels at ease.",
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [t, tNav, specialists, gallery, certs] = await Promise.all([
    getTranslations("nav"),
    getTranslations("home"),
    listSpecialists(),
    listGallery(),
    listCertificates(),
  ]);

  return (
    <main id="main">
      <div className="container py-4">
        <Breadcrumbs
          items={[
            { href: "/", label: loc === "kk" ? "Басты бет" : loc === "en" ? "Home" : "Главная" },
            { label: loc === "kk" ? "Орталық туралы" : loc === "en" ? "About" : "О центре" },
          ]}
        />
      </div>
      {/* HERO with full-bleed photo banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=2000&q=75"
            alt=""
            fill
            sizes="100vw"
            priority
            quality={75}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-background" />
        </div>
        <Container className="relative -mt-32 md:-mt-40">
          <div className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-card backdrop-blur md:p-12">
            <SectionTitle
              eyebrow={t("about")}
              title={
                loc === "kk"
                  ? "Сенім — балалар мен отбасыларға арналған тыныш кеңістік"
                  : loc === "en"
                    ? "Senim — a calm space for children and families"
                    : "Сенім — спокойное пространство для детей и семей"
              }
              subtitle={MISSION[loc]}
            />
          </div>
        </Container>
      </section>

      {/* APPROACH — text + photo card */}
      <Section>
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold md:text-3xl">
              {loc === "kk" ? "Біздің тәсілдеміз" : loc === "en" ? "Our approach" : "Наш подход"}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">{APPROACH[loc]}</p>
            <p className="text-base leading-relaxed text-muted-foreground">{SPACE[loc]}</p>
          </div>
          <div className="lift mask-blob relative aspect-[4/5] w-full overflow-hidden bg-secondary shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=75"
              alt={loc === "kk" ? "Орталық кеңістігі" : loc === "en" ? "Our space" : "Пространство центра"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={75}
              className="object-cover"
            />
          </div>
        </Container>
      </Section>

      {/* VALUES */}
      <Section bleed="muted">
        <Container>
          <SectionTitle
            align="center"
            title={loc === "kk" ? "Біздің құндылықтарымыз" : loc === "en" ? "Our values" : "Наши ценности"}
          />
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-5">
            {VALUES.map(({ icon: Icon, ...labels }, i) => (
              <li key={i}>
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-medium">{labels[loc]}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* GALLERY */}
      {gallery.length > 0 && (
        <Section>
          <Container>
            <SectionTitle title={loc === "kk" ? "Орталық" : loc === "en" ? "Inside the centre" : "Пространство центра"} />
            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {gallery.slice(0, 8).map((g) => (
                <div key={g.id} className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                  <Image
                    src={g.image_url}
                    alt={tField(g, "caption", loc) || "Senim"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CERTIFICATES */}
      {certs.length > 0 && (
        <Section bleed="muted">
          <Container>
            <SectionTitle
              title={loc === "kk" ? "Сертификаттар" : loc === "en" ? "Certificates" : "Сертификаты"}
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {certs.map((c) => (
                <Card key={c.id} className="overflow-hidden">
                  {c.image_url && (
                    <div className="relative aspect-[4/3] bg-secondary">
                      <Image
                        src={c.image_url}
                        alt={tField(c, "title", loc)}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <p className="text-sm font-medium">{tField(c, "title", loc)}</p>
                    {c.issued_at && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(c.issued_at).getFullYear()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* FOUNDER NOTE */}
      <FounderNote locale={loc} />

      {/* DAY IN THE CENTRE */}
      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {loc === "kk" ? "Бір күн" : loc === "en" ? "A day" : "Один день"}
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
              {loc === "kk" ? "Орталықта бір күн" : loc === "en" ? "A day at the centre" : "Один день в центре"}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {loc === "kk"
                ? "Кесте икемді — әр баланың ыңғайына сай."
                : loc === "en"
                  ? "The schedule is flexible — built around each child."
                  : "Расписание гибкое — подстраивается под ребёнка."}
            </p>
            {/* Decorative seal */}
            <div className="hidden pt-4 lg:block">
              <Stamp size={140} />
            </div>
          </div>
          <DayTimeline locale={loc} />
        </Container>
      </Section>

      {/* TEAM */}
      {specialists.length > 0 && (
        <Section>
          <Container>
            <SectionTitle title={tNav("team.title")} />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.map((sp) => (
                <SpecialistCard key={sp.id} specialist={sp} locale={loc} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
