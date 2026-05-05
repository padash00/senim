import Link from "next/link";
import Image from "next/image";
import { Plus, User2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { PublishedBadge } from "@/components/admin/PublishedBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SpecialistRowActions } from "./SpecialistRowActions";

export const dynamic = "force-dynamic";

export default async function SpecialistsIndex() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("specialists")
    .select("id, full_name_kk, full_name_ru, position_ru, position_kk, photo_url, experience_years, is_published, sort_order")
    .order("sort_order");

  return (
    <div>
      <PageHeader
        title="Специалисты"
        actions={
          <Button asChild>
            <Link href="/admin/specialists/new"><Plus className="h-4 w-4" />Добавить</Link>
          </Button>
        }
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Специалист</TableHead>
            <TableHead>Должность</TableHead>
            <TableHead>Опыт</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(data ?? []).map((sp) => (
            <TableRow key={sp.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <span className="relative h-10 w-10 overflow-hidden rounded-full bg-secondary">
                    {sp.photo_url ? (
                      <Image src={sp.photo_url} alt="" fill sizes="40px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <User2 className="h-4 w-4" />
                      </span>
                    )}
                  </span>
                  <span className="font-medium">{sp.full_name_ru || sp.full_name_kk}</span>
                </div>
              </TableCell>
              <TableCell>{sp.position_ru || sp.position_kk || "—"}</TableCell>
              <TableCell>{sp.experience_years ?? "—"}</TableCell>
              <TableCell><PublishedBadge value={sp.is_published} /></TableCell>
              <TableCell><SpecialistRowActions id={sp.id} /></TableCell>
            </TableRow>
          ))}
          {(data ?? []).length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                Список пуст.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
