export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { renderOrderPrintHtml, type PrintableOrder } from "@/lib/server/orderPrint";
import type * as Prisma from "@/generated/prisma/client";

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

  const pageHtml = renderOrderPrintHtml(orders);

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
