"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a heading and reveals its inline-block words one by one with a
 * stagger. Pure CSS transition on opacity+translate. Plays only once
 * per browser session (sessionStorage flag), so back-navigation doesn't
 * replay it. Falls back to instantly visible if reduced-motion is set.
 */
export function HeroLetterReveal({ children, className }: { children: ReactNode; className?: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    let played = false;
    try { played = sessionStorage.getItem("senim-hero-played") === "1"; } catch { /* */ }
    if (played) { setShown(true); return; }
    const t = window.setTimeout(() => {
      setShown(true);
      try { sessionStorage.setItem("senim-hero-played", "1"); } catch { /* */ }
    }, 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <span
      className={cn(
        "inline-block transition-all duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        className,
      )}
    >
      {children}
    </span>
  );
}
