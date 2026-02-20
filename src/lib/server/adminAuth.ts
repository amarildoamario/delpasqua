import crypto from "crypto";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/server/prisma";

/**
 * P0.07/P0.07b
 * - Session non statica (token random)
 * - Stored as hash in DB
 * - Exp breve + rotazione
 * - Logout = revoca server-side
 * - CSRF: double-submit cookie (admin_csrf) + header x-csrf-token
 */

export const ADMIN_SESSION_COOKIE = "admin_session";
export const ADMIN_CSRF_COOKIE = "admin_csrf";

// Default policy (override via env if you want)
const SESSION_TTL_SECONDS = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS || "28800", 10); // 8h
const ROTATE_EVERY_SECONDS = parseInt(process.env.ADMIN_SESSION_ROTATE_SECONDS || "900", 10); // 15m

function base64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export function randomToken(bytes = 48) {
  return base64url(crypto.randomBytes(bytes));
}

export function getClientIpFromHeaders(h: Headers) {
  const xff = h.get("x-forwarded-for") || "";
  const ip = xff.split(",")[0]?.trim();
  return ip || h.get("x-real-ip") || "";
}

export function getUserAgentFromHeaders(h: Headers) {
  return h.get("user-agent") || "";
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };
}

function csrfCookieOptions() {
  // Must be readable by JS to attach header
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };
}

export async function createAdminSession(params: {
  ipAddress?: string;
  userAgent?: string;
}) {
  const token = randomToken(48);
  const csrf = randomToken(32);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);

  await prisma.adminSession.create({
    data: {
      tokenHash: sha256Hex(token),
      csrfHash: sha256Hex(csrf),
      expiresAt,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      rotatedAt: now,
      lastUsedAt: now,
    },
  });

  return { token, csrf, expiresAt };
}

export async function revokeAdminSessionByToken(rawToken: string) {
  const tokenHash = sha256Hex(rawToken);
  await prisma.adminSession.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function validateAdminSessionByToken(rawToken: string) {
  const tokenHash = sha256Hex(rawToken);
  const now = new Date();
  const session = await prisma.adminSession.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: now },
    },
  });
  return session;
}

async function rotateSessionIfNeeded(sessionId: string) {
  const session = await prisma.adminSession.findUnique({ where: { id: sessionId } });
  if (!session || session.revokedAt) return null;

  const now = new Date();
  const rotatedAt = session.rotatedAt ?? session.createdAt;
  const ageSeconds = Math.floor((now.getTime() - rotatedAt.getTime()) / 1000);

  if (ageSeconds < ROTATE_EVERY_SECONDS) {
    await prisma.adminSession.update({
      where: { id: sessionId },
      data: { lastUsedAt: now },
    });
    return null;
  }

  const newToken = randomToken(48);
  const newCsrf = randomToken(32);
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);

  await prisma.adminSession.update({
    where: { id: sessionId },
    data: {
      tokenHash: sha256Hex(newToken),
      csrfHash: sha256Hex(newCsrf),
      rotatedAt: now,
      lastUsedAt: now,
      expiresAt,
    },
  });

  return { token: newToken, csrf: newCsrf, expiresAt };
}

/**
 * Enforce CSRF for cookie-based admin session.
 * Strategy: sameSite=strict + Origin/Referer check + double-submit cookie.
 */
export function enforceAdminCsrf(req: Request) {
  // ✅ DEV: evita rotture su host diversi (localhost vs LAN)
  if (process.env.NODE_ENV !== "production") return;

  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return;

  const h = req.headers;
  const origin = h.get("origin");
  const referer = h.get("referer");

  if (!origin && !referer) {
    throw Object.assign(new Error("Missing Origin/Referer"), { status: 403 });
  }

  const host = h.get("x-forwarded-host") || h.get("host") || "";
  const proto = h.get("x-forwarded-proto") || "https";
  const expected = process.env.APP_ORIGIN || (host ? `${proto}://${host}` : "");

  const originOk = !origin || !expected ? true : origin === expected;
  const refererOk = !referer || !expected ? true : referer.startsWith(expected);

  if (!originOk || !refererOk) {
    throw Object.assign(new Error("Bad Origin/Referer"), { status: 403 });
  }
}


export async function requireAdminApi(
  req: Request,
  opts?: { csrf?: boolean }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionToken = parseCookie(cookieHeader, ADMIN_SESSION_COOKIE);
  if (!sessionToken) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const session = await validateAdminSessionByToken(sessionToken);
  if (!session) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  // CSRF check (double submit)
 // CSRF check (double submit)
if (opts?.csrf !== false) {
  try {
    enforceAdminCsrf(req);
  } catch (e: any) {
    const status = typeof e?.status === "number" ? e.status : 403;
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status }),
    };
  }

  const cookieHeader = req.headers.get("cookie") || "";
  const csrfCookie = parseCookie(cookieHeader, ADMIN_CSRF_COOKIE);
  const csrfHeader = req.headers.get("x-csrf-token") || "";
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  if (sha256Hex(csrfCookie) !== session.csrfHash) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
}


  // rotation
  const rotated = await rotateSessionIfNeeded(session.id);

  const attach = (res: NextResponse) => {
    if (rotated) {
      res.cookies.set(ADMIN_SESSION_COOKIE, rotated.token, {
        ...cookieOptions(),
        maxAge: SESSION_TTL_SECONDS,
      });
      res.cookies.set(ADMIN_CSRF_COOKIE, rotated.csrf, {
        ...csrfCookieOptions(),
        maxAge: SESSION_TTL_SECONDS,
      });
    }
    return res;
  };

  return { ok: true as const, session, attach };
}

export async function requireAdminPage(_nextPathWithSearch: string) {
  // ✅ FIX TS: cookies() può essere Promise in base alla versione di Next typings
  const c = await cookies();

  const token = c.get(ADMIN_SESSION_COOKIE)?.value || "";
  if (!token) return { ok: false as const };

  const session = await validateAdminSessionByToken(token);
  if (!session) return { ok: false as const };

  const rotated = await rotateSessionIfNeeded(session.id);
  if (rotated) {
    c.set(ADMIN_SESSION_COOKIE, rotated.token, {
      ...cookieOptions(),
      maxAge: SESSION_TTL_SECONDS,
    });
    c.set(ADMIN_CSRF_COOKIE, rotated.csrf, {
      ...csrfCookieOptions(),
      maxAge: SESSION_TTL_SECONDS,
    });
  }

  return { ok: true as const, session };
}

// --- tiny cookie parser (no dependency)
function parseCookie(cookieHeader: string, name: string) {
  const parts = cookieHeader.split(/;\s*/g);
  for (const p of parts) {
    const i = p.indexOf("=");
    if (i <= 0) continue;
    const k = p.slice(0, i).trim();
    if (k !== name) continue;
    return decodeURIComponent(p.slice(i + 1));
  }
  return "";
}

// Backward compat for old imports
export const ADMIN_COOKIE = ADMIN_SESSION_COOKIE;

/**
 * Deprecated: used by old middleware. Keep it returning false to avoid false positives.
 * We no longer authenticate in edge middleware.
 */
export function isAdminAuthed(_req: NextRequest) {
  return false;
}
