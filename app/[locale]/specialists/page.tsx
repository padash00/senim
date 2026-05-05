import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { SpecialistCard } from "@/components/site/SpecialistCard";
import { listSpecialists } from "@/lib/db/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/specialists",
    locale: locale as Locale,
    fallbackTitle: "Специалисты · Сенім",
  });
}

export default async function SpecialistsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [t, specialists] = await Promise.all([getTranslations("nav"), listSpecialists()]);

  return (
    <main id="main">
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container>
          <SectionTitle eyebrow={t("specialists")} title={t("specialists")} />
        </Container>
      </Section>
      <Section>
        <Container>
          {specialists.length === 0 ? (
            <p className="text-muted-foreground">Специалисты появятся здесь, как только их добавят в админке.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {specialists.map((sp) => (
                <SpecialistCard key={sp.id} specialist={sp} locale={loc} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
