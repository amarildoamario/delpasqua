import { GOOGLE_DOMAINS } from "./googleDomains";

export const ACQUISITION_LABELS = {
  instagram: "Instagram", facebook: "Facebook", google: "Google",
  referral: "Altri siti", direct: "Diretto / sconosciuto",
} as const;

// These are attribution hints, not a browser fingerprint or proof of an ad click.
export function acquisitionSource(userAgent: string, referrer?: string | null) {
  if (/\bInstagram\b/i.test(userAgent)) return { source: "instagram", evidence: "browser" } as const;
  if (/\b(?:FBAN|FBAV|FBIOS|FB_IAB)\b/i.test(userAgent)) return { source: "facebook", evidence: "browser" } as const;
  let host = "";
  try {
    const url = new URL(referrer ?? "");
    if (url.protocol === "https:" || url.protocol === "http:") host = url.hostname.toLowerCase();
  } catch { /* Missing or relative referrers cannot identify an external site. */ }
  const domain = (name: string) => host === name || host.endsWith(`.${name}`);
  if (domain("instagram.com")) return { source: "instagram", evidence: "referrer" } as const;
  if (domain("facebook.com") || domain("fb.com")) return { source: "facebook", evidence: "referrer" } as const;
  const labels = host.split(".");
  const googleIndex = labels.lastIndexOf("google");
  const googleDomain = googleIndex >= 0 ? labels.slice(googleIndex).join(".") : "";
  if (GOOGLE_DOMAINS.has(googleDomain) || domain("googleadservices.com")) {
    return { source: "google", evidence: "referrer" } as const;
  }
  if (/\bGSA\//i.test(userAgent)) return { source: "google", evidence: "browser" } as const;
  if (host && !domain("delpasqua.com") && !domain("stripe.com") && host !== "localhost") return { source: "referral", evidence: "referrer" } as const;
  return { source: "direct", evidence: "none" } as const;
}

export function isSitePage(path?: string | null) {
  return !!path && !/^\/(?:[a-z]{2}\/)?(?:checkout|payments?|stripe|api|_next|admin|developer)(?:\/|$)/.test(path);
}
