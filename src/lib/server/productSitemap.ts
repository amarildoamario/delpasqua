import { filterSeoCatalog, readCatalog } from "@/lib/server/catalog";
import { prisma } from "@/lib/server/prisma";
import { latestSitemapDate } from "@/lib/sitemapDates";

export async function readProductSitemapEntries() {
  const [catalog, merch] = await Promise.all([
    readCatalog(),
    prisma.productMerch.findMany({ select: { productKey: true, updatedAt: true } }),
  ]);
  const merchDates = new Map(merch.map((item) => [item.productKey, item.updatedAt]));

  return filterSeoCatalog(catalog).map((product) => ({
    product,
    lastmod: latestSitemapDate(product.updatedAt, product.updateDate, merchDates.get(product.id)),
  }));
}
