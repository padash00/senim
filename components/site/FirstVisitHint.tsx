"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

const KEY = "senim-hint-seen";

/**
 * Tiny "swipe down to see more" hint shown to first-time mobile visitors.
 * Disappears as soon as the user scrolls past 100px or after 6 seconds.
 * Persists in sessionStorage so it shows once per session.
 */
export function FirstVisitHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: fine)").matches) return; // desktop — skip
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === "1"; } catch { /* ignore */ }
    if (seen) return;

    setShow(true);
    const timeout = window.setTimeout(() => hide(), 6000);
    const onScroll = () => {
      if (window.scrollY > 100) hide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    function hide() {
      setShow(false);
      try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    }

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!show) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-32 left-1/2 z-30 -translate-x-1/2 rounded-full bg-foreground/90 px-4 py-2 text-xs text-background opacity-0 shadow-card animate-fade-in md:hidden"
      style={{ animation: "reveal-fade 400ms 200ms ease-out forwards, reveal-fade 400ms 5500ms ease-out reverse forwards" }}
    >
      <span className="inline-flex items-center gap-2">
        Свайпните вниз
        <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
      </span>
    </div>
  );
}
