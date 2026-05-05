"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, TextareaField } from "@/components/admin/FormFields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { updateApplication, deleteApplication } from "../actions";
import type { ActionResult } from "@/lib/admin/forms";
import type { ApplicationStatus } from "@/lib/supabase/database.types";

const STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В обработке" },
  { value: "contacted", label: "Связались" },
  { value: "scheduled", label: "Записан" },
  { value: "closed", label: "Закрыта" },
];

export function ApplicationEditForm({
  id,
  status,
  adminNote,
}: {
  id: string;
  status: ApplicationStatus;
  adminNote: string | null;
}) {
  const router = useRouter();
  const action = updateApplication.bind(null, id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Сохранено");
      router.refresh();
    } else toast.error(state.error);
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление заявкой</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="grid gap-5">
          <Field label="Статус">
            <Select name="status" defaultValue={status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <TextareaField name="admin_note" label="Заметка администратора" defaultValue={adminNote} rows={4} />
          <div className="flex flex-wrap items-center gap-3">
            <SubmitButton>Сохранить</SubmitButton>
            <Button
              type="button"
              variant="outline"
              className="text-destructive hover:bg-destructive/10"
              onClick={async () => {
                if (!confirm("Удалить заявку?")) return;
                const res = await deleteApplication(id);
                if (res.ok) {
                  toast.success("Удалено");
                  router.push("/admin/applications");
                } else toast.error(res.error);
              }}
            >
              Удалить
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
