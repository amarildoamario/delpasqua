import { databasePolicy } from "./databaseSafety.mjs";

export function localStripeTestError(env: Record<string, string | undefined> = process.env, platform: string = process.platform) {
  if (databasePolicy(env, platform).mode === "deployed-production") return null;
  if (/^(sk|rk)_test_/.test(env.STRIPE_SECRET_KEY || "")) return null;
  return "Per provare il checkout e il PDF con pagamento in locale configura una chiave Stripe di test. Stripe live è disabilitato nello sviluppo.";
}
