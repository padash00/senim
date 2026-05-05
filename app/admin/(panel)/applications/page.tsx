import Link from "next/link";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

export const dynamic = "force-dynamic";

const STATUS_FILTERS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "in_progress", label: "В обработке" },
  { value: "contacted", label: "Связались" },
  { value: "scheduled", label: "Записан" },
  { value: "closed", label: "Закрытые" },
];

export default async function ApplicationsIndex({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("applications")
    .select("id, parent_name, phone, child_age, status, source, created_at, comment")
    .order("created_at", { ascending: false })
    .limit(200);
  if (status && status !== "all") query = query.eq("status", status);
  if (q) query = query.or(`parent_name.ilike.%${q}%,phone.ilike.%${q}%,comment.ilike.%${q}%`);

  const { data: rows } = await query;

  return (
    <div>
      <PageHeader
        title="Заявки"
        description="Все заявки с сайта и формы контактов"
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/applications/export">
              <Download className="h-4 w-4" /> Экспорт CSV
            </Link>
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <form className="flex flex-1 gap-2" action="/admin/applications">
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Поиск по имени, телефону, комментарию"
            className="h-10 flex-1 rounded-xl border border-input bg-background px-4 text-sm"
          />
          <Button type="submit" variant="outline">Найти</Button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = (status ?? "all") === f.value;
          return (
            <Link
              key={f.value}
              href={`/admin/applications${f.value === "all" ? "" : `?status=${f.value}`}`}
              className={
                "rounded-full border px-3 py-1.5 text-xs font-medium " +
                (active ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground hover:bg-secondary")
              }
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Возраст</TableHead>
            <TableHead>Источник</TableHead>
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(rows ?? []).map((row) => (
            <TableRow key={row.id} className="cursor-pointer">
              <TableCell>
                <Link href={`/admin/applications/${row.id}`} className="block text-xs text-muted-foreground hover:text-foreground">
                  {new Date(row.created_at).toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/applications/${row.id}`} className="font-medium">{row.parent_name}</Link>
              </TableCell>
              <TableCell>
                <a href={`tel:${row.phone}`} className="hover:text-primary">{row.phone}</a>
              </TableCell>
              <TableCell>{row.child_age ?? "—"}</TableCell>
              <TableCell>
                {row.source ? <Badge variant="muted">{row.source}</Badge> : "—"}
              </TableCell>
              <TableCell><StatusBadge status={row.status} /></TableCell>
            </TableRow>
          ))}
          {(rows ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                Заявок не найдено.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
