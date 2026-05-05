import { cn } from "@/lib/utils";

export function Container({
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "default" | "narrow" | "wide" }) {
  return (
    <div
      className={cn(
        "container",
        size === "narrow" && "max-w-3xl",
        size === "wide" && "max-w-screen-2xl",
        className,
      )}
      {...props}
    />
  );
}
