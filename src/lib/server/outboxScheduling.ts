import { after } from "next/server";
import { processOutboxBatch } from "@/lib/server/outbox";

export function scheduleOutboxBatch(options: { limit: number }) {
  // Keep PDF generation and delivery alive after the HTTP response on Vercel.
  after(async () => {
    try {
      await processOutboxBatch(options);
    } catch (error) {
      console.error("[OUTBOX] Post-response delivery failed", error);
    }
  });
}
