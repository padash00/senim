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
import type { Specialist } from "@/lib/supabase/database.types";
import { createSpecialist, updateSpecialist } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function SpecialistForm({ specialist }: { specialist: Specialist | null }) {
  const router = useRouter();
  const action = specialist
    ? (updateSpecialist.bind(null, specialist.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createSpecialist;
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
            baseName="full_name"
            label="ФИО"
            required
            defaults={{ kk: specialist?.full_name_kk, ru: specialist?.full_name_ru, en: specialist?.full_name_en }}
          />
          <TranslatedField
            baseName="position"
            label="Должность"
            defaults={{ kk: specialist?.position_kk, ru: specialist?.position_ru, en: specialist?.position_en }}
          />
          <TranslatedField
            baseName="bio"
            label="О специалисте"
            textarea
            defaults={{ kk: specialist?.bio_kk, ru: specialist?.bio_ru, en: specialist?.bio_en }}
          />
          <TranslatedField
            baseName="education"
            label="Образование"
            textarea
            defaults={{ kk: specialist?.education_kk, ru: specialist?.education_ru, en: specialist?.education_en }}
          />
          <TranslatedField
            baseName="languages"
            label="Языки"
            defaults={{ kk: specialist?.languages_kk, ru: specialist?.languages_ru, en: specialist?.languages_en }}
          />
          <Field label="Фотография">
            <ImageUpload name="photo_url" defaultUrl={specialist?.photo_url} folder="specialists" />
          </Field>
          <div className="grid gap-6 md:grid-cols-3">
            <TextField name="experience_years" label="Опыт, лет" type="number" defaultValue={specialist?.experience_years} />
            <TextField name="directions" label="Направления" hint="через запятую" defaultValue={specialist?.directions?.join(", ")} />
            <TextField name="certificates" label="Сертификаты" hint="через запятую" defaultValue={specialist?.certificates?.join(", ")} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="sort_order" label="Порядок" type="number" defaultValue={specialist?.sort_order ?? 0} />
            <div className="flex items-center gap-3 pt-6">
              <Switch id="is_published" name="is_published" defaultChecked={specialist?.is_published ?? true} />
              <Label htmlFor="is_published">Опубликовать</Label>
            </div>
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
