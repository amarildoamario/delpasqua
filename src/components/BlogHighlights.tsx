import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getLocale, getTranslations } from "next-intl/server";
import { getBlogPosts } from "@/lib/blog-data";
import { getLocalizedBlogHref } from "@/lib/blogSlugs";

const BLOG_HIGHLIGHT_IDS = [
  "post-1",
  "com-2",
  "com-4",
] as const;

const BLOG_CARD_COPY = {
  en: {
    "post-1": {
      category: "Health & Wellbeing",
      title: "The everyday health benefits of extra virgin olive oil",
      excerpt:
        "More than a condiment, proper EVOO is a daily ally for energy, recovery, and cardiovascular wellbeing.",
    },
    "com-2": {
      category: "Serving Suggestions",
      title: "How to pair a delicate, light-fruity EVOO",
      excerpt:
        "A light-fruity extra virgin brings balance, freshness, and precision to seafood, vegetables, and refined everyday cooking.",
    },
    "com-4": {
      category: "Selection Guide",
      title: "When to use an intense fruity EVOO",
      excerpt:
        "Structured, peppery and green on the nose, an intense fruity oil shines on legumes, grilled vegetables, soups, and robust dishes.",
    },
  },
  de: {
    "post-1": {
      category: "Gesundheit & Wohlbefinden",
      title: "Die täglichen gesundheitlichen Vorteile von nativem Olivenöl extra",
      excerpt:
        "Mehr als nur eine Zutat: Echtes EVO-Öl ist ein täglicher Verbündeter für Energie, Regeneration und Herz-Kreislauf-Wohlbefinden.",
    },
    "com-2": {
      category: "Serviervorschläge",
      title: "Wie man ein mild-fruchtiges natives Olivenöl extra kombiniert",
      excerpt:
        "Ein mild-fruchtiges natives Olivenöl extra bringt Ausgewogenheit, Frische und Präzision in Fischgerichte, Gemüse und die feine Alltagsküche.",
    },
    "com-4": {
      category: "Auswahlhilfe",
      title: "Wann man ein intensiv-fruchtiges natives Olivenöl extra verwendet",
      excerpt:
        "Strukturiert, pfeffrig und grün in der Nase: Ein intensiv-fruchtiges Öl passt hervorragend zu Hülsenfrüchten, gegrilltem Gemüse, Suppen und kräftigen Gerichten.",
    },
  },
  nl: {
    "post-1": {
      category: "Gezondheid & Welzijn",
      title: "De dagelijkse gezondheidsvoordelen van extra vierge olijfolie",
      excerpt:
        "Meer dan alleen een smaakmaker: echte extra vierge olijfolie is een dagelijkse bondgenoot voor energie, herstel en cardiovasculair welzijn.",
    },
    "com-2": {
      category: "Serveersuggesties",
      title: "Hoe combineer je een mild-fruchtige olijfolie extra vierge",
      excerpt:
        "Een mild-fruchtige olijfolie extra vierge brengt balans, frisheid en precisie bij zeevruchten, groenten en verfijnde alledaagse gerechten.",
    },
    "com-4": {
      category: "Keuzegids",
      title: "Wanneer gebruik je een intens-fruchtige olijfolie extra vierge",
      excerpt:
        "Gestructureerd, gepeperd en groen in de neus: een intens-fruchtige olijfolie blinkt uit bij peulvruchten, gegrilde groenten, soepen en stevige gerechten.",
    },
  },
  da: {
    "post-1": {
      category: "Sundhed & Velvære",
      title: "De daglige sundhedsmæssige fordele ved ekstra jomfruolivenolie",
      excerpt:
        "Mere end blot et tilbehør: ægte ekstra jomfruolivenolie er een daglig allieret for energi, restitution og hjerte-kar-velvære.",
    },
    "com-2": {
      category: "Serveringsforslag",
      title: "Hvordan man sammensætter en mild-frugtig ekstra jomfruolivenolie",
      excerpt:
        "En mild-frugtig ekstra jomfruolivenolie bringer balance, friskhed og præcision til fisk og skaldyr, grøntsager og raffineret hverdagsmad.",
    },
    "com-4": {
      category: "Valgguide",
      title: "Hvornår man skal bruge en intens-frugtig ekstra jomfruolivenolie",
      excerpt:
        "Struktureret, pebret og grøn i duften: en intens-frugtig olie er fantastisk til bælgfrugter, grillede grøntsager, supper og kraftige retter.",
    },
  },
  no: {
    "post-1": {
      category: "Helse & Velvære",
      title: "De daglige helsefordelene med ekstra virgin olivenolje",
      excerpt:
        "Mer enn bare et krydder: ekte ekstra virgin olivenolje er en daglig alliert for energi, restitusjon og hjerte-kar-velvære.",
    },
    "com-2": {
      category: "Serveringsforslag",
      title: "Hvordan sette sammen en mild-fruktig ekstra virgin olivenolje",
      excerpt:
        "En mild-fruktig ekstra virgin olivenolje gir balanse, frishet og presisjon til sjømat, grønnsaker og raffinert hverdagsmat.",
    },
    "com-4": {
      category: "Valgguide",
      title: "Når du skal bruke en intens-fruktig ekstra virgin olivenolje",
      excerpt:
        "Strukturert, pepret og grønn i duften: en intens-fruktig olje er fantastisk til belgfrukter, grillede grønnsaker, supper og kraftige retter.",
    },
  },
} as const;

type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

function localizeBlogPost(post: BlogPost, locale: string): BlogPost {
  if (locale === "it") return post;

  const overrides = BLOG_CARD_COPY[locale as keyof typeof BLOG_CARD_COPY];
  if (!overrides) {
    const enOverride = BLOG_CARD_COPY.en[post.id as keyof typeof BLOG_CARD_COPY.en];
    if (enOverride) return { ...post, ...enOverride };
    return post;
  }

  const override = overrides[post.id as keyof typeof overrides];
  if (!override) {
    const enOverride = BLOG_CARD_COPY.en[post.id as keyof typeof BLOG_CARD_COPY.en];
    if (enOverride) return { ...post, ...enOverride };
    return post;
  }

  return {
    ...post,
    ...override,
  };
}

export default async function BlogHighlights() {
  const locale = await getLocale();
  const posts = await getBlogPosts(locale);
  const t = await getTranslations({ locale, namespace: "HomePage.BlogHighlights" });
  const postsById = new Map(posts.map((post) => [post.id, post] as const));

  const featuredPosts = (
    locale !== "it"
      ? BLOG_HIGHLIGHT_IDS.map((id) => postsById.get(id)).filter(
          (post): post is BlogPost => Boolean(post)
        )
      : posts.slice(0, 3)
  ).map((post) => localizeBlogPost(post, locale));

  const featuredPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1);

  if (!featuredPost) return null;

  return (
    <section className="bg-[#faf7f1] py-11 text-[#1f1a17] lg:py-13">
      <div className="mx-auto max-w-[92rem] px-4 sm:px-5 lg:px-6 xl:px-8">
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <h2 className="font-serif text-4xl font-light tracking-tight text-[#1f1a17] sm:text-[3.6rem]">
              {t("title")}
            </h2>
            <div className="hidden h-px w-24 bg-[#DCCFBE] md:block" />
          </div>

          <Link
            href="/blog"
            className="mt-3 inline-flex border-b border-[#A99E91] pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6E655B] transition-colors duration-300 hover:text-[#314030]"
          >
            {t("cta")}
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
              href={getLocalizedBlogHref(featuredPost, locale)}
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
                <Link href={getLocalizedBlogHref(post, locale)} className="block">
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
