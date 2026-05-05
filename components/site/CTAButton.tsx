import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";

type Props = Omit<ButtonProps, "asChild"> & {
  href: string;
  showArrow?: boolean;
  external?: boolean;
};

export function CTAButton({
  href,
  showArrow = false,
  external = false,
  children,
  ...buttonProps
}: Props) {
  if (external) {
    return (
      <Button asChild {...buttonProps}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
          {showArrow && <ArrowRight />}
        </a>
      </Button>
    );
  }
  return (
    <Button asChild {...buttonProps}>
      <Link href={href}>
        {children}
        {showArrow && <ArrowRight />}
      </Link>
    </Button>
  );
}
