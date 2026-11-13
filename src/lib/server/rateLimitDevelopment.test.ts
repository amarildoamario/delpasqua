import test from "node:test";
import assert from "node:assert/strict";

test("development rate limiting uses memory without contacting production Redis or Postgres", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  const mutableEnv: Record<string, string | undefined> = process.env;
  const env = mutableEnv.NODE_ENV;
  mutableEnv.NODE_ENV = "development";
  let queries = 0;
  state.prismaPostgres = { $queryRaw: async () => { queries++; throw new Error("Unexpected database access"); } };
  try {
    const { rateLimit } = await import("./rateLimit");
    const params = { key: "dev-memory-test", limit: 2, windowSeconds: 60 };
    assert.equal((await rateLimit(params)).ok, true);
    assert.equal((await rateLimit(params)).ok, true);
    assert.equal((await rateLimit(params)).ok, false);
    assert.equal(queries, 0);
  } finally {
    state.prismaPostgres = previous;
    if (env === undefined) delete mutableEnv.NODE_ENV; else mutableEnv.NODE_ENV = env;
  }
});
