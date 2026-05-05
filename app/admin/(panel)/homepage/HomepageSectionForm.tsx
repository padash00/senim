"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, TextField, TranslatedField } from "@/components/admin/FormFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { HomepageSection } from "@/lib/supabase/database.types";
import { updateHomepageSection } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  audience: "Кому помогаем",
  process: "Как проходит работа",
  trust: "Почему доверяют",
  consultation: "Консультация",
};

export function HomepageSectionForm({ section }: { section: HomepageSection }) {
  const router = useRouter();
  const action = updateHomepageSection.bind(null, section.id) as (
    state: ActionResult | undefined,
    fd: FormData,
  ) => Promise<ActionResult>;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success("Сохранено"); router.refresh(); } else toast.error(state.error);
  }, [state, router]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {SECTION_LABELS[section.key] ?? section.key}
          <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
            {section.key}
          </span>
        </CardTitle>
        <CardDescription>Блок главной страницы</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="grid gap-6">
          <TranslatedField
            baseName="title"
            label="Заголовок"
            defaults={{ kk: section.title_kk, ru: section.title_ru, en: section.title_en }}
          />
          <TranslatedField
            baseName="subtitle"
            label="Подзаголовок"
            textarea
            rows={2}
            defaults={{ kk: section.subtitle_kk, ru: section.subtitle_ru, en: section.subtitle_en }}
          />
          <TranslatedField
            baseName="body"
            label="Текст блока"
            textarea
            defaults={{ kk: section.body_kk, ru: section.body_ru, en: section.body_en }}
          />
          {section.key === "hero" && (
            <>
              <TranslatedField
                baseName="cta_label"
                label="Кнопка (необязательно)"
                defaults={{ kk: section.cta_label_kk, ru: section.cta_label_ru, en: section.cta_label_en }}
              />
              <TextField name="cta_href" label="Ссылка кнопки" defaultValue={section.cta_href} placeholder="/contacts#apply" />
            </>
          )}
          <Field label="Иллюстрация (опционально)">
            <ImageUpload name="image_url" defaultUrl={section.image_url} folder="homepage" />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="sort_order" type="number" label="Порядок" defaultValue={section.sort_order} />
            <div className="flex items-center gap-3 pt-6">
              <Switch id={`pub_${section.id}`} name="is_published" defaultChecked={section.is_published} />
              <Label htmlFor={`pub_${section.id}`}>Показывать на главной</Label>
            </div>
          </div>
          <SubmitButton className="w-fit">Сохранить блок</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
