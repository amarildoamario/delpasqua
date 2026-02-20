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
  const where: any = {};

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

  const orderBy =
    mode === "shipping"
      ? [{ paidAt: "asc" as const }, { createdAt: "asc" as const }]
      : [{ createdAt: "desc" as const }];

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

  const invoices = await prisma.$transaction(async (tx) => {
    const out: any[] = [];

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
            : null,
      };

      if (lastExport) {
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

      const linesNormalized = (o.items as any[]).map((it) => {
        const ps = it.pricingSnapshot ?? {};

        const rateBps = Number(ps.vatRateBps ?? 0);

        // net = imponibile
        const netCents = Number(ps.lineNetCents ?? ps.lineSubtotalCents ?? 0);
        const vatLineCents = Number(ps.lineVatCents ?? 0);
        const grossLineCents = Number(ps.lineTotalCents ?? it.lineTotalCents ?? 0);

        const qty = Number(it.qty ?? ps.qty ?? 1);
        const unitPriceCents = Number(it.unitPriceCents ?? ps.unitPriceCents ?? 0);

        const lineDiscount = Number(ps.lineDiscountCents ?? 0);
        discountCentsFromLines += lineDiscount;

        if (!promoCode && ps.promotionCode) promoCode = String(ps.promotionCode);

        taxableCents += netCents;
        vatCents += vatLineCents;
        grossCents += grossLineCents;

        addVatRow(vatMap, rateBps, netCents, vatLineCents);

        return {
          sku: it.sku ?? null,
          description: [it.title, it.variantLabel].filter(Boolean).join(" - "),
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

      // billing = shipping (default). Niente email qui (come richiesto).
      const billing = {
        name: (o as any).fullName ?? null,
        phone: (o as any).phone ?? null,

        addressLine1: (o as any).addressLine1 ?? (o as any).address ?? null,
        addressLine2: (o as any).addressLine2 ?? null,
        city: (o as any).city ?? null,
        province: (o as any).province ?? null,
        postalCode: (o as any).postalCode ?? (o as any).zip ?? null,
        countryCode: (o as any).countryCode ?? null,

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
          orderNumber: (o as any).orderNumber ?? null,
          status: o.status,
          currency: o.currency,

          createdAt: o.createdAt,
          paidAt: o.paidAt,
          shippedAt: o.shippedAt,

          totals: {
            subtotalCents: (o as any).subtotalCents ?? null,
            discountCents: (o as any).discountCents ?? null,
            shippingCents: (o as any).shippingCents ?? null,
            vatCents: (o as any).vatCents ?? null,
            taxCents: (o as any).taxCents ?? null,
            totalCents: (o as any).totalCents ?? null,
          },

          payment: {
            provider: (o as any).paymentProvider ?? null,
            method: (o as any).paymentMethod ?? null,
            stripeCheckoutSessionId: (o as any).stripeCheckoutSessionId ?? null,
            stripePaymentIntentId: (o as any).stripePaymentIntentId ?? null,
          },

          customer: {
            fullName: (o as any).fullName ?? null,
            email: (o as any).email ?? null,
            phone: (o as any).phone ?? null,
          },

          shippingAddress: {
            addressLine1: (o as any).addressLine1 ?? null,
            addressLine2: (o as any).addressLine2 ?? null,
            city: (o as any).city ?? null,
            province: (o as any).province ?? null,
            postalCode: (o as any).postalCode ?? (o as any).zip ?? null,
            countryCode: (o as any).countryCode ?? null,
            address: (o as any).address ?? null,
            zip: (o as any).zip ?? null,
          },

          notes: (o as any).notes ?? null,

          items: (o.items as any[]).map((it) => ({
            id: it.id,
            sku: it.sku,
            title: it.title,
            variantLabel: it.variantLabel ?? null,
            qty: it.qty,
            unitPriceCents: it.unitPriceCents ?? null,
            lineTotalCents: it.lineTotalCents ?? null,
            productSnapshot: it.productSnapshot ?? null,
            pricingSnapshot: it.pricingSnapshot ?? null,
          })),
        },
      });
    }

    return out;
  });

  const payload = {
    generatedAt: exportedAt.toISOString(),
    mode,
    count: invoices.length,
    invoices,
  };

  // ✅ filename basato sui filtri
  const day = exportedAt.toISOString().slice(0, 10);

  let filename = `fatture_${day}.json`;

  if (mode === "shipping") {
    filename = `fatture_paid_non_spediti_${day}.json`;
  } else {
    const startLabel = startParam && isISODateOnly(startParam) ? startParam : "start";
    const endLabel = endParam && isISODateOnly(endParam) ? endParam : "end";

    const st = statusParam && statusParam.trim() ? sanitizeFilenamePart(statusParam) : "all";
    const sh =
      shippedParam === "yes" ? "spediti" : shippedParam === "no" ? "non_spediti" : "tutte_spedizioni";
    const qLabel = qParam && qParam.trim() ? `_q-${sanitizeFilenamePart(qParam)}` : "";

    filename = `fatture_${startLabel}_${endLabel}_st-${st}_${sh}${qLabel}.json`;
  }

  const res = new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });

  return guard.attach(res);
}
