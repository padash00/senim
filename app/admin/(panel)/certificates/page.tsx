import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CertificateRowActions } from "./CertificateRowActions";

export const dynamic = "force-dynamic";

export default async function CertificatesIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("certificates")
    .select("id, title_ru, title_kk, image_url, issued_at, is_published, sort_order")
    .order("sort_order");

  return (
    <div>
      <PageHeader
        title="Сертификаты"
        actions={
          <Button asChild>
            <Link href="/admin/certificates/new"><Plus className="h-4 w-4" />Добавить</Link>
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Документ</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="relative h-12 w-16 overflow-hidden rounded-md bg-secondary">
                    {c.image_url && <Image src={c.image_url} alt="" fill sizes="64px" className="object-cover" />}
                  </span>
                  <span className="font-medium">{c.title_ru || c.title_kk}</span>
                </div>
              </TableCell>
              <TableCell>{c.issued_at ? new Date(c.issued_at).toLocaleDateString("ru-RU") : "—"}</TableCell>
              <TableCell><PublishedBadge value={c.is_published} /></TableCell>
              <TableCell><CertificateRowActions id={c.id} /></TableCell>
            </TableRow>
          ))}
          {(data ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-12 text-center text-sm text-muted-foreground">
                Нет сертификатов.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
