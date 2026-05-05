import { z } from "zod";

const phoneRegex = /^[+\d][\d\s()\-]{6,20}$/;

export const applicationSchema = z.object({
  parent_name: z.string().trim().min(2, "form.errors.required").max(120),
  phone: z.string().trim().regex(phoneRegex, "form.errors.phone"),
  child_age: z
    .union([z.string(), z.number()])
    .transform((v) => (v === "" || v == null ? null : Number(v)))
    .pipe(z.number().int().min(0).max(25).nullable())
    .optional(),
  comment: z.string().trim().max(2000).optional().or(z.literal("")),
  preferred_contact: z.enum(["phone", "whatsapp", "telegram"]).optional(),
  preferred_language: z.enum(["kk", "ru", "en"]).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "form.errors.consent" }) }),
  service_id: z.string().uuid().optional().nullable(),
  specialist_id: z.string().uuid().optional().nullable(),
  source: z.string().max(120).optional(),
  // Honeypot — must be empty. Bots tend to fill every field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
