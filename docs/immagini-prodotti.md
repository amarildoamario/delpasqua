# Immagini prodotti

## Bottiglia EVO senza sfondo — 7 novembre 2026

La bottiglia EVO 500 ml usa `public/products/EVO-500ml-transparent.png`, scontornata con `image_gen` integrato a partire da `EVO-750-ml-gpt.png`. Il nuovo file ha un vero canale alpha trasparente e un URL distinto per evitare la cache della foto bianca. Tela 1024 × 1536, scala delle card (84%), coordinate di inquadratura e margini della scheda prodotto sono invariati. Originale conservato; prompt in `docs/immagine-evo-bottiglia-prompt.json`.

Le immagini operative sono in `public/products`, con nomi basati sul catalogo e formato WebP.

| Etichetta | Catalogo | File attivi |
| --- | --- | --- |
| Il Cavaliere | Il Cavaliere - Fruttato Intenso, bottiglie e latte | `fruttato-intenso-bottiglia-{500ml,750ml,1lt}.webp`, `fruttato-intenso-latta-{1lt,3lt,5lt}.webp` |
| La Dama | La Dama - Fruttato Leggero, bottiglie e latte | `fruttato-leggero-bottiglia-{500ml,750ml,1lt}.webp`, `fruttato-leggero-latta-{1lt,3lt,5lt}.webp` |
| Il Musico | Il Musico - Fruttato Medio, bottiglie e latte | `fruttato-medio-bottiglia-{500ml,750ml,1lt}.webp`, `fruttato-medio-latta-{1lt,3lt,5lt}.webp` |

Vino, aromatizzati e bottiglia EVO da 500 ml conservano le immagini precedenti.

## Latte EVO — aggiornamento 7 novembre 2026

- `IMG_2554.HEIC` → `EVO-latta-750ml-v2.webp`: contenitore cilindrico nero con tappo.
- `IMG_2594.HEIC` → `EVO-latta-{1lt,3lt,5lt}-v2.webp`: stessa foto rappresentativa della latta rettangolare verde per i tre formati, come richiesto. Non sono foto di tre contenitori distinti.
- Elaborazione con `image_gen` integrato: scontorno trasparente e illuminazione da catalogo, con etichetta vincolata alla foto originale; nessuna capacità aggiunta. È un'elaborazione generativa, non una copia pixel per pixel dell'etichetta. Prompt completi in `docs/immagini-evo-prompt.json`.
- WebP 1200 × 1800, circa 138 kB per la 750 ml e 211 kB per ciascuna latta grande. Area prodotto: `[439,120,322,1560]` per la 750 ml e `[241,120,718,1560]` per le altre; scala delle card rispettivamente 74% e 62%.
- Catalogo e pagina `olio-5-litri` usano gli URL `-v2` per separare la cache delle nuove foto. Le riscritture EVO sono in `beforeFiles` e preservano i vecchi indirizzi PNG/WebP; i file precedenti sono ora archiviati fuori da `public`.
- Le cache del catalogo semplice e con promozioni includono ora la revisione del file JSON: un aggiornamento diretto delle immagini non rimane nascosto per un'ora.
- Originali convertiti, vecchi WebP, catalogo precedente e verifiche locali in `archivio/immagini-prodotti/2026-11-07-evo/`.

## Nomi e formati — aggiornamento 7 novembre 2026

I nomi commerciali includono il profilo accanto al nome: `La Dama - Fruttato Leggero`, `Il Musico - Fruttato Medio`, `Il Cavaliere - Fruttato Intenso`, anche per i titoli dei singoli formati e nelle otto traduzioni. Home e shop usano lo stesso titolo del catalogo italiano; le traduzioni mantengono il nome commerciale e traducono il profilo. Le tre bottiglie Musico sono ora presenti e pubblicate nel catalogo corrente.

ID, slug, SKU, prezzi e collegamenti alle foto sono conservati. Ogni linea fruttata ha bottiglie da 500 ml, 750 ml e 1 L e latte da 1, 3 e 5 L. EVO ha una bottiglia da 500 ml e quattro latte da 750 ml, 1, 3 e 5 L.

L'audit del database configurato ha verificato tutte le 28 varianti (27 commerciali e una di test) in `InventoryItem`: nessuno SKU mancante o duplicato, nessuna giacenza negativa o prenotazione superiore allo stock. È presente anche una vecchia riga tecnica `__test__gestionale-catalog-prod:v1`, con stock e prenotazioni a zero, non associata al catalogo pubblico.

La home è ordinata nel database `ProductMerch`: EVO 500 ml, Il Cavaliere, EVO latta 750 ml, Il Musico. La scelta esplicita `homeVariantId: "750ml"` sul prodotto EVO latta allinea immagine, prezzo e destinazione della card. Anche le altre card mostrano la foto del formato corrispondente al prezzo di partenza e al clic. Il fallback della home conserva lo stesso ordine senza dati di merchandising.

