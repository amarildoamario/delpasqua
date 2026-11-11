import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import BlogPage, { generateMetadata as generateBlogMetadata } from "../../page";
import { locales, localizedPathnames } from "@/i18n/pathnames";
import { getBlogPosts, mockBlogPosts } from "@/lib/blog-data";
import {
  getBlogCategorySlug,
  findCategoryNameBySlug,
  findPostByCategorySlug,
  getLocalizedBlogCategorySlug,
} from "@/lib/blogSlugs";
import {
  SITE_URL,
  SITE_NAME,
  absoluteUrl,
  getBlogCategoryAlternateUrls,
  getOpenGraphLocale,
} from "@/lib/seo";

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

const CATEGORY_DESC_TEMPLATES: Record<string, (cat: string) => string> = {
  it: (cat) => `Articoli, approfondimenti e consigli su ${cat} dal blog del Frantoio Del Pasqua.`,
  en: (cat) => `Articles, insights and tips on ${cat} from the Frantoio Del Pasqua olive mill blog.`,
  de: (cat) => `Artikel, Einblicke und Tipps zum Thema ${cat} im Blog der Ölmühle Frantoio Del Pasqua.`,
  nl: (cat) => `Artikelen, inzichten en tips over ${cat} op het blog van Frantoio Del Pasqua.`,
  da: (cat) => `Artikler, indsigt og tips om ${cat} fra Frantoio Del Pasquas blog.`,
  no: (cat) => `Artikler, innsikt og tips om ${cat} fra bloggen til Frantoio Del Pasqua.`,
  es: (cat) => `Artículos, análisis y consejos sobre ${cat} en el blog de Frantoio Del Pasqua.`,
  fr: (cat) => `Articles, analyses et conseils sur ${cat} dans le blog du moulin Frantoio Del Pasqua.`,
  us: (cat) => `Articles, insights and tips on ${cat} from the Frantoio Del Pasqua olive mill blog.`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const representativePost = findPostByCategorySlug(mockBlogPosts, category);
  const categoryName = findCategoryNameBySlug(category, locale);

  if (!representativePost || !categoryName) {
    return generateBlogMetadata({ params: Promise.resolve({ locale }) });
  }

  const canonicalCategorySlug = getLocalizedBlogCategorySlug(representativePost, locale);
  const template = localizedPathnames["/blog/category/[category]"]?.[locale as keyof (typeof localizedPathnames)["/blog/category/[category]"]] || "/blog/category/[category]";
  const resolvedPath = template.replace("[category]", canonicalCategorySlug);
  const fullPath = locale === "it" ? resolvedPath : `/${locale}${resolvedPath}`;
  const canonical = absoluteUrl(fullPath);
  const languages = getBlogCategoryAlternateUrls(representativePost);

  const title = `${categoryName} — Blog`;
  const descBuilder = CATEGORY_DESC_TEMPLATES[locale] ?? CATEGORY_DESC_TEMPLATES.it;
  const description = descBuilder(categoryName);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: getOpenGraphLocale(locale),
      type: "website",
    },
  };
}

function BlogCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  return BlogPage({ params });
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BlogCategoryPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  return <BlogCategoryPage {...props} />;
}
