"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Max pixels to translate. Default 8. */
  strength?: number;
  /** Activation distance in px from the element bounds. Default 40. */
  range?: number;
  className?: string;
};

/**
 * Wrapper that gently pulls its child toward the cursor when nearby.
 * Disabled on touch and reduced-motion. Pure DOM transforms — no rerenders.
 */
export function Magnetic({ children, strength = 8, range = 40, className }: Props) {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = wrap.firstElementChild as HTMLElement | null;
    if (!target) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = Math.max(rect.width, rect.height) / 2 + range;
      if (dist > max) {
        tx = 0;
        ty = 0;
      } else {
        const factor = (1 - dist / max) * strength;
        tx = (dx / dist) * factor;
        ty = (dy / dist) * factor;
      }
      if (!raf) {
        raf = requestAnimationFrame(apply);
      }
    };

    const apply = () => {
      raf = 0;
      target.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
    };

    const onLeave = () => {
      tx = 0;
      ty = 0;
      target.style.transform = "translate(0, 0)";
    };

    window.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength, range]);

  return (
    <span ref={wrapRef} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}
