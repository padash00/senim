import { cn } from "@/lib/utils";

type Props = {
  /** Color of the upper section that slopes down. */
  fillVar?: string; // CSS variable, e.g. 'background', 'card', 'secondary', 'primary-soft'
  /** Wave or straight slope. */
  variant?: "slope" | "wave";
  /** Flip vertical so it works between two stacked sections. */
  flip?: boolean;
  className?: string;
};

/**
 * SVG section divider — a sloped or wavy edge between two background colours.
 * Place it between two `<section>` blocks: the divider takes the colour of
 * the section ABOVE it.
 */
export function SectionDiagonal({ fillVar = "background", variant = "slope", flip = false, className }: Props) {
  const path =
    variant === "wave"
      ? "M0,40 Q360,80 720,40 T1440,40 L1440,0 L0,0 Z"
      : "M0,0 L1440,0 L1440,30 L0,80 Z";

  return (
    <div className={cn("pointer-events-none -mt-px", className)} aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className={cn("block h-12 w-full md:h-20", flip && "scale-y-[-1]")}
      >
        <path d={path} fill={`hsl(var(--${fillVar}))`} />
      </svg>
    </div>
  );
}
