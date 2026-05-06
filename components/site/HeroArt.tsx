import { cn } from "@/lib/utils";

/**
 * Inline SVG hero illustration — warm abstract composition with universal
 * symbols of childhood (house, ball, book, heart, star, sun). No real
 * children's faces (per ТЗ). All colours come from CSS variables so the
 * art adapts to the active theme.
 */
export function HeroArt({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto aspect-square w-full max-w-[520px]", className)}>
      <svg
        viewBox="0 0 520 520"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Сенім — развивающее пространство"
      >
        {/* Soft outer halo — peach */}
        <circle cx="260" cy="260" r="240" fill="hsl(var(--accent) / 0.55)" />

        {/* Warm cream stage — main composition surface */}
        <circle cx="260" cy="265" r="190" fill="hsl(var(--background))" />

        {/* Sun in the upper-right (gradient-warm) */}
        <defs>
          <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity="0.95" />
            <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bookGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent-foreground))" />
          </linearGradient>
          <linearGradient id="houseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
          </linearGradient>
        </defs>

        {/* Sun glow */}
        <circle cx="395" cy="135" r="55" fill="url(#sun)" />
        <circle cx="395" cy="135" r="22" fill="hsl(var(--warning))" opacity="0.85" />

        {/* Soft cloud upper-left */}
        <g opacity="0.85">
          <ellipse cx="135" cy="155" rx="42" ry="20" fill="hsl(var(--card))" />
          <ellipse cx="115" cy="170" rx="30" ry="16" fill="hsl(var(--card))" />
          <ellipse cx="160" cy="170" rx="28" ry="14" fill="hsl(var(--card))" />
        </g>

        {/* Plant — bottom left (signals "growth") */}
        <g transform="translate(110 350)">
          <rect x="-3" y="0" width="6" height="60" rx="2" fill="hsl(var(--success))" />
          <ellipse cx="-18" cy="22" rx="22" ry="12" transform="rotate(-30 -18 22)" fill="hsl(var(--success) / 0.9)" />
          <ellipse cx="18" cy="14" rx="22" ry="12" transform="rotate(28 18 14)" fill="hsl(var(--success) / 0.9)" />
          <ellipse cx="-10" cy="-8" rx="18" ry="10" transform="rotate(-15 -10 -8)" fill="hsl(var(--success))" />
        </g>

        {/* House — centre-left (home / safety) */}
        <g transform="translate(190 250)">
          <polygon points="0,-50 -55,0 55,0" fill="url(#houseGrad)" />
          <rect x="-50" y="0" width="100" height="65" rx="6" fill="hsl(var(--primary) / 0.92)" />
          <rect x="-12" y="22" width="24" height="43" rx="3" fill="hsl(var(--background))" />
          <rect x="-38" y="14" width="18" height="18" rx="2" fill="hsl(var(--accent))" />
          <rect x="20" y="14" width="18" height="18" rx="2" fill="hsl(var(--accent))" />
        </g>

        {/* Ball — centre-right (play) */}
        <g transform="translate(355 295)">
          <circle r="46" fill="hsl(var(--accent))" />
          <path
            d="M -46 0 Q -23 -28 0 0 Q 23 28 46 0"
            stroke="hsl(var(--accent-foreground) / 0.45)"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M 0 -46 Q 28 -23 0 0 Q -28 23 0 46"
            stroke="hsl(var(--accent-foreground) / 0.45)"
            strokeWidth="2.5"
            fill="none"
          />
        </g>

        {/* Book — bottom-centre (learning) */}
        <g transform="translate(245 380)">
          <rect x="-50" y="-32" width="100" height="64" rx="6" fill="url(#bookGrad)" />
          <line x1="0" y1="-32" x2="0" y2="32" stroke="hsl(var(--background) / 0.7)" strokeWidth="2" />
          <line x1="-32" y1="-12" x2="-8" y2="-12" stroke="hsl(var(--background) / 0.85)" strokeWidth="2" strokeLinecap="round" />
          <line x1="-32" y1="-2" x2="-8" y2="-2" stroke="hsl(var(--background) / 0.85)" strokeWidth="2" strokeLinecap="round" />
          <line x1="-32" y1="8" x2="-14" y2="8" stroke="hsl(var(--background) / 0.7)" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="-12" x2="32" y2="-12" stroke="hsl(var(--background) / 0.85)" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="-2" x2="32" y2="-2" stroke="hsl(var(--background) / 0.85)" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="8" x2="26" y2="8" stroke="hsl(var(--background) / 0.7)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Heart — floating top centre (care) */}
        <g transform="translate(290 105)">
          <path
            d="M0 14 C -22 -6 -22 -28 -8 -28 C -2 -28 0 -22 0 -16 C 0 -22 2 -28 8 -28 C 22 -28 22 -6 0 14 Z"
            fill="hsl(var(--success))"
            opacity="0.9"
          />
        </g>

        {/* Star — bottom-right (achievement) */}
        <g transform="translate(420 415)">
          <polygon
            points="0,-22 6,-7 22,-5 10,5 13,21 0,13 -13,21 -10,5 -22,-5 -6,-7"
            fill="hsl(var(--warning))"
          />
        </g>

        {/* Tiny floating dots */}
        <circle cx="80" cy="280" r="4" fill="hsl(var(--primary) / 0.6)" />
        <circle cx="450" cy="220" r="3" fill="hsl(var(--accent-foreground) / 0.5)" />
        <circle cx="170" cy="430" r="3.5" fill="hsl(var(--success) / 0.7)" />
        <circle cx="320" cy="200" r="2.5" fill="hsl(var(--warning))" />
      </svg>

      {/* Floating reassurance chip — keeps the personal touch from the
          previous design alive on top of the new illustration. */}
      <div className="absolute -left-2 bottom-8 max-w-[230px] rounded-2xl border border-border/60 bg-background/95 px-4 py-3 shadow-card backdrop-blur lg:-left-6">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Шымкент</p>
        <p className="font-display text-base font-semibold leading-tight">8+ жыл тәжірибе</p>
      </div>
    </div>
  );
}
