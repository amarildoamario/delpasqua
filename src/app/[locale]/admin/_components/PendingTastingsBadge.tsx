import { prisma } from "@/lib/server/prisma";

export default async function PendingTastingsBadge() {
  const count = await prisma.tastingBooking.count({
    where: { status: "PENDING" },
  });

  if (!count) return null;

  return (
    <span className="ml-2 inline-flex min-w-[22px] items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 px-2 py-0.5 text-xs font-black text-white shadow-[0_0_10px_rgba(139,92,246,0.4)] ring-1 ring-purple-400/40">
      {count > 99 ? "99+" : count}
    </span>
  );
}