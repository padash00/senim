import { cn } from "@/lib/utils";

/**
 * Brand mark — circular monogram with the letter «С» and an orbiting dot.
 * Pure SVG, scalable, theme-aware. Replace with custom asset later.
 */
export function Logo({ className, tagline }: { className?: string; tagline?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-10 w-10 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden>
          {/* outer halo */}
          <circle cx="20" cy="20" r="19" fill="hsl(var(--primary-soft))" />
          {/* inner ring */}
          <circle cx="20" cy="20" r="14" fill="none" stroke="hsl(var(--primary) / 0.35)" strokeWidth="1" strokeDasharray="2 3" />
          {/* monogram letter */}
          <text
            x="20"
            y="27"
            textAnchor="middle"
            fontFamily="var(--font-display), sans-serif"
            fontSize="20"
            fontWeight="700"
            fill="hsl(var(--primary))"
          >
            С
          </text>
          {/* orbiting dot */}
          <circle cx="33" cy="14" r="2.5" fill="hsl(var(--accent-foreground))" opacity="0.85" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold tracking-tight text-foreground">Сенім</span>
        {tagline && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {tagline}
          </span>
        )}
      </span>
    </div>
  );
}
