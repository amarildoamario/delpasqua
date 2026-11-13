import test from "node:test";
import assert from "node:assert/strict";
import type { PrismaClient } from "@/generated/prisma";
import { excludeBrowserHistory, exclusionRequestAllowed, exclusionVisitor } from "./analyticsExclusion";
import { hasAnalyticsExclusion } from "../analytics/exclusion";
import { orderAnalyticsContext } from "./orderAnalytics";

const req = (cookie = "v_id=visitor-owner-0001; s_id=session-owner-0001", origin = "https://delpasqua.com") => new Request("https://delpasqua.com/api/analytics/exclude/?visitorId=someone-else", {
  method: "POST", headers: { cookie, origin, "sec-fetch-site": "same-origin" },
});

test("permanent exclusion does not match similarly named cookies or false values", () => {
  assert(hasAnalyticsExclusion("v_id=visitor-owner; analytics_excluded=1; s_id=session-owner"));
  for (const header of ["", "analytics_excluded=0", "other_analytics_excluded=1", "analytics_excluded=10"]) assert.equal(hasAnalyticsExclusion(header), false);
});

test("exclusion only accepts same-origin POST and the existing anonymous cookie", () => {
  assert(exclusionRequestAllowed(req()));
  assert.equal(exclusionRequestAllowed(req("", "https://evil.example")), false);
  assert.equal(exclusionRequestAllowed(new Request(req(), { headers: { origin: "https://delpasqua.com", "sec-fetch-site": "cross-site" } })), false);
  assert.equal(exclusionVisitor(req()), "visitor-owner-0001");
  assert.equal(exclusionVisitor(req("v_id=%27%3BSELECT")), null);
  assert.equal(exclusionVisitor(req("")), null);
});

test("history exclusion is atomic, scoped to one browser/environment and idempotent", async () => {
  const calls: unknown[] = [];
  const markers = new Set<string>();
  let activeHistory = 12;
  const db = {
    $transaction: async (run: (tx: unknown) => Promise<number>) => run({ analyticsEvent: {
      upsert: async (args: { where: { id: string }; create: { visitorId: string; isInternal: boolean; type: string; env: string } }) => {
        assert.equal(args.create.visitorId, "visitor-owner-0001");
        assert.equal(args.create.type, "analytics_excluded");
        assert.equal(args.create.env, "prod");
        assert.equal(args.create.isInternal, true);
        markers.add(args.where.id);
      },
      updateMany: async (args: unknown) => {
        calls.push(args);
        const count = activeHistory; activeHistory = 0;
        return { count };
      },
    } }),
  } as unknown as Pick<PrismaClient, "$transaction">;
  assert.equal(await excludeBrowserHistory(db, req()), 12);
  assert.equal(await excludeBrowserHistory(db, req()), 0);
  assert.equal(markers.size, 1);
  assert.deepEqual(calls[0], { where: { visitorId: "visitor-owner-0001", env: "prod", isInternal: false }, data: { isInternal: true } });
  assert.equal(await excludeBrowserHistory({ $transaction: () => assert.fail("no identity means no query") } as unknown as Pick<PrismaClient, "$transaction">, req("")), 0);
});

test("excluded browsers cannot attach an analytics identity to a commercial order", () => {
  assert(orderAnalyticsContext(req()));
  assert.equal(orderAnalyticsContext(req("v_id=visitor-owner-0001; s_id=session-owner-0001; analytics_excluded=1")), null);
});
