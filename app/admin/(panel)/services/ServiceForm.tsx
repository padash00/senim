"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Field, TextField, TranslatedField } from "@/components/admin/FormFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Service } from "@/lib/supabase/database.types";
import { createService, updateService } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

const ICONS = [
  "sparkles", "message-circle", "brain", "activity", "waves",
  "hand-helping", "heart", "graduation-cap", "layers", "users",
];

type Props = { service: Service | null };

export function ServiceForm({ service }: Props) {
  const router = useRouter();
  const action = service
    ? (updateService.bind(null, service.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createService;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) {
      toast.success("Сохранено");
      router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={dispatch} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="slug" label="Slug" defaultValue={service?.slug} required hint="URL: /services/<slug>" />
            <TextField name="age_range" label="Возраст" defaultValue={service?.age_range} placeholder="2–14" />
          </div>
          <TranslatedField
            baseName="title"
            label="Название"
            required
            defaults={{ kk: service?.title_kk, ru: service?.title_ru, en: service?.title_en }}
          />
          <TranslatedField
            baseName="short_description"
            label="Краткое описание"
            textarea
            rows={2}
            defaults={{
              kk: service?.short_description_kk,
              ru: service?.short_description_ru,
              en: service?.short_description_en,
            }}
          />
          <TranslatedField
            baseName="full_description"
            label="Полное описание"
            textarea
            rows={5}
            defaults={{
              kk: service?.full_description_kk,
              ru: service?.full_description_ru,
              en: service?.full_description_en,
            }}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            <TranslatedField
              baseName="suitable_for"
              label="Кому подходит"
              textarea
              defaults={{ kk: service?.suitable_for_kk, ru: service?.suitable_for_ru, en: service?.suitable_for_en }}
            />
            <TranslatedField
              baseName="skills_developed"
              label="Какие навыки развивает"
              textarea
              defaults={{
                kk: service?.skills_developed_kk,
                ru: service?.skills_developed_ru,
                en: service?.skills_developed_en,
              }}
            />
            <TranslatedField
              baseName="how_it_works"
              label="Как проходит занятие"
              textarea
              defaults={{
                kk: service?.how_it_works_kk,
                ru: service?.how_it_works_ru,
                en: service?.how_it_works_en,
              }}
            />
            <TranslatedField
              baseName="result"
              label="Ожидаемый результат"
              textarea
              defaults={{ kk: service?.result_kk, ru: service?.result_ru, en: service?.result_en }}
            />
          </div>
          <TranslatedField
            baseName="price_note"
            label="Заметка о цене"
            textarea
            rows={2}
            defaults={{ kk: service?.price_note_kk, ru: service?.price_note_ru, en: service?.price_note_en }}
          />
          <div className="grid gap-6 md:grid-cols-3">
            <TextField name="duration_minutes" type="number" label="Длительность (мин)" defaultValue={service?.duration_minutes} />
            <TextField name="price" type="number" label="Цена, ₸" defaultValue={service?.price} />
            <TextField name="sort_order" type="number" label="Порядок" defaultValue={service?.sort_order ?? 0} />
          </div>
          <Field label="Иконка" hint="Имя из набора lucide (kebab-case)">
            <div className="flex flex-wrap gap-2">
              <input type="hidden" name="icon" defaultValue={service?.icon ?? "sparkles"} id="icon-hidden" />
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("icon-hidden") as HTMLInputElement;
                    el.value = ic;
                    e.currentTarget.parentElement?.querySelectorAll("button").forEach((b) =>
                      b.setAttribute("aria-pressed", "false"),
                    );
                    e.currentTarget.setAttribute("aria-pressed", "true");
                  }}
                  aria-pressed={(service?.icon ?? "sparkles") === ic}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium aria-pressed:border-primary aria-pressed:bg-primary-soft"
                >
                  {ic}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Обложка">
            <ImageUpload name="image_url" defaultUrl={service?.image_url} folder="services" />
          </Field>
          <div className="flex items-center gap-3">
            <Switch id="is_published" name="is_published" defaultChecked={service?.is_published ?? true} />
            <Label htmlFor="is_published">Опубликовать</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <SubmitButton size="lg">Сохранить</SubmitButton>
        <Button type="button" variant="outline" size="lg" onClick={() => history.back()}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
