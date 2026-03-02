import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { prisma } from "@/lib/server/prisma";
import {
  readCatalog,
  writeCatalog,
  makeInternalSku,
  type CatalogProduct,
} from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

const ProductSchema = z
  .object({
    id: z.string().trim().min(1),
    variants: z.array(z.unknown()).default([]),
  })
  .passthrough();

function sanitizeCatalog(catalog: CatalogProduct[]): CatalogProduct[] {
  return (catalog || []).map((p) => ({
    ...(p as object),
    id: String((p as { id?: string })?.id || "").trim(),
    slug: (p as { slug?: string })?.slug ? String((p as { slug?: string }).slug) : undefined,
    variants: Array.isArray((p as { variants?: unknown })?.variants)
      ? ((p as { variants?: unknown[] }).variants || []).map((v) => ({
        ...(v as Record<string, unknown>),
        id: String((v as Record<string, unknown>)?.id || "").trim(),
      }))
      : [],
  })) as CatalogProduct[];
}

function canonicalizeAction(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw
    .trim()
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const map: Record<string, string> = {
    createproduct: "createProduct",
    updateproduct: "updateProduct",
    deleteproduct: "deleteProduct",
    savecatalog: "saveCatalog",
  };

  return map[cleaned] ?? null;
}

function assertUniqueProductIds(catalog: CatalogProduct[]) {
  const set = new Set<string>();
  for (const p of catalog) {
    const id = String(p?.id || "").trim();
    if (!id) return { ok: false as const, error: "Missing product id" };
    if (set.has(id)) return { ok: false as const, error: `Duplicate product id: ${id}` };
    set.add(id);
  }
  return { ok: true as const };
}

async function ensureInventoryForCatalog(catalog: CatalogProduct[]) {
  const skus: string[] = [];
  for (const p of catalog) {
    if (!p?.id) continue;
    for (const v of p.variants || []) {
      if (!v?.id) continue;
      skus.push(makeInternalSku(p.id, v.id));
    }
  }
  if (!skus.length) return;

  const chunkSize = 500;
  for (let i = 0; i < skus.length; i += chunkSize) {
    const chunk = skus.slice(i, i + chunkSize);
    await prisma.$transaction(
      chunk.map((sku) =>
        prisma.inventoryItem.upsert({
          where: { sku },
          create: { sku, stock: 0 },
          update: {},
        })
      )
    );
  }
}

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const catalog = sanitizeCatalog(await readCatalog());
  return guard.attach(
    NextResponse.json(
      { ok: true, catalog },
      { headers: { "Cache-Control": "no-store" } }
    )
  );
}

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

  const action = canonicalizeAction((body as { action?: unknown })?.action) ?? null;
  const current = sanitizeCatalog(await readCatalog());
  let next = current;

  // -------------------
  // saveCatalog (optional)
  // -------------------
  if (action === "saveCatalog") {
    const schema = z.object({
      action: z.any(),
      catalog: z.array(ProductSchema),
      // if you want to allow big shrink intentionally:
      force: z.boolean().optional(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return guard.attach(
        NextResponse.json(
          { ok: false, error: "Bad Request", details: parsed.error.flatten() },
          { status: 400 }
        )
      );
    }

    next = sanitizeCatalog(parsed.data.catalog as CatalogProduct[]);

    // Anti-wipe: if incoming is much smaller than current, refuse unless force=true
    const force = parsed.data.force === true;
    if (!force && current.length >= 5 && next.length < Math.ceil(current.length * 0.7)) {
      return guard.attach(
        NextResponse.json(
          {
            ok: false,
            error: "Refused",
            details: {
              formErrors: [
                `Rifiutato: stai per salvare ${next.length} prodotti ma ne esistono ${current.length}. (Protezione anti-cancellazione)`,
              ],
              fieldErrors: {},
            },
          },
          { status: 409 }
        )
      );
    }

    const uniq = assertUniqueProductIds(next);
    if (!uniq.ok) {
      return guard.attach(NextResponse.json({ ok: false, error: uniq.error }, { status: 400 }));
    }
  }

  // -------------------
  // createProduct
  // -------------------
  else if (action === "createProduct") {
    const schema = z.object({
      action: z.any(),
      product: ProductSchema,
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return guard.attach(
        NextResponse.json(
          { ok: false, error: "Bad Request", details: parsed.error.flatten() },
          { status: 400 }
        )
      );
    }

    const prod = sanitizeCatalog([parsed.data.product as CatalogProduct])[0];

    if (current.some((p) => String(p.id) === String(prod.id))) {
      return guard.attach(
        NextResponse.json(
          { ok: false, error: `Product id already exists: ${prod.id}` },
          { status: 409 }
        )
      );
    }

    next = [prod, ...current];
  }

  // -------------------
  // updateProduct (FIX: allow changing id)
  // -------------------
  else if (action === "updateProduct") {
    const schema = z.object({
      action: z.any(),
      productId: z.string().trim().min(1), // this is the "old id" to locate the record
      patch: ProductSchema, // patch may contain a NEW id
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return guard.attach(
        NextResponse.json(
          { ok: false, error: "Bad Request", details: parsed.error.flatten() },
          { status: 400 }
        )
      );
    }

    const oldId = String(parsed.data.productId).trim();
    const patch = sanitizeCatalog([parsed.data.patch as CatalogProduct])[0];

    // If patch.id changed, ensure no other product already uses it
    const newId = String(patch.id).trim();
    if (newId !== oldId) {
      const conflict = current.some((p) => String(p.id) === newId && String(p.id) !== oldId);
      if (conflict) {
        return guard.attach(
          NextResponse.json(
            { ok: false, error: `Cannot change id to "${newId}": already exists.` },
            { status: 409 }
          )
        );
      }
    }

    let found = false;
    next = current.map((p) => {
      if (String(p.id) === oldId) {
        found = true;
        return patch;
      }
      return p;
    });

    if (!found) {
      return guard.attach(
        NextResponse.json({ ok: false, error: `Product not found: ${oldId}` }, { status: 404 })
      );
    }
  }

  // -------------------
  // deleteProduct
  // -------------------
  else if (action === "deleteProduct") {
    const schema = z.object({
      action: z.any(),
      productId: z.string().trim().min(1),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return guard.attach(
        NextResponse.json(
          { ok: false, error: "Bad Request", details: parsed.error.flatten() },
          { status: 400 }
        )
      );
    }

    const pid = String(parsed.data.productId).trim();
    next = current.filter((p) => String(p.id) !== pid);
  }

  // -------------------
  // invalid action
  // -------------------
  else {
    return guard.attach(
      NextResponse.json(
        {
          ok: false,
          error: "Bad Request",
          details: { formErrors: [], fieldErrors: { action: ["Invalid input"] } },
        },
        { status: 400 }
      )
    );
  }

  // Final sanity
  const uniq = assertUniqueProductIds(next);
  if (!uniq.ok) {
    return guard.attach(NextResponse.json({ ok: false, error: uniq.error }, { status: 400 }));
  }

  const { backupName } = await writeCatalog(next);
  await ensureInventoryForCatalog(next);

  return guard.attach(
    NextResponse.json(
      { ok: true, catalog: next, backupName },
      { headers: { "Cache-Control": "no-store" } }
    )
  );
}