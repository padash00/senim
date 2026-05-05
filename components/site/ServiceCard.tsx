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
  // try kebab-to-pascal: "message-circle" → "MessageCircle"
  const pascal = name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
  return map[pascal] ?? Icons.Sparkles;
}

export function ServiceCard({ service, locale }: { service: Service; locale: Locale }) {
  const Icon = pickIcon(service.icon);
  const title = tField(service, "title", locale);
  const description = tField(service, "short_description", locale);

  return (
    <Card className="group h-full">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-start justify-between">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
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
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Подробнее
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
