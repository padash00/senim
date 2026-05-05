"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { TextField, TranslatedField } from "@/components/admin/FormFields";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import type { Faq } from "@/lib/supabase/database.types";
import { createFaq, updateFaq } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function FaqForm({ faq }: { faq: Faq | null }) {
  const router = useRouter();
  const action = faq
    ? (updateFaq.bind(null, faq.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createFaq;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success("Сохранено"); router.refresh(); } else toast.error(state.error);
  }, [state, router]);

  return (
    <form action={dispatch} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <TranslatedField
            baseName="question"
            label="Вопрос"
            required
            defaults={{ kk: faq?.question_kk, ru: faq?.question_ru, en: faq?.question_en }}
          />
          <TranslatedField
            baseName="answer"
            label="Ответ"
            textarea
            rows={5}
            defaults={{ kk: faq?.answer_kk, ru: faq?.answer_ru, en: faq?.answer_en }}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="category" label="Категория" defaultValue={faq?.category} />
            <TextField name="sort_order" label="Порядок" type="number" defaultValue={faq?.sort_order ?? 0} />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="is_published" name="is_published" defaultChecked={faq?.is_published ?? true} />
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
