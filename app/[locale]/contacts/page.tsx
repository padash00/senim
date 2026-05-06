import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { SectionTitle } from "@/components/site/SectionTitle";
import { ApplicationForm } from "@/components/site/ApplicationForm";
import { JsonLd } from "@/components/site/JsonLd";
import { Card, CardContent } from "@/components/ui/card";
import { getContacts } from "@/lib/db/queries";
import { tField } from "@/lib/i18n/translated";
import { buildMetadata } from "@/lib/seo";
import { sanitizeIframe } from "@/lib/sanitize";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { formatPhoneHref, formatWhatsAppHref } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import { env } from "@/lib/env";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    path: "/contacts",
    locale: locale as Locale,
    fallbackTitle: "Контакты · Сенім",
  });
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const [t, tCommon, contacts] = await Promise.all([
    getTranslations("nav"),
    getTranslations("common"),
    getContacts(),
  ]);
  const whatsapp = contacts?.whatsapp || env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const address = tField(contacts, "address", loc);
  const hoursKey = `mon_fri_${loc}` as const;
  const wh = (contacts?.working_hours ?? {}) as Record<string, string | undefined>;

  return (
    <main id="main">
      <JsonLd contacts={contacts} locale={loc} />
      <div className="container py-4">
        <Breadcrumbs
          items={[
            { href: "/", label: loc === "kk" ? "Басты бет" : loc === "en" ? "Home" : "Главная" },
            { label: loc === "kk" ? "Байланыс" : loc === "en" ? "Contacts" : "Контакты" },
          ]}
        />
      </div>

      {/* HERO with photo banner */}
      <section className="relative overflow-hidden">
        <div className="relative h-[36vh] min-h-[260px] w-full overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=2000&q=75"
            alt=""
            fill
            sizes="100vw"
            priority
            quality={75}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/15 via-foreground/35 to-background" />
        </div>
        <Container className="relative -mt-24 md:-mt-32">
          <div className="rounded-3xl border border-border/60 bg-background/95 p-8 shadow-card backdrop-blur md:p-10">
            <SectionTitle eyebrow={t("contacts")} title={t("contacts")} />
          </div>
        </Container>
      </section>

      <Section>
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {address && (
              <ContactRow icon={MapPin} label={tCommon("address")}>
                <p>{address}</p>
              </ContactRow>
            )}
            {contacts?.phone && (
              <ContactRow icon={Phone} label={tCommon("phone")}>
                <a href={formatPhoneHref(contacts.phone)} className="hover:text-primary">
                  {contacts.phone}
                </a>
              </ContactRow>
            )}
            {whatsapp && (
              <ContactRow icon={MessageCircle} label="WhatsApp">
                <a
                  href={formatWhatsAppHref(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  {whatsapp}
                </a>
              </ContactRow>
            )}
            {contacts?.email && (
              <ContactRow icon={Mail} label="Email">
                <a href={`mailto:${contacts.email}`} className="hover:text-primary">
                  {contacts.email}
                </a>
              </ContactRow>
            )}
            {contacts?.instagram && (
              <ContactRow icon={Instagram} label="Instagram">
                <a
                  href={`https://instagram.com/${contacts.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  @{contacts.instagram}
                </a>
              </ContactRow>
            )}
            <Card>
              <CardContent className="space-y-1 p-6 text-sm">
                <h3 className="text-base font-semibold">{tCommon("workingHours")}</h3>
                <ul className="space-y-1 text-muted-foreground">
                  {wh[hoursKey] && <li>{wh[hoursKey]}</li>}
                  {wh[`sat_${loc}`] && <li>{wh[`sat_${loc}`]}</li>}
                  {wh[`sun_${loc}`] && <li>{wh[`sun_${loc}`]}</li>}
                </ul>
              </CardContent>
            </Card>
            {contacts?.map_iframe && (() => {
              const safe = sanitizeIframe(contacts.map_iframe);
              return safe ? (
                <div
                  className="overflow-hidden rounded-2xl border border-border/70 bg-secondary"
                  dangerouslySetInnerHTML={{ __html: safe }}
                />
              ) : null;
            })()}
          </div>

          <div id="apply">
            <ApplicationForm whatsappNumber={whatsapp} source="/contacts" defaultLanguage={loc} />
          </div>
        </Container>
      </Section>
    </main>
  );
}

function ContactRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-4">
      <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1 text-sm">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="mt-0.5 font-medium text-foreground">{children}</div>
      </div>
    </div>
  );
}
