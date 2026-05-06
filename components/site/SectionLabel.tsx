import { cn } from "@/lib/utils";

type Props = {
  number: string;       // "01", "02", "03"...
  children: React.ReactNode;
  className?: string;
};

/** Editorial section label: "01 ─ КОМУ ПОМОГАЕМ" */
export function SectionLabel({ number, children, className }: Props) {
  return (
    <div className={cn("flex items-baseline gap-3 text-xs font-semibold uppercase tracking-[0.22em]", className)}>
      <span className="font-mono text-primary">{number}</span>
      <span className="h-px w-8 bg-border" aria-hidden />
      <span className="text-muted-foreground">{children}</span>
    </div>
  );
}
