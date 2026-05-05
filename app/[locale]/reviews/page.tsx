import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ReviewCard } from "@/components/site/ReviewCard";
import { listReviews } from "@/lib/db/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/reviews",
    locale: locale as Locale,
    fallbackTitle: "Отзывы · Сенім",
  });
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [t, reviews] = await Promise.all([getTranslations("home.reviews"), listReviews()]);

  return (
    <main id="main">
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container>
          <SectionTitle eyebrow="Отзывы" title={t("title")} />
        </Container>
      </Section>
      <Section>
        <Container>
          {reviews.length === 0 ? (
            <p className="text-muted-foreground">Отзывы появятся здесь.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} locale={loc} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </main>
  );
}
