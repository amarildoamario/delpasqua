# TODO Inventario e Catalogo

Data audit: 2026-05-29

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-11-08
- OpenItems: 1
- AgentAction: non ripartire da zero; resta aperta solo la decisione operativa sul prodotto test, mantenuto intenzionalmente per test futuri.
- Note: Rimosso `src/app/lib` (duplicazione legacy). Chiusi bootstrap client, SKU operativo unico, availability real-time no-store e mapping automatico dei carrelli storici sulle rinomine catalogo. Gli ordini composti solo da `prodotto-test` sono isolati tramite `Order.isTest`; le verifiche finali di esclusione pubblica vivono anche in `docs/to_check_live/README.md`.

## [RISOLTO] P0 - Catalogo runtime importato come JSON statico

Operazione magazzino, 2026-11-08:
- Aggiornamento successivo: su richiesta esplicita dell'utente eseguito azzeramento dei dati operativi production per l'avvio. Eliminati 14 ordini e relativi dettagli/eventi, prenotazioni, log email e outbox; analytics, contatti e degustazioni verificati vuoti. Azzerati i progressivi ordine/fattura e gli utilizzi promozione. Catalogo, configurazione, merchandising, autenticazione e schema conservati.
- Verifica dopo commit: zero ordini (quindi zero annullati al checkout), zero prenotazioni, 28 varianti con stock 50 e reserved 0. Rimossa la riga tecnica extra. Questo stato sostituisce quello della prima operazione descritta sotto.
- Backup precedente al reset: `archivio/magazzino/prima-azzeramento-2026-11-08T13-57-15-598Z.json`, escluso da Git e deploy; report senza dati personali o credenziali: `scratch/production-reset-result.json`. Nessuna operazione su pagamenti o rimborsi Stripe.
- Su richiesta dell'utente impostato `InventoryItem.stock = 50` per tutte le 28 varianti del catalogo nel database production `delpasqua-db`, tramite credenziali Vercel Production.
- Transazione con lock sulle righe, verifica delle prenotazioni e conferma dopo commit: 28/28 stock a 50; 16 unita` prenotate mantenute, nessun ordine modificato.
- Riga tecnica extra `__test__gestionale-sku-v1`, estranea al catalogo, lasciata a stock/reserved zero.
- Valori precedenti salvati in `archivio/magazzino/prima-stock-50-2026-11-08T13-42-15-448Z.json`, escluso da Git e dai deploy. Report senza credenziali: `scratch/production-stock-50-result.json`.

Nomi commerciali e home, 2026-11-07:
- Fruttato leggero → La Dama; medio → Il Musico; intenso → Il Cavaliere. Aggiornati catalogo, titoli dei 18 formati fruttati e otto traduzioni, con identificativi operativi e prezzi conservati.
- Verificate 28 varianti con SKU presenti nel database e immagini esistenti; rilevata solo una riga tecnica di test extra a stock zero.
- `ProductMerch` aggiornato con EVO latta al rango 3 e Musico al 4. `homeVariantId` sceglie la latta EVO 750 ml; foto/prezzo/formato delle card home ora corrispondono.
- Dettagli e backup in `docs/immagini-prodotti.md`.

Aggiornamento immagini EVO, 2026-11-07:
- Durante la verifica locale `/api/products` restituiva ancora il vecchio abbinamento 750 ml → PNG della 3 L, pur con JSON aggiornato.
- Le due cache `catalog-raw` e `catalog-merch` includono ora la revisione del file (mtime, ctime, dimensione), così le modifiche dirette non attendono la scadenza di un'ora.
- Verificati i quattro nuovi WebP del catalogo e le riscritture dei sei URL storici; dettagli in `docs/immagini-prodotti.md` e registro test.

Stato:
- Risolto per la logica server-side il 2026-05-30: sostituito l'import statico di `products.json` in `src/lib/server/pricing.ts` con la chiamata a `readCatalog()`, garantendo coerenza di prezzo e di magazzino in fase di pricing ed eliminando il rischio di cache obsoleta.

Problema:
- `src/lib/server/catalog.ts:5` avvisa di non importare `products.json` in runtime perche Next puo bundle-izzarlo e renderlo stale.
- Ma `src/components/CartDrawer.tsx:9`, `src/app/[locale]/cart/CartPageClient.tsx:11`, `src/app/[locale]/checkout/success/page.tsx:14` importavano direttamente `@/db/products.json`.

Impatto:
- Dopo modifiche admin al catalogo, pricing/carrello/success page potevano usare dati vecchi finche non si redeployava o si invalidava il bundle.
- Rischio prezzo/variante immagine non coerenti.

Fix richiesto:
- Server: usare sempre `readCatalog()` o un servizio catalogo cache-safe.
- Client: ricevere catalogo da API/no-store o da server component props.
- Pricing doveva essere la prima area da correggere.

Verifica repo 2026-06-02:
- La logica server-side critica era gia` migrata a `readCatalog()`.
- Restavano import statici di `@/db/products.json` in:
  - `src/context/CartContext.tsx`
  - `src/components/Navbar.tsx`
  - `src/components/HeroSplitEvo.tsx`
  - `src/components/ShopHighlights.tsx`
