import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BlogRowActions } from "./BlogRowActions";

export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title_ru, title_kk, is_published, published_at, updated_at")
    .order("published_at", { ascending: false, nullsFirst: false });

  return (
    <div>
      <PageHeader
        title="Блог"
        actions={<Button asChild><Link href="/admin/blog/new"><Plus className="h-4 w-4" />Новая статья</Link></Button>}
      />
      <Table>
        <TableHeader><TableRow>
          <TableHead>Заголовок</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Опубликовано</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead></TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {(data ?? []).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.title_ru || p.title_kk}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{p.slug}</TableCell>
              <TableCell>{p.published_at ? new Date(p.published_at).toLocaleDateString("ru-RU") : "—"}</TableCell>
              <TableCell><PublishedBadge value={p.is_published} /></TableCell>
              <TableCell><BlogRowActions id={p.id} /></TableCell>
            </TableRow>
          ))}
          {(data ?? []).length === 0 && (
            <TableRow><TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">Статей пока нет.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
