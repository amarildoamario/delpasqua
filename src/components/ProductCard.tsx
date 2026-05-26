"use client"

import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Link } from "@/i18n/routing"
import { useCallback, useState } from "react"
import { useLocale } from "next-intl"

import ToggleMessage from "@/components/ui/ToggleMessage"
import { useCart } from "@/context/CartContext"
import { getOrCreateCartId } from "@/lib/analytics/cartId"
import { track } from "@/lib/analytics/track"
import { shouldContainProductImage } from "@/lib/productImageFit"

export type ProductCardProduct = {
  id: string
  slug: string
  title: string
  subtitle: string
  badge?: string
  secondaryBadge?: string
  imageSrc: string
  imageAlt: string
  priceLabel?: string
  priceCaption?: string
  priceCents?: number
  defaultVariantId?: string
  variantsCount?: number
}

const shellClassName =
  "group relative flex h-full w-full overflow-hidden rounded-[5px] border border-[#ede8e0] bg-white text-[#1f1a17] shadow-[0_2px_8px_rgba(31,26,23,0.30)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_10px_28px_rgba(31,26,23,0.40)] transform-gpu will-change-transform backface-hidden"

const cardCopy = {
  it: {
    chooseSize: "Apri il prodotto per scegliere il formato.",
    added: (title: string) => `${title} aggiunto al carrello`,
    oilCategory: "OLIO EXTRAVERGINE DI OLIVA",
    wineCategory: "VINO",
    oneFormat: "DISPONIBILE IN UN SOLO FORMATO",
    manyFormats: (count: number) => `DISPONIBILE IN ${count} FORMATI DIVERSI`,
    from: "A partire da",
    price: "Prezzo",
    vat: "+ iva",
    details: "Vedi i dettagli",
    productImage: "Immagine Prodotto",
    addToCart: "Aggiungi al carrello",
    favoriteAdd: "Aggiungi ai preferiti",
    favoriteRemove: "Rimuovi dai preferiti",
    secondaryBadge: "100% ITALIANO",
  },
  en: {
    chooseSize: "Open the product to choose the size.",
    added: (title: string) => `${title} added to cart`,
    oilCategory: "EXTRA VIRGIN OLIVE OIL",
    wineCategory: "WINE",
    oneFormat: "AVAILABLE IN ONE FORMAT ONLY",
    manyFormats: (count: number) => `AVAILABLE IN ${count} DIFFERENT FORMATS`,
    from: "Starting from",
    price: "Price",
    vat: "+ VAT",
    details: "View details",
    productImage: "Product Image",
    addToCart: "Add to cart",
    favoriteAdd: "Add to favorites",
    favoriteRemove: "Remove from favorites",
    secondaryBadge: "100% ITALIAN",
  },
  de: {
    chooseSize: "Produkt oeffnen, um das Format zu waehlen.",
    added: (title: string) => `${title} wurde in den Warenkorb gelegt`,
    oilCategory: "NATIVES OLIVENOEL EXTRA",
    wineCategory: "WEIN",
    oneFormat: "IN EINEM FORMAT VERFUEGBAR",
    manyFormats: (count: number) => `IN ${count} FORMATEN VERFUEGBAR`,
    from: "Ab",
    price: "Preis",
    vat: "+ MwSt.",
    details: "Details ansehen",
    productImage: "Produktbild",
    addToCart: "In den Warenkorb",
    favoriteAdd: "Zu Favoriten hinzufuegen",
    favoriteRemove: "Aus Favoriten entfernen",
    secondaryBadge: "100% ITALIENISCH",
  },
  nl: {
    chooseSize: "Open het product om het formaat te kiezen.",
    added: (title: string) => `${title} toegevoegd aan winkelwagen`,
    oilCategory: "EXTRA VIERGE OLIJFOLIE",
    wineCategory: "WIJN",
    oneFormat: "BESCHIKBAAR IN EEN FORMAAT",
    manyFormats: (count: number) => `BESCHIKBAAR IN ${count} FORMATEN`,
    from: "Vanaf",
    price: "Prijs",
    vat: "+ btw",
    details: "Details bekijken",
    productImage: "Productafbeelding",
    addToCart: "Toevoegen aan winkelwagen",
    favoriteAdd: "Toevoegen aan favorieten",
    favoriteRemove: "Verwijderen uit favorieten",
    secondaryBadge: "100% ITALIAANS",
  },
  da: {
    chooseSize: "Aabn produktet for at vaelge format.",
    added: (title: string) => `${title} tilfoejet til kurv`,
    oilCategory: "EKSTRA JOMFRUOLIVENOLIE",
    wineCategory: "VIN",
    oneFormat: "FAAS I ET FORMAT",
    manyFormats: (count: number) => `FAAS I ${count} FORMATER`,
    from: "Fra",
    price: "Pris",
    vat: "+ moms",
    details: "Se detaljer",
    productImage: "Produktbillede",
    addToCart: "Tilfoej til kurv",
    favoriteAdd: "Tilfoej til favoritter",
    favoriteRemove: "Fjern fra favoritter",
    secondaryBadge: "100% ITALIENSK",
  },
  no: {
    chooseSize: "Aapne produktet for aa velge format.",
    added: (title: string) => `${title} lagt i handlekurven`,
    oilCategory: "EXTRA VIRGIN OLIVENOLJE",
    wineCategory: "VIN",
    oneFormat: "TILGJENGELIG I ETT FORMAT",
    manyFormats: (count: number) => `TILGJENGELIG I ${count} FORMATER`,
    from: "Fra",
    price: "Pris",
    vat: "+ mva.",
    details: "Se detaljer",
    productImage: "Produktbilde",
    addToCart: "Legg i handlekurv",
    favoriteAdd: "Legg til i favoritter",
    favoriteRemove: "Fjern fra favoritter",
    secondaryBadge: "100% ITALIENSK",
  },
};

type CardLocale = keyof typeof cardCopy;

export default function ProductCard({
  product,
  onClick,
  onOpen,
}: {
  product: ProductCardProduct
  onClick?: () => void
  onOpen?: (product: ProductCardProduct) => void
}) {
  const href = {
    pathname: "/shop/[prodotto]",
    params: { prodotto: product.slug },
  } as const
  const { add } = useCart()
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const locale = useLocale()
  const text = cardCopy[(locale as CardLocale)] ?? cardCopy.it

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
        showToast(text.chooseSize)
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

      showToast(text.added(product.title))
    },
    [add, product.defaultVariantId, product.id, product.priceCents, product.slug, product.title, showToast, text]
  )

  if (onOpen) {
    return (
      <>
        <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
        <div className={shellClassName}>
          <div className="flex h-full w-full flex-col">
            <button
              type="button"
              data-slug={product.slug}
              data-testid="product-card"
              onClick={handleOpen}
              aria-label={product.title}
              className="flex flex-1 flex-col text-left focus:outline-none w-full"
            >
              <CardInner product={product} />
            </button>
            <div className="px-3 pb-3 bg-white">
              <CardActionsButton onOpen={handleOpen} onAdd={handleAdd} locale={locale} />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <div className={shellClassName}>
        <div className="flex h-full w-full flex-col">
          <Link
            href={href}
            data-slug={product.slug}
            data-testid="product-card"
            onClick={onClick}
            aria-label={product.title}
            className="flex flex-1 flex-col w-full"
          >
            <CardInner product={product} />
          </Link>
          <div className="px-3 pb-3 bg-white">
            <CardActionsLink href={href} onClick={onClick} onAdd={handleAdd} locale={locale} />
          </div>
        </div>
      </div>
    </>
  )
}

function CardInner({ product }: { product: ProductCardProduct }) {
  const locale = useLocale()
  const text = cardCopy[(locale as CardLocale)] ?? cardCopy.it
  const [isFavorite, setIsFavorite] = useState(false)
  const usesContainedImage = shouldContainProductImage(product.imageSrc)

  // Clean title: rimuovi il prefisso "Extravergine - "
  let cleanTitle = product.title
  if (product.id === "tartufo") {
    cleanTitle = product.title
  } else if (product.id === "peperoncino") {
    cleanTitle = product.title
  } else {
    cleanTitle = product.title.replace(/^(Extravergine\s*-\s*|Olio\s+Extravergine\s+di\s+oliva\s+-?\s*)/i, "")
  }

  // Badges mapping
  const badgesMap: Record<string, { primary: string; secondary: string }> = {
    "fruttato-medio": {
      primary: product.badge || "",
      secondary: text.secondaryBadge,
    },
    "fruttato-intenso": {
      primary: product.badge || "",
      secondary: text.secondaryBadge,
    },
    "evo": {
      primary: product.badge || "",
      secondary: text.secondaryBadge,
    },
    "tartufo": {
      primary: product.badge || "",
      secondary: text.secondaryBadge,
    },
    "peperoncino": {
      primary: product.badge || "",
      secondary: text.secondaryBadge,
    },
  }

  const badgeInfo = badgesMap[product.id] || {
    primary: product.badge || "CLASSICO",
    secondary: product.secondaryBadge || text.secondaryBadge,
  }

  // Variants count → testo formati
  const variantsCount = product.variantsCount ?? 1

  const formatsText =
    variantsCount <= 1
      ? text.oneFormat
      : text.manyFormats(variantsCount)

  return (
    <div className="flex h-full w-full flex-col">
      {/* Foto prodotto: object-cover, badges in overlay a 10px dal bordo */}
      <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-white transform-gpu backface-hidden">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.imageAlt || cleanTitle}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={
              usesContainedImage
                ? "object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02] will-change-transform"
                : "object-cover transition-transform duration-500 group-hover:scale-[1.04] will-change-transform"
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#fdfaf7] text-[10px] font-semibold uppercase tracking-wider text-[#8f6d4c]/70">
            {text.productImage}
          </div>
        )}

        {/* Badges: inset 10px dai bordi della card, sopra la foto */}
        <div className="absolute left-[10px] right-[10px] top-[10px] z-10 flex items-center justify-between pointer-events-none">
          {badgeInfo.primary ? (
            <div className="rounded-[4px] bg-[#d29b46] px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-white uppercase shadow-sm">
              {badgeInfo.primary}
            </div>
          ) : (
            <div />
          )}
          {badgeInfo.secondary ? (
            <div className="rounded-[4px] border border-[#ddd7ce] bg-white/92 px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-[#1f1a17] uppercase shadow-sm backdrop-blur-sm">
              {badgeInfo.secondary}
            </div>
          ) : null}
        </div>
      </div>

      {/*
        AREA CONTENUTO:
        - px-3 py-3: spaziatura confortevole, non troppo stretta
        - testi ben leggibili e spaziati
      */}
      <div className="flex flex-1 flex-col px-3 pt-2 pb-0.5 bg-white">
        {/* Categoria + Wishlist */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold tracking-[0.12em] text-[#8a7c6e] uppercase truncate">
            {product.id === "vino" ? text.wineCategory : text.oilCategory}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className="shrink-0 focus:outline-none transition-transform active:scale-90 hover:scale-110 p-0.5"
            aria-label={isFavorite ? text.favoriteRemove : text.favoriteAdd}
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                isFavorite
                  ? "fill-[#d29b46] text-[#d29b46]"
                  : "text-[#b0a090] hover:text-[#d29b46]"
              }`}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Titolo prodotto */}
        <h3 className="mt-1 font-serif text-[1.05rem] font-semibold leading-[1.2] tracking-tight text-[#1f1a17] line-clamp-2 transition-colors duration-300 group-hover:text-[#8f6d4c]">
          {cleanTitle}
        </h3>

        {/* Formati disponibili */}
        <div className="mt-1 text-[9px] font-medium tracking-[0.06em] text-[#a09282] uppercase">
          {formatsText}
        </div>

        {/* Prezzo */}
        <div className="mt-auto pt-1.5 pb-0.5">
          <div className="text-[9px] font-semibold tracking-[0.1em] text-[#9c8f82] uppercase leading-none">
            {product.priceCaption || text.from}
          </div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="font-serif text-[1.25rem] font-bold tracking-tight text-[#1f1a17]">
              {product.priceLabel || "€0,00"}
            </span>
            <span className="text-[10px] font-medium text-[#8a7c6e]">
              {text.vat}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardActionsLink({
  href,
  onClick,
  onAdd,
  locale,
}: {
  href: React.ComponentProps<typeof Link>["href"]
  onClick?: () => void
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
  locale: string
}) {
  const text = cardCopy[(locale as CardLocale)] ?? cardCopy.it

  return (
    <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-[#f0ece6]">
      <Link
        href={href}
        onClick={onClick}
        className="flex-1 rounded-[5px] border border-[#d2c9bd] bg-white px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-[#1f1a17] uppercase transition-all duration-200 hover:border-[#1f1a17] hover:bg-stone-50 text-center"
      >
        {text.details}
      </Link>
      <button
        type="button"
        onClick={onAdd}
        aria-label={text.addToCart}
        className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#132c1c] text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#1a3d27] active:scale-95"
      >
        <ShoppingCart className="h-[15px] w-[15px]" strokeWidth={1.8} />
      </button>
    </div>
  )
}

function CardActionsButton({
  onOpen,
  onAdd,
  locale,
}: {
  onOpen: () => void
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
  locale: string
}) {
  const text = cardCopy[(locale as CardLocale)] ?? cardCopy.it

  return (
    <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-[#f0ece6]">
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 rounded-[5px] border border-[#d2c9bd] bg-white px-3 py-2 text-[10px] font-bold tracking-[0.1em] text-[#1f1a17] uppercase transition-all duration-200 hover:border-[#1f1a17] hover:bg-stone-50 text-center"
      >
        {text.details}
      </button>
      <button
        type="button"
        onClick={onAdd}
        aria-label={text.addToCart}
        className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#132c1c] text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#1a3d27] active:scale-95"
      >
        <ShoppingCart className="h-[15px] w-[15px]" strokeWidth={1.8} />
      </button>
    </div>
  )
}
