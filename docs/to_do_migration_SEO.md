# TODO Migrazione SEO e Go-live

Obiettivo: mantenere una lista operativa aggiornata per la migrazione SEO da WordPress a Vercel e per il go-live di `delpasqua.com`.

Questo file non deve essere uno storico completo di tutto quello che e` gia stato fatto. Le verifiche manuali estese di produzione restano in `docs/to_check_live/README.md`; qui restano solo i punti SEO ancora utili.

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-27
- OpenItems: 7
- AgentAction: usare questo file come lista SEO corrente; prima di chiudere un punto, verificare il codice locale o l'ambiente production reale.
- Note: aggiornato allo stato attuale del repo. La copertura locale di routing, sitemap, canonical, hreflang e noindex preview esiste; restano soprattutto verifiche production, Search Console, recensioni reali e pulizia finale del prodotto test.

## Lettura rapida

- Il sito ora lavora su 9 locale: `it`, `en`, `de`, `nl`, `da`, `no`, `es`, `fr`, `us`.
- La struttura italiana resta senza prefisso, per esempio `/shop/`; le altre lingue usano prefisso quando serve, per esempio `/en/shop/`, `/de/laden/`, `/fr/boutique/`.
- `sitemap.xml` e` un sitemap index con `sitemap-pages.xml`, `sitemap-products.xml` e `sitemap-blog.xml`.
- `robots.txt` permette la produzione finale e blocca preview/staging quando `SITE_URL` o `VERCEL_ENV` indicano preview.
- `src/proxy.ts` aggiunge `X-Robots-Tag: noindex, nofollow` sugli host production non finali.
- Le vecchie voci SEO locali gia chiuse non vanno riaperte solo perche erano presenti nel vecchio documento.

## Stato locale verificato

### [RISOLTO] Routing e path localizzati

Stato attuale:
- `src/i18n/pathnames.ts` definisce le route localizzate per pagine core, shop, prodotti, blog, legali, carrello e landing SEO.
- `src/i18n/routing.ts` usa `localePrefix: "as-needed"`, quindi l'italiano e` canonico senza prefisso.
- Le landing SEO `olio-toscano`, `olio-biologico`, `nuovo-raccolto` e `olio-5-litri` sono registrate nei path localizzati e hanno `generateStaticParams`.

Non resta lavoro SEO locale qui, salvo regressioni future.

### [RISOLTO] Sitemap

Stato attuale:
- `src/app/sitemap.xml/route.ts` genera il sitemap index.
- `src/app/sitemap-pages.xml/route.ts` include le pagine core, legali, blog index, degustazioni, resi, spedizioni, parita di genere e landing olio per tutti i locale.
- `src/app/sitemap-products.xml/route.ts` usa `filterSeoCatalog(...)`, quindi esclude prodotti non SEO-visible.
- `src/app/sitemap-blog.xml/route.ts` include solo le traduzioni blog disponibili e usa URL/category slug localizzati.

Nota:
- La sitemap index usa ancora un `lastmod` dinamico per `sitemap-pages.xml`; non e` un blocco go-live, ma se si vuole massima pulizia SEO si puo rimuovere o sostituire con una data reale di contenuto.

### [RISOLTO] Canonical e hreflang

Stato attuale:
- `src/lib/seo.ts` centralizza `SITE_URL`, canonical, metadata e hreflang.
- `HREFLANG_CORE_PATHS` include pagine core, legali, blog, degustazioni, resi, spedizioni, parita di genere e landing olio.
- Le sitemap generano link `xhtml:link` alternate; `sitemap-pages.xml` include anche `x-default` verso italiano.
- Le pagine prodotto e blog generano alternate URL dedicate in base a slug tradotti.

Non resta lavoro SEO locale qui, salvo controllare in production che `NEXT_PUBLIC_SITE_URL` / `SITE_URL` puntino al dominio finale.

### [RISOLTO] Preview e host non finali noindex

Stato attuale:
- `src/app/robots.ts` disabilita l'indicizzazione se `VERCEL_ENV === "preview"` o se `SITE_URL` contiene `vercel.app`.
- `src/proxy.ts` aggiunge `X-Robots-Tag: noindex, nofollow` in produzione su host diversi da `delpasqua.com` e `www.delpasqua.com`.

Resta solo la verifica reale dopo il deploy, perche dipende dagli host Vercel effettivi.

### [RISOLTO] Placeholder pubblici principali

Stato attuale:
- I placeholder segnalati in passato su `produzione`, `parita-di-genere` e `degustazioni` risultano gia chiusi nel codice.
- I `placeholder` rimasti nei risultati di ricerca locale sono per input form, UI admin o label tecniche, non contenuti pubblici SEO da correggere.

Eccezione ancora aperta: recensioni Home, vedi task dedicato sotto.

## Task aperti

### [PARZIALE] P0 - Verificare dominio production, env SEO e sitemap live

Perche resta aperto:
- Questo non si puo chiudere dal solo codice locale: dipende dal dominio collegato a Vercel e dagli env production.

Da fare:
- Confermare che `delpasqua.com` punti al progetto Vercel corretto.
- Decidere e verificare canonical finale tra apex e `www`.
- Verificare redirect `http -> https`.
- Verificare redirect o canonicalizzazione `www/non-www`.
- Verificare env production: `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `NEXT_PUBLIC_APP_URL`, `APP_ORIGIN`.
- Aprire in production:
  - `https://delpasqua.com/robots.txt`
  - `https://delpasqua.com/sitemap.xml`
  - `https://delpasqua.com/sitemap-pages.xml`
  - `https://delpasqua.com/sitemap-products.xml`
  - `https://delpasqua.com/sitemap-blog.xml`

