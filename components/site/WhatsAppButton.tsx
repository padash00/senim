import { MessageCircle } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn, formatWhatsAppHref } from "@/lib/utils";

type Props = Omit<ButtonProps, "asChild"> & {
  phone: string | null | undefined;
  message?: string;
  label?: string;
  hideLabelOnMobile?: boolean;
};

export function WhatsAppButton({
  phone,
  message,
  label = "WhatsApp",
  className,
  variant = "success",
  size,
  hideLabelOnMobile,
  ...props
}: Props) {
  if (!phone) return null;
  const href = formatWhatsAppHref(phone, message);
  return (
    <Button asChild variant={variant} size={size} className={cn(className)} {...props}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle />
        <span className={cn(hideLabelOnMobile && "hidden sm:inline")}>{label}</span>
      </a>
    </Button>
  );
}

export function WhatsAppFloating({
  phone,
  message,
  label,
}: {
  phone: string | null | undefined;
  message?: string;
  label: string;
}) {
  if (!phone) return null;
  return (
    <a
      href={formatWhatsAppHref(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-floating-wa
      className={cn(
        "fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-success text-success-foreground shadow-card",
        "transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
