# TODO Security, Abuse, Operativita

Data audit: 2026-05-29

## [✅ RISOLTO] P0 - Build puo ignorare errori TypeScript

Stato:
- Risolto il 2026-05-30. Abbiamo rimosso la configurazione tollerante impostando `typescript.ignoreBuildErrors: false` in `next.config.ts`. Questo garantisce che qualsiasi futuro deploy su Vercel o locale fallisca istantaneamente in cassa se vi sono errori di tipo TypeScript, prevenendo regressioni in produzione.

Problema:
- `next.config.ts` ha `typescript.ignoreBuildErrors: true`.
- Quindi `next build` puo andare avanti anche con errori TS.

Impatto:
- Rischio deploy di codice rotto.
- Il typecheck separato passa oggi, ma la build non deve essere l'unico gate.

Fix richiesto:
- Rimuovere `ignoreBuildErrors` quando CI e pulita.
- In CI eseguire sempre `npm run typecheck` e `npm run lint`.

## [✅ RISOLTO] P0 - Lint fallisce nella repo

Stato:
- Risolto il 2026-05-30. Tutta la base codice (compresi file di produzione, di configurazione, e script) è stata ripulita dagli errori e warning. ESLint (`npm run lint`) ora passa con successo con 0 errori e 0 warning con il flag severo `--max-warnings=0`.

Problema:
- `npm run lint` fallisce con errori in `scratch`, `scripts` e alcuni file app.
- Esempi: `src/lib/server/pricing.ts:219`, `src/app/[locale]/shop/[prodotto]/page.tsx:143`, `src/app/sitemap-products.xml/route.ts:14`.

Impatto:
- Non c'e un gate pulito per distinguere nuove regressioni da debito esistente.

Fix richiesto:
- O escludere `scratch`/script storici dal lint, o portarli a zero errori.
- Poi rendere lint obbligatorio in CI.

## [⏳ TODO] P0 - Rate limit in-memory non distribuito

Problema:
- `src/lib/server/rateLimit.ts` usa una `Map` in-memory.
- In serverless/multi-istanza ogni istanza ha contatori separati.

Impatto:
- Limiti su login, checkout, promo e admin non sono affidabili sotto traffico distribuito.

Fix richiesto:
- Passare a Redis/Upstash o rate limit DB atomico.
- Mantenere fallback in-memory solo in sviluppo.

## [✅ RISOLTO] P0 - Contact form senza rate limit e body limit

Stato:
- Risolto il 2026-05-30. Abbiamo blindato l'endpoint `/api/contact` aggiungendo un limite massimo del payload di 10KB (`enforceBodyLimit`) e un rate limiting per IP di 5 richieste al minuto (`rateLimitOrThrow`). Abbiamo standardizzato i messaggi di errore restituiti al client in modo che siano del tutto generici ed anonimi, escludendo qualsiasi riferimento alle chiavi d'ambiente assenti.

Problema:
- `src/app/api/contact/route.ts` valida input ma non usa `rateLimitOrThrow` ne `enforceBodyLimit`.
- In caso di env mancanti ritorna errori dettagliati al client.

Impatto:
- Possibile abuso email/spam e consumo Resend.
- Leak di configurazione interna (`RESEND_API_KEY mancante`, ecc.).

Fix richiesto:
- Aggiungere rate limit per IP e body limit.
- Aggiungere honeypot o turnstile se serve.
- Restituire errori generici al client e dettagli solo nei log.

## [✅ RISOLTO] P0 - Tasting booking senza rate limit/body limit

Stato:
- Risolto il 2026-05-30. Abbiamo blindato l'endpoint `/api/tasting/book` aggiungendo un limite massimo del payload di 8KB (`enforceBodyLimit`) e un rate limiting per IP di 10 richieste al minuto (`rateLimitOrThrow`).

Problema:
- `src/app/api/tasting/book/route.ts` crea booking e sessioni Stripe senza rate limit.
- Non usa `enforceBodyLimit`.

Impatto:
- Possibile abuso creazione booking/sessioni Stripe.
- Slot bloccati da richieste automatiche.

Fix richiesto:
- Rate limit per IP/email/slot.
- Body limit.
- Cleanup automatico dei booking `PENDING` con sessione scaduta.

## [✅ RISOLTO] P1 - Tasting booking race condition sugli slot

Stato:
- Risolto il 2026-05-30. Abbiamo inserito l'intero blocco di controllo overlap e di creazione del record di booking dentro una transazione Prisma esclusiva con un lock pessimistico della tabella (`LOCK TABLE "TastingBooking" IN EXCLUSIVE MODE` in PostgreSQL), garantendo la completa atomicità e prevenendo qualsiasi doppia prenotazione simultanea per la stessa fascia oraria.

Problema:
- `src/app/api/tasting/book/route.ts` controlla overlap con `findMany`, poi crea booking.
- Non c'e vincolo DB che impedisca due create concorrenti con overlap.

Impatto:
- Due richieste simultanee possono prenotare lo stesso slot.

Fix richiesto:
- Usare transazione con lock o modello slot normalizzato con chiave unica.
- Per orari custom, creare intervalli prenotabili o una tabella lock per giorno/fascia.

## [⏳ TODO] P1 - Log e metadata includono PII

Stato parziale:
- Risolto per la route contatti il 2026-05-30: Rimosso completamente l'IP e lo User Agent dal corpo dell'email inviata all'admin da `src/app/api/contact/route.ts`.

Problema:
- `src/app/api/tasting/book/route.ts` logga email, slot e altri dettagli.
- `src/app/api/order/route.ts:175` mette `ipAddress` e `userAgent` negli eventi ordine.
- [✅ RISOLTO] `src/app/api/contact/route.ts` invia IP e UA nella mail admin.

Impatto:
- PII dispersa in log/eventi/email.
- Aumenta superficie privacy/GDPR.

Fix richiesto:
- Loggare identificativi tecnici e hash/parziali.
- Conservare PII solo dove serve operativamente.
- Definire retention.

## [⏳ TODO] P1 - Errori client troppo dettagliati

Stato parziale:
- Risolto per la route contatti il 2026-05-30: Sostituiti tutti i messaggi d'errore tecnici e di configurazione inviati al client con risposte generiche, mantenendo log di errore dettagliati esclusivamente sul lato server.

Problema:
- [✅ RISOLTO] Contact route ritorna messaggi env mancanti al browser.
- Tasting booking ritorna messaggi di errore interni in alcuni catch.

Impatto:
- Utente vede dettagli tecnici.
- Potenziale leak di configurazione.

Fix richiesto:
- Standardizzare error response pubbliche.
- Log interni con trace id, risposta client generica.

## [⏳ TODO] P1 - Outbox non protegge da job concorrenti multi-istanza

Problema:
- `src/lib/server/outbox.ts` usa `findMany` e poi `updateMany` per lock.
- Va abbastanza bene a singola DB, ma piu worker possono comunque scansionare gli stessi eventi; il lock mitiga, ma non usa `FOR UPDATE SKIP LOCKED`.

Impatto:
- Overhead e possibili casi limite in retry massivi.

Fix richiesto:
- Valutare query atomica/lock DB.
- Aggiungere test con due processori concorrenti.

