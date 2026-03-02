import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import {
  readCatalog,
  writeCatalog,
  makeInternalSku,
} from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

/*
  Questo endpoint:
  - GET pubblico: ritorna catalogo
  - POST admin: modifica catalogo
  - Crea automaticamente le SKU in InventoryItem
*/

// ---------------- SCHEMI ----------------

const VariantSchema = z
  .object({
    id: z.string().trim().min(1),
    label: z.string().optional(),
    priceCents: z.number().int().min(0).optional(),
  })
  .passthrough();

const ProductSchema = z
  .object({
    id: z.string().trim().min(1),
    slug: z.string().optional(),
    title: z.string().optional(),
    variants: z.array(VariantSchema).default([]),
  })
  .passthrough();

const CatalogSchema = z.array(ProductSchema);

type Variant = z.infer<typeof VariantSchema>;
type Catalog = z.infer<typeof CatalogSchema>;

const BodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("saveCatalog"), catalog: CatalogSchema }),

  z.object({ action: z.literal("createProduct"), product: ProductSchema }),
  z.object({ action: z.literal("updateProduct"), productId: z.string(), patch: z.any() }),
  z.object({ action: z.literal("deleteProduct"), productId: z.string() }),

  z.object({
    action: z.literal("addVariant"),
    productId: z.string(),
    variant: VariantSchema,
  }),
  z.object({
    action: z.literal("updateVariant"),
    productId: z.string(),
    variantId: z.string(),
    patch: z.any(),
  }),
  z.object({
    action: z.literal("deleteVariant"),
    productId: z.string(),
    variantId: z.string(),
  }),
]);

// ---------------- UTIL ----------------

function findProductIndex(catalog: Catalog, productId: string) {
  return catalog.findIndex((p) => String(p?.id) === String(productId));
}

function getErrText(e: unknown, fallback = "Error"): string {
  if (typeof e === "string") return e;
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === "object" && e !== null) {
    const o = e as { message?: unknown; error?: { message?: unknown } };
    const msg = o.message ?? o.error?.message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

async function ensureInventoryForCatalog(catalog: Catalog) {
  const skus: string[] = [];

  for (const p of catalog) {
    for (const v of (p.variants || []) as Variant[]) {
      skus.push(makeInternalSku(p.id, v.id));
    }
  }

  for (const sku of skus) {
    await prisma.inventoryItem.upsert({
      where: { sku },
      create: { sku, stock: 0 },
      update: {},
    });
  }
}

// ---------------- GET (pubblico) ----------------

export async function GET() {
  const catalog = await readCatalog();
  return NextResponse.json(catalog, {
    headers: { "Cache-Control": "no-store" },
  });
}

// ---------------- POST (admin) ----------------

export async function POST(req: Request) {
  const guard = await requireAdminApi(req);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return guard.attach(
      NextResponse.json({ ok: false, error: "Bad Request" }, { status: 400 })
    );
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return guard.attach(
      NextResponse.json(
        { ok: false, error: "Bad Request", details: parsed.error.flatten() },
        { status: 400 }
      )
    );
  }

  try {
    const data = parsed.data;
    const products = await readCatalog();
    const catalog = structuredClone(products) as Catalog;

    // ---------- SAVE WHOLE ----------
    if (data.action === "saveCatalog") {
      const { backupName } = await writeCatalog(data.catalog);
      await ensureInventoryForCatalog(data.catalog);
      return guard.attach(
        NextResponse.json({ ok: true, backupName, catalog: data.catalog })
      );
    }

    // ---------- CREATE PRODUCT ----------
    if (data.action === "createProduct") {
      if (catalog.some((p) => p.id === data.product.id)) {
        return guard.attach(
          NextResponse.json(
            { ok: false, error: "Product id already exists" },
            { status: 409 }
          )
        );
      }

      catalog.push(data.product);
    }

    // ---------- UPDATE PRODUCT ----------
    if (data.action === "updateProduct") {
      const idx = findProductIndex(catalog, data.productId);
      if (idx < 0)
        return guard.attach(
          NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
        );

      catalog[idx] = { ...catalog[idx], ...data.patch };
    }

    // ---------- DELETE PRODUCT ----------
    if (data.action === "deleteProduct") {
      const idx = findProductIndex(catalog, data.productId);
      if (idx < 0)
        return guard.attach(
          NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
        );

      catalog.splice(idx, 1);
    }

    // ---------- ADD VARIANT ----------
    if (data.action === "addVariant") {
      const idx = findProductIndex(catalog, data.productId);
      if (idx < 0)
        return guard.attach(
          NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
        );

      const p = catalog[idx];
      if ((p.variants || []).some((v: Variant) => v.id === data.variant.id)) {
        return guard.attach(
          NextResponse.json(
            { ok: false, error: "Variant id already exists" },
            { status: 409 }
          )
        );
      }

      p.variants = (p.variants || []) as Variant[];
      (p.variants as Variant[]).push(data.variant as Variant);
    }

    // ---------- UPDATE VARIANT ----------
    if (data.action === "updateVariant") {
      const idx = findProductIndex(catalog, data.productId);
      if (idx < 0)
        return guard.attach(
          NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
        );

      const p = catalog[idx];
      const vIdx = (p.variants || []).findIndex(
        (v) => String((v as { id?: string }).id) === String(data.variantId)
      );

      if (vIdx < 0)
        return guard.attach(
          NextResponse.json(
            { ok: false, error: "Variant not found" },
            { status: 404 }
          )
        );

      p.variants = (p.variants || []) as Variant[];
      (p.variants as Variant[])[vIdx] = { ...(p.variants as Variant[])[vIdx], ...(data.patch as Partial<Variant>) };
    }

    // ---------- DELETE VARIANT ----------
    if (data.action === "deleteVariant") {
      const idx = findProductIndex(catalog, data.productId);
      if (idx < 0)
        return guard.attach(
          NextResponse.json({ ok: false, error: "Not found" }, { status: 404 })
        );

      const p = catalog[idx];
      p.variants = (p.variants || []).filter(
        (v) => String((v as { id?: string }).id) !== String(data.variantId)
      );
    }

    // ---------- WRITE ----------
    const { backupName } = await writeCatalog(catalog);
    await ensureInventoryForCatalog(catalog);

    return guard.attach(
      NextResponse.json({ ok: true, backupName, catalog })
    );
  } catch (e: unknown) {
    return guard.attach(
      NextResponse.json(
        { ok: false, error: getErrText(e, "Error") },
        { status: 500 }
      )
    );
  }
}