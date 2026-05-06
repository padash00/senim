import { cn } from "@/lib/utils";

type Props = {
  word: string;
  hint?: string;
  className?: string;
};

/**
 * Single word in the audience manifesto. On hover (desktop) or focus,
 * shows a tiny popover with concrete examples — so a parent skimming
 * the page recognises their situation in one second.
 */
export function AudienceWord({ word, hint, className }: Props) {
  return (
    <span className={cn("group relative inline-block", className)} tabIndex={hint ? 0 : -1}>
      <span className="cursor-default text-foreground transition-colors duration-300 group-hover:text-primary group-focus:text-primary">
        {word}
      </span>
      {hint && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-max max-w-[260px] -translate-x-1/2",
            "rounded-xl border border-border/70 bg-popover px-3 py-2 text-left text-xs font-normal leading-snug text-popover-foreground shadow-card",
            "opacity-0 transition-opacity duration-200",
            "group-hover:opacity-100 group-focus:opacity-100",
          )}
        >
          {hint}
        </span>
      )}
    </span>
  );
}
