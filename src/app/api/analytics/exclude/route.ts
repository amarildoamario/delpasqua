import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { ANALYTICS_EXCLUSION_COOKIE, ANALYTICS_EXCLUSION_MAX_AGE, ANALYTICS_EXCLUSION_STORAGE } from "@/lib/analytics/exclusion";
import { excludeBrowserHistory, exclusionRequestAllowed } from "@/lib/server/analyticsExclusion";
import { allowAnalyticsRequest } from "@/lib/server/analyticsIngest";
import { prisma } from "@/lib/server/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" };

export async function POST(req: Request) {
  if (!exclusionRequestAllowed(req)) return new Response("Forbidden", { status: 403, headers });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (!allowAnalyticsRequest(`exclude:${ip}`)) return new Response("Too Many Requests", { status: 429, headers });
  try {
    await excludeBrowserHistory(prisma, req);
    const response = NextResponse.json({ excluded: true }, { headers });
    const url = new URL(req.url);
    response.cookies.set(ANALYTICS_EXCLUSION_COOKIE, "1", {
      path: "/", maxAge: ANALYTICS_EXCLUSION_MAX_AGE, sameSite: "lax", secure: url.protocol === "https:",
      ...(["delpasqua.com", "www.delpasqua.com"].includes(url.hostname) ? { domain: "delpasqua.com" } : {}),
    });
    return response;
  } catch {
    console.error("[ANALYTICS] Browser exclusion could not be saved");
    return NextResponse.json({ excluded: false }, { status: 503, headers });
  }
}

// This standalone page loads no tracker, so activation cannot add a visit.
export function GET() {
  const nonce = randomBytes(18).toString("base64");
  const html = `<!doctype html><html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Esclusione visite | Del Pasqua</title>
<style nonce="${nonce}">body{font:18px/1.6 system-ui,sans-serif;color:#24372b;background:#faf8f3;margin:0;padding:48px 24px}main{max-width:540px;margin:10vh auto}h1{font-size:30px;line-height:1.2}a,button{color:#245b38}button{font:inherit;padding:8px 16px;cursor:pointer}button:disabled{cursor:wait}</style></head>
<body><main><h1 id="title">Escludo questo browser…</h1><p id="message" role="status" aria-live="polite">Attendi la conferma.</p><button id="retry" hidden>Riprova</button><p><a href="/">Torna al sito</a></p><noscript>Per attivare l’esclusione occorre abilitare JavaScript e ricaricare questa pagina.</noscript></main>
<script nonce="${nonce}">
const title = document.getElementById('title'), message = document.getElementById('message'), retry = document.getElementById('retry');
async function activate() {
  retry.hidden = true;
  try {
    const response = await fetch(location.pathname, {method:'POST', credentials:'same-origin', cache:'no-store'});
    if (!response.ok) throw new Error('activation');
    let saved = document.cookie.split(/;\\s*/).includes('${ANALYTICS_EXCLUSION_COOKIE}=1');
    try { localStorage.setItem('${ANALYTICS_EXCLUSION_STORAGE}', '1'); saved = true; } catch {}
    try { sessionStorage.removeItem('analytics_queue_v2'); } catch {}
    if (!saved) throw new Error('storage');
    title.textContent = 'Questo browser è escluso';
    message.textContent = 'Le tue visite non saranno più conteggiate, anche cambiando rete. Sono escluse anche le visite precedenti riconoscibili da questo browser. Se cancelli i dati del sito o usi la navigazione privata, riapri questo link.';
  } catch {
    title.textContent = 'Esclusione da completare';
    message.textContent = 'Non posso confermare l’esclusione. Consenti il salvataggio dei dati di questo sito e riprova.';
    retry.hidden = false;
  }
}
retry.addEventListener('click', activate);
activate();
</script></body></html>`;
  return new Response(html, { headers: {
    ...headers, "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,
  } });
}
