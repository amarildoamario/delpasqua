export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { companyInfo } from "@/lib/companyInfo";
import type * as Prisma from "@/generated/prisma/client";

type PrintableOrder = Prisma.Prisma.OrderGetPayload<{ include: { items: true } }> & {
  previousPrintCount: number;
  lastPrintedAt: Date | null;
};

const DB_STATUS_LABEL: Record<string, string> = {
  IN_ATTESA: "IN ATTESA",
  PAGATO: "PAGATO",
  IN_PREPARAZIONE: "IN PREPARAZIONE",
  SPEDITO: "SPEDITO",
  CONSEGNATO: "CONSEGNATO",
  ANNULLATO: "ANNULLATO",
  RIMBORSATO: "RIMBORSATO",
  PARZIALMENTE_RIMBORSATO: "PARZ. RIMBORSATO",
  SCADUTO: "SCADUTO",
  FALLITO: "FALLITO",
  PENDING: "IN ATTESA",
  PAID: "PAGATO",
  PREPARING: "IN PREPARAZIONE",
  SHIPPED: "SPEDITO",
  DELIVERED: "CONSEGNATO",
  CANCELED: "ANNULLATO",
  REFUNDED: "RIMBORSATO",
  PARTIALLY_REFUNDED: "PARZ. RIMBORSATO",
  EXPIRED: "SCADUTO",
  FAILED: "FALLITO",
};

const ALLOWED_STATUSES: Prisma.OrderStatus[] = [
  "IN_ATTESA",
  "PAGATO",
  "IN_PREPARAZIONE",
  "SPEDITO",
  "CONSEGNATO",
  "ANNULLATO",
  "RIMBORSATO",
  "PARZIALMENTE_RIMBORSATO",
  "SCADUTO",
  "FALLITO",
];

function euro(cents: number) {
  return `&euro; ${(cents / 100).toFixed(2)}`;
}

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getOne(searchParams: URLSearchParams, key: string) {
  return searchParams.get(key)?.trim() || "";
}

function parseDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isOrderStatus(value: string): value is Prisma.OrderStatus {
  return (ALLOWED_STATUSES as readonly string[]).includes(value);
}

function formatAddressLine(order: {
  addressLine1: string;
  addressLine2: string | null;
  address: string;
}) {
  const primary = order.addressLine1.trim() || order.address.trim() || "Indirizzo non disponibile";
  return order.addressLine2?.trim() ? `${primary}, ${order.addressLine2.trim()}` : primary;
}

function formatCityLine(order: {
  postalCode: string;
  zip: string;
  city: string;
  province: string;
}) {
  const postalCode = order.postalCode.trim() || order.zip.trim();
  const city = order.city.trim();
  const province = order.province.trim();
  const base = [postalCode, city].filter(Boolean).join(" ");
  return province ? `${base} (${province})` : base || "Località non disponibile";
}

