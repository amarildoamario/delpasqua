import BlogPostPage, { generateMetadata as generateBlogPostMetadata } from "../../../[slug]/page";

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
