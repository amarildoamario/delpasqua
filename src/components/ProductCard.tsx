"use client"

import Image from "next/image"
import { ArrowRight, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCallback, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ToggleMessage from "@/components/ui/ToggleMessage"
import { useCart } from "@/context/CartContext"
import { getOrCreateCartId } from "@/lib/analytics/cartId"
import { track } from "@/lib/analytics/track"

export type ProductCardProduct = {
  id: string
  slug: string
  title: string
  subtitle: string
  badge?: string
  imageSrc: string
  imageAlt: string
  priceLabel?: string
  priceCaption?: string
  priceCents?: number
  defaultVariantId?: string
}

const shellClassName =
  "group relative flex h-full w-full overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-[#faf7f2] text-[#1f1a17] shadow-[0_18px_50px_rgba(31,26,23,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#c8ab8f] hover:shadow-[0_24px_64px_rgba(31,26,23,0.12)]"

export default function ProductCard({
  product,
  onClick,
  onOpen,
}: {
  product: ProductCardProduct
  onClick?: () => void
  onOpen?: (product: ProductCardProduct) => void
}) {
  const href = `/shop/${encodeURIComponent(product.slug)}`
  const { add } = useCart()
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const showToast = useCallback((message: string) => {
    setToastMsg(message)
    setToastOpen(true)
  }, [])

  const handleOpen = () => {
    onClick?.()
    onOpen?.(product)
  }

  const handleAdd = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      if (!product.defaultVariantId) {
        showToast("Apri il prodotto per scegliere il formato.")
        return
      }

      add({ productId: product.id, variantId: product.defaultVariantId, qty: 1 })

      track({
        type: "add_to_cart",
        cartId: getOrCreateCartId(),
        productKey: product.id,
        variantKey: product.defaultVariantId,
        data: {
          qty: 1,
          unitPriceCents: typeof product.priceCents === "number" ? product.priceCents : null,
          slug: product.slug,
        },
      })

      showToast(`${product.title} aggiunto al carrello`)
    },
    [add, product.defaultVariantId, product.id, product.priceCents, product.slug, product.title, showToast]
  )

  if (onOpen) {
    return (
      <>
        <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
        <Card className={shellClassName}>
          <div className="flex h-full flex-col">
            <button
              type="button"
              data-slug={product.slug}
              data-testid="product-card"
              onClick={handleOpen}
              aria-label={product.title}
              className="flex h-full w-full flex-col text-left"
            >
              <CardInner product={product} />
            </button>
            <CardActionsButton onOpen={handleOpen} onAdd={handleAdd} />
          </div>
        </Card>
      </>
    )
  }

  return (
    <>
      <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <Card className={shellClassName}>
        <div className="flex h-full flex-col">
          <Link
            href={href}
            data-slug={product.slug}
            data-testid="product-card"
            onClick={onClick}
            aria-label={product.title}
            className="flex h-full w-full flex-col"
          >
            <CardInner product={product} />
          </Link>
          <CardActionsLink href={href} onClick={onClick} onAdd={handleAdd} />
        </div>
      </Card>
    </>
  )
}

function CardInner({ product }: { product: ProductCardProduct }) {
  return (
    <>
      <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-[#ddd6ca] bg-[#eee6da]">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="rounded-full border border-[#d7cdc0] bg-white/80 px-4 py-2 text-[10px] font-medium tracking-wider text-[#7d6a58] backdrop-blur-sm">
              IMMAGINE PRODOTTO
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,251,244,0.06)_0%,rgba(31,26,23,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1f1a17]/38 via-[#1f1a17]/8 to-transparent" />
        <div className="absolute left-0 right-0 top-0 h-24 bg-gradient-to-b from-white/40 to-transparent" />

        {product.badge ? (
          <div className="absolute left-4 top-4 z-10">
            <Badge className="rounded-full border-[#f4c08b]/70 bg-[linear-gradient(135deg,#d97706_0%,#f59e0b_55%,#f3c47c_100%)] px-3 py-1.5 text-[10px] font-semibold tracking-[0.24em] text-white uppercase shadow-lg shadow-[#9a5b18]/20 backdrop-blur-sm hover:bg-[linear-gradient(135deg,#d97706_0%,#f59e0b_55%,#f3c47c_100%)]">
              {product.badge}
            </Badge>
          </div>
        ) : null}
      </div>

      <CardContent className="relative flex flex-1 flex-col bg-[linear-gradient(180deg,#fbf8f3_0%,#f6f1ea_100%)] px-4 pb-4 pt-4 sm:px-5 sm:pb-5 sm:pt-4.5">
        <div className="text-[9px] font-medium tracking-[0.22em] text-[#c06d1d] uppercase">
          {product.subtitle || "Olio EVO"}
        </div>
        <h3 className="mt-1.5 font-serif text-[1.02rem] font-light leading-[1.06] tracking-tight text-[#1f1a17] line-clamp-2 transition-colors duration-300 group-hover:text-[#6e5540] sm:text-[1.12rem]">
          {product.title}
        </h3>
        <div className="mt-3 h-px bg-gradient-to-r from-[#d9cebf] via-[#eee5d9] to-transparent" />

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[9px] font-medium tracking-[0.18em] text-[#9a8163] uppercase">
                {product.priceCaption || "Prezzo"}
              </div>
              <div className="mt-0.5 flex items-baseline gap-1.5">
                <span className="font-serif text-[1.24rem] font-light text-[#1f1a17] sm:text-[1.36rem]">
                  {product.priceLabel || "EUR 0,00"}
                </span>
                <span className="text-[10px] text-[#8a7358]">+ IVA</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  )
}

function CardActionsLink({
  href,
  onClick,
  onAdd,
}: {
  href: string
  onClick?: () => void
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <div className="flex items-center gap-2 border-t border-[#e5ddd2] bg-[linear-gradient(180deg,#f9f5ef_0%,#f4eee6_100%)] p-3 pt-2.5">
      <Link
        href={href}
        onClick={onClick}
        className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#d7cbbb] bg-white/82 px-3.5 py-2 text-[9px] font-semibold tracking-[0.2em] text-[#312922] uppercase transition-all duration-300 hover:border-[#c8ab8f] hover:bg-white"
      >
        Scopri
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.9} />
      </Link>
      <button
        type="button"
        onClick={onAdd}
        aria-label="Aggiungi al carrello"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d99a54] bg-[linear-gradient(135deg,#d97706_0%,#f59e0b_58%,#f2c57f_100%)] text-white shadow-sm shadow-[#9a5b18]/20 transition-all duration-300 hover:scale-[1.03]"
      >
        <ShoppingBag className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}

function CardActionsButton({
  onOpen,
  onAdd,
}: {
  onOpen: () => void
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <div className="flex items-center gap-2 border-t border-[#e5ddd2] bg-[linear-gradient(180deg,#f9f5ef_0%,#f4eee6_100%)] p-3 pt-2.5">
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-[#d7cbbb] bg-white/82 px-3.5 py-2 text-[9px] font-semibold tracking-[0.2em] text-[#312922] uppercase transition-all duration-300 hover:border-[#c8ab8f] hover:bg-white"
      >
        Scopri
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.9} />
      </button>
      <button
        type="button"
        onClick={onAdd}
        aria-label="Aggiungi al carrello"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d99a54] bg-[linear-gradient(135deg,#d97706_0%,#f59e0b_58%,#f2c57f_100%)] text-white shadow-sm shadow-[#9a5b18]/20 transition-all duration-300 hover:scale-[1.03]"
      >
        <Plus className="h-4 w-4" strokeWidth={2.2} />
      </button>
    </div>
  )
}
