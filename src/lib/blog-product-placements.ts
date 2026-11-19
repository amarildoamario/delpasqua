import { BLOG_PRODUCT_POSITIONS } from "@/lib/analytics/events";

type ProductSelection = `${string}:${string}`;
type ArticleProducts = readonly [ProductSelection, ProductSelection, ProductSelection];

// The article ID is shared by its translations. Tuples follow BLOG_PRODUCT_POSITIONS.
const articlePlacements: Partial<Record<string, ArticleProducts>> = {
  "post-chem-2": ["evo:500ml", "fruttato-intenso:500ml", "fruttato-medio-latta:1lt"],
  "post-store-2": ["fruttato-leggero-latta:5lt", "evo:500ml", "fruttato-medio-latta:1lt"],
  "post-store-1": ["fruttato-leggero:500ml", "evo-latta:750ml", "fruttato-medio:500ml"],
  "chim-4": ["evo-latta:750ml", "fruttato-medio-latta:1lt", "fruttato-leggero:500ml"],
  "tec-1": ["fruttato-medio:500ml", "fruttato-leggero:500ml", "evo-latta:750ml"],
  "tec-3": ["fruttato-medio-latta:1lt", "evo:500ml", "fruttato-intenso-latta:1lt"],
  "ric-9": ["fruttato-medio:500ml", "peperoncino:500ml", "fruttato-leggero-latta:1lt"],
  "com-4": ["fruttato-intenso:500ml", "fruttato-intenso-latta:1lt", "fruttato-medio:500ml"],
  "chim-2": ["evo:500ml", "fruttato-intenso:500ml", "fruttato-leggero-latta:1lt"],
};

const defaultPlacements: ArticleProducts = [
  "evo:500ml", "fruttato-medio:500ml", "fruttato-leggero-latta:1lt",
];

export function getBlogProductSelections(articleId: string) {
  const selections = Object.hasOwn(articlePlacements, articleId)
    ? articlePlacements[articleId] ?? defaultPlacements
    : defaultPlacements;

  return selections.map((selection, index) => {
    const [productKey, variantKey] = selection.split(":");
    return { position: BLOG_PRODUCT_POSITIONS[index], productKey, variantKey };
  });
}
