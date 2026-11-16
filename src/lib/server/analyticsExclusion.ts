import { randomUUID } from "node:crypto";
import type { PrismaClient } from "@/generated/prisma";
import { analyticsVisitorCookie } from "@/lib/analytics/exclusion";
import { excludeCheckoutHistory } from "./checkoutAudience";

export function exclusionVisitor(req: Request) {
  // Only the anonymous identity already held by this browser, never an ID in
  // the URL/body, an IP, a country or a device model.
  return analyticsVisitorCookie(req.headers.get("cookie") ?? "");
}

export function exclusionRequestAllowed(req: Request) {
  return req.headers.get("origin") === new URL(req.url).origin &&
    !["cross-site", "same-site"].includes(req.headers.get("sec-fetch-site") ?? "");
}

export async function excludeBrowserHistory(db: Pick<PrismaClient, "$transaction">, req: Request) {
  const visitorId = exclusionVisitor(req);
  if (!visitorId) return 0;
  const env = ["delpasqua.com", "www.delpasqua.com"].includes(new URL(req.url).hostname) ? "prod" : "dev";
  return db.$transaction(async (tx) => {
    // An internal marker also rejects late/replayed batches for this identity.
    // It is never a page_view and is excluded by the existing quality filters.
    await tx.analyticsEvent.upsert({
      where: { id: `ana-excluded-${env}-${visitorId}` },
      create: {
        id: `ana-excluded-${env}-${visitorId}`, visitorId, sessionId: randomUUID(),
        type: "analytics_excluded", env, isInternal: true,
      },
      update: {},
    });
    const result = await tx.analyticsEvent.updateMany({
      where: { visitorId, env, isInternal: false },
      data: { isInternal: true },
    });
    await excludeCheckoutHistory(tx, visitorId, env);
    return result.count;
  });
}
