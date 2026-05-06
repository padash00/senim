"use client";

import { useEffect, useState } from "react";
import { MessageCircle, MessageSquare, Phone } from "lucide-react";
import { formatPhoneHref, formatWhatsAppHref, cn } from "@/lib/utils";

type Props = {
  phone: string | null | undefined;
  whatsapp: string | null | undefined;
};

/**
 * Mobile-only sticky bar pinned to the bottom of the viewport.
 * Two big tap-targets: call + WhatsApp. Appears after the user scrolls
 * past the hero (~400px). Auto-hides on pages that already render an
 * application form (CSS rule in globals.css does that part).
 */
export function MobileStickyCta({ phone, whatsapp }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!phone && !whatsapp) return null;

  return (
    <div
      data-mobile-cta
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-2xl border border-border/70 bg-background/95 p-2 shadow-card backdrop-blur md:hidden",
        "transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {phone && (
        <a
          href={formatPhoneHref(phone)}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground active:scale-95"
        >
          <Phone className="h-4 w-4" />
          Қоңырау
        </a>
      )}
      {whatsapp && (
        <a
          href={formatWhatsAppHref(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success px-4 py-3 text-sm font-semibold text-success-foreground active:scale-95"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      )}
      {phone && (
        <a
          href={`sms:${phone.replace(/\s+/g, "")}?body=${encodeURIComponent("Здравствуйте, я хочу записаться в центр Сенім")}`}
          aria-label="SMS"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-background text-foreground active:scale-95"
        >
          <MessageSquare className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
