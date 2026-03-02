import { promises as fs } from "fs";
import path from "path";

// IMPORTANT:
// Do NOT `import products from "@/db/products.json"` in runtime code.
// Next.js will bundle JSON imports, making the catalog stale after edits.

export type CatalogVariant = {
  id: string;
  label?: string;
  priceCents?: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;

  // campi extra presenti nel JSON (non tipizzati)
  [k: string]: unknown;
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
  return `${productId}:${variantId}`;
}