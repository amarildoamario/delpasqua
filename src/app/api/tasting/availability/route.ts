import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";
import { buildWeekSlots, getWeekStartMonday } from "@/lib/tasting/slots";

export const dynamic = "force-dynamic";

function parseWeekStart(raw: string | null) {
  if (!raw) return null;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, d] = raw.split("-").map((n) => parseInt(n, 10));
  const x = new Date(y, (m || 1) - 1, d || 1);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const weekStart =
    parseWeekStart(url.searchParams.get("weekStart")) || getWeekStartMonday(new Date());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const bookings = await prisma.tastingBooking.findMany({
    where: {
      slotStart: { gte: weekStart, lt: weekEnd },
      status: { not: "CANCELED" },
    },
    orderBy: { slotStart: "asc" },
    select: {
      id: true,
      status: true,
      slotStart: true,
      slotEnd: true,
      tastingType: true,
      people: true,
    },
  });

  const slots = buildWeekSlots(weekStart).map((s) => ({
    start: s.start.toISOString(),
    end: s.end.toISOString(),
  }));

  return NextResponse.json({
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    slots,
    bookings: bookings.map((b) => ({
      ...b,
      slotStart: b.slotStart.toISOString(),
      slotEnd: b.slotEnd.toISOString(),
    })),
  });
}