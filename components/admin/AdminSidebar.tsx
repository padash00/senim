"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BookOpen,
  Briefcase,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings2,
  Sparkles,
  Star,
  Users2,
  HelpCircle,
  Search,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/site/Logo";

const NAV: { href: string; label: string; icon: typeof LayoutDashboard }[] = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard },
  { href: "/admin/applications", label: "Заявки", icon: Inbox },
  { href: "/admin/services", label: "Услуги", icon: Briefcase },
  { href: "/admin/specialists", label: "Специалисты", icon: Users2 },
  { href: "/admin/certificates", label: "Сертификаты", icon: Award },
  { href: "/admin/reviews", label: "Отзывы", icon: Star },
  { href: "/admin/faqs", label: "FAQ", icon: HelpCircle },
  { href: "/admin/blog", label: "Блог", icon: BookOpen },
  { href: "/admin/gallery", label: "Галерея", icon: ImageIcon },
  { href: "/admin/homepage", label: "Главная страница", icon: Sparkles },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Настройки", icon: Settings2 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/70 bg-background lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-border/70 px-5">
        <Link href="/admin" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full">
          <Logo tagline="админ" />
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                    active && "bg-primary-soft/60 text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-border/70 p-3 text-xs text-muted-foreground">
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 hover:text-foreground"
        >
          <Layers className="h-3.5 w-3.5" /> Открыть сайт
        </Link>
      </div>
    </aside>
  );
}
