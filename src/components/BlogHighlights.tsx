import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog-data";

export default async function BlogHighlights() {
    const posts = await getBlogPosts();
    // Prendiamo 4 articoli per fare il layout a mosaico
    const latestPosts = posts.slice(0, 4);

    if (!latestPosts.length) return null;

    return (
        <section className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header section - matching the requested design */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 sm:mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3D5A3D] animate-pulse" />
                            <span className="text-[10px] font-medium tracking-[0.2em] text-stone-600 uppercase">
                                Novità
                            </span>
                        </div>
                        <h2 className="text-4xl font-light tracking-tight text-stone-900 sm:text-5xl font-serif">
                            Dal nostro <i className="font-serif text-[#3D5A3D]">Magazine</i>
                        </h2>
                    </div>
                    <Link
                        href="/blog"
                        className="group hidden md:inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white shadow-sm px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-900 hover:bg-stone-50 hover:border-stone-300 transition-all duration-300 whitespace-nowrap"
                    >
                        Tutti gli articoli
                        <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-[#3D5A3D] transition-colors" />
                    </Link>
                </div>

                {/* Mosaico Bento Box */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 lg:auto-rows-[300px]">
                    {latestPosts.map((post, idx) => {
                        let spanClasses = "";
                        let titleClass = "";
                        let imageSizes = "";

                        // Define structural classes based on index to create the mosaic
                        if (idx === 0) {
                            // Grande: Metà larghezza schermo, prende 2 righe in altezza
                            spanClasses = "col-span-2 md:col-span-2 lg:col-span-2 lg:row-span-2";
                            titleClass = "text-3xl sm:text-4xl lg:text-5xl";
                            imageSizes = "(min-width: 1024px) 50vw, 100vw";
                        } else if (idx === 1) {
                            // Largo: Cima destra, prende 2 colonne di larghezza
                            spanClasses = "col-span-2 md:col-span-2 lg:col-span-2 lg:row-span-1";
                            titleClass = "text-2xl sm:text-3xl lg:text-4xl";
                            imageSizes = "(min-width: 1024px) 50vw, 100vw";
                        } else {
                            // Quadrati: In basso a destra
                            spanClasses = "col-span-1 md:col-span-1 lg:col-span-1 lg:row-span-1";
                            titleClass = "text-[16px] leading-[1.2] sm:text-2xl lg:text-2xl";
                            imageSizes = "(min-width: 1024px) 25vw, 50vw";
                        }

                        // Add responsive min-heights just in case, but rely on grid auto-rows mostly
                        const minHeightClass = idx === 0 ? "min-h-[400px] sm:min-h-[450px]" : idx === 1 ? "min-h-[300px] sm:min-h-[350px] lg:min-h-0" : "min-h-[220px] sm:min-h-[250px] lg:min-h-0";
                        const paddingClass = idx > 1 ? "px-4 sm:px-8 pb-5 sm:pb-8 pt-24 sm:pt-60 lg:pt-0" : "px-6 sm:px-8 pb-8 pt-48 sm:pt-60 lg:pt-0";

                        return (
                            <article
                                key={post.id}
                                className={`group relative flex flex-col items-start justify-end overflow-hidden rounded-xl bg-stone-900 w-full h-full ${paddingClass} ${spanClasses} ${minHeightClass}`}
                            >
                                <Image
                                    src={post.imageUrl}
                                    alt={post.title}
                                    fill
                                    className="absolute inset-0 z-0 object-cover object-center transition-transform duration-[1000ms] ease-out group-hover:scale-105 opacity-80"
                                    sizes={imageSizes}
                                />
                                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/30 transition-opacity duration-500 group-hover:opacity-100" />

                                <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-30" />

                                <div className="relative z-20 flex w-full flex-col justify-end h-full">
                                    <h3 className={`font-serif text-white group-hover:text-[#E8F0E8] transition-colors duration-300 leading-[1.15] mb-3 transform translate-y-2 group-hover:translate-y-0 will-change-transform ${titleClass}`}>
                                        {post.title}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-sm leading-6 text-stone-300 mb-2 sm:mb-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 will-change-transform">
                                        <time dateTime={post.date} className="font-medium tracking-wide text-xs sm:text-sm">
                                            {new Date(post.date).toLocaleDateString("it-IT", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </time>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-stone-500" />
                                            <span className="uppercase tracking-[0.15em] text-[9px] sm:text-[10px] font-bold text-white bg-white/10 px-2 sm:px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`mt-auto flex items-center justify-between lg:opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 will-change-transform ${idx === 0 ? 'sm:mt-8' : 'sm:mt-6'} ${idx > 1 ? 'hidden sm:flex' : ''}`}>
                                        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white font-bold flex items-center gap-2 hover:text-stone-300 transition-colors">
                                            Leggi articolo
                                            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Bottone visibile solo su mobile */}
                <div className="mt-12 flex justify-center md:hidden">
                    <Link
                        href="/blog"
                        className="group inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-stone-900 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all duration-300 w-full"
                    >
                        Tutti gli articoli
                        <ArrowUpRight className="h-4 w-4 text-stone-400 group-hover:text-[#3D5A3D] transition-colors" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
