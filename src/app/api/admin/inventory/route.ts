import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";

export const dynamic = "force-dynamic";

const GetSchema = z.object({
  skus: z.string().optional(), // comma-separated
});

const MutSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set"),
    sku: z.string().trim().min(1).max(500),
    stock: z.number().int().min(0).max(1_000_000),
  }),
  z.object({
    action: z.literal("adjust"),
    sku: z.string().trim().min(1).max(500),
    delta: z.number().int().min(-1_000_000).max(1_000_000),
  }),
  z.object({
    action: z.literal("bulkSet"),
    items: z
      .array(
        z.object({
          sku: z.string().trim().min(1).max(500),
          stock: z.number().int().min(0).max(1_000_000),
        })
      )
      .min(1)
      .max(5000),
  }),
]);

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const url = new URL(req.url);
  const parsed = GetSchema.safeParse({ skus: url.searchParams.get("skus") || undefined });
  if (!parsed.success) return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  const skus = (parsed.data.skus || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const rows = await prisma.inventoryItem.findMany({
    where: skus.length ? { sku: { in: skus } } : undefined,
    select: { sku: true, stock: true, updatedAt: true },
    orderBy: { sku: "asc" },
  });

  const map: Record<string, { stock: number; updatedAt: string }> = {};
  for (const r of rows) {
    map[r.sku] = {
      stock: r.stock,
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  return guard.attach(NextResponse.json({ ok: true, items: map }));
}

export async function POST(req: Request) {
  const guard = await requireAdminApi(req);
  if (!guard.ok) return guard.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }

  const parsed = MutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Bad Request", details: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  if (data.action === "set") {
    const stock = clampInt(data.stock, 0, 1_000_000);
    const row = await prisma.inventoryItem.upsert({
      where: { sku: data.sku },
      create: { sku: data.sku, stock },
      update: { stock },
      select: { sku: true, stock: true, updatedAt: true },
    });
    return guard.attach(
      NextResponse.json({
        ok: true,
        item: {
          sku: row.sku,
          stock: row.stock,
          updatedAt: row.updatedAt.toISOString(),
        },
      })
    );
  }

  if (data.action === "adjust") {
    const existing = await prisma.inventoryItem.findUnique({
      where: { sku: data.sku },
      select: { sku: true, stock: true },
    });

    const nextStock = clampInt((existing?.stock ?? 0) + data.delta, 0, 1_000_000);
    const row = await prisma.inventoryItem.upsert({
      where: { sku: data.sku },
      create: { sku: data.sku, stock: nextStock },
      update: { stock: nextStock },
      select: { sku: true, stock: true, updatedAt: true },
    });

    return guard.attach(
      NextResponse.json({
        ok: true,
        item: {
          sku: row.sku,
          stock: row.stock,
          updatedAt: row.updatedAt.toISOString(),
        },
      })
    );
  }

  // bulkSet
  await prisma.$transaction(
    data.items.map((it) =>
      prisma.inventoryItem.upsert({
        where: { sku: it.sku },
        create: { sku: it.sku, stock: clampInt(it.stock, 0, 1_000_000) },
        update: { stock: clampInt(it.stock, 0, 1_000_000) },
      })
    )
  );

  return guard.attach(NextResponse.json({ ok: true }));
}