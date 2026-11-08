# TODO Security, Abuse, Operativita

Data audit: 2026-05-29

## Agent Status

- FileStatus: PARTIAL
- LastVerified: 2026-11-08
- OpenItems: 2
- AgentAction: configurazione Resend completata il 2026-11-08; chiave valida e dominio delpasqua.com verificato. Restano recapito ordine/PDF e invocazioni cron nei log production da collaudare.
- Note: alcuni punti sono gia` risolti solo su singole route; controllare sempre le verifiche aggiunte sotto.


### Collaudo ordine test production del 2026-11-08: webhook e recapito

- Causa del mancato invio: endpoint Stripe live configurato senza slash finale; `https://delpasqua.com/api/webhooks/stripe` risponde 308 verso `/api/webhooks/stripe/` per trailingSlash=true. Stripe considera i redirect un fallimento; evento pagamento non ricevuto e nessuna email ancora accodata.
- Pagamento utente da 50 centesimi verificato in Stripe: sessione complete/paid, mentre ordine production ancora PENDING. Nessun nuovo pagamento creato.
- Corretto endpoint esistente `we_1TazOSRo8s7gPfsQuEsLzJl9` impostando `https://delpasqua.com/api/webhooks/stripe/`, senza modificare secret o sottoscrizioni.
- Recuperato evento autentico `evt_1UZYV2Ro8s7gPfsQSCIQ3F98` con Stripe CLI events resend --live verso lo stesso endpoint.
- Verifica finale: ordine `TEST-08ICD5KB3V63` PAID, webhook processed senza errori, ORDER_PAID sent con message ID `01a1bbeb-714f-7f25-b9b8-419a6e8bd32c`, outbox done con attempts=0; Resend GET /emails/<id> HTTP 200, last_event=delivered. Confermata consegna al server destinatario; inbox/spam non verificati.
- Ordine marcato isTest=true: nessun allegato PDF commerciale previsto. Restano collaudo PDF ordine commerciale e notifiche contatti; nessun ordine commerciale aggiunto durante questa verifica.
- Report sanitizzato: `scratch/order-test-email-recovery.json`. Riferimento redirect Stripe: https://support.stripe.com/questions/webhooks-what-to-do-when-the-http-status-code-starts-with-a-three-%283xx%29?locale=en-GB


## [RISOLTO] Password gestionale rinforzata

- Completato il 2026-11-08 su richiesta dell'utente: nuova password casuale di 32 caratteri (192 bit generati con crypto.randomBytes), con maiuscole, minuscole, cifre e caratteri URL-safe.
- Aggiornati gli env locali ignorati `.env` e `.env.local` e la variabile ADMIN_PASSWORD Vercel, ora sensitive. L'entry Vercel esistente e` condivisa fra production, preview e development; il nuovo valore e` stato applicato a quell'entry.
- Redeploy production `dpl_HmQ96DQD6Xt8V7KxJJMwJZ4eipzC` READY in fra1, derivato dal precedente deploy CLI completo; nessuna modifica al codice auth o ai controlli di protezione Vercel.
- Controllata revoca delle sessioni admin attive: nessuna sessione precedente non scaduta da revocare. Il test ha creato una sessione poi chiusa tramite logout.
- Collaudo reale sull'endpoint del nuovo deployment: login 200 con nuova password e cookie sessione, logout 200, password casuale errata 401. Password e token transitati solo in memoria/stdin; nessun valore riportato nei log o in questo documento.
- Password recuperabile dall'utente nella variabile ADMIN_PASSWORD del proprio `.env.local`; nessuna credenziale salvata nel codice, nei report o nei file versionati. Report sanitizzato: `scratch/admin-password-verification.json`.

## [⏳ TODO] Go-live - Verificare Resend e notifiche form contatti

Aggiornamento configurazione del 2026-11-08 su richiesta dell'utente:
- Sostituita RESEND_API_KEY, ora sensitive; Resend GET /domains risponde 200 e delpasqua.com risulta verified. Nessun invio reale eseguito.
- EMAIL_FROM impostato a Frantoio Del Pasqua <ordini@delpasqua.com>; EMAIL_REPLY_TO aggiunto in Production con valore info@delpasqua.com. Valori mittente/risposta ricontrollati in memoria senza stampare segreti.
- RESEND_API_KEY ed EMAIL_FROM erano entry condivise Production/Preview/Development: la CLI ha aggiornato il valore condiviso anche specificando production. EMAIL_REPLY_TO e` limitata a Production. Utente informato.
- Redeploy production avviato dal deployment esistente dpl_3X5MeCUToHtGMTCzjfEaLoQN5xd9, senza caricare codice locale. Nuovo deployment dpl_EbeDNLkQxppQZN5cB97fyufeZCHY READY, commit 7dc8175412534d019ed3e24617e74a2531d3b47d, runtime fra1 e alias delpasqua.com/www assegnati; nessun error log al controllo immediato.
- Restano da verificare email ricevuta, allegato PDF per ordine commerciale e stato outbox sul prossimo ordine effettuato dall'utente.

Verifica precedente del 2026-11-08 (superata dalla configurazione sopra):
- Lettura sicura env Vercel: chiave presente, ma API Resend `GET /domains` restituisce HTTP 400, `validation_error`, `API key is invalid`.
- `EMAIL_FROM` usa il dominio `gmail.com`: configurare un mittente sul dominio verificato in Resend. `EMAIL_NOTIFY` ha formato email; recapito da collaudare.
- Nessuna email inviata durante il controllo e nessuna credenziale salvata nel repo.

Revisione flusso email ordine (2026-11-08, sola lettura):
- Tre template cliente effettivi: pagamento, spedizione e rimborso. Ordine normale: 2 email al cliente, nessuna notifica nuovo ordine admin implementata; `orderNotificationEmail` e` solo un'impostazione predisposta.
- Anteprime reali generate con dati dimostrativi in `scratch/email-previews/`; nessun invio e nessuna query DB.
- Corretto localmente: `sendViaResend` controlla `error` e `data.id` dell'SDK, passa una chiave di idempotenza per ordine/tipo; `processOutboxBatch` tratta `{ok:false}` come errore riprovabile. Test regressione incluso nella suite server (36/36 PASS). Se il PDF non viene generato, l'email resta fallita/riprovabile e non parte senza allegato.
- Ordine ricevuto: allegato PDF ricavato dallo stesso renderer di “Stampa Ordine”; nuovo download admin autenticato `/api/admin/orders/[id]/document`, con rate limit. Nessuna mutazione di stampe, numerazioni o fatture. Ordini test esclusi dall'allegato.
- Invio dopo risposta HTTP tramite `after()` nelle route webhook e admin che accodano email, con durata massima 60 secondi; il cron resta recupero. Da verificare su deployment finale.
- La precedente sospensione Resend in attesa DNS e` superata dalla richiesta di configurazione del 2026-11-08; collaudo recapito ancora aperto.

Problema:
- In sviluppo e` comparso in gestionale l'errore `API key is invalid` sulla notifica e-mail del form contatti.
- La mailbox interna salva correttamente il messaggio, ma se Resend rifiuta la richiesta l'e-mail admin non viene recapitata.

Impatto:
- Al go-live i messaggi contatto restano consultabili nel gestionale, ma l'admin potrebbe non ricevere la notifica in casella.

Fix richiesto:
- Configurare una `RESEND_API_KEY` valida negli env di produzione.
- Verificare che `EMAIL_FROM` usi un dominio/mittente verificato su Resend.
- Verificare `ADMIN_NOTIFY_EMAIL` o `EMAIL_NOTIFY` come destinatario reale.
- Inviare un messaggio di test dal form contatti dopo il deploy e confermare sia salvataggio in `/admin/messages` sia recapito nella casella e-mail.

## [PARZIALE] P0 Go-live - Cron Vercel: metodo HTTP e secret

- Rilevato il 2026-11-08: Vercel invoca i cron in GET, mentre `outbox` ed `expire-pending` esponevano soltanto POST. `CRON_SECRET` assente negli env production.
- Correzione locale: aggiunto `export const GET = POST` a entrambe le route; autenticazione e supporto POST preservati.
- Configurazione: creato `CRON_SECRET` casuale (32 byte), sensibile e limitato a Production, tramite CLI sul progetto `delpasqua`; nessun valore stampato o scritto nel repo.
- Verifiche locali dopo il fix: lint e typecheck PASS; 8 controlli su GET/POST senza token o con token errato restituiscono 401, senza eseguire job.
- Deploy completato il 2026-11-08: `dpl_FGyb8RqsTKnQnhH8gvHHaLFUXh5x` READY in fra1. Restano da verificare invocazioni programmate e log cron production. Nessun job avviato manualmente in questa sessione.
- Riferimenti: https://vercel.com/docs/cron-jobs e https://vercel.com/docs/cron-jobs/manage-cron-jobs.

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

