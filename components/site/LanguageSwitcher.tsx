"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Globe } from "lucide-react";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { localeFullLabels, localeLabels, locales, type Locale } from "@/lib/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const qs = search.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => {
      // string form preserves the current dynamic path; next-intl swaps the locale prefix
      router.replace(href, { locale: next });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("languageSwitcher")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wider",
          "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isPending && "opacity-70",
          className,
        )}
      >
        <Globe className="h-3.5 w-3.5" />
        {localeLabels[locale]}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {locales.map((code) => (
          <DropdownMenuItem
            key={code}
            onSelect={(e) => {
              e.preventDefault();
              switchTo(code);
            }}
            className={cn(
              "flex items-center justify-between",
              code === locale && "font-semibold text-primary",
            )}
          >
            <span>{localeFullLabels[code]}</span>
            <span className="text-xs uppercase text-muted-foreground">{localeLabels[code]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
