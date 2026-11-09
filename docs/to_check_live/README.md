# To Check Live

Checklist operativa per il go-live di `delpasqua.com`.

Questo non e` un backlog tecnico: contiene verifiche manuali o semi-manuali da fare prima, durante e subito dopo la messa online. I fix di codice restano nei file `docs/to_do_*.md`.

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-11-08
- OpenItems: 65
- AgentAction: utente ha aggiornato correttamente i record web Aruba; propagazione in corso con risposte discordanti fra nameserver/resolver. Non ripetere modifiche DNS; ricontrollare allineamento e certificato HTTPS prima di segnare dominio live. Resend resta aperto.
- Note: il 2026-08-05 `delpasqua.com` punta ancora al sito WordPress e `/api/webhooks/stripe` restituisce 404. La route della nuova app e` invece presente su `delpasqua.vercel.app` (GET restituisce 405, coerente con una route POST-only). Le attivita` Stripe live dipendenti dal dominio restano intenzionalmente non spuntate. Lasciare questo file in `docs` anche quando alcune sezioni saranno chiuse; spostamenti o archiviazioni si decidono dopo il go-live.


### Collaudo ordine test production del 2026-11-08: webhook e recapito

- Causa del mancato invio: endpoint Stripe live configurato senza slash finale; `https://delpasqua.com/api/webhooks/stripe` risponde 308 verso `/api/webhooks/stripe/` per trailingSlash=true. Stripe considera i redirect un fallimento; evento pagamento non ricevuto e nessuna email ancora accodata.
- Pagamento utente da 50 centesimi verificato in Stripe: sessione complete/paid, mentre ordine production ancora PENDING. Nessun nuovo pagamento creato.
- Corretto endpoint esistente `we_1TazOSRo8s7gPfsQuEsLzJl9` impostando `https://delpasqua.com/api/webhooks/stripe/`, senza modificare secret o sottoscrizioni.
- Recuperato evento autentico `evt_1UZYV2Ro8s7gPfsQSCIQ3F98` con Stripe CLI events resend --live verso lo stesso endpoint.
- Verifica finale: ordine `TEST-08ICD5KB3V63` PAID, webhook processed senza errori, ORDER_PAID sent con message ID `01a1bbeb-714f-7f25-b9b8-419a6e8bd32c`, outbox done con attempts=0; Resend GET /emails/<id> HTTP 200, last_event=delivered. Confermata consegna al server destinatario; inbox/spam non verificati.
- Ordine marcato isTest=true: nessun allegato PDF commerciale previsto. Restano collaudo PDF ordine commerciale e notifiche contatti; nessun ordine commerciale aggiunto durante questa verifica.
- Report sanitizzato: `scratch/order-test-email-recovery.json`. Riferimento redirect Stripe: https://support.stripe.com/questions/webhooks-what-to-do-when-the-http-status-code-starts-with-a-three-%283xx%29?locale=en-GB


## Regole d'uso

### Verifiche del 2026-11-08

- Analisi traffico pre-lancio e baseline Search Console (08/11/2026): esportata e archiviata in `Analisi traffico Pre-Lancio/delpasqua.com-Performance-on-Search-2026-11-09.xlsx` e documentata in `Analisi traffico Pre-Lancio/README.md`. Copre il periodo 09/07/2025 - 07/11/2026 del vecchio sito WordPress (722 clic, 11.674 impressioni, CTR 6,18%, pos. 8,8). Nel file Excel e nella documentazione sono salvati come riferimento ufficiale la data del 08/11/2026 e il primo commit / push GitHub con dominio attaccato per il lancio: `de4e3b1` (deploy Vercel `dpl_whwcDUpJhzo9wKsNHV94NAYYccvw` su `delpasqua.com`), preceduto da `b02a3b4` (cutover DNS Aruba).

- Rilascio completo richiesto dall utente: foto reale della vendemmia in HomeProductShowcase con sfumatura desktop per la leggibilita; prodotto-test non pubblicato/non acquistabile tramite i flag esistenti, conservando record e storico. Verifica locale desktop/mobile senza overflow, shop italiano/inglese e home senza link test, API products/catalog filtrate, PDP test 404; lint/typecheck PASS. Codice e verifiche precedenti di tracker/conversioni inclusi nel medesimo push su main. Il controllo di produzione successivo al push viene registrato nel report locale scratch/final-release-verification.json e nello stato deployment Vercel associato al commit.

