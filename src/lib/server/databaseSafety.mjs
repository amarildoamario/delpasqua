/** Shared by the app, Prisma CLI and maintenance scripts. No database I/O here. */
const READ_OPERATIONS = new Set(["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "findMany", "count", "aggregate", "groupBy"]);
const BLOCKED_SQL = /\b(insert|update|delete|merge|create|alter|drop|truncate|grant|revoke|call|do|copy|vacuum|analyze|refresh|set|reset|set_config|dblink|lo_import|lo_export|pg_terminate_backend|pg_cancel_backend)\b/i;

export class LocalDatabaseWriteBlockedError extends Error {
  code = "LOCAL_DATABASE_WRITE_BLOCKED";
  constructor() { super("Database remoto in sola lettura da locale. Usa LOCAL_DATABASE_URL con un database Postgres locale separato (delpasqua_dev o delpasqua_test) per i salvataggi."); }
}

/** @param {Record<string, string | undefined>} env @param {string} platform */
export function databasePolicy(env = process.env, platform = process.platform) {
  // NODE_ENV=production is also used by local builds/start. It is never authorization.
  // Windows development stays read-only even if deployment variables were downloaded.
  const deployedProduction = platform === "linux" && env.VERCEL === "1" && env.VERCEL_ENV === "production";
  const localOverride = !deployedProduction && !!env.LOCAL_DATABASE_URL;
  const rawUrl = localOverride ? env.LOCAL_DATABASE_URL : env.DATABASE_URL;
  if (!rawUrl) throw new Error("DATABASE_URL non configurato.");
  let url;
  try { url = new URL(rawUrl); } catch { throw new Error("URL database non valido."); }
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("È richiesto un database PostgreSQL.");
  if (localOverride) {
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname.toLowerCase());
    const database = decodeURIComponent(url.pathname.slice(1));
    if (!loopback || !["delpasqua_dev", "delpasqua_test"].includes(database)) {
      throw new Error("LOCAL_DATABASE_URL deve puntare a localhost e al database delpasqua_dev o delpasqua_test. Nessuna deroga per database remoti.");
    }
    return { connectionString: url.toString(), readOnly: false, mode: "local-development" };
  }
  if (deployedProduction) return { connectionString: url.toString(), readOnly: false, mode: "deployed-production" };
  // Last options win. Enforce both the current session and future transactions.
  const existing = (url.searchParams.get("options") || "").replace(/(?:^|\s)-c\s+(?:default_transaction_read_only|transaction_read_only)=(?:on|off|true|false|1|0)(?=\s|$)/g, " ").trim();
  url.searchParams.set("options", `${existing} -c default_transaction_read_only=on -c transaction_read_only=on`.trim());
  return { connectionString: url.toString(), readOnly: true, mode: "remote-read-only" };
}

function rawSql(args) {
  const first = Array.isArray(args) ? args[0] : args;
  if (typeof first === "string") return first;
  if (Array.isArray(first?.strings)) return first.strings.join(" ? ");
  if (typeof first?.sql === "string") return first.sql;
  if (typeof first?.text === "string") return first.text;
  return "";
}

export function assertDatabaseOperation(policy, operation, args, model) {
  if (!policy.readOnly) return;
  if (model && READ_OPERATIONS.has(operation)) return;
  if (!model && ["$queryRaw", "$queryRawUnsafe"].includes(operation)) {
    const sql = rawSql(args).replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\r\n]*/g, " ").trim();
    if (/^(SELECT|WITH)\b/i.test(sql) && !BLOCKED_SQL.test(sql)) return;
  }
  throw new LocalDatabaseWriteBlockedError();
}

export function databaseGuardExtension(policy) {
  return { name: "local-remote-database-read-only", query: {
    /** @param {{ model?: string, operation: string, args: unknown, query: (args: unknown) => Promise<unknown> }} request */
    async $allOperations({ model, operation, args, query }) {
      assertDatabaseOperation(policy, operation, args, model);
      return query(args);
    },
  } };
}

export function assertPrismaCliAllowed(policy, args = process.argv.slice(2)) {
  if (!policy.readOnly) return;
  const migrate = args.indexOf("migrate");
  const db = args.indexOf("db");
  if ((migrate >= 0 && args[migrate + 1] !== "status") ||
      (db >= 0 && args[db + 1] !== "pull") || args.includes("studio")) {
    throw new LocalDatabaseWriteBlockedError();
  }
}
