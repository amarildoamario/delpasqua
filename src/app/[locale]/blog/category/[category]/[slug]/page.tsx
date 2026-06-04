import BlogPostPage, { generateMetadata as generateBlogPostMetadata } from "../../../[slug]/page";
import { getBlogPosts } from "@/lib/blog-data";
import { getLocalizedBlogCategorySlug } from "@/lib/blogSlugs";
import { locales } from "@/i18n/pathnames";

export async function generateStaticParams() {
  const params: { locale: string; category: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getBlogPosts(locale);
    for (const post of posts) {
      params.push({
        locale,
        category: getLocalizedBlogCategorySlug(post, locale),
        slug: post.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  return generateBlogPostMetadata({ params });
}

export default function BlogCategoryPostPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  return BlogPostPage({ params });
}
