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
import { getLocalizedProductHref } from "@/lib/productSlugs"

export type ProductCardVariantImage = {
  variantId: string
  imageSrc: string
  imageAlt?: string
}

export type ProductCardProduct = {
  cardKey?: string
  id: string
  slug: string
  title: string
  subtitle: string
  badge?: string
  merchBadge?: string | null
  secondaryBadge?: string
  imageSrc: string
  imageAlt: string
  priceLabel?: string
  priceCaption?: string
  priceCents?: number
  defaultVariantId?: string
  variantsCount?: number
  variantLabel?: string
  variantImages?: ProductCardVariantImage[]
}

const shellClassName =
  "group relative flex h-full w-full overflow-hidden rounded-[5px] border border-[#ede8e0] bg-white text-[#1f1a17] shadow-[0_2px_8px_rgba(31,26,23,0.30)] transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_10px_28px_rgba(31,26,23,0.40)] transform-gpu will-change-transform backface-hidden"

const cardCopy = {
  it: {
    chooseSize: "Apri il prodotto per scegliere il formato.",
    added: (title: string) => `${title} aggiunto al carrello`,
    adjusted: (available: number | null) =>
      available != null
        ? `Disponibili solo ${available} pezzi. Carrello aggiornato.`
        : "Quantita ridotta in base alla disponibilita.",
    rejected: "Prodotto esaurito.",
    oilCategory: "OLIO EXTRAVERGINE DI OLIVA",
    wineCategory: "VINO",
    oneFormat: "DISPONIBILE IN UN SOLO FORMATO",
    manyFormats: (count: number) => `DISPONIBILE IN ${count} FORMATI DIVERSI`,
    from: "A partire da",
    price: "Prezzo",
    vat: "IVA incl.",
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
    adjusted: (available: number | null) =>
      available != null
        ? `Only ${available} items available. Cart updated.`
        : "Quantity reduced based on availability.",
    rejected: "Product sold out.",
    oilCategory: "EXTRA VIRGIN OLIVE OIL",
    wineCategory: "WINE",
    oneFormat: "AVAILABLE IN ONE FORMAT ONLY",
    manyFormats: (count: number) => `AVAILABLE IN ${count} DIFFERENT FORMATS`,
    from: "From",
    price: "Price",
    vat: "VAT incl.",
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
    adjusted: (available: number | null) =>
      available != null
        ? `Nur noch ${available} Stueck verfuegbar. Warenkorb aktualisiert.`
        : "Menge an die Verfuegbarkeit angepasst.",
    rejected: "Produkt ausverkauft.",
    oilCategory: "NATIVES OLIVENOEL EXTRA",
    wineCategory: "WEIN",
    oneFormat: "IN EINEM FORMAT VERFUEGBAR",
    manyFormats: (count: number) => `IN ${count} FORMATEN VERFUEGBAR`,
    from: "Ab",
    price: "Preis",
    vat: "inkl. MwSt.",
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
    adjusted: (available: number | null) =>
      available != null
        ? `Nog maar ${available} beschikbaar. Winkelwagen bijgewerkt.`
        : "Aantal aangepast op basis van beschikbaarheid.",
    rejected: "Product uitverkocht.",
    oilCategory: "EXTRA VIERGE OLIJFOLIE",
    wineCategory: "WIJN",
    oneFormat: "BESCHIKBAAR IN EEN FORMAAT",
    manyFormats: (count: number) => `BESCHIKBAAR IN ${count} FORMATEN`,
    from: "Vanaf",
    price: "Prijs",
    vat: "btw incl.",
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
    adjusted: (available: number | null) =>
      available != null
        ? `Kun ${available} tilbage. Kurven er opdateret.`
        : "Antallet er justeret efter lagerstatus.",
    rejected: "Produkt udsolgt.",
    oilCategory: "EKSTRA JOMFRUOLIVENOLIE",
    wineCategory: "VIN",
    oneFormat: "FAAS I ET FORMAT",
    manyFormats: (count: number) => `FAAS I ${count} FORMATER`,
    from: "Fra",
    price: "Pris",
    vat: "moms inkl.",
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
    adjusted: (available: number | null) =>
      available != null
        ? `Bare ${available} tilgjengelig. Handlekurven er oppdatert.`
        : "Antallet ble justert etter tilgjengelighet.",
    rejected: "Produkt utsolgt.",
    oilCategory: "EXTRA VIRGIN OLIVENOLJE",
    wineCategory: "VIN",
    oneFormat: "TILGJENGELIG I ETT FORMAT",
    manyFormats: (count: number) => `TILGJENGELIG I ${count} FORMATER`,
    from: "Fra",
    price: "Pris",
    vat: "mva. inkl.",
    details: "Se detaljer",
    productImage: "Produktbilde",
    addToCart: "Legg i handlekurv",
    favoriteAdd: "Legg til i favoritter",
    favoriteRemove: "Fjern fra favoritter",
    secondaryBadge: "100% ITALIENSK",
  },
};