Backup di catalogo, traduzioni e impostazioni home prima dell'intervento in `archivio/immagini-prodotti/2026-11-07-catalogo/`. Gli snapshot dei nomi negli ordini storici restano storici; i nuovi ordini leggono i nuovi nomi dal catalogo operativo.

## Archivio locale

### Pulizia del 7 novembre 2026

`public/products` contiene ora 27 immagini attive, senza sottocartelle di lavorazione: 26 foto del catalogo e `del_pasqua_olive_grove.png`, usata nella scheda prodotto. Le due immagini scontornate ancora utilizzate restano in `public/products_no_background`.

Sono stati spostati 296 file in `archivio/immagini-prodotti/2026-11-07-pulizia/`:

- `Foto Grezze/`: i 20 originali, comprese `IMG_2554.HEIC` e `IMG_2594.HEIC`;
- `prodotti nuovi/` e `prodotti nuovi uniformati/`: esportazioni intermedie, progetti, script e anteprime;
- `prova-scontorno/`: prove di scontorno e illuminazione;
- quattro WebP EVO precedenti, due vecchi PNG delle latte EVO e tre JPEG precedenti delle bottiglie Musico.

La cartella pubblica passa da 683.592.886 a 44.006.248 byte: circa 610 MiB di materiali di lavoro esclusi dalla pubblicazione. Gli originali sono conservati nell'archivio locale escluso da Git; non è una cancellazione dal disco.

`manifest-spostamenti.json` elenca percorsi, dimensioni e SHA-256 dei file spostati; `riepilogo.json` riporta i conteggi. Tutti gli hash sono stati verificati dopo lo spostamento, così come l'integrità delle 27 immagini attive. I nove URL delle vecchie foto rimosse continuano a servire i rispettivi asset correnti tramite riscritture in `next.config.ts`.

I percorsi `public/products/Foto Grezze/...` conservati nei prompt storici descrivono la posizione originale; gli originali correnti si trovano ora in `archivio/immagini-prodotti/2026-11-07-pulizia/Foto Grezze/`.

### Archivio precedente

`archivio/immagini-prodotti/2026-11-06/` contiene:

- `prima-della-sostituzione/`: backup verificato delle immagini presenti prima del cambio;
- `vecchi/`: 18 immagini rimosse dalla cartella pubblica perché non più usate dal catalogo corrente;
- `materiali-uniformati/`: il pacchetto di lavoro completo, PNG, progetti PhotoCraft, basi e prompt;
- `products-prima.json`: catalogo precedente alla sostituzione;
- `corrispondenze.csv`: abbinamenti tra file ricevuti e nomi attivi;
- `aggiornamenti-catalogo.json`: percorsi modificati;
- `verifica-integrazione.json` e screenshot: controllo locale di shop e scheda prodotto.

L'archivio è escluso da Git e non viene servito dal sito. Conservarlo per eventuali ripristini.
I vecchi URL delle immagini sostituite sono gestiti da riscritture in `next.config.ts`, per preservare collegamenti e immagini presenti negli ordini precedenti.
La galleria della scheda prodotto mostra le nuove foto intere con `object-contain`, incluse le nuove latte EVO.

La bottiglia EVO 500 ml (file storico `EVO-750-ml-gpt.png`) e il vino usano ora anche nella galleria e nelle miniature la regola `shouldContainProductImage`: foto intera, con margine interno di 24 px su mobile e 32 px da `sm` nella foto principale. Questo evita il taglio causato da `object-cover`.

I suggerimenti prodotto in `olio-toscano`, `olio-biologico` e `nuovo-raccolto` usano `ProductCardImage`, con sfondo bianco sfumato e la stessa scala ottica dello shop. Le foto non vengono più ingrandite per coprire il riquadro scuro.

Le card dello shop, della home, della lista mobile e dei suggerimenti nelle landing usano `ProductCardImage`: base sfumata discreta, piano di appoggio comune e scala ottica per famiglia (latte 62%, latta cilindrica EVO 74%, bottiglie e vino 84%, aromatizzati 80% dell'area foto). Le bottiglie sono state ingrandite leggermente il 7 novembre 2026; i margini laterali del contenitore sono all'8%, con base al 12%, per consentire la scala maggiore senza stringere la tela delle foto. Le 9 latte fruttate `fruttato-{leggero,medio,intenso}-latta-{1lt,3lt,5lt}.webp` sono in prospettiva studio 3/4 su tela `1200 x 1800` trasparente (`bounds: [20, 120, 1160, 1560]`). Le latte EVO usano invece la vista frontale delle due foto originali, con le misure sopra. `getProductCardImagePresentation` in `src/lib/productImageFit.ts` compensa i margini incorporati nelle fotografie originali senza modificare i file. Quando si sostituisce una foto, verificare anche le coordinate di inquadratura configurate per quella famiglia.
