import Image from "next/image";
import { User2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tField } from "@/lib/i18n/translated";
import type { Specialist } from "@/lib/supabase/database.types";
import type { Locale } from "@/lib/i18n/config";

export function SpecialistCard({ specialist, locale }: { specialist: Specialist; locale: Locale }) {
  const name = tField(specialist, "full_name", locale);
  const position = tField(specialist, "position", locale);
  const bio = tField(specialist, "bio", locale);

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-secondary">
        {specialist.photo_url ? (
          <Image
            src={specialist.photo_url}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <User2 className="h-16 w-16" />
          </div>
        )}
      </div>
      <CardContent className="space-y-3 p-6">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight tracking-tight">{name}</h3>
          {position && <p className="text-sm text-muted-foreground">{position}</p>}
        </div>
        {bio && <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{bio}</p>}
        <div className="flex flex-wrap gap-1.5">
          {specialist.experience_years != null && (
            <Badge variant="secondary">{specialist.experience_years}+ лет опыта</Badge>
          )}
          {(specialist.directions ?? []).slice(0, 3).map((dir) => (
            <Badge key={dir} variant="muted">
              {dir}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
