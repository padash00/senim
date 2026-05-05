"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { localeFullLabels, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  required,
  children,
  className,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      {label && (
        <Label className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function TextField({
  name,
  label,
  defaultValue,
  required,
  type = "text",
  placeholder,
  hint,
}: {
  name: string;
  label?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  type?: string;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <Input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
      />
    </Field>
  );
}

export function TextareaField({
  name,
  label,
  defaultValue,
  rows = 4,
  hint,
  required,
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <Textarea name={name} rows={rows} required={required} defaultValue={defaultValue ?? ""} />
    </Field>
  );
}

/**
 * Renders a tabbed group of three inputs for kk / ru / en.
 * The form receives values under ${baseName}_kk, ${baseName}_ru, ${baseName}_en.
 */
export function TranslatedField({
  baseName,
  label,
  defaults,
  textarea,
  rows = 4,
  required,
}: {
  baseName: string;
  label: string;
  defaults?: Partial<Record<Locale, string | null>>;
  textarea?: boolean;
  rows?: number;
  required?: boolean;
}) {
  return (
    <Field label={label} required={required}>
      <Tabs defaultValue="kk">
        <TabsList>
          {locales.map((loc) => (
            <TabsTrigger key={loc} value={loc}>
              {localeFullLabels[loc]}
            </TabsTrigger>
          ))}
        </TabsList>
        {locales.map((loc) => (
          <TabsContent key={loc} value={loc}>
            {textarea ? (
              <Textarea
                name={`${baseName}_${loc}`}
                rows={rows}
                required={required && loc === "kk"}
                defaultValue={defaults?.[loc] ?? ""}
              />
            ) : (
              <Input
                name={`${baseName}_${loc}`}
                required={required && loc === "kk"}
                defaultValue={defaults?.[loc] ?? ""}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </Field>
  );
}
