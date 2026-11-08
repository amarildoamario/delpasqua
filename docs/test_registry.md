# Registro Test E Audit

Registro centrale delle verifiche del progetto `delpasqua`. Questo file indica quali suite esistono, dove si trovano gli ultimi risultati e quando devono essere rieseguite. I report dettagliati restano nelle cartelle di origine; questo documento e` l'indice operativo autorevole.

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-11-08
- OpenItems: 3
- AgentAction: configurazione Resend ripresa e completata su richiesta dell'utente; API key valida, delpasqua.com verificato e nuovo redeploy production READY. Recapito reale da collaudare con ordine utente.
- Note: esiti utente del 2026-11-07 integrati con le verifiche agent del 2026-11-08 (lint/typecheck, 36 test server, build, PDF simulato, database e deploy). Nuovo deployment `dpl_FGyb8RqsTKnQnhH8gvHHaLFUXh5x` da working tree locale con modifiche non committate rispetto a HEAD `390a209e6955b82647251007d66f1302a5711084`; il solo SHA Git non identifica tutte le modifiche distribuite. Le verifiche locali non sostituiscono i controlli production.

## Regole Del Registro

- Non segnare `PASS` senza un'esecuzione reale completata.
- Distinguere sempre `local`, `production locale`, `preview Vercel` e `production delpasqua.com`.
- Per ogni esecuzione annotare data, commit o deployment, comando, esito e percorso del report.
- Non eseguire suite che modificano database o servizi esterni senza verificare prima ambiente e dati coinvolti.
- I test production con pagamenti, email o database reali vanno eseguiti soltanto nella finestra di collaudo concordata.
- Gli eventuali problemi trovati vanno registrati nel relativo `docs/to_do_*.md`; questo file conserva lo stato delle verifiche, non il backlog dei fix.

## Ultimi Esiti Registrati

| Area | Comando o verifica | Ambiente registrato | Ultimo esito documentato | Stato per go-live | Evidenza |
| --- | --- | --- | --- | --- | --- |
| Navigazione mobile Home/carrello/menu | `node scratch/verify-mobile-navigation.cjs`, lint e typecheck | locale, Chromium + WebKit | PASS, 2026-11-08: 8 configurazioni; menu aderente al viewport dopo resize, footer raggiungibile, X carrello 44x44px, CTA shop visibile | Implementazione verificata; collaudo iPhone fisico a cura utente | `scratch/mobile-navigation/report.json` e screenshot |
| Azzeramento avvio | `node scratch/reset-production-start.cjs --apply` | database Vercel Production `delpasqua-db` | PASS, 2026-11-08: dopo commit 0 ordini/prenotazioni/log email/outbox e 28 varianti stock 50/reserved 0 | Eseguito su richiesta esplicita utente, con backup locale escluso da Git/deploy | `scratch/production-reset-result.json` |
| TypeScript | `npm run typecheck` | locale | PASS, 2026-11-07, confermato dall'utente | Completato al 100% | Conferma utente del 2026-11-08; storico sotto |
| ESLint | `npm run lint` | locale | PASS, 2026-11-07, confermato dall'utente | Completato al 100% | Conferma utente del 2026-11-08; storico sotto |
| Test server critici | `npm run test:server` | locale | PASS, 2026-11-07, confermato dall'utente; conteggio non comunicato | Completato al 100% | Conferma utente del 2026-11-08; precedente esito: 35 test il 2026-08-18 |
| Build Next.js | `npm run build` | production locale | PASS, 2026-11-07, confermato dall'utente | Completato al 100% | Conferma utente del 2026-11-08; precedente PASS documentato il 2026-06-28 |
| Gestionale admin | `npm run test:gestionale` | locale con DB di test | PASS, 12/12 script, 2026-06-03 | Da valutare/rieseguire su ambiente sicuro | `scratch/gestionale-risultati/report.txt` |
| Audit SEO completo | `npm run seo:all` | locale | PASS, 2026-11-07, confermato dall'utente il 2026-11-08; conteggio non comunicato | Locale completato al 100%; verifica dominio finale dopo collegamento | Conferma utente; precedente report: `scratch/seo-risultati/seo-suite-report.txt` |
| Traduzioni blog | `npm run check:blog-translations` | locale | PASS, 2026-11-07, confermato dall'utente il 2026-11-08; conteggio non comunicato | Locale completato al 100%; rieseguire solo se cambiano contenuti/traduzioni | Conferma utente; storico: `docs/blog-translation-check.md` |
| Migrazione database | Prisma MCP + connessioni pg con DATABASE_URL/DIRECT_URL production | Prisma `delpasqua-db`, Frankfurt + env Vercel production | PASS, 2026-11-08: 7 migrazioni complete con timestamp corrispondenti, nessun rollback, colonne recenti presenti | Completato: storico e corrispondenza database production verificati | `scratch/database-production-check.json`; sola lettura, nessuna mutazione |
| Collaudo end-to-end | ordine, Stripe, email, stock e gestionale | production `delpasqua.com` | Non eseguito sul dominio finale | Bloccante dopo collegamento dominio | `docs/to_check_live/README.md` |

## Gate Prima Del Deploy Production

- [x] Registrare commit o stato del codice candidato al go-live: deployment CLI `dpl_FGyb8RqsTKnQnhH8gvHHaLFUXh5x`, working tree locale modificato rispetto a `390a209e6955b82647251007d66f1302a5711084` (2026-11-08).
- [x] Eseguire `npm run typecheck` e registrare l'esito: PASS del 2026-11-07, confermato dall'utente.
- [x] Eseguire `npm run lint` e registrare l'esito: PASS del 2026-11-07, confermato dall'utente.
- [x] Eseguire `npm run test:server` e registrare l'esito: tutti i test passano secondo l'utente, 2026-11-07; conteggio non comunicato.
- [x] Eseguire `npm run build` e registrare l'esito della build production locale: PASS del 2026-11-07, confermato dall'utente.
- [ ] Valutare `npm run test:gestionale` su database non production o con dati di test controllati.
- [x] Verificare lo storico migrazioni di `delpasqua-db`: 7/7 completate, nessun rollback (Prisma MCP, 2026-11-08). Corrispondenza con entrambi gli env Vercel production confermata tramite connessioni reali in sola lettura.

## Gate Dopo Il Collegamento Del Dominio

- [ ] Rieseguire l'audit SEO completo contro il dominio finale e salvare il report aggiornato.
- [ ] Completare e registrare il collaudo production definito in `docs/to_check_live/README.md`.

## Scheda Per Le Prossime Esecuzioni

Copiare una riga per ogni nuova esecuzione senza cancellare lo storico utile.

| Data | Commit/deployment | Ambiente | Test/comando | Esito | Dettagli o report | Eseguito da |
| --- | --- | --- | --- | --- | --- | --- |
| YYYY-MM-DD | commit o URL deployment | local/preview/production | comando o verifica | PASS/FAIL/PARZIALE | percorso o nota breve | nome/agent |
| 2026-11-08 | `dpl_EpRTR6dDyMGHHyTnt4n8XLWEi6ub`, working tree su HEAD `7dc8175` | production delpasqua.com, Prisma READ ONLY | Build remota, browser autenticato, export v4 e confronto ordini SQL | PASS | Conversione da Order.paidAt/sessioni, ordine test escluso; 0 pagati commerciali, 1 test pagato, 2 sessioni, 0%. Device coerenti, zero pageerror; logout eseguito. 52 test server PASS incluse vendite senza evento purchase e DST. Nessun nuovo pagamento o ordine modificato. `scratch/sales-metrics-production-verification.json` | Codex |
| 2026-11-08 | Working tree conversioni da Order.paidAt | local e database READ ONLY | lint/typecheck, 52 test server, browser metriche e confronto SQL | PASS | Due acquisti senza purchase browser conteggiati correttamente nei test export; giorni Europe/Rome/DST, ordini test, device e tempi verificati. Browser/export coerenti con 0 pagati commerciali e 1 ordine test escluso. Nessuna mutazione ordini/pagamenti. `scratch/sales-metrics-local-verification.json` | Codex |
| 2026-11-08 | `dpl_G7wcKsee4PgszDkaRNeiGPoNCr9J`, working tree su HEAD `7dc8175` | production delpasqua.com, Prisma | Build remota, browser -> API -> DB -> metriche/export, replay e cleanup | PASS | READY fra1; primo batch 6 eventi HTTP 204, tipi navigazione/prodotto persistiti prod/non-internal, replay deduplicato. Login/metriche/export 200; export KPI positivi. Zero Google/pageerror. 7 righe QA rimosse, logout eseguito, zero ordini/pagamenti creati. `scratch/analytics-production-verification.json` | Codex |
| 2026-11-08 | Working tree tracker interno Prisma | local e PostgreSQL TEMP/rollback | lint, typecheck, suite server, SQL reale e browser | PASS | 43/43 test; batch una istruzione, deduplica e verifica acquisti; browser viste/prodotto/carrello, zero heartbeat, zero Google/pageerror. Nessun dato QA permanente. Report scratch/analytics-*-verification.json | Codex |
| 2026-11-08 | Vercel Production, sorgenti analytics e database | production/read-only | Verifica flag analytics, conteggi AnalyticsEvent, cablaggio tracker e lettura grafici | FAIL raccolta metriche navigazione | AnalyticsEvent=0; ANALYTICS_DB_ENABLED assente; AnalyticsTracker non montato, track.ts solo GA4. Ordini test esclusi correttamente dalle metriche commerciali. Nessuna attivazione o modifica dati. Dettagli in docs/to_do_security_ops.md | Codex |
| 2026-11-08 | `dpl_EbeDNLkQxppQZN5cB97fyufeZCHY` | production delpasqua.com, Stripe live, Resend | Recupero ordine test pagato, correzione URL webhook e reinvio evento Stripe ufficiale | PASS | Redirect 308 eliminato dalla destinazione Stripe con slash finale; ordine TEST-08ICD5KB3V63 PAID, webhook processed, outbox done attempts=0, email sent e Resend delivered. Nessun nuovo pagamento; nessun PDF previsto per isTest=true. `scratch/order-test-email-recovery.json` | Codex |
| 2026-11-08 | `dpl_EbeDNLkQxppQZN5cB97fyufeZCHY`, commit `7dc8175412534d019ed3e24617e74a2531d3b47d` | Vercel production, fra1 | Configurazione Resend, GET /domains, controllo env in memoria, redeploy e log runtime | PASS configurazione; recapito da collaudare | Chiave sensitive valida, delpasqua.com verified; FROM ordini@delpasqua.com e REPLY_TO info@delpasqua.com corrispondono ai valori richiesti. Key/FROM su entry condivise Production/Preview/Development, reply-to solo Production. Redeploy della sorgente production esistente READY con alias delpasqua.com/www; nessun error log al controllo immediato. GET dominio 200 su Vercel. Nessun invio email/ordine/pagamento eseguito | Codex |
| 2026-11-08 | Database `delpasqua-db`, env Vercel Production | production | Impostazione autorizzata stock a 50 + verifica post-commit | PASS | 28 varianti catalogo aggiornate, 16 unita` prenotate conservate, riga tecnica non-catalogo invariata a zero. Backup precedente ignorato da Git/deploy in `archivio/magazzino/`; `scratch/production-stock-50-result.json` | Codex |
| 2026-11-08 | `dpl_HmQ96DQD6Xt8V7KxJJMwJZ4eipzC` | Vercel production, fra1 | Rotazione ADMIN_PASSWORD, redeploy, verifica login/logout e sessioni admin | PASS | 32 caratteri casuali negli env locali/Vercel sensitive; deployment READY. Login nuova password 200 con cookie, logout 200, password errata 401. Nessuna sessione precedente attiva; nessuna password/token nei report. `scratch/admin-password-verification.json` | Codex |
| 2026-11-08 | Dominio finale, dopo cambio DNS Aruba | DNS pubblici e delpasqua.com | Confronto export, query 4 nameserver autorevoli + Google/Cloudflare, API Vercel, HEAD HTTPS | PARZIALE | Record inseriti corretti e posta preservata; propagazione discordante (Google/dns3/dns4 nuovi IP, altri ancora precedenti). www riconosciuto da Vercel; apex e HTTPS finale ancora da confermare. Nessun pagamento avviato | Codex |
| 2026-11-08 | `dpl_FGyb8RqsTKnQnhH8gvHHaLFUXh5x` | Vercel production, fra1 | `vercel deploy --prod --archive=tgz`, stato e build log API, error scan runtime | PASS | READY; alias `delpasqua.vercel.app`, URL https://delpasqua-52j5w8bqw-leonardomori23-1887s-projects.vercel.app. Codice da working tree locale, incluse modifiche non committate. Build remota completata; nessun runtime error nella finestra immediatamente dopo READY, senza smoke test HTTP. Dominio finale, cron/PDF runtime e Resend ancora da collaudare | Codex |
| 2026-11-08 | Progetto Vercel `delpasqua`, env Production | Database production | `scratch/verify-production-database.cjs`, query in transazione READ ONLY | PASS | DATABASE_URL e DIRECT_URL connesse, credenziali identiche, 7 nomi/timestamp migrazioni corrispondenti a `delpasqua-db`, colonne isTest/attentionDismissedAt presenti. Nessun dato modificato o segreto salvato; `scratch/database-production-check.json` | Codex |
| 2026-11-08 | Working tree, allegato ordine e Chromium | production locale | `npm run build`, controllo tracing e protezione download PDF | PASS | 1533 pagine generate; binari Chromium e logo inclusi nelle 3 route controllate (circa 83 MB per trace), download admin senza sessione restituisce 401. Durante build un timeout Prisma sulle disponibilita` prodotto gestito dal fallback esistente. Invio reale e runtime Linux/Vercel ancora da collaudare dopo deploy | Codex |
| 2026-11-08 | Working tree, template email e allegato ordine | local, provider/DB simulati | `npm run typecheck`, `npm run lint`, `npm run test:server`, `node --import tsx scratch/verify-order-email.cjs` | PASS | 36/36 test server; HTML stampa condiviso identico a quello precedente, PDF A4 di 1 pagina verificato a vista, allegato solo ORDER_PAID commerciale, nessun allegato per ordini test/spedizioni, duplicati saltati ed errori provider riconosciuti. Zero invii reali. `scratch/email-previews/delivery-verification.json` e `output/pdf/anteprima-ordine-DP-2026-0042.pdf` | Codex |
| 2026-11-08 | Working tree, pagina anteprima email | local | `npm run lint`, `npm run typecheck`, verifica browser | PASS | Pagina semplificata, box UI con raggio 5px, template invariati; tre selezioni verificate, altezza iframe adattiva, zero pageerror e nessun overflow pagina mobile. Screenshot in `scratch/email-preview-page/` | Codex |
| 2026-11-08 | Working tree, fix GET cron | local | `npm run lint`, `npm run typecheck`, controlli autenticazione cron | PASS | Nuova verifica necessaria dopo modifica: GET/POST di entrambe le route restituiscono 401 senza token o con token errato (8 controlli); nessun job eseguito. Fix ancora da distribuire | Codex |
| 2026-11-08 | Repo HEAD `390a209e6955b82647251007d66f1302a5711084` | Prisma `delpasqua-db` | SELECT migration_name, finished_at, rolled_back_at da `_prisma_migrations` | PASS | 7/7 migrazioni completate, nessun rollback, incluse flag ordini test e attention acknowledgement. Sola lettura tramite Prisma MCP dopo approvazione | Codex |
| 2026-11-07 | Codice locale collaudato dall'utente | local | Traduzioni, SEO e altri test locali | PASS | Conferma utente del 2026-11-08; nessun nuovo log o conteggio allegato. Audit sul dominio finale ancora da effettuare | Utente |
| 2026-11-07 | Codice locale collaudato dall'utente; hash non comunicato | local / production locale per build | Gate locali: typecheck, lint, test server e build | PASS | Conferma utente del 2026-11-08: test eseguiti ieri sera, tutto funzionante; fase test locali completata al 100%. Nessuna nuova esecuzione agent, log o conteggio allegato | Utente |
| 2026-11-07 | Working tree, secondo aumento scala bottiglie | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning | Codex |
| 2026-11-07 | Working tree, secondo aumento scala bottiglie | local | Controllo browser shop e suggerimenti olio-toscano | PASS | Bottiglie dal 80% al 84%, aromatizzati dal 76% al 80%; quattro viste desktop/mobile con prodotto entro i bordi. `scratch/bottle-card-scale-v2/report.json` e screenshot | Codex |
| 2026-11-07 | Working tree, scala bottiglie nelle card | local | `npm run lint`, `npm run typecheck` e verifica browser della scala foto | PASS | Bottiglie 80%, aromatizzati 76%; home/shop e tre landing controllate su desktop/mobile, scheda EVO ancora intera. Report e screenshot in `scratch/evo-photo-framing/` e `scratch/bottle-card-scale/` | Codex |
| 2026-11-07 | Working tree, inquadratura EVO e suggerimenti landing | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning dopo le modifiche finali | Codex |
| 2026-11-07 | Working tree, inquadratura EVO e suggerimenti landing | local | `node scratch/verify-evo-photo-framing.cjs` | PASS | 8 viste desktop/mobile: EVO 500 ml intera con margine; suggerimenti di olio-toscano, olio-biologico e nuovo-raccolto con sfondo bianco e scala condivisa. Nessun pageerror o overflow. `scratch/evo-photo-framing/report.json` e screenshot | Codex |
| 2026-11-07 | Working tree, pulizia cartella prodotti | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning dopo l'aggiornamento delle riscritture | Codex |
| 2026-11-07 | Working tree, pulizia cartella prodotti | local | `node scratch/verify-product-cleanup.cjs` | PASS | 27 immagini in `public/products`, 29 URL attivi e 9 URL storici verificati; home/shop/schede senza immagini rotte o pageerror. Hash di 296 file archiviati e 27 immagini conservate verificati. Report in `archivio/immagini-prodotti/2026-11-07-pulizia/` | Codex |
| 2026-11-07 | Working tree, carrello laterale e rifiniture shop | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori e 0 warning, dopo le modifiche finali | Codex |
| 2026-11-07 | Working tree, carrello laterale e rifiniture shop | local | `node scratch/verify-cart-drawer-regression.cjs` | PASS | Bug riprodotto prima della correzione; dopo il fix passano rimozioni multiple, reinserimento, reload e reinserimento dopo svuotamento. `scratch/ux-refinements/cart-regression.json` | Codex |
| 2026-11-07 | Working tree, carrello laterale e rifiniture shop | local | `node scratch/verify-shop-ux.cjs` e `node --import tsx --test src/lib/server/cartNormalization.test.ts` | PASS | Titoli home/shop coerenti con profilo fruttato, hover di 2 px, animazioni da sinistra progressive e ripetibili, supporto movimento ridotto; 3 test normalizzazione passati. `scratch/ux-refinements/shop-menu-verification.json` e screenshot | Codex |
| 2026-11-07 | Working tree, nomi oli e home | local | `npm run lint`, `npm run typecheck`, `node --import tsx --test src/lib/homeMerch.test.ts` | PASS | 0 errori/warning, 2 test ordinamento passati | Codex |
| 2026-11-07 | Working tree, nomi oli e home | local + database configurato | Audit catalogo/inventario e `node scratch/verify-catalog-brands.cjs` | PASS | 28 SKU presenti, foto esistenti, chiavi/prezzi conservati, 8 traduzioni allineate, cambi formato, home desktop/mobile e collegamento EVO 750 ml. `archivio/immagini-prodotti/2026-11-07-catalogo/verifica.json` | Codex |
| 2026-11-07 | Working tree, correzione immagini EVO | local | `npm run lint` e `npm run typecheck` | PASS | 0 errori; ESLint senza warning | Codex |
| 2026-11-07 | Working tree, correzione immagini EVO | local, localhost:3000 | `node scratch/verify-evo-images.cjs` | PASS | Quattro formati selezionabili, sei URL precedenti identici ai nuovi asset, pagina 5 L, mobile senza overflow, nessun pageerror. `archivio/immagini-prodotti/2026-11-07-evo/verifica.json` e screenshot | Codex |

## Ordine Consigliato

1. [RISOLTO - 100%] Piano Starter e fatturazione Vercel verificati il 2026-11-08; regione Frankfurt e backup disponibili.
2. [RISOLTO - 100%] Test locali del 2026-11-07 positivi, confermati dall'utente il 2026-11-08.
3. Verificare migrazioni e variabili production senza riportare segreti nei file.
4. Fare deploy production e collegare il dominio.
5. Eseguire smoke test pubblico e audit SEO sul dominio finale.
6. Configurare e verificare Stripe e Resend.
7. Attivare `?test_mode=1`, eseguire un ordine reale controllato e verificare tutti gli effetti nel gestionale senza alimentare GA4.
8. Disattivare il prodotto test e ripetere i controlli di esposizione pubblica.
9. Disattivare la modalita` interna con `?test_mode=0` e monitorare production per almeno 48 ore.
