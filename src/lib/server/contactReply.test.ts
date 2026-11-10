import test from "node:test";
import assert from "node:assert/strict";
import { buildContactReply, ContactReplySchema } from "./contactReply";

const message = { id: "contact-123", email: "customer@example.com" };
const input = { subject: "Re: Richiesta olio", body: "Buongiorno,\n<script>alert('x')</script> & grazie", requestId: "0d62fd62-b918-4dd8-bdeb-e22055bd0532" };
const config = { from: "Del Pasqua <ordini@delpasqua.com>", replyTo: "info@delpasqua.com" };

test("reply goes to stored customer from the configured domain, preserving plain text and escaping HTML", () => {
  const { payload } = buildContactReply(message, input, config);
  assert.equal(payload.to, message.email);
  assert.equal(payload.from, config.from);
  assert.equal(payload.replyTo, config.replyTo);
  assert.equal(payload.subject, input.subject);
  assert.equal(payload.text, input.body);
  assert(!payload.html.includes("<script>"));
  assert(payload.html.includes("&lt;script&gt;"));
  assert(payload.html.includes("&amp; grazie"));
});

test("retries reuse an idempotency key; separate replies and edited text do not collide", () => {
  const key = buildContactReply(message, input, config).idempotencyKey;
  assert.equal(buildContactReply(message, { ...input }, config).idempotencyKey, key);
  assert.notEqual(buildContactReply(message, { ...input, body: "Nuova risposta" }, config).idempotencyKey, key);
  assert.notEqual(buildContactReply(message, { ...input, requestId: "607546db-0262-455e-8d79-aa331ab6b668" }, config).idempotencyKey, key);
  assert.notEqual(buildContactReply({ ...message, id: "other" }, input, config).idempotencyKey, key);
});

test("rejects empty content, oversized replies, header injection, invalid request IDs and client-supplied recipients", () => {
  for (const patch of [
    { body: " " }, { subject: " " }, { body: "a".repeat(20001) },
    { subject: "Reply\r\nBcc: attacker@example.com" }, { requestId: "invalid" },
    { to: "attacker@example.com" }, { from: "attacker@example.com" },
  ]) assert.equal(ContactReplySchema.safeParse({ ...input, ...patch }).success, false);
  assert.throws(() => buildContactReply({ ...message, email: "bad\naddress" }, input, config));
  assert.equal(ContactReplySchema.parse({ ...input, body: "  Grazie  " }).body, "Grazie");
});