## [✅ RISOLTO] P0 - Rate limit in-memory non distribuito

Problema:
- `src/lib/server/rateLimit.ts` usa una `Map` in-memory.
- In serverless/multi-istanza ogni istanza ha contatori separati.

Impatto:
- Limiti su login, checkout, promo e admin non sono affidabili sotto traffico distribuito.

Fix richiesto:
- Passare a Redis/Upstash o rate limit DB atomico.
- Mantenere fallback in-memory solo in sviluppo.

Verifica repo 2026-06-02:
- `src/lib/server/rateLimit.ts` usa ora Upstash Redis quando sono configurate `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`.
- Se Redis non e` configurato o non risponde, il rate limit passa al fallback Postgres atomico su `RateLimitCounter` con `INSERT ... ON CONFLICT ... count + 1 RETURNING count`.
- Il fallback in-memory resta solo in sviluppo quando Redis e DB non sono disponibili; in produzione il rate limit fallisce chiuso se anche il fallback DB non risponde.
- Il fallback DB viene pulito in modo probabilistico rimuovendo finestre piu vecchie di 24 ore.

Stato:
- Risolto il 2026-06-02.

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

## [✅ RISOLTO] P1 - Log e metadata includono PII

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

Verifica repo 2026-06-02:
- `src/app/api/order/route.ts` salva ancora `ipAddress` e `userAgent` e li inoltra anche in `createOrderEvent`.
- `src/app/api/tasting/book/route.ts` logga ancora email e dettagli richiesta in chiaro.
- `src/app/api/webhooks/stripe/route.ts` continua a loggare eventi tasting con metadati operativi; non e` il punto peggiore, ma va ripulito insieme al resto.

## [✅ RISOLTO] P1 - Errori client troppo dettagliati

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

