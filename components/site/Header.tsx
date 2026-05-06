"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { CTAButton } from "./CTAButton";
import { ThemeToggle } from "./ThemeToggle";
import { FontSizeControl } from "./FontSizeControl";
import { cn } from "@/lib/utils";

// Compressed nav: 4 entry points instead of 8. Keeps the header airy and
// lets parents scan it in one glance. The other pages are reachable from the
// footer and from CTA flows on each section.
const NAV = [
  { href: "/about", key: "about" as const },
  { href: "/services", key: "services" as const },
  { href: "/parents", key: "parents" as const },
  { href: "/contacts", key: "contacts" as const },
];

export function Header({ tagline }: { tagline?: string }) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70",
        "transition-shadow duration-200",
        scrolled && "shadow-soft",
      )}
    >
      <div
        className={cn(
          "container flex items-center gap-4 transition-[height] duration-200",
          scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20",
        )}
      >
        <Link href="/" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
          <Logo tagline={tagline} />
        </Link>

        <nav className="ml-6 hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map(({ href, key }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                data-active={active}
                className={cn(
                  "nav-link rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  active && "text-foreground",
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <FontSizeControl className="hidden xl:inline-flex" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <LanguageSwitcher />
          <CTAButton href="/contacts#apply" size="sm" className="hidden md:inline-flex">
            {tCta("apply")}
          </CTAButton>
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background/95 lg:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {NAV.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-base font-medium hover:bg-secondary"
              >
                {t(key)}
              </Link>
            ))}
            <CTAButton href="/contacts#apply" className="mt-2 w-full justify-center">
              {tCta("apply")}
            </CTAButton>
          </nav>
        </div>
      )}
    </header>
  );
}
