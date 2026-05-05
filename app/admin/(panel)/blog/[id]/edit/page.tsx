import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BlogForm } from "../../BlogForm";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();
  return (
    <div>
      <PageHeader title={post.title_ru || post.title_kk || "Статья"} backHref="/admin/blog" />
      <BlogForm post={post} />
    </div>
  );
}
