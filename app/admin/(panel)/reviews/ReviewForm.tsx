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
import type { Review } from "@/lib/supabase/database.types";
import { createReview, updateReview } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function ReviewForm({ review }: { review: Review | null }) {
  const router = useRouter();
  const action = review
    ? (updateReview.bind(null, review.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createReview;
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
          <div className="grid gap-6 md:grid-cols-3">
            <TextField name="parent_name" label="Имя родителя" required defaultValue={review?.parent_name} />
            <TextField name="rating" type="number" label="Оценка (1–5)" defaultValue={review?.rating} />
            <Field label="Основной язык">
              <Select name="language" defaultValue={review?.language ?? "ru"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">KK</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <TranslatedField
            baseName="text"
            label="Текст отзыва"
            textarea
            rows={5}
            defaults={{ kk: review?.text_kk, ru: review?.text_ru, en: review?.text_en }}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="reviewed_at" type="date" label="Дата" defaultValue={review?.reviewed_at} />
            <Field label="Фото (необязательно)">
              <ImageUpload name="photo_url" defaultUrl={review?.photo_url} folder="reviews" />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <Switch id="is_published" name="is_published" defaultChecked={review?.is_published ?? true} />
              <Label htmlFor="is_published">Опубликовать</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="is_featured" name="is_featured" defaultChecked={review?.is_featured ?? false} />
              <Label htmlFor="is_featured">Избранный</Label>
            </div>
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
