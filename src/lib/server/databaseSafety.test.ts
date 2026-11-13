import test from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@/generated/prisma";
import { databasePolicy, assertDatabaseOperation, databaseGuardExtension, assertPrismaCliAllowed, LocalDatabaseWriteBlockedError } from "./databaseSafety.mjs";

const remote = "postgresql://test:fake@db.example.test:5432/production?sslmode=require";

test("local production builds and downloaded deployment variables never enable remote writes on Windows", () => {
  for (const NODE_ENV of [undefined, "development", "test", "production"]) {
    const policy = databasePolicy({ DATABASE_URL: remote, NODE_ENV, VERCEL: "1", VERCEL_ENV: "production" }, "win32");
    assert.equal(policy.readOnly, true);
    assert.match(new URL(policy.connectionString).searchParams.get("options")!, /default_transaction_read_only=on/);
    assert.match(new URL(policy.connectionString).searchParams.get("options")!, /transaction_read_only=on/);
  }
  assert.equal(databasePolicy({ DATABASE_URL: remote, NODE_ENV: "production" }, "linux").readOnly, true);
  assert.equal(databasePolicy({ DATABASE_URL: remote, VERCEL: "1", VERCEL_ENV: "preview" }, "linux").readOnly, true);
  assert.equal(databasePolicy({ DATABASE_URL: remote, VERCEL: "1", VERCEL_ENV: "production" }, "linux").readOnly, false);
});

test("write access requires a separate explicit loopback development database", () => {
  for (const host of ["localhost", "127.0.0.1", "[::1]"]) {
    const policy = databasePolicy({ DATABASE_URL: remote, LOCAL_DATABASE_URL: `postgresql://dev:fake@${host}:5432/delpasqua_dev` }, "win32");
    assert.equal(policy.mode, "local-development"); assert.equal(policy.readOnly, false);
  }
  for (const local of [remote, "postgresql://dev:fake@localhost:5432/production", "postgresql://dev:fake@localhost.example.test/delpasqua_dev", "file:./dev.db"]) {
    assert.throws(() => databasePolicy({ DATABASE_URL: remote, LOCAL_DATABASE_URL: local }, "win32"));
  }
  assert.equal(databasePolicy({ DATABASE_URL: "postgresql://dev:fake@localhost/delpasqua_dev" }, "win32").readOnly, true);
});

test("read-only startup options override prior off flags and remain stable on repeated loading", () => {
  const url = new URL(remote); url.searchParams.set("options", "-c default_transaction_read_only=off -c search_path=public");
  const policy = databasePolicy({ DATABASE_URL: url.toString() }, "win32");
  const options = new URL(policy.connectionString).searchParams.get("options")!;
  assert.match(options, /search_path=public/);
  assert.doesNotMatch(options, /read_only=off/);
  assert.equal(databasePolicy({ DATABASE_URL: policy.connectionString }, "win32").connectionString, policy.connectionString);
});

test("model and raw mutation guards fail closed, including data-changing CTEs and attempts to disable read-only", async () => {
  const policy = databasePolicy({ DATABASE_URL: remote }, "win32");
  for (const operation of ["create", "createMany", "createManyAndReturn", "update", "updateMany", "updateManyAndReturn", "upsert", "delete", "deleteMany", "unknown"]) {
    assert.throws(() => assertDatabaseOperation(policy, operation, {}, "Order"), LocalDatabaseWriteBlockedError);
  }
  for (const operation of ["findMany", "findUnique", "count", "aggregate", "groupBy"]) assert.doesNotThrow(() => assertDatabaseOperation(policy, operation, {}, "Order"));
  for (const sql of ["SELECT 1", "WITH totals AS (SELECT COUNT(*) FROM public.items) SELECT * FROM totals", "/* readable */ SELECT now()"])
    assert.doesNotThrow(() => assertDatabaseOperation(policy, "$queryRawUnsafe", [sql], undefined));
  for (const sql of ["UPDATE public.items SET qty=0", "WITH changed AS (DELETE FROM public.items RETURNING *) SELECT * FROM changed", "SELECT set_config('default_transaction_read_only','off',false)", "SELECT 1; DROP TABLE public.items", "SELECT * FROM public.items FOR UPDATE", "SELECT pg_catalog.lo_import('/tmp/file')", ""])
    assert.throws(() => assertDatabaseOperation(policy, "$queryRawUnsafe", [sql], undefined), LocalDatabaseWriteBlockedError);
  assert.throws(() => assertDatabaseOperation(policy, "$executeRaw", { strings: ["SELECT 1"] }, undefined), LocalDatabaseWriteBlockedError);
  assert.doesNotThrow(() => assertDatabaseOperation(policy, "$queryRaw", { strings: ["SELECT * FROM public.items WHERE id=", ""] }, undefined));
  let queries = 0;
  const extension = databaseGuardExtension(policy).query.$allOperations;
  assert.deepEqual(await extension({ model: "Order", operation: "findMany", args: {}, query: async () => { queries++; return []; } }), []);
  await assert.rejects(extension({ model: "Order", operation: "deleteMany", args: {}, query: async () => { queries++; return []; } }), LocalDatabaseWriteBlockedError);
  assert.equal(queries, 1);
});

test("the real Prisma extension rejects writes before touching an adapter or opening a connection", async () => {
  let connections = 0;
  const client = new PrismaClient({ adapter: {
    provider: "postgres", adapterName: "database-guard-test",
    connect: async () => { connections++; throw new Error("Adapter must not be reached"); },
  } }).$extends(databaseGuardExtension(databasePolicy({ DATABASE_URL: remote }, "win32")));
  try {
    await assert.rejects(client.contactMessage.deleteMany({}), LocalDatabaseWriteBlockedError);
    await assert.rejects(client.order.updateMany({ data: { status: "PAGATO" } }), LocalDatabaseWriteBlockedError);
    await assert.rejects(client.$executeRawUnsafe("DELETE FROM ignored_test_table"), LocalDatabaseWriteBlockedError);
    await assert.rejects(client.$queryRawUnsafe("WITH d AS (DELETE FROM ignored_test_table RETURNING *) SELECT * FROM d"), LocalDatabaseWriteBlockedError);
    assert.equal(connections, 0);
  } finally { await client.$disconnect(); }
});

test("Prisma migrations, resets, seeds and execution cannot target a remote database from the CLI", () => {
  const policy = databasePolicy({ DATABASE_URL: remote }, "win32");
  for (const args of [["migrate", "deploy"], ["migrate", "dev"], ["migrate", "reset"], ["migrate", "resolve"], ["db", "push"], ["db", "seed"], ["db", "execute"], ["studio"]])
    assert.throws(() => assertPrismaCliAllowed(policy, args), LocalDatabaseWriteBlockedError);
  for (const args of [["generate"], ["validate"], ["format"], ["db", "pull"], ["migrate", "status"]]) assert.doesNotThrow(() => assertPrismaCliAllowed(policy, args));
  const development = databasePolicy({ LOCAL_DATABASE_URL: "postgresql://dev:fake@localhost/delpasqua_test" }, "win32");
  assert.doesNotThrow(() => assertPrismaCliAllowed(development, ["migrate", "deploy"]));
});
