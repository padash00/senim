import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FaqRowActions } from "./FaqRowActions";

export const dynamic = "force-dynamic";

export default async function FaqsIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question_ru, question_kk, category, is_published, sort_order")
    .order("sort_order");
  return (
    <div>
      <PageHeader title="FAQ" actions={
        <Button asChild><Link href="/admin/faqs/new"><Plus className="h-4 w-4" />Добавить</Link></Button>
      } />
      <Table>
        <TableHeader><TableRow>
          <TableHead>Вопрос</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead></TableHead>
        </TableRow></TableHeader>
        <TableBody>
          {(data ?? []).map((f) => (
            <TableRow key={f.id}>
              <TableCell className="font-medium">{f.question_ru || f.question_kk}</TableCell>
              <TableCell>{f.category ?? "—"}</TableCell>
              <TableCell><PublishedBadge value={f.is_published} /></TableCell>
              <TableCell><FaqRowActions id={f.id} /></TableCell>
            </TableRow>
          ))}
          {(data ?? []).length === 0 && (
            <TableRow><TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">Нет вопросов.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
