import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { getTastingTypes } from "@/lib/tasting/slots";
import { sendTastingBookingAdminEmail } from "@/lib/server/tastingEmail";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  slotStartIso: z.string().min(10),
  slotEndIso: z.string().min(10),
  tastingTypeId: z.string().min(1),
  people: z.number().int().min(1).max(20),
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

export async function POST(req: Request) {
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

  // ✅ Preveniamo doppie prenotazioni per la stessa esatta fascia oraria (Overlap)
  const dayStart = new Date(slotStart);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(slotStart);
  dayEnd.setHours(23, 59, 59, 999);

  const existingForDay = await prisma.tastingBooking.findMany({
    where: {
      status: { not: "CANCELED" },
      slotStart: { gte: dayStart, lte: dayEnd },
    },
    select: { slotStart: true, slotEnd: true },
  });

  const conflict = existingForDay.find(b => slotStart < b.slotEnd && slotEnd > b.slotStart);

  if (conflict) {
    console.warn("[TASTING][BOOK] slot conflict (manual check)", { slotStart: slotStart.toISOString() });
    return NextResponse.json({ error: "L'orario richiesto si accavalla con una prenotazione esistente in questo lasso di tempo. Riprova con un altro orario." }, { status: 409 });
  }

  console.log("[TASTING][BOOK] request", {
    tastingTypeId: data.tastingTypeId,
    people: data.people,
    email: data.email,
    slotStart: slotStart.toISOString(),
    slotEnd: slotEnd.toISOString(),
  });

  let booking;
  try {
    booking = await prisma.tastingBooking.create({
      data: {
        slotStart,
        slotEnd,
        tastingType: type.title,
        people: data.people,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        notes: (data.notes || "").trim() || null,
      },
      select: {
        id: true,
        status: true,
        slotStart: true,
        slotEnd: true,
        tastingType: true,
        people: true,
        fullName: true,
        email: true,
        phone: true,
        notes: true,
      },
    });
  } catch (err: unknown) {
    const e = err as { code?: string; meta?: unknown };
    if (e?.code === "P2002") {
      console.warn("[TASTING][BOOK] slot conflict (P2002)", e?.meta);
      return NextResponse.json({ error: "Slot not available" }, { status: 409 });
    }
    console.error("[TASTING][BOOK] create failed", e);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }

  console.log("[TASTING][BOOK] created", {
    id: booking.id,
    status: booking.status,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    email: booking.email,
  });

  // ✅ INVIO EMAIL ADMIN (debug completo nel tastingEmail.ts)
  const mail = await sendTastingBookingAdminEmail({
    id: booking.id,
    status: booking.status,
    slotStart: booking.slotStart,
    slotEnd: booking.slotEnd,
    tastingType: booking.tastingType,
    people: booking.people,
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    notes: booking.notes,
  });

  console.log("[TASTING][BOOK] admin mail result", mail);

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    mail,
  });
}