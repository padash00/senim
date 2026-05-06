import { ChevronRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

type Crumb = { href?: string; label: string };

type Props = {
  items: Crumb[];
  className?: string;
};

/**
 * Breadcrumbs with JSON-LD BreadcrumbList for Google rich snippets.
 * The last item is unlinked (current page).
 */
export function Breadcrumbs({ items, className }: Props) {
  if (items.length === 0) return null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: c.href || undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {items.map((c, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1.5">
            {c.href && !isLast ? (
              <Link href={c.href} className="hover:text-foreground transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-foreground")}>{c.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
          </span>
        );
      })}
    </nav>
  );
}
