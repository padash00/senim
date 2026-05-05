"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Field, TextField, TranslatedField } from "@/components/admin/FormFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import type { GalleryItem } from "@/lib/supabase/database.types";
import { createGalleryItem, updateGalleryItem } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function GalleryForm({ item }: { item: GalleryItem | null }) {
  const router = useRouter();
  const action = item
    ? (updateGalleryItem.bind(null, item.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createGalleryItem;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success("Сохранено"); router.refresh(); } else toast.error(state.error);
  }, [state, router]);

  return (
    <form action={dispatch} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <Field label="Изображение" hint="Обязательное поле">
            <ImageUpload name="image_url" defaultUrl={item?.image_url} folder="gallery" />
          </Field>
          <TranslatedField
            baseName="caption"
            label="Подпись"
            defaults={{ kk: item?.caption_kk, ru: item?.caption_ru, en: item?.caption_en }}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Категория">
              <Select name="category" defaultValue={item?.category ?? "office"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Кабинеты</SelectItem>
                  <SelectItem value="team">Команда</SelectItem>
                  <SelectItem value="illustration">Иллюстрации</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <TextField name="sort_order" label="Порядок" type="number" defaultValue={item?.sort_order ?? 0} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="is_published" name="is_published" defaultChecked={item?.is_published ?? true} />
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
