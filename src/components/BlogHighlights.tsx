import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getBlogPosts } from "@/lib/blog-data";

export default async function BlogHighlights() {
  const posts = await getBlogPosts();
  const featuredPosts = posts.slice(0, 3);
  const featuredPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1);

  if (!featuredPost) return null;

  return (
    <section className="bg-[#faf7f1] py-11 text-[#1f1a17] lg:py-13">
      <div className="mx-auto max-w-[92rem] px-4 sm:px-5 lg:px-6 xl:px-8">
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#1f1a17] sm:text-[3.6rem]">
              Dal nostro Magazine
            </h2>
            <div className="hidden h-px w-24 bg-[#DCCFBE] md:block" />
          </div>

          <Link
            href="/blog"
            className="mt-3 inline-flex border-b border-[#A99E91] pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6E655B] transition-colors duration-300 hover:text-[#314030]"
          >
            Leggi tutti gli articoli
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.95fr)_minmax(300px,0.74fr)] lg:gap-7">
          <article className="group relative min-h-[330px] overflow-hidden rounded-[5px] bg-[#E5DED2] sm:min-h-[395px] lg:min-h-[430px]">
            <Image
              src={featuredPost.imageUrl}
              alt={featuredPost.title}
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,14,10,0.06)_0%,rgba(17,14,10,0.18)_38%,rgba(17,14,10,0.78)_100%)]" />

            <Link
              href={`/blog/${featuredPost.slug}`}
              className="absolute inset-0 z-20"
              aria-label={featuredPost.title}
            />

            <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-5 lg:p-6">
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#D8C98E]">
                {featuredPost.category}
              </span>

              <h3 className="mt-3 max-w-[32rem] font-serif text-[1.75rem] font-light leading-[1.04] text-white sm:text-[2rem] lg:text-[2.35rem]">
                {featuredPost.title}
              </h3>

              <p className="mt-2.5 max-w-[28rem] text-[13px] leading-5 text-white/82 sm:text-[14px] sm:leading-6">
                {featuredPost.excerpt}
              </p>
            </div>
          </article>

          <div className="flex flex-col gap-5 lg:gap-6">
            {secondaryPosts.map((post) => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[2.08/1] overflow-hidden rounded-[5px] bg-[#E5DED2]">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 26vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="pt-2.5">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A89D91]">
                      {post.category}
                    </span>

                    <h3 className="mt-2 font-serif text-[1.28rem] font-light leading-[1.1] text-[#1f1a17] line-clamp-2 transition-colors duration-300 group-hover:text-[#314030]">
                      {post.title}
                    </h3>

                    <p className="mt-2 text-[13px] leading-5 text-[#766C62] line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
