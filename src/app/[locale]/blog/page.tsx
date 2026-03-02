import { getBlogPosts } from "@/lib/blog-data";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { ChevronRight, FilterX, Clock, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";


export async function generateMetadata() {
    return {
        title: "Blog & Notizie | Frantoio del Pasqua",
        description: "Scopri le novità, i consigli di degustazione e i segreti del nostro frantoio. Un blog dedicato all'Olio Extravergine di Oliva.",
    };
}

export default async function BlogPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const categoryParam = resolvedSearchParams.category;
    const selectedCategory = typeof categoryParam === 'string' ? categoryParam : undefined;

    const allPosts = await getBlogPosts();
    const categories = Array.from(new Set(allPosts.map(p => p.category)));
    const filteredPosts = selectedCategory
        ? allPosts.filter(p => p.category === selectedCategory)
        : allPosts;

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <main className="flex-1 pt-24 pb-24 sm:pt-32 sm:pb-32">

                {/* Page Header */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
                    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-5">
                        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-stone-900">Il Magazine</span>
                    </div>
                    <div className="border-b border-stone-100 pb-8">
                        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 mb-3">
                            La cultura dell&apos;Extravergine
                        </h1>
                        <p className="text-base text-stone-500 font-normal max-w-2xl">
                            {selectedCategory
                                ? `Stai visualizzando gli articoli della categoria: `
                                : "Approfondimenti, scienza e consigli dal nostro Frantoio"
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
                                                <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />
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
                                                        href={`/blog?category=${encodeURIComponent(post.category)}`}
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
                                                    <Link href={`/blog/${post.slug}`}>
                                                        {post.title}
                                                    </Link>
                                                </h2>
                                                <p className="text-sm sm:text-base leading-relaxed text-stone-500 mb-4 line-clamp-2 font-normal">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center justify-between mt-auto">
                                                    <div className="text-[11px] text-stone-400 font-medium uppercase tracking-wide">
                                                        {post.author} · <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</time>
                                                    </div>
                                                    <Link
                                                        href={`/blog/${post.slug}`}
                                                        className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#3D5A3D] opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Leggi <ArrowRight className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="text-center py-24 rounded-2xl border border-stone-100 bg-stone-50">
                                    <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">Nessun articolo trovato</h3>
                                    <p className="text-stone-500 mb-6 text-sm">Non ci sono articoli per questa categoria al momento.</p>
                                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#3D5A3D] border border-[#3D5A3D]/30 px-6 py-3 rounded-full hover:bg-[#3D5A3D]/5 transition-colors">
                                        Tutti gli articoli
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="order-1 lg:order-2 space-y-8 lg:sticky lg:top-32">

                            {/* Category Filter */}
                            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-400 mb-5 pb-3 border-b border-stone-200">
                                    Filtra per Argomento
                                </h3>

                                {selectedCategory && (
                                    <Link
                                        href="/blog"
                                        className="flex items-center gap-2 text-[11px] font-bold text-red-500 mb-4 hover:text-red-600 transition-colors"
                                    >
                                        <FilterX className="w-3.5 h-3.5" /> Rimuovi filtro
                                    </Link>
                                )}

                                <ul className="space-y-1">
                                    {categories.map((cat) => {
                                        const isSelected = cat === selectedCategory;
                                        const count = allPosts.filter(p => p.category === cat).length;
                                        return (
                                            <li key={cat}>
                                                <Link
                                                    href={`/blog?category=${encodeURIComponent(cat)}`}
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
                                <h3 className="text-lg font-bold tracking-tight mb-2 relative z-10">Assapora l&apos;autenticità</h3>
                                <p className="text-sm text-zinc-400 mb-6 relative z-10 leading-relaxed">
                                    Scopri i nostri oli direttamente nel luogo in cui nascono.
                                </p>
                                <Link
                                    href="/degustazioni"
                                    className="inline-flex items-center gap-2 relative z-10 bg-white text-zinc-900 text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:bg-stone-100 transition-colors"
                                >
                                    Prenota <ArrowRight className="w-3.5 h-3.5" />
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
