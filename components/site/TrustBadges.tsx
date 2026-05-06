import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

const COPY: Record<Locale, string[]> = {
  kk: ["Лицензияланған", "8+ жыл тәжірибе", "200+ отбасы", "Шымкент · 2018", "3 тілде жұмыс істейміз"],
  ru: ["Лицензировано", "8+ лет опыта", "200+ семей", "Шымкент с 2018", "Принимаем 3 языка"],
  en: ["Licensed", "8+ years of practice", "200+ families", "Shymkent · since 2018", "3 working languages"],
};

export function TrustBadges({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground", className)}>
      {COPY[locale].map((label) => (
        <li key={label} className="inline-flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-success" />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
