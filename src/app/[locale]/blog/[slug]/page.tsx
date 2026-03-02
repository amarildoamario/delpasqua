import { getBlogPostBySlug, getBlogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ChevronRight, Share2, Printer, Tag, User, Clock, CalendarDays, RefreshCcw, ArrowRight, ExternalLink, BookOpen } from "lucide-react";
import Footer from "@/components/Footer";

import { Metadata } from 'next';

export async function generateMetadata(
    { params }: { params: Promise<{ slug: string, locale: string }> }
): Promise<Metadata> {
    const { slug, locale } = await params;
    const post = await getBlogPostBySlug(slug);

    if (!post) return { title: "Post non trovato" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.frantoiodelpasqua.com";
    const postUrl = `${baseUrl}/${locale}/blog/${post.slug}`;
    const imageUrl = post.imageUrl.startsWith("http") ? post.imageUrl : `${baseUrl}${post.imageUrl}`;

    return {
        title: `${post.title} | Blog Frantoio del Pasqua`,
        description: post.excerpt,
        authors: [{ name: post.author }],
        keywords: [post.category, "olio extravergine", "Frantoio del Pasqua", "olio EVO", "conservazione olio", "qualità olio"],
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: postUrl,
            siteName: "Frantoio del Pasqua",
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                }
            ],
            locale: locale === 'it' ? 'it_IT' : (locale === 'en' ? 'en_US' : 'de_DE'),
            type: "article",
            publishedTime: post.date,
            modifiedTime: post.updateDate,
            authors: [post.author],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: [imageUrl],
        },
        robots: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    const allPosts = await getBlogPosts();

    if (!post) notFound();

    const categories = Array.from(new Set(allPosts.map(p => p.category)));
    const relatedPosts = allPosts.filter(p => p.category === post.category && p.id !== post.id).slice(0, 3);

    // Build TOC from headings
    const toc: { title: string; id: string; level: number }[] = [];
    post.content.split('\n\n').forEach((block) => {
        if (block.startsWith('## ')) {
            const title = block.replace('## ', '');
            const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            toc.push({ title, id, level: 2 });
        } else if (block.startsWith('### ')) {
            const title = block.replace('### ', '');
            const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            toc.push({ title, id, level: 3 });
        }
    });

    const renderInline = (text: string) => {
        return text
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-bold text-zinc-900"><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-zinc-900">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em class="italic text-stone-700">$1</em>')
            .replace(/_([^_]+)_/g, '<em class="italic text-stone-700">$1</em>')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
                '<a href="$2" target="_blank" rel="noopener" class="text-[#3D5A3D] font-semibold underline underline-offset-2 decoration-[#3D5A3D]/40 hover:decoration-[#3D5A3D] transition-all">$1</a>')
            .replace(/\[([^\]]+)\]\(\/([^\)]*)\)/g,
                '<a href="/$2" class="text-[#3D5A3D] font-semibold underline underline-offset-2 decoration-[#3D5A3D]/40 hover:decoration-[#3D5A3D] transition-all">$1</a>');
    };

    let h2Counter = 0;

    const renderContent = (content: string) => {
        const blocks = content.split(/\n\n+/);
        const elements: React.ReactNode[] = [];

        for (let idx = 0; idx < blocks.length; idx++) {
            const block = blocks[idx].trim();
            if (!block) continue;

            if (block.startsWith('## ')) {
                h2Counter++;
                const title = block.replace(/^## /, '');
                const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                elements.push(
                    <h2 key={idx} id={id} className="flex items-start gap-4 mt-16 mb-6 scroll-mt-32 group">
                        <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#3D5A3D]/10 flex items-center justify-center text-[#3D5A3D] font-black text-sm mt-0.5 group-hover:bg-[#3D5A3D] group-hover:text-white transition-colors">
                            {h2Counter}
                        </span>
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-snug">{title}</span>
                    </h2>
                );
                continue;
            }

            if (block.startsWith('### ')) {
                const title = block.replace(/^### /, '');
                const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                elements.push(
                    <h3 key={idx} id={id} className="flex items-center gap-3 mt-10 mb-4 scroll-mt-32">
                        <span className="w-1 h-6 rounded-full bg-[#3D5A3D] flex-shrink-0" />
                        <span className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-800">{title}</span>
                    </h3>
                );
                continue;
            }

            if (block.startsWith('> ')) {
                const text = block.replace(/^> /gm, '');
                elements.push(
                    <blockquote key={idx} className="my-8 border-l-4 border-[#3D5A3D] pl-6 py-1">
                        <p className="text-lg italic text-stone-600 leading-relaxed font-normal"
                            dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
                    </blockquote>
                );
                continue;
            }

            if (block.startsWith(':::cta')) {
                const inner = block.replace(/^:::cta\s*/, '').replace(/:::$/, '').trim();
                const lines = inner.split('\n');
                const ctaTitle = lines[0] || '';
                const ctaText = lines[1] || '';
                const ctaLinkMatch = (lines[2] || '').match(/\[([^\]]+)\]\(([^\)]+)\)/);
                elements.push(
                    <div key={idx} className="my-10 bg-zinc-900 text-white rounded-2xl p-7 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#3D5A3D]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        {ctaTitle && <p className="text-lg font-bold mb-2 relative z-10">{ctaTitle}</p>}
                        {ctaText && <p className="text-sm text-zinc-400 mb-5 relative z-10 leading-relaxed">{ctaText}</p>}
                        {ctaLinkMatch && (
                            <a href={ctaLinkMatch[2]} className="relative z-10 inline-flex items-center gap-2 bg-white text-zinc-900 text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:bg-stone-100 transition-colors">
                                {ctaLinkMatch[1]} →
                            </a>
                        )}
                    </div>
                );
                continue;
            }

            if (/^[-*]\s/.test(block)) {
                const items = block.split('\n').filter(l => /^[-*]\s/.test(l.trim()));
                elements.push(
                    <ul key={idx} className="my-6 space-y-3">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-2.5 w-2 h-2 rounded-full bg-[#3D5A3D] flex-shrink-0" />
                                <span className="text-base sm:text-lg leading-relaxed text-stone-600"
                                    dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^[-*]\s+/, '')) }} />
                            </li>
                        ))}
                    </ul>
                );
                continue;
            }

            if (/^\d+\.\s/.test(block)) {
                const items = block.split('\n').filter(l => /^\d+\.\s/.test(l.trim()));
                elements.push(
                    <ol key={idx} className="my-6 space-y-3">
                        {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#3D5A3D]/10 flex items-center justify-center text-[#3D5A3D] font-bold text-sm">
                                    {i + 1}
                                </span>
                                <span className="text-base sm:text-lg leading-relaxed text-stone-600 pt-0.5"
                                    dangerouslySetInnerHTML={{ __html: renderInline(item.replace(/^\d+\.\s+/, '')) }} />
                            </li>
                        ))}
                    </ol>
                );
                continue;
            }

            elements.push(
                <p key={idx} className="mb-6 text-base sm:text-lg leading-[1.85] text-stone-600 font-normal"
                    dangerouslySetInnerHTML={{ __html: renderInline(block) }} />
            );
        }

        h2Counter = 0;
        return elements;
    };

    // JSON-LD Schema.org Structured Data
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.frantoiodelpasqua.com";
    const postUrl = `${baseUrl}/it/blog/${post.slug}`;
    const imageUrl = post.imageUrl.startsWith("http") ? post.imageUrl : `${baseUrl}${post.imageUrl}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: imageUrl,
        author: {
            '@type': 'Organization',
            name: post.author,
            url: baseUrl
        },
        publisher: {
            '@type': 'Organization',
            name: 'Frantoio del Pasqua',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/images/logo/logo-del-pasqua.png`
            }
        },
        datePublished: post.date,
        dateModified: post.updateDate || post.date,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': postUrl
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="flex-1 pt-20 sm:pt-28 pb-24 sm:pb-32">

                {/* ── Breadcrumb + Title header ── */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-stone-400 mb-8 pt-4 sm:pt-6">
                        <Link href="/" className="hover:text-zinc-900 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href="/blog" className="hover:text-zinc-900 transition-colors">Magazine</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="text-[#3D5A3D] hover:underline underline-offset-4 decoration-[#3D5A3D]/40">
                            {post.category}
                        </Link>
                    </div>

                    {/* Article header */}
                    <div className="max-w-3xl">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 leading-[1.1] mb-6">
                            {post.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-stone-500 leading-relaxed font-normal mb-8">
                            {post.excerpt}
                        </p>

                        {/* ── Meta bar ── */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 border-y border-stone-100">
                            {/* Author */}
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-[#3D5A3D]/10 flex items-center justify-center">
                                    <User className="w-3.5 h-3.5 text-[#3D5A3D]" />
                                </div>
                                <span className="text-sm font-semibold text-zinc-900">{post.author}</span>
                            </div>
                            {/* Published */}
                            <div className="flex items-center gap-1.5 text-sm text-stone-500">
                                <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
                                <span>
                                    {new Date(post.date).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                                </span>
                            </div>
                            {/* Updated */}
                            <div className="flex items-center gap-1.5 text-sm text-stone-400">
                                <RefreshCcw className="w-3.5 h-3.5" />
                                <span>Agg. {new Date(post.updateDate).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                            {/* Read time */}
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-[#3D5A3D] bg-[#3D5A3D]/8 px-3 py-1 rounded-full">
                                <Clock className="w-3.5 h-3.5" />
                                {post.readingTime} di lettura
                            </div>
                            {/* Category badge */}
                            <Link
                                href={`/blog?category=${encodeURIComponent(post.category)}`}
                                className="flex items-center gap-1.5 text-sm font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 px-3 py-1 rounded-full transition-colors"
                            >
                                <Tag className="w-3.5 h-3.5 text-stone-400" />
                                {post.category}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Hero image + Content ── */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
                    <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-16 items-start">

                        {/* Main article body */}
                        <article>
                            {/* Hero image */}
                            <figure className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-stone-100 border border-stone-100">
                                <Image
                                    src={post.imageUrl}
                                    alt={`Immagine per ${post.title}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 780px"
                                    priority
                                />
                            </figure>

                            {/* Inline TOC (mobile + desktop below xl) */}
                            {toc.length > 0 && (
                                <nav className="xl:hidden bg-stone-50 border border-stone-100 rounded-2xl p-6 mb-10">
                                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-400 mb-4">In questo articolo</h3>
                                    <ul className="space-y-2">
                                        {toc.map((item, idx) => (
                                            <li key={idx} className={item.level === 3 ? 'ml-4 border-l-2 border-stone-200 pl-3' : ''}>
                                                <a
                                                    href={`#${item.id}`}
                                                    className="text-sm font-medium text-stone-600 hover:text-[#3D5A3D] transition-colors block"
                                                >
                                                    {item.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            )}

                            {/* On xl: article + left TOC in a sub-grid */}
                            <div className="xl:flex xl:gap-12 xl:items-start">
                                {/* XL sticky left TOC */}
                                {toc.length > 0 && (
                                    <nav className="hidden xl:block w-52 shrink-0 sticky top-32">
                                        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-stone-400 mb-4 pb-3 border-b border-stone-100">
                                            Contenuti
                                        </h3>
                                        <ul className="space-y-3">
                                            {toc.map((item, idx) => (
                                                <li key={idx} className={`border-l-2 border-transparent hover:border-[#3D5A3D] transition-colors ${item.level === 3 ? 'ml-3' : ''}`}>
                                                    <a
                                                        href={`#${item.id}`}
                                                        className="text-[13px] font-medium text-stone-500 hover:text-[#3D5A3D] block pl-3 py-0.5 transition-colors"
                                                    >
                                                        {item.title}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </nav>
                                )}

                                {/* Prose content */}
                                <div className="flex-1 min-w-0">
                                    {renderContent(post.content)}
                                </div>
                            </div>

                            {/* Bibliography section */}
                            {post.references && post.references.length > 0 && (
                                <div className="mt-14 pt-8 border-t-2 border-[#3D5A3D]/20">
                                    {/* Header */}
                                    <div className="flex items-center gap-2 mb-6">
                                        <BookOpen className="w-4 h-4 text-[#3D5A3D]" />
                                        <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#3D5A3D]">Fonti e riferimenti scientifici</span>
                                    </div>
                                    {/* References list */}
                                    <ol className="space-y-4">
                                        {post.references.map((ref, i) => (
                                            <li key={i} className="flex items-start gap-3 group">
                                                <span className="shrink-0 text-[11px] font-black text-[#3D5A3D]/50 pt-0.5 w-4 text-right">{i + 1}.</span>
                                                <div className="flex-1 min-w-0">
                                                    <a
                                                        href={ref.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-start gap-1 text-sm font-medium text-zinc-700 hover:text-[#3D5A3D] transition-colors leading-snug group/link"
                                                    >
                                                        <span className="underline underline-offset-2 decoration-stone-300 group-hover/link:decoration-[#3D5A3D] transition-colors">{ref.label}</span>
                                                        <ExternalLink className="w-3 h-3 shrink-0 text-stone-400 group-hover/link:text-[#3D5A3D] transition-colors mt-0.5" />
                                                    </a>
                                                    {ref.note && (
                                                        <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{ref.note}</p>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* Bottom toolbar */}

                            <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 self-center mr-1">Tag:</span>
                                    <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors text-xs font-bold text-stone-700">
                                        {post.category}
                                    </Link>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-xs font-bold text-stone-500">
                                        Olio EVO
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#3D5A3D] border border-[#3D5A3D]/30 hover:bg-[#3D5A3D]/5 px-4 py-2.5 rounded-full transition-colors">
                                        <Share2 className="w-3.5 h-3.5" /> Condividi
                                    </button>
                                    <button className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-stone-500 border border-stone-200 hover:bg-stone-50 px-4 py-2.5 rounded-full transition-colors">
                                        <Printer className="w-3.5 h-3.5" /> Stampa
                                    </button>
                                </div>
                            </div>
                        </article>

                        {/* Sidebar */}
                        <aside className="hidden lg:block space-y-8 sticky top-32">

                            {/* Categories */}
                            <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6">
                                <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-400 mb-4 pb-3 border-b border-stone-200">
                                    Argomenti
                                </h3>
                                <ul className="space-y-1">
                                    {categories.map((cat) => {
                                        const isActive = cat === post.category;
                                        return (
                                            <li key={cat}>
                                                <Link
                                                    href={`/blog?category=${encodeURIComponent(cat)}`}
                                                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                                        ? 'bg-[#3D5A3D] text-white'
                                                        : 'text-stone-600 hover:bg-stone-100 hover:text-zinc-900'
                                                        }`}
                                                >
                                                    <span>{cat}</span>
                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-stone-200 text-stone-500'}`}>
                                                        {allPosts.filter(p => p.category === cat).length}
                                                    </span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Related in same category */}
                            {relatedPosts.length > 0 && (
                                <div className="bg-stone-50 border border-stone-100 rounded-2xl p-6">
                                    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-400 mb-4 pb-3 border-b border-stone-200">
                                        Nella stessa categoria
                                    </h3>
                                    <div className="space-y-5">
                                        {relatedPosts.map(p => (
                                            <div key={p.id} className="group flex gap-3 items-start">
                                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-100">
                                                    <Image src={p.imageUrl} alt={p.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="56px" />
                                                    <Link href={`/blog/${p.slug}`} className="absolute inset-0 z-10" />
                                                </div>
                                                <div className="relative flex-1 min-w-0">
                                                    <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-[#3D5A3D] line-clamp-2 mb-1 transition-colors leading-snug">
                                                        {p.title}
                                                    </h4>
                                                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wide flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {p.readingTime}
                                                    </span>
                                                    <Link href={`/blog/${p.slug}`} className="absolute inset-0 z-10" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Promo CTA */}
                            <div className="bg-zinc-900 text-white rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3D5A3D]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                <h3 className="text-lg font-bold tracking-tight mb-2 relative z-10">Prenota una degustazione</h3>
                                <p className="text-sm text-zinc-400 mb-5 relative z-10 leading-relaxed">
                                    Vivi l&apos;esperienza dal vivo nel nostro Frantoio in Toscana.
                                </p>
                                <Link href="/degustazioni" className="inline-flex items-center gap-2 relative z-10 bg-white text-zinc-900 text-[11px] font-bold uppercase tracking-widest px-5 py-3 rounded-full hover:bg-stone-100 transition-colors">
                                    Scopri di più <ArrowRight className="w-3.5 h-3.5" />
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
