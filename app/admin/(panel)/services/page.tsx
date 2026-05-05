import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServiceRowActions } from "./ServiceRowActions";

export const dynamic = "force-dynamic";

export default async function ServicesIndex() {
  const supabase = await createSupabaseServerClient();
  const { data: services } = await supabase
    .from("services")
    .select("id, slug, title_kk, title_ru, age_range, price, is_published, sort_order")
    .order("sort_order");

  return (
    <div>
      <PageHeader
        title="Услуги"
        description="Управление каталогом программ"
        actions={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus className="h-4 w-4" />
              Добавить услугу
            </Link>
          </Button>
        }
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Возраст</TableHead>
            <TableHead>Цена</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(services ?? []).map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium">{s.title_ru || s.title_kk}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{s.slug}</TableCell>
              <TableCell>{s.age_range ?? "—"}</TableCell>
              <TableCell>{s.price ? `${s.price.toLocaleString()} ₸` : "—"}</TableCell>
              <TableCell><PublishedBadge value={s.is_published} /></TableCell>
              <TableCell>
                <ServiceRowActions id={s.id} />
              </TableCell>
            </TableRow>
          ))}
          {(services ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                Услуг пока нет.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
