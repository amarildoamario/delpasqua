import { makeInventorySku } from "@/lib/inventorySku";
import type { CartLine, Product } from "@/lib/shopTypes";

export type AvailabilityMap = Record<string, number>;

export type CartAvailabilityNotice = {
  id: number;
  kind: "reduced" | "removed" | "migrated" | "invalid_removed";
  productId: string;
  variantId: string;
  previousProductId?: string;
  previousVariantId?: string;
  prevQty: number;
  nextQty: number;
  availableQty: number;
};

export type CartVariantLocation = {
  productId: string;
  variantId: string;
  variant: Product["variants"][number];
};

export function clampCartQty(qty: number) {
  const normalized = Math.trunc(qty);
  if (!Number.isFinite(normalized) || normalized <= 0) return 0;
  return Math.min(99, normalized);
}

export function normalizeAvailableQty(value: number | null | undefined) {
  if (typeof value !== "number") return null;
  return Math.max(0, Math.min(99, Math.trunc(value)));
}

export function cartLineKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

export function buildVariantLocationByKey(catalog: Product[]) {
  const map = new Map<string, CartVariantLocation>();

  for (const product of catalog) {
    for (const variant of product.variants) {
      const location: CartVariantLocation = {
        productId: product.id,
        variantId: variant.id,
        variant,
      };

      map.set(cartLineKey(product.id, variant.id), location);

      for (const alias of variant.cartAliases || []) {
        if (!alias?.productId || !alias?.variantId) continue;
        const aliasKey = cartLineKey(alias.productId, alias.variantId);
        if (!map.has(aliasKey)) map.set(aliasKey, location);
      }
    }
  }

  return map;
}

export function resolveCartLine(
  line: CartLine,
  variantLocationByKey: Map<string, CartVariantLocation>
) {
  const productId = typeof line?.productId === "string" ? line.productId.trim() : "";
  const variantId = typeof line?.variantId === "string" ? line.variantId.trim() : "";
  if (!productId || !variantId) return null;
  return variantLocationByKey.get(cartLineKey(productId, variantId)) ?? null;
}

export function getCartLineSku(
  productId: string,
  variantId: string,
  variantLocationByKey: Map<string, CartVariantLocation>
) {
  const location = variantLocationByKey.get(cartLineKey(productId, variantId));
  if (!location) return null;
  return makeInventorySku(location.productId, location.variantId, location.variant.sku);
}

export function normalizeCartLines(args: {
  candidateLines: CartLine[];
  availability: AvailabilityMap;
  variantLocationByKey: Map<string, CartVariantLocation>;
}) {
  const grouped = new Map<string, CartLine>();

  for (const rawLine of args.candidateLines) {
    const location = resolveCartLine(rawLine, args.variantLocationByKey);
    if (!location) continue;

    const key = cartLineKey(location.productId, location.variantId);
    const nextQty = clampCartQty(rawLine.qty);
    if (nextQty <= 0) continue;

    const sku = getCartLineSku(location.productId, location.variantId, args.variantLocationByKey);
    const knownAvailability =
      sku && typeof args.availability[sku] === "number"
        ? normalizeAvailableQty(args.availability[sku])
        : null;

    if (knownAvailability === 0) continue;

    const existing = grouped.get(key);
    const mergedQty = (existing?.qty ?? 0) + nextQty;
    const clampedQty =
      knownAvailability === null ? Math.min(99, mergedQty) : Math.min(knownAvailability, mergedQty);

    if (clampedQty <= 0) continue;

    grouped.set(key, {
      productId: location.productId,
      variantId: location.variantId,
      qty: clampedQty,
    });
  }

  return [...grouped.values()];
}

export function getCatalogNormalizationNotice(args: {
  candidateLines: CartLine[];
  variantLocationByKey: Map<string, CartVariantLocation>;
  nextNoticeId: () => number;
}) {
  for (const rawLine of args.candidateLines) {
    const location = resolveCartLine(rawLine, args.variantLocationByKey);
    const productId = typeof rawLine?.productId === "string" ? rawLine.productId : "";
    const variantId = typeof rawLine?.variantId === "string" ? rawLine.variantId : "";
    const qty = clampCartQty(rawLine?.qty);
    if (qty <= 0) continue;

    if (!location) {
      return {
        id: args.nextNoticeId(),
        kind: "invalid_removed" as const,
        productId,
        variantId,
        prevQty: qty,
        nextQty: 0,
        availableQty: 0,
      };
    }

    if (location.productId !== productId || location.variantId !== variantId) {
      return {
        id: args.nextNoticeId(),
        kind: "migrated" as const,
        productId: location.productId,
        variantId: location.variantId,
        previousProductId: productId,
        previousVariantId: variantId,
        prevQty: qty,
        nextQty: qty,
        availableQty: 0,
      };
    }
  }

  return null;
}
