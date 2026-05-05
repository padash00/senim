import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/Container";
import { Section } from "@/components/site/Section";
import { getBlogPostBySlug, listBlogPosts } from "@/lib/db/queries";
import { tField } from "@/lib/i18n/translated";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/i18n/config";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const posts = await listBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const title = tField(post, "title", locale as Locale);
  const description = tField(post, "excerpt", locale as Locale);
  return buildMetadata({
    path: `/blog/${slug}`,
    locale: locale as Locale,
    fallbackTitle: title,
    fallbackDescription: description || undefined,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const loc = locale as Locale;

  const post = await getBlogPostBySlug(slug);
  if (!post || !post.is_published) notFound();

  const title = tField(post, "title", loc);
  const excerpt = tField(post, "excerpt", loc);
  const body = tField(post, "body", loc);

  return (
    <main id="main">
      <Section className="pt-12 md:pt-20">
        <Container size="narrow">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Все материалы
          </Link>
          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {title}
          </h1>
          {post.published_at && (
            <p className="mt-3 text-sm text-muted-foreground">
              {new Date(post.published_at).toLocaleDateString(loc === "kk" ? "kk-KZ" : loc === "en" ? "en-US" : "ru-RU", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
          {excerpt && <p className="mt-4 text-lg text-muted-foreground">{excerpt}</p>}
        </Container>

        {post.cover_url && (
          <Container size="narrow" className="mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-secondary">
              <Image src={post.cover_url} alt={title} fill sizes="(max-width: 1024px) 100vw, 720px" className="object-cover" />
            </div>
          </Container>
        )}

        <Container size="narrow" className="mt-10">
          <article className="prose prose-slate max-w-none whitespace-pre-line text-base leading-relaxed">
            {body}
          </article>
        </Container>
      </Section>
    </main>
  );
}
