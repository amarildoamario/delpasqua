import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/server/prisma";
import { requireAdminApi } from "@/lib/server/adminAuth";
import {
  sendTastingConfirmedCustomerEmail,
  sendTastingCanceledCustomerEmail,
} from "@/lib/server/tastingEmail";

export const dynamic = "force-dynamic";

const BodySchema = z.object({
  id: z.string().min(5),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]),
});

export async function POST(req: Request) {
  const guard = await requireAdminApi(req);
  if (!guard.ok) return guard.response;

  const json: unknown = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return guard.attach(
      NextResponse.json(
        { error: "Validation error", issues: parsed.error.issues },
        { status: 400 }
      )
    );
  }

  const { id, status: nextStatus } = parsed.data;

  const existing = await prisma.tastingBooking.findUnique({ where: { id } });
  if (!existing) {
    return guard.attach(
      NextResponse.json({ error: "Not found" }, { status: 404 })
    );
  }

  if (existing.status === nextStatus) {
    return guard.attach(NextResponse.json({ ok: true, bookingId: id, status: nextStatus, customerMail: null }));
  }
  if (existing.voucherId && existing.status === "CANCELED") {
    return guard.attach(NextResponse.json({ error: "Il voucher è tornato disponibile. Il cliente può inviare una nuova richiesta." }, { status: 409 }));
  }
  let updated;
  try {
    updated = await prisma.tastingBooking.updateMany({
      where: { id, status: existing.status },
      data: { status: nextStatus },
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return guard.attach(NextResponse.json({ error: "L’orario è già occupato da una prenotazione attiva." }, { status: 409 }));
    }
    throw error;
  }
  if (!updated.count) {
    return guard.attach(NextResponse.json({ error: "Lo stato è cambiato. Aggiorna la pagina." }, { status: 409 }));
  }

  // ✅ invio mail cliente:
  // - CONFIRMED -> conferma
  // - CANCELED -> cancellazione
  // - PENDING (ripristina) -> niente mail
  let customerMail: unknown = null;

  if (nextStatus === "CONFIRMED") {
    customerMail = await sendTastingConfirmedCustomerEmail({
      toEmail: existing.email,
      fullName: existing.fullName,
      slotStart: existing.slotStart,
      slotEnd: existing.slotEnd,
      tastingType: existing.tastingType,
      people: existing.people,
      children: existing.children,
    });
    console.log("[TASTING][ADMIN] Customer confirm mail result:", customerMail);
  } else if (nextStatus === "CANCELED") {
    customerMail = await sendTastingCanceledCustomerEmail({
      toEmail: existing.email,
      fullName: existing.fullName,
      slotStart: existing.slotStart,
      slotEnd: existing.slotEnd,
      tastingType: existing.tastingType,
      people: existing.people,
      children: existing.children,
      viaVoucher: !!existing.voucherId,
    });
    console.log("[TASTING][ADMIN] Customer cancel mail result:", customerMail);
  } else {
    console.log("[TASTING][ADMIN] No customer mail sent (no CONFIRMED/CANCELED transition).");
  }

  return guard.attach(
    NextResponse.json({
      ok: true,
      bookingId: id,
      status: nextStatus,
      customerMail,
    })
  );
}
