export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { getStoreSettings } from "@/lib/server/settings";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const PAID_LIKE_STATUSES = [
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
    })
  : null;

type LedgerOrder = {
  createdAt: Date;
  totalCents: number;
  subtotalCents: number;
  shippingCents: number;
  vatCents: number;
  stripeFeeCents: number;
  stripePaymentIntentId: string | null;
  stripeChargeId: string | null;
};

function estimateStripeFeeCents(totalCents: number) {
  return Math.round(totalCents * 0.015 + 25);
}

function deriveVatCents(order: Pick<LedgerOrder, "vatCents" | "subtotalCents">, vatRatePercent: number) {
  if (order.vatCents > 0) return order.vatCents;
  const vatRateDec = vatRatePercent / 100;
  return Math.round((order.subtotalCents * vatRateDec) / (1 + vatRateDec));
}

async function resolveStripeAutoValues(order: LedgerOrder) {
  if (!stripe) return null;

  if (order.stripePaymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId, {
        expand: ["latest_charge.balance_transaction", "latest_charge"],
      });

      const charge =
        typeof paymentIntent.latest_charge === "string" ? null : paymentIntent.latest_charge;
      const balanceTransaction =
        charge && typeof charge.balance_transaction !== "string"
          ? charge.balance_transaction
          : null;

      return {
        grossCents:
          typeof paymentIntent.amount_received === "number" && paymentIntent.amount_received > 0
            ? paymentIntent.amount_received
            : paymentIntent.amount,
        stripeFeeCents:
          typeof balanceTransaction?.fee === "number" ? balanceTransaction.fee : undefined,
      };
    } catch (error) {
      console.warn("[CONTI LEONARDO] unable to resolve Stripe payment intent", {
        paymentIntentId: order.stripePaymentIntentId,
        error,
      });
    }
  }

  if (order.stripeChargeId) {
    try {
      const charge = await stripe.charges.retrieve(order.stripeChargeId, {
        expand: ["balance_transaction"],
      });
      const balanceTransaction =
        typeof charge.balance_transaction === "string" ? null : charge.balance_transaction;

      return {
        grossCents: charge.amount,
        stripeFeeCents:
          typeof balanceTransaction?.fee === "number" ? balanceTransaction.fee : undefined,
      };
    } catch (error) {
      console.warn("[CONTI LEONARDO] unable to resolve Stripe charge", {
        chargeId: order.stripeChargeId,
        error,
      });
    }
  }

  return null;
}

export async function GET(req: Request) {
  const guard = await requireAdminApi(req, { csrf: false });
  if (!guard.ok) return guard.response;

  try {
    // 1) Carica impostazioni del negozio (IVA predefinita)
    const settings = await getStoreSettings();
    const vatRate = settings.vatRatePercent; // ad es: 4 (che equivale al 4%)

    // 2) Carica gli override manuali salvati
    const overridesRow = await prisma.setting.findUnique({
      where: { key: "leonardo_conti_data" },
    });
    const overrides = overridesRow ? JSON.parse(overridesRow.value) : {};

    // 3) Carica tutti gli ordini pagati/in corso
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: [...PAID_LIKE_STATUSES],
        },
      },
      select: {
        createdAt: true,
        totalCents: true,
        subtotalCents: true,
        shippingCents: true,
        vatCents: true,
        stripeFeeCents: true,
        stripePaymentIntentId: true,
        stripeChargeId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const stripeAutoValues = await Promise.all(
      orders.map(async (order) => resolveStripeAutoValues(order))
    );

    // 4) Aggrega i dati in memoria per mese (formato YYYY-MM)
    const monthsData: Record<
      string,
      {
        autoGrossCents: number;
        autoShippingCents: number;
        autoVatCents: number;
        autoStripeFeeCents: number;
        orderCount: number;
      }
    > = {};

    for (const [index, order] of orders.entries()) {
      const d = new Date(order.createdAt);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const monthKey = `${year}-${month}`;
      const stripeData = stripeAutoValues[index];
      const autoGrossCents = stripeData?.grossCents ?? order.totalCents;
      const autoShippingCents = order.shippingCents;
      const autoVatCents = deriveVatCents(order, vatRate);
      const autoStripeFeeCents =
        stripeData?.stripeFeeCents ??
        (order.stripeFeeCents > 0 ? order.stripeFeeCents : estimateStripeFeeCents(autoGrossCents));

      if (!monthsData[monthKey]) {
        monthsData[monthKey] = {
          autoGrossCents: 0,
          autoShippingCents: 0,
          autoVatCents: 0,
          autoStripeFeeCents: 0,
          orderCount: 0,
        };
      }

      const m = monthsData[monthKey];
      m.autoGrossCents += autoGrossCents;
      m.autoShippingCents += autoShippingCents;
      m.autoVatCents += autoVatCents;
      m.autoStripeFeeCents += autoStripeFeeCents;
      m.orderCount += 1;
    }

    return guard.attach(
      NextResponse.json({
        ok: true,
        vatRate,
        monthsData,
        overrides,
        hierarchy: ["manual", "stripe", "database", "estimate"],
      })
    );
  } catch (error) {
    console.error("[CONTI LEONARDO GET ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const guard = await requireAdminApi(req, { csrf: true });
  if (!guard.ok) return guard.response;

  try {
    const json = await req.json().catch(() => null);
    if (!json || typeof json.overrides !== "object") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { overrides } = json;

    await prisma.setting.upsert({
      where: { key: "leonardo_conti_data" },
      update: { value: JSON.stringify(overrides) },
      create: { key: "leonardo_conti_data", value: JSON.stringify(overrides) },
    });

    return guard.attach(NextResponse.json({ ok: true }));
  } catch (error) {
    console.error("[CONTI LEONARDO POST ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
