# TODO Inventario e Catalogo

Data audit: 2026-05-29

## [⚠️ PARZIALE] P0 - Catalogo runtime importato come JSON statico

Stato:
- Risolto per la logica server-side il 2026-05-30: Sostituito l'import statico di `products.json` in `src/lib/server/pricing.ts` con la chiamata a `readCatalog()`, garantendo coerenza di prezzo e di magazzino in fase di pricing ed eliminando il rischio di cache obsoleta.

Problema:
- `src/lib/server/catalog.ts:5` avvisa di non importare `products.json` in runtime perche Next puo bundle-izzarlo e renderlo stale.
- Ma `src/components/CartDrawer.tsx:9`, `src/app/[locale]/cart/CartPageClient.tsx:11`, `src/app/[locale]/checkout/success/page.tsx:14` importano direttamente `@/db/products.json`.

Impatto:
- Dopo modifiche admin al catalogo, pricing/carrello/success page possono usare dati vecchi finche non si redeploya o invalida bundle.
- Rischio prezzo/variante immagine non coerenti.

Fix richiesto:
- Server: usare sempre `readCatalog()` o un servizio catalogo cache-safe.
- Client: ricevere catalogo da API/no-store o da server component props.
- Pricing deve essere la prima area da correggere.

## [⏳ TODO] P0 - SKU catalogo ignorato dal pricing/inventario operativo

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

## [⏳ TODO] P0 - Rimozione o rinomina prodotto/variante puo rompere carrelli esistenti

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

## [⚠️ PARZIALE] P1 - Availability pubblica cacheata puo mostrare stock vecchio

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

## [✅ RISOLTO] P1 - Shop page perde immagini variante

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

## [⏳ TODO] P1 - Prodotto test presente nel catalogo

Problema:
- `src/db/products.json` contiene `prodotto-test` con prezzo EUR 0,50, `freeShipping: true`, `excludeFromSeo: true`.

Impatto:
- Anche se noindex, puo comparire in shop/acquisto se non filtrato ovunque.
- Rischio vendita reale accidentale.

Fix richiesto:
- Escludere prodotti test dal catalogo pubblico con flag dedicato, non solo SEO.
- Consentire prodotti test solo in ambiente non produzione.

## [⏳ TODO] P2 - Duplicazione legacy `src/app/lib`

Problema:
- `AGENT.md` segnala `src/app/lib` come legacy.
- Esiste ancora `src/app/lib/server/vat.ts`, `src/app/lib/server/schemas.ts`, `src/app/lib/server/rateLimit.ts`, ecc.

Impatto:
- Rischio import errati e divergenza logica.

Fix richiesto:
- Audit import da `src/app/lib`.
- Eliminare duplicati o aggiungere regole lint/path alias che impediscono nuovi import.
