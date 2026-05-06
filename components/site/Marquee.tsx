import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  className?: string;
};

/**
 * Infinite horizontal marquee. Pure CSS animation, content is duplicated
 * twice so the loop is seamless. Auto-pauses on hover and on
 * prefers-reduced-motion (handled in globals.css).
 */
export function Marquee({ items, className }: Props) {
  if (items.length === 0) return null;
  return (
    <div className={cn("relative overflow-hidden border-y border-border/50 bg-card/40 py-4", className)} role="presentation">
      <div className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-10">
            <span>{item}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-accent-foreground/30" />
          </span>
        ))}
      </div>
    </div>
  );
}
