export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_CSRF_COOKIE,
  revokeAdminSessionByToken,
} from "@/lib/server/adminAuth";

export async function POST(req: Request) {
  // Best-effort server-side invalidation
  const cookie = req.headers.get("cookie") || "";
  const token = (cookie.match(/(?:^|;\s*)admin_session=([^;]+)/)?.[1] || "").trim();
  if (token) {
    await revokeAdminSessionByToken(decodeURIComponent(token)).catch(() => null);
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set(ADMIN_CSRF_COOKIE, "", {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
}
