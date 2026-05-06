import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Diameter in px. Default 160. */
  size?: number;
};

/**
 * Round seal/stamp with text along the circular path. Good as a trust
 * element in /about or footer. Pure SVG, no fonts loaded.
 */
export function Stamp({ className, size = 160 }: Props) {
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={cn("text-primary", className)}
      aria-hidden
    >
      <defs>
        <path id="stamp-circle" d="M 80,80 m -56,0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0" />
      </defs>
      <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
      <circle cx="80" cy="80" r="62" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1" />
      <text className="fill-current text-[11px] font-semibold uppercase tracking-[0.3em]">
        <textPath href="#stamp-circle" startOffset="0">
          СЕНІМ · ШЫМКЕНТ · ШЫМКЕНТ ·
        </textPath>
      </text>
      {/* Center monogram */}
      <text
        x="80"
        y="86"
        textAnchor="middle"
        className="fill-current font-display text-[28px] font-bold"
      >
        С
      </text>
      <text
        x="80"
        y="106"
        textAnchor="middle"
        className="fill-current text-[8px] uppercase tracking-[0.2em] opacity-70"
      >
        с 2018
      </text>
    </svg>
  );
}
