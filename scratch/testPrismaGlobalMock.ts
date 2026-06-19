import test from "node:test";
import assert from "node:assert/strict";

test("dynamic import resolves prisma mock", async () => {
  const mockPrisma = {
    isMock: true,
    order: {
      findUnique: async () => ({ id: "mock_order_id" }),
    },
  };
  
  (globalThis as any).prismaPostgres = mockPrisma;
  
  // Use dynamic import to prevent hoisting!
  const { prisma } = await import("../src/lib/server/prisma");
  
  assert.equal((prisma as any).isMock, true);
  console.log("Dynamic import mock worked!");
});
