import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Clock, Users, Wallet } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { CTAButton } from "@/components/site/CTAButton";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContacts, getServiceBySlug, listServices } from "@/lib/db/queries";
import { tField } from "@/lib/i18n/translated";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";
import { env } from "@/lib/env";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const services = await listServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  const title = tField(service, "title", locale as Locale);
  const description = tField(service, "short_description", locale as Locale);
  return buildMetadata({
    path: `/services/${slug}`,
    locale: locale as Locale,
    fallbackTitle: `${title} · Сенім`,
    fallbackDescription: description || undefined,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [service, contacts] = await Promise.all([getServiceBySlug(slug), getContacts()]);
  if (!service) notFound();

  const t = (base: string) => tField(service, base, loc);
  const title = t("title");
  const short = t("short_description");
  const fullDescription = t("full_description");
  const suitable = t("suitable_for");
  const skills = t("skills_developed");
  const process = t("how_it_works");
  const result = t("result");
  const priceNote = t("price_note");
  const whatsapp = contacts?.whatsapp || env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <main id="main">
      <Section bleed="primary-soft" className="pt-12 md:pt-20">
        <Container className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <span>Услуга</span>
              {service.age_range && <span>· {service.age_range} лет</span>}
              {service.duration_minutes && <span>· {service.duration_minutes} мин</span>}
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              {title}
            </h1>
            {short && <p className="max-w-2xl text-lg text-muted-foreground">{short}</p>}
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href={`/contacts#apply`} size="lg" showArrow>
                Оставить заявку
              </CTAButton>
              <WhatsAppButton phone={whatsapp} label="WhatsApp" variant="outline" size="lg" />
            </div>
          </div>
          {service.image_url && (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-secondary">
              <Image
                src={service.image_url}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          )}
        </Container>
      </Section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {fullDescription && (
              <Block title="Подробнее">
                <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-line">{fullDescription}</p>
              </Block>
            )}
            {suitable && (
              <Block title="Кому подходит">
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">{suitable}</p>
              </Block>
            )}
            {skills && (
              <Block title="Какие навыки развивает">
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">{skills}</p>
              </Block>
            )}
            {process && (
              <Block title="Как проходит занятие">
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">{process}</p>
              </Block>
            )}
            {result && (
              <Block title="Чего можно ожидать">
                <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-line">{result}</p>
              </Block>
            )}
            <Card>
              <CardContent className="space-y-2 p-6 text-sm leading-relaxed text-muted-foreground">
                <p>
                  {priceNote ||
                    "Окончательная стоимость и программа определяются после первичной консультации."}
                </p>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="font-display text-lg font-semibold">Кратко</h3>
                <dl className="space-y-3 text-sm">
                  {service.age_range && (
                    <Row icon={Users} label="Возраст" value={`${service.age_range} лет`} />
                  )}
                  {service.duration_minutes && (
                    <Row icon={Clock} label="Длительность" value={`${service.duration_minutes} мин`} />
                  )}
                  {service.price && (
                    <Row icon={Wallet} label="От" value={`${service.price.toLocaleString()} ₸`} />
                  )}
                </dl>
                <div className="flex flex-wrap gap-2">
                  {service.is_published && <Badge variant="success">Принимаем заявки</Badge>}
                </div>
              </CardContent>
            </Card>

            <ApplicationForm
              whatsappNumber={whatsapp}
              serviceId={service.id}
              source={`/services/${slug}`}
              defaultLanguage={loc}
            />
          </aside>
        </Container>
      </Section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
