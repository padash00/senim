import "server-only";
import { revalidatePath, revalidateTag } from "next/cache";

export type ActionResult<T = unknown> = { ok: true; data?: T } | { ok: false; error: string };

/** FormData → string | null (empty string becomes null) */
export function s(fd: FormData, key: string): string | null {
  const v = fd.get(key);
  if (v === null || typeof v !== "string") return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

/** required string */
export function sr(fd: FormData, key: string): string {
  const v = s(fd, key);
  if (!v) throw new Error(`Поле «${key}» обязательно`);
  return v;
}

/** FormData → number | null */
export function n(fd: FormData, key: string): number | null {
  const v = fd.get(key);
  if (v === null || v === "") return null;
  const num = Number(v);
  return Number.isFinite(num) ? num : null;
}

/** FormData → boolean (checkbox -> "on") */
export function b(fd: FormData, key: string): boolean {
  const v = fd.get(key);
  return v === "on" || v === "true" || v === "1";
}

/** FormData → string[] from comma-separated value */
export function arr(fd: FormData, key: string): string[] | null {
  const v = s(fd, key);
  if (!v) return null;
  return v
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Pull translations { kk, ru, en } for a base name from FormData */
export function translations(fd: FormData, base: string): Record<string, string | null> {
  return {
    [`${base}_kk`]: s(fd, `${base}_kk`),
    [`${base}_ru`]: s(fd, `${base}_ru`),
    [`${base}_en`]: s(fd, `${base}_en`),
  };
}

export function bustTags(...tags: string[]) {
  for (const t of tags) revalidateTag(t);
}

export function bustPaths(...paths: string[]) {
  for (const p of paths) revalidatePath(p);
}
