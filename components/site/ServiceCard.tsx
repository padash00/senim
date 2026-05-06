import Image from "next/image";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tField } from "@/lib/i18n/translated";
import type { Service } from "@/lib/supabase/database.types";
import type { Locale } from "@/lib/i18n/config";

function pickIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Icons.Sparkles;
  const map: Record<string, LucideIcon> = Icons as unknown as Record<string, LucideIcon>;
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return map[pascal] ?? Icons.Sparkles;
}

const SERVICE_ACCENT: Record<string, { bg: string; fg: string }> = {
  aba:                  { bg: "24 80% 88%",  fg: "22 50% 24%" },
  logoped:              { bg: "212 70% 92%", fg: "212 64% 30%" },
  defektolog:           { bg: "262 60% 92%", fg: "262 50% 32%" },
  afk:                  { bg: "152 50% 88%", fg: "152 50% 26%" },
  sensory:              { bg: "187 60% 88%", fg: "187 70% 24%" },
  logomassage:          { bg: "330 60% 92%", fg: "330 50% 32%" },
  neuropsy:             { bg: "262 60% 92%", fg: "262 50% 32%" },
  psychologist:         { bg: "330 60% 92%", fg: "330 50% 32%" },
  "school-prep":        { bg: "36 80% 90%",  fg: "36 60% 28%" },
  "individual-program": { bg: "212 70% 92%", fg: "212 64% 30%" },
  "group-classes":      { bg: "152 50% 88%", fg: "152 50% 26%" },
};

const FALLBACK_ACCENT = { bg: "212 70% 94%", fg: "212 64% 42%" };

/**
 * Free Unsplash photo URLs — soft, child-friendly, no faces.
 * Used as background fallbacks when the service has no admin-uploaded image
 * AND the card is rendered in "featured" (large) variant.
 */
const FALLBACK_PHOTO: Record<string, string> = {
  aba:           "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=70",
  logoped:       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=70",
  defektolog:    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=70",
  afk:           "https://images.unsplash.com/photo-1546015720-b8b30df5aa27?auto=format&fit=crop&w=1200&q=70",
  sensory:       "https://images.unsplash.com/photo-1505932049984-3da4d05fbab1?auto=format&fit=crop&w=1200&q=70",
  default:       "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=70",
};

export function ServiceCard({
  service,
  locale,
  featured = false,
}: {
  service: Service;
  locale: Locale;
  featured?: boolean;
}) {
  const Icon = pickIcon(service.icon);
  const title = tField(service, "title", locale);
  const description = tField(service, "short_description", locale);
  const accent = SERVICE_ACCENT[service.slug] ?? FALLBACK_ACCENT;
  const photo = service.image_url ?? (featured ? FALLBACK_PHOTO[service.slug] ?? FALLBACK_PHOTO.default : null);

  // ─── FEATURED variant — full-bleed photo card with overlay text ───
  if (featured && photo) {
    return (
      <Card className="group relative h-full overflow-hidden">
        <Image
          src={photo}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10" />
        <CardContent className="relative flex h-full flex-col justify-end gap-3 p-6 text-background min-h-[320px]">
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: `hsl(${accent.bg})`, color: `hsl(${accent.fg})` }}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-semibold leading-snug tracking-tight md:text-3xl">{title}</h3>
            {description && (
              <p className="max-w-md text-sm leading-relaxed text-background/85 md:text-base">{description}</p>
            )}
          </div>
          <Link
            href={`/services/${service.slug}`}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-background hover:underline"
          >
            Подробнее
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {service.age_range && (
            <span className="absolute right-5 top-5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground">
              {service.age_range}
            </span>
          )}
        </CardContent>
      </Card>
    );
  }

  // ─── DEFAULT variant — minimal icon card ───
  return (
    <Card className="group h-full">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between">
          <span
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: `hsl(${accent.bg})`, color: `hsl(${accent.fg})` }}
          >
            <Icon className="h-5 w-5" />
          </span>
          {service.age_range && <Badge variant="muted">{service.age_range}</Badge>}
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{title}</h3>
          {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        <Link
          href={`/services/${service.slug}`}
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium hover:underline"
          style={{ color: `hsl(${accent.fg})` }}
        >
          Подробнее
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