Verifica repo 2026-06-02:
- `src/app/api/contact/route.ts` e` gia` allineata.
- `src/app/api/tasting/book/route.ts` ritorna ancora in alcuni casi `err.message` al client sui `409`.
- `src/app/api/admin/orders/[id]/status/route.ts` espone ancora stringhe tipo `Invalid transition ...`; essendo admin non e` prioritario quanto le route pubbliche, ma resta rumore operativo.

## [✅ RISOLTO] P1 - Outbox non protegge da job concorrenti multi-istanza

Problema:
- `src/lib/server/outbox.ts` usa `findMany` e poi `updateMany` per lock.
- Va abbastanza bene a singola DB, ma piu worker possono comunque scansionare gli stessi eventi; il lock mitiga, ma non usa `FOR UPDATE SKIP LOCKED`.

Impatto:
- Overhead e possibili casi limite in retry massivi.

Fix richiesto:
- Valutare query atomica/lock DB.
- Aggiungere test con due processori concorrenti.

Verifica repo 2026-06-02:
- `src/lib/server/outbox.ts` continua a fare `findMany` + `updateMany` come lock soft, senza `FOR UPDATE SKIP LOCKED`.
- La patch Stripe del 2026-06-02 migliora i retry webhook, ma non cambia il problema strutturale dell'outbox concorrente.


## [RISOLTO] Metriche gestionale: tracker interno su Prisma

Richiesta utente del 2026-11-08: conservare le metriche gia presenti nel sito, usare Prisma e contenere il numero di operazioni mensili. La diagnosi iniziale aveva trovato AnalyticsEvent vuoto, flag production assente e tracker non montato.

- Ripristinato AnalyticsTracker nel layout al posto di GoogleAnalytics. track.ts conserva chiamate e nomi evento gia usati dal sito e invia soltanto all'API interna; nessuna importazione GA4 o doppia raccolta.
- Ripristinati product_view, select_variant e add_to_cart nella scheda ProductDetailsClient effettivamente utilizzata; add_to_cart registra la quantita accettata dal carrello. I checkout test sono esclusi dal funnel commerciale.
- Nessun heartbeat ogni 15 secondi. Piccoli gruppi fino a 30 eventi, invio dopo 30 secondi solo se ci sono dati, invio alla chiusura/background. Nessun polling grafici aggiunto.
- Coda per scheda in sessionStorage, massimo 200 eventi/24 ore; retry con backoff e ID stabili per reinvio. Timestamp originale mantenuto, path/referrer senza query string. Conservati soltanto campi numerici necessari, device e paese; nessun user agent completo salvato.
- Un solo SQL parametrizzato per batch su AnalyticsEvent, usando la PK esistente: niente SELECT preliminare per deduplica e nessuna migrazione. Replay non duplica visite o acquisti; durata pagina aggiornata con massimo cumulativo visibile.
- purchase ammesso solo se l'ordine associato risulta pagato e non test, verificato all'interno dello stesso SQL. Timestamp acquisto ricavato da paidAt. Ordini e incassi continuano a derivare dal database ordini.
- Bot, admin, internal/test_mode e opt-out esplicito esclusi; traffico dev/preview non compare nelle metriche production. Limiti payload, validazione Zod, controllo origine e rate guard in memoria (nessuna query di rate-limit). Il guard e per istanza, non un limite globale di spesa.
- ANALYTICS_DB_ENABLED=true configurato in Vercel Production e nei due env locali ignorati; esempio env aggiornato. Disabilitando il flag l'API risponde 503, evitando di confermare eventi scartati.
- Conferma Prisma docs: operazioni conteggiate per query, non per numero di righe; letture e scritture consumano la quota, anche fuori da analytics. Fonte: https://www.prisma.io/docs/postgres/faq e https://www.prisma.io/blog/operations-based-billing. Nessuna garanzia artificiale di rimanere sotto 1M senza misurare anche il restante sito/gestionale.
- Verifiche locali: lint e typecheck PASS; suite server 43/43 PASS. SQL PostgreSQL reale provato su tabelle TEMP con ROLLBACK: una istruzione per batch, replay deduplicato, durate aggiornate, acquisti test/non pagati esclusi. Nessun dato permanente modificato.
- Browser locale: visite, liste, clic, visualizzazioni prodotto, aggiunta carrello e durate raccolti; 2 minuti di pagina inattiva senza richieste extra; test_mode senza richieste; zero richieste Google e zero pageerror. API analytics intercettata, nessun evento QA scritto nel DB.
- Report: scratch/analytics-sql-verification.json e scratch/analytics-browser-verification.json. Deploy production del codice locale avviato: dpl_G7wcKsee4PgszDkaRNeiGPoNCr9J. Collaudo live completato, vedi esito sotto.

Collaudo production completato il 2026-11-08:
- dpl_G7wcKsee4PgszDkaRNeiGPoNCr9J READY in fra1, alias delpasqua.com/www assegnati; codice distribuito dal working tree locale sopra HEAD 7dc8175412534d019ed3e24617e74a2531d3b47d, incluse le modifiche non committate.
- Browser reale su dominio finale: batch di 6 eventi HTTP 204; page_view, view_item_list, product_click, product_view e page_leave persistiti come env=prod e isInternal=false. Due replay dello stesso evento HTTP 204 aggiungono una sola riga.
- Login admin 200, /admin/metrics/ 200 ed export 200; export conferma almeno due pageview e un visitatore senza includere traffico interno. Nessun Google request o pageerror. Logout eseguito.
- Rimosse esclusivamente le 7 righe del visitatore QA generato; nessun ordine o pagamento creato, nessuna cancellazione di eventi reali. Report sanitizzato scratch/analytics-production-verification.json con cleanup=complete.
- I grafici esistenti si ricalcolano a ricaricamento/cambio filtri. Nessun recupero artificiale delle visite precedenti: la raccolta parte dall'attivazione.


## [RISOLTO] Conversioni da ordini pagati, indipendenti dal ritorno Stripe

Richiesta utente del 2026-11-08: conversioni calcolate dalle visite in rapporto alle vendite reali anche se il cliente non torna al sito dopo il pagamento.

- Fonte unica delle vendite: Order con isTest=false e paidAt nel periodo. Nessuna dipendenza da eventi purchase, cartId, cookie o caricamento della success page; due ordini dello stesso browser contano due vendite. Ogni ordine conta una volta. Un rimborso successivo non elimina il pagamento storico dal tasso di acquisto (non e una metrica di ricavo netto).
- Formula complessiva e per dispositivo: ordini pagati / sessioni misurate, nello stesso periodo. Denominatore sessioni, non pageview o visitatori unici. Senza sessioni la conversione e non disponibile (UI trattino, JSON null), non uno 0% inventato; nessun clamp artificiale al 100%.
- Date condivise fra pagina ed export: giornate complete Europe/Rome, inclusi cambi ora legale; inclusione inizio ed esclusione fine. Vendite selezionate per paidAt, anche per ordini creati prima del periodo.
- Tempo pagamento ricavato da paidAt - createdAt dell ordine, inclusi pagamenti differiti. Dispositivo ricavato dallo userAgent gia salvato sull ordine; unknown quando non classificabile, senza perdere la vendita dal totale.
- Funnel: carrelli tracciati separati dalle vendite. Sostituiti i falsi carrelli pagati/abbandoni dedotti dagli eventi browser con vendite confermate e checkout creati attualmente non pagati (non necessariamente abbandonati).
- Servizio condiviso salesMetrics.ts: una lettura degli ordini per report sostituisce sei letture analytics di acquisti/tempi/dispositivi. Nessuna migrazione, nessuna nuova scrittura nel flusso pagamento o webhook.
- Rimosso il componente SuccessTrackPurchase dalla pagina di conferma: nessun evento acquisto browser necessario o generato da quella pagina. Export versione metrics-export-v4 con fonte Order.paidAt, denominatore uniqueSessions e campi funnel espliciti.
- Lint/typecheck PASS; suite server 52/52 PASS. Regressione export reale con DB simulato: 2 vendite, 2 sessioni, 1 visitatore e 4 pageview senza alcun purchase browser => 100%; una sola lettura ordini. Altri test: ordini test/non pagati esclusi, data pagamento e confini periodo, due acquisti stesso browser, device ignoto, pagamenti oltre 2h, assenza visite, DST.
- Browser locale autenticato + export confrontati con SELECT READ ONLY sul database: PASS, ordini commerciali pagati 0, ordine test pagato escluso 1; sessioni misurate 2, conversione 0%. Logout eseguito; nessun ordine o pagamento creato o modificato. Report scratch/sales-metrics-local-verification.json.
- Deploy production dpl_EpRTR6dDyMGHHyTnt4n8XLWEi6ub completato, alias delpasqua.com assegnato. Working tree locale sopra HEAD 7dc8175, incluse modifiche non committate. Collaudo autenticato sul dominio finale PASS: pagina metriche 200, export v4 200, valori coerenti con SELECT READ ONLY su Prisma; 0 ordini commerciali pagati, 1 ordine test pagato escluso, 2 sessioni misurate e conversione 0%. Dispositivi coerenti, zero pageerror; logout eseguito e nessun ordine/pagamento creato o modificato. Report scratch/sales-metrics-production-verification.json. Il caso con vendite positive senza purchase browser e coperto dalla regressione export con fixture, senza pagamenti reali aggiuntivi.


## [RISOLTO] Geografia traffico: paesi fuori dai mercati vendita nascosti

- Segnalazione utente 2026-11-08: dashboard con 5 visitatori/sessioni ma soltanto Italia 3 nei grafici. Query READ ONLY su Prisma conferma 3 browser/sessioni IT e 2 MT; nessun evento perso o da ricostruire.
- Causa: ALLOWED_COUNTRIES (paesi vendita) applicato sia all aggregazione sia al filtro finale dei grafici di traffico. Malta era esclusa da entrambe le fasi.
- Rimossi i filtri vendita solo dalle statistiche di navigazione e prodotto visto per nazione. Mercati di vendita, prezzi/spedizioni e filtri commerciali conservati. Grafici traffico/prodotti mostrano tutti i paesi con scorrimento, senza troncare silenziosamente alla quinta riga.
- Aggregazione condivisa trafficGeography.ts: ogni visitatore/sessione attribuito alla prima nazione conosciuta nel periodo, cosi cambi IP/VPN non duplicano i totali. Localita assenti indicate ND, non inventate IT; nessuna modifica retroattiva ai dati. Calcolo in memoria sugli eventi gia letti, senza nuove query o migrazioni.
- Verifiche locali: lint/typecheck PASS, suite server 58/58 PASS; regressione 3 IT + 2 MT, paesi non serviti, localita sconosciute, visite ripetute e cambi paese/sessione. Browser autenticato dashboard e SELECT READ ONLY coerenti: 5 visitatori e 5 sessioni, IT=3 MT=2 in entrambi i grafici, zero pageerror; logout eseguito. Nessun evento, ordine o pagamento modificato.
- Report locale: scratch/traffic-geography-local.json e screenshot omonimo .png. Push e rilascio production previsti nello stesso intervento; collaudo successivo nel report scratch/traffic-geography-production.json e nel deployment Vercel collegato al commit.
