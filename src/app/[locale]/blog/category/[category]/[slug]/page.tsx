import { setRequestLocale } from 'next-intl/server';
import BlogPostPage, { generateMetadata as generateBlogPostMetadata } from "../../../[slug]/page";
import { getBlogPosts } from "@/lib/blog-data";
import { getLocalizedBlogCategorySlug, getLocalizedBlogSlug } from "@/lib/blogSlugs";
import { locales } from "@/i18n/pathnames";

export async function generateStaticParams() {
  const params: { locale: string; category: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getBlogPosts(locale);
    for (const post of posts) {
      const category = getLocalizedBlogCategorySlug(post, locale);
      for (const slug of new Set([getLocalizedBlogSlug(post, locale), post.slug])) {
        params.push({ locale, category, slug });
      }
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

function BlogCategoryPostPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>;
}) {
  return BlogPostPage({ params });
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogCategoryPostPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <BlogCategoryPostPage {...props} />;
}
