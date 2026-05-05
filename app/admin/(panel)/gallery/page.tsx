import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Badge } from "@/components/ui/badge";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { GalleryRowActions } from "./GalleryRowActions";

export const dynamic = "force-dynamic";

export default async function GalleryIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gallery_items")
    .select("id, image_url, caption_ru, caption_kk, category, is_published, sort_order")
    .order("sort_order");

  return (
    <div>
      <PageHeader
        title="Галерея"
        actions={<Button asChild><Link href="/admin/gallery/new"><Plus className="h-4 w-4" />Добавить</Link></Button>}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {(data ?? []).map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="relative aspect-square">
              <Image src={g.image_url} alt="" fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
            </div>
            <div className="space-y-1 p-3 text-xs">
              <p className="line-clamp-1 font-medium">{g.caption_ru || g.caption_kk || "—"}</p>
              <div className="flex items-center justify-between">
                {g.category && <Badge variant="muted">{g.category}</Badge>}
                <PublishedBadge value={g.is_published} />
              </div>
            </div>
            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
              <GalleryRowActions id={g.id} />
            </div>
          </div>
        ))}
      </div>
      {(data ?? []).length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">Галерея пуста.</p>
      )}
    </div>
  );
}
