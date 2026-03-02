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

/** Escapes special XML characters in a string value */
function xe(value: string | number | null | undefined): string {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/** Wraps content in an XML tag */
function tag(name: string, content: string | number | null | undefined, attrs?: Record<string, string>): string {
    const attrStr = attrs
        ? " " + Object.entries(attrs).map(([k, v]) => `${k}="${xe(v)}"`).join(" ")
        : "";
    const val = content === null || content === undefined ? "" : xe(content);
    return `<${name}${attrStr}>${val}</${name}>`;
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
        // Operatività: SOLO PAID non spediti + pagati davvero + no cancel/refund
        where.status = "PAID";
        where.shippedAt = null;
        where.paidAt = { not: null };
        where.canceledAt = null;
        where.refundedAt = null;
    } else {
        // Range: esattamente quello che hai filtrato in pagina
        where.createdAt = { gte: start, lt: endExclusive };
        where.orderNumber = { not: null };

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
    const orderBy: Record<string, unknown> =
        mode === "shipping" ? { paidAt: "asc" } : { createdAt: "asc" };

    const orders = await prisma.order.findMany({
        where,
        orderBy,
        take: 2000,
        include: {
            items: true,
            events: {
                where: { type: { in: ["INVOICE_ASSIGNED", "ORDER_CREATED"] } },
                orderBy: { createdAt: "asc" },
                take: 5,
                select: { type: true, metaJson: true, createdAt: true },
            },
        },
    });

    const exportedAt = new Date();

    // Build XML via transaction (same invoice number logic as JSON route)
    const xmlBody = await prisma.$transaction(async (tx) => {
        const fattureXml: string[] = [];

        for (const o of orders) {
            // ✅ Numero fattura stabile
            const invoiceEvent = o.events.find((ev) => ev.type === "INVOICE_ASSIGNED");
            const assignedMeta = safeJsonParse(invoiceEvent?.metaJson ?? null);
            let invoiceNumber: string | undefined = assignedMeta?.invoiceNumber;

            // ✅ Promo code dalla ORDER_CREATED meta
            const orderCreatedEvent = o.events.find((ev) => ev.type === "ORDER_CREATED");
            const orderCreatedMeta = safeJsonParse(orderCreatedEvent?.metaJson ?? null);
            const orderPromoCode: string | null =
                orderCreatedMeta?.promotion?.code ?? null;
            const orderPromoPercent: number | null =
                typeof orderCreatedMeta?.promotion?.percent === "number"
                    ? orderCreatedMeta.promotion.percent
                    : null;

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

            // ✅ Marker "Fattura esportata" (aggiorna, non duplica)
            const lastExport = await tx.orderEvent.findFirst({
                where: { orderId: o.id, type: "INVOICE_EXPORTED" },
                orderBy: { createdAt: "desc" },
                select: { id: true },
            });

            const exportMeta = {
                invoiceNumber,
                exportedAt: exportedAt.toISOString(),
                mode,
                format: "xml",
                filters:
                    mode === "range"
                        ? {
                            start: startParam ?? null,
                            end: endParam ?? null,
                            status: statusParam ?? null,
                            shipped: shippedParam ?? null,
                            q: qParam ?? null,
                        }
                        : { shippingQueue: true },
            };

            if (lastExport?.id) {
                await tx.orderEvent.update({
                    where: { id: lastExport.id },
                    data: {
                        message: `Fattura esportata (XML): ${invoiceNumber}`,
                        metaJson: JSON.stringify(exportMeta),
                    },
                });
            } else {
                await tx.orderEvent.create({
                    data: {
                        orderId: o.id,
                        type: "INVOICE_EXPORTED",
                        message: `Fattura esportata (XML): ${invoiceNumber}`,
                        metaJson: JSON.stringify(exportMeta),
                    },
                });
            }

            // --- Computed invoice fields ---
            const invoiceDate = toISODate(o.paidAt ?? o.createdAt);

            const vatMap = new Map<number, VatRow>();
            let totalTaxableCents = 0;
            let totalVatCents = 0;
            let totalGrossCents = 0;

            // Build line rows XML
            const righeXml = o.items.map((it) => {
                const ps =
                    ((it as { pricingSnapshot?: unknown }).pricingSnapshot as Record<string, unknown>) || {};

                const grossLineCents = Number(
                    ps.lineTotalCents ?? (it as { lineTotalCents?: number }).lineTotalCents ?? 0
                );
                const qty = Number((it as { qty?: number }).qty ?? ps.qty ?? 1);
                const unitPriceCents = Number(
                    (it as { unitPriceCents?: number }).unitPriceCents ?? ps.unitPriceCents ?? 0
                );
                const lineDiscount = Number(ps.lineDiscountCents ?? 0);
                const promoCode = ps.promotionCode ? String(ps.promotionCode) : null;
                const netCents = Number(ps.netCents ?? grossLineCents);
                const vatLineCents = Number(ps.vatLineCents ?? 0);
                const rateBps = Number(ps.rateBps ?? 2200);

                totalTaxableCents += netCents;
                totalVatCents += vatLineCents;
                totalGrossCents += grossLineCents;

                addVatRow(vatMap, rateBps, netCents, vatLineCents);

                const desc = [
                    (it as { title?: string }).title,
                    (it as { variantLabel?: string }).variantLabel,
                ]
                    .filter(Boolean)
                    .join(" - ");

                return [
                    "    <Riga>",
                    `      ${tag("SKU", (it as { sku?: string }).sku ?? "")}`,
                    `      ${tag("Descrizione", desc)}`,
                    `      ${tag("Quantita", qty)}`,
                    `      ${tag("PrezzoUnitarioCentesimi", unitPriceCents)}`,
                    `      ${tag("ImponibileCentesimi", netCents)}`,
                    `      ${tag("AliquotaIVABps", rateBps)}`,
                    `      ${tag("IVACentesimi", vatLineCents)}`,
                    `      ${tag("TotaleLordoCentesimi", grossLineCents)}`,
                    `      ${tag("ScontoCentesimi", lineDiscount)}`,
                    `      ${tag("CodicePromo", promoCode ?? "")}`,
                    "    </Riga>",
                ].join("\n");
            });

            // Build VAT summary XML
            const vatSummaryXml = Array.from(vatMap.values())
                .sort((a, b) => a.rateBps - b.rateBps)
                .map((v) =>
                    [
                        `    <Aliquota bps="${v.rateBps}">`,
                        `      ${tag("ImponibileCentesimi", v.taxableCents)}`,
                        `      ${tag("IVACentesimi", v.vatCents)}`,
                        "    </Aliquota>",
                    ].join("\n")
                );

            const fattura = [
                "  <Fattura>",
                `    ${tag("NumeroFattura", invoiceNumber)}`,
                `    ${tag("AnnoFattura", exportedAt.getFullYear())}`,
                `    ${tag("DataFattura", invoiceDate)}`,
                `    ${tag("DataExport", exportedAt.toISOString())}`,
                "    <Cliente>",
                `      ${tag("Nome", (o as { fullName?: string }).fullName ?? "")}`,
                `      ${tag("Email", (o as { email?: string }).email ?? "")}`,
                `      ${tag("Telefono", (o as { phone?: string }).phone ?? "")}`,
                `      ${tag("Indirizzo", (o as { addressLine1?: string }).addressLine1 ?? (o as { address?: string }).address ?? "")}`,
                `      ${tag("Indirizzo2", (o as { addressLine2?: string }).addressLine2 ?? "")}`,
                `      ${tag("Citta", (o as { city?: string }).city ?? "")}`,
                `      ${tag("Provincia", (o as { province?: string }).province ?? "")}`,
                `      ${tag("CAP", (o as { postalCode?: string }).postalCode ?? (o as { zip?: string }).zip ?? "")}`,
                `      ${tag("Paese", (o as { countryCode?: string }).countryCode ?? "")}`,
                "    </Cliente>",
                "    <Righe>",
                righeXml.join("\n"),
                "    </Righe>",
                "    <RiepilogoIVA>",
                vatSummaryXml.join("\n"),
                "    </RiepilogoIVA>",
                "    <Totali>",
                `      ${tag("ImponibileCentesimi", totalTaxableCents)}`,
                `      ${tag("IVACentesimi", totalVatCents)}`,
                `      ${tag("TotaleLordoCentesimi", totalGrossCents)}`,
                `      ${tag("ScontoCentesimi", o.discountCents)}`,
                ...(orderPromoCode ? [
                    `      ${tag("CodicePromoOrdine", orderPromoCode)}`,
                ] : []),
                ...(orderPromoPercent != null ? [
                    `      ${tag("PercentualeSconto", orderPromoPercent)}`,
                ] : []),
                `      ${tag("TotaleNettoDopoSconto", o.totalCents)}`,
                "    </Totali>",
                "    <Ordine>",
                `      ${tag("ID", o.id)}`,
                `      ${tag("NumeroOrdine", (o as { orderNumber?: string }).orderNumber ?? "")}`,
                `      ${tag("Stato", o.status)}`,
                `      ${tag("Valuta", o.currency)}`,
                `      ${tag("ScontoCentesimi", o.discountCents)}`,
                `      ${tag("DataCreazione", o.createdAt.toISOString())}`,
                `      ${tag("DataPagamento", o.paidAt?.toISOString() ?? "")}`,
                `      ${tag("DataSpedizione", o.shippedAt?.toISOString() ?? "")}`,
                "    </Ordine>",
                "  </Fattura>",
            ].join("\n");

            fattureXml.push(fattura);
        }

        return fattureXml;
    });

    const exportDateISO = toISODate(exportedAt);
    const countAttr = xmlBody.length;

    const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<Fatture esportate="${countAttr}" dataExport="${exportDateISO}">`,
        ...xmlBody,
        `</Fatture>`,
    ].join("\n");

    // Filename
    const filename =
        mode === "shipping"
            ? `fatture_shipping_queue_${exportDateISO}.xml`
            : `fatture_${sanitizeFilenamePart(toISODate(start))}__${sanitizeFilenamePart(toISODate(end))}.xml`;

    return guard.attach(
        new NextResponse(xml, {
            headers: {
                "content-type": "application/xml; charset=utf-8",
                "content-disposition": `attachment; filename="${filename}"`,
                "cache-control": "no-store",
            },
        })
    );
}
