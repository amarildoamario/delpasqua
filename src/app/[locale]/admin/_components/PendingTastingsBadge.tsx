import { prisma } from "@/lib/server/prisma";

export default async function PendingTastingsBadge() {
  const count = await prisma.tastingBooking.count({
    where: { status: "PENDING" },
  });

  if (!count) return null;

  return (
    <span className="ml-2 inline-flex min-w-[20px] items-center justify-center rounded-full bg-neutral-900 px-2 py-0.5 text-xs font-bold text-white">
      {count}
    </span>
  );
}