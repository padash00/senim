"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Field, TextField, TranslatedField } from "@/components/admin/FormFields";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/lib/supabase/database.types";
import { createBlogPost, updateBlogPost } from "./actions";
import type { ActionResult } from "@/lib/admin/forms";

export function BlogForm({ post }: { post: BlogPost | null }) {
  const router = useRouter();
  const action = post
    ? (updateBlogPost.bind(null, post.id) as (state: ActionResult | undefined, fd: FormData) => Promise<ActionResult>)
    : createBlogPost;
  const [state, dispatch] = useActionState<ActionResult | undefined, FormData>(action, undefined);

  useEffect(() => {
    if (!state) return;
    if (state.ok) { toast.success("Сохранено"); router.refresh(); } else toast.error(state.error);
  }, [state, router]);

  return (
    <form action={dispatch} className="grid gap-6">
      <Card>
        <CardContent className="grid gap-6 p-6">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <TextField name="slug" label="Slug" required defaultValue={post?.slug} hint="URL: /blog/<slug>" />
            <TextField
              name="published_at"
              type="datetime-local"
              label="Дата публикации"
              defaultValue={post?.published_at ? post.published_at.slice(0, 16) : ""}
            />
          </div>
          <TranslatedField
            baseName="title"
            label="Заголовок"
            required
            defaults={{ kk: post?.title_kk, ru: post?.title_ru, en: post?.title_en }}
          />
          <TranslatedField
            baseName="excerpt"
            label="Краткое описание"
            textarea
            rows={3}
            defaults={{ kk: post?.excerpt_kk, ru: post?.excerpt_ru, en: post?.excerpt_en }}
          />
          <TranslatedField
            baseName="body"
            label="Текст статьи"
            textarea
            rows={14}
            defaults={{ kk: post?.body_kk, ru: post?.body_ru, en: post?.body_en }}
          />
          <Field label="Обложка">
            <ImageUpload name="cover_url" defaultUrl={post?.cover_url} folder="blog" />
          </Field>
          <TranslatedField
            baseName="seo_title"
            label="SEO Title"
            defaults={{ kk: post?.seo_title_kk, ru: post?.seo_title_ru, en: post?.seo_title_en }}
          />
          <TranslatedField
            baseName="seo_description"
            label="SEO Description"
            textarea
            defaults={{ kk: post?.seo_description_kk, ru: post?.seo_description_ru, en: post?.seo_description_en }}
          />
          <div className="flex items-center gap-3">
            <Switch id="is_published" name="is_published" defaultChecked={post?.is_published ?? false} />
            <Label htmlFor="is_published">Опубликовать (если не указана дата — поставится текущая)</Label>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <SubmitButton size="lg">Сохранить</SubmitButton>
        <Button type="button" variant="outline" size="lg" onClick={() => history.back()}>Отмена</Button>
      </div>
    </form>
  );
}