Definition of Done:
- Tutti gli URL sopra rispondono 200 sul dominio finale.
- Le sitemap contengono URL del dominio finale, non preview.
- `robots.txt` punta a `https://delpasqua.com/sitemap.xml`.

### [PARZIALE] P0 - Smoke test SEO production dopo deploy

Perche resta aperto:
- La verifica locale non basta per dominio, header, canonical reali e comportamento Edge/Vercel.

Da fare su production:
- Home, shop, PDP principali, acquista, contatti, blog e landing olio rispondono 200.
- Carrello, checkout e my-account non compaiono in sitemap e restano noindex.
- Le pagine principali hanno canonical coerente con il dominio finale.
- Il menu lingua non crea URL rotti o duplicati.
- La navigazione mobile reale non nasconde link importanti.

Definition of Done:
- Nessuna pagina core produce 404/500.
- Nessuna pagina core e` marcata noindex per errore.
- Nessuna utility ecommerce finisce indicizzabile.

### [TODO] P1 - Collegare recensioni reali o rimuovere recensioni provvisorie

Stato attuale:
- `src/components/HomeTrustAndReviews.tsx` contiene una sezione recensioni pronta per Google.
- Il copy dice esplicitamente che le recensioni Google sono "pronte da collegare".
- Il componente contiene testi recensione hardcoded.

Rischio:
- Se quelle recensioni non sono reali, la Home mostra trust proof non verificato.

Da fare:
- Collegare recensioni Google reali, oppure sostituire la sezione con testimonianze verificate, oppure rimuovere temporaneamente il blocco recensioni.

Definition of Done:
- Ogni recensione pubblica e` verificabile o dichiarata correttamente.
- Non resta copy tipo "Google reviews ready to connect" visibile al cliente finale.

### [TODO] P1 - Disattivare prodotto test dopo i test live

Stato attuale:
- `src/db/products.json` contiene `prodotto-test`.
- Il prodotto test ha `excludeFromSeo: true`, quindi non dovrebbe entrare in `sitemap-products.xml`.
- Non ha pero` `isPublished: false` o `isPurchasable: false` nel JSON corrente.

Rischio:
- SEO pura: basso, perche e` escluso dalla sitemap.
- Commerciale/pubblico: medio, perche puo restare acquistabile o visibile se il catalogo pubblico non lo filtra come prodotto non pubblicato.

Da fare dopo ordine test reale:
- Impostare `isPublished: false` e `isPurchasable: false`, oppure rimuovere il prodotto test.
- Verificare che non appaia in `/shop/`, `/acquista/`, `/api/products` e `sitemap-products.xml`.
- Verificare che carrelli vecchi non possano completare checkout con il prodotto test.

Definition of Done:
- `prodotto-test` non e` acquistabile pubblicamente e non e` presente in sitemap/API pubbliche.

### [TODO] P1 - Verificare redirect legacy WordPress dopo go-live

Stato attuale:
- `src/proxy.ts` contiene redirect 301 per molte vecchie URL WordPress: cart, portfolio, product, product-category e `zblog-list-2`.
- Search Console aveva mostrato scansioni legacy ancora recenti nell'export del 2026-05-29.

Da fare dopo il dominio live:
- Controllare da browser/curl un campione di URL legacy `product`, `product-category`, `portfolio-item`, `portfolio-tag`, `portfolio-category`.
- Controllare in Search Console le 404 reali dopo il cambio dominio.
- Aggiungere redirect mancanti solo per URL con impression, click, backlink o crawl significativo.

Definition of Done:
- Le vecchie URL importanti fanno 301 singolo verso una pagina finale sensata.
- Non ci sono URL legacy importanti che rispondono 200 come duplicati o 404 evitabili.

### [TODO] P2 - Valutare protezione preview

Stato attuale:
- Il noindex preview e` gia presente via `robots.ts` e `proxy.ts`.

Resta da decidere:
- Se il sito finale e` indicizzabile e riceve traffico reale, valutare password/protection sugli ambienti preview Vercel.

Definition of Done:
- Decisione esplicita: lasciare preview accessibile ma noindex, oppure proteggerla.

### [TODO] P2 - Monitorare Search Console dopo go-live

Da fare:
- Inviare `https://delpasqua.com/sitemap.xml` in Google Search Console.
- Verificare che la sitemap venga accettata.
- Controllare copertura, pagine escluse, 404, canonical scelti da Google.
- Monitorare query perse e query nuove nelle prime settimane.
- Evitare modifiche continue alle URL appena dopo il go-live.

Definition of Done:
- Search Console non segnala problemi bloccanti su sitemap, DNS, HTTPS o indicizzazione pagine principali.

## Collegamenti ad altri file

- `docs/to_check_live/README.md`: checklist completa pre/durante/post go-live.
- `docs/to_do_checkout_payments.md`: Stripe webhook, dominio production e ordine test live.
- `docs/to_do_security_ops.md`: Resend e notifiche form contatti.
- `docs/to_do_inventory_catalog.md`: decisione finale sul prodotto test.
- `docs/to_do_routing_seo_data.md`: duplicazioni di copy e regole commerciali.
- `docs/to_do_pages.md`: archivio completato per landing SEO olio.

## Comandi utili

Da usare quando serve una verifica locale, non per chiudere i task production:

```powershell
npm.cmd run seo:all
npm.cmd run seo:audit-sitemap
npm.cmd run seo:audit-hreflang
npm.cmd run seo:audit-canonical
npm.cmd run seo:audit-legacy-routes
npm.cmd run seo:audit-noindex
```