- Conversioni corrette e collaudate online: vendite commerciali da Order.paidAt / sessioni misurate nello stesso periodo Europe/Rome. Nessuna dipendenza dal ritorno Stripe o da eventi purchase browser; componente success eliminato. Fonte condivisa per pagina, dispositivi, tempo pagamento ed export v4. dpl_EpRTR6dDyMGHHyTnt4n8XLWEi6ub pubblicato su delpasqua.com; 52 test e confronto browser/export/SQL PASS, ordine test escluso e nessuna mutazione ordini/pagamenti. Report scratch/sales-metrics-production-verification.json.

- Metriche sito ripristinate su tracker interno Prisma, mantenendo grafici e nomi evento esistenti. GoogleAnalytics non montato; heartbeat rimosso, batch fino a 30 eventi con un solo SQL e deduplica. ANALYTICS_DB_ENABLED=true in Production. Deploy dpl_G7wcKsee4PgszDkaRNeiGPoNCr9J READY fra1; browser/API/DB/metriche/export collaudati con successo. Eventi QA eliminati selettivamente (7 righe), nessun pagamento/ordine creato. Lint/typecheck e 43 test server PASS. Raccolta valida da attivazione, nessun backfill visite precedenti. Dettagli in docs/to_do_security_ops.md e report scratch/analytics-production-verification.json.

- Aggiornamento Resend: nuova API key valida (GET /domains 200), delpasqua.com verified; EMAIL_FROM ordini@delpasqua.com con nome Frantoio Del Pasqua ed EMAIL_REPLY_TO info@delpasqua.com configurati. Key sensitive; key/mittente su entry Vercel condivise Production/Preview/Development, reply-to solo Production. Redeploy dpl_EbeDNLkQxppQZN5cB97fyufeZCHY READY, alias delpasqua.com/www assegnati e nessun error log al controllo immediato. GET https://delpasqua.com/ risponde 200 con header Vercel dal resolver corrente; questo controllo non certifica tutti i resolver DNS. Nessun invio email/ordine/pagamento eseguito: collaudo recapito ancora aperto, sospensione Resend superata dalla nuova richiesta utente.

- Isolamento ambiente locale: confronto degli env risolti da Next in development con DATABASE_URL Vercel Production conferma stesso host, porta, database, utente e password (confrontati in memoria, non riportati). Le URL grezze differiscono ma le componenti di connessione coincidono. Il sito localhost usa quindi lo stesso Postgres production; carrello browser locale, ordini e annullamenti persistono nel database condiviso. Non considerare i test locali di checkout isolati dai dati production; nessun ordine modificato durante questa verifica.

- Password gestionale: sostituita con valore casuale di 32 caratteri negli env locali ignorati e in Vercel sensitive. Nuovo redeploy production `dpl_HmQ96DQD6Xt8V7KxJJMwJZ4eipzC` READY in fra1, alias delpasqua.com/www/delpasqua.vercel.app. Login reale con nuova password 200, logout 200, password errata 401; nessuna sessione admin precedente attiva. Questo verifica l'autenticazione del deployment, non certifica l'allineamento DNS/HTTPS del dominio finale. Nessuna password riportata nei documenti.

- Backup DNS precedente fornito dall'utente archiviato localmente in `archivio/dns/2026-11-08-pre-vercel/dnsrecords_export.txt`, originale invariato e SHA-256 verificato. Cartella e nuovi export alla radice esclusi da Git e Vercel. Nella stessa cartella: istruzioni di ripristino e manifest integrita`. Per tornare al vecchio sito ripristinare gli A apex/www a `35.214.242.117`, mantenendo disponibile il vecchio hosting WordPress; questo backup non include file/database WordPress. Nessun DNS modificato durante l'archiviazione.

