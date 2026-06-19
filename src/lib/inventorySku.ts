export function normalizeSku(value: unknown) {
  if (typeof value !== "string") return null;
  const sku = value.trim();
  return sku.length > 0 ? sku : null;
}

export function makeLegacyInventorySku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

export function makeInventorySku(productId: string, variantId: string, variantSku?: unknown) {
  return normalizeSku(variantSku) ?? makeLegacyInventorySku(productId, variantId);
}
