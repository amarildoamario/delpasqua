export function isTestOrderItems(items: ReadonlyArray<{ isTestProduct: boolean }>) {
  return items.length > 0 && items.every((item) => item.isTestProduct);
}

export function hasMixedTestAndCommercialItems(
  items: ReadonlyArray<{ isTestProduct: boolean }>
) {
  return items.some((item) => item.isTestProduct) && items.some((item) => !item.isTestProduct);
}
