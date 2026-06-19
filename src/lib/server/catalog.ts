import { promises as fs } from "fs";
import path from "path";
import { makeInventorySku, makeLegacyInventorySku, normalizeSku } from "@/lib/inventorySku";
import { prisma } from "@/lib/server/prisma";

// IMPORTANT:
// Do NOT `import products from "@/db/products.json"` in runtime code.
// Next.js will bundle JSON imports, making the catalog stale after edits.

export type CatalogVariant = {
  id: string;
  label?: string;
  priceCents?: number;
  sku?: string;
  cartAliases?: CatalogCartAlias[];
  imageSrc?: string;
  imageAlt?: string;
  title?: string;

  // campi extra presenti nel JSON (non tipizzati)
  [k: string]: unknown;
};

export type CatalogCartAlias = {
  productId: string;
  variantId: string;
};

export type CatalogProduct = {
  id: string;
  slug?: string;
  title?: string;
  category?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;

  // specs può essere qualunque struttura (oggetti, stringhe, ecc.)
  specs?: unknown;

  variants: CatalogVariant[];
  excludeFromSeo?: boolean;
  isPublished?: boolean;
  isPurchasable?: boolean;

  // campi extra presenti nel JSON (non tipizzati)
  [k: string]: unknown;
};

export function getCatalogPath() {
  return path.join(process.cwd(), "src", "db", "products.json");
}

export async function readCatalog(): Promise<CatalogProduct[]> {
  const filePath = getCatalogPath();
  const raw = await fs.readFile(filePath, "utf8");
  const json: unknown = JSON.parse(raw);

  return Array.isArray(json) ? (json as CatalogProduct[]) : [];
}

export function isPublishedCatalogProduct(product: CatalogProduct | null | undefined) {
  if (!product) return false;
  return product.isPublished !== false;
}

export function isPurchasableCatalogProduct(product: CatalogProduct | null | undefined) {
  if (!product) return false;
  return isPublishedCatalogProduct(product) && product.isPurchasable !== false;
}

export function isSeoVisibleCatalogProduct(product: CatalogProduct | null | undefined) {
  if (!product) return false;
  return isPurchasableCatalogProduct(product) && product.excludeFromSeo !== true;
}

export function filterPublicCatalog(products: CatalogProduct[]) {
  return products.filter(isPurchasableCatalogProduct);
}

export function filterSeoCatalog(products: CatalogProduct[]) {
  return products.filter(isSeoVisibleCatalogProduct);
}

export async function readPublicCatalog(): Promise<CatalogProduct[]> {
  return filterPublicCatalog(await readCatalog());
}

function normalizeCartAlias(value: unknown): CatalogCartAlias | null {
  if (!value || typeof value !== "object") return null;
  const alias = value as { productId?: unknown; variantId?: unknown };
  const productId = typeof alias.productId === "string" ? alias.productId.trim() : "";
  const variantId = typeof alias.variantId === "string" ? alias.variantId.trim() : "";
  return productId && variantId ? { productId, variantId } : null;
}

function cartAliasKey(alias: CatalogCartAlias) {
  return `${alias.productId}::${alias.variantId}`;
}

export function preserveCartAliases(
  currentCatalog: CatalogProduct[],
  nextCatalog: CatalogProduct[]
): CatalogProduct[] {
  const previousBySku = new Map<
    string,
    { productId: string; variantId: string; aliases: CatalogCartAlias[] }
  >();

  for (const product of currentCatalog || []) {
    for (const variant of product.variants || []) {
      const sku = normalizeSku(variant.sku);
      if (!sku) continue;
      const aliases = (variant.cartAliases || [])
        .map(normalizeCartAlias)
        .filter((alias): alias is CatalogCartAlias => Boolean(alias));
      previousBySku.set(sku, {
        productId: product.id,
        variantId: variant.id,
        aliases,
      });
    }
  }

  return nextCatalog.map((product) => ({
    ...product,
    variants: (product.variants || []).map((variant) => {
      const canonicalKey = cartAliasKey({ productId: product.id, variantId: variant.id });
      const aliasMap = new Map<string, CatalogCartAlias>();
      const addAlias = (value: unknown) => {
        const alias = normalizeCartAlias(value);
        if (!alias) return;
        const key = cartAliasKey(alias);
        if (key !== canonicalKey) aliasMap.set(key, alias);
      };

      for (const alias of variant.cartAliases || []) addAlias(alias);

      const previous = normalizeSku(variant.sku)
        ? previousBySku.get(normalizeSku(variant.sku) as string)
        : null;
      if (previous) {
        addAlias({ productId: previous.productId, variantId: previous.variantId });
        for (const alias of previous.aliases) addAlias(alias);
      }

      const cartAliases = [...aliasMap.values()];
      return {
        ...variant,
        cartAliases: cartAliases.length > 0 ? cartAliases : undefined,
      };
    }),
  }));
}

export async function writeCatalog(nextCatalog: CatalogProduct[]) {
  const filePath = getCatalogPath();
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  // Backup only if enabled: set CATALOG_BACKUPS=1
  const backupsEnabled = process.env.CATALOG_BACKUPS === "1";
  let backupName: string | undefined;

  if (backupsEnabled) {
    const ts = Date.now();
    backupName = `products.backup.${ts}.json`;
    const backupPath = path.join(dir, backupName);
    try {
      const current = await fs.readFile(filePath, "utf8");
      await fs.writeFile(backupPath, current, "utf8");
    } catch {
      // ignore (missing file)
    }
  }

  await fs.writeFile(filePath, JSON.stringify(nextCatalog, null, 2) + "\n", "utf8");
  return { backupName };
}

