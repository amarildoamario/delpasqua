export function makeInventorySku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}
