import { useTranslations } from "next-intl";
import { Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Logo } from "./Logo";
import { Container } from "./Container";
import type { Contacts } from "@/lib/supabase/database.types";
import type { Locale } from "@/lib/i18n/config";
import { tField } from "@/lib/i18n/translated";
import { formatPhoneHref } from "@/lib/utils";

type Props = {
  locale: Locale;
  contacts: Contacts | null;
  tagline?: string;
};

export function Footer({ locale, contacts, tagline }: Props) {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30">
      <Container className="grid gap-12 py-14 md:grid-cols-4 md:py-16">
        <div className="space-y-4 md:col-span-2">
          <Logo tagline={tagline} />
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{t("disclaimer")}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("nav.contacts")}
          </h3>
          <ul className="space-y-2 text-sm">
            {contacts?.phone && (
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-primary" />
                <a href={formatPhoneHref(contacts.phone)} className="hover:text-primary">
                  {contacts.phone}
                </a>
              </li>
            )}
            {contacts?.email && (
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-primary" />
                <a href={`mailto:${contacts.email}`} className="hover:text-primary">
                  {contacts.email}
                </a>
              </li>
            )}
            {contacts && tField(contacts, "address", locale) && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                <span>{tField(contacts, "address", locale)}</span>
              </li>
            )}
            {contacts?.instagram && (
              <li className="flex items-start gap-2">
                <Instagram className="mt-0.5 h-4 w-4 text-primary" />
                <a
                  href={`https://instagram.com/${contacts.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary"
                >
                  @{contacts.instagram}
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("nav.services")}
          </h3>
          <ul className="space-y-2 text-sm">
            {(["about", "services", "parents", "contacts"] as const).map((key) => (
              <li key={key}>
                <Link
                  href={`/${key}`}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-border/60">
        <Container className="flex flex-col items-start gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {t("site.name")}. {t("footer.rights")}
          </span>
          <span className="text-[11px]">{t("disclaimer")}</span>
        </Container>
      </div>
    </footer>
  );
}
