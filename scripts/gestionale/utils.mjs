/**
 * @file utils.mjs
 * @description Funzioni di utilità ed helper condivisi per la suite di test del gestionale.
 * Gestisce la connessione al database tramite Prisma, la creazione/rimozione di sessioni
 * di test per aggirare i controlli CSRF/auth, le chiamate fetch autenticate e le asserzioni di test.
 */

import { createRequire } from "module";
import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config();

const require = createRequire(import.meta.url);
const { PrismaClient } = require("../../src/generated/prisma/index.js");
const { PrismaPg } = require("@prisma/adapter-pg");
const pg = require("pg");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL not set in environment.");
  process.exit(1);
}

// Global Prisma instances to avoid leaking connections
let pool;
let adapter;
let prisma;

export function getPrisma() {
  if (!prisma) {
    pool = new pg.Pool({ connectionString: DATABASE_URL });
    adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}

export async function closePrisma() {
  if (prisma) {
    await prisma.$disconnect();
    prisma = null;
  }
  if (pool) {
    await pool.end();
    pool = null;
    adapter = null;
  }
}

// Helper to generate base64url token
function base64url(buf) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sha256Hex(input) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export function randomToken(bytes = 48) {
  return base64url(crypto.randomBytes(bytes));
}

/**
 * Creates a valid admin session directly in the database.
 * Returns the raw token and csrf token to be used in cookies and headers.
 */
export async function createTestAdminSession() {
  const db = getPrisma();
  const token = randomToken(48);
  const csrf = randomToken(32);
  const tokenHash = sha256Hex(token);
  const csrfHash = sha256Hex(csrf);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 8 * 3600 * 1000); // 8 hours

  const session = await db.adminSession.create({
    data: {
      tokenHash,
      csrfHash,
      expiresAt,
      ipAddress: "127.0.0.1",
      userAgent: "GestionaleTestSuiteBot",
      rotatedAt: now,
      lastUsedAt: now,
    },
  });

  return { token, csrf, session };
}

/**
 * Revokes and deletes test admin sessions by token or ID.
 */
export async function deleteTestAdminSession(token) {
  const db = getPrisma();
  const tokenHash = sha256Hex(token);
  await db.adminSession.deleteMany({
    where: { tokenHash },
  });
}

/**
 * Helper to fetch local admin API endpoints with auth credentials.
 */
export async function adminFetch(path, sessionData, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const headers = {
    ...options.headers,
  };

  if (sessionData) {
    const { token, csrf } = sessionData;
    headers["Cookie"] = `admin_session=${token}; admin_csrf=${csrf}`;
    headers["x-csrf-token"] = csrf;
  }

  // To pass CSRF enforcement in dev/prod where Origin checks might be run
  headers["Origin"] = BASE_URL;
  headers["Referer"] = `${BASE_URL}/admin`;

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Simple test execution assertion helper.
 */
export function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || "Values not equal"} (Expected: ${expected}, Got: ${actual})`);
  }
}

export function makeInternalSku(productId, variantId) {
  return `${productId}:${variantId}`;
}

