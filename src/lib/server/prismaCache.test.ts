import "dotenv/config";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { Prisma } from "@/generated/prisma";
import { databasePolicy } from "./databaseSafety.mjs";

test("a dev reload discards a cached Prisma client from an older generated schema", async () => {
  const state = globalThis as unknown as { prismaPostgres?: unknown; prismaCacheKey?: string };
  const previous = { prismaPostgres: state.prismaPostgres, prismaCacheKey: state.prismaCacheKey };
  const policy = databasePolicy();
  const outdatedDatamodel = {
    ...Prisma.dmmf.datamodel,
    models: Prisma.dmmf.datamodel.models.filter((model) => model.name !== "TastingVoucherCheckout"),
  };
  let disconnected = false;
  const outdatedClient = {
    $extends: () => undefined,
    $disconnect: async () => { disconnected = true; },
  };
  state.prismaPostgres = outdatedClient;
  state.prismaCacheKey = createHash("sha256")
    .update(`${policy.mode}:${policy.connectionString}\0`)
    .update(JSON.stringify(outdatedDatamodel))
    .digest("hex");
  try {
    const { prisma } = await import("./prisma");
    try {
      assert.equal(disconnected, true);
      assert.notEqual(prisma, outdatedClient);
      assert.equal(typeof prisma.tastingVoucherCheckout.count, "function");
      assert.equal(typeof prisma.tastingVoucher.findMany, "function");
    } finally {
      await prisma.$disconnect();
    }
  } finally {
    Object.assign(state, previous);
  }
});
