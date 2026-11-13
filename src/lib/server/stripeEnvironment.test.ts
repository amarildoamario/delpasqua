import test from "node:test";
import assert from "node:assert/strict";
import { localStripeTestError } from "./stripeEnvironment";

test("local checkouts require Stripe test credentials even with a writable local DB", () => {
  const env = { LOCAL_DATABASE_URL: "postgresql://dev:fake@localhost/delpasqua_test", STRIPE_SECRET_KEY: "sk_live_dummy" };
  assert.match(localStripeTestError(env, "win32")!, /Stripe live/);
  assert.equal(localStripeTestError({ ...env, STRIPE_SECRET_KEY: "sk_test_dummy" }, "win32"), null);
  assert.equal(localStripeTestError({ ...env, STRIPE_SECRET_KEY: "rk_test_dummy" }, "win32"), null);
  assert.ok(localStripeTestError({ ...env, NODE_ENV: "production", VERCEL: "1", VERCEL_ENV: "production" }, "win32"));
  assert.equal(localStripeTestError({ DATABASE_URL: "postgresql://fake:fake@db.example.test/production", VERCEL: "1", VERCEL_ENV: "production", STRIPE_SECRET_KEY: "sk_live_dummy" }, "linux"), null);
});
