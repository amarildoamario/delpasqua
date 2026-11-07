# To Check Live

Checklist operativa per il go-live di `delpasqua.com`.

Questo non e` un backlog tecnico: contiene verifiche manuali o semi-manuali da fare prima, durante e subito dopo la messa online. I fix di codice restano nei file `docs/to_do_*.md`.

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-08-05
- OpenItems: 78
- AgentAction: attivare prima la fatturazione e un piano Prisma/Postgres adatto alla produzione; poi procedere con dominio, webhook Stripe e test ordine live.
- Note: il 2026-08-05 `delpasqua.com` punta ancora al sito WordPress e `/api/webhooks/stripe` restituisce 404. La route della nuova app e` invece presente su `delpasqua.vercel.app` (GET restituisce 405, coerente con una route POST-only). Le attivita` Stripe live dipendenti dal dominio restano intenzionalmente non spuntate. Lasciare questo file in `docs` anche quando alcune sezioni saranno chiuse; spostamenti o archiviazioni si decidono dopo il go-live.

## Regole d'uso

- Spuntare una voce solo dopo verifica reale su production o dashboard ufficiale.
- Se una voce richiede una modifica al repo, aprire/aggiornare il relativo `docs/to_do_*.md`.
- Registrare suite automatiche, ambiente ed esito anche in `docs/test_registry.md`.
- Tenere note brevi con data, ambiente e risultato.
- Non salvare segreti, token, password o connection string in questa cartella.

## Riepilogo Rapido Go-Live

Il progetto e` funzionalmente completo: e-commerce, Stripe, inventario, gestionale, prenotazioni, SEO multilingua e test dei flussi critici sono gia` presenti. Prima del lancio non servono nuove sezioni; serve chiudere e verificare la configurazione production.

Ordine di esecuzione consigliato:

1. Attivare in Prisma un piano database adatto alla produzione e configurarne la fatturazione.
2. Sul codice finale rieseguire typecheck, lint, test server e build; registrare gli esiti in `docs/test_registry.md`.
3. Verificare migrazioni, variabili production, regione delle Functions e collegamento al database corretto.
4. Collegare `delpasqua.com` al deployment Vercel production corretto.
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

- [ ] Attivare la fatturazione e un piano Prisma/Postgres adatto all'uso production prima di collegare il dominio.
- [ ] Verificare nel piano scelto limiti di utilizzo, costi oltre soglia, disponibilita` del servizio e opzioni di backup/restore.
- [ ] Verificare che il metodo di pagamento e gli avvisi di fatturazione del database siano configurati correttamente.
- [ ] Confermare in Prisma Console che il database production e` in Frankfurt / `eu-central-1`.
- [ ] Confermare che `vercel.json` contiene `"regions": ["fra1"]`.
- [ ] Fare un nuovo deploy production dopo il cambio regione Vercel.
- [ ] Verificare dal deployment Vercel che le Serverless Functions risultino in `fra1`.
- [ ] Verificare che `DATABASE_URL` e `DIRECT_URL` production puntino al database corretto, senza copiare i valori nel repo.
- [ ] Applicare la migrazione `20260818120000_add_test_order_flag`; non tentare di importare o ricostruire automaticamente i vecchi pagamenti test presenti soltanto in Stripe.
- [ ] Verificare che Stripe production usi chiavi live e webhook live.
- [ ] In Stripe Dashboard live, verificare che l'endpoint webhook production sia `https://delpasqua.com/api/webhooks/stripe`.
- [ ] Disattivare o rimuovere endpoint Stripe live vecchi, preview o puntati ad ambienti di sviluppo.
- [ ] Verificare che `STRIPE_WEBHOOK_SECRET` production corrisponda esattamente all'endpoint live configurato su Stripe.
- [ ] Verificare che `STRIPE_LIVEMODE_EXPECTED` sia coerente con l'ambiente production.
- [ ] Verificare che email production (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_NOTIFY`) siano corrette.
- [ ] Verificare che `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `NEXT_PUBLIC_APP_URL` e `APP_ORIGIN` puntino al dominio finale.
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

- [ ] Dopo il deploy, verificare che Vercel production riporti Functions in `fra1`.
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
