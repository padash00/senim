"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/applications", label: "Заявки" },
  { href: "/admin/services", label: "Услуги" },
  { href: "/admin/specialists", label: "Специалисты" },
  { href: "/admin/certificates", label: "Сертификаты" },
  { href: "/admin/reviews", label: "Отзывы" },
  { href: "/admin/faqs", label: "FAQ" },
  { href: "/admin/blog", label: "Блог" },
  { href: "/admin/gallery", label: "Галерея" },
  { href: "/admin/homepage", label: "Главная" },
  { href: "/admin/seo", label: "SEO" },
  { href: "/admin/settings", label: "Настройки" },
];

export function AdminMobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto flex h-full w-72 flex-col bg-background p-4 shadow-card">
        <button
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>
        <nav className="mt-8 flex flex-col gap-0.5">
          {NAV.map(({ href, label }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-secondary",
                  active && "bg-primary-soft/60",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
