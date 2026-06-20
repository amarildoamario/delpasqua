# To Check Live

Checklist operativa per il go-live di `delpasqua.com`.

Questo non e` un backlog tecnico: contiene verifiche manuali o semi-manuali da fare prima, durante e subito dopo la messa online. I fix di codice restano nei file `docs/to_do_*.md`.

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-20
- OpenItems: 73
- AgentAction: aggiunti controlli bloccanti per Stripe webhook live, dominio production e notifiche email production.
- Note: lasciare questo file in `docs` anche quando alcune sezioni saranno chiuse; spostamenti o archiviazioni si decidono dopo il go-live.

## Regole d'uso

- Spuntare una voce solo dopo verifica reale su production o dashboard ufficiale.
- Se una voce richiede una modifica al repo, aprire/aggiornare il relativo `docs/to_do_*.md`.
- Tenere note brevi con data, ambiente e risultato.
- Non salvare segreti, token, password o connection string in questa cartella.

## P0 - Prima Del Collegamento Dominio

- [ ] Confermare in Prisma Console che il database production e` in Frankfurt / `eu-central-1`.
- [ ] Confermare che `vercel.json` contiene `"regions": ["fra1"]`.
- [ ] Fare un nuovo deploy production dopo il cambio regione Vercel.
- [ ] Verificare dal deployment Vercel che le Serverless Functions risultino in `fra1`.
- [ ] Verificare che `DATABASE_URL` e `DIRECT_URL` production puntino al database corretto, senza copiare i valori nel repo.
- [ ] Verificare che Stripe production usi chiavi live e webhook live.
- [ ] In Stripe Dashboard live, verificare che l'endpoint webhook production sia `https://delpasqua.com/api/webhooks/stripe`.
- [ ] Disattivare o rimuovere endpoint Stripe live vecchi, preview o puntati ad ambienti di sviluppo.
- [ ] Verificare che `STRIPE_WEBHOOK_SECRET` production corrisponda esattamente all'endpoint live configurato su Stripe.
- [ ] Verificare che `STRIPE_LIVEMODE_EXPECTED` sia coerente con l'ambiente production.
- [ ] Verificare che email production (`RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_NOTIFY`) siano corrette.
- [ ] Verificare che `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `NEXT_PUBLIC_APP_URL` e `APP_ORIGIN` puntino al dominio finale.
- [ ] Eseguire almeno un ordine test completo in production prima di rimuovere il prodotto test.
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