- Dominio: configurazione precedente con apex/www A `35.214.242.117`, senza AAAA rilevati. L'utente ha ora fornito export aggiornato con A apex `216.150.1.1` e `216.150.16.1`, CNAME www `f1f4340baefc8370.vercel-dns-017.com.`: valori corretti. Nameserver e posta invariati (MX `mx.delpasqua.com`, priorita` 10; SPF Aruba e verifica Google presenti).
- Vercel: aggiunti `delpasqua.com` e `www.delpasqua.com` al progetto `delpasqua`; ownership verified=true per entrambi. Impostato redirect permanente 308 da www ad apex, coerente con SITE_URL. Ownership verificata non significa DNS/HTTPS pronti: aggiornamento Aruba applicato dall'utente, propagazione ancora da completare.
- Record consigliati restituiti dall'API Vercel per il progetto: A apex `216.150.1.1` e `216.150.16.1`; CNAME www `f1f4340baefc8370.vercel-dns-017.com.`. Ri-verificare configurazione Vercel prima di applicare. Nessun DNS Aruba modificato dall'agent.
- Controllo successivo al cambio: `dns3.arubadns.net`, `dns4.arubadns.cz` e Google DNS 8.8.8.8 rispondono gia` con i nuovi A; dns.technorail.com, dns2.technorail.com e Cloudflare 1.1.1.1 rispondono ancora col vecchio IP o con cache intermedia. CNAME www gia` visibile su piu` server. Vercel riconosce www come configurato, apex ancora misconfigured. Richieste HTTPS con resolver locale servono ancora WordPress; connessione TLS forzata ai nuovi IP non ancora riuscita. Dominio/HTTPS NON segnati completati; nessun ordine reale avviato.

- API Vercel via CLI autenticata: integrazione Prisma Marketplace con `vendorBillingPlan.id: starter`, nome Starter, costo dichiarato `$10/month + usage`; 1M operazioni/mese incluse poi $8/milione, 10 GB inclusi poi $2/GB. Billing gestito tramite Vercel. Metodo di pagamento e avvisi non verificati. Il connettore Vercel aveva restituito 403 sulla stessa lettura; fallback CLI riuscito.
- Prisma MCP: `delpasqua-db` risulta `ready`, regione Europe (Frankfurt) / `eu-central-1`.
- Prisma MCP: backup disponibili con stato `completed`, incluso backup full del 2026-11-08 alle 00:36:52 UTC. Nessun restore eseguito.
- Documentazione Prisma: billing tramite Vercel per installazioni Marketplace; Starter prevede snapshot giornalieri sui giorni di attivita`, conservati per 7 giorni. Riferimenti: https://www.prisma.io/docs/guides/postgres/vercel#billing-and-pricing e https://www.prisma.io/docs/postgres/database/backups.
- Repo e API deployment: `vercel.json` e nuovo deployment production confermati in `fra1`.
- Repo: presente anche la migrazione `20260819153000_add_order_attention_acknowledgement`; includerla nella verifica dello stato migrazioni production.
- Vercel: nuovo deployment production CLI `dpl_FGyb8RqsTKnQnhH8gvHHaLFUXh5x` in stato READY, regione `fra1`, alias `delpasqua.vercel.app`. Sorgente: working tree locale con modifiche non committate rispetto a HEAD `390a209e6955b82647251007d66f1302a5711084` (non un redeploy del solo commit Git). URL immutabile: https://delpasqua-52j5w8bqw-leonardomori23-1887s-projects.vercel.app. Build remota e assegnazione alias completate, nessun errore runtime nella finestra immediatamente successiva al READY; non sostituisce collaudo funzionale. `delpasqua.com` non collegato. `.vercelignore` esclude env, scratch, output, tmp e archivi locali dall'upload.
- Vercel CLI: letti singolarmente gli env production senza registrare segreti. I quattro URL sito puntano a `https://delpasqua.com`; chiavi Stripe secret/public con prefisso live, `STRIPE_LIVEMODE_EXPECTED=true`, webhook secret presente nel formato atteso (corrispondenza ancora da collaudare). DATABASE_URL e DIRECT_URL verificate con connessione reale in sola lettura: credenziali identiche su `db.prisma.io`, 7 migrazioni con nomi e timestamp esattamente corrispondenti a `delpasqua-db` verificato via Prisma MCP, colonne `isTest` e `attentionDismissedAt` presenti. Risorsa Vercel `delpasqua-db` in `fra1`; credenziali gestite manualmente, nessun progetto collegato automaticamente alla risorsa. Report senza segreti: `scratch/database-production-check.json`.
- Stripe API: un solo endpoint live, abilitato, `https://delpasqua.com/api/webhooks/stripe`; eventi sottoscritti `checkout.session.completed` e `checkout.session.expired`. Nessun endpoint vecchio/preview nell'elenco. Valutare anche gli eventi async gestiti dal codice se si abilitano metodi di pagamento differiti.
- Resend API: HTTP 400 `API key is invalid`; `EMAIL_FROM` su `gmail.com`. Blocco email aperto in `docs/to_do_security_ops.md`.
- Cron: supporto GET e CRON_SECRET production configurati; codice distribuito nel nuovo deployment READY. Lint/typecheck e 8 controlli locali di rifiuto richieste non autorizzate PASS. Restano verifica invocazioni e log cron, nessuna esecuzione job avviata manualmente.
- Email ordine: nuova grafica e PDF del foglio “Stampa Ordine” implementati; controllati layout condiviso, invio simulato con allegato, esclusione ordini test e gestione errori. Build locale PASS e dipendenze Chromium/logo incluse nei trace controllati. Dopo deploy verificare generazione PDF sul runtime Vercel e recapito reale tramite Resend, ancora sospeso per accesso DNS.
- Prisma: dopo approvazione, query di sola lettura su `_prisma_migrations` riuscita: tutte le 7 migrazioni presenti nel repo risultano completate (`finished_at` valorizzato, `rolled_back_at` nullo), incluse `20260818120000_add_test_order_flag` e `20260819153000_add_order_attention_acknowledgement`. Nessuna migrazione applicata in questa sessione. Corrispondenza degli env Vercel production confermata con connessioni reali e confronto dello storico migrazioni.
- Utente: confermato esito positivo anche per traduzioni, SEO e altri test locali della sera del 2026-11-07; resta distinta la verifica sul dominio finale.

