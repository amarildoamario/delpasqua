# AGENT.md

## Scopo
- Fonte autorevole della logica server e di dominio.
- Riferimento principale della repo per sicurezza applicativa e cybersecurity.

## Regole
- Pricing, inventory, auth admin, rate limit, catalog read/write, email e outbox devono vivere qui.
- Mantieni questi moduli framework-light: poca dipendenza da componenti/pagine, focus su servizi e funzioni testabili.
- Se una route handler ripete logica presente qui, sposta la regola in questa cartella invece di duplicarla.
- Preserva confini Node/server-only.
- Per qualsiasi implementazione o refactoring di backend, sicurezza e logica di business, fare riferimento ai file di to-do specifici (es. `to_do_security_ops.md`, `to_do_business_logic.md`) presenti all'interno della cartella [docs/](file:///c:/Users/Utente/Desktop/React/delpasqua/docs), organizzati con la convenzione grafica `[✅ RISOLTO]`, `[⚠️ PARZIALE]`, `[⏳ TODO]`.

## Security First
- Tratta ogni input esterno come non affidabile: request body, querystring, header, cookie, webhook payload, metadata Stripe, file path e variabili ambiente.
- Valida sempre gli input con schema o controlli espliciti prima di usarli in DB, pricing, auth o side effect esterni.
- Applica il principio del privilegio minimo: esponi solo i dati necessari e non restituire stack trace o dettagli interni al client.
- Mantieni idempotenza per webhook, ordini, retry admin e cron: le chiamate duplicate devono essere safe.
- Ogni mutazione sensibile deve avere almeno uno tra questi guardrail: auth, CSRF, rate limit, body size limit, controllo stato, audit event.
- Non introdurre segreti hardcoded, token persistiti in chiaro o log di PII/credenziali.
- Se devi loggare, preferisci identificatori tecnici, status e trace id; evita email complete, indirizzi completi, payload raw e segreti.

## Aree Critiche
- `adminAuth.ts`: sessioni admin, cookie, CSRF, rotazione token, revoca.
- `rateLimit.ts` e `bodyLimit.ts`: protezione base anti abuso.
- `inventory.ts`, `pricing.ts`, `orderEvents.ts`: integrità ordine e coerenza stock/prezzi.
- `outbox.ts`, `email.ts`, `tastingEmail.ts`: side effect esterni e retry controllati.
- `prisma.ts`: accesso DB e isolamento environment.
- webhook Stripe e flussi ordine collegati: mai indebolire signature verification o idempotenza.

## Cosa Evitare
- Bypassare `requireAdminApi(...)` o `requireAdminPage(...)` per comodità.
- Spostare validazioni dal server al client come unica difesa.
- Fare trust di `session_id`, `orderId`, `promotionCode`, `priceCents`, `qty` o `stock` se arrivano dal browser.
- Eseguire update distruttivi senza verificare stato corrente, ownership logica e retry safety.
- Aggiungere fallback silenziosi su credenziali mancanti in produzione.

## Checklist Prima Di Chiudere Un Task Sensibile
- Auth corretta?
- Input validato?
- Rate limit o anti abuse presente dove serve?
- Errore client-safe senza leak?
- Log utili ma non sensibili?
- Stato DB coerente anche su retry, doppio submit o webhook duplicato?
- Impatto su Stripe, email, outbox, inventory e admin considerato?

## Attenzioni
- `prisma.ts` usa Postgres via env; non introdurre assunzioni su SQLite.
- `adminAuth.ts`, `pricing.ts`, `inventory.ts`, `outbox.ts` e i moduli ordine sono sensibili: preferisci cambi piccoli, espliciti e verificabili.
