export const runtime = "nodejs";

import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import { getStoreSettings } from "@/lib/server/settings";
import { databasePolicy } from "@/lib/server/databaseSafety.mjs";
import { metricsMonthKey } from "@/lib/server/salesMetrics";
import { estimateStripeFeeCents, readTastingLedger } from "@/lib/server/tastingLedger";
import { TASTING_VAT_PERCENT } from "@/lib/server/tastingVat";
import { calcVatCentsFromSubtotal } from "@/lib/server/vat";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const PAID_LIKE_STATUSES = [
  "PAGATO",
  "IN_PREPARAZIONE",
  "SPEDITO",
  "CONSEGNATO",
  "RIMBORSATO",
  "PARZIALMENTE_RIMBORSATO",
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

function deriveVatCents(order: Pick<LedgerOrder, "vatCents" | "subtotalCents">, vatRatePercent: number) {
  if (order.vatCents > 0) return order.vatCents;
  return calcVatCentsFromSubtotal(order.subtotalCents, vatRatePercent / 100);
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
    const [settings, overridesRow, orders, tastings] = await Promise.all([
      getStoreSettings(),
      prisma.setting.findUnique({ where: { key: "leonardo_conti_data" } }),
      prisma.order.findMany({
        where: { isTest: false, status: { in: [...PAID_LIKE_STATUSES] } },
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
        orderBy: { createdAt: "desc" },
      }),
      readTastingLedger(prisma, databasePolicy().mode === "deployed-production" ? stripe : null),
    ]);
    const vatRate = settings.vatRatePercent;
    const overrides = overridesRow ? JSON.parse(overridesRow.value) : {};

    const stripeAutoValues = await Promise.all(
      orders.map(async (order) => resolveStripeAutoValues(order))
    );

    const monthsData: Record<
      string,
      {
        autoGrossCents: number;
        autoShippingCents: number;
        autoVatCents: number;
        autoStripeFeeCents: number;
        orderCount: number;
        tastingCount: number;
        autoTastingGrossCents: number;
        autoTastingVatCents: number;
        leonardoShareCents: number;
      }
    > = {};

    function getMonth(date: Date) {
      const key = metricsMonthKey(date);
      return monthsData[key] ??= {
        autoGrossCents: 0,
        autoShippingCents: 0,
        autoVatCents: 0,
        autoStripeFeeCents: 0,
        orderCount: 0,
        tastingCount: 0,
        autoTastingGrossCents: 0,
        autoTastingVatCents: 0,
        leonardoShareCents: 0,
      };
    }

    for (const [index, order] of orders.entries()) {
      const stripeData = stripeAutoValues[index];
      const autoGrossCents = stripeData?.grossCents ?? order.totalCents;
      const autoShippingCents = order.shippingCents;
      const autoVatCents = deriveVatCents(order, vatRate);
      const autoStripeFeeCents =
        stripeData?.stripeFeeCents ??
        (order.stripeFeeCents > 0 ? order.stripeFeeCents : estimateStripeFeeCents(autoGrossCents));

      const m = getMonth(order.createdAt);
      m.autoGrossCents += autoGrossCents;
      m.autoShippingCents += autoShippingCents;
      m.autoVatCents += autoVatCents;
      m.autoStripeFeeCents += autoStripeFeeCents;
      m.leonardoShareCents += Math.round(autoGrossCents / 10);
      m.orderCount += 1;
    }

    for (const payment of tastings.payments) {
      const m = getMonth(payment.paidAt);
      m.autoGrossCents += payment.grossCents;
      m.autoVatCents += payment.vatCents;
      m.autoStripeFeeCents += payment.stripeFeeCents;
      m.tastingCount += 1;
      m.autoTastingGrossCents += payment.grossCents;
      m.autoTastingVatCents += payment.vatCents;
      m.leonardoShareCents += Math.round(payment.grossCents / 10);
    }

    return guard.attach(
      NextResponse.json({
        ok: true,
        vatRate,
        tastingVatRate: TASTING_VAT_PERCENT,
        unresolvedTastingPayments: tastings.unresolvedBookings,
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
