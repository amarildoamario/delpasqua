// src/lib/server/antiFraud.ts
import type { PrismaClient } from "@/generated/prisma/client";

type Item = { sku?: string; qty: number };

type Args = {
  prisma: PrismaClient;
  ipAddress: string | null;
  userAgent: string | null;
  email: string | null;
  totalCents: number;
  items: Item[];
};

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "trashmail.com",
]);

function normalizeIp(ip: string | null) {
  if (!ip) return "";
  const s = ip.trim();
  if (!s || s.toLowerCase() === "unknown") return "";
  // se arriva "1.2.3.4, 5.6.7.8" prendiamo il primo
  return s.split(",")[0].trim();
}

function emailDomain(email: string) {
  const at = email.lastIndexOf("@");
  return at > 0 ? email.slice(at + 1).toLowerCase() : "";
}

export async function computeRiskScore(args: Args) {
  const reasons: string[] = [];
  let score = 0;

  const ip = normalizeIp(args.ipAddress);
  const ua = (args.userAgent ?? "").trim();
  const email = (args.email ?? "").trim().toLowerCase();

  // segnali base
  if (!ip) {
    score += 10;
    reasons.push("missing_ip");
  }
  if (!ua) {
    score += 5;
    reasons.push("missing_user_agent");
  }
  if (!email) {
    score += 10;
    reasons.push("missing_email");
  } else {
    const dom = emailDomain(email);
    if (dom && DISPOSABLE_DOMAINS.has(dom)) {
      score += 40;
      reasons.push("disposable_email_domain");
    }
  }

  // quantità + totale
  const totalQty = args.items.reduce((s, it) => s + (it.qty || 0), 0);
  if (totalQty >= 6) {
    score += 15;
    reasons.push("high_quantity");
  }

  if (args.totalCents >= 30000) {
    score += 20;
    reasons.push("high_total");
  }
  if (args.totalCents >= 60000) {
    score += 20;
    reasons.push("very_high_total");
  }

  // velocity semplice (anti-bot / spam)
  if (ip) {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const recent10m = await args.prisma.order.count({
      where: { ipAddress: ip, createdAt: { gte: tenMinAgo } },
    });
    if (recent10m >= 3) {
      score += 30;
      reasons.push("ip_velocity_10min");
    }

    const recent1h = await args.prisma.order.count({
      where: { ipAddress: ip, createdAt: { gte: hourAgo } },
    });
    if (recent1h >= 6) {
      score += 25;
      reasons.push("ip_velocity_1h");
    }
  }

  score = Math.max(0, Math.min(100, score));
  const isFlagged = score >= 50;

  return { score, isFlagged, reasons };
}
