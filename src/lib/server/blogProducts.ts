import { unstable_cache } from "next/cache";
import { getTranslations } from "next-intl/server";
import { getBlogProductSelections } from "@/lib/blog-product-placements";
import { makeInventorySku } from "@/lib/inventorySku";
import { formatEUR } from "@/lib/money";
import { getLocalizedProductHref, translateVariantLabel } from "@/lib/productSlugs";
import { readPublicCatalogWithMerch } from "./catalog";
import { getAvailabilityBySkus } from "./inventoryRead";

const readAvailability = unstable_cache(getAvailabilityBySkus, ["blog-product-availability"], {
  revalidate: 60,
});

export async function getBlogProducts(locale: string, articleId: string, article: string) {
  const selections = getBlogProductSelections(articleId);
  const catalog = await readPublicCatalogWithMerch();
  const entries = selections.flatMap((selection) => {
    const { productKey, variantKey } = selection;
    const product = catalog.find(({ id }) => id === productKey);
    const variant = product?.variants.find(({ id }) => id === variantKey);
    const image = variant?.imageSrc || product?.imageSrc;
    if (!product || !variant || !image || typeof variant.priceCents !== "number" ||
        !Number.isSafeInteger(variant.priceCents) || variant.priceCents < 0) return [];

    return [{
      ...selection, product, variant, image, priceCents: variant.priceCents,
      sku: makeInventorySku(productKey, variantKey, variant.sku),
    }];
  });
  if (!entries.length) return [];

  let availability: Record<string, number>;
  try {
    // The storefront shares catalog and inventory across languages. Checkout
    // applies the active shipping market to the destination, independently.
    availability = await readAvailability(entries.map(({ sku }) => sku).sort());
  } catch {
    console.warn("[BLOG] Product availability could not be checked");
    return [];
  }

  const [products, shop] = await Promise.all([
    getTranslations({ locale, namespace: "Products" }),
    getTranslations({ locale, namespace: "ShopPage" }),
  ]);
  const viewProduct = shop("viewProduct");

  return entries.flatMap(({ product, variant, image, sku, priceCents, ...selection }) => {
    const { productKey, variantKey } = selection;
    if (!(availability[sku] > 0)) return [];

    const titleKey = `${productKey}.title`;
    const labelKey = `${productKey}.variants.${variantKey}`;
    const title = locale !== "it" && products.has(titleKey) ? products(titleKey) : product.title;
    const label = locale === "it" ? variant.label : (
      products.has(labelKey) ? products(labelKey) : translateVariantLabel(variantKey, variant.label ?? "", locale)
    );
    if (!title || !label) return [];

    return [{
      ...selection, locale, article, title, label, image, viewProduct,
      price: formatEUR(priceCents, locale),
      href: { ...getLocalizedProductHref(product, locale), query: { v: variantKey } },
    }];
  });
}