const MERCH_BADGES: Record<string, Record<string, string>> = {
  PIU_VENDUTO: {
    it: "Più venduto",
    en: "Best seller",
    de: "Bestseller",
    nl: "Bestseller",
    da: "Bestseller",
    no: "Bestseller",
  },
  IN_OFFERTA: {
    it: "In offerta",
    en: "Special offer",
    de: "Im Angebot",
    nl: "Aanbieding",
    da: "Tilbud",
    no: "Tilbud",
  },
  NOVITA: {
    it: "Novità",
    en: "New",
    de: "Neu",
    nl: "Nieuw",
    da: "Nyhed",
    no: "Nyhet",
  },
  HOT: {
    it: "Hot",
    en: "Hot",
    de: "Hot",
    nl: "Hot",
    da: "Hot",
    no: "Hot",
  },
  IN_HOME: {
    it: "In home",
    en: "Featured",
    de: "Empfohlen",
    nl: "Aanbevolen",
    da: "Udvalgt",
    no: "Utvalgt",
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
  const { add } = useCart()
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState("")
  const locale = useLocale()
  const text = cardCopy[(locale as CardLocale)] ?? cardCopy.it

  const activeVariantId = product.defaultVariantId

  const hrefBase = getLocalizedProductHref(product, locale)
  const href = activeVariantId
    ? { ...hrefBase, query: { v: activeVariantId } }
    : hrefBase

  const showToast = useCallback((message: string) => {
    setToastMsg(message)
    setToastOpen(true)
  }, [])

  const handleOpen = () => {
    onClick?.()
    onOpen?.(product)
  }

  const handleAdd = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const variantIdToAdd = activeVariantId
      if (!variantIdToAdd) {
        showToast(text.chooseSize)
        return
      }

      const result = await add({ productId: product.id, variantId: variantIdToAdd, qty: 1 })

      track({
        type: "add_to_cart",
        cartId: getOrCreateCartId(),
        productKey: product.id,
        variantKey: variantIdToAdd,
        data: {
          qty: 1,
          unitPriceCents: typeof product.priceCents === "number" ? product.priceCents : null,
          slug: product.slug,
        },
      })

      if (result.status === "rejected") {
        showToast(text.rejected)
        return
      }

      if (result.status === "adjusted") {
        showToast(text.adjusted(result.availableQty))
        return
      }

      const toastTitle = product.variantLabel ? `${product.title} ${product.variantLabel}` : product.title
      showToast(text.added(toastTitle))
    },
    [add, activeVariantId, product.id, product.priceCents, product.slug, product.title, product.variantLabel, showToast, text]
  )

  return (
    <>
      <ToggleMessage open={toastOpen} message={toastMsg} onClose={() => setToastOpen(false)} />
      <div className={shellClassName}>
        {/* Main interactive overlay for the entire card (stretched link/button) */}
        {onOpen ? (
          <button
            type="button"
            data-slug={product.slug}
            data-testid="product-card"
            onClick={handleOpen}
            aria-label={product.title}
            className="absolute inset-0 z-10 block h-full w-full opacity-0 cursor-pointer"
          />
        ) : (
          <Link
            href={href}
            data-slug={product.slug}
            data-testid="product-card"
            onClick={onClick}
            aria-label={product.title}
            className="absolute inset-0 z-10 block h-full w-full opacity-0"
          />
        )}

        <div className="flex h-full w-full flex-col">
          <CardInner
            product={product}
          />
          <div className="px-3 pb-3 bg-white relative z-20 flex items-center justify-between border-t border-[#f0ece6] pt-3 mt-auto">
            {/* Prezzo */}
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold tracking-[0.1em] text-[#9c8f82] uppercase leading-none">
                {product.priceCaption || text.from}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-serif text-[1.15rem] font-bold tracking-tight text-[#1f1a17]">
                  {product.priceLabel || "€0,00"}
                </span>
                <span className="text-[9px] font-medium text-[#8a7c6e]">
                  {text.vat}
                </span>
              </div>
            </div>

            {/* Aggiungi al Carrello */}
            <button
              type="button"
              onClick={handleAdd}
              className="h-8 rounded-[5px] bg-[#132c1c] hover:bg-[#1a3d27] text-white px-3.5 py-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm shadow-[#132c1c]/10"
              aria-label={text.addToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>{locale === "it" ? "Aggiungi" : "Add"}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function CardInner({
  product,
}: {
  product: ProductCardProduct
}) {
  const locale = useLocale()
  const text = cardCopy[(locale as CardLocale)] ?? cardCopy.it
  const [isFavorite, setIsFavorite] = useState(false)

  // Determine which image to show
  const currentImage = product.imageSrc
  const currentAlt = product.imageAlt
  // Clean title: use title exactly as-is for absolute uniformity across card, breadcrumb, and h1
  const cleanTitle = product.title

  // Badges mapping
  const defaultBadgesMap: Record<string, string> = {
    "fruttato-medio": product.badge || "",
    "fruttato-intenso": product.badge || "",
    "evo": product.badge || "",
    "tartufo": product.badge || "",
    "peperoncino": product.badge || "",
  }

  const rawDefaultBadge = defaultBadgesMap[product.id] !== undefined
    ? defaultBadgesMap[product.id]
    : (product.badge || "CLASSICO");

  // Translate database custom badge if set
  const rawMerchBadge = product.merchBadge || "";
  const upperMerchBadge = rawMerchBadge.toUpperCase();
  const translatedMerchBadge = MERCH_BADGES[upperMerchBadge]
    ? (MERCH_BADGES[upperMerchBadge][locale] ?? MERCH_BADGES[upperMerchBadge].it)
    : rawMerchBadge;

  // Variants count → testo formati
  const variantsCount = product.variantsCount ?? 1

  const formatsText =
    variantsCount <= 1
      ? text.oneFormat
      : text.manyFormats(variantsCount)

  const variantLabel = product.variantLabel?.trim() || null

  return (
    <div className="flex h-full w-full flex-col">
      {/* Foto prodotto */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white transform-gpu backface-hidden">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={currentAlt || cleanTitle}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04] will-change-transform"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#fdfaf7] text-[10px] font-semibold uppercase tracking-wider text-[#8f6d4c]/70">
            {text.productImage}
          </div>
        )}

        {/* Badges: inset 10px dai bordi della card, sopra la foto */}
        <div className="absolute left-[10px] right-[10px] top-[10px] z-10 flex items-center justify-between pointer-events-none">
          {rawDefaultBadge ? (
            <div className="rounded-[4px] bg-[#d29b46] px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-white uppercase shadow-sm">
              {rawDefaultBadge}
            </div>
          ) : (
            <div />
          )}
          {translatedMerchBadge ? (
            <div className="rounded-[4px] border border-[#ddd7ce] bg-white/92 px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-[#1f1a17] uppercase shadow-sm backdrop-blur-sm">
              {translatedMerchBadge}
            </div>
          ) : null}
        </div>

        {/* Favorite button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute bottom-2 right-2 z-20 shrink-0 focus:outline-none transition-transform active:scale-90 hover:scale-110 p-0.5 pointer-events-auto"
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

      {/*
        AREA CONTENUTO
      */}
      <div className="flex flex-1 flex-col px-3 pt-2 pb-0.5 bg-white">
        {/* Categoria */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-semibold tracking-[0.12em] text-[#8a7c6e] uppercase truncate">
            {product.id === "vino" ? text.wineCategory : text.oilCategory}
          </span>
        </div>

        {/* Titolo prodotto */}
        <h3 className="mt-1 font-serif text-[1.05rem] font-semibold leading-[1.2] tracking-tight text-[#1f1a17] line-clamp-2 transition-colors duration-300 group-hover:text-[#8f6d4c]">
          {cleanTitle}
        </h3>

        {/* Variante card univoca */}
        {variantLabel && (
          <div className="mt-1 text-[9px] font-semibold tracking-[0.08em] text-[#8f6d4c] uppercase">
            {variantLabel}
          </div>
        )}

        {/* Formati disponibili */}
        {!variantLabel && (
          <div className="mt-1 text-[9px] font-medium tracking-[0.06em] text-[#a09282] uppercase">
            {formatsText}
          </div>
        )}
      </div>
    </div>
  )
}
