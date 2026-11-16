import test from "node:test";
import assert from "node:assert/strict";
import { ContactSchema } from "./contactInput";
import { contactCountry, normalizeContactPhone } from "../contactPhone";
import { Resend } from "resend";

test("contact phone follows the visitor country, normalizes trunk prefixes and retains Italian leading zero", () => {
  assert.equal(contactCountry("fr"), "FR");
  for (const unknown of [null, "XX", "T1"]) assert.equal(contactCountry(unknown), "IT");
  assert.equal(normalizeContactPhone("331 526 3830", "IT"), "+393315263830");
  assert.equal(normalizeContactPhone("0575 810065", "IT"), "+390575810065");
  assert.equal(normalizeContactPhone("06 12 34 56 78", "FR"), "+33612345678");
  assert.equal(normalizeContactPhone("+44 20 7946 0018", "IT"), "+442079460018");
  for (const invalid of ["", "123", "<script>", "call +393315263830"]) assert.equal(normalizeContactPhone(invalid, "IT"), null);
});

test("contact schema requires an international phone and privacy consent", () => {
  const fixture = { name: "Test", email: "test@example.invalid", subject: "Test", message: "Test message", consent: true };
  for (const phone of [undefined, "", "123", "3315263830", "+123"]) assert(!ContactSchema.safeParse({ ...fixture, phone }).success);
  assert.equal(ContactSchema.parse({ ...fixture, phone: "+39 331 526 3830" }).phone, "+393315263830");
  assert(!ContactSchema.safeParse({ ...fixture, phone: "+393315263830", consent: false }).success);
});

test("contact endpoint rejects missing phone and stores/notifies the normalized number without real email or database calls", async (t) => {
  const state = globalThis as unknown as { prismaPostgres?: unknown };
  const previous = state.prismaPostgres;
  const keys = ["RESEND_API_KEY", "EMAIL_FROM", "ADMIN_NOTIFY_EMAIL", "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"];
  const env = keys.map((key) => process.env[key]);
  process.env.RESEND_API_KEY = "re_test_mock"; process.env.EMAIL_FROM = "test@example.invalid"; process.env.ADMIN_NOTIFY_EMAIL = "admin@example.invalid";
  delete process.env.UPSTASH_REDIS_REST_URL; delete process.env.UPSTASH_REDIS_REST_TOKEN;
  const saved: { phone?: string }[] = [], emails: { text: string; html: string }[] = [];
  state.prismaPostgres = {
    $queryRaw: async () => [{ count: 1 }], $executeRaw: async () => 0,
    contactMessage: { create: async ({ data }: { data: { phone: string } }) => { saved.push(data); return { id: "fixture-contact" }; }, update: async () => ({}) },
  };
  const emailPrototype = Object.getPrototypeOf(new Resend("re_test_mock").emails);
  t.mock.method(emailPrototype, "send", async (payload: { text: string; html: string }) => { emails.push(payload); return { data: { id: "mock" }, error: null }; });
  try {
    const { POST } = await import("../../app/api/contact/route");
    const fixture = { name: "Test", email: "test@example.invalid", subject: "Test", message: "Test message", consent: true };
    const req = (data: unknown) => new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    assert.equal((await POST(req(fixture))).status, 400);
    assert.equal(saved.length, 0);
    assert.equal((await POST(req({ ...fixture, phone: "+39 331 526 3830" }))).status, 200);
    assert.equal(saved[0].phone, "+393315263830");
    assert.equal(emails.length, 1);
    assert(emails[0].text.includes("+393315263830") && emails[0].html.includes("+393315263830"));
  } finally {
    state.prismaPostgres = previous;
    keys.forEach((key, i) => { if (env[i] === undefined) delete process.env[key]; else process.env[key] = env[i]; });
  }
});
