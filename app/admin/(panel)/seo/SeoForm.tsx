"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Field, TextField, TranslatedField } from "@/components/admin/FormFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import type { PageSeo } from "@/lib/supabase/database.types";
import { createPageSeo, updatePageSeo } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function SeoForm({ row }: { row: PageSeo | null }) {
  const router = useRouter();
  const action = row
    ? (updatePageSeo.bind(null, row.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createPageSeo;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success("Сохранено"); router.refresh(); } else toast.error(state.error);
  }, [state, router]);

  return (
    <form action={dispatch} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <TextField name="path" label="Путь страницы" required defaultValue={row?.path} placeholder="/services" hint="Логический путь без локали" />
          <TranslatedField
            baseName="meta_title"
            label="Meta title"
            defaults={{ kk: row?.meta_title_kk, ru: row?.meta_title_ru, en: row?.meta_title_en }}
          />
          <TranslatedField
            baseName="meta_description"
            label="Meta description"
            textarea
            defaults={{ kk: row?.meta_description_kk, ru: row?.meta_description_ru, en: row?.meta_description_en }}
          />
          <Field label="OG Image">
            <ImageUpload name="og_image_url" defaultUrl={row?.og_image_url} folder="seo" />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="canonical_url" label="Canonical URL" defaultValue={row?.canonical_url} />
            <TextField name="keywords" label="Keywords" defaultValue={row?.keywords?.join(", ")} hint="через запятую" />
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
