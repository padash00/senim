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
      {/* HERO */}
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container>
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
        </Container>
      </Section>

      {/* APPROACH */}
      <Section>
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-semibold">
              {loc === "kk" ? "Біздің тәсілдеміз" : loc === "en" ? "Our approach" : "Наш подход"}
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground">{APPROACH[loc]}</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold">
                {loc === "kk" ? "Орталық кеңістігі" : loc === "en" ? "Our space" : "Пространство центра"}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{SPACE[loc]}</p>
            </CardContent>
          </Card>
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
