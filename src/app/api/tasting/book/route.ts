import { NextResponse } from "next/server";
import { z } from "zod";
import Stripe from "stripe";
import { prisma } from "@/lib/server/prisma";
import { getTastingTypes } from "@/lib/tasting/slots";
import { sendTastingBookingAdminEmail } from "@/lib/server/tastingEmail";
import { rateLimitOrThrow } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { TASTING_CHECKOUT_PAYMENT_METHOD_TYPES } from "@/lib/paymentMethods";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

function getIP(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  return (xf?.split(",")[0] ?? "unknown").trim();
}

const BodySchema = z.object({
  slotStartIso: z.string().min(10),
  slotEndIso: z.string().min(10),
  tastingTypeId: z.string().min(1),
  people: z.number().int().min(1).max(20),
  children: z.number().int().min(0).max(10).optional(),
  fullName: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().min(5).max(30),
  notes: z.string().max(800).optional().or(z.literal("")),
  timeReq: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

function safeDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function resolveAppUrl(req: Request) {
  const requestOrigin = new URL(req.url).origin;
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const isLocalRequest = requestOrigin.includes("localhost:");

  if (process.env.NODE_ENV !== "production") {
    return (configuredAppUrl || requestOrigin || "http://localhost:3000").replace(/\/$/, "");
  }

  if (process.env.VERCEL_ENV === "production" && configuredAppUrl) {
    return configuredAppUrl.replace(/\/$/, "");
  }

  return (isLocalRequest ? "http://localhost:3000" : requestOrigin).replace(/\/$/, "");
}

export async function POST(req: Request) {
  try {
    enforceBodyLimit(req, 8_000);
    rateLimitOrThrow({ key: `tasting-book:${getIP(req)}`, limit: 10, windowSeconds: 60 });

    const json: unknown = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);

  if (!parsed.success) {
    console.warn("[TASTING][BOOK] validation error", parsed.error.issues);
    return NextResponse.json(
      { error: "Validation error", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const slotStart = safeDate(data.slotStartIso);
  let slotEnd = safeDate(data.slotEndIso);
  if (!slotStart || !slotEnd || slotEnd <= slotStart) {
    console.warn("[TASTING][BOOK] bad slot", { slotStartIso: data.slotStartIso, slotEndIso: data.slotEndIso });
    return NextResponse.json({ error: "Bad slot" }, { status: 400 });
  }

  const types = getTastingTypes();
  const type = types.find((t) => t.id === data.tastingTypeId);
  if (!type) {
    console.warn("[TASTING][BOOK] bad tasting type", { tastingTypeId: data.tastingTypeId });
    return NextResponse.json({ error: "Bad tasting type" }, { status: 400 });
  }

  // ✅ Applichiamo l'orario richiesto dall'utente altrimenti rimane quello standard (es: 10:30)
  if (data.timeReq) {
    const [hh, mm] = data.timeReq.split(":").map(Number);
    slotStart.setHours(hh, mm, 0, 0);
    // Ricalcoliamo la fine in base alla durata del tipo di degustazione
    slotEnd = new Date(slotStart.getTime() + type.durationMinutes * 60000);
  }

    // ✅ Preveniamo doppie prenotazioni per la stessa esatta fascia oraria (Overlap) tramite transazione con table lock pessimistico
    const booking = await prisma.$transaction(async (tx) => {
      // Lock di tabella esclusivo per impedire ad altre transazioni concorrenti di scrivere/controllare slot contemporaneamente
      await tx.$executeRaw`LOCK TABLE "TastingBooking" IN EXCLUSIVE MODE`;

      const dayStart = new Date(slotStart);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(slotStart);
      dayEnd.setHours(23, 59, 59, 999);

      const existingForDay = await tx.tastingBooking.findMany({
        where: {
          status: { not: "CANCELED" },
          slotStart: { gte: dayStart, lte: dayEnd },
        },
        select: { slotStart: true, slotEnd: true },
      });

      const conflict = existingForDay.find(b => slotStart < b.slotEnd && slotEnd > b.slotStart);

      if (conflict) {
        throw Object.assign(new Error("L'orario richiesto si accavalla con una prenotazione esistente in questo lasso di tempo. Riprova con un altro orario."), { status: 409, code: "SLOT_CONFLICT" });
      }

      console.log("[TASTING][BOOK] request inside transaction", {
        tastingTypeId: data.tastingTypeId,
        people: data.people,
        email: data.email,
        slotStart: slotStart.toISOString(),
        slotEnd: slotEnd.toISOString(),
      });

      return tx.tastingBooking.create({
        data: {
          slotStart,
          slotEnd,
          tastingType: type.title,
          people: data.people,
          children: data.children ?? 0,
          fullName: data.fullName.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          notes: (data.notes || "").trim() || null,
          status: "PENDING",
        },
        select: {
          id: true,
          status: true,
          slotStart: true,
          slotEnd: true,
          tastingType: true,
          people: true,
          children: true,
          fullName: true,
          email: true,
          phone: true,
          notes: true,
        },
      });
    });

  const isPaid = type.id === "classica" || type.id === "intermedia";
  const pricePerPerson = type.id === "classica" ? 20 : type.id === "intermedia" ? 35 : 0;

  if (isPaid) {
    try {
      const appUrl = resolveAppUrl(req);
      const priceCents = pricePerPerson * 100;
      const lineItems = [
        {
          quantity: data.people,
          price_data: {
            currency: "eur",
            unit_amount: priceCents,
            product_data: {
              name: type.title,
              description: `Degustazione per ${data.people} adult${data.people > 1 ? "i" : "o"}${data.children && data.children > 0 ? ` e ${data.children} bambin${data.children > 1 ? "i" : "o"} (gratis)` : ""}`,
            },
          },
        },
      ];

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: [...TASTING_CHECKOUT_PAYMENT_METHOD_TYPES],
        customer_email: data.email.trim().toLowerCase(),
        line_items: lineItems,
        success_url: `${appUrl}/degustazioni?success=true&booking_id=${booking.id}`,
        cancel_url: `${appUrl}/degustazioni?canceled=true`,
        client_reference_id: booking.id,
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes expiration (minimum allowed)
        metadata: {
          bookingId: booking.id,
          type: "tasting_booking",
        },
      });

      await prisma.tastingBooking.update({
        where: { id: booking.id },
        data: { stripeSessionId: session.id },
      });

      console.log("[TASTING][BOOK] stripe checkout created", {
        bookingId: booking.id,
        sessionId: session.id,
      });

      return NextResponse.json({
        ok: true,
        bookingId: booking.id,
        checkoutUrl: session.url,
      });
    } catch (err: unknown) {
      console.error("[TASTING][BOOK] Stripe session creation failed", err);
      // Clean up booking record since payment initialization failed
      await prisma.tastingBooking.delete({ where: { id: booking.id } }).catch(() => null);
      return NextResponse.json({ error: "Errore durante la creazione della sessione di pagamento." }, { status: 500 });
    }
  }

  // ✅ Per pacchetti Premium (non a pagamento immediato): manda mail admin subito come prima
  console.log("[TASTING][BOOK] created inquiry (free/premium)", {
    id: booking.id,
    status: booking.status,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    email: booking.email,
  });

  const mail = await sendTastingBookingAdminEmail({
    id: booking.id,
    status: booking.status,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    tastingType: booking.tastingType,
    people: booking.people,
    children: booking.children,
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    notes: booking.notes,
  });

  console.log("[TASTING][BOOK] admin mail result (premium inquiry)", mail);

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      mail,
    });
  } catch (e: unknown) {
    const err = e as Error & { status?: number; statusCode?: number; retryAfterSec?: number; code?: string; meta?: unknown };
    const status = err?.status ?? err?.statusCode;

    if (status === 429) {
      return new Response("Too Many Requests", {
        status: 429,
        headers: { "Retry-After": String(err.retryAfterSec ?? 30) },
      });
    }

    if (status === 413) return new Response("Payload Too Large", { status: 413 });
    if (status === 400) return new Response(err.message ?? "Bad Request", { status: 400 });

    if (status === 409 || err.code === "SLOT_CONFLICT") {
      return NextResponse.json(
        { error: err.message ?? "L'orario richiesto si accavalla con una prenotazione esistente in questo lasso di tempo. Riprova con un altro orario." },
        { status: 409 }
      );
    }

    if (err.code === "P2002") {
      console.warn("[TASTING][BOOK] slot conflict (P2002)", err.meta);
      return NextResponse.json({ error: "Slot not available" }, { status: 409 });
    }

    console.error("[TASTING][BOOK] create failed", err);
    return new Response("Server Error", { status: 500 });
  }
}
