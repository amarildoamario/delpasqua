import "dotenv/config";
import { defineConfig } from "prisma/config";
import { databasePolicy, assertPrismaCliAllowed } from "./src/lib/server/databaseSafety.mjs";

const policy = databasePolicy();
assertPrismaCliAllowed(policy);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: policy.connectionString },
});
