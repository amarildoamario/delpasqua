import BlogPage, { generateMetadata as generateBlogMetadata } from "../../page";

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
  searchParams,
}: {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return BlogPage({ params, searchParams });
}
