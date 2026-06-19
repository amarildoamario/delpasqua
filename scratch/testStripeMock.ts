import Stripe from "stripe";
import test from "node:test";
import assert from "node:assert/strict";

test("mock StripeResource._makeRequest with fullPath", async (t) => {
  const stripe = new Stripe("mock-key");
  
  t.mock.method((Stripe as any).StripeResource.prototype, "_makeRequest", async (args: any, spec: any, options: any) => {
    if (spec.fullPath === "/v1/coupons") {
      return { id: "mock_coupon_id" };
    }
    if (spec.fullPath === "/v1/checkout/sessions") {
      return { id: "mock_session_id", url: "https://mock.stripe.url" };
    }
    throw new Error("Unknown fullPath: " + spec.fullPath);
  });

  const coupon = await stripe.coupons.create({ duration: "once" });
  assert.equal(coupon.id, "mock_coupon_id");

  const session = await stripe.checkout.sessions.create({ success_url: "https://success.com" });
  assert.equal(session.id, "mock_session_id");
  assert.equal(session.url, "https://mock.stripe.url");
  
  console.log("Stripe mock verification successful!");
});
