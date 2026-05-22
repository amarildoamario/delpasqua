# AGENT.md

## Scopo
- HTTP API interna dell'app: checkout, ordini, admin, tasting, analytics, webhook, cron.

## Regole
- I route handler devono essere sottili: parse input, auth/rate-limit, delega a `@/lib/server`, risposta HTTP chiara.
- Mantieni runtime Node dove servono SDK, Prisma, crypto o accesso ambiente.
- Valida input e body size; non fidarti mai del client.
- Per endpoint admin usa i guard presenti in `@/lib/server/adminAuth`.

## Attenzioni
- Webhook, ordini, inventory e outbox hanno effetti irreversibili: preserva idempotenza e controlli sugli stati.
- Non importare componenti React o helper browser-only in questa subtree.
