import BlogPage, { generateMetadata as generateBlogMetadata } from "../../page";
import { locales } from "@/i18n/pathnames";
import { getBlogPosts } from "@/lib/blog-data";
import { getBlogCategorySlug } from "@/lib/blogSlugs";

export async function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];

  for (const locale of locales) {
    const posts = await getBlogPosts(locale);
    const categories = Array.from(new Set(posts.map((post) => post.category)));

    for (const category of categories) {
      params.push({
        locale,
        category: getBlogCategorySlug(category),
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale } = await params;
  return generateBlogMetadata({ params: Promise.resolve({ locale }) });
}

export default function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  return BlogPage({ params });
}
