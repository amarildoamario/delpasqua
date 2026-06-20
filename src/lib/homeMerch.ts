export const HOME_MERCH_FALLBACK_SLUGS = ["fruttato-medio", "fruttato-intenso", "evo", "tartufo"] as const;

type HomeMerchItem = {
  slug?: string | null;
  showInHome?: boolean | null;
  homeRank?: number | null;
};

type PickHomeMerchSlotsOptions<T extends HomeMerchItem> = {
  fallbackSlugs?: readonly string[];
  isDisabled?: (item: T) => boolean;
  limit?: number;
};

export type HomeMerchSlot<T> = {
  item: T;
  rank: number;
};

function rankSortValue(rank: number | null | undefined) {
  return typeof rank === "number" && rank > 0 ? rank : Number.MAX_SAFE_INTEGER;
}

export function pickHomeMerchSlots<T extends HomeMerchItem>(
  items: readonly T[],
  options: PickHomeMerchSlotsOptions<T> = {}
): HomeMerchSlot<T>[] {
  const fallbackSlugs = options.fallbackSlugs ?? HOME_MERCH_FALLBACK_SLUGS;
  const limit = options.limit ?? 4;
  const isDisabled = options.isDisabled ?? (() => false);

  const indexed = items.map((item, index) => ({ item, index }));

  const picked = indexed
    .filter(({ item }) => item.showInHome === true)
    .sort((a, b) => {
      const byRank = rankSortValue(a.item.homeRank) - rankSortValue(b.item.homeRank);
      return byRank || a.index - b.index;
    });

  const already = new Set(picked.map(({ item }) => item.slug).filter(Boolean));

  if (picked.length < limit) {
    for (const slug of fallbackSlugs) {
      if (picked.length >= limit) break;
      if (already.has(slug)) continue;

      const candidate = indexed.find(({ item }) => item.slug === slug);
      if (!candidate || candidate.item.showInHome === false || isDisabled(candidate.item)) continue;

      picked.push(candidate);
      already.add(slug);
    }
  }

  if (picked.length < limit) {
    for (const candidate of indexed) {
      if (picked.length >= limit) break;
      const slug = candidate.item.slug;
      if (slug && already.has(slug)) continue;
      if (candidate.item.showInHome === false || isDisabled(candidate.item)) continue;

      picked.push(candidate);
      if (slug) already.add(slug);
    }
  }

  return picked.slice(0, limit).map(({ item }, index) => ({
    item,
    rank: index + 1,
  }));
}
