"use client";

import ProductCardImage from "@/components/ProductCardImage";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { track } from "@/lib/analytics/track";
import type { getBlogProducts } from "@/lib/server/blogProducts";
import { cn } from "@/lib/utils";

type BlogProduct = Awaited<ReturnType<typeof getBlogProducts>>[number];

export default function BlogProductCard({ product }: { product: BlogProduct }) {
  const { article, locale, position, productKey, variantKey } = product;
  const besideTitle = position === "title";

  function trackClick() {
    track({ type: "blog_product_click", productKey, variantKey, data: { article, locale, position } });
  }

  return (
    <Link
      href={product.href}
      prefetch={false}
      onClick={trackClick}
      onAuxClick={(event) => { if (event.button === 1) trackClick(); }}
      data-blog-product={position}
      className={cn(
        "group/product flex w-full max-w-[44rem] cursor-pointer items-center gap-3.5 rounded-[8px] border border-[#dcd8ca] bg-white p-3.5 text-[#17291d] no-underline shadow-[0_3px_14px_rgba(39,47,32,0.05)]",
        "hover:border-[#898f77] hover:shadow-[0_8px_24px_rgba(39,47,32,0.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#365a3c] motion-safe:transition-[box-shadow,border-color] lg:gap-6 lg:p-5",
        besideTitle && "lg:flex-col lg:items-stretch lg:gap-5 lg:p-5",
      )}
    >
      <div className={cn(
        "relative min-h-[140px] w-[29%] max-w-36 shrink-0 self-stretch motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/product:scale-[1.025] lg:w-[31%] lg:max-w-[204px]",
        besideTitle && "lg:aspect-[4/3] lg:w-full lg:max-w-none",
      )}>
        <ProductCardImage src={product.image} alt="" sizes="(min-width: 1024px) 320px, 240px" plain />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn(
          "text-balance font-serif text-[1.3rem] font-semibold leading-[1.15] tracking-tight lg:text-[1.65rem]",
          besideTitle && "lg:text-2xl",
        )}>
          {product.title}
        </p>
        <p className="mt-2 text-xs font-semibold tracking-[0.06em] text-[#716451]">{product.label}</p>
        <div className={cn(
          "mt-3 flex flex-col gap-3 border-t border-[#e6e2d8] pt-3 lg:mt-4 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-4",
          besideTitle && "lg:flex-col lg:items-stretch lg:gap-3.5",
        )}>
          <p className="whitespace-nowrap text-xl font-bold leading-none tracking-tight tabular-nums">
            {product.price}
          </p>
          <span className="inline-flex min-h-11 items-center justify-between gap-3 rounded-[5px] bg-[#173622] px-3.5 py-2.5 text-sm font-semibold leading-snug text-white group-hover/product:bg-[#264b32] group-focus-visible/product:bg-[#264b32] motion-safe:transition-colors">
            <span>{product.viewProduct}</span>
            <ArrowRight aria-hidden="true" className="size-4 shrink-0 motion-safe:transition-transform motion-safe:group-hover/product:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
