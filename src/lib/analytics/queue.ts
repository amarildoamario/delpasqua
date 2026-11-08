import type { AnalyticsEvent } from "./events";

export const ANALYTICS_BATCH_SIZE = 30;
export const ANALYTICS_FLUSH_MS = 30_000;
export const ANALYTICS_QUEUE_LIMIT = 200;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** Per-tab durable queue. Acknowledgements must not remove newer events. */
export class AnalyticsQueue {
  private events: AnalyticsEvent[] = [];

  constructor(saved: unknown = [], now = Date.now()) {
    if (!Array.isArray(saved)) return;
    for (const event of saved) {
      if (!event || typeof event.eventId !== "string" || typeof event.occurredAt !== "string") continue;
      const age = now - Date.parse(event.occurredAt);
      if (Number.isFinite(age) && age >= -60_000 && age < MAX_AGE_MS) this.add(event);
    }
  }

  add(event: AnalyticsEvent) {
    const index = this.events.findIndex((item) => item.eventId === event.eventId);
    if (index >= 0) this.events[index] = event;
    else this.events.push(event);
    if (this.events.length > ANALYTICS_QUEUE_LIMIT) this.events.shift();
  }

  batch() {
    const result: AnalyticsEvent[] = [];
    for (const event of this.events.slice(0, ANALYTICS_BATCH_SIZE)) {
      if (new TextEncoder().encode(JSON.stringify([...result, event])).length > 48_000) break;
      result.push(event);
    }
    return result;
  }

  acknowledge(batch: AnalyticsEvent[]) {
    const sent = new Map(batch.map((event) => [event.eventId, JSON.stringify(event)]));
    this.events = this.events.filter((event) => sent.get(event.eventId) !== JSON.stringify(event));
  }

  snapshot() { return this.events; }
  clear() { this.events = []; }
}
