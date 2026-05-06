import Image from "next/image";
import { Heart, Languages, Shield, Sparkles, Sun, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";

type Props = { locale: Locale; className?: string };

/**
 * Modern Bento-style grid — 6 cells of varying sizes packed asymmetrically.
 * Each cell has its own flavour: photo, big number, icon-tile, quote.
 * Reads as a magazine spread.
 */
export function BentoGrid({ locale, className }: Props) {
  const T = (kk: string, ru: string, en: string) =>
    locale === "kk" ? kk : locale === "en" ? en : ru;

  return (
    <div className={cn("grid auto-rows-[140px] grid-cols-1 gap-3 md:grid-cols-4 md:auto-rows-[160px]", className)}>
      {/* 1 — large photo (col-span-2 row-span-2) */}
      <div className="relative col-span-1 row-span-2 overflow-hidden rounded-3xl bg-secondary md:col-span-2 lift">
        <Image
          src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=75"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
          <p className="text-xs uppercase tracking-wider opacity-90">{T("Кеңістік", "Пространство", "Space")}</p>
          <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">
            {T("Балаға таныс орта", "Среда, понятная ребёнку", "An environment children recognise")}
          </h3>
        </div>
      </div>

      {/* 2 — big number */}
      <div className="lift relative col-span-1 row-span-1 overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground">
        <Sparkles className="h-5 w-5 opacity-70" />
        <p className="mt-3 font-display text-5xl font-bold leading-none tracking-tight md:text-6xl">11+</p>
        <p className="mt-1 text-xs uppercase tracking-wider opacity-90">
          {T("бағдарлама", "программ", "programmes")}
        </p>
      </div>

      {/* 3 — icon tile */}
      <div className="lift col-span-1 row-span-1 rounded-3xl bg-accent p-5 text-accent-foreground">
        <Heart className="h-5 w-5" />
        <p className="mt-3 font-display text-base font-semibold leading-tight">
          {T("Жеке тәсіл", "Индивидуально", "One-to-one")}
        </p>
        <p className="mt-1 text-xs leading-snug opacity-80">
          {T("Әр балаға өз жоспары", "Свой план каждому ребёнку", "A unique plan per child")}
        </p>
      </div>

      {/* 4 — quote */}
      <div className="lift col-span-1 row-span-1 rounded-3xl bg-card p-5 md:col-span-2">
        <Sun className="h-5 w-5 text-warning" />
        <p className="mt-3 font-display text-sm leading-snug md:text-base">
          {T(
            "«Жұмсақтық — біздің әдісіміз. Жайбарақаттық — біздің ортамыз.»",
            "«Мягкость — наш метод. Спокойствие — наша среда.»",
            "“Gentleness is our method. Calm is our environment.”",
          )}
        </p>
      </div>

      {/* 5 — languages */}
      <div className="lift col-span-1 row-span-1 rounded-3xl bg-secondary p-5">
        <Languages className="h-5 w-5 text-primary" />
        <p className="mt-3 font-display text-base font-semibold leading-tight">
          {T("3 тіл", "3 языка", "3 languages")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">KZ · RU · EN</p>
      </div>

      {/* 6 — small icon */}
      <div className="lift col-span-1 row-span-1 rounded-3xl bg-card p-5">
        <Users2 className="h-5 w-5 text-success" />
        <p className="mt-3 font-display text-base font-semibold leading-tight">
          {T("Команда", "Команда", "Team")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {T("Логопед · ABA · Сенсорика", "Логопед · ABA · Сенсорика", "Speech · ABA · Sensory")}
        </p>
      </div>

      {/* 7 — shield/safety */}
      <div className="lift col-span-1 row-span-1 rounded-3xl border border-border/70 bg-background p-5">
        <Shield className="h-5 w-5 text-primary" />
        <p className="mt-3 font-display text-base font-semibold leading-tight">
          {T("Қауіпсіз орта", "Безопасная среда", "Safe environment")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {T("Стерильді, тыныш, жеке", "Чистая, тихая, приватная", "Clean, quiet, private")}
        </p>
      </div>
    </div>
  );
}
