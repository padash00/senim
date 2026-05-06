import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Magnetic } from "./Magnetic";

type Props = Omit<ButtonProps, "asChild"> & {
  href: string;
  showArrow?: boolean;
  external?: boolean;
  /** Disable the magnetic hover effect (e.g. inside dense grids). */
  noMagnetic?: boolean;
};

export function CTAButton({
  href,
  showArrow = false,
  external = false,
  noMagnetic = false,
  children,
  ...buttonProps
}: Props) {
  const inner = external ? (
    <Button asChild {...buttonProps}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        {showArrow && <ArrowRight />}
      </a>
    </Button>
  ) : (
    <Button asChild {...buttonProps}>
      <Link href={href}>
        {children}
        {showArrow && <ArrowRight />}
      </Link>
    </Button>
  );

  if (noMagnetic) return inner;
  return <Magnetic>{inner}</Magnetic>;
}