## Regole Di Verifica

- Spuntare una voce solo dopo verifica reale su production o dashboard ufficiale.
- Se una voce richiede una modifica al repo, aprire/aggiornare il relativo `docs/to_do_*.md`.
- Registrare suite automatiche, ambiente ed esito anche in `docs/test_registry.md`.
- Tenere note brevi con data, ambiente e risultato.
- Non salvare segreti, token, password o connection string in questa cartella.

## Riepilogo Rapido Go-Live

Il progetto e` funzionalmente completo: e-commerce, Stripe, inventario, gestionale, prenotazioni, SEO multilingua e test dei flussi critici sono gia` presenti. Prima del lancio non servono nuove sezioni; serve chiudere e verificare la configurazione production.

Ordine di esecuzione consigliato:

1. **[RISOLTO - 100%] Piano database e fatturazione**: Starter attivo e billing tramite Vercel verificati il 2026-11-08; database a Frankfurt e backup disponibili.
2. **[RISOLTO - 100%] Test locali prima del deploy**: typecheck, lint, test server e build con esito positivo, secondo conferma dell'utente ricevuta il 2026-11-08 sui test eseguiti la sera del 2026-11-07. Esito registrato in `docs/test_registry.md`; nessuna nuova esecuzione richiesta.
3. **[RISOLTO - DATABASE]** Migrazioni 7/7, regione Frankfurt e collegamento database production confermati il 2026-11-08. Le verifiche ancora aperte sui servizi esterni restano elencate sotto.
4. **[DEPLOY RISOLTO - 100%]** Nuove modifiche distribuite su Vercel production, stato READY (2026-11-08). Resta collegare `delpasqua.com` al deployment corretto.
5. Verificare dominio, HTTPS, canonical, sitemap e `robots.txt`.
6. Eseguire lo smoke test pubblico production su pagine, lingue, mobile, carrello e checkout.
7. Rieseguire la suite SEO contro il dominio finale e archiviare il nuovo report.
8. Configurare Stripe live e il webhook `https://delpasqua.com/api/webhooks/stripe` con il relativo secret.
9. Configurare Resend con mittente verificato e controllare il recapito delle notifiche.
10. Eseguire da dispositivo mobile un ordine reale completo: shop -> prodotto -> carrello -> checkout -> pagamento -> conferma.
11. Confermare nel gestionale aggiornamento ordine test, stock, email e outbox; verificare che non venga assegnata una numerazione fiscale commerciale e che il webhook risponda `2xx` in Stripe.
12. Pubblicare solo recensioni reali o verificabili e rimuovere eventuali testi o contenuti provvisori.
13. Dopo il collaudo, disattivare il prodotto test da shop, API, pagina prodotto e sitemap.
14. Verificare redirect dal vecchio WordPress, GA4, Search Console, cron, backup e runtime log.
15. Monitorare per almeno 48 ore pagamenti, webhook, email, ordini, stock, errori applicativi e indicizzazione.

