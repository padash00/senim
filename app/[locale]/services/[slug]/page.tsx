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
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ShareButton } from "@/components/site/ShareButton";
import { RelatedServices } from "@/components/site/RelatedServices";
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
      <div className="container py-4">
        <Breadcrumbs
          items={[
            { href: "/", label: loc === "kk" ? "Басты бет" : loc === "en" ? "Home" : "Главная" },
            { href: "/services", label: loc === "kk" ? "Қызметтер" : loc === "en" ? "Services" : "Услуги" },
            { label: title },
          ]}
        />
      </div>
      <Section bleed="primary-soft" className="pt-6 md:pt-10">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <CTAButton href={`/contacts#apply`} size="lg" showArrow>
                Оставить заявку
              </CTAButton>
              <WhatsAppButton phone={whatsapp} label="WhatsApp" variant="outline" size="lg" />
              <ShareButton title={title} className="ml-auto" />
            </div>
          </div>
          {(() => {
            const SLUG_PHOTO: Record<string, string> = {
              aba:           "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=75",
              logoped:       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=75",
              defektolog:    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=75",
              afk:           "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1200&q=75",
              sensory:       "https://images.unsplash.com/photo-1505932049984-3da4d05fbab1?auto=format&fit=crop&w=1200&q=75",
              psychologist:  "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=75",
              neuropsy:      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=1200&q=75",
            };
            const src = service.image_url ?? SLUG_PHOTO[slug] ?? SLUG_PHOTO.aba;
            return (
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-secondary lift">
                <Image
                  src={src!}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                  quality={75}
                  className="object-cover"
                />
              </div>
            );
          })()}
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

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
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

      <RelatedServices currentSlug={slug} locale={loc} />
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