function formatPaymentMethod(order: {
  paymentMethod: string | null;
  paymentProvider: string;
}) {
  if (order.paymentMethod?.trim()) return order.paymentMethod.trim();
  if (order.paymentProvider === "stripe") return "Carta / Stripe";
  return order.paymentProvider || "-";
}

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  const now = new Date();
  const url = new URL(req.url);
  const id = getOne(url.searchParams, "id");
  const ids = getOne(url.searchParams, "ids");
  const statusParam = getOne(url.searchParams, "status");
  const shipped = getOne(url.searchParams, "shipped");
  const q = getOne(url.searchParams, "q");
  const startParam = getOne(url.searchParams, "start");
  const endParam = getOne(url.searchParams, "end");

  let where: Prisma.Prisma.OrderWhereInput;

  if (id) {
    where = { id, isTest: false };
  } else if (ids) {
    const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
    where = { id: { in: idList }, isTest: false };
  } else if (statusParam || shipped || startParam || endParam || q) {
    const today = new Date();
    const defaultStart = new Date(today);
    defaultStart.setDate(today.getDate() - 30);
    const start = parseDateOnly(startParam) ?? defaultStart;
    const end = parseDateOnly(endParam) ?? today;
    const endExclusive = new Date(end);
    endExclusive.setDate(end.getDate() + 1);

    where = {
      createdAt: { gte: start, lt: endExclusive },
      isTest: false,
    };
    if (statusParam && isOrderStatus(statusParam)) where.status = statusParam;
    if (shipped === "yes") where.shippedAt = { not: null };
    if (shipped === "no") where.shippedAt = null;
    if (q) {
      where.OR = [
        { id: { contains: q } },
        { email: { contains: q } },
        { fullName: { contains: q } },
        { orderNumber: { contains: q } },
        { stripeCheckoutSessionId: { contains: q } },
      ];
    }
  } else {
    // ✅ Default Operatività: ordini pronti da fare (PAGATO o IN_PREPARAZIONE, non ancora spediti)
    where = {
      status: { in: ["PAGATO", "IN_PREPARAZIONE"] },
      shippedAt: null,
      isTest: false,
    };
  }

  const orders = await prisma.$transaction(async (tx) => {
    const candidates = await tx.order.findMany({
      where,
      include: { items: { orderBy: [{ title: "asc" }] } },
      orderBy: [{ status: "asc" }, { createdAt: "asc" }],
      take: id ? 1 : 200,
    });

    const orderIds = candidates.map((order) => order.id);
    const printEvents = orderIds.length
      ? await tx.orderEvent.findMany({
          where: {
            orderId: { in: orderIds },
            type: "ORDER_PRINTED",
          },
          orderBy: [{ orderId: "asc" }, { createdAt: "desc" }],
          select: {
            orderId: true,
            createdAt: true,
          },
        })
      : [];

    const printEventsByOrderId = new Map<string, typeof printEvents>();
    for (const event of printEvents) {
      const bucket = printEventsByOrderId.get(event.orderId) ?? [];
      bucket.push(event);
      printEventsByOrderId.set(event.orderId, bucket);
    }

    for (const order of candidates) {
      const previousPrintCount = printEventsByOrderId.get(order.id)?.length ?? 0;
      const printNumber = previousPrintCount + 1;

      await tx.orderEvent.create({
        data: {
          orderId: order.id,
          actor: id ? "admin_print_order" : "admin_print_selection",
          type: "ORDER_PRINTED",
          message:
            previousPrintCount > 0
              ? `Ordine ristampato (#${printNumber})`
              : "Ordine stampato per la spedizione",
          metaJson: JSON.stringify({
            printedAt: now.toISOString(),
            printNumber,
            previousPrintCount,
            source: id ? "print-order" : "print-selection",
          }),
        },
      });
    }

    return candidates.map((order) => ({
      ...order,
      previousPrintCount: printEventsByOrderId.get(order.id)?.length ?? 0,
      lastPrintedAt: printEventsByOrderId.get(order.id)?.[0]?.createdAt ?? null,
    })) satisfies PrintableOrder[];
  });

  if (orders.length === 0) {
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Stampa Ordini - Nessun Ordine</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; text-align: center; color: #171717; background: #fafafa; }
          .card { max-width: 480px; margin: 60px auto; background: #fff; padding: 36px; border-radius: 16px; border: 1px solid #e5e5e5; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
          h1 { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: #171717; }
          p { font-size: 13px; color: #737373; margin-bottom: 24px; line-height: 1.5; }
          button { background: #171717; color: white; border: none; padding: 10px 20px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; }
          button:hover { opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Nessun ordine da stampare</h1>
          <p>Non ci sono ordini in attesa di evasione (PAGATO o IN PREPARAZIONE) corrispondenti ai filtri.</p>
          <button onclick="window.close()">Chiudi Finestra</button>
        </div>
      </body>
      </html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  }

  const reprintedCount = orders.filter((order) => order.previousPrintCount > 0).length;
  const firstPrintCount = orders.length - reprintedCount;

  const htmlItems = orders
    .map((order, idx) => {
      const itemsHtml = order.items
        .map((item) => {
          const variantLabel = item.variantLabel
            ? `<div style="font-size: 11px; color: #666; margin-top: 2px;">${escapeHtml(item.variantLabel)}</div>`
            : "";
          const lineVatNote =
            item.lineVatCents > 0
              ? `<div style="font-size: 10px; color: #888; margin-top: 1px;">IVA incl.: ${euro(item.lineVatCents)}</div>`
              : "";

          return `
            <tr>
              <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; font-family: monospace; font-size: 11px; color: #555;">
                ${escapeHtml(item.sku)}
              </td>
              <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5;">
                <strong style="color: #111; font-size: 12px;">${escapeHtml(item.title)}</strong>
                ${variantLabel}
              </td>
              <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; text-align: center; font-weight: 700; font-size: 13px;">
                ${item.qty}
              </td>
              <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 12px; color: #444;">
                ${euro(item.unitPriceCents)}
              </td>
              <td style="padding: 7px 8px; border-bottom: 1px solid #e5e5e5; text-align: right; font-size: 12px; font-weight: 600;">
                <div>${euro(item.lineTotalCents)}</div>
                ${lineVatNote}
              </td>
            </tr>
          `;
        })
        .join("");

      const printWarning =
        order.previousPrintCount > 0
          ? `
            <div class="no-print" style="margin: 0 0 12px 0; padding: 6px 10px; color: #737373; font-size: 11px;">
              <strong>Ristampa:</strong> già stampato ${order.previousPrintCount} ${
                order.previousPrintCount === 1 ? "volta" : "volte"
              } (ultimo: ${escapeHtml(formatDate(order.lastPrintedAt))}).
            </div>
          `
          : "";

      return `
        ${printWarning}
        <div class="order-sheet">
          <!-- Clean Header (No Grey Box) -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 2px solid #171717; padding-bottom: 12px; margin-bottom: 18px;">
            <div style="display: flex; gap: 12px; align-items: center;">
              <img src="/logo.png" alt="Logo" style="width: 48px; height: 48px; object-fit: contain;" onerror="this.style.display='none'">
              <div>
                <h2 style="margin: 0; font-size: 17px; font-weight: 800; letter-spacing: -0.01em; color: #171717;">
                  ${escapeHtml(companyInfo.brandName)}
                </h2>
                <div style="font-size: 10px; line-height: 1.35; color: #555; margin-top: 2px;">
                  ${escapeHtml(companyInfo.companyName)} · ${escapeHtml(companyInfo.addressSingleLine)}<br>
                  Tel. ${escapeHtml(companyInfo.phone)} · ${escapeHtml(companyInfo.email)}
                </div>
              </div>
            </div>

            <div style="text-align: right; min-width: 160px;">
              <div style="font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.08em; color: #737373; font-weight: 700;">
                Ordine ${idx + 1} di ${orders.length}
              </div>
              <div style="font-size: 16px; font-weight: 800; color: #171717; margin-top: 1px;">
                ${escapeHtml(order.orderNumber ?? order.id.slice(0, 8))}
              </div>
              <div style="font-size: 10.5px; color: #333; margin-top: 2px;">
                <strong>Stato:</strong> ${escapeHtml(DB_STATUS_LABEL[order.status] ?? order.status)}
              </div>
              <div style="font-size: 9.5px; color: #666;">
                ${escapeHtml(formatDate(order.createdAt))}
              </div>
            </div>
          </div>

          <!-- Clean Info Columns (No Grey Boxes) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 18px; font-size: 12px;">
            <div>
              <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #737373; margin-bottom: 4px; letter-spacing: 0.04em;">
                Destinatario Spedizione
              </div>
              <div style="font-size: 13px; font-weight: 700; color: #111;">
                ${escapeHtml(order.fullName || "Nominativo non specificato")}
              </div>
              <div style="color: #333; margin-top: 2px; line-height: 1.35;">
                ${escapeHtml(formatAddressLine(order))}<br>
                ${escapeHtml(formatCityLine(order))}<br>
                ${escapeHtml(order.countryCode || "IT")}
              </div>
              <div style="margin-top: 4px; font-size: 11px; color: #555;">
                <strong>Tel:</strong> ${escapeHtml(order.phone || "-")} · <strong>Email:</strong> ${escapeHtml(order.email || "-")}
              </div>
            </div>

            <div>
              <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #737373; margin-bottom: 4px; letter-spacing: 0.04em;">
                Dettagli Spedizione & Pagamento
              </div>
              <div style="font-size: 11px; color: #444; line-height: 1.4;">
                <strong>Data Ordine:</strong> ${escapeHtml(formatDate(order.createdAt))}<br>
                <strong>Pagamento:</strong> ${escapeHtml(formatPaymentMethod(order))}<br>
                <strong>Data Pagamento:</strong> ${escapeHtml(formatDate(order.paidAt))}
              </div>
              ${
                order.shippingNotes
                  ? `
                <div style="margin-top: 6px; font-size: 11px; color: #111; line-height: 1.35;">
                  <strong>Note Consegna:</strong> ${escapeHtml(order.shippingNotes)}
                </div>
              `
                  : ""
              }
            </div>
          </div>

          <!-- Items Table (The only element with clean table structure) -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
            <thead>
              <tr style="background: #f5f5f5; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.04em; color: #555;">
                <th style="padding: 6px 8px; border-bottom: 1.5px solid #ccc;">SKU</th>
                <th style="padding: 6px 8px; border-bottom: 1.5px solid #ccc;">Prodotto / Referenza</th>
                <th style="padding: 6px 8px; border-bottom: 1.5px solid #ccc; text-align: center;">Qtà</th>
                <th style="padding: 6px 8px; border-bottom: 1.5px solid #ccc; text-align: right;">Prezzo unit.</th>
                <th style="padding: 6px 8px; border-bottom: 1.5px solid #ccc; text-align: right;">Totale</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals Breakdown -->
          <div style="display: flex; justify-content: flex-end; font-size: 11.5px; margin-top: 6px;">
            <table style="width: 250px; border-collapse: collapse;">
              <tr>
                <td style="padding: 2px 0; color: #555;">Subtotale prodotti:</td>
                <td style="text-align: right; padding: 2px 0; font-weight: 500;">${euro(order.subtotalCents)}</td>
              </tr>
              <tr>
                <td style="padding: 2px 0; color: #777;">di cui IVA 4% incl.:</td>
                <td style="text-align: right; padding: 2px 0; color: #777;">${euro(order.vatCents)}</td>
              </tr>
              ${
                order.discountCents > 0
                  ? `
                <tr>
                  <td style="padding: 2px 0; color: #b91c1c;">Sconto:</td>
                  <td style="text-align: right; padding: 2px 0; color: #b91c1c;">-&euro; ${(order.discountCents / 100).toFixed(2)}</td>
                </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 2px 0; color: #555;">Spedizione:</td>
                <td style="text-align: right; padding: 2px 0; font-weight: 500;">${euro(order.shippingCents)}</td>
              </tr>
              <tr style="font-weight: 800; border-top: 1.5px solid #171717; font-size: 13.5px;">
                <td style="padding: 6px 0 0 0; color: #171717;">Totale Ordine:</td>
                <td style="text-align: right; padding: 6px 0 0 0; color: #171717;">${euro(order.totalCents)}</td>
              </tr>
            </table>
          </div>
        </div>
      `;
    })
    .join("");

  const pageHtml = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <title>Stampa Ordini Evasione - Frantoio Del Pasqua</title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #f4f4f5;
          margin: 0;
          padding: 24px;
          color: #18181b;
          -webkit-font-smoothing: antialiased;
        }
        .order-sheet {
          background: #ffffff;
          max-width: 800px;
          margin: 0 auto 28px auto;
          padding: 24px 28px;
          border-radius: 8px;
          border: 1px solid #e4e4e7;
          box-shadow: 0 1px 4px rgba(0,0,0,0.03);
        }

        @page {
          size: A4 portrait;
          margin: 12mm 15mm;
        }

        @media print {
          html, body {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .order-sheet {
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .order-sheet:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background: #ffffff; padding: 12px 20px; border-radius: 10px; border: 1px solid #e4e4e7; display: flex; justify-content: space-between; align-items: center; gap: 16px; max-width: 800px; margin: 0 auto 20px auto; box-shadow: 0 1px 4px rgba(0,0,0,0.03);">
        <div>
          <span style="font-size: 13.5px; font-weight: 700; color: #18181b;">${orders.length} ${orders.length === 1 ? "ordine pronto" : "ordini pronti per la stampa"}</span>
          <div style="font-size: 11px; color: #71717a; margin-top: 1px;">
            ${firstPrintCount} prime stampe · ${reprintedCount} ristampe
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="window.print()" style="background: #18181b; color: #ffffff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
            🖨️ Stampa Adesso
          </button>
          <button onclick="window.close()" style="background: #ffffff; color: #3f3f46; border: 1px solid #d4d4d8; padding: 8px 14px; border-radius: 8px; font-size: 12.5px; font-weight: 600; cursor: pointer;">
            Chiudi
          </button>
        </div>
      </div>

      ${htmlItems}

      <script>
        window.addEventListener("load", () => {
          setTimeout(() => {
            window.print();
          }, 350);
        });
      </script>
    </body>
    </html>
  `;

  return guard.attach(
    new NextResponse(pageHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  );
}
