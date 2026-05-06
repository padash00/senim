import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ServiceCard } from "@/components/site/ServiceCard";
import { listServices } from "@/lib/db/queries";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
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
      <div className="container py-4">
        <Breadcrumbs
          items={[
            { href: "/", label: loc === "kk" ? "Басты бет" : loc === "en" ? "Home" : "Главная" },
            { label: loc === "kk" ? "Қызметтер" : loc === "en" ? "Services" : "Услуги" },
          ]}
        />
      </div>
      {/* HERO with photo banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=2000&q=75"
            alt=""
            fill
            sizes="100vw"
            priority
            quality={75}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-foreground/30 to-background" />
        </div>
        <Container className="relative -mt-28 md:-mt-36">
          <div className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-card backdrop-blur md:p-10">
            <SectionTitle eyebrow="Услуги центра" title={t("title")} subtitle={t("subtitle")} />
          </div>
        </Container>
      </section>

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
