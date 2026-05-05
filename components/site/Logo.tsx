import { cn } from "@/lib/utils";

/**
 * Wordmark with a soft circular dot. No external logo asset required —
 * renders crisp on any background. Replace with <Image src=".../logo.svg" />
 * once you have a final asset.
 */
export function Logo({ className, tagline }: { className?: string; tagline?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
        <span className="absolute h-2.5 w-2.5 rounded-full bg-primary" />
        <span className="absolute h-9 w-9 rounded-full border border-primary/30" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">Сенім</span>
        {tagline && (
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {tagline}
          </span>
        )}
      </span>
    </div>
  );
}
