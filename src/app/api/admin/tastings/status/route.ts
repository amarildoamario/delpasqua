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

  const updated = await prisma.tastingBooking.update({
    where: { id },
    data: { status: nextStatus },
  });

  // ...

  // ✅ invio mail cliente:
  // - CONFIRMED -> conferma
  // - CANCELED -> cancellazione
  // - PENDING (ripristina) -> niente mail
  let customerMail: unknown = null;

  if (existing.status !== "CONFIRMED" && nextStatus === "CONFIRMED") {
    customerMail = await sendTastingConfirmedCustomerEmail({
      toEmail: existing.email,
      fullName: existing.fullName,
      slotStart: existing.slotStart,
      slotEnd: existing.slotEnd,
      tastingType: existing.tastingType,
      people: existing.people,
    });
    console.log("[TASTING][ADMIN] Customer confirm mail result:", customerMail);
  } else if (existing.status !== "CANCELED" && nextStatus === "CANCELED") {
    customerMail = await sendTastingCanceledCustomerEmail({
      toEmail: existing.email,
      fullName: existing.fullName,
      slotStart: existing.slotStart,
      slotEnd: existing.slotEnd,
      tastingType: existing.tastingType,
      people: existing.people,
    });
    console.log("[TASTING][ADMIN] Customer cancel mail result:", customerMail);
  } else {
    console.log("[TASTING][ADMIN] No customer mail sent (no CONFIRMED/CANCELED transition).");
  }

  return guard.attach(
    NextResponse.json({
      ok: true,
      bookingId: updated.id,
      status: updated.status,
      customerMail,
    })
  );
}