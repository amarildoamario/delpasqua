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

  return (
    <article className="group overflow-hidden rounded-[12px] border border-black/5 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-zinc-950">
      {onOpen ? (
        <button
          type="button"
          data-slug={product.slug}
          data-testid="product-card"
          onClick={handleOpen}
          aria-label={product.title}
          className="block text-left"
        >
          <CardInner product={product} />
        </button>
      ) : (
        <Link
          href={href}
          data-slug={product.slug}
          data-testid="product-card"
          onClick={onClick}
          aria-label={product.title}
          className="block"
        >
          <CardInner product={product} />
        </Link>
      )}
    </article>
  );
}

function CardInner({ product }: { product: ProductCardProduct }) {
  return (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={product.imageSrc}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

        {product.badge ? (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] tracking-[0.16em] text-zinc-800 backdrop-blur dark:bg-black/60 dark:text-white">
            {product.badge}
          </div>
        ) : null}
      </div>

      <div className="px-4 pb-4 pt-4">
        <div className="font-serif text-base tracking-[0.06em] text-zinc-900 dark:text-white">
          {product.title}
        </div>

        <div className="mt-1 text-xs tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
          {product.subtitle}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm tracking-[0.10em] text-zinc-900 dark:text-white">
            {product.priceLabel ?? ""}
          </div>

          <span className="inline-flex items-center gap-2 text-sm tracking-[0.10em] text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white">
            Vedi <span aria-hidden="true">→</span>
          </span>
        </div>

        <div className="mt-3 h-px w-10 bg-zinc-200 transition-all duration-300 group-hover:w-20 dark:bg-white/15" />
      </div>
    </>
  );
}
