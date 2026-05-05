import { PageHeader } from "@/components/admin/PageHeader";
import { BlogForm } from "../BlogForm";

export const dynamic = "force-dynamic";

export default function NewBlogPage() {
  return (
    <div>
      <PageHeader title="Новая статья" backHref="/admin/blog" />
      <BlogForm post={null} />
    </div>
  );
}
