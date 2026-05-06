import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { routing } from "@/lib/i18n/routing";
import type { Locale } from "@/lib/i18n/config";
import { LOCALE_TAGLINE } from "@/lib/constants";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloating } from "@/components/site/WhatsAppButton";
import { MobileStickyCta } from "@/components/site/MobileStickyCta";
import { CursorFollower } from "@/components/site/CursorFollower";
import { BackToTop } from "@/components/site/BackToTop";
import { FirstVisitHint } from "@/components/site/FirstVisitHint";
import { KeyboardShortcuts } from "@/components/site/KeyboardShortcuts";
import { getContacts } from "@/lib/db/queries";
import { env } from "@/lib/env";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);

  const [messages, contacts, t] = await Promise.all([
    getMessages(),
    getContacts(),
    getTranslations({ locale, namespace: "cta" }),
  ]);
  const tagline = LOCALE_TAGLINE[locale as Locale];
  const whatsapp = contacts?.whatsapp || env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="flex min-h-screen flex-col">
        <Header tagline={tagline} />
        <div className="flex-1">{children}</div>
        <Footer locale={locale as Locale} contacts={contacts} tagline={tagline} />
      </div>
      <CursorFollower />
      <BackToTop />
      <FirstVisitHint />
      <KeyboardShortcuts />
      <WhatsAppFloating phone={whatsapp} label={t("whatsapp")} />
      <MobileStickyCta phone={contacts?.phone} whatsapp={whatsapp} />
      <Toaster richColors position="top-center" closeButton />
    </NextIntlClientProvider>
  );
}
