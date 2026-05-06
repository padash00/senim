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

/**
 * Per-service accent — gives the cards visual rhythm so the grid doesn't feel
 * like a uniform block. Falls back to the brand blue for unknown slugs.
 * HSL so it works in both light and dark theme.
 */
const SERVICE_ACCENT: Record<string, { bg: string; fg: string }> = {
  aba:                  { bg: "24 80% 88%",  fg: "22 50% 24%" },   // peach
  logoped:              { bg: "212 70% 92%", fg: "212 64% 30%" },  // brand blue
  defektolog:           { bg: "262 60% 92%", fg: "262 50% 32%" },  // soft violet
  afk:                  { bg: "152 50% 88%", fg: "152 50% 26%" },  // mint
  sensory:              { bg: "187 60% 88%", fg: "187 70% 24%" },  // teal
  logomassage:          { bg: "330 60% 92%", fg: "330 50% 32%" },  // rose
  neuropsy:             { bg: "262 60% 92%", fg: "262 50% 32%" },
  psychologist:         { bg: "330 60% 92%", fg: "330 50% 32%" },
  "school-prep":        { bg: "36 80% 90%",  fg: "36 60% 28%" },   // amber
  "individual-program": { bg: "212 70% 92%", fg: "212 64% 30%" },
  "group-classes":      { bg: "152 50% 88%", fg: "152 50% 26%" },
};

const FALLBACK_ACCENT = { bg: "212 70% 94%", fg: "212 64% 42%" };

export function ServiceCard({ service, locale }: { service: Service; locale: Locale }) {
  const Icon = pickIcon(service.icon);
  const title = tField(service, "title", locale);
  const description = tField(service, "short_description", locale);
  const accent = SERVICE_ACCENT[service.slug] ?? FALLBACK_ACCENT;

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
