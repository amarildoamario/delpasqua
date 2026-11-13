// Independent of the temporary test_mode cookie: leaving test mode must not
// re-enable tracking for the owner's browsers.
export const ANALYTICS_EXCLUSION_COOKIE = "analytics_excluded";
export const ANALYTICS_EXCLUSION_STORAGE = "analytics_excluded_v1";
export const ANALYTICS_EXCLUSION_MAX_AGE = 400 * 86400;

export function hasAnalyticsExclusion(cookieHeader: string) {
  return cookieHeader.split(/;\s*/).some((part) => part === `${ANALYTICS_EXCLUSION_COOKIE}=1`);
}

export function browserAnalyticsExcluded() {
  if (typeof window === "undefined") return false;
  let excluded = hasAnalyticsExclusion(document.cookie);
  try {
    excluded ||= localStorage.getItem(ANALYTICS_EXCLUSION_STORAGE) === "1";
    if (excluded) localStorage.setItem(ANALYTICS_EXCLUSION_STORAGE, "1");
  } catch { /* The cookie still works when local storage is unavailable. */ }
  if (excluded) {
    const domain = ["delpasqua.com", "www.delpasqua.com"].includes(location.hostname)
      ? "; Domain=delpasqua.com" : "";
    document.cookie = `${ANALYTICS_EXCLUSION_COOKIE}=1; Max-Age=${ANALYTICS_EXCLUSION_MAX_AGE}; Path=/; SameSite=Lax${domain}${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  return excluded;
}
