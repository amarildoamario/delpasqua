# TODO Pagine SEO e Landing Page

Data audit: 2026-06-19

## Agent Status

- FileStatus: COMPLETED
- LastVerified: 2026-06-20
- OpenItems: 0
- AgentAction: trattare questo file come archivio completato; le 4 landing SEO sono presenti, localizzate, linkate internamente e incluse nella sitemap.
- Note: i testi commerciali delle landing sono definiti nei rispettivi moduli pagina/client invece che in `messages/*.json`. Verificati `src/i18n/pathnames.ts`, `src/app/sitemap-pages.xml/route.ts`, `src/lib/seo.ts`, shop/footer internal links e `generateStaticParams` per le 4 pagine.

---

## [RISOLTO] Navigazione mobile Home, carrello e menu - 2026-11-08

- Reso visibile il link localizzato "Vai allo shop" accanto al titolo "I piu acquistati" anche su mobile, con area di tocco di almeno 44px.
- Chiusura carrello mobile: pulsante grigio con bordo, raggio 5px, area 44x44px e icona X da 24px.
- Menu e carrello usano l'altezza dinamica `100dvh`, mantenendo la compensazione zoom desktop separata. Menu con header non comprimibile, area scorrevole `min-h-0`, contenimento dello scroll e safe area iOS sopra/sotto.
- Verifica locale Chromium e WebKit: 8 configurazioni (320, 375, 390 e 844px), riduzione/aumento altezza a menu aperto, footer lingue raggiungibile, pulsanti di chiusura funzionanti, nessun errore JavaScript. Screenshot e report: `scratch/mobile-navigation/`. Non equivale a un collaudo su iPhone fisico.
- `npm run lint` e `npm run typecheck`: PASS. Revisione React: nessun nuovo effetto o stato, link e label accessibili/localizzati, modifiche limitate al layout.

## Stato Collegamento Interno (Internal Linking)

Per garantire l'indicizzazione ed il passaggio di autorità alle nuove pagine, sono già stati implementati i seguenti blocchi:

- [✅ RISOLTO] **4 Card in fondo allo Shop (`/shop`)**: Aggiunta la sezione *"Le nostre Selezioni & Formati"* con layout responsive e micro-animazioni. Le card usano testi puliti senza la parola "online" (es. *Olio Extravergine Toscano*, *Olio EVO Biologico*, *Nuovo Raccolto*, *Latta 5 Litri*).
- [✅ RISOLTO] **Barra SEO in linea nel Footer**: Inserita una sezione orizzontale prima del divisore per propagare i link in tutte le pagine del sito.

---

## 1. [RISOLTO] P1 - Creazione Rotta: Olio Extravergine Toscano
- **Parola chiave target**: `olio extravergine toscano online` (gestito nel testo/meta-title, non visibile sulla card/link)
- **Risoluzione URL (`pathnames.ts`)**:
  - `it`: `/olio-toscano`
  - `en`: `/tuscan-olive-oil`
  - `de`: `/toskanisches-olivenoel`
  - `nl`: `/toscane-olijfolie`
  - `da`: `/toscansk-olivenolie`
  - `no`: `/toskansk-olivenolje`
- **Risoluzione 2026-06-20**: pagina presente in `src/app/[locale]/olio-toscano/page.tsx`, rotta registrata in `src/i18n/pathnames.ts`, inclusa in `sitemap-pages.xml`, coperta da hreflang metadata e static params.

## 2. [RISOLTO] P1 - Creazione Rotta: Olio EVO Biologico
- **Parola chiave target**: `comprare olio EVO biologico`
- **Risoluzione URL (`pathnames.ts`)**:
  - `it`: `/olio-biologico`
  - `en`: `/buy-organic-olive-oil`
  - `de`: `/bio-olivenoel-kaufen`
  - `nl`: `/biologische-olijfolie-kopen`
  - `da`: `/oekologisk-olivenolie`
  - `no`: `/okologisk-olivenolje`
- **Risoluzione 2026-06-20**: pagina presente in `src/app/[locale]/olio-biologico/page.tsx`, rotta registrata in `src/i18n/pathnames.ts`, inclusa in `sitemap-pages.xml`, coperta da hreflang metadata e static params.

## 3. [RISOLTO] P1 - Creazione Rotta: Olio Extravergine Nuovo Raccolto
- **Parola chiave target**: `olio extravergine nuovo raccolto`
- **Risoluzione URL (`pathnames.ts`)**:
  - `it`: `/nuovo-raccolto`
  - `en`: `/new-harvest-olive-oil`
  - `de`: `/frische-olivenernte`
  - `nl`: `/nieuwe-oogst-olijfolie`
  - `da`: `/ny-hoest`
  - `no`: `/ny-host`
- **Risoluzione 2026-06-20**: pagina presente in `src/app/[locale]/nuovo-raccolto/page.tsx`, rotta registrata in `src/i18n/pathnames.ts`, inclusa in `sitemap-pages.xml`, coperta da hreflang metadata e static params.

## 4. [RISOLTO] P1 - Creazione Rotta: Olio Extravergine 5 Litri
- **Parola chiave target**: `olio extravergine 5 litri online`
- **Risoluzione URL (`pathnames.ts`)**:
  - `it`: `/olio-5-litri`
  - `en`: `/5-liters-olive-oil`
  - `de`: `/5-liter-olivenoel`
  - `nl`: `/5-liter-olijfolie`
  - `da`: `/5-liters-dunk`
  - `no`: `/5-liters-kanne`
- **Risoluzione 2026-06-20**: pagina presente in `src/app/[locale]/olio-5-litri/page.tsx`, rotta registrata in `src/i18n/pathnames.ts`, inclusa in `sitemap-pages.xml`, coperta da hreflang metadata e static params.
