import { getBlogPosts } from "@/lib/blog-data";
import { Link, redirect } from "@/i18n/routing";
import Image from "next/image";
import { ChevronRight, FilterX, Clock, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import {
    getBlogCategoryHref,
    getLocalizedBlogHref,
    safeDecodeURIComponent,
    findCategoryNameBySlug,
    normalizeBlogSlug,
} from "@/lib/blogSlugs";
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";


export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const titles = {
        it: "Blog & Notizie | Frantoio del Pasqua",
        en: "Blog & News | Frantoio del Pasqua",
        de: "Blog & Neuigkeiten | Frantoio del Pasqua",
        nl: "Blog & Nieuws | Frantoio del Pasqua",
        da: "Blog & Nyheder | Frantoio del Pasqua",
        no: "Blogg & Nyheter | Frantoio del Pasqua"
    };
    const descriptions = {
        it: "Scopri le novità, i consigli di degustazione e i segreti del nostro frantoio. Un blog dedicato all'Olio Extravergine di Oliva.",
        en: "Discover the latest news, tasting tips, and secrets of our olive mill. A blog dedicated to Extra Virgin Olive Oil.",
        de: "Entdecken Sie die neuesten Nachrichten, Verkostungstipps und Geheimnisse unserer Ölmühle. Ein Blog über natives Olivenöl extra.",
        nl: "Ontdek het laatste nieuws, proeverijtips e geheimen di olijfmolen. A blog gewijd aan extra vierge olijfolie.",
        da: "Oplev de seneste nyheder, smagsprøver og hemmeligheder i vores oliemølle. En blog dedikeret til ekstra jomfruolivenolie.",
        no: "Oppdag de siste nyhetene, smaksprøver og hemmeligheder i oljemøllen vår. En blogg dedikert til ekstra virgin olivenolje."
    };

    return pageMetadata({
        title: titles[locale as keyof typeof titles] || titles.it,
        description: descriptions[locale as keyof typeof descriptions] || descriptions.it,
        path: "/blog/",
        locale,
        hreflang: true,
    });
}

