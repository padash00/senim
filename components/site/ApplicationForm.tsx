"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppButton } from "./WhatsAppButton";
import { applicationSchema, type ApplicationInput } from "@/lib/validators/application";
import { submitApplication } from "@/app/actions/application";
import type { Locale } from "@/lib/i18n/config";

type Props = {
  whatsappNumber?: string;
  serviceId?: string;
  specialistId?: string;
  source?: string;
  defaultLanguage?: Locale;
  className?: string;
};

export function ApplicationForm({
  whatsappNumber,
  serviceId,
  specialistId,
  source,
  defaultLanguage,
  className,
}: Props) {
  const t = useTranslations("form");
  const tCta = useTranslations("cta");
  const locale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState<{ name: string; phone: string; comment?: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      preferred_contact: "whatsapp",
      preferred_language: defaultLanguage ?? locale,
      consent: undefined as unknown as true,
      service_id: serviceId,
      specialist_id: specialistId,
      source,
      website: "",
    },
  });

  const preferredContact = watch("preferred_contact");
  const preferredLanguage = watch("preferred_language");

  function onSubmit(values: ApplicationInput) {
    const fd = new FormData();
    Object.entries(values).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      fd.set(k, v === true ? "on" : String(v));
    });
    if (serviceId) fd.set("service_id", serviceId);
    if (specialistId) fd.set("specialist_id", specialistId);
    if (source) fd.set("source", source);

    startTransition(async () => {
      const res = await submitApplication(fd);
      if (res.ok) {
        toast.success(t("success"));
        setDone({ name: values.parent_name, phone: values.phone, comment: values.comment ?? "" });
        reset();
      } else {
        toast.error(t("errors.generic"));
      }
    });
  }

  if (done) {
    const message = `Здравствуйте! Хочу оставить заявку в центр Сенім. Имя: ${done.name}, телефон: ${done.phone}${
      done.comment ? `, комментарий: ${done.comment}` : ""
    }`;
    return (
      <Card className={className} aria-live="polite">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <p className="text-lg font-medium">{t("success")}</p>
          {whatsappNumber && (
            <WhatsAppButton phone={whatsappNumber} message={message} label={t("successWhatsapp")} />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-application-form>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {/* honeypot — invisible to humans, irresistible to bots */}
          <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" {...register("website")} />
            </label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="parent_name">{t("parentName")} *</Label>
            <Input id="parent_name" autoComplete="name" {...register("parent_name")} aria-invalid={!!errors.parent_name} />
            {errors.parent_name && <FieldError msgKey={errors.parent_name.message} />}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="phone">{t("phone")} *</Label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+7 700 000 00 00"
                {...register("phone")}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <FieldError msgKey={errors.phone.message} />}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="child_age">{t("childAge")}</Label>
              <Input id="child_age" inputMode="numeric" min={0} max={25} {...register("child_age")} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comment">{t("comment")}</Label>
            <Textarea id="comment" rows={4} {...register("comment")} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>{t("preferredContact")}</Label>
              <Select
                value={preferredContact ?? "whatsapp"}
                onValueChange={(v) => setValue("preferred_contact", v as ApplicationInput["preferred_contact"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">{t("preferredContact.whatsapp")}</SelectItem>
                  <SelectItem value="phone">{t("preferredContact.phone")}</SelectItem>
                  <SelectItem value="telegram">{t("preferredContact.telegram")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>{t("preferredLanguage")}</Label>
              <Select
                value={preferredLanguage ?? locale}
                onValueChange={(v) => setValue("preferred_language", v as ApplicationInput["preferred_language"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kk">Қазақша</SelectItem>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Checkbox label={`${t("consent")} *`} {...register("consent")} aria-invalid={!!errors.consent} />
            {errors.consent && <FieldError msgKey={errors.consent.message} />}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" size="lg" disabled={isPending} className="sm:flex-1">
              {isPending ? `${tCta("send")}…` : tCta("send")}
            </Button>
            {whatsappNumber && (
              <WhatsAppButton phone={whatsappNumber} label={tCta("whatsapp")} size="lg" />
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function FieldError({ msgKey }: { msgKey?: string }) {
  const t = useTranslations();
  if (!msgKey) return null;
  return <p className="text-xs text-destructive">{t(msgKey)}</p>;
}