// Internal SKU used by the inventory table
export function makeInternalSku(productId: string, variantId: string) {
  return makeLegacyInventorySku(productId, variantId);
}

type CatalogInventoryVariantLike = {
  id?: string | null;
  sku?: string | null;
};

type CatalogInventoryProductLike = {
  id?: string | null;
  variants?: CatalogInventoryVariantLike[] | null;
};

type InventoryTx = Pick<typeof prisma, "inventoryItem" | "inventoryReservation">;

async function migrateLegacyInventorySku(
  tx: InventoryTx,
  canonicalSku: string,
  legacySku: string | null
) {
  if (!legacySku || legacySku === canonicalSku) {
    await tx.inventoryItem.upsert({
      where: { sku: canonicalSku },
      create: { sku: canonicalSku, stock: 0 },
      update: {},
    });
    return;
  }

  const [canonicalItem, legacyItem, legacyReservations] = await Promise.all([
    tx.inventoryItem.findUnique({
      where: { sku: canonicalSku },
      select: { sku: true, stock: true, reserved: true },
    }),
    tx.inventoryItem.findUnique({
      where: { sku: legacySku },
      select: { sku: true, stock: true, reserved: true },
    }),
    tx.inventoryReservation.findMany({
      where: { sku: legacySku },
      select: { orderId: true, sku: true, qty: true },
    }),
  ]);

  if (!legacyItem) {
    if (!canonicalItem) {
      await tx.inventoryItem.create({
        data: { sku: canonicalSku, stock: 0 },
      });
    }
    return;
  }

  if (!canonicalItem) {
    await tx.inventoryItem.create({
      data: {
        sku: canonicalSku,
        stock: legacyItem.stock,
        reserved: legacyItem.reserved,
      },
    });
  } else {
    await tx.inventoryItem.update({
      where: { sku: canonicalSku },
      data: {
        stock: canonicalItem.stock + legacyItem.stock,
        reserved: canonicalItem.reserved + legacyItem.reserved,
      },
    });
  }

  for (const reservation of legacyReservations) {
    await tx.inventoryReservation.upsert({
      where: {
        orderId_sku: {
          orderId: reservation.orderId,
          sku: canonicalSku,
        },
      },
      create: {
        orderId: reservation.orderId,
        sku: canonicalSku,
        qty: reservation.qty,
      },
      update: {
        qty: {
          increment: reservation.qty,
        },
      },
    });
  }

  if (legacyReservations.length > 0) {
    await tx.inventoryReservation.deleteMany({
      where: { sku: legacySku },
    });
  }

  await tx.inventoryItem.delete({
    where: { sku: legacySku },
  });
}

export async function syncInventoryForCatalog(catalog: CatalogInventoryProductLike[]) {
  const entries = new Map<string, { canonicalSku: string; legacySku: string | null }>();

  for (const product of catalog || []) {
    const productId = String(product?.id || "").trim();
    if (!productId) continue;

    for (const variant of product?.variants || []) {
      const variantId = String(variant?.id || "").trim();
      if (!variantId) continue;

      const canonicalSku = makeInventorySku(productId, variantId, variant?.sku);
      const legacySku = makeLegacyInventorySku(productId, variantId);

      entries.set(canonicalSku, {
        canonicalSku,
        legacySku: legacySku === canonicalSku ? null : legacySku,
      });
    }
  }

  if (entries.size === 0) return;

  await prisma.$transaction(
    async (tx) => {
      for (const entry of entries.values()) {
        await migrateLegacyInventorySku(tx, entry.canonicalSku, entry.legacySku);
      }
    },
    {
      maxWait: 10_000,
      timeout: 30_000,
    }
  );
}

export async function readCatalogWithMerch(): Promise<CatalogProduct[]> {
  const products = await readCatalog();
  const merch = await prisma.productMerch.findMany();
  const merchMap = new Map(merch.map((m) => [m.productKey, m]));

  const now = new Date();

  return products.map((p) => {
    const m = merchMap.get(p.id);
    if (!m) return p;

    // Check if the promo schedule is active
    const isPromoActive = (!m.startsAt || m.startsAt <= now) && (!m.endsAt || m.endsAt >= now);

    // Apply the discount to all variant prices if the promo is active
    const variants = (p.variants || []).map((v) => {
      let priceCents = v.priceCents ?? 0;
      if (isPromoActive) {
        const pct = m.discountPercent ?? 0;
        const fixed = m.discountCents ?? 0;
        if (pct > 0) {
          priceCents = Math.round((priceCents * (100 - pct)) / 100);
        }
        if (fixed > 0) {
          priceCents = Math.max(0, priceCents - fixed);
        }
      }
      return {
        ...v,
        priceCents,
      };
    });

    return {
      ...p,
      badge: p.badge,
      merchBadge: m.badge,
      showInHome: m.showInHome,
      homeRank: m.homeRank,
      isBestSeller: m.isBestSeller,
      promoLabel: isPromoActive ? (m.promoLabel ?? "") : "",
      variants,
    };
  });
}

export async function readPublicCatalogWithMerch(): Promise<CatalogProduct[]> {
  return filterPublicCatalog(await readCatalogWithMerch());
}
