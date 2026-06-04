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
  IN_ATTESA: "IN_ATTESA",
  PAGATO: "PAGATO",
  IN_PREPARAZIONE: "IN_PREPARAZIONE",
  SPEDITO: "SPEDITO",
  CONSEGNATO: "CONSEGNATO",
  ANNULLATO: "ANNULLATO",
  RIMBORSATO: "RIMBORSATO",
  PARZIALMENTE_RIMBORSATO: "PARZIALMENTE_RIMBORSATO",
  SCADUTO: "SCADUTO",
  FALLITO: "FALLITO",
  PENDING: "IN_ATTESA",
  PAID: "PAGATO",
  PREPARING: "IN_PREPARAZIONE",
  SHIPPED: "SPEDITO",
  DELIVERED: "CONSEGNATO",
  CANCELED: "ANNULLATO",
  REFUNDED: "RIMBORSATO",
  PARTIALLY_REFUNDED: "PARZIALMENTE_RIMBORSATO",
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
  return new Date(value).toLocaleString("it-IT");
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
  return province ? `${base} (${province})` : base || "Localita non disponibile";
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
  const statusParam = getOne(url.searchParams, "status");
  const shipped = getOne(url.searchParams, "shipped");
  const q = getOne(url.searchParams, "q");
  const startParam = getOne(url.searchParams, "start");
  const endParam = getOne(url.searchParams, "end");

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - 30);
  const start = parseDateOnly(startParam) ?? defaultStart;
  const end = parseDateOnly(endParam) ?? today;
  const endExclusive = new Date(end);
  endExclusive.setDate(end.getDate() + 1);

  const where: Prisma.Prisma.OrderWhereInput = id
    ? { id }
    : {
        createdAt: { gte: start, lt: endExclusive },
        orderNumber: { not: null },
      };

  if (!id && statusParam && isOrderStatus(statusParam)) where.status = statusParam;
  if (!id && shipped === "yes") where.shippedAt = { not: null };
  if (!id && shipped === "no") where.shippedAt = null;
  if (!id && q) {
    where.OR = [
      { id: { contains: q } },
      { email: { contains: q } },
      { fullName: { contains: q } },
      { orderNumber: { contains: q } },
      { stripeCheckoutSessionId: { contains: q } },
    ];
  }

  const orders = await prisma.$transaction(async (tx) => {
    const candidates = await tx.order.findMany({
      where,
      include: { items: { orderBy: [{ title: "asc" }] } },
      orderBy: { createdAt: "asc" },
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
              ? `Ordine ristampato per la spedizione (#${printNumber})`
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
        <title>Stampa ordini</title>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; text-align: center; color: #404040; }
          .card { max-width: 520px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #e5e5e5; }
          h1 { font-size: 20px; margin-bottom: 10px; color: #171717; }
          p { font-size: 14px; color: #666; margin-bottom: 20px; line-height: 1.5; }
          button { background: #171717; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Nessun ordine da stampare</h1>
          <p>Non ci sono ordini corrispondenti alla selezione corrente.</p>
          <button onclick="window.close()">Chiudi finestra</button>
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
          const variantLabel = item.variantLabel ? `<br><small style="color: #666;">${escapeHtml(item.variantLabel)}</small>` : "";
          const lineVatNote =
            item.lineVatCents > 0
              ? `<div style="font-size: 11px; color: #6b7280; margin-top: 2px;">IVA 4% inclusa: ${euro(item.lineVatCents)}</div>`
              : "";

          return `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHtml(item.sku)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">
                <strong>${escapeHtml(item.title)}</strong>
                ${variantLabel}
              </td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.qty}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${euro(item.unitPriceCents)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
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
            <div style="margin: 0 0 18px 0; padding: 10px 12px; border-radius: 8px; border: 1px solid #f59e0b; background: #fffbeb; color: #92400e; font-size: 12px;">
              <strong>Attenzione:</strong> questo ordine era gia stato stampato ${order.previousPrintCount} ${
                order.previousPrintCount === 1 ? "volta" : "volte"
              }.
              <br>
              <strong>Ultima stampa registrata:</strong> ${escapeHtml(formatDate(order.lastPrintedAt))}
            </div>
          `
          : "";

      return `
        ${printWarning ? `<div class="no-print" style="max-width: 800px; margin: 0 auto 10px auto;">${printWarning}</div>` : ""}
        <div class="order-sheet" style="page-break-after: always; padding: 20px; max-width: 800px; margin: 0 auto; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 40px; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; gap: 20px; border-bottom: 2px solid #1f2937; padding-bottom: 16px; margin-bottom: 22px;">
            <div style="display: flex; gap: 14px; align-items: flex-start; min-width: 0;">
              <img src="/logo.png" alt="Frantoio Del Pasqua" style="width: 62px; height: 62px; object-fit: contain;">
              <div>
                <h2 style="margin: 0 0 5px 0; font-size: 22px; letter-spacing: .02em; color: #111827;">${escapeHtml(companyInfo.brandName)}</h2>
                <div style="font-size: 11px; line-height: 1.45; color: #4b5563;">
                  <strong>${escapeHtml(companyInfo.companyName)}</strong><br>
                  ${escapeHtml(companyInfo.addressSingleLine)}<br>
                  Tel. ${escapeHtml(companyInfo.phone)} · ${escapeHtml(companyInfo.email)}
                </div>
              </div>
            </div>
            <div style="text-align: right; min-width: 190px; font-size: 12px; color: #374151;">
              <div style="display: inline-block; border: 1px solid #d1d5db; border-radius: 12px; padding: 10px 12px; background: #f9fafb;">
                <div style="font-size: 10px; text-transform: uppercase; letter-spacing: .12em; color: #6b7280; font-weight: 700;">Ordine ${idx + 1} di ${orders.length}</div>
                <div style="margin-top: 4px; font-size: 18px; font-weight: 800; color: #111827;">${escapeHtml(order.orderNumber ?? order.id.slice(0, 8))}</div>
                <div style="margin-top: 5px;"><strong>Stato:</strong> ${escapeHtml(DB_STATUS_LABEL[order.status] ?? order.status)}</div>
                <div><strong>Data:</strong> ${escapeHtml(formatDate(order.createdAt))}</div>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; font-size: 13px;">
            <div>
              <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 4px; text-transform: uppercase; color: #555;">Destinatario</h4>
              <strong>${escapeHtml(order.fullName || "Nominativo non disponibile")}</strong><br>
              ${escapeHtml(formatAddressLine(order))}<br>
              ${escapeHtml(formatCityLine(order))}<br>
              ${escapeHtml(order.countryCode || "IT")}<br>
              <strong>Tel:</strong> ${escapeHtml(order.phone || "-")}<br>
              <strong>Email:</strong> ${escapeHtml(order.email || "-")}
            </div>
            <div>
              <h4 style="margin: 0 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 4px; text-transform: uppercase; color: #555;">Dettagli spedizione</h4>
              <strong>Data ordine:</strong> ${escapeHtml(formatDate(order.createdAt))}<br>
              <strong>Data pagamento:</strong> ${escapeHtml(formatDate(order.paidAt))}<br>
              <strong>Metodo pagamento:</strong> ${escapeHtml(formatPaymentMethod(order))}<br>
              <strong>Note di spedizione:</strong><br>
              <div style="background: #f5f5f5; padding: 6px; border-radius: 4px; margin-top: 4px; font-style: italic; min-height: 40px;">
                ${escapeHtml(order.shippingNotes || "Nessuna nota fornita.")}
              </div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 25px;">
            <thead>
              <tr style="background: #f3f4f6; text-align: left; font-weight: bold;">
                <th style="padding: 8px; border-bottom: 2px solid #ccc;">SKU</th>
                <th style="padding: 8px; border-bottom: 2px solid #ccc;">Prodotto</th>
                <th style="padding: 8px; border-bottom: 2px solid #ccc; text-align: center;">Qta</th>
                <th style="padding: 8px; border-bottom: 2px solid #ccc; text-align: right;">Prezzo unit.</th>
                <th style="padding: 8px; border-bottom: 2px solid #ccc; text-align: right;">Tot. riga</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="display: flex; justify-content: flex-end; font-size: 13px;">
            <table style="width: 270px; border-collapse: collapse;">
              <tr>
                <td style="padding: 4px 0;">Totale prodotti (IVA incl.):</td>
                <td style="text-align: right; padding: 4px 0;">${euro(order.subtotalCents)}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #4b5563;">di cui IVA 4% inclusa:</td>
                <td style="text-align: right; padding: 4px 0; color: #4b5563;">${euro(order.vatCents)}</td>
              </tr>
              ${
                order.discountCents > 0
                  ? `
                <tr>
                  <td style="padding: 4px 0; color: #dc2626;">Sconto applicato:</td>
                  <td style="text-align: right; padding: 4px 0; color: #dc2626;">-&euro; ${(order.discountCents / 100).toFixed(2)}</td>
                </tr>
              `
                  : ""
              }
              <tr>
                <td style="padding: 4px 0;">Spedizione:</td>
                <td style="text-align: right; padding: 4px 0;">${euro(order.shippingCents)}</td>
              </tr>
              <tr style="font-weight: bold; border-top: 1.5px solid #333; font-size: 15px;">
                <td style="padding: 8px 0 0 0;">Totale ordine:</td>
                <td style="text-align: right; padding: 8px 0 0 0; color: #111827;">${euro(order.totalCents)}</td>
              </tr>
            </table>
          </div>
        </div>
      `;
    })
    .join("");

  const pageHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Stampa ordini</title>
      <meta charset="utf-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background: #f3f4f6;
          margin: 0;
          padding: 20px;
          color: #111827;
        }
        @media print {
          body {
            background: white;
            padding: 0;
          }
          .order-sheet {
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            margin-bottom: 0 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background: white; padding: 12px 20px; border-radius: 12px; border: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; gap: 16px; max-width: 800px; margin: 0 auto 20px auto; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
        <div>
          <span style="font-size: 14px; font-weight: bold;">Trovati ${orders.length} ordini nella selezione</span>
          <br><small style="color: #666;">Prime stampe: ${firstPrintCount} - Gia stampati almeno una volta: ${reprintedCount}</small>
          <br><small style="color: #666;">La lista resta ristampabile: ogni apertura registra un nuovo evento di stampa.</small>
        </div>
        <div style="white-space: nowrap;">
          <button onclick="window.print()" style="background: #111827; color: white; border: none; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; margin-right: 8px;">Stampa</button>
          <button onclick="window.close()" style="background: white; color: #374151; border: 1px solid #d1d5db; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer;">Chiudi</button>
        </div>
      </div>

      ${htmlItems}

      <script>
        window.addEventListener("DOMContentLoaded", () => {
          setTimeout(() => {
            window.print();
          }, 500);
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
