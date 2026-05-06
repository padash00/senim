"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
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

const DRAFT_KEY = "senim-form-draft";
type Draft = Partial<Pick<ApplicationInput, "parent_name" | "phone" | "comment" | "child_age">>;

/** Smart Kazakh phone formatter: '7700...' → '+7 700 000 00 00'. */
function formatKzPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  let normalized = digits;
  if (normalized.startsWith("8")) normalized = "7" + normalized.slice(1);
  if (!normalized.startsWith("7")) normalized = "7" + normalized;
  const a = normalized.slice(1, 4);
  const b = normalized.slice(4, 7);
  const c = normalized.slice(7, 9);
  const d = normalized.slice(9, 11);
  let out = "+7";
  if (a) out += " " + a;
  if (b) out += " " + b;
  if (c) out += " " + c;
  if (d) out += " " + d;
  return out;
}

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
  const draftLoaded = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange", // real-time validation → green/red as the parent types
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
  const phoneValue = watch("phone");
  const phoneOk = phoneValue && !errors.phone && phoneValue.replace(/\D/g, "").length >= 10;

  // Load draft once on mount.
  useEffect(() => {
    if (draftLoaded.current) return;
    draftLoaded.current = true;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Draft;
      if (draft.parent_name) setValue("parent_name", draft.parent_name);
      if (draft.phone) setValue("phone", draft.phone);
      if (draft.comment) setValue("comment", draft.comment);
      if (draft.child_age != null) setValue("child_age", draft.child_age);
    } catch {
      /* corrupt draft — ignore */
    }
  }, [setValue]);

  // Save draft on every change (debounced via setTimeout chain).
  useEffect(() => {
    const sub = watch((values) => {
      try {
        const draft: Draft = {
          parent_name: values.parent_name,
          phone: values.phone,
          comment: values.comment,
          child_age: values.child_age,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        /* storage full / blocked */
      }
    });
    return () => sub.unsubscribe();
  }, [watch]);

  const phoneReg = register("phone");

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
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
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
        <CardContent className="relative flex flex-col items-center gap-5 py-12 text-center">
          <ConfettiBurst />
          <AnimatedCheck />
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
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+7 700 000 00 00"
                  {...phoneReg}
                  onChange={(e) => {
                    const formatted = formatKzPhone(e.target.value);
                    e.target.value = formatted;
                    void phoneReg.onChange(e);
                  }}
                  aria-invalid={!!errors.phone}
                  className={phoneOk ? "border-success/60 focus-visible:ring-success" : undefined}
                />
                {phoneOk && (
                  <span aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
                    ✓
                  </span>
                )}
              </div>
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
            <Button type="submit" size="lg" disabled={isPending || !isValid} className="sm:flex-1">
              {isPending ? `${tCta("send")}…` : tCta("send")}
            </Button>
            {whatsappNumber && (
              <WhatsAppButton phone={whatsappNumber} label={tCta("whatsapp")} size="lg" />
            )}
          </div>
        </form>
        {!done && (
          <p className="mt-4 text-center text-[11px] text-muted-foreground/70">
            Введённое сохраняется автоматически — можно вернуться позже.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function FieldError({ msgKey }: { msgKey?: string }) {
  const t = useTranslations();
  if (!msgKey) return null;
  return <p className="text-xs text-destructive">{t(msgKey)}</p>;
}

/**
 * Tiny confetti burst — 12 colour-tinted pieces fly out from the centre
 * with random vector + rotation. Pure CSS animation via custom properties.
 */
function ConfettiBurst() {
  const colors = ["hsl(var(--primary))", "hsl(var(--accent-foreground))", "hsl(var(--success))", "hsl(var(--warning))"];
  const pieces = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
    const dist = 80 + Math.random() * 40;
    return {
      id: i,
      cx: Math.cos(angle) * dist,
      cy: Math.sin(angle) * dist,
      color: colors[i % colors.length],
      delay: Math.random() * 80,
    };
  });
  return (
    <span aria-hidden className="pointer-events-none absolute left-1/2 top-16 h-0 w-0">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            background: p.color,
            ["--cx" as string]: `${p.cx}px`,
            ["--cy" as string]: `${p.cy}px`,
            animationDelay: `${p.delay}ms`,
            transform: `rotate(${(p.id * 30) % 180}deg)`,
          }}
        />
      ))}
    </span>
  );
}

/**
 * SVG checkmark whose path is "drawn" by animating stroke-dashoffset.
 * Pure CSS animation, no external library.
 */
function AnimatedCheck() {
  return (
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
      <svg viewBox="0 0 52 52" className="h-9 w-9" aria-hidden>
        <circle cx="26" cy="26" r="24" fill="none" stroke="hsl(var(--success))" strokeWidth="2" opacity="0.3" />
        <path
          d="M14 27 L23 36 L39 18"
          fill="none"
          stroke="hsl(var(--success))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: 60,
            strokeDashoffset: 60,
            animation: "draw-check 700ms cubic-bezier(0.65, 0, 0.45, 1) 120ms forwards",
          }}
        />
      </svg>
    </span>
  );
}