- Questi componenti facevano anche fetch a `/api/products`, quindi il rischio era piu` di doppia fonte dati e bootstrap stale che non di pricing rotto.

Richiuso il 2026-06-05:
- Rimossi i fallback runtime a `@/db/products.json` da `CartContext`, `Navbar`, `HeroSplitEvo` e `ShopHighlights`.
- `src/app/[locale]/layout.tsx` passa ora un catalogo iniziale server-side a `Providers` e `Navbar`, eliminando il bootstrap stale dal bundle client.
- `src/app/api/products/route.ts` espone ora il catalogo pubblico filtrato via helper server-side, invece di lasciare il client con una doppia fonte dati.
- Il catalogo pubblico non dipende piu` da un JSON bundle-izzato nei principali consumatori client-side.

## [RISOLTO] P0 - SKU catalogo ignorato dal pricing/inventario operativo

Problema:
- Varianti in `src/db/products.json` hanno campo `sku`.
- `src/lib/server/pricing.ts:96` costruisce SKU interno come `${productId}:${variantId}`.
- `src/lib/server/catalog.ts:77` conferma che lo SKU interno e diverso.

Impatto:
- Lo SKU commerciale/admin (`EVO-B-500ML`) puo non coincidere con lo SKU inventario (`evo:500ml`).
- Confusione in export, magazzino, fulfillment e import stock.

Fix richiesto:
- Decidere una sola chiave operativa.
- Se serve SKU interno, esporlo chiaramente in admin e non chiamarlo come lo SKU commerciale.
- Aggiungere mapping esplicito e controlli di consistenza.

Verifica repo 2026-06-02:
- L'inventario continua a usare la chiave interna `productId:variantId`.
- Il catalogo continua ad avere anche `variant.sku` commerciale.
- Questo e` il motivo per cui availability, pricing e shop possono essere coerenti tra loro ma ancora poco leggibili lato admin/fulfillment.

Richiuso il 2026-06-05:
- `variant.sku` e` ora la chiave operativa canonica per pricing, availability, PDP, carrello e gestionale magazzino.
- Il fallback `productId:variantId` resta solo come compatibilita` legacy, non come seconda chiave concorrente.
- Il salvataggio catalogo migra automaticamente stock e reservation esistenti dal vecchio SKU interno al nuovo SKU canonico, evitando di perdere giacenze gia` presenti nel DB.
- L'admin catalog valida ora SKU mancanti o duplicati, impedendo di reintrodurre ambiguita` operative.

## [RISOLTO] P0 - Rimozione o rinomina prodotto/variante puo rompere carrelli esistenti

Problema:
- Il carrello salva `productId` e `variantId` in localStorage.
- Admin catalog permette aggiornare/cambiare id prodotto e varianti.
- Il client mostra linee invalide ma il flusso non ha una normalizzazione centrale.

Impatto:
- Client con carrelli vecchi possono arrivare a errori checkout.
- Analytics e storico diventano difficili da riconciliare.

Fix richiesto:
- Aggiungere una migrazione/redirect mapping per productId e variantId.
- In cart hydration, rimuovere o correggere righe non piu valide con messaggio utente.

Verifica repo 2026-06-02:
- `CartContext` oggi normalizza e scarta righe non piu valide, quindi il carrello non resta sporco indefinitamente.
- Manca pero` ancora un mapping esplicito per rinomina/merge varianti e un messaggio utente dedicato al caso "questo prodotto non esiste piu".

Richiuso il 2026-06-05:
- Il salvataggio admin confronta le varianti tramite lo SKU canonico stabile e conserva automaticamente gli ID precedenti in `variant.cartAliases`.
- Durante l'hydration, `CartContext` rimappa `productId` / `variantId` storici agli ID correnti prima della validazione.
- Gli alias vengono conservati anche dopo rinomine successive e possono rappresentare mapping espliciti per merge controllati.
- Se non esiste alcun mapping valido, la riga viene rimossa e il cliente riceve un messaggio dedicato; le righe migrate ricevono un messaggio di aggiornamento catalogo.

## [RISOLTO] P1 - Availability pubblica cacheata puo mostrare stock vecchio

Problema:
- `src/app/api/inventory/availability/route.ts` usa `Cache-Control: public, s-maxage=30, stale-while-revalidate=60`.

Stato:
- Migliorato il 2026-05-29.
- L'endpoint availability ora restituisce `stock - reserved` invece di `stock` puro.
- Il carrello client lo richiama con `cache: "no-store"` per drawer/cart page, mentre la cache pubblica puo restare per listing.
- Regressione corretta il 2026-05-29: il client carrello era stato riallineato per errore allo SKU commerciale del catalogo (`variant.sku`), ma l'inventory DB usa ancora lo SKU interno `productId:variantId`. Il carrello ora usa di nuovo la chiave inventario corretta tramite helper condiviso.
- Resta comunque aperto il tema della cache percepita nei listing pubblici per 30-90 secondi.

Impatto:
- UI puo mostrare stock disponibile per quasi 90 secondi dopo cambiamenti.
- Non e grave se checkout valida server-side, ma aumenta incoerenza percepita.

Fix richiesto:
- Tenere cache per listing ma fare refresh no-store nel carrello/pre-checkout.
- Mostrare "disponibilita aggiornata in cassa" solo dove serve.

Verifica repo 2026-06-02:
- L'endpoint pubblico availability resta cacheato; la scelta e` probabilmente accettabile per listing SEO/shop.
- Drawer, cart page e pre-checkout sono gia` riallineati a refresh `no-store`, quindi qui il residuo e` soprattutto UX/percezione.