Priorita` pratica: **piano database production -> gate automatici -> configurazione e deploy -> dominio -> smoke/SEO -> Stripe/email -> ordine reale -> pulizia contenuti test -> monitoraggio**.

## Piano Test Production

Questi controlli vanno eseguiti sul deployment e sul dominio finali. Non sostituiscono i gate automatici locali elencati in `docs/test_registry.md`.

### Fase 1 - Subito Dopo Deploy E Dominio

- Verificare HTTP status, HTTPS, redirect apex/www e assenza di errori console sulle pagine principali.
- Controllare home, shop, PDP, acquista, carrello, checkout, contatti e pagine legali da desktop e dispositivo mobile reale.
- Controllare almeno la navigazione italiana e inglese, inclusi menu lingua, canonical e hreflang.
- Verificare sitemap, `robots.txt`, esclusione delle route private e `noindex` del dominio preview.
- Rieseguire `npm run seo:all` contro il target finale configurato e conservare il report.
- Controllare runtime log Vercel, connessione Prisma, regione `fra1`, cron e assenza di errori `5xx`.

### Fase 2 - Servizi Reali

- Inviare il form contatti e verificare consegna, mittente e destinatario tramite Resend.
- Verificare chiavi Stripe live, endpoint webhook, secret e risposta `2xx` agli eventi.
- Confermare che GA4 riceva `page_view` ed eventi ecommerce in tempo reale.

### Fase 3 - Ordine Reale Controllato

- Avviare il browser di collaudo con `?test_mode=1` per escludere visite ed eventi GA4; non rimuovere la modalita` fino alla fine del test.
- Usare il prodotto test e completare un pagamento reale da dispositivo mobile.
- Verificare che il checkout rifiuti un carrello contenente insieme prodotto test e prodotti commerciali.
- Verificare success page, stato ordine, numero ordine, pagamento, stock e reservation.
- Verificare email cliente/admin, outbox, assenza di duplicazioni e mancata assegnazione di una fattura commerciale.
- Controllare in Stripe `checkout.session.completed`, consegna webhook `2xx` e assenza di retry.
- Verificare annullamento/cancel e comportamento di un carrello non piu` valido.

### Fase 4 - Chiusura Collaudo

- Disattivare il prodotto test e verificarne l'assenza da pagine, API, sitemap e vecchi carrelli.
- Uscire dalla modalita` interna con `?test_mode=0` sul browser usato per il collaudo.
- Inviare la sitemap a Search Console e controllare redirect legacy WordPress e prime `404`.
- Annotare esito, data, deployment e prove nel registro test e spuntare le voci dettagliate sotto.
- Avviare il monitoraggio di 48 ore su pagamenti, webhook, email, ordini, stock, log, Analytics e indicizzazione.

## P0 - Prima Del Collegamento Dominio

