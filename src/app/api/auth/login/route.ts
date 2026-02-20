export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_CSRF_COOKIE,
  createAdminSession,
  getClientIpFromHeaders,
  getUserAgentFromHeaders,
} from "@/lib/server/adminAuth";
import { rateLimit } from "@/lib/server/rateLimit";
import { enforceBodyLimit } from "@/lib/server/bodyLimit";
import { AdminLoginSchema } from "@/lib/server/schemas";

export async function POST(req: Request) {
  try {
    const ip = getClientIpFromHeaders(req.headers) || "unknown";
    const rl = await rateLimit({ key: `login:${ip}`, limit: 5, windowSeconds: 60 });
    if (!rl.ok) {
      const res = NextResponse.json({ error: "Too many attempts" }, { status: 429 });
      res.headers.set(
        "Retry-After",
        String(Math.max(1, Math.ceil((rl.resetAt.getTime() - Date.now()) / 1000)))
      );
      return res;
    }

    enforceBodyLimit(req, 5_000);

    const body = await req.json().catch(() => null);
    const parsed = AdminLoginSchema.safeParse(body ?? {});
    if (!parsed.success) {
      return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim();
    const adminPass = process.env.ADMIN_PASSWORD ?? "";

    if (!adminEmail || !adminPass) {
      return NextResponse.json({ error: "Admin credentials not configured" }, { status: 500 });
    }

    if (email !== adminEmail || password !== adminPass) {
      return NextResponse.json({ error: "Credenziali non valide" }, { status: 401 });
    }

    const { token, csrf } = await createAdminSession({
      ipAddress: ip,
      userAgent: getUserAgentFromHeaders(req.headers),
    });

    const ttl = parseInt(process.env.ADMIN_SESSION_TTL_SECONDS || "28800", 10);

    const res = NextResponse.json({ ok: true }, { status: 200 });
    res.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ttl,
    });
    res.cookies.set(ADMIN_CSRF_COOKIE, csrf, {
      httpOnly: false,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: ttl,
    });

    return res;
  } catch (e) {
    console.error("LOGIN error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
