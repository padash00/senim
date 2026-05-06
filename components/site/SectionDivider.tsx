import { cn } from "@/lib/utils";

/** Editorial-style section break: thin line + centred ornament. */
export function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={cn("container flex items-center gap-6 py-2 text-accent-foreground/40", className)} aria-hidden>
      <span className="h-px flex-1 bg-border" />
      <span className="text-sm tracking-widest">✦</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