Blocco operativo verificato il 2026-08-05: il dominio pubblico serve ancora WordPress. Non configurare il webhook Stripe live su `delpasqua.com` e non fare ordini live finche` il dominio non punta alla nuova app.

- [x] Attivare la fatturazione e un piano Prisma/Postgres adatto all'uso production prima di collegare il dominio.
- [ ] Verificare nel piano scelto limiti di utilizzo, costi oltre soglia, disponibilita` del servizio e opzioni di backup/restore.
- [ ] Verificare che il metodo di pagamento e gli avvisi di fatturazione del database siano configurati correttamente.
- [x] Confermare in Prisma Console o tramite Prisma MCP che il database production e` in Frankfurt / `eu-central-1`.
- [x] Confermare che `vercel.json` contiene `"regions": ["fra1"]`.
- [x] Fare un nuovo deploy production dopo il cambio regione Vercel: `dpl_FGyb8RqsTKnQnhH8gvHHaLFUXh5x` READY, 2026-11-08.
- [x] Verificare dal deployment Vercel che le Serverless Functions risultino in `fra1` (API deployment, 2026-11-08).
- [x] Verificare che `DATABASE_URL` e `DIRECT_URL` production puntino al database corretto, senza copiare i valori nel repo: entrambe connesse e storico migrazioni corrispondente a `delpasqua-db` (2026-11-08, sola lettura).
- [x] Applicare la migrazione `20260818120000_add_test_order_flag`: gia` completata, verificata via Prisma MCP il 2026-11-08, insieme alla successiva `20260819153000_add_order_attention_acknowledgement`. Non tentare di importare o ricostruire automaticamente i vecchi pagamenti test presenti soltanto in Stripe.
- [x] Verificare che Stripe production usi chiavi live e webhook live (env Vercel e API Stripe, 2026-11-08).
- [x] In Stripe Dashboard live o API ufficiale, verificare che l'endpoint webhook production sia `https://delpasqua.com/api/webhooks/stripe`.
- [x] Disattivare o rimuovere endpoint Stripe live vecchi, preview o puntati ad ambienti di sviluppo: nessuno presente nell'elenco API del 2026-11-08.
- [ ] Verificare che `STRIPE_WEBHOOK_SECRET` production corrisponda esattamente all'endpoint live configurato su Stripe.
- [x] Verificare che `STRIPE_LIVEMODE_EXPECTED` sia coerente con l'ambiente production: `true`, verificato il 2026-11-08.
- [ ] Verificare che email production (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_NOTIFY`) siano corrette.
- [x] Verificare che `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `NEXT_PUBLIC_APP_URL` e `APP_ORIGIN` puntino al dominio finale: tutti `https://delpasqua.com` (2026-11-08).
- [ ] Eseguire almeno un ordine test completo in production prima di rimuovere il prodotto test.
- [ ] Prima del collaudo aprire il sito con `?test_mode=1`; al termine usare `?test_mode=0` per rimuovere la modalita` interna dal browser.
- [ ] Verificare ricezione email ordine/admin sul test production.
- [ ] Verificare che pagamento, webhook Stripe e pagina success funzionino end-to-end.
- [ ] Dopo un ordine test live, verificare in Stripe Dashboard che `checkout.session.completed` abbia risposta webhook 2xx, non 404/500.
- [ ] Verificare che il form contatti funzioni su production.
- [ ] Verificare navigazione mobile reale su home, shop, PDP, carrello, checkout, contatti.
- [ ] Verificare che non ci siano testi placeholder pubblici, in particolare su `/parita-di-genere/` e `/degustazioni/`.
- [ ] Verificare che tutte le recensioni mostrate siano vere o rimuovere quelle provvisorie.
- [ ] Verificare che il dominio preview `.vercel.app` resti `noindex` e non competa con `delpasqua.com`.
- [ ] Valutare protezione ambiente preview se il sito finale e` gia indicizzabile.

## P0 - Prodotto Test

- [ ] Tenere `prodotto-test` attivo solo finche servono test reali di pagamento/spedizione.
- [ ] Dopo i test production, disattivare il prodotto test dal gestionale o dal catalogo con `isPublished: false` e `isPurchasable: false`.
- [ ] Verificare che `prodotto-test` non compaia in `/shop/`.
- [ ] Verificare che `prodotto-test` non compaia in `/acquista/`.
- [ ] Verificare che la PDP del prodotto test non sia raggiungibile pubblicamente come prodotto acquistabile.
- [ ] Verificare che `prodotto-test` non sia presente in `sitemap-products.xml`.
- [ ] Verificare che `/api/products` non restituisca il prodotto test.
- [ ] Verificare che carrelli vecchi con prodotto test vengano ripuliti o non possano completare checkout.

## P0 - Dominio, HTTPS E Redirect

- [ ] Collegare `delpasqua.com` al progetto Vercel corretto.
- [ ] Verificare HTTPS attivo su `https://delpasqua.com/`.
- [ ] Verificare redirect `http://delpasqua.com/` verso HTTPS.
- [ ] Decidere canonical finale tra apex e `www`.
- [ ] Verificare redirect o canonicalizzazione `www/non-www`.
- [ ] Verificare che canonical HTML punti al dominio finale.
- [ ] Verificare che sitemap usi solo URL finali.
- [ ] Verificare che `robots.txt` sia raggiungibile e coerente con produzione.

## P1 - Smoke Test Pubblico

- [ ] Home risponde 200 e non mostra errori console evidenti.
- [ ] `/shop/` risponde 200 e mostra prodotti reali.
- [ ] PDP principali rispondono 200 e hanno prezzo/immagine/CTA corretti.
- [ ] `/acquista/` risponde 200 e non mostra prodotti non vendibili.
- [ ] Carrello: aggiunta, modifica quantita`, rimozione e checkout funzionano.
- [ ] Checkout: indirizzo, spedizione, totale, Stripe redirect e cancel/success funzionano.
- [ ] `/contatti/` risponde 200 e form invia correttamente.
- [ ] `/privacy-policy/`, `/cookie-policy/`, `/condizioni-generali-di-vendita/` rispondono 200.
- [ ] Pagine inglesi principali rispondono 200 e restano sotto `/en/`.
- [ ] Menu lingua non genera URL rotte o duplicate.
- [ ] Immagini principali caricano da mobile e desktop.
- [ ] GA4 riceve eventi page_view.
- [ ] Eventi ecommerce principali arrivano almeno in debug/real-time analytics.

## P1 - SEO Subito Dopo Live

- [ ] Inviare `https://delpasqua.com/sitemap.xml` in Google Search Console.
- [ ] Verificare che Search Console accetti la sitemap.
- [ ] Verificare copertura iniziale e pagine escluse.
- [ ] Verificare che `delpasqua.vercel.app` e alias preview non vengano indicizzati.
- [ ] Controllare 404 reali dopo il cambio dominio.
- [ ] Controllare canonical scelti da Google nelle pagine principali.
- [ ] Monitorare query perse e query nuove nelle prime settimane.
- [ ] Evitare modifiche continue alle URL nelle prime settimane post go-live.

## P1 - Performance E Infrastruttura

- [x] Dopo il deploy, verificare che Vercel production riporti Functions in `fra1`: API nuovo deployment READY, 2026-11-08.
- [ ] Verificare TTFB home/shop/PDP dopo warm-up.
- [ ] Verificare TTFB API critiche: `/api/products`, `/api/inventory/availability`, `/api/order`.
- [ ] Verificare che non ci siano errori Prisma nei runtime logs Vercel.
- [ ] Verificare che i webhook Stripe non abbiano retry o timeout.
- [ ] Verificare che cron `expire-pending` e `outbox` siano configurati e non falliscano.
- [ ] Verificare che il database abbia backup/restore o export operativo prima del traffico reale.

## P2 - Monitoraggio Prime 48 Ore

- [ ] Controllare runtime logs Vercel per 500, timeout, errori Prisma e webhook.
- [ ] Controllare Stripe Dashboard per pagamenti falliti o webhook non consegnati.
- [ ] Controllare email non recapitate o bounce.
- [ ] Controllare ordini duplicati, ordini pending bloccati e stock negativo.
- [ ] Controllare Search Console per errori DNS/HTTPS/sitemap.
- [ ] Controllare Analytics per traffico reale e conversioni.
- [ ] Annotare ogni problema trovato nel relativo file `docs/to_do_*.md`.
