"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

const SHORTCUTS = [
  { keys: ["g", "h"], label: "На главную", path: "/" },
  { keys: ["g", "s"], label: "Услуги", path: "/services" },
  { keys: ["g", "p"], label: "Для родителей", path: "/parents" },
  { keys: ["g", "a"], label: "О центре", path: "/about" },
  { keys: ["g", "c"], label: "Контакты", path: "/contacts" },
  { keys: ["?"], label: "Показать / скрыть подсказки" },
] as const;

/**
 * Keyboard navigation:
 * - `?` toggles the cheatsheet overlay
 * - `g` then a letter (h/s/p/a/c) jumps to a page (Vim-style chord)
 * - `Esc` closes the overlay
 *
 * Disabled while focus is in an input/textarea so we don't hijack typing.
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastG = 0;

    function isTyping(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || target.isContentEditable;
    }

    function onKey(e: KeyboardEvent) {
      if (isTyping(e.target)) return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        if (open) setOpen(false);
        return;
      }

      // Vim-style g + letter
      const now = Date.now();
      if (e.key === "g") {
        lastG = now;
        return;
      }
      if (now - lastG < 800) {
        const map: Record<string, string> = { h: "/", s: "/services", p: "/parents", a: "/about", c: "/contacts" };
        const dest = map[e.key];
        if (dest) {
          e.preventDefault();
          router.push(dest);
          lastG = 0;
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, router]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="m-4 w-full max-w-sm rounded-2xl border border-border/70 bg-card p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold">Горячие клавиши</h2>
        <p className="mt-1 text-xs text-muted-foreground">Vim-style chord. Esc чтобы закрыть.</p>
        <ul className="mt-4 space-y-2 text-sm">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-4">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className={cn(
                      "rounded border border-border/70 bg-secondary px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-foreground",
                    )}
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