export default async function BlogPage({
    params,
}: {
    params: Promise<{ locale: string; category?: string }>;
}) {
    const { locale, category } = await params;
    
    const homeUrl = absoluteUrl(localizedPath("/", locale));
    const blogUrl = absoluteUrl(localizedPath("/blog", locale));

    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": homeUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": locale === "en" ? "Magazine" : "Il Magazine",
                "item": blogUrl
            }
        ]
    };
    const allPosts = await getBlogPosts(locale);
    const categories = Array.from(new Set(allPosts.map(p => p.category)));

    let selectedCategory: string | undefined = undefined;

    if (category) {
        const correctCategoryName = findCategoryNameBySlug(category, locale);
        if (correctCategoryName) {
            selectedCategory = correctCategoryName;
            const correctSlug = normalizeBlogSlug(correctCategoryName);
            if (normalizeBlogSlug(category) !== correctSlug) {
                redirect({
                    href: getBlogCategoryHref(correctCategoryName),
                    locale,
                });
            }
        }
    }
    const filteredPosts = selectedCategory
        ? allPosts.filter(p => {
            const catLower = p.category.toLowerCase().trim();
            const selLower = selectedCategory.toLowerCase().trim();
            const decodedSel = safeDecodeURIComponent(selectedCategory).toLowerCase().trim();
            return catLower === selLower || catLower === decodedSel;
        })
        : allPosts;

    // Local translations
    const ui = {
        title: {
            it: "La cultura dell'Extravergine",
            en: "The Culture of Extra Virgin",
            de: "Die Kultur des nativen Olivenöls",
            nl: "De Cultuur van Extra Vierge",
            da: "Kulturen af ekstra jomfruolivenolie",
            no: "Kulturen av ekstra virgin olivenolje"
        }[locale] || "La cultura dell'Extravergine",
        subtitle: {
            it: "Approfondimenti, scienza e consigli dal nostro Frantoio",
            en: "Insights, science and advice from our Olive Mill",
            de: "Einblicke, Wissenschaft und Ratschläge aus unserer Ölmühle",
            nl: "Inzichten, wetenschap en advies van onze olijfmolen",
            da: "Indsigt, videnskab og råd fra vores oliemølle",
            no: "Innsikt, vitenskap og råd fra oljemøllen vår"
        }[locale] || "Approfondimenti, scienza e consigli dal nostro Frantoio",
        filterLabel: {
            it: "Stai visualizzando gli articoli della categoria: ",
            en: "Viewing articles in the category: ",
            de: "Artikel der Kategorie: ",
            nl: "Artikelen in de categorie: ",
            da: "Viser artikler i kategorien: ",
            no: "Viser artikler i kategorien: "
        }[locale] || "Stai visualizzando gli articoli della categoria: ",
        readMore: {
            it: "Leggi",
            en: "Read",
            de: "Lesen",
            nl: "Lezen",
            da: "Læs",
            no: "Les"
        }[locale] || "Leggi",
        filterHeading: {
            it: "Filtra per Argomento",
            en: "Filter by Topic",
            de: "Nach Thema filtern",
            nl: "Filteren op onderwerp",
            da: "Filtrer efter emne",
            no: "Filtrer etter emne"
        }[locale] || "Filtra per Argomento",
        removeFilter: {
            it: "Rimuovi filtro",
            en: "Remove filter",
            de: "Filter entfernen",
            nl: "Filter verwijderen",
            da: "Fjern filter",
            no: "Fjern filter"
        }[locale] || "Rimuovi filtro",
        noArticles: {
            it: "Nessun articolo trovato",
            en: "No articles found",
            de: "Keine Artikel gefunden",
            nl: "Geen artikelen gevonden",
            da: "Ingen artikler fundet",
            no: "Ingen artikler funnet"
        }[locale] || "Nessun articolo trovato",
        noArticlesSub: {
            it: "Non ci sono articoli per questa categoria al momento.",
            en: "There are no articles for this category at the moment.",
            de: "Momentan gibt es keine Artikel in dieser Kategorie.",
            nl: "Er zijn momenteel geen artikelen in deze categorie.",
            da: "Der er i øjeblikket ingen artikler i denne kategori.",
            no: "Det er foreløpig ingen artikler i denne kategorien."
        }[locale] || "Non ci sono articoli per questa categoria al momento.",
        allArticlesBtn: {
            it: "Tutti gli articoli",
            en: "All articles",
            de: "Alle Artikel",
            nl: "Alle artikelen",
            da: "Alle artikler",
            no: "Alle artikler"
        }[locale] || "Tutti gli articoli",
        promoTitle: {
            it: "Assapora l'autenticità",
            en: "Taste the Authenticity",
            de: "Schmecken Sie die Authentizität",
            nl: "Proef de authenticiteit",
            da: "Smag autenticiteten",
            no: "Smak autentisiteten"
        }[locale] || "Assapora l'autenticità",
        promoSub: {
            it: "Scopri i nostri oli direttamente nel luogo in cui nascono.",
            en: "Discover our oils directly in the place where they are born.",
            de: "Entdecken Sie unsere Öle direkt an ihrem Ursprungsort.",
            nl: "Ontdek onze oliën direct op de plek waar ze worden geboren.",
            da: "Oplev vores olier direkte på stedet, hvor de bliver produceret.",
            no: "Oppdag oljene våre direkte på stedet der de blir produsert."
        }[locale] || "Scopri i nostri oli direttamente nel luogo in cui nascono.",
        promoBtn: {
            it: "Prenota",
            en: "Book Now",
            de: "Jetzt buchen",
            nl: "Nu boeken",
            da: "Book nu",
            no: "Bestill nå"
        }[locale] || "Prenota",
        home: {
            it: "Home",
            en: "Home",
            de: "Startseite",
            nl: "Home",
            da: "Hjem",
            no: "Hjem"
        }[locale] || "Home",
        magazine: {
            it: "Il Magazine",
            en: "Magazine",
            de: "Magazin",
            nl: "Magazine",
            da: "Magasin",
            no: "Magasin"
        }[locale] || "Il Magazine"
    };

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <style dangerouslySetInnerHTML={{ __html: `
                .blog-page-custom-radius .rounded-2xl { border-radius: 5px !important; }
                .blog-page-custom-radius .rounded-xl { border-radius: 5px !important; }
                .blog-page-custom-radius .rounded-lg { border-radius: 5px !important; }
                .blog-page-custom-radius .rounded-full { border-radius: 5px !important; }
            `}} />
            <main className="flex-1 pt-24 pb-24 sm:pt-32 sm:pb-32 blog-page-custom-radius">

                {/* Page Header */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-5">
                        <Link href="/" className="hover:text-stone-900 transition-colors">{ui.home}</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-stone-900">{ui.magazine}</span>
                    </div>
                    <div className="border-b border-stone-100 pb-8">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-3">
                            {ui.title}
                        </h1>
                        <p className="text-base text-stone-500 font-normal max-w-2xl">
                            {selectedCategory
                                ? ui.filterLabel
                                : ui.subtitle
                            }
                            {selectedCategory && <span className="font-semibold text-[#3D5A3D]">{selectedCategory}</span>}
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px] lg:gap-14 items-start">

                        {/* Articles */}
                        <div className="order-2 lg:order-1 flex flex-col divide-y divide-stone-100">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post, idx) => (
                                    <article key={post.id} className="group py-10 first:pt-0 last:pb-0">
                                        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                                            {/* Thumbnail */}
                                            <div className="relative w-full sm:w-52 lg:w-64 h-48 sm:h-40 lg:h-44 shrink-0 rounded-2xl overflow-hidden bg-stone-100">
                                                <Link href={getLocalizedBlogHref(post, locale)} className="absolute inset-0 z-10" aria-label={post.title} />
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    sizes="(min-width: 1024px) 256px, (min-width: 640px) 208px, 100vw"
                                                    priority={idx === 0}
                                                />
                                            </div>

                                            {/* Text */}
                                            <div className="flex flex-col justify-center flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                                    <Link
                                                        href={getBlogCategoryHref(post.category)}
                                                        className="text-[11px] font-bold uppercase tracking-widest text-[#3D5A3D] hover:underline underline-offset-4"
                                                    >
                                                        {post.category}
                                                    </Link>
                                                    <span className="text-stone-200">·</span>
                                                    <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {post.readingTime}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-[#3D5A3D] transition-colors duration-200 leading-snug mb-3 line-clamp-2">
                                                    <Link href={getLocalizedBlogHref(post, locale)}>
                                                        {post.title}
                                                    </Link>
                                                </h2>
                                                <p className="text-sm sm:text-base leading-relaxed text-stone-500 mb-4 line-clamp-2 font-normal">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wide">
                                                        {post.author} · <time dateTime={post.date}>{new Date(post.date).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}</time>
                                                    </div>
                                                    <Link
                                                        href={getLocalizedBlogHref(post, locale)}
                                                        className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#3D5A3D] opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        {ui.readMore} <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="text-center py-24 rounded-2xl border border-stone-100 bg-stone-50">
                                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">{ui.noArticles}</h3>
                                    <p className="text-stone-500 mb-6 text-sm">{ui.noArticlesSub}</p>
                                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#3D5A3D] border border-[#3D5A3D]/30 px-6 py-3 rounded-full hover:bg-[#3D5A3D]/5 transition-colors">
                                        {ui.allArticlesBtn}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="order-1 lg:order-2 space-y-8 lg:sticky lg:top-32">

                            {/* Category Filter */}
                            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-400 mb-5 pb-3 border-b border-stone-200">
                                    {ui.filterHeading}
                                </h3>

                                {selectedCategory && (
                                    <Link
                                        href="/blog"
                                        className="flex items-center gap-2 text-[11px] font-bold text-red-500 mb-4 hover:text-red-600 transition-colors"
                                    >
                                        <FilterX className="w-3.5 h-3.5" /> {ui.removeFilter}
                                    </Link>
                                )}

                                   <ul className="space-y-1">
                                    {categories.map((cat) => {
                                        const isSelected = selectedCategory 
                                            ? cat.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
                                            : false;
                                        const count = allPosts.filter(p => p.category === cat).length;
                                        return (
                                            <li key={cat}>
                                                <Link
                                                    href={getBlogCategoryHref(cat)}
                                                    className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isSelected
                                                        ? 'bg-[#3D5A3D] text-white'
                                                        : 'text-stone-600 hover:bg-stone-100 hover:text-zinc-900'
                                                        }`}
                                                >
                                                    <span>{cat}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold transition-colors ${isSelected
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-stone-200 text-stone-500 group-hover:bg-stone-300'
                                                        }`}>
                                                        {count}
                                                    </span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Featured Promo */}
                            <div className="bg-zinc-900 text-white rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-[#3D5A3D]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                <h3 className="text-lg font-bold tracking-tight mb-2 relative z-10">{ui.promoTitle}</h3>
                                <p className="text-sm text-zinc-400 mb-6 relative z-10 leading-relaxed">
                                    {ui.promoSub}
                                </p>
                                <Link
                                    href="/degustazioni"
                                    className="inline-flex items-center gap-2 relative z-10 bg-white text-zinc-900 text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:bg-stone-100 transition-colors"
                                >
                                    {ui.promoBtn} <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                        </aside>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
