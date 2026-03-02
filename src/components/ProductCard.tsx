"use client";

import Image from "next/image";
import Link from "next/link";

export type ProductCardProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  imageSrc: string;
  imageAlt: string;
  priceLabel?: string;
};

export default function ProductCard({
  product,
  onClick,
  onOpen,
}: {
  product: ProductCardProduct;
  onClick?: () => void;
  onOpen?: (product: ProductCardProduct) => void;
}) {
  const href = `/shop/${encodeURIComponent(product.slug)}`;

  const handleOpen = () => {
    onClick?.();
    onOpen?.(product);
  };

  // Se c'è onOpen, usa button (modal), altrimenti Link (pagina)
  if (onOpen) {
    return (
      <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#3D5A3D]/20 hover:shadow-xl hover:shadow-[#3D5A3D]/5">
        <button
          type="button"
          data-slug={product.slug}
          data-testid="product-card"
          onClick={handleOpen}
          aria-label={product.title}
          className="flex h-full flex-col text-left"
        >
          <CardInner product={product} />
        </button>
      </article>
    );
  }

  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-[#E7E5E4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#3D5A3D]/20 hover:shadow-xl hover:shadow-[#3D5A3D]/5">
      <Link
        href={href}
        data-slug={product.slug}
        data-testid="product-card"
        onClick={onClick}
        aria-label={product.title}
        className="flex h-full flex-col"
      >
        <CardInner product={product} />
      </Link>
    </article>
  );
}

function CardInner({ product }: { product: ProductCardProduct }) {
  return (
    <>
      {/* Image container - aspect ratio fisso */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F4]">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-full border border-[#D6D3D1] bg-white/80 px-4 py-2 text-[10px] font-medium tracking-wider text-[#78716C] backdrop-blur-sm">
              IMMAGINE PRODOTTO
            </div>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badge */}
        {product.badge ? (
          <div className="absolute left-4 top-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B8860B] px-3 py-1.5 text-[10px] font-medium tracking-wider text-white uppercase shadow-lg">
              {product.badge}
            </span>
          </div>
        ) : null}

        {/* Quick action button - desktop hover */}
        <div className="absolute bottom-4 left-4 right-4 hidden translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Qui il tuo handler per aggiungere al carrello
              console.log("Aggiungi al carrello:", product.id);
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-xs font-medium tracking-wider text-[#1C1917] shadow-lg transition hover:bg-[#3D5A3D] hover:text-white"
          >
            <IconPlus className="h-4 w-4" />
            AGGIUNGI
          </button>
        </div>
      </div>

      {/* Content - flex-1 per uniformare l'altezza */}
      <div className="flex flex-1 flex-col p-5">
        {/* Subtitle */}
        <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
          {product.subtitle || "Olio EVO"}
        </div>

        {/* Title - line-clamp per uniformare */}
        <h3 className="mt-2 font-serif text-lg font-light leading-tight tracking-tight text-[#1C1917] line-clamp-2 transition-colors group-hover:text-[#3D5A3D]">
          {product.title}
        </h3>

        {/* Price - mt-auto per spingere in fondo */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-light text-[#1C1917]">
                {product.priceLabel || "€ 0,00"}
              </span>
              <span className="text-xs text-[#8B7355]">+ IVA</span>
            </div>
            
            {/* Mobile: icona + invece di testo */}
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E7E5E4] text-[#57534E] transition group-hover:border-[#3D5A3D] group-hover:bg-[#3D5A3D] group-hover:text-white sm:hidden">
              <IconPlus className="h-4 w-4" />
            </span>
          </div>

          {/* Linea decorativa */}
          <div className="mt-3 h-px w-10 bg-[#E7E5E4] transition-all duration-300 group-hover:w-20 group-hover:bg-[#3D5A3D]" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-[#3D5A3D] to-[#B8860B] transition-all duration-300 group-hover:w-full" />
    </>
  );
}

function IconPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}