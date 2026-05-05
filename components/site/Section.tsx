import { cn } from "@/lib/utils";

export function Section({
  className,
  bleed = "default",
  ...props
}: React.HTMLAttributes<HTMLElement> & { bleed?: "default" | "muted" | "primary-soft" }) {
  return (
    <section
      className={cn(
        "py-16 md:py-24",
        bleed === "muted" && "bg-muted/40",
        bleed === "primary-soft" && "bg-primary-soft/40",
        className,
      )}
      {...props}
    />
  );
}
