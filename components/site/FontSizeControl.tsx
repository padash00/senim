"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const KEY = "senim-font-scale";
const SIZES = [
  { label: "A", scale: 1 },
  { label: "A+", scale: 1.125 },
  { label: "A++", scale: 1.25 },
] as const;

/**
 * Three-step font size control. Adjusts the root font-size — every rem-based
 * size in the design follows. Persisted in localStorage. Bootstrapped before
 * paint via inline script in app/layout.tsx (added separately).
 */
export function FontSizeControl({ className }: { className?: string }) {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    try {
      const saved = parseFloat(localStorage.getItem(KEY) ?? "1");
      if (Number.isFinite(saved)) {
        setScale(saved);
        document.documentElement.style.fontSize = `${saved * 100}%`;
      }
    } catch {
      /* ignore */
    }
  }, []);

  function apply(s: number) {
    setScale(s);
    document.documentElement.style.fontSize = `${s * 100}%`;
    try { localStorage.setItem(KEY, String(s)); } catch { /* ignore */ }
  }

  return (
    <div
      role="group"
      aria-label="Размер шрифта"
      className={cn("inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-background p-0.5 text-xs", className)}
    >
      {SIZES.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => apply(s.scale)}
          aria-pressed={Math.abs(scale - s.scale) < 0.01}
          className={cn(
            "rounded-full px-2 py-1 font-semibold transition-colors",
            Math.abs(scale - s.scale) < 0.01
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
