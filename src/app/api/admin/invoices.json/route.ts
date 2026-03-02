export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi, getClientIpFromHeaders } from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { allocateInvoiceNumberTx } from "@/lib/server/invoiceNumber";

function safeJsonParse(s?: string | null) {
  if (!s) return null;
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function isISODateOnly(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function parseDateOnly(s?: string | null) {
  if (!s || !isISODateOnly(s)) return null;
  const d = new Date(`${s}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function sanitizeFilenamePart(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\-]+/g, "")
    .slice(0, 40);
}

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type VatRow = { rateBps: number; taxableCents: number; vatCents: number };

function addVatRow(map: Map<number, VatRow>, rateBps: number, taxableCents: number, vatCents: number) {
  const prev = map.get(rateBps);
  if (!prev) {
    map.set(rateBps, { rateBps, taxableCents, vatCents });
  } else {
    prev.taxableCents += taxableCents;
    prev.vatCents += vatCents;
  }
}

export async function GET(req: Request) {
  // ✅ Admin-only
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  // ✅ Rate limit
  const ip = getClientIpFromHeaders(req.headers) || "unknown";
  const url = new URL(req.url);
  const rl = await rateLimit({
    key: `admin:${ip}:${url.pathname}`,
    limit: 60,
    windowSeconds: 60,
  });
  if (!rl.ok) return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });

  const mode = url.searchParams.get("mode") ?? "shipping"; // "shipping" | "range"

  const statusParam = url.searchParams.get("status");
  const shippedParam = url.searchParams.get("shipped"); // yes | no | ""
  const qParam = url.searchParams.get("q");

  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  // default range: ultimi 30 giorni
  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);

  const start = parseDateOnly(startParam) ?? defaultStart;
  const end = parseDateOnly(endParam) ?? today;

  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

  // ✅ WHERE: diverso per shipping vs range
  const where: Record<string, unknown> = {};

  if (mode === "shipping") {
    // ✅ Operatività: SOLO PAID non spediti + pagati davvero + no cancel/refund
    where.status = "PAID";
    where.shippedAt = null;
    where.paidAt = { not: null };
    where.canceledAt = null;
    where.refundedAt = null;
  } else {
    // ✅ Ordini: ESATTAMENTE quello che hai filtrato in pagina (senza forzature)
    where.createdAt = { gte: start, lt: endExclusive };

    if (statusParam && statusParam.trim()) {
      where.status = statusParam.trim();
    }

    if (shippedParam === "yes") where.shippedAt = { not: null };
    if (shippedParam === "no") where.shippedAt = null;

    if (qParam && qParam.trim()) {
      const qq = qParam.trim();
      where.OR = [
        { id: { contains: qq } },
        { email: { contains: qq } },
        { fullName: { contains: qq } },
        { orderNumber: { contains: qq } },
        { stripeCheckoutSessionId: { contains: qq } },
      ];
    }
  }

  // ✅ ORDER BY
  const orderBy: Record<string, unknown> = mode === "shipping" ? { paidAt: "asc" } : { createdAt: "asc" };

  const orders = await prisma.order.findMany({
    where,
    orderBy,
    take: 2000,
    include: {
      items: true,
      // per prendere invoiceNumber già assegnato
      events: {
        where: { type: "INVOICE_ASSIGNED" },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { metaJson: true, createdAt: true },
      },
    },
  });

  const exportedAt = new Date();

  type InvoiceExportRow = {
    invoiceNumber: string;
    invoiceYear: number;
    invoiceDate: string;
    exportedAt: string;
    billing: Record<string, unknown>;
    vatSummary: VatRow[];
    totalsComputed: { taxableCents: number; vatCents: number; grossCents: number };
    discountSummary: { promotionCode: string | null; discountCentsFromLines: number };
    linesNormalized: Record<string, unknown>[];
    order: Record<string, unknown>;
  };

  const invoices = await prisma.$transaction(async (tx) => {
    const out: InvoiceExportRow[] = [];

    for (const o of orders) {
      // ✅ invoiceNumber stabile: usa INVOICE_ASSIGNED, se manca backfill
      const assignedMeta = safeJsonParse(o.events?.[0]?.metaJson ?? null);
      let invoiceNumber: string | undefined = assignedMeta?.invoiceNumber;

      if (!invoiceNumber) {
        invoiceNumber = await allocateInvoiceNumberTx(tx);
        await tx.orderEvent.create({
          data: {
            orderId: o.id,
            type: "INVOICE_ASSIGNED",
            message: `Invoice assigned (backfill): ${invoiceNumber}`,
            metaJson: JSON.stringify({
              invoiceNumber,
              invoiceYear: exportedAt.getFullYear(),
              assignedAt: exportedAt.toISOString(),
              backfill: true,
            }),
          },
        });
      }

      // ✅ Marker visibile in lista ordini: “Fattura esportata” (aggiorna, non spamma)
      const lastExport = await tx.orderEvent.findFirst({
        where: { orderId: o.id, type: "INVOICE_EXPORTED" },
        orderBy: { createdAt: "desc" },
        select: { id: true },
      });

      const exportMeta = {
        invoiceNumber,
        exportedAt: exportedAt.toISOString(),
        mode,
        filters:
          mode === "range"
            ? {
              start: startParam ?? null,
              end: endParam ?? null,
              status: statusParam ?? null,
              shipped: shippedParam ?? null,
              q: qParam ?? null,
            }
            : {
              shippingQueue: true,
            },
      };

      if (lastExport?.id) {
        await tx.orderEvent.update({
          where: { id: lastExport.id },
          data: {
            message: `Fattura esportata: ${invoiceNumber}`,
            metaJson: JSON.stringify(exportMeta),
          },
        });
      } else {
        await tx.orderEvent.create({
          data: {
            orderId: o.id,
            type: "INVOICE_EXPORTED",
            message: `Fattura esportata: ${invoiceNumber}`,
            metaJson: JSON.stringify(exportMeta),
          },
        });
      }

      // --- computed fields per import fatture ---
      const invoiceDate = toISODate(o.paidAt ?? o.createdAt);

      const vatMap = new Map<number, VatRow>();
      let taxableCents = 0;
      let vatCents = 0;
      let grossCents = 0;

      let promoCode: string | null = null;
      let discountCentsFromLines = 0;

      const linesNormalized = o.items.map((it) => {
        const ps = ((it as { pricingSnapshot?: unknown }).pricingSnapshot as Record<string, unknown>) || {};

        const grossLineCents = Number(ps.lineTotalCents ?? (it as { lineTotalCents?: number }).lineTotalCents ?? 0);

        const qty = Number((it as { qty?: number }).qty ?? ps.qty ?? 1);
        const unitPriceCents = Number((it as { unitPriceCents?: number }).unitPriceCents ?? ps.unitPriceCents ?? 0);

        const lineDiscount = Number(ps.lineDiscountCents ?? 0);
        discountCentsFromLines += lineDiscount;

        if (!promoCode && ps.promotionCode) promoCode = String(ps.promotionCode);

        const netCents = Number(ps.netCents ?? grossLineCents);
        const vatLineCents = Number(ps.vatLineCents ?? 0);
        const rateBps = Number(ps.rateBps ?? 2200);

        taxableCents += netCents;
        vatCents += vatLineCents;
        grossCents += grossLineCents;

        addVatRow(vatMap, rateBps, netCents, vatLineCents);

        return {
          sku: (it as { sku?: string }).sku ?? null,
          description: [(it as { title?: string }).title, (it as { variantLabel?: string }).variantLabel].filter(Boolean).join(" - "),
          qty,
          unitPriceCents,
          netCents,
          vatRateBps: rateBps,
          vatCents: vatLineCents,
          grossCents: grossLineCents,
          discountCents: lineDiscount,
          promotionCode: ps.promotionCode ?? null,
        };
      });

      const vatSummary = Array.from(vatMap.values()).sort((a, b) => a.rateBps - b.rateBps);

      const billing = {
        name: (o as { fullName?: string }).fullName ?? null,
        phone: (o as { phone?: string }).phone ?? null,

        addressLine1: (o as { addressLine1?: string }).addressLine1 ?? (o as { address?: string }).address ?? null,
        addressLine2: (o as { addressLine2?: string }).addressLine2 ?? null,
        city: (o as { city?: string }).city ?? null,
        province: (o as { province?: string }).province ?? null,
        postalCode: (o as { postalCode?: string }).postalCode ?? (o as { zip?: string }).zip ?? null,
        countryCode: (o as { countryCode?: string }).countryCode ?? null,

        // fiscali (per futuro)
        vatNumber: null,
        taxCode: null,
        pec: null,
        sdi: null,
      };

      out.push({
        invoiceNumber,
        invoiceYear: exportedAt.getFullYear(),

        // ✅ extra utili per il tuo importer
        invoiceDate,
        exportedAt: exportedAt.toISOString(),
        billing,
        vatSummary,
        totalsComputed: {
          taxableCents,
          vatCents,
          grossCents,
        },
        discountSummary: {
          promotionCode: promoCode,
          discountCentsFromLines,
        },
        linesNormalized,

        // --- raw order (come prima) ---
        order: {
          id: o.id,
          orderNumber: (o as { orderNumber?: string }).orderNumber ?? null,
          status: o.status,
          currency: o.currency,

          createdAt: o.createdAt,
          paidAt: o.paidAt,
          shippedAt: o.shippedAt,

          totals: {
            subtotalCents: (o as { subtotalCents?: number }).subtotalCents ?? null,
            discountCents: (o as { discountCents?: number }).discountCents ?? null,
            shippingCents: (o as { shippingCents?: number }).shippingCents ?? null,
            vatCents: (o as { vatCents?: number }).vatCents ?? null,
            taxCents: (o as { taxCents?: number }).taxCents ?? null,
            totalCents: (o as { totalCents?: number }).totalCents ?? null,
          },

          payment: {
            provider: (o as { paymentProvider?: string }).paymentProvider ?? null,
            method: (o as { paymentMethod?: string }).paymentMethod ?? null,
            stripeCheckoutSessionId: (o as { stripeCheckoutSessionId?: string }).stripeCheckoutSessionId ?? null,
            stripePaymentIntentId: (o as { stripePaymentIntentId?: string }).stripePaymentIntentId ?? null,
          },

          customer: {
            fullName: (o as { fullName?: string }).fullName ?? null,
            email: (o as { email?: string }).email ?? null,
            phone: (o as { phone?: string }).phone ?? null,
          },

          shippingAddress: {
            addressLine1: (o as { addressLine1?: string }).addressLine1 ?? null,
            addressLine2: (o as { addressLine2?: string }).addressLine2 ?? null,
            city: (o as { city?: string }).city ?? null,
            province: (o as { province?: string }).province ?? null,
            postalCode: (o as { postalCode?: string }).postalCode ?? (o as { zip?: string }).zip ?? null,
            countryCode: (o as { countryCode?: string }).countryCode ?? null,
            address: (o as { address?: string }).address ?? null,
            zip: (o as { zip?: string }).zip ?? null,
          },

          notes: (o as { notes?: string }).notes ?? null,

          items: o.items.map((it) => ({
            id: (it as { id?: string }).id,
            sku: (it as { sku?: string }).sku,
            title: (it as { title?: string }).title,
            variantLabel: (it as { variantLabel?: string }).variantLabel ?? null,
            qty: (it as { qty?: number }).qty,
            unitPriceCents: (it as { unitPriceCents?: number }).unitPriceCents ?? null,
            lineTotalCents: (it as { lineTotalCents?: number }).lineTotalCents ?? null,
            productSnapshot: typeof (it as { productSnapshot?: unknown }).productSnapshot === "object" ? (it as { productSnapshot?: unknown }).productSnapshot : null,
            pricingSnapshot: typeof (it as { pricingSnapshot?: unknown }).pricingSnapshot === "object" ? (it as { pricingSnapshot?: unknown }).pricingSnapshot : null,
          })),
        },
      });
    }

    return out;
  });

  // filename “fatture_YYYY-MM-DD__YYYY-MM-DD.json” o “fatture_shipping_queue.json”
  const filename =
    mode === "shipping"
      ? `fatture_shipping_queue_${toISODate(exportedAt)}.json`
      : `fatture_${sanitizeFilenamePart(toISODate(start))}__${sanitizeFilenamePart(toISODate(end))}.json`;

  return guard.attach(
    new NextResponse(JSON.stringify({ ok: true, count: invoices.length, invoices }), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    })
  );
}