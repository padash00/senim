"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Field, TextField, TranslatedField } from "@/components/admin/FormFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Certificate, Specialist } from "@/lib/supabase/database.types";
import { createCertificate, updateCertificate } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

type Props = { certificate: Certificate | null; specialists: Pick<Specialist, "id" | "full_name_ru" | "full_name_kk">[] };

export function CertificateForm({ certificate, specialists }: Props) {
  const router = useRouter();
  const action = certificate
    ? (updateCertificate.bind(null, certificate.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createCertificate;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Сохранено");
      router.refresh();
    } else toast.error(state.error);
  }, [state, router]);

  return (
    <form action={dispatch} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <TranslatedField
            baseName="title"
            label="Название"
            required
            defaults={{ kk: certificate?.title_kk, ru: certificate?.title_ru, en: certificate?.title_en }}
          />
          <TranslatedField
            baseName="description"
            label="Описание"
            textarea
            defaults={{ kk: certificate?.description_kk, ru: certificate?.description_ru, en: certificate?.description_en }}
          />
          <Field label="Изображение">
            <ImageUpload name="image_url" defaultUrl={certificate?.image_url} folder="certificates" />
          </Field>
          <TextField name="pdf_url" label="PDF (URL)" defaultValue={certificate?.pdf_url} hint="Загрузите PDF в Storage и вставьте публичный URL" />
          <div className="grid gap-6 md:grid-cols-3">
            <TextField name="issued_at" type="date" label="Дата выдачи" defaultValue={certificate?.issued_at} />
            <Field label="Специалист">
              <Select name="specialist_id" defaultValue={certificate?.specialist_id ?? "_"}>
                <SelectTrigger>
                  <SelectValue placeholder="Без привязки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_">Без привязки</SelectItem>
                  {specialists.map((sp) => (
                    <SelectItem key={sp.id} value={sp.id}>{sp.full_name_ru || sp.full_name_kk}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <TextField name="sort_order" type="number" label="Порядок" defaultValue={certificate?.sort_order ?? 0} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="is_published" name="is_published" defaultChecked={certificate?.is_published ?? true} />
            <Label htmlFor="is_published">Опубликовать</Label>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <SubmitButton size="lg">Сохранить</SubmitButton>
        <Button type="button" variant="outline" size="lg" onClick={() => history.back()}>Отмена</Button>
      </div>
    </form>
  );
}
