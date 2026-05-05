"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { tField } from "@/lib/i18n/translated";
import type { Faq } from "@/lib/supabase/database.types";
import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function FaqAccordion({ items, locale }: { items: Faq[]; locale: Locale }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="divide-y divide-border/70 rounded-2xl border border-border/70 bg-card">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const q = tField(item, "question", locale);
        const a = tField(item, "answer", locale);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-base font-medium hover:bg-secondary/40"
            >
              <span>{q}</span>
              <ChevronDown
                className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && a && (
              <div className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
