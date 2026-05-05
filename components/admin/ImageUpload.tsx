"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  defaultUrl?: string | null;
  folder?: string;
  className?: string;
  accept?: string;
};

/**
 * Hidden text input named `${name}` carries the public URL, so the parent
 * form can submit it like any other text field. The visible UI handles the
 * upload to the `media` bucket.
 */
export function ImageUpload({ name, defaultUrl, folder = "uploads", className, accept = "image/*" }: Props) {
  const [url, setUrl] = useState<string>(defaultUrl ?? "");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Файл больше 8 МБ");
      return;
    }
    setBusy(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setUrl(data.publicUrl);
      toast.success("Загружено");
    } catch (err) {
      console.error(err);
      toast.error("Не удалось загрузить файл");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("grid gap-3", className)}>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/70 bg-secondary">
          <div className="relative aspect-[4/3] w-full">
            <Image src={url} alt="" fill sizes="(max-width: 768px) 100vw, 384px" className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-soft hover:bg-background"
            aria-label="Удалить"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={`${name}-file`}
          className="flex w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/70 bg-secondary/40 p-8 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          {busy ? "Загрузка…" : "Перетащите файл или нажмите для выбора"}
        </label>
      )}
      <input
        id={`${name}-file`}
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onPick}
        disabled={busy}
      />
      <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={busy} className="w-fit">
        <Upload className="h-4 w-4" /> Заменить файл
      </Button>
    </div>
  );
}
