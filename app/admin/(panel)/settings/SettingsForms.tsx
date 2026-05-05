"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, TextField, TextareaField, TranslatedField } from "@/components/admin/FormFields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Contacts, SiteSettings } from "@/lib/supabase/database.types";
import { updateContacts, updateSiteSettings } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, action] = useActionState<ActionResult | undefined, FormData>(updateSiteSettings, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success("Сохранено");
    else toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Сайт и SEO</CardTitle>
        <CardDescription>Название, язык по умолчанию, мета-теги для главной</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-6">
          {settings?.id && <input type="hidden" name="id" value={settings.id} />}
          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="site_name" label="Название центра" defaultValue={settings?.site_name ?? "Сенім"} required />
            <Field label="Язык по умолчанию">
              <Select name="default_locale" defaultValue={settings?.default_locale ?? "kk"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">Қазақша (KK)</SelectItem>
                  <SelectItem value="ru">Русский (RU)</SelectItem>
                  <SelectItem value="en">English (EN)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <TranslatedField
            baseName="seo_title"
            label="SEO Title"
            defaults={{
              kk: settings?.seo_title_kk,
              ru: settings?.seo_title_ru,
              en: settings?.seo_title_en,
            }}
          />
          <TranslatedField
            baseName="seo_description"
            label="SEO Description"
            textarea
            defaults={{
              kk: settings?.seo_description_kk,
              ru: settings?.seo_description_ru,
              en: settings?.seo_description_en,
            }}
          />
          <SubmitButton className="w-fit">Сохранить</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function ContactsForm({ contacts }: { contacts: Contacts | null }) {
  const [state, action] = useActionState<ActionResult | undefined, FormData>(updateContacts, undefined);
  const wh = (contacts?.working_hours ?? {}) as Record<string, string | undefined>;

  useEffect(() => {
    if (!state) return;
    if (state.ok) toast.success("Контакты сохранены");
    else toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Контакты</CardTitle>
        <CardDescription>Телефон, WhatsApp, адрес, режим работы, карта 2ГИС</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-6">
          {contacts?.id && <input type="hidden" name="id" value={contacts.id} />}

          <div className="grid gap-6 md:grid-cols-2">
            <TextField name="phone" label="Телефон" defaultValue={contacts?.phone} placeholder="+7 700 000 00 00" />
            <TextField name="whatsapp" label="WhatsApp" defaultValue={contacts?.whatsapp} placeholder="+7 700 000 00 00" />
            <TextField name="email" label="Email" defaultValue={contacts?.email} type="email" />
            <TextField name="instagram" label="Instagram" defaultValue={contacts?.instagram} placeholder="username" />
          </div>

          <TranslatedField
            baseName="address"
            label="Адрес"
            defaults={{
              kk: contacts?.address_kk,
              ru: contacts?.address_ru,
              en: contacts?.address_en,
            }}
          />

          <Field label="Режим работы">
            <div className="grid gap-3">
              {(["mon_fri", "sat", "sun"] as const).map((day) => (
                <div key={day} className="grid gap-2 rounded-2xl border border-border/70 bg-secondary/20 p-3 sm:grid-cols-[1fr_2fr] sm:items-center">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                    {day === "mon_fri" ? "Пн–Пт" : day === "sat" ? "Сб" : "Вс"}
                  </Label>
                  <div className="grid gap-2 md:grid-cols-3">
                    {(["kk", "ru", "en"] as const).map((loc) => (
                      <Input
                        key={loc}
                        name={`wh_${day}_${loc}`}
                        defaultValue={wh[`${day}_${loc}`] ?? ""}
                        placeholder={loc.toUpperCase()}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Field>

          <TextareaField
            name="map_iframe"
            label="HTML iframe для 2ГИС"
            defaultValue={contacts?.map_iframe}
            rows={3}
            hint="Вставьте embed-код от 2ГИС или Google Maps"
          />

          <SubmitButton className="w-fit">Сохранить контакты</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
