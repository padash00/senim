import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ServiceCard } from "@/components/site/ServiceCard";
import { listServices } from "@/lib/db/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/services",
    locale: locale as Locale,
    fallbackTitle: "Услуги · Сенім",
    fallbackDescription: "Полный список программ центра Сенім.",
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [t, services] = await Promise.all([getTranslations("home.services"), listServices()]);

  return (
    <main id="main">
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container>
          <SectionTitle eyebrow="Услуги центра" title={t("title")} subtitle={t("subtitle")} />
        </Container>
      </Section>
      <Section>
        <Container>
          {services.length === 0 ? (
            <p className="text-muted-foreground">Услуги пока не добавлены.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} locale={loc} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
