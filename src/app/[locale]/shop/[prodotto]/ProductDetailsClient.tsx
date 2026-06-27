"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocale } from "next-intl";
import { useCart } from "@/context/CartContext";
import {
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  Check,
  X,
  Droplets,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  Leaf,
} from "lucide-react";
import Link from "next/link";

import { localizedPathnames, type Locale } from "@/i18n/pathnames";
import ProductCard, { type ProductCardProduct } from "@/components/ProductCard";
import type { ProductSpecData, SensoryIndicator, TechSpec, ProductDetailsLabels, ProductDetailsDetailLabels } from "./productDetailsData";
import MobileListCard from "@/components/MobileListCard";
import { makeInventorySku } from "@/lib/inventorySku";
import { getLocalizedProductSlug } from "@/lib/productSlugs";

type Specs = Record<string, string>;

type ProductVariant = {
  id: string;
  label: string;
  description?: string;
  priceCents: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Specs;
  stock?: number;
  title?: string;
};

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
};

type Product = {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle?: string;
  badge?: string;
  merchBadge?: string | null;
  imageSrc: string;
  imageAlt: string;
  description: string;
  variants: ProductVariant[];
  specsTitle?: string;
  specs?: Specs;
  purchaseInfo?: PurchaseInfo;
};

function formatEUR(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "it" ? "it-IT" : locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

type FormatNavItem = {
  productId: string;
  variantId: string;
  label: string;
};

type FormatNavGroups = {
  bottle: FormatNavItem[];
  can: FormatNavItem[];
};

type GalleryImageItem = {
  src: string;
  alt: string;
  productId: string;
  variantId: string;
  label: string;
};

const FORMAT_FAMILY_BY_PRODUCT_ID: Record<string, string> = {
  evo: "evo",
  "evo-latta": "evo",
  "fruttato-leggero": "fruttato-leggero",
  "fruttato-leggero-latta": "fruttato-leggero",
  "fruttato-medio": "fruttato-medio",
  "fruttato-medio-latta": "fruttato-medio",
  "fruttato-intenso": "fruttato-intenso",
  "fruttato-intenso-latta": "fruttato-intenso",
};

const FORMAT_NAV_GROUPS: Record<string, FormatNavGroups> = {
  evo: {
    bottle: [{ productId: "evo", variantId: "500ml", label: "500 ml" }],
    can: [
      { productId: "evo-latta", variantId: "750ml", label: "750 ml" },
      { productId: "evo-latta", variantId: "3lt", label: "3 L" },
      { productId: "evo-latta", variantId: "5lt", label: "5 L" },
    ],
  },
  "fruttato-leggero": {
    bottle: [{ productId: "fruttato-leggero", variantId: "500ml", label: "500 ml" }],
    can: [
      { productId: "fruttato-leggero-latta", variantId: "3lt", label: "3 L" },
      { productId: "fruttato-leggero-latta", variantId: "5lt", label: "5 L" },
    ],
  },
  "fruttato-medio": {
    bottle: [
      { productId: "fruttato-medio", variantId: "500ml", label: "500 ml" },
      { productId: "fruttato-medio", variantId: "750ml", label: "750 ml" },
      { productId: "fruttato-medio", variantId: "1lt", label: "1 L" },
    ],
    can: [
      { productId: "fruttato-medio-latta", variantId: "3lt", label: "3 L" },
      { productId: "fruttato-medio-latta", variantId: "5lt", label: "5 L" },
    ],
  },
  "fruttato-intenso": {
    bottle: [
      { productId: "fruttato-intenso", variantId: "500ml", label: "500 ml" },
      { productId: "fruttato-intenso", variantId: "750ml", label: "750 ml" },
      { productId: "fruttato-intenso", variantId: "1lt", label: "1 L" },
    ],
    can: [
      { productId: "fruttato-intenso-latta", variantId: "3lt", label: "3 L" },
      { productId: "fruttato-intenso-latta", variantId: "5lt", label: "5 L" },
    ],
  },
};

function getFormatNavGroups(productId: string) {
  const familyId = FORMAT_FAMILY_BY_PRODUCT_ID[productId];
  return familyId ? FORMAT_NAV_GROUPS[familyId] : null;
}

function buildProductUrl(productId: string, locale: string, variantId?: string) {
  // Builds the full URL for cross-product navigation.
  // We use window.location.origin as base since router.push would double-add the locale prefix.
  const supportedLocale = locale as Locale;
  const localePrefix = supportedLocale === "it" ? "" : `/${supportedLocale}`;
  const shopPath = localizedPathnames["/shop"]?.[supportedLocale] ?? "/shop";
  const slug = getLocalizedProductSlug({ id: productId }, locale);
  const base = `${localePrefix}${shopPath}/${slug}`;
  return variantId ? `${base}?v=${variantId}` : base;
}

export default function ProductDetailsClient({
  product,
  initialVariantId,
  relatedProducts = [],
  labels,
  detailLabels,
  specsMap,
}: {
  product: Product;
  initialVariantId?: string;
  relatedProducts?: Product[];
  labels: ProductDetailsLabels;
  detailLabels: ProductDetailsDetailLabels;
  specsMap: Record<string, ProductSpecData>;
}) {
  const locale = useLocale();
  const text = labels;
  const detailText = detailLabels;
  const { add, lines, count: cartCount, catalog } = useCart();

  const getFormatNavItemPrice = (prodId: string, varId: string): number | null => {
    const prod = (catalog as Product[]).find((p) => p.id === prodId);
    if (!prod) return null;
    const v = prod.variants?.find((varItem) => String(varItem.id) === String(varId));
    return v ? v.priceCents : null;
  };

  const [currentProduct, setCurrentProduct] = useState<Product>(product);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  // Varianti e logica di selezione iniziale
  const variants = useMemo(() => (currentProduct.variants?.length ? currentProduct.variants : []), [currentProduct.variants]);
  const firstVariantId = variants[0]?.id;
  const safeInitialVariantId =
    initialVariantId && variants.some((v) => String(v.id) === String(initialVariantId))
      ? initialVariantId
      : firstVariantId;

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(safeInitialVariantId);
  useEffect(() => {
    const variantId = new URLSearchParams(window.location.search).get("v");
    if (variantId && variants.some((v) => String(v.id) === String(variantId))) {
      setSelectedVariantId(variantId);
    }
  }, [variants]);

  const selectedVariant = useMemo(() => {
    return variants.find((v) => String(v.id) === String(selectedVariantId)) ?? variants[0];
  }, [variants, selectedVariantId]);

  const formatNavGroups = useMemo(() => getFormatNavGroups(currentProduct.id), [currentProduct.id]);

  function handleFormatSelect(item: FormatNavItem) {
    const allTranslatedProducts = [product, ...relatedProducts];
    const targetProduct = allTranslatedProducts.find((p) => p.id === item.productId);

    if (targetProduct) {
      setCurrentProduct(targetProduct);
      setSelectedVariantId(item.variantId);
      const newPath = buildProductUrl(item.productId, locale, item.variantId);
      window.history.replaceState(null, "", newPath);
    }
  }

  function handleVariantSelect(variant: ProductVariant) {
    setSelectedVariantId(variant.id);
    // Sync image with this variant
    if (variant.imageSrc) setActiveImage(variant.imageSrc);
    // Sync URL query param
    const url = new URL(window.location.href);
    url.searchParams.set("v", variant.id);
    window.history.replaceState(null, "", url.pathname + url.search);
  }

  // Clicking a gallery image selects the matching variant (and product)
  function handleImageClick(item: GalleryImageItem) {
    const allTranslatedProducts = [product, ...relatedProducts];
    const targetProduct = allTranslatedProducts.find((p) => p.id === item.productId);

    if (targetProduct) {
      setCurrentProduct(targetProduct);
      setSelectedVariantId(item.variantId);
      setActiveImage(item.src);
      const newPath = buildProductUrl(item.productId, locale, item.variantId);
      window.history.replaceState(null, "", newPath);
    }
  }

  // Gestione Galleria Immagini
  const galleryItems = useMemo<GalleryImageItem[]>(() => {
    const items: GalleryImageItem[] = [];
    const addedSrcs = new Set<string>();

    const addImage = (src: string, alt: string, prodId: string, varId: string, label: string) => {
      if (!src || addedSrcs.has(src)) return;
      addedSrcs.add(src);
      items.push({ src, alt, productId: prodId, variantId: varId, label });
    };

    if (formatNavGroups) {
      // It belongs to a format family! Let's pull from all family items
      const allFamilyItems: FormatNavItem[] = [
        ...(formatNavGroups.bottle || []),
        ...(formatNavGroups.can || []),
      ];

      allFamilyItems.forEach((item) => {
        // Find corresponding product in catalog
        const rawProd = (catalog as Product[]).find((p) => p.id === item.productId);
        if (!rawProd) return;
        const rawVar = rawProd.variants?.find((v) => String(v.id) === String(item.variantId));
        if (rawVar && rawVar.imageSrc) {
          addImage(
            rawVar.imageSrc,
            rawVar.imageAlt || rawVar.label || rawProd.title,
            item.productId,
            item.variantId,
            item.label
          );
        } else if (rawProd.imageSrc) {
          addImage(
            rawProd.imageSrc,
            rawProd.imageAlt || rawProd.title,
            item.productId,
            item.variantId,
            item.label
          );
        }
      });
    } else {
      // Normal single product, just map its own variants
      variants.forEach((v) => {
        if (v.imageSrc) {
          const cleanLabel = v.label
            .replace(/Bottiglia|Latta|Can/gi, "")
            .replace("ml", " ml")
            .replace("lt", " L")
            .replace("L", " L")
            .trim();
          addImage(v.imageSrc, v.imageAlt || v.label, currentProduct.id, v.id, cleanLabel);
        }
      });
      // Fallback to main product image if no images added
      if (items.length === 0 && currentProduct.imageSrc) {
        addImage(currentProduct.imageSrc, currentProduct.imageAlt || currentProduct.title, currentProduct.id, selectedVariantId || "", "");
      }
    }

    return items;
  }, [formatNavGroups, currentProduct, variants, selectedVariantId, catalog]);

  const galleryImages = useMemo(() => galleryItems.map((item) => item.src), [galleryItems]);

  const [activeImage, setActiveImage] = useState(
    selectedVariant?.imageSrc || (galleryImages.length > 0 ? galleryImages[0] : currentProduct.imageSrc)
  );

  // Quando cambia la variante, aggiorniamo l'immagine attiva
  useEffect(() => {
    const img = selectedVariant?.imageSrc || currentProduct.imageSrc;
    if (img) setActiveImage(img);
  }, [selectedVariant, currentProduct.imageSrc]);

  // Gestione Quantità
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);


  const cartTotalCents = useMemo(() => {
    return lines.reduce((sum, line) => {
      const cartProduct = catalog.find((item) => item.id === line.productId);
      const cartVariant = cartProduct?.variants.find((item) => item.id === line.variantId);
      return sum + (cartVariant?.priceCents ?? 0) * line.qty;
    }, 0);
  }, [lines, catalog]);

  // Controllo disponibilità in tempo reale
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availMap, setAvailMap] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    let alive = true;
    if (!currentProduct.id || variants.length === 0) {
      setAvailMap({});
      return;
    }
    const skus = variants.map((v) => makeInventorySku(currentProduct.id, v.id, v.sku));
    setLoadingAvail(true);

    fetch(`/api/inventory/availability?skus=${encodeURIComponent(skus.join(","))}`, {
      cache: "no-store",
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        return j?.availability ?? {};
      })
      .then((map) => {
        if (!alive) return;
        setAvailMap(map);
      })
      .catch(() => {
        if (!alive) return;
        setAvailMap({});
      })
      .finally(() => {
        if (!alive) return;
        setLoadingAvail(false);
      });

    return () => {
      alive = false;
    };
  }, [currentProduct.id, variants]);

  const selectedSku = selectedVariant
    ? makeInventorySku(currentProduct.id, selectedVariant.id, selectedVariant.sku)
    : "";
  const availableStock = availMap ? availMap[selectedSku] ?? 0 : null;
  const maxQty = availableStock == null ? 99 : Math.max(0, availableStock);
  const isOutOfStock = availableStock != null && availableStock <= 0;

  useEffect(() => {
    setQty((q) => {
      if (maxQty <= 0) return 1;
      return Math.min(Math.max(1, q), maxQty);
    });
    setAdded(false);
    setErrorMessage("");
  }, [maxQty, selectedVariantId]);

  // Gestione Tabs Descrizione Sotto
  const [activeTab, setActiveTab] = useState("descrizione");

  // Carrello ed Acquisto Diretto
  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    setIsAdding(true);
    setErrorMessage("");
    const safeQty = Math.min(Math.max(1, qty), maxQty);

    await new Promise((r) => setTimeout(r, 450));

    add({
      productId: currentProduct.id,
      variantId: selectedVariant.id,
      qty: safeQty,
    });
    setIsAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleDirectCheckout = async () => {
    if (isOutOfStock || isAdding || checkoutLoading) return;
    setCheckoutLoading(true);
    setErrorMessage("");

    try {
      if (lines.length === 0) {
        throw new Error(detailText.emptyCart);
      }

      // Track direct checkout event
      try {
        const { track } = await import("@/lib/analytics/track");
        track({
          type: "begin_checkout",
          data: {
            itemsCount: lines.length,
            totalCents: cartTotalCents,
          },
        });
      } catch (trackError) {
        console.error("Failed to track checkout:", trackError);
      }

      const idemKey = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`)
        .toString()
        .slice(0, 200);

      const orderBody = {
        items: lines.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          qty: item.qty,
        })),
        locale,
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idemKey,
        },
        body: JSON.stringify(orderBody),
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || "Checkout non disponibile");
      }

      const data = await response.json().catch(() => ({}));
      const url = data?.checkoutUrl;

      if (typeof url === "string" && url.startsWith("http")) {
        window.location.href = url;
        return;
      }

      throw new Error(detailText.checkoutSessionError);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : null;
      setErrorMessage(message || detailText.redirectError);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Prezzo calcolato
  const variantPriceCents = selectedVariant?.priceCents ?? variants[0]?.priceCents ?? 0;
  const totalPriceFormatted = formatEUR(variantPriceCents * qty, locale);
  const cartTotalFormatted = formatEUR(cartTotalCents, locale);

  // Lightbox Immagini Gallery
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  // Formatta l'ID per mostrare formati puliti
  const formatSizeLabel = (v: ProductVariant) => {
    const raw = v.label ?? v.id;
    return raw
      .replace(/Bottiglia|Latta|Can/gi, "")
      .replace("ml", " ml")
      .replace("lt", " L")
      .replace("L", " L")
      .trim();
  };

  // Dati statici personalizzati per gli oli principali
  const isEvo = currentProduct.id === "evo" || currentProduct.id === "evo-latta";

  const descriptionParagraph = selectedVariant?.description || currentProduct.description;



  // Icona personalizzata dell'Italia in SVG circolare ad alta qualità
  const ItalyIcon = (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none">
      <clipPath id="italy-circle-clip">
        <circle cx="12" cy="12" r="10" />
      </clipPath>
      <g clipPath="url(#italy-circle-clip)">
        <rect x="2" y="2" width="6.7" height="20" fill="#009246" />
        <rect x="8.7" y="2" width="6.7" height="20" fill="#ffffff" />
        <rect x="15.4" y="2" width="6.7" height="20" fill="#ce2b37" />
      </g>
      <circle cx="12" cy="12" r="10" stroke="#e5e5e5" strokeWidth="1" />
    </svg>
  );

  const currentTabContent = useMemo(() => {
    const specsData = (specsMap[currentProduct.id] || specsMap[currentProduct.id.replace('-latta', '')] || {
      sensory: [],
      techSpecs: [],
      caratteristiche: descriptionParagraph || detailText.defaultDescription,
      abbinamenti: "",
      ingredienti: "",
      valoriNutrizionali: [],
    }) as ProductSpecData;

    if (activeTab === "specifiche") {
      const mergedSpecs = {
        ...(currentProduct.specs || {}),
        ...(selectedVariant?.specs || {}),
      };
      
      const rows = Object.entries(mergedSpecs)
        .filter(([, v]) => v != null && String(v).trim().length > 0)
        .map(([k, v]) => ({ k, v: String(v) }));

      if (rows.length === 0) {
        return (
          <p className="text-neutral-500 text-sm italic">
            {detailText.noSpecs}
          </p>
        );
      }

      return (
        <div className="animate-in fade-in duration-300">
          <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {rows.map((r) => (
              <div key={r.k} className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
                <div className="text-neutral-700 font-medium">{r.k}</div>
                <div className="text-right text-neutral-900">{r.v}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "descrizione":
        return (
          <div className="animate-in fade-in duration-300">
            <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed mb-8">
              {descriptionParagraph || detailText.defaultDescription}
            </p>
            
            {/* Indicatori Sensoriali */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-neutral-200 mb-8">
              {specsData.sensory.map((indicator: SensoryIndicator, idx: number) => (
                <div key={idx}>
                  <h5 className="text-[11px] font-bold tracking-widest text-neutral-500 uppercase">
                    {indicator.label}
                  </h5>
                  <div className="text-sm font-bold text-neutral-800 mt-1">
                    {indicator.value}
                  </div>
                  {indicator.type === "dots" ? (
                    <div className="flex items-center gap-1.5 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        const dotsVal = indicator.dots || 0;
                        const isFull = i < Math.floor(dotsVal);
                        const isHalf = !isFull && (i < dotsVal);
                        return (
                          <span
                            key={i}
                            className={`h-2.5 w-2.5 rounded-full ${
                              isFull
                                ? "bg-[#B5945B]"
                                : isHalf
                                  ? "bg-[#B5945B]/65"
                                  : "bg-neutral-200"
                            }`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-2.5">
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-neutral-100/85 shadow-sm animate-in zoom-in duration-300"
                        style={{ backgroundColor: indicator.color }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Informazioni di Raccolta e Cultivar */}
            <div className="grid grid-cols-3 gap-6 pt-2">
              {specsData.techSpecs.map((spec: TechSpec, idx: number) => (
                <div key={idx}>
                  <div className="text-[11px] font-bold text-neutral-500 tracking-wider">
                    {spec.label}
                  </div>
                  <div className="text-sm font-bold text-neutral-900 mt-1">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "caratteristiche":
        return (
          <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed animate-in fade-in duration-300">
            {specsData.caratteristiche}
          </p>
        );
      case "abbinamenti":
        return (
          <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed animate-in fade-in duration-300">
            {specsData.abbinamenti}
          </p>
        );
      case "ingredienti":
        return (
          <p className="text-[#1a1a1a] text-[15px] font-normal leading-relaxed animate-in fade-in duration-300">
            {specsData.ingredienti}
          </p>
        );
      case "valori nutrizionali":
        return (
          <div className="overflow-x-auto animate-in fade-in duration-300">
            <table className="min-w-full divide-y divide-neutral-200 text-sm text-[#1a1a1a] font-normal">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-2.5 text-left font-bold text-neutral-900">
                    {detailText.averageValues}
                  </th>
                  <th className="py-2.5 text-right font-bold text-neutral-900">
                    {detailText.quantityLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {specsData.valoriNutrizionali.map((row: { k: string; v: string }, idx: number) => (
                  <tr key={idx}>
                    <td className={`py-3 ${row.k.startsWith("-") ? "pl-4 text-neutral-500 font-medium" : "font-semibold text-neutral-800"}`}>
                      {row.k}
                    </td>
                    <td className="py-3 text-right font-bold text-neutral-900">
                      {row.v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, descriptionParagraph, currentProduct, selectedVariant, detailText, specsMap]);

  const recommendations = useMemo<ProductCardProduct[]>(() => {
    const mapProductToCard = (p: Product): ProductCardProduct => {
      const cheapestVariant = p.variants?.reduce((min, cur) => (cur.priceCents < min.priceCents ? cur : min), p.variants[0]);
      const priceCents = cheapestVariant ? cheapestVariant.priceCents : 1500;
      const hasMultiple = (p.variants?.length ?? 0) > 1;

      const priceCaptionCopy = {
        it: { from: "A partire da", price: "Prezzo" },
        en: { from: "From", price: "Price" },
        de: { from: "Ab", price: "Preis" },
        nl: { from: "Vanaf", price: "Prijs" },
        da: { from: "Fra", price: "Pris" },
        no: { from: "Fra", price: "Pris" },
      };
      const pCopy = priceCaptionCopy[locale as keyof typeof priceCaptionCopy] ?? priceCaptionCopy.it;

      return {
        id: p.id,
        slug: p.slug,
        title: hasMultiple ? p.title : (cheapestVariant?.title || p.title),
        subtitle: p.subtitle ?? (cheapestVariant ? formatSizeLabel(cheapestVariant) : ""),
        badge: p.badge,
        merchBadge: p.merchBadge || null,
        imageSrc: cheapestVariant?.imageSrc ?? p.imageSrc ?? "",
        imageAlt: cheapestVariant?.imageAlt ?? p.imageAlt ?? "",
        priceLabel: formatEUR(priceCents, locale),
        priceCaption: hasMultiple ? pCopy.from : pCopy.price,
        priceCents,
        defaultVariantId: cheapestVariant?.id,
        variantsCount: p.variants?.length ?? 1,
        variantLabel: hasMultiple ? undefined : (p.variants?.[0]?.label || undefined),
      };
    };

    if (isEvo) {
      // Use real related products plus EVO latta as a recommendation
      return relatedProducts.slice(0, 3).map(mapProductToCard);
    }

    return relatedProducts.slice(0, 4).map(mapProductToCard);
  }, [isEvo, locale, relatedProducts]);

  // FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  const currentFaqs = text.faqs || [];

  const shopLabel = detailText.shopLabel;
  const homePath = locale === "it" ? "/" : `/${locale}`;
  const shopPath = locale === "it" ? "/shop" : `/${locale}/shop`;
  const breadcrumbTitle = selectedVariant?.title
    ? selectedVariant.title
    : (selectedVariant?.label ? `${currentProduct.title} - ${selectedVariant.label}` : currentProduct.title);

  const categoryLabel = currentProduct.id === "vino" ? detailText.vinoCategory : detailText.oilCategory;

  return (
    <>
      {/* Breadcrumb sottile reattivo */}
      <nav className="mb-6 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
        <Link href={homePath} className="hover:text-[#B5945B] transition-colors">Home</Link>
        <span className="text-[#D6D3D1]">/</span>
        <Link href={shopPath} className="hover:text-[#B5945B] transition-colors">{shopLabel}</Link>
        <span className="text-[#D6D3D1]">/</span>
        <span className="text-neutral-900 font-bold">{breadcrumbTitle}</span>
      </nav>

      {/* SEZIONE SUPERIORE: FOTO & ACQUISTO */}
      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        
        {/* COLONNA SINISTRA: GALLERIA IMMAGINI PREMIUM (Foto riempie tutto - object-cover) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col"
        >
          {/* Visualizzatore Principale */}
          <div className="relative overflow-hidden rounded-[5px] bg-[#FAF7F2] border border-[#E7DEC8] aspect-[4/5] shadow-[0_12px_40px_rgba(0,0,0,0.03)] group">
            {/* Badges in alto a sinistra/destra */}
            <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between pointer-events-none select-none w-[calc(100%-32px)]">
              {(() => {
                const defaultBadgesMap: Record<string, string> = {
                  "fruttato-medio": currentProduct.badge || "",
                  "fruttato-intenso": currentProduct.badge || "",
                  "evo": currentProduct.badge || "",
                  "tartufo": currentProduct.badge || "",
                  "peperoncino": currentProduct.badge || "",
                };

                const rawDefaultBadge = defaultBadgesMap[currentProduct.id] !== undefined
                  ? defaultBadgesMap[currentProduct.id]
                  : (currentProduct.badge || "CLASSICO");

                if (!rawDefaultBadge) return <div />;

                return (
                  <div className="rounded-[4px] bg-[#d29b46] px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-white uppercase shadow-sm">
                    {rawDefaultBadge}
                  </div>
                );
              })()}

              {(() => {
                const rawMerchBadge = currentProduct.merchBadge || "";
                if (!rawMerchBadge) return null;
                const upperMerch = rawMerchBadge.toUpperCase();
                const MERCH_BADGES: Record<string, Record<string, string>> = {
                  PIU_VENDUTO: { it: "Più venduto", en: "Best seller", de: "Bestseller", nl: "Bestseller", da: "Bestseller", no: "Bestseller" },
                  IN_OFFERTA: { it: "In offerta", en: "Special offer", de: "Im Angebot", nl: "Aanbieding", da: "Tilbud", no: "Tilbud" },
                  NOVITA: { it: "Novità", en: "New", de: "Neu", nl: "Nieuw", da: "Nyhed", no: "Nyhet" },
                  HOT: { it: "Hot", en: "Hot", de: "Hot", nl: "Hot", da: "Hot", no: "Hot" },
                  IN_HOME: { it: "In home", en: "Featured", de: "Empfohlen", nl: "Aanbevolen", da: "Udvalgt", no: "Utvalgt" },
                };
                const translatedMerchBadge = MERCH_BADGES[upperMerch]
                  ? (MERCH_BADGES[upperMerch][locale] ?? MERCH_BADGES[upperMerch].it)
                  : rawMerchBadge;

                return (
                  <div className="rounded-[4px] border border-[#ddd7ce] bg-white/92 px-2 py-[3px] text-[9px] font-bold tracking-[0.08em] text-[#1f1a17] uppercase shadow-sm backdrop-blur-sm">
                    {translatedMerchBadge}
                  </div>
                );
              })()}
            </div>

            <AnimatePresence mode="wait">
              {activeImage ? (
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={activeImage}
                    alt={currentProduct.imageAlt || currentProduct.title}
                    fill
                    className="object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    onClick={() => openLightbox(galleryImages.indexOf(activeImage))}
                  />
                </motion.div>
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center text-xs font-semibold text-neutral-400">
                    Immagine non disponibile
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Miniature (Thumbnails - object-cover) */}
          {galleryItems.length > 1 && (
            <div className="flex flex-wrap gap-2.5 mt-4">
              {galleryItems.map((item, idx) => {
                const isActive = item.src === activeImage;
                const thumbLabel = item.label
                  .replace(/Bottiglia|Latta|Can/gi, "")
                  .trim();
                
                return (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleImageClick(item)}
                    className="relative flex flex-col items-center gap-1 cursor-pointer group/thumb w-[72px]"
                  >
                    <div className={`relative aspect-square w-full overflow-hidden rounded-[5px] bg-[#FAF7F2] border transition-all ${
                      isActive ? "border-2 border-[#B5945B] ring-1 ring-[#B5945B]/20" : "border-neutral-200 hover:border-neutral-400"
                    }`}>
                      <Image
                        src={item.src}
                        alt={item.alt || `Miniatura ${idx + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                        sizes="72px"
                      />
                    </div>
                    {thumbLabel && (
                      <span className={`text-[9px] font-semibold tracking-wide text-center truncate w-full transition-colors ${
                        isActive ? "text-[#B5945B] font-bold" : "text-neutral-500 group-hover/thumb:text-neutral-700"
                      }`}>
                        {thumbLabel}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* COLONNA DESTRA: DETTAGLI PRODOTTO E ACQUISTO */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="flex flex-col"
        >
          {/* Categoria */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B5945B] uppercase">
              {categoryLabel}
            </span>
          </div>
          
          {/* Titolo Box (Spazio fissato su desktop per evitare lo shifting dei componenti sottostanti) */}
          <div className="mt-3 md:h-[90px] md:min-h-[90px] md:max-h-[90px] lg:h-[110px] lg:min-h-[110px] lg:max-h-[110px] h-auto flex items-start mb-2 md:mb-0">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.1] tracking-tight text-[#0F0E0C] line-clamp-2">
              {selectedVariant?.title || currentProduct.title}
              {selectedVariant?.label && !selectedVariant?.title ? ` - ${selectedVariant.label}` : ""}
            </h1>
          </div>



          {/* Prezzo e Informazioni Fiscali */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-sans text-3xl font-extrabold text-[#0A0A0A] tracking-tight">
              {formatEUR(variantPriceCents, locale)}
            </span>
            <span className="text-xs text-[#8B7355] font-bold uppercase tracking-[0.15em]">
              {formatSizeLabel(selectedVariant)}
            </span>
            <span className="text-[10px] text-neutral-400 tracking-wider">
              | IVA inclusa
            </span>
          </div>

          {/* Descrizione Breve */}
          <div className="relative mt-4 md:h-[90px] md:min-h-[90px] md:max-h-[90px] h-auto shrink-0 grow-0">
            <div className="h-full w-full overflow-y-auto no-scrollbar text-[14.5px] leading-relaxed text-[#1C1C1C] font-normal pb-4">
              {descriptionParagraph}
            </div>
            {/* Sfumatura premium sfocata per indicare altro testo scorribile */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#FAF7F2] to-transparent pointer-events-none md:block hidden" />
          </div>

          {/* Griglia dei 4 Badges Chiave */}
          {isEvo && (
            <div className="grid grid-cols-4 gap-2 py-4 px-2 border border-[#E7DEC8] bg-[#FAF6EE] rounded-[5px] my-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#121212]/5 text-neutral-900 shrink-0">
                  {ItalyIcon}
                </div>
                <span className="text-[10px] font-bold text-[#121212] tracking-wide mt-2">100% Italiano</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Origine garantita</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/5 text-[#B5945B] shrink-0">
                  <Droplets className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-[#121212] tracking-wide mt-2">Estratto a freddo</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Massima qualità</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/5 text-[#B5945B] shrink-0">
                  <Leaf className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-[#121212] tracking-wide mt-2">Raccolta precoce</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Gusto intenso</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900/5 text-[#B5945B] shrink-0">
                  <Warehouse className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-[#121212] tracking-wide mt-2">Frantoio di famiglia</span>
                <span className="text-[9px] text-neutral-500 mt-0.5 leading-none">Dal 1954</span>
              </div>
            </div>
          )}

          {/* Formati navigabili */}
          {formatNavGroups ? (
            <>
              {/* Desktop version */}
              <div className="hidden md:block mt-2 space-y-4 rounded-[5px] border border-neutral-200/80 bg-[#FAF7F2] p-4">
                {([
                  ["bottle", text.bottleFormat, formatNavGroups.bottle],
                  ["can", text.canFormat, formatNavGroups.can],
                ] as const).map(([groupId, label, items]) => (
                  <div key={groupId}>
                    <label className="mb-2 block text-[10px] font-bold tracking-[0.18em] text-neutral-500 uppercase">
                      {label}
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {items.map((item) => {
                        const isSelected =
                          item.productId === currentProduct.id && String(item.variantId) === String(selectedVariantId);

                        return (
                          <button
                            key={`${item.productId}:${item.variantId}`}
                            type="button"
                            onClick={() => handleFormatSelect(item)}
                            className={`inline-flex min-h-11 shrink-0 items-center justify-center rounded-[5px] border px-4 py-2.5 text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#121212] border-[#B5945B] text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                                : "bg-white border-neutral-200 text-neutral-800 hover:border-[#121212] hover:text-[#121212] hover:bg-neutral-50/50"
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile premium version */}
              <div className="md:hidden space-y-4 mt-2">
                {([
                  ["bottle", text.bottleFormat, formatNavGroups.bottle],
                  ["can", text.canFormat, formatNavGroups.can],
                ] as const).map(([groupId, label, items]) => (
                  <div key={groupId} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="h-px w-3 bg-[#8B7355]/60" />
                      <span className="text-[10px] font-bold tracking-[0.18em] text-[#8B7355] uppercase">
                        {label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const isSelected =
                          item.productId === currentProduct.id && String(item.variantId) === String(selectedVariantId);

                        const priceCents = getFormatNavItemPrice(item.productId, item.variantId);
                        const formattedPrice = priceCents ? formatEUR(priceCents, locale) : "";

                        const prod = (catalog as Product[]).find((p) => p.id === item.productId);
                        const variant = prod?.variants?.find((v) => String(v.id) === String(item.variantId));
                        const isVarOut = availMap && variant
                          ? (availMap[makeInventorySku(item.productId, variant.id, variant.sku)] ?? 0) <= 0
                          : false;

                        return (
                          <button
                            key={`${item.productId}:${item.variantId}`}
                            type="button"
                            disabled={isVarOut}
                            onClick={() => handleFormatSelect(item)}
                            className={`w-full flex items-center justify-between p-3.5 border rounded-[5px] text-left transition-all relative overflow-hidden cursor-pointer ${
                              isVarOut
                                ? "opacity-45 cursor-not-allowed border-neutral-100 bg-neutral-50/50"
                                : isSelected
                                ? "border-[#B5945B] bg-[#121212]/[0.02] shadow-sm"
                                : "border-neutral-200 bg-white hover:border-neutral-300"
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B5945B]" />
                            )}
                            <div className="flex items-center gap-3">
                              <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                isSelected ? "border-[#B5945B] bg-white" : "border-neutral-300 bg-white"
                              }`}>
                                {isSelected && (
                                  <div className="h-2.5 w-2.5 rounded-full bg-[#B5945B]" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold tracking-wide text-[#121212]">
                                  {item.label}
                                </span>
                                {isVarOut ? (
                                  <span className="text-[10px] text-red-500 font-bold uppercase mt-0.5">
                                    {text.outOfStock}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
                                    {groupId === "bottle" ? detailText.glassBottle : detailText.metalTin}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm font-bold ${isSelected ? "text-[#B5945B]" : "text-neutral-900"}`}>
                                {formattedPrice}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : variants.length > 1 ? (
            <>
              {/* Desktop version */}
              <div className="hidden md:block mt-2">
                <label className="mb-2 block text-[10px] font-bold tracking-[0.2em] text-neutral-500 uppercase">
                  {text.format}
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {variants.map((v) => {
                    const isSelected = String(v.id) === String(selectedVariantId);
                    const isVarOut = availMap
                      ? (availMap[makeInventorySku(currentProduct.id, v.id, v.sku)] ?? 0) <= 0
                      : false;

                    return (
                      <button
                        key={v.id}
                        disabled={isVarOut}
                        onClick={() => handleVariantSelect(v)}
                        className={`flex flex-col items-center justify-center py-3.5 border rounded-[5px] transition-all cursor-pointer ${
                          isVarOut 
                            ? "opacity-35 cursor-not-allowed border-neutral-100 bg-neutral-50"
                            : isSelected
                              ? "bg-[#121212] border-[#B5945B] text-white shadow-[0_4px_16px_rgba(0,0,0,0.18)]"
                              : "bg-white border-neutral-200 text-neutral-800 hover:border-[#121212] hover:text-[#121212] hover:bg-neutral-50/50 hover:scale-[1.01]"
                        }`}
                      >
                        <span className="text-sm font-semibold tracking-wide">
                          {formatSizeLabel(v)}
                        </span>
                        <span className={`text-[11px] mt-0.5 ${isSelected ? "text-white/80" : "text-neutral-400"}`}>
                          {formatEUR(v.priceCents, locale)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile premium version */}
              <div className="md:hidden mt-2 space-y-2">
                <label className="mb-3 block text-[10px] font-bold tracking-[0.25em] text-[#8B7355] uppercase">
                  {text.format}
                </label>
                
                {variants.map((v) => {
                  const isSelected = String(v.id) === String(selectedVariantId);
                  const isVarOut = availMap
                    ? (availMap[makeInventorySku(currentProduct.id, v.id, v.sku)] ?? 0) <= 0
                    : false;

                  return (
                    <button
                      key={v.id}
                      disabled={isVarOut}
                      onClick={() => handleVariantSelect(v)}
                      className={`w-full flex items-center justify-between p-3.5 border rounded-[5px] transition-all text-left relative overflow-hidden cursor-pointer ${
                        isVarOut
                          ? "opacity-45 cursor-not-allowed border-neutral-100 bg-neutral-50/50"
                          : isSelected
                          ? "border-[#B5945B] bg-[#121212]/[0.02] shadow-sm"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B5945B]" />
                      )}
                      
                      <div className="flex items-center gap-3">
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "border-[#B5945B] bg-white" : "border-neutral-300 bg-white"
                        }`}>
                          {isSelected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-[#B5945B]" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold tracking-wide text-[#121212]">
                            {formatSizeLabel(v)}
                          </span>
                          {isVarOut ? (
                            <span className="text-[10px] text-red-500 font-bold uppercase mt-0.5">
                              {text.outOfStock}
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
                              {v.label ? v.label : (locale === "it" ? "Formato standard" : "Standard size")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-base font-extrabold tracking-tight ${isSelected ? "text-[#B5945B]" : "text-neutral-900"}`}>
                          {formatEUR(v.priceCents, locale)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {/* Quantità */}
          {/* Desktop Version */}
          <div className="hidden md:flex mt-6 flex-col">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                {text.quantity}
              </label>
              
              {/* Indicatore stock in tempo reale */}
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  loadingAvail 
                    ? "bg-neutral-300 animate-pulse" 
                    : isOutOfStock 
                      ? "bg-red-500" 
                      : "bg-[#B5945B]"
                }`} />
                <span className="text-[10px] font-semibold text-neutral-500">
                  {loadingAvail 
                    ? text.checking 
                    : isOutOfStock 
                      ? text.outOfStock 
                      : maxQty < 15 
                        ? text.maxLimit.replace("{max}", String(maxQty)) 
                        : text.available
                  }
                </span>
              </div>
            </div>

            <div className="inline-flex items-center border border-neutral-200 bg-white rounded-[5px] w-fit overflow-hidden self-start">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || isOutOfStock}
                className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-20 cursor-pointer"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-semibold tabular-nums text-neutral-800">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty || isOutOfStock}
                className="flex h-11 w-11 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-900 disabled:opacity-20 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile Premium Quantity Selector */}
          <div className="md:hidden mt-4 p-4 border border-[#E7DEC8] rounded-[5px] bg-[#FAF6EE] flex items-center justify-between shadow-sm">
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#8B7355]">
                {text.quantity}
              </span>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  loadingAvail 
                    ? "bg-neutral-300 animate-pulse" 
                    : isOutOfStock 
                      ? "bg-red-500" 
                      : "bg-[#B5945B]"
                }`} />
                <span className="text-[10px] font-semibold text-neutral-500 leading-none">
                  {loadingAvail 
                    ? text.checking 
                    : isOutOfStock 
                      ? text.outOfStock 
                      : maxQty < 15 
                        ? text.maxLimit.replace("{max}", String(maxQty)) 
                        : text.available
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center border border-neutral-300 bg-white rounded-[5px] overflow-hidden shadow-sm">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || isOutOfStock}
                className="flex h-11 w-11 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-20 cursor-pointer"
                aria-label="Diminuisci quantità"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold tabular-nums text-neutral-800">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                disabled={qty >= maxQty || isOutOfStock}
                className="flex h-11 w-11 items-center justify-center text-neutral-500 transition-colors hover:text-neutral-900 disabled:opacity-20 cursor-pointer"
                aria-label="Aumenta quantità"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="my-6 h-px bg-neutral-100" />

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 text-xs font-semibold text-red-500 bg-red-50/50 border border-red-100 p-3 rounded-[5px]">
              {errorMessage}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            {/* Aggiungi al Carrello */}
            <motion.button
              whileHover={!isOutOfStock && !isAdding ? { scale: 1.01 } : {}}
              whileTap={!isOutOfStock && !isAdding ? { scale: 0.99 } : {}}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`flex items-center justify-center gap-2.5 w-full py-4 text-xs font-bold tracking-[0.15em] rounded-[5px] border border-[#B5945B]/60 transition-all cursor-pointer ${
                isOutOfStock
                  ? "bg-neutral-200 text-neutral-400 cursor-not-allowed border-transparent"
                  : isAdding
                    ? "bg-neutral-200 text-neutral-500 cursor-wait border-transparent"
                    : "bg-[#121212] text-white hover:bg-[#1E1E1E] shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4.5 w-4.5 text-white animate-bounce" />
                  {text.added}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  {isOutOfStock ? text.outOfStock : `${text.addToCart} • ${totalPriceFormatted}`}
                </>
              )}
            </motion.button>

            {cartCount > 0 && cartTotalCents > 0 ? (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                disabled={checkoutLoading}
                onClick={handleDirectCheckout}
                className="flex w-full items-center justify-center gap-2.5 rounded-[5px] border border-neutral-900 bg-white py-4 text-xs font-bold tracking-[0.15em] text-neutral-900 transition-all hover:bg-neutral-900 hover:text-white active:scale-[0.985] disabled:opacity-50 disabled:cursor-wait cursor-pointer"
              >
                {checkoutLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
                    {detailText.redirecting}
                  </>
                ) : (
                  `${text.goToCheckout} • ${cartTotalFormatted}`
                )}
              </motion.button>
            ) : null}
          </div>

          {/* Promo Spedizione */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-neutral-500">
            <Truck className="h-3.5 w-3.5 text-neutral-400" />
            <span>{text.shippingPromo}</span>
          </div>
        </motion.div>

      </div>

      {/* SEZIONE INFERIORE: SCHEDE DETTAGLIATE & FILOSOFIA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 py-16 border-t border-neutral-200 mt-20 items-start">
        
        {/* Tab + Contenuto Wrapper per unione a cartella su mobile */}
        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-12 w-full">
          {/* Schede informative */}
          <div 
            className="flex overflow-x-auto pb-0 self-start lg:col-span-1 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0 lg:pr-4 space-x-[-1px] w-full border-b border-[#E5E3DB] lg:border-b-0 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {(() => {
              const tabs = [
                { id: "descrizione", label: text.description },
                { id: "caratteristiche", label: text.features },
                { id: "abbinamenti", label: text.pairings },
                { id: "ingredienti", label: text.ingredients },
                { id: "valori nutrizionali", label: text.nutrition },
              ];

              const hasSpecs = (currentProduct.specs && Object.keys(currentProduct.specs).length > 0) || 
                               (selectedVariant?.specs && Object.keys(selectedVariant.specs).length > 0);

              if (hasSpecs) {
                tabs.push({ 
                  id: "specifiche", 
                  label: currentProduct.specsTitle || detailText.specifications
                });
              }

              return tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer border border-[#E5E3DB] text-center lg:text-left ${
                      isActive 
                        ? "bg-white text-neutral-900 rounded-t-[5px] border-b-transparent border-t-2 border-t-[#B5945B] z-10 relative px-6 pt-3.5 pb-3.5 lg:bg-transparent lg:border-y-0 lg:border-r-0 lg:border-l-2 lg:border-[#B5945B] lg:text-neutral-900 lg:rounded-none lg:px-0 lg:pl-4 lg:py-3 lg:z-auto lg:border-t-transparent" 
                        : "bg-[#F8F7F4] text-neutral-400 rounded-t-[5px] mt-[4px] px-5 pt-2.5 pb-2.5 hover:bg-[#FAF6EE] hover:text-[#B5945B] lg:bg-transparent lg:border-transparent lg:text-neutral-500 lg:hover:text-neutral-900 lg:rounded-none lg:px-0 lg:pl-4 lg:py-3 lg:mt-0"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              });
            })()}
          </div>

          {/* Contenuto della scheda selezionata (Col 2 e 3) */}
          <div className="lg:col-span-2 flex flex-col justify-start bg-[#FAF8F5] border border-[#E7DEC8] rounded-[5px] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)] -mt-[1px] lg:bg-transparent lg:border-none lg:rounded-none lg:p-0 lg:shadow-none lg:mt-0 lg:px-6">
            <h3 className="text-xs font-bold tracking-[0.2em] text-[#8B7355] mb-6 uppercase lg:block hidden">
              {activeTab === "descrizione" ? text.description :
               activeTab === "caratteristiche" ? text.features :
               activeTab === "abbinamenti" ? text.pairings :
               activeTab === "ingredienti" ? text.ingredients :
               activeTab === "valori nutrizionali" ? text.nutrition :
               activeTab === "specifiche" ? (currentProduct.specsTitle || detailText.specifications) :
               activeTab}
            </h3>
            
            <div className="animate-in fade-in duration-300">
              {currentTabContent}
            </div>
          </div>
        </div>

        {/* Filosofia Card con Immagine Uliveto (Col 4) - Stretches dynamically to match content height */}
        <div className="flex lg:col-span-1 w-full">
          <div className="relative overflow-hidden rounded-[5px] flex flex-col justify-between p-6 text-white h-[380px] w-full shadow-sm z-0">
            {/* Sfondo uliveto */}
            <Image
              src="/products/del_pasqua_olive_grove.png"
              alt="Uliveto Del Pasqua"
              fill
              className="object-cover -z-20 rounded-[5px]"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
            {/* Gradiente nero */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent -z-10 rounded-[5px]" />
            
            <span className="text-[9px] font-bold tracking-[0.25em] text-[#E0D8C8]">
              {text.philosophylabel}
            </span>
            
            <div className="mt-auto">
              <h4 className="font-serif text-xl font-light leading-tight mb-5">
                {text.philosophyTitle}
              </h4>
              
              <Link 
                href={`/${locale}/produzione`}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-white hover:text-[#E0D8C8] group transition-colors uppercase"
              >
                <span>{text.philosophyLink}</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* SEZIONE RACCOMANDATI */}
      <div className="border-t border-neutral-200 pt-16 mt-6">
        <h2 className="text-center font-serif text-2xl lg:text-3xl font-light text-neutral-900 tracking-tight mb-8">
          {text.relatedTitle}
        </h2>
        
        {/* Mobile View: list layout cards */}
        <div className="sm:hidden flex flex-col gap-4 mt-8">
          {recommendations.map((item) => (
            <MobileListCard
              key={item.id}
              product={item}
              locale={locale}
              copy={{
                from: detailText.fromLabel,
                price: detailText.priceLabel,
              }}
              onClick={() => {
                try {
                  import("@/lib/analytics/track").then(({ track }) => {
                    track({
                      type: "product_click",
                      productKey: item.id,
                      variantKey: item.defaultVariantId ?? null,
                      data: { slug: item.slug },
                    });
                  });
                } catch (e) {
                  console.error(e);
                }
              }}
            />
          ))}
        </div>

        {/* Desktop View: grid layout cards */}
        <div className="hidden sm:grid auto-rows-fr grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {recommendations.map((item) => (
            <div key={item.id} className="flex h-full">
              <ProductCard
                product={item}
                onClick={() => {
                  try {
                    import("@/lib/analytics/track").then(({ track }) => {
                      track({
                        type: "product_click",
                        productKey: item.id,
                        variantKey: item.defaultVariantId ?? null,
                        data: { slug: item.slug },
                      });
                    });
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SEZIONE FAQ (DOMANDE FREQUENTI) - IMPORTANT FOR SEO */}
      {currentFaqs.length > 0 && (
        <div className="border-t border-neutral-200 pt-16 mt-16 pb-8">
          <h2 className="text-center font-serif text-2xl lg:text-3xl font-light text-neutral-900 tracking-tight mb-10">
            {text.faqTitle}
          </h2>
          
          <div className="mx-auto max-w-3xl space-y-4">
            {currentFaqs.map((faq: { q: string; a: string }, idx: number) => {
              const isOpen = openFaqIndex === idx;
              
              return (
                <div 
                  key={idx} 
                  className="border border-neutral-200 bg-white rounded-[5px] overflow-hidden transition-all shadow-none"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-serif text-[15px] font-semibold text-neutral-800 hover:bg-neutral-50/50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      className={`h-4 w-4 text-[#3D5A3D] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-neutral-100 text-sm leading-relaxed text-neutral-600 font-light bg-neutral-50/20 animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIGHTBOX POPUP DI GALLERIA */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Bottone Chiudi */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-[5px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Bottone Precedente */}
          <button 
            onClick={(e) => { e.stopPropagation(); prevLightboxImage(); }}
            className="absolute left-6 text-white/70 hover:text-white p-3 rounded-[5px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Immagine Attiva */}
          <div 
            className="relative w-[90vw] h-[75dvh] md:w-[70vw] md:h-[80dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxIndex]}
              alt={`Galleria ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Bottone Successiva */}
          <button 
            onClick={(e) => { e.stopPropagation(); nextLightboxImage(); }}
            className="absolute right-6 text-white/70 hover:text-white p-3 rounded-[5px] bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Contatore in basso */}
          <div className="absolute bottom-6 text-white/60 text-xs font-semibold uppercase tracking-widest">
            {lightboxIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </>
  );
}