Richiuso il 2026-06-05:
- `src/app/api/inventory/availability/route.ts` usa ora `no-store` e forza risposta dinamica senza cache CDN/browser.
- Tutti i fetch availability client principali richiedono esplicitamente `cache: "no-store"`.
- La PDP non aspetta piu` una query inventario server-side per costruire il primo HTML: pagina e catalogo vengono renderizzati subito, poi la disponibilita` viene caricata dal client.
- Checkout e riserve inventario continuano comunque a validare lo stock lato server.

## [RISOLTO] P1 - Shop page perde immagini variante

Problema:
- `src/app/[locale]/shop/page.tsx` passa al client solo `id` e `priceCents` delle varianti.
- `src/components/ProductCard.tsx` supporta `variantImages`, ma la shop page non passa `imageSrc` e `imageAlt`.

Stato:
- Migliorato il 2026-05-29.
- La shop page passa ora anche `label`, `imageSrc` e `imageAlt` delle varianti.
- La listing shop e` stata resa variant-based: una card per variante, non piu` una card aggregata per prodotto multi-formato.
- Questo elimina l'ambiguita` del quick add e rimuove dalla card shop il copy "disponibile in piu formati".

Impatto:
- Carousel/preview variante nella card non puo funzionare anche se il catalogo ha immagini variante.

Fix richiesto:
- Valutare se mantenere anche un layout aggregato in contesti diversi dalla shop page.

## [TODO] P1 - Prodotto test presente nel catalogo

Problema:
- `src/db/products.json` contiene `prodotto-test` con prezzo EUR 0,50, `freeShipping: true`, `excludeFromSeo: true`.

Impatto:
- Anche se noindex, puo comparire in shop/acquisto se non filtrato ovunque.
- Rischio vendita reale accidentale.

Fix richiesto:
- Escludere prodotti test dal catalogo pubblico con flag dedicato, non solo SEO.
- Consentire prodotti test solo in ambiente non produzione.

Verifica repo 2026-06-04:
- Il `prodotto-test` e` mantenuto intenzionalmente nel catalogo in questa fase per consentire i test finali di pagamento e spedizione in ambiente reale. Verra` escluso o rimosso solo al completamento dei test post go-live.

Aggiornamento repo 2026-06-05:
- Sono stati introdotti i flag pubblici `isPublished` / `isPurchasable` nel catalogo e nel gestionale prodotti.
- Questo permette ora di escludere il prodotto test da shop, API pubbliche, PDP e sitemap senza affidarsi solo a `excludeFromSeo`.
- Il prodotto test resta intenzionalmente attivo per test futuri; il task rimane aperto solo come promemoria operativo per disattivarlo o rimuoverlo quando non servira` piu.

## [RISOLTO] P2 - Duplicazione legacy `src/app/lib`

Problema:
- `AGENT.md` segnala `src/app/lib` come legacy.
- Esiste ancora `src/app/lib/server/vat.ts`, `src/app/lib/server/schemas.ts`, `src/app/lib/server/rateLimit.ts`, ecc.

Impatto:
- Rischio import errati e divergenza logica.

Fix richiesto:
- Audit import da `src/app/lib`.
- Eliminare duplicati o aggiungere regole lint/path alias che impediscono nuovi import.

Stato:
- Risolto il 2026-06-04. Eseguito audit approfondito delle referenze a `src/app/lib` e rimosso completamente la subtree legacy inutilizzata dal repository.

Verifica repo 2026-06-04:
- La cartella `src/app/lib` e` stata eliminata. Nessun modulo del progetto fa piu` riferimento a questa directory.
