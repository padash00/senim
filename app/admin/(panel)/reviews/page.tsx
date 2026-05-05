import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReviewRowActions } from "./ReviewRowActions";

export const dynamic = "force-dynamic";

export default async function ReviewsIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, parent_name, rating, text_ru, text_kk, language, reviewed_at, is_published, is_featured")
    .order("reviewed_at", { ascending: false, nullsFirst: false });

  return (
    <div>
      <PageHeader
        title="Отзывы"
        actions={
          <Button asChild>
            <Link href="/admin/reviews/new"><Plus className="h-4 w-4" />Добавить</Link>
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Родитель</TableHead>
            <TableHead>Оценка</TableHead>
            <TableHead>Текст</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.parent_name}</span>
                  {r.is_featured && <Badge variant="warning">★</Badge>}
                </div>
              </TableCell>
              <TableCell>
                {r.rating ? (
                  <span className="flex gap-0.5 text-warning">
                    {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </span>
                ) : "—"}
              </TableCell>
              <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                {r.text_ru || r.text_kk}
              </TableCell>
              <TableCell>{r.reviewed_at ? new Date(r.reviewed_at).toLocaleDateString("ru-RU") : "—"}</TableCell>
              <TableCell><PublishedBadge value={r.is_published} /></TableCell>
              <TableCell><ReviewRowActions id={r.id} /></TableCell>
            </TableRow>
          ))}
          {(data ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                Отзывов пока нет.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
