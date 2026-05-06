"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Final value displayed (e.g. "8+", "11", "3"). */
  value: string;
  /** Animation duration in ms. Default 1400. */
  duration?: number;
  className?: string;
};

/**
 * Counts up from 0 to the numeric portion of `value` when the element
 * scrolls into view. The non-numeric suffix ("+") stays appended.
 */
export function AnimatedNumber({ value, duration = 1400, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const target = parseInt(value.replace(/\D/g, ""), 10);
    if (!Number.isFinite(target)) return;
    if (played) return;
    const node = ref.current;
    if (!node) return;

    const suffix = value.replace(/[\d]/g, "");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || played) continue;
          setPlayed(true);
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round(target * eased);
            setDisplay(current + suffix);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, played]);

  return (
    <span ref={ref} className={className} aria-label={value}>
      {display}
    </span>
  );
}
