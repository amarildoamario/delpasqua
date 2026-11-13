import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";

test("read-only admin requests validate an existing session without rotating or extending it", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  const localUrl = process.env.LOCAL_DATABASE_URL;
  process.env.LOCAL_DATABASE_URL = "";
  let reads = 0, writes = 0;
  const csrf = "readonly-csrf";
  const session = { id: "readonly-admin", tokenHash: "old-hash", csrfHash: createHash("sha256").update(csrf).digest("hex"), createdAt: new Date(Date.now() - 7200000), rotatedAt: new Date(Date.now() - 3600000) };
  state.prismaPostgres = { adminSession: {
    findFirst: async () => { reads++; return session; },
    update: async () => { writes++; throw new Error("Read-only session must never be rotated"); },
  } };
  try {
    const { requireAdminApi } = await import("./adminAuth");
    const req = new Request("http://localhost:3000/api/admin/orders/", { headers: { cookie: `admin_session=valid-readonly-session; admin_csrf=${csrf}`, "x-csrf-token": csrf } });
    const result = await requireAdminApi(req, { csrf: false });
    assert.equal(result.ok, true); assert.equal(reads, 1); assert.equal(writes, 0);
    const blocked = await requireAdminApi(new Request(req.url, { method: "POST", headers: req.headers }));
    assert.equal(blocked.ok, false);
    if (!blocked.ok) assert.equal(blocked.response.status, 409);
    assert.equal(writes, 0);
  } finally {
    state.prismaPostgres = previous;
    if (localUrl === undefined) delete process.env.LOCAL_DATABASE_URL; else process.env.LOCAL_DATABASE_URL = localUrl;
  }
});
