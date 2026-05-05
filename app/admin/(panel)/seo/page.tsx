import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SeoRowActions } from "./SeoRowActions";

export const dynamic = "force-dynamic";

export default async function SeoIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("pages_seo").select("id, path, meta_title_ru, meta_title_kk").order("path");
  return (
    <div>
      <PageHeader
        title="SEO для страниц"
        description="Per-page meta-теги, OG, canonical, keywords"
        actions={<Button asChild><Link href="/admin/seo/new"><Plus className="h-4 w-4" />Добавить</Link></Button>}
      />
      <Table>
        <TableHeader><TableRow>
          <TableHead>Путь</TableHead>
          <TableHead>Meta title</TableHead>
          <TableHead></TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {(data ?? []).map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-mono text-xs">{s.path}</TableCell>
              <TableCell>{s.meta_title_ru || s.meta_title_kk || "—"}</TableCell>
              <TableCell><SeoRowActions id={s.id} /></TableCell>
            </TableRow>
          ))}
          {(data ?? []).length === 0 && (
            <TableRow><TableCell colSpan={3} className="py-12 text-center text-sm text-muted-foreground">Нет настроек SEO.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
