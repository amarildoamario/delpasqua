# TODO Routing, SEO, Dati Pubblici

Data audit: 2026-05-29

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-02
- OpenItems: 2
- AgentAction: questo file ha solo due task vivi; il resto e` gia` storico/risolto.
- Note: gli open item qui sono piu` di modellazione dati/catalogo che di routing puro.

## [✅ RISOLTO] P1 - Search Console conferma scansione di URL legacy/di transizione

Stato:
- Evidenza raccolta il 2026-05-29 da export Search Console "Ultima scansione".
- Google ha ancora scansionato di recente:
  - core URL corrette come `/`, `/shop/`, `/contatti/`, `/produzione/`
  - URL inglesi legacy o di transizione come `/en/storia/`, `/en/il-nostro-olio/`, `/en/acquista/`, `/en/privacy-policy/`
  - URL WordPress legacy `product`, `portfolio-item`, `portfolio-tag`, `product-category`
  - query-string legacy come `/shop/?add-to-cart=12018`

Impatto:
- Segnale che parte del crawl budget continua a passare da URL WordPress/slug legacy.
- Non implica di per se un bug, se il comportamento finale e` `301` coerente verso la destinazione canonica.
- Diventa invece un problema se una URL legacy resta `200`, entra in sitemap, riceve link interni o compete con la pagina finale.

Fix richiesto:
- Verificare con priorita` le URL legacy che compaiono ancora in Search Console e assicurare per ciascuna:
  - `301` singolo, non catena lunga
  - destinazione canonica corretta
  - assenza dalla sitemap XML
  - assenza di link interni attivi
- Tenere monitorate in particolare le famiglie:
  - `/en/*` legacy di transizione
  - `/product/*` e `/en/product/*`
  - `/portfolio-item/*`, `/portfolio-tag/*`, `/product-category/*`
  - URL con parametri legacy WooCommerce

## [✅ RISOLTO] P0 - Link cliente a rotte mancanti

Stato:
- Risolto operativamente il 2026-05-29.
- Success page: rimosso il link `/orders`.
- Cancel page: corretto `/support` -> `/contatti`.
- Template email: rimossi i CTA `/orders/...`.
- Aggiunta preview manuale template email su `/developer/email-template`.

Problema:
- In precedenza `/orders`, `/orders/[id]` e `/support` erano usati come destinazioni cliente pur senza route pubbliche.

Impatto:
- Chiuso perche non restano piu CTA cliente verso quelle route mancanti.

Fix richiesto:
- Nessuna azione urgente.
- Se in futuro serve il dettaglio ordine cliente, progettare una route pubblica dedicata con accesso sicuro.

## [✅ RISOLTO] P1 - Product JSON-LD dichiara sempre InStock

Stato:
- Risolto il 2026-05-30. Abbiamo integrato la lettura lato server dell'effettivo inventario tramite `getAvailableBySku` e `makeInventorySku` all'interno della pagina di dettaglio prodotto (PDP) (`src/app/[locale]/shop/[prodotto]/page.tsx`). Il JSON-LD ora valorizza dinamicamente `https://schema.org/InStock` o `https://schema.org/OutOfStock` in base alle quantità reali a magazzino.

Problema:
- `src/app/[locale]/shop/[prodotto]/page.tsx` genera `availability: "https://schema.org/InStock"` per tutte le varianti.
- Non legge `InventoryItem`.

Impatto:
- SEO/schema non coerente con disponibilita reale.

Fix richiesto:
- Leggere disponibilita per SKU server-side nella PDP.
- Usare `OutOfStock` quando stock <= 0.

## [⏳ TODO] P1 - Sitemap prodotti puo includere prodotti non vendibili

Problema:
- La sitemap filtra solo `excludeFromSeo`, ma non necessariamente prodotti disattivati/non vendibili.
- Il catalogo non sembra avere un flag pubblico unico tipo `isActive`.

Impatto:
- Prodotto test o prodotti non vendibili possono restare raggiungibili o indicizzati se il flag manca.

Fix richiesto:
- Introdurre `isPublished`/`isPurchasable`/`excludeFromSeo` con semantica distinta.
- Applicare gli stessi flag a shop, PDP, sitemap e JSON-LD.

Verifica repo 2026-06-02:
- `src/app/sitemap-products.xml/route.ts` filtra ancora solo `excludeFromSeo`.
- `src/app/api/products/route.ts` restituisce ancora l'intero catalogo.
- `src/app/[locale]/shop/page.tsx` legge ancora tutti i prodotti da `readCatalog()`.
- Il punto si sovrappone volontariamente anche al file inventario/catalogo: va chiuso una volta sola, ma poi riflesso sia qui sia li.

## [✅ RISOLTO] P1 - Rotte checkout non localizzate nello Stripe redirect

Stato:
- Risolto il 2026-05-30. Abbiamo modificato lo schema d'ordine (`CreateOrderSchema` in `src/lib/server/schemas.ts`) per ricevere il `locale` dal client e memorizzarlo. Nel backend (`src/app/api/order/route.ts`), usiamo questo valore per costruire dinamicamente le URL di Stripe (`success_url` e `cancel_url`) inserendo il locale corretto (es: `/en/checkout/success` o `/it/checkout/success`). Lato client (`src/lib/client/goToCassa.ts`), passiamo la lingua del contesto attuale.

Problema:
- `src/app/api/order/route.ts` genera `success_url: ${appUrl}/checkout/success...` e `cancel_url: ${appUrl}/checkout/cancel...`.
- In app multilingua, potrebbe non preservare locale corrente.

Impatto:
- Utente in `/en` puo rientrare in pagina italiana/default.

Fix richiesto:
- Passare locale nel payload ordine e generare URL localizzato.
- Oppure usare route non localizzate intenzionali e tradurre in base a sessione/ordine.

## [⏳ TODO] P2 - Copy e business rules duplicati

Problema:
- Soglie spedizione, testi reso/spedizione e metodi pagamento sono duplicati in componenti, JSON prodotti e messaggi.

Impatto:
- Ogni modifica commerciale richiede troppi punti.

Fix richiesto:
- Centralizzare regole commerciali in settings/config.
- Derivare copy da quei valori dove possibile.

Verifica repo 2026-06-02:
- Restano duplicazioni tra componenti UI, `messages/*.json`, catalogo JSON e costanti runtime.
- Alcuni punti sono gia` stati centralizzati (`settings.ts`, `paymentMethods.ts`), ma il copy commerciale non e` ancora completamente derivato da una sola fonte.
