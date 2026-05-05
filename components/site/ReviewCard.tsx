import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { tField } from "@/lib/i18n/translated";
import type { Review } from "@/lib/supabase/database.types";
import type { Locale } from "@/lib/i18n/config";

export function ReviewCard({ review, locale }: { review: Review; locale: Locale }) {
  const text = tField(review, "text", locale);
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <Quote className="h-6 w-6 text-primary/50" aria-hidden />
        {text && <p className="flex-1 text-sm leading-relaxed text-foreground">{text}</p>}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{review.parent_name}</span>
          {review.rating != null && (
            <span className="flex items-center gap-0.5 text-warning">
              {Array.from({ length: review.rating }, (_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
