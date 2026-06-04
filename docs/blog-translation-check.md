# Blog Translation Check

Generated: 2026-05-26T15:53:12.688Z
Source: src/lib/blogTranslationsData.ts
Posts: 51
Locales: en, de, nl, da, no

## Agent Status

- FileStatus: ACTIVE
- LastVerified: 2026-06-02
- OpenItems: 42 missing `content` entries per locale selezionata
- AgentAction: trattare questo file come backlog editoriale/localization, non come bug di routing o slug.
- CompletionRule: il file diventa `COMPLETED` solo quando il `Global Summary` mostra `missing content 0` per tutte le lingue selezionate.
- Note: oggi slug e category localizzate esistono quasi ovunque; il problema residuo principale e` il fallback del contenuto in italiano.

## Note Operative Verificate Al 2026-06-02

- `src/lib/blogTranslationsData.ts` ammette ancora `content?: string`, quindi il fallback a contenuto italiano resta possibile.
- Le URL localizzate risultano gia` risolte senza collisioni nel report; il debito aperto e` soprattutto copy/content.
- Prima di lavorare su singoli post, rieseguire `npm run check:blog-translations` se il dataset cambia.

Legend: ✅ ready, ⚠️ fallback or missing field, ❌ translation entry missing

## Global Summary

- en: entries 51/51, missing translations 0, missing content 42, missing own slug 0, missing own category 0, duplicate resolved urls 0, duplicate localized urls 0
- de: entries 51/51, missing translations 0, missing content 42, missing own slug 0, missing own category 0, duplicate resolved urls 0, duplicate localized urls 0
- nl: entries 51/51, missing translations 0, missing content 42, missing own slug 0, missing own category 0, duplicate resolved urls 0, duplicate localized urls 0
- da: entries 51/51, missing translations 0, missing content 42, missing own slug 0, missing own category 0, duplicate resolved urls 0, duplicate localized urls 0
- no: entries 51/51, missing translations 0, missing content 42, missing own slug 0, missing own category 0, duplicate resolved urls 0, duplicate localized urls 0

## Quick Index By Post

Includes all selected posts.

- chim-1 | Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- chim-2 | Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- chim-3 | Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- chim-4 | Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- chim-5 | K232 e K270: cosa misurano e perché indicano la qualità dell'olio | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- chim-6 | Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- chim-7 | Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- com-2 | Abbinamenti con EVO fruttato leggero | 🇮🇹 IT /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti | TODO: all selected locales ready
- com-4 | Come e quando usare l'Olio EVO Fruttato Intenso | 🇮🇹 IT /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo | TODO: all selected locales ready
- com-6 | Cos'è l'Olio Nuovo e perché conviene acquistarlo? | 🇮🇹 IT /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura | TODO: all selected locales ready
- com-8 | DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio? | 🇮🇹 IT /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- dif-1 | Difetti dell'olio EVO: guida completa ai principali vizi sensoriali | 🇮🇹 IT /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- dif-2 | Rancido: cos'è, perché succede e come evitarlo | 🇮🇹 IT /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- dif-3 | Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione | 🇮🇹 IT /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- dif-4 | Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione | 🇮🇹 IT /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- faq-1 | FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa | 🇮🇹 IT /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- fid-1 | Come nasce il nostro olio: raccolta → frantoio → stoccaggio | 🇮🇹 IT /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- fid-2 | Come degustare l'olio EVO in 5 minuti: guida pratica per tutti | 🇮🇹 IT /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- fid-3 | Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità | 🇮🇹 IT /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- fid-4 | Perché l'olio cambia ogni anno: clima, resa, maturazione | 🇮🇹 IT /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- fid-5 | Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena | 🇮🇹 IT /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- glos-1 | Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro | 🇮🇹 IT /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-1 | A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto) | 🇮🇹 IT /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-10 | Crudo o in cottura: quando usare l'EVO fa davvero la differenza | 🇮🇹 IT /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-2 | Come conservare l'olio EVO a casa: luce, ossigeno, temperatura | 🇮🇹 IT /blog/categoria/conservazione/conservare-olio-casa | TODO: all selected locales ready
- info-4 | Come capire se un olio EVO è rancido: segnali e cosa fare | 🇮🇹 IT /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-5 | Colore dell'olio: il verde è sinonimo di migliore? (No) | 🇮🇹 IT /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-6 | Punto di fumo dell'olio EVO: si può friggere con l'extravergine? | 🇮🇹 IT /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-7 | Quante calorie ha l'olio EVO e quali sono le porzioni consigliate | 🇮🇹 IT /blog/categoria/salute-benessere/calorie-olio-evo-porzioni | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-8 | Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo) | 🇮🇹 IT /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- info-9 | I 7 errori più comuni nella conservazione dell'olio EVO in cucina | 🇮🇹 IT /blog/categoria/conservazione/errori-conservazione-olio-cucina | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- post-1 | I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana | 🇮🇹 IT /blog/categoria/salute-benessere/benefici-olio-evo-salute | TODO: all selected locales ready
- post-buy-2 | Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale | 🇮🇹 IT /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio | TODO: all selected locales ready
- post-chem-1 | L'acidità dell'Olio EVO: sfatiamo i miti comuni | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo | TODO: all selected locales ready
- post-chem-2 | Polifenoli e Perossidi: come decifrare le analisi dell'olio | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi | TODO: all selected locales ready
- post-store-1 | Quanto dura un Olio EVO e come conservarlo al meglio | 🇮🇹 IT /blog/categoria/conservazione/quanto-dura-olio-evo | TODO: all selected locales ready
- post-store-2 | Lattina o bottiglia scura? Quale conserva meglio l'olio EVO | 🇮🇹 IT /blog/categoria/conservazione/bottiglia-scura-o-latta | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- post-use-1 | Friggere con l'olio extravergine: falso mito o realtà culinaria? | 🇮🇹 IT /blog/categoria/consumo-corretto/friggere-con-olio-evo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- post-use-2 | Olio nuovo d'annata: come esaltarlo nei piatti a crudo | 🇮🇹 IT /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-1 | Miglior olio per la bruschetta: 3 profili e come scegliere | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-2 | Miglior olio per l'insalata: emulsione, sale e il giusto profilo | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-per-insalata | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-3 | Olio per la pasta aglio e olio: quale profilo aromatico scegliere | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-4 | Olio per legumi e zuppe: quale funziona meglio e come usarlo | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-5 | Pane e olio: mini guida degustazione per ospiti (e box assaggio) | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-6 | Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-7 | Olio su pesce crudo e carpaccio: quale scegliere e perché | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-8 | Olio per carne alla griglia: fruttato intenso e il perché del contrasto | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- ric-9 | Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo | 🇮🇹 IT /blog/categoria/ricette-e-abbinamenti/olio-per-pizza | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- tec-1 | NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- tec-2 | Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- tec-3 | Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa | 🇮🇹 IT /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva | TODO: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content

## Worklist By Post

### chim-1 | Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile

- 🇮🇹 IT title: Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: composizione-chimica-olio-evo
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/chemical-composition-extra-virgin-olive-oil
  resolved now: /en/blog/category/olive-oil-chemistry/chemical-composition-extra-virgin-olive-oil
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/chemische-zusammensetzung-olivenoel-extra
  resolved now: /de/blog/kategorie/olivenolchemie/chemische-zusammensetzung-olivenoel-extra
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/chemische-samenstelling-extra-vierge-olijfolie
  resolved now: /nl/blog/categorie/olijfoliechemie/chemische-samenstelling-extra-vierge-olijfolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/kemiske-sammensaetning-ekstra-jomfruolivenolie
  resolved now: /da/blog/kategori/olivenoliekemi/kemiske-sammensaetning-ekstra-jomfruolivenolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/kjemiske-sammensetten-ekstra-jomfruolivenolje
  resolved now: /no/blog/kategori/olivenoljekjemi/kjemiske-sammensetten-ekstra-jomfruolivenolje
  missing fields: content
  issues: content falls back to Italian
  info: none

### chim-2 | Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati

- 🇮🇹 IT title: Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: polifenoli-oleocantale-oleuropeina
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/polyphenols-in-olive-oil-oleocanthal-oleuropein-hydroxytyrosol
  resolved now: /en/blog/category/olive-oil-chemistry/polyphenols-in-olive-oil-oleocanthal-oleuropein-hydroxytyrosol
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/polyphenole-im-olivenoel-extra-oleocanthal-oleuropein-hydroxytyrosol
  resolved now: /de/blog/kategorie/olivenolchemie/polyphenole-im-olivenoel-extra-oleocanthal-oleuropein-hydroxytyrosol
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/polifenolen-in-olijfolie-oleocanthal-oleuropeine-hydroxytyrosol
  resolved now: /nl/blog/categorie/olijfoliechemie/polifenolen-in-olijfolie-oleocanthal-oleuropeine-hydroxytyrosol
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/polyfenoler-i-olivenolie-oleocanthal-oleuropein-hydroxytyrosol
  resolved now: /da/blog/kategori/olivenoliekemi/polyfenoler-i-olivenolie-oleocanthal-oleuropein-hydroxytyrosol
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/polyfenoler-i-olivenolje-oleocanthal-oleuropein-hydroxytyrosol
  resolved now: /no/blog/kategori/olivenoljekjemi/polyfenoler-i-olivenolje-oleocanthal-oleuropein-hydroxytyrosol
  missing fields: content
  issues: content falls back to Italian
  info: none

### chim-3 | Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto

- 🇮🇹 IT title: Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: profilo-acidi-grassi-olio
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/fatty-acid-profile-olive-oil-oleic-linoleic-palmitic
  resolved now: /en/blog/category/olive-oil-chemistry/fatty-acid-profile-olive-oil-oleic-linoleic-palmitic
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/fettsaeureprofil-olivenoel-oelsaeure-linolsaeure-palmitinsaeure
  resolved now: /de/blog/kategorie/olivenolchemie/fettsaeureprofil-olivenoel-oelsaeure-linolsaeure-palmitinsaeure
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/vetzuurprofiel-olijfolie-oliezuur-linolzuur-palmitinezuur
  resolved now: /nl/blog/categorie/olijfoliechemie/vetzuurprofiel-olijfolie-oliezuur-linolzuur-palmitinezuur
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/fedtsyreprofil-olivenolie-oliesyre-linolsyre-palmitinsyre
  resolved now: /da/blog/kategori/olivenoliekemi/fedtsyreprofil-olivenolie-oliesyre-linolsyre-palmitinsyre
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/fettsyreprofil-olivenolje-oljesyre-linolsyre-palmitinsyre
  resolved now: /no/blog/kategori/olivenoljekjemi/fettsyreprofil-olivenolje-oljesyre-linolsyre-palmitinsyre
  missing fields: content
  issues: content falls back to Italian
  info: none

### chim-4 | Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio

- 🇮🇹 IT title: Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: numero-perossidi-che-misura
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/peroxide-value-in-olive-oil-quality
  resolved now: /en/blog/category/olive-oil-chemistry/peroxide-value-in-olive-oil-quality
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/peroxidzahl-olivenoel-bedeutung-qualitaet
  resolved now: /de/blog/kategorie/olivenolchemie/peroxidzahl-olivenoel-bedeutung-qualitaet
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/peroxidegetal-olijfolie-kwaliteit-betekenis
  resolved now: /nl/blog/categorie/olijfoliechemie/peroxidegetal-olijfolie-kwaliteit-betekenis
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/peroxidtal-olivenolie-hvad-betyder-det
  resolved now: /da/blog/kategori/olivenoliekemi/peroxidtal-olivenolie-hvad-betyder-det
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/peroksidtall-olivenolje-hva-betyr-det
  resolved now: /no/blog/kategori/olivenoljekjemi/peroksidtall-olivenolje-hva-betyr-det
  missing fields: content
  issues: content falls back to Italian
  info: none

### chim-5 | K232 e K270: cosa misurano e perché indicano la qualità dell'olio

- 🇮🇹 IT title: K232 e K270: cosa misurano e perché indicano la qualità dell'olio
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: k232-k270-cosa-misurano
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/k232-k270-uv-extinction-coefficients-olive-oil
  resolved now: /en/blog/category/olive-oil-chemistry/k232-k270-uv-extinction-coefficients-olive-oil
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/k232-k270-uv-extinktionskoeffizienten-olivenoel
  resolved now: /de/blog/kategorie/olivenolchemie/k232-k270-uv-extinktionskoeffizienten-olivenoel
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/k232-en-k270-uv-extinctiecoefficienten-olijfolie
  resolved now: /nl/blog/categorie/olijfoliechemie/k232-en-k270-uv-extinctiecoefficienten-olijfolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/k232-og-k270-uv-absorptionskoefficienter-olivenolie
  resolved now: /da/blog/kategori/olivenoliekemi/k232-og-k270-uv-absorptionskoefficienter-olivenolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/k232-og-k270-uv-absorpsjonskoeffisienter-olivenolje
  resolved now: /no/blog/kategori/olivenoljekjemi/k232-og-k270-uv-absorpsjonskoeffisienter-olivenolje
  missing fields: content
  issues: content falls back to Italian
  info: none

### chim-6 | Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio

- 🇮🇹 IT title: Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: gramolazione-chimica-aroma
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/malaxation-chemistry-extra-virgin-olive-oil-aroma
  resolved now: /en/blog/category/olive-oil-chemistry/malaxation-chemistry-extra-virgin-olive-oil-aroma
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/kneten-der-olivenpaste-chemie-aroma
  resolved now: /de/blog/kategorie/olivenolchemie/kneten-der-olivenpaste-chemie-aroma
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/mengen-van-olijfpasta-gramolatie-chemie-aroma
  resolved now: /nl/blog/categorie/olijfoliechemie/mengen-van-olijfpasta-gramolatie-chemie-aroma
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/aeltning-af-olivenpasta-kemi-og-aroma
  resolved now: /da/blog/kategori/olivenoliekemi/aeltning-af-olivenpasta-kemi-og-aroma
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/elting-av-olivenmasse-kjemisk-og-aroma
  resolved now: /no/blog/kategori/olivenoljekjemi/elting-av-olivenmasse-kjemisk-og-aroma
  missing fields: content
  issues: content falls back to Italian
  info: none

### chim-7 | Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità

- 🇮🇹 IT title: Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: filtrazione-olio-effetti-stabilita
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/extra-virgin-olive-oil-filtration-stability-effects
  resolved now: /en/blog/category/olive-oil-chemistry/extra-virgin-olive-oil-filtration-stability-effects
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/olivenoel-filtration-effekte-stabilitaet
  resolved now: /de/blog/kategorie/olivenolchemie/olivenoel-filtration-effekte-stabilitaet
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/olijfolie-filtratie-effecten-op-stabiliteit
  resolved now: /nl/blog/categorie/olijfoliechemie/olijfolie-filtratie-effecten-op-stabiliteit
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/olivenoliefiltrering-effekter-paa-vand-enzymer-og-stabilitet
  resolved now: /da/blog/kategori/olivenoliekemi/olivenoliefiltrering-effekter-paa-vand-enzymer-og-stabilitet
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/olivenoljefiltrering-effekter-paa-vann-enzymer-og-stabilitet
  resolved now: /no/blog/kategori/olivenoljekjemi/olivenoljefiltrering-effekter-paa-vann-enzymer-og-stabilitet
  missing fields: content
  issues: content falls back to Italian
  info: none

### com-2 | Abbinamenti con EVO fruttato leggero

- 🇮🇹 IT title: Abbinamenti con EVO fruttato leggero
- 🇮🇹 IT category: Consigli di acquisto
- 🇮🇹 IT slug: fruttato-leggero-abbinamenti
- 🇮🇹 IT url: /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/buying-guide/light-fruity-olive-oil-pairings
  resolved now: /en/blog/category/buying-guide/light-fruity-olive-oil-pairings
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/einkaufsfuhrer/leicht-fruchtiges-olivenoel-kombinationen
  resolved now: /de/blog/kategorie/einkaufsfuhrer/leicht-fruchtiges-olivenoel-kombinationen
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/koopgids/licht-fruitige-olijfolie-combinaties
  resolved now: /nl/blog/categorie/koopgids/licht-fruitige-olijfolie-combinaties
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/k-bsguide/let-frugtig-olivenolie-parringer
  resolved now: /da/blog/kategori/k-bsguide/let-frugtig-olivenolie-parringer
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/kj-psguide/lett-fruktig-olivenolje-parringer
  resolved now: /no/blog/kategori/kj-psguide/lett-fruktig-olivenolje-parringer
  missing fields: none
  issues: none
  info: none

### com-4 | Come e quando usare l'Olio EVO Fruttato Intenso

- 🇮🇹 IT title: Come e quando usare l'Olio EVO Fruttato Intenso
- 🇮🇹 IT category: Consigli di acquisto
- 🇮🇹 IT slug: fruttato-intenso-quando-usarlo
- 🇮🇹 IT url: /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/buying-guide/robust-intense-fruity-olive-oil-how-to-use
  resolved now: /en/blog/category/buying-guide/robust-intense-fruity-olive-oil-how-to-use
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/einkaufsfuhrer/intensiv-fruchtiges-olivenoel-anwendung
  resolved now: /de/blog/kategorie/einkaufsfuhrer/intensiv-fruchtiges-olivenoel-anwendung
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/koopgids/intensief-fruitige-olijfolie-gebruik
  resolved now: /nl/blog/categorie/koopgids/intensief-fruitige-olijfolie-gebruik
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/k-bsguide/intensiv-frugtig-olivenolie-brug
  resolved now: /da/blog/kategori/k-bsguide/intensiv-frugtig-olivenolie-brug
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/kj-psguide/intensiv-fruktig-olivenolje-bruk
  resolved now: /no/blog/kategori/kj-psguide/intensiv-fruktig-olivenolje-bruk
  missing fields: none
  issues: none
  info: none

### com-6 | Cos'è l'Olio Nuovo e perché conviene acquistarlo?

- 🇮🇹 IT title: Cos'è l'Olio Nuovo e perché conviene acquistarlo?
- 🇮🇹 IT category: Consigli di acquisto
- 🇮🇹 IT slug: olio-nuovo-cose-e-quanto-dura
- 🇮🇹 IT url: /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/buying-guide/what-is-new-olive-oil-benefits
  resolved now: /en/blog/category/buying-guide/what-is-new-olive-oil-benefits
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/einkaufsfuehrer/was-ist-frisches-olivenoel-vorteile
  resolved now: /de/blog/kategorie/einkaufsfuehrer/was-ist-frisches-olivenoel-vorteile
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/koopgids/wat-is-nieuwe-olijfolie-kopen
  resolved now: /nl/blog/categorie/koopgids/wat-is-nieuwe-olijfolie-kopen
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/koebsguide/hvad-er-ny-olivenolie-fordele
  resolved now: /da/blog/kategori/koebsguide/hvad-er-ny-olivenolie-fordele
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/kjoepsguide/hva-er-ny-olivenolje-fordeler
  resolved now: /no/blog/kategori/kjoepsguide/hva-er-ny-olivenolje-fordeler
  missing fields: none
  issues: none
  info: none

### com-8 | DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?

- 🇮🇹 IT title: DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?
- 🇮🇹 IT category: Consigli di acquisto
- 🇮🇹 IT slug: dop-igp-100-italiano-differenze
- 🇮🇹 IT url: /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/buying-guide/dop-igp-100-percent-italian-olive-oil-labels-explained
  resolved now: /en/blog/category/buying-guide/dop-igp-100-percent-italian-olive-oil-labels-explained
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/einkaufsfuhrer/gud-gga-100-prozent-italienisches-olivenoel-etiketten-erklaert
  resolved now: /de/blog/kategorie/einkaufsfuhrer/gud-gga-100-prozent-italienisches-olivenoel-etiketten-erklaert
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/koopgids/bob-bgp-100-procent-italiaanse-olijfolie-keurmerken-uitleg
  resolved now: /nl/blog/categorie/koopgids/bob-bgp-100-procent-italiaanse-olijfolie-keurmerken-uitleg
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/k-bsguide/bob-bgp-100-procent-italiensk-olivenolie-maerkater-forklaret
  resolved now: /da/blog/kategori/k-bsguide/bob-bgp-100-procent-italiensk-olivenolie-maerkater-forklaret
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/kj-psguide/dop-igp-100-prosent-italiensk-olivenolje-merking-forklart
  resolved now: /no/blog/kategori/kj-psguide/dop-igp-100-prosent-italiensk-olivenolje-merking-forklart
  missing fields: content
  issues: content falls back to Italian
  info: none

### dif-1 | Difetti dell'olio EVO: guida completa ai principali vizi sensoriali

- 🇮🇹 IT title: Difetti dell'olio EVO: guida completa ai principali vizi sensoriali
- 🇮🇹 IT category: Difetti dell'olio EVO
- 🇮🇹 IT slug: difetti-olio-evo-guida-completa
- 🇮🇹 IT url: /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-defects/extra-virgin-olive-oil-defects-guide
  resolved now: /en/blog/category/olive-oil-defects/extra-virgin-olive-oil-defects-guide
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolfehler/olivenoelfehler-erkennen-kompletter-leitfaden
  resolved now: /de/blog/kategorie/olivenolfehler/olivenoelfehler-erkennen-kompletter-leitfaden
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-defecten/olijfolie-defecten-herkennen-complete-gids
  resolved now: /nl/blog/categorie/olijfolie-defecten/olijfolie-defecten-herkennen-complete-gids
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliefejl/olivenoliefejl-guide-til-sensoriske-fejl
  resolved now: /da/blog/kategori/olivenoliefejl/olivenoliefejl-guide-til-sensoriske-fejl
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljefeil/olivenoljefeil-guide-til-sensoriske-feil
  resolved now: /no/blog/kategori/olivenoljefeil/olivenoljefeil-guide-til-sensoriske-feil
  missing fields: content
  issues: content falls back to Italian
  info: none

### dif-2 | Rancido: cos'è, perché succede e come evitarlo

- 🇮🇹 IT title: Rancido: cos'è, perché succede e come evitarlo
- 🇮🇹 IT category: Difetti dell'olio EVO
- 🇮🇹 IT slug: rancido-cause-prevenzione
- 🇮🇹 IT url: /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-defects/rancid-olive-oil-causes-prevention
  resolved now: /en/blog/category/olive-oil-defects/rancid-olive-oil-causes-prevention
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolfehler/ranziges-olivenoel-ursachen-vermeidung
  resolved now: /de/blog/kategorie/olivenolfehler/ranziges-olivenoel-ursachen-vermeidung
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-oorzaken-en-voorkomen
  resolved now: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-oorzaken-en-voorkomen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliefejl/harsk-olivenolie-aarsager-og-forebyggelse
  resolved now: /da/blog/kategori/olivenoliefejl/harsk-olivenolie-aarsager-og-forebyggelse
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljefeil/harsk-olivenolje-aarsaker-og-forebygging
  resolved now: /no/blog/kategori/olivenoljefeil/harsk-olivenolje-aarsaker-og-forebygging
  missing fields: content
  issues: content falls back to Italian
  info: none

### dif-3 | Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione

- 🇮🇹 IT title: Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione
- 🇮🇹 IT category: Difetti dell'olio EVO
- 🇮🇹 IT slug: difetto-avvinato-inacetito-olio
- 🇮🇹 IT url: /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-defects/winey-vinegary-defect-in-olive-oil-causes-detection
  resolved now: /en/blog/category/olive-oil-defects/winey-vinegary-defect-in-olive-oil-causes-detection
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolfehler/stichig-essigartiger-fehler-olivenoel-ursachen
  resolved now: /de/blog/kategorie/olivenolfehler/stichig-essigartiger-fehler-olivenoel-ursachen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-defecten/wijnachtig-azijnachtig-defect-olijfolie-oorzaken
  resolved now: /nl/blog/categorie/olijfolie-defecten/wijnachtig-azijnachtig-defect-olijfolie-oorzaken
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliefejl/vinedikkesmag-fejl-i-olivenolie-aarsager-og-forebyggelse
  resolved now: /da/blog/kategori/olivenoliefejl/vinedikkesmag-fejl-i-olivenolie-aarsager-og-forebyggelse
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljefeil/vinedikksmak-feil-i-olivenolje-aarsaker-og-forebygging
  resolved now: /no/blog/kategori/olivenoljefeil/vinedikksmak-feil-i-olivenolje-aarsaker-og-forebygging
  missing fields: content
  issues: content falls back to Italian
  info: none

### dif-4 | Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione

- 🇮🇹 IT title: Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione
- 🇮🇹 IT category: Difetti dell'olio EVO
- 🇮🇹 IT slug: difetto-muffa-morchia-olio
- 🇮🇹 IT url: /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-defects/musty-muddy-sediment-defects-olive-oil
  resolved now: /en/blog/category/olive-oil-defects/musty-muddy-sediment-defects-olive-oil
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolfehler/schimmel-und-schlammiger-bodensatz-olivenoelfehler
  resolved now: /de/blog/kategorie/olivenolfehler/schimmel-und-schlammiger-bodensatz-olivenoelfehler
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-defecten/schimmel-en-bezinksel-defecten-olijfolie
  resolved now: /nl/blog/categorie/olijfolie-defecten/schimmel-en-bezinksel-defecten-olijfolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliefejl/mug-og-bundfald-defekter-i-olivenolie-aarsager-og-forebyggelse
  resolved now: /da/blog/kategori/olivenoliefejl/mug-og-bundfald-defekter-i-olivenolie-aarsager-og-forebyggelse
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljefeil/mugg-og-bunndfall-defekter-i-olivenolje-aarsaker-og-forebygging
  resolved now: /no/blog/kategori/olivenoljefeil/mugg-og-bunndfall-defekter-i-olivenolje-aarsaker-og-forebygging
  missing fields: content
  issues: content falls back to Italian
  info: none

### faq-1 | FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa

- 🇮🇹 IT title: FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa
- 🇮🇹 IT category: Informazioni sull'olio EVO
- 🇮🇹 IT slug: faq-olio-evo
- 🇮🇹 IT url: /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-faq-questions
  resolved now: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-faq-questions
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenol-informationen/olivenoel-extra-faq-haeufige-fragen
  resolved now: /de/blog/kategorie/olivenol-informationen/olivenoel-extra-faq-haeufige-fragen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-veelgestelde-vragen-faq
  resolved now: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-veelgestelde-vragen-faq
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-faq-ofte-stillede-spoergsmaal
  resolved now: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-faq-ofte-stillede-spoergsmaal
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-faq-ofte-stilte-spoersmaal
  resolved now: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-faq-ofte-stilte-spoersmaal
  missing fields: content
  issues: content falls back to Italian
  info: none

### fid-1 | Come nasce il nostro olio: raccolta → frantoio → stoccaggio

- 🇮🇹 IT title: Come nasce il nostro olio: raccolta → frantoio → stoccaggio
- 🇮🇹 IT category: Il nostro frantoio
- 🇮🇹 IT slug: come-nasce-nostro-olio
- 🇮🇹 IT url: /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/our-olive-mill/how-our-olive-oil-is-made-harvest-mill-storage
  resolved now: /en/blog/category/our-olive-mill/how-our-olive-oil-is-made-harvest-mill-storage
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/unsere-olmuhle/wie-unser-olivenoel-entsteht-ernte-oelmuehle-lagerung
  resolved now: /de/blog/kategorie/unsere-olmuhle/wie-unser-olivenoel-entsteht-ernte-oelmuehle-lagerung
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/onze-olijfmolen/hoe-onze-olijfolie-wordt-gemaakt-oogst-persing
  resolved now: /nl/blog/categorie/onze-olijfmolen/hoe-onze-olijfolie-wordt-gemaakt-oogst-persing
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/vores-oliem-lle/hvordan-vores-olivenolie-bliver-til-hoest-oliemoelle
  resolved now: /da/blog/kategori/vores-oliem-lle/hvordan-vores-olivenolie-bliver-til-hoest-oliemoelle
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/var-oljem-lle/hvordan-vaar-olivenolje-blir-til-hoest-oljemoelle
  resolved now: /no/blog/kategori/var-oljem-lle/hvordan-vaar-olivenolje-blir-til-hoest-oljemoelle
  missing fields: content
  issues: content falls back to Italian
  info: none

### fid-2 | Come degustare l'olio EVO in 5 minuti: guida pratica per tutti

- 🇮🇹 IT title: Come degustare l'olio EVO in 5 minuti: guida pratica per tutti
- 🇮🇹 IT category: Il nostro frantoio
- 🇮🇹 IT slug: come-degustare-olio-5-minuti
- 🇮🇹 IT url: /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/our-olive-mill/how-to-taste-olive-oil-in-five-minutes
  resolved now: /en/blog/category/our-olive-mill/how-to-taste-olive-oil-in-five-minutes
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/unsere-olmuhle/olivenoel-verkosten-in-fuenf-minuten
  resolved now: /de/blog/kategorie/unsere-olmuhle/olivenoel-verkosten-in-fuenf-minuten
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/onze-olijfmolen/olijfolie-proeven-in-vijf-minuten
  resolved now: /nl/blog/categorie/onze-olijfmolen/olijfolie-proeven-in-vijf-minuten
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/vores-oliem-lle/smag-paa-olivenolie-paa-fem-minutter
  resolved now: /da/blog/kategori/vores-oliem-lle/smag-paa-olivenolie-paa-fem-minutter
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/var-oljem-lle/smak-paa-olivenolje-paa-fem-minutter
  resolved now: /no/blog/kategori/var-oljem-lle/smak-paa-olivenolje-paa-fem-minutter
  missing fields: content
  issues: content falls back to Italian
  info: none

### fid-3 | Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità

- 🇮🇹 IT title: Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità
- 🇮🇹 IT category: Il nostro frantoio
- 🇮🇹 IT slug: tracciabilita-lotto-analisi-qualita
- 🇮🇹 IT url: /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/our-olive-mill/olive-oil-traceability-batch-analysis-provenance
  resolved now: /en/blog/category/our-olive-mill/olive-oil-traceability-batch-analysis-provenance
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/unsere-olmuhle/rueckverfolgbarkeit-charge-laboranalyse-herkunft
  resolved now: /de/blog/kategorie/unsere-olmuhle/rueckverfolgbarkeit-charge-laboranalyse-herkunft
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/onze-olijfmolen/traceerbaarheid-partij-laboratoriumanalyse-herkomst
  resolved now: /nl/blog/categorie/onze-olijfmolen/traceerbaarheid-partij-laboratoriumanalyse-herkomst
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/vores-oliem-lle/sporbarhed-batchnummer-laboratorieanalyser-oersprungsland
  resolved now: /da/blog/kategori/vores-oliem-lle/sporbarhed-batchnummer-laboratorieanalyser-oersprungsland
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/var-oljem-lle/sporbarhet-batchnummer-laboratorieanalyser-opprinnelse
  resolved now: /no/blog/kategori/var-oljem-lle/sporbarhet-batchnummer-laboratorieanalyser-opprinnelse
  missing fields: content
  issues: content falls back to Italian
  info: none

### fid-4 | Perché l'olio cambia ogni anno: clima, resa, maturazione

- 🇮🇹 IT title: Perché l'olio cambia ogni anno: clima, resa, maturazione
- 🇮🇹 IT category: Il nostro frantoio
- 🇮🇹 IT slug: perche-olio-cambia-ogni-anno
- 🇮🇹 IT url: /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/our-olive-mill/why-olive-oil-changes-every-year-climate-yield
  resolved now: /en/blog/category/our-olive-mill/why-olive-oil-changes-every-year-climate-yield
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/unsere-olmuhle/warum-olivenoel-jedes-jahr-anders-schmeckt
  resolved now: /de/blog/kategorie/unsere-olmuhle/warum-olivenoel-jedes-jahr-anders-schmeckt
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/onze-olijfmolen/waarom-olijfolie-elk-jaar-verandert-klimaat-oogst
  resolved now: /nl/blog/categorie/onze-olijfmolen/waarom-olijfolie-elk-jaar-verandert-klimaat-oogst
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/vores-oliem-lle/hvorfor-olivenolie-aendrer-sig-hvert-aar-klima-udbytte
  resolved now: /da/blog/kategori/vores-oliem-lle/hvorfor-olivenolie-aendrer-sig-hvert-aar-klima-udbytte
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/var-oljem-lle/hvorfor-olivenolje-endrer-seg-hvert-aar-klima-utbytte
  resolved now: /no/blog/kategori/var-oljem-lle/hvorfor-olivenolje-endrer-seg-hvert-aar-klima-utbytte
  missing fields: content
  issues: content falls back to Italian
  info: none

### fid-5 | Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena

- 🇮🇹 IT title: Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena
- 🇮🇹 IT category: Il nostro frantoio
- 🇮🇹 IT slug: oleoturismo-degustazioni-frantoio
- 🇮🇹 IT url: /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/our-olive-mill/oleotourism-olive-oil-tours-mill-visits
  resolved now: /en/blog/category/our-olive-mill/oleotourism-olive-oil-tours-mill-visits
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/unsere-olmuhle/oleotourismus-oelmuehle-besichtigen-erlebnis
  resolved now: /de/blog/kategorie/unsere-olmuhle/oleotourismus-oelmuehle-besichtigen-erlebnis
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/onze-olijfmolen/oleotoerisme-olijfmolen-bezoeken-ervaring
  resolved now: /nl/blog/categorie/onze-olijfmolen/oleotoerisme-olijfmolen-bezoeken-ervaring
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/vores-oliem-lle/oleoturisme-besoeg-paa-oliemoelle-oplevelser
  resolved now: /da/blog/kategori/vores-oliem-lle/oleoturisme-besoeg-paa-oliemoelle-oplevelser
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/var-oljem-lle/oleoturisme-besoek-paa-oljemoelle-opplevelser
  resolved now: /no/blog/kategori/var-oljem-lle/oleoturisme-besoek-paa-oljemoelle-opplevelser
  missing fields: content
  issues: content falls back to Italian
  info: none

### glos-1 | Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro

- 🇮🇹 IT title: Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro
- 🇮🇹 IT category: Informazioni sull'olio EVO
- 🇮🇹 IT slug: glossario-olio-evo
- 🇮🇹 IT url: /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-glossary
  resolved now: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-glossary
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenol-informationen/olivenoel-glossar-fachbegriffe-erklaert
  resolved now: /de/blog/kategorie/olivenol-informationen/olivenoel-glossar-fachbegriffe-erklaert
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-woordenlijst
  resolved now: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-woordenlijst
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-ordbog
  resolved now: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-ordbog
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-ordliste
  resolved now: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-ordliste
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-1 | A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)

- 🇮🇹 IT title: A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)
- 🇮🇹 IT category: Informazioni sull'olio EVO
- 🇮🇹 IT slug: amaro-piccante-olio-non-e-difetto
- 🇮🇹 IT url: /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-information/bitterness-pungency-extra-virgin-olive-oil
  resolved now: /en/blog/category/olive-oil-information/bitterness-pungency-extra-virgin-olive-oil
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenol-informationen/bitterkeit-schaerfe-olivenoel-extra
  resolved now: /de/blog/kategorie/olivenol-informationen/bitterkeit-schaerfe-olivenoel-extra
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-informatie/bitterheid-prikkeling-extra-vierge-olijfolie
  resolved now: /nl/blog/categorie/olijfolie-informatie/bitterheid-prikkeling-extra-vierge-olijfolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenolie-information/bitterhed-skarphed-ekstra-jomfruolivenolie
  resolved now: /da/blog/kategori/olivenolie-information/bitterhed-skarphed-ekstra-jomfruolivenolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenolje-informasjon/bitterhet-skarphet-ekstra-jomfruolivenolje
  resolved now: /no/blog/kategori/olivenolje-informasjon/bitterhet-skarphet-ekstra-jomfruolivenolje
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-10 | Crudo o in cottura: quando usare l'EVO fa davvero la differenza

- 🇮🇹 IT title: Crudo o in cottura: quando usare l'EVO fa davvero la differenza
- 🇮🇹 IT category: Consumo corretto
- 🇮🇹 IT slug: crudo-vs-cottura-quando-usare-evo
- 🇮🇹 IT url: /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/proper-usage/raw-vs-cooked-when-extra-virgin-olive-oil-makes-difference
  resolved now: /en/blog/category/proper-usage/raw-vs-cooked-when-extra-virgin-olive-oil-makes-difference
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/richtiges-genie-en/roh-oder-gekocht-wann-olivenoel-extra-unterschied-macht
  resolved now: /de/blog/kategorie/richtiges-genie-en/roh-oder-gekocht-wann-olivenoel-extra-unterschied-macht
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/correct-gebruik/rauw-of-verwarmd-wanneer-olijfolie-verschil-maakt
  resolved now: /nl/blog/categorie/correct-gebruik/rauw-of-verwarmd-wanneer-olijfolie-verschil-maakt
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/korrekt-forbrug/raa-eller-tilberedt-hvornaar-olivenolie-goer-forskel
  resolved now: /da/blog/kategori/korrekt-forbrug/raa-eller-tilberedt-hvornaar-olivenolie-goer-forskel
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/riktig-bruk/raa-eller-tilberedt-naar-olivenolje-gjoer-forskjell
  resolved now: /no/blog/kategori/riktig-bruk/raa-eller-tilberedt-naar-olivenolje-gjoer-forskjell
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-2 | Come conservare l'olio EVO a casa: luce, ossigeno, temperatura

- 🇮🇹 IT title: Come conservare l'olio EVO a casa: luce, ossigeno, temperatura
- 🇮🇹 IT category: Conservazione
- 🇮🇹 IT slug: conservare-olio-casa
- 🇮🇹 IT url: /blog/categoria/conservazione/conservare-olio-casa
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/storage-preservation/how-to-store-extra-virgin-olive-oil-at-home
  resolved now: /en/blog/category/storage-preservation/how-to-store-extra-virgin-olive-oil-at-home
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/lagerung-aufbewahrung/olivenoel-extra-zuhause-lagern-tipps
  resolved now: /de/blog/kategorie/lagerung-aufbewahrung/olivenoel-extra-zuhause-lagern-tipps
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/opslag-bewaring/extra-vierge-olijfolie-thuis-bewaren
  resolved now: /nl/blog/categorie/opslag-bewaring/extra-vierge-olijfolie-thuis-bewaren
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/opbevaring/opbevaring-ekstra-jomfruolivenolie-hjemme
  resolved now: /da/blog/kategori/opbevaring/opbevaring-ekstra-jomfruolivenolie-hjemme
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/lagring/lagring-ekstra-jomfruolivenolje-hjemme
  resolved now: /no/blog/kategori/lagring/lagring-ekstra-jomfruolivenolje-hjemme
  missing fields: none
  issues: none
  info: none

### info-4 | Come capire se un olio EVO è rancido: segnali e cosa fare

- 🇮🇹 IT title: Come capire se un olio EVO è rancido: segnali e cosa fare
- 🇮🇹 IT category: Difetti dell'olio EVO
- 🇮🇹 IT slug: come-capire-olio-rancido
- 🇮🇹 IT url: /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-defects/how-to-tell-if-olive-oil-is-rancid
  resolved now: /en/blog/category/olive-oil-defects/how-to-tell-if-olive-oil-is-rancid
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolfehler/ranciges-olivenoel-erkennen-tipps
  resolved now: /de/blog/kategorie/olivenolfehler/ranciges-olivenoel-erkennen-tipps
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-herkennen-tips
  resolved now: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-herkennen-tips
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliefejl/harkent-harsk-olivenolie-tegn
  resolved now: /da/blog/kategori/olivenoliefejl/harkent-harsk-olivenolie-tegn
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljefeil/harkent-harsk-olivenolje-tegn
  resolved now: /no/blog/kategori/olivenoljefeil/harkent-harsk-olivenolje-tegn
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-5 | Colore dell'olio: il verde è sinonimo di migliore? (No)

- 🇮🇹 IT title: Colore dell'olio: il verde è sinonimo di migliore? (No)
- 🇮🇹 IT category: Informazioni sull'olio EVO
- 🇮🇹 IT slug: colore-olio-verde-migliore
- 🇮🇹 IT url: /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-information/olive-oil-color-myth-is-green-better
  resolved now: /en/blog/category/olive-oil-information/olive-oil-color-myth-is-green-better
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenol-informationen/farbe-olivenoel-ist-gruen-besser
  resolved now: /de/blog/kategorie/olivenol-informationen/farbe-olivenoel-ist-gruen-besser
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfolie-informatie/kleur-olijfolie-is-groen-beter
  resolved now: /nl/blog/categorie/olijfolie-informatie/kleur-olijfolie-is-groen-beter
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenolie-information/olivenoliefarve-er-groen-bedre
  resolved now: /da/blog/kategori/olivenolie-information/olivenoliefarve-er-groen-bedre
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenolje-informasjon/olivenoljefarge-er-groenn-bedre
  resolved now: /no/blog/kategori/olivenolje-informasjon/olivenoljefarge-er-groenn-bedre
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-6 | Punto di fumo dell'olio EVO: si può friggere con l'extravergine?

- 🇮🇹 IT title: Punto di fumo dell'olio EVO: si può friggere con l'extravergine?
- 🇮🇹 IT category: Consumo corretto
- 🇮🇹 IT slug: punto-di-fumo-friggere-evo
- 🇮🇹 IT url: /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/proper-usage/smoke-point-frying-with-extra-virgin-olive-oil
  resolved now: /en/blog/category/proper-usage/smoke-point-frying-with-extra-virgin-olive-oil
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/richtiges-genie-en/rauchpunkt-frittieren-mit-olivenoel-extra
  resolved now: /de/blog/kategorie/richtiges-genie-en/rauchpunkt-frittieren-mit-olivenoel-extra
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/correct-gebruik/rookpunt-frituren-met-extra-vierge-olijfolie
  resolved now: /nl/blog/categorie/correct-gebruik/rookpunt-frituren-met-extra-vierge-olijfolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/korrekt-forbrug/roegpunkt-friturestegning-med-ekstra-jomfruolivenolie
  resolved now: /da/blog/kategori/korrekt-forbrug/roegpunkt-friturestegning-med-ekstra-jomfruolivenolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/riktig-bruk/roykpunkt-fritering-med-ekstra-jomfruolivenolje
  resolved now: /no/blog/kategori/riktig-bruk/roykpunkt-fritering-med-ekstra-jomfruolivenolje
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-7 | Quante calorie ha l'olio EVO e quali sono le porzioni consigliate

- 🇮🇹 IT title: Quante calorie ha l'olio EVO e quali sono le porzioni consigliate
- 🇮🇹 IT category: Salute & Benessere
- 🇮🇹 IT slug: calorie-olio-evo-porzioni
- 🇮🇹 IT url: /blog/categoria/salute-benessere/calorie-olio-evo-porzioni
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/health-wellbeing/calories-extra-virgin-olive-oil-recommended-portions
  resolved now: /en/blog/category/health-wellbeing/calories-extra-virgin-olive-oil-recommended-portions
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/gesundheit-wohlbefinden/kalorien-olivenoel-extra-empfohlene-portionen
  resolved now: /de/blog/kategorie/gesundheit-wohlbefinden/kalorien-olivenoel-extra-empfohlene-portionen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/gezondheid-welzijn/calorieen-extra-vierge-olijfolie-porties
  resolved now: /nl/blog/categorie/gezondheid-welzijn/calorieen-extra-vierge-olijfolie-porties
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/sundhed-velv-re/kalorier-ekstra-jomfruolivenolie-anbefalede-portioner
  resolved now: /da/blog/kategori/sundhed-velv-re/kalorier-ekstra-jomfruolivenolie-anbefalede-portioner
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/helse-velv-re/kalorier-ekstra-jomfruolivenolje-anbefalte-porsjoner
  resolved now: /no/blog/kategori/helse-velv-re/kalorier-ekstra-jomfruolivenolje-anbefalte-porsjoner
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-8 | Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)

- 🇮🇹 IT title: Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)
- 🇮🇹 IT category: Salute & Benessere
- 🇮🇹 IT slug: olio-evo-salute-scienza-polifenoli
- 🇮🇹 IT url: /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/health-wellbeing/olive-oil-health-benefits-science-polyphenols
  resolved now: /en/blog/category/health-wellbeing/olive-oil-health-benefits-science-polyphenols
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/gesundheit-wohlbefinden/olivenoel-und-gesundheit-wissenschaft-polyphenole
  resolved now: /de/blog/kategorie/gesundheit-wohlbefinden/olivenoel-und-gesundheit-wissenschaft-polyphenole
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/gezondheid-welzijn/olijfolie-gezondheid-wetenschap-polifenolen
  resolved now: /nl/blog/categorie/gezondheid-welzijn/olijfolie-gezondheid-wetenschap-polifenolen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/sundhed-velv-re/olivenolie-sundhed-videnskab-polyfenoler
  resolved now: /da/blog/kategori/sundhed-velv-re/olivenolie-sundhed-videnskab-polyfenoler
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/helse-velv-re/olivenolie-sundhed-videnskab-polyfenoler
  resolved now: /no/blog/kategori/helse-velv-re/olivenolie-sundhed-videnskab-polyfenoler
  missing fields: content
  issues: content falls back to Italian
  info: none

### info-9 | I 7 errori più comuni nella conservazione dell'olio EVO in cucina

- 🇮🇹 IT title: I 7 errori più comuni nella conservazione dell'olio EVO in cucina
- 🇮🇹 IT category: Conservazione
- 🇮🇹 IT slug: errori-conservazione-olio-cucina
- 🇮🇹 IT url: /blog/categoria/conservazione/errori-conservazione-olio-cucina
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/storage-preservation/seven-common-mistakes-storing-olive-oil-kitchen
  resolved now: /en/blog/category/storage-preservation/seven-common-mistakes-storing-olive-oil-kitchen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/lagerung-aufbewahrung/sieben-fehler-lagerung-olivenoel-kueche
  resolved now: /de/blog/kategorie/lagerung-aufbewahrung/sieben-fehler-lagerung-olivenoel-kueche
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/opslag-bewaring/zeven-fouten-bewaren-olijfolie-keuken
  resolved now: /nl/blog/categorie/opslag-bewaring/zeven-fouten-bewaren-olijfolie-keuken
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opbevaring/syv-fejl-opbevaring-olivenolie-koekken
  resolved now: /da/blog/kategori/opbevaring/syv-fejl-opbevaring-olivenolie-koekken
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/lagring/syv-feil-lagring-olivenolje-kjoekken
  resolved now: /no/blog/kategori/lagring/syv-feil-lagring-olivenolje-kjoekken
  missing fields: content
  issues: content falls back to Italian
  info: none

### post-1 | I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana

- 🇮🇹 IT title: I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana
- 🇮🇹 IT category: Salute & Benessere
- 🇮🇹 IT slug: benefici-olio-evo-salute
- 🇮🇹 IT url: /blog/categoria/salute-benessere/benefici-olio-evo-salute
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/health-wellbeing/benefits-extra-virgin-olive-oil-health
  resolved now: /en/blog/category/health-wellbeing/benefits-extra-virgin-olive-oil-health
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/gesundheit-wohlbefinden/vorteile-extra-vergine-olivenoel-gesundheit
  resolved now: /de/blog/kategorie/gesundheit-wohlbefinden/vorteile-extra-vergine-olivenoel-gesundheit
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/gezondheid-welzijn/voordelen-extra-vierge-olijfolie-gezondheid
  resolved now: /nl/blog/categorie/gezondheid-welzijn/voordelen-extra-vierge-olijfolie-gezondheid
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/sundhed-velv-re/fordele-ekstra-jomfruolivenolie-sundhed
  resolved now: /da/blog/kategori/sundhed-velv-re/fordele-ekstra-jomfruolivenolie-sundhed
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/helse-velv-re/fordeler-ekstra-jomfruolivenolje-helse
  resolved now: /no/blog/kategori/helse-velv-re/fordeler-ekstra-jomfruolivenolje-helse
  missing fields: none
  issues: none
  info: none

### post-buy-2 | Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale

- 🇮🇹 IT title: Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale
- 🇮🇹 IT category: Consigli di acquisto
- 🇮🇹 IT slug: supermercato-vs-frantoio
- 🇮🇹 IT url: /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/buying-guide/supermarket-vs-olive-mill-price-artisanal-olive-oil
  resolved now: /en/blog/category/buying-guide/supermarket-vs-olive-mill-price-artisanal-olive-oil
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/einkaufsfuhrer/supermarkt-vs-oelmuehle-preis-handwerkliches-olivenoel
  resolved now: /de/blog/kategorie/einkaufsfuhrer/supermarkt-vs-oelmuehle-preis-handwerkliches-olivenoel
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/koopgids/supermarkt-vs-olijfmolen-prijs-ambachtelijke-olijfolie
  resolved now: /nl/blog/categorie/koopgids/supermarkt-vs-olijfmolen-prijs-ambachtelijke-olijfolie
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/k-bsguide/supermarked-vs-oliemoelle-prisen-paa-haandvaerksolivenolie
  resolved now: /da/blog/kategori/k-bsguide/supermarked-vs-oliemoelle-prisen-paa-haandvaerksolivenolie
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/kj-psguide/supermarked-vs-oljemolle-prisen-paa-haandverksolivenolje
  resolved now: /no/blog/kategori/kj-psguide/supermarked-vs-oljemolle-prisen-paa-haandverksolivenolje
  missing fields: none
  issues: none
  info: none

### post-chem-1 | L'acidità dell'Olio EVO: sfatiamo i miti comuni

- 🇮🇹 IT title: L'acidità dell'Olio EVO: sfatiamo i miti comuni
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: acidita-olio-evo
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/olive-oil-chemistry/acidity-extra-virgin-olive-oil-myths
  resolved now: /en/blog/category/olive-oil-chemistry/acidity-extra-virgin-olive-oil-myths
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/olivenolchemie/saeuregehalt-olivenoel-extra-mythen
  resolved now: /de/blog/kategorie/olivenolchemie/saeuregehalt-olivenoel-extra-mythen
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/olijfoliechemie/zuurgraad-extra-vierge-olijfolie-mythen
  resolved now: /nl/blog/categorie/olijfoliechemie/zuurgraad-extra-vierge-olijfolie-mythen
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/olivenoliekemi/syreindhold-ekstra-jomfruolivenolie-myter
  resolved now: /da/blog/kategori/olivenoliekemi/syreindhold-ekstra-jomfruolivenolie-myter
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/olivenoljekjemi/syreinnhold-ekstra-jomfruolivenolje-myter
  resolved now: /no/blog/kategori/olivenoljekjemi/syreinnhold-ekstra-jomfruolivenolje-myter
  missing fields: none
  issues: none
  info: none

### post-chem-2 | Polifenoli e Perossidi: come decifrare le analisi dell'olio

- 🇮🇹 IT title: Polifenoli e Perossidi: come decifrare le analisi dell'olio
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: polifenoli-e-perossidi
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/olive-oil-chemistry/polyphenols-peroxides-deciphering-olive-oil-analyses
  resolved now: /en/blog/category/olive-oil-chemistry/polyphenols-peroxides-deciphering-olive-oil-analyses
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/olivenolchemie/polyphenole-peroxide-olivenoel-analysen-verstehen
  resolved now: /de/blog/kategorie/olivenolchemie/polyphenole-peroxide-olivenoel-analysen-verstehen
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/olijfoliechemie/polifenolen-peroxiden-olijfolie-analyse-lezen
  resolved now: /nl/blog/categorie/olijfoliechemie/polifenolen-peroxiden-olijfolie-analyse-lezen
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/olivenoliekemi/polyfenoler-peroxider-forstaa-olivenolieanalyser
  resolved now: /da/blog/kategori/olivenoliekemi/polyfenoler-peroxider-forstaa-olivenolieanalyser
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/olivenoljekjemi/polyfenoler-peroksider-forstaa-olivenoljeanalyser
  resolved now: /no/blog/kategori/olivenoljekjemi/polyfenoler-peroksider-forstaa-olivenoljeanalyser
  missing fields: none
  issues: none
  info: none

### post-store-1 | Quanto dura un Olio EVO e come conservarlo al meglio

- 🇮🇹 IT title: Quanto dura un Olio EVO e come conservarlo al meglio
- 🇮🇹 IT category: Conservazione
- 🇮🇹 IT slug: quanto-dura-olio-evo
- 🇮🇹 IT url: /blog/categoria/conservazione/quanto-dura-olio-evo
- Needs work in: none
- Ready in: 🇬🇧 EN | 🇩🇪 DE | 🇳🇱 NL | 🇩🇰 DA | 🇳🇴 NO

- 🇬🇧 EN ✅ ready
  expected url: /en/blog/category/storage-preservation/how-long-does-extra-virgin-olive-oil-last-storage
  resolved now: /en/blog/category/storage-preservation/how-long-does-extra-virgin-olive-oil-last-storage
  missing fields: none
  issues: none
  info: none
- 🇩🇪 DE ✅ ready
  expected url: /de/blog/kategorie/lagerung-aufbewahrung/haltbarkeit-olivenoel-extra-lagerung-tipps
  resolved now: /de/blog/kategorie/lagerung-aufbewahrung/haltbarkeit-olivenoel-extra-lagerung-tipps
  missing fields: none
  issues: none
  info: none
- 🇳🇱 NL ✅ ready
  expected url: /nl/blog/categorie/opslag-bewaring/houdbaarheid-extra-vierge-olijfolie-bewaren-tips
  resolved now: /nl/blog/categorie/opslag-bewaring/houdbaarheid-extra-vierge-olijfolie-bewaren-tips
  missing fields: none
  issues: none
  info: none
- 🇩🇰 DA ✅ ready
  expected url: /da/blog/kategori/opbevaring/hvor-laenge-holder-ekstra-jomfruolivenolie-opbevaring
  resolved now: /da/blog/kategori/opbevaring/hvor-laenge-holder-ekstra-jomfruolivenolie-opbevaring
  missing fields: none
  issues: none
  info: none
- 🇳🇴 NO ✅ ready
  expected url: /no/blog/kategori/lagring/hvor-lenge-holder-ekstra-jomfruolivenolje-lagring
  resolved now: /no/blog/kategori/lagring/hvor-lenge-holder-ekstra-jomfruolivenolje-lagring
  missing fields: none
  issues: none
  info: none

### post-store-2 | Lattina o bottiglia scura? Quale conserva meglio l'olio EVO

- 🇮🇹 IT title: Lattina o bottiglia scura? Quale conserva meglio l'olio EVO
- 🇮🇹 IT category: Conservazione
- 🇮🇹 IT slug: bottiglia-scura-o-latta
- 🇮🇹 IT url: /blog/categoria/conservazione/bottiglia-scura-o-latta
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/storage-preservation/dark-glass-bottle-vs-tin-can-olive-oil-storage
  resolved now: /en/blog/category/storage-preservation/dark-glass-bottle-vs-tin-can-olive-oil-storage
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/lagerung-aufbewahrung/dunkle-glasflasche-oder-blechdose-olivenoel-aufbewahrung
  resolved now: /de/blog/kategorie/lagerung-aufbewahrung/dunkle-glasflasche-oder-blechdose-olivenoel-aufbewahrung
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/opslag-bewaring/donkere-glasfles-of-blik-extra-vierge-olijfolie-bewaren
  resolved now: /nl/blog/categorie/opslag-bewaring/donkere-glasfles-of-blik-extra-vierge-olijfolie-bewaren
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opbevaring/moerk-glasflaske-eller-dunk-hvad-bevarer-olivenolien-bedst
  resolved now: /da/blog/kategori/opbevaring/moerk-glasflaske-eller-dunk-hvad-bevarer-olivenolien-bedst
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/lagring/moerk-glassflaske-eller-blikkboks-hva-bevarer-olivenoljen-best
  resolved now: /no/blog/kategori/lagring/moerk-glassflaske-eller-blikkboks-hva-bevarer-olivenoljen-best
  missing fields: content
  issues: content falls back to Italian
  info: none

### post-use-1 | Friggere con l'olio extravergine: falso mito o realtà culinaria?

- 🇮🇹 IT title: Friggere con l'olio extravergine: falso mito o realtà culinaria?
- 🇮🇹 IT category: Consumo corretto
- 🇮🇹 IT slug: friggere-con-olio-evo
- 🇮🇹 IT url: /blog/categoria/consumo-corretto/friggere-con-olio-evo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/proper-usage/frying-with-extra-virgin-olive-oil-myth-or-reality
  resolved now: /en/blog/category/proper-usage/frying-with-extra-virgin-olive-oil-myth-or-reality
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/richtiges-genie-en/frittieren-mit-olivenoel-extra-mythos-oder-realitaet
  resolved now: /de/blog/kategorie/richtiges-genie-en/frittieren-mit-olivenoel-extra-mythos-oder-realitaet
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/correct-gebruik/frituren-met-extra-vierge-olijfolie-mythe-of-realiteit
  resolved now: /nl/blog/categorie/correct-gebruik/frituren-met-extra-vierge-olijfolie-mythe-of-realiteit
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/korrekt-forbrug/friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag
  resolved now: /da/blog/kategori/korrekt-forbrug/friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/riktig-bruk/fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet
  resolved now: /no/blog/kategori/riktig-bruk/fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet
  missing fields: content
  issues: content falls back to Italian
  info: none

### post-use-2 | Olio nuovo d'annata: come esaltarlo nei piatti a crudo

- 🇮🇹 IT title: Olio nuovo d'annata: come esaltarlo nei piatti a crudo
- 🇮🇹 IT category: Consumo corretto
- 🇮🇹 IT slug: esaltare-olio-nuovo-crudo
- 🇮🇹 IT url: /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/proper-usage/how-to-enjoy-fresh-new-olive-oil-raw
  resolved now: /en/blog/category/proper-usage/how-to-enjoy-fresh-new-olive-oil-raw
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/richtiges-genie-en/frisches-olivenoel-jahrgang-roh-geniessen
  resolved now: /de/blog/kategorie/richtiges-genie-en/frisches-olivenoel-jahrgang-roh-geniessen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/correct-gebruik/verse-nieuwe-olijfolie-rauw-gebruiken
  resolved now: /nl/blog/categorie/correct-gebruik/verse-nieuwe-olijfolie-rauw-gebruiken
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/korrekt-forbrug/frisk-ny-s-son-olivenolie-nyd-den-raa
  resolved now: /da/blog/kategori/korrekt-forbrug/frisk-ny-s-son-olivenolie-nyd-den-raa
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/riktig-bruk/frisk-ny-sesong-olivenolje-nyt-den-raa
  resolved now: /no/blog/kategori/riktig-bruk/frisk-ny-sesong-olivenolje-nyt-den-raa
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-1 | Miglior olio per la bruschetta: 3 profili e come scegliere

- 🇮🇹 IT title: Miglior olio per la bruschetta: 3 profili e come scegliere
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: miglior-olio-bruschetta
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/best-olive-oil-for-bruschetta
  resolved now: /en/blog/category/recipes-pairings/best-olive-oil-for-bruschetta
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-bruschetta
  resolved now: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-bruschetta
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-bruschetta
  resolved now: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-bruschetta
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-bruschetta
  resolved now: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-bruschetta
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-bruschetta
  resolved now: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-bruschetta
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-2 | Miglior olio per l'insalata: emulsione, sale e il giusto profilo

- 🇮🇹 IT title: Miglior olio per l'insalata: emulsione, sale e il giusto profilo
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-per-insalata
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-per-insalata
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/best-olive-oil-for-salad-dressing
  resolved now: /en/blog/category/recipes-pairings/best-olive-oil-for-salad-dressing
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-salat
  resolved now: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-salat
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-salade
  resolved now: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-salade
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-salat
  resolved now: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-salat
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-salat
  resolved now: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-salat
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-3 | Olio per la pasta aglio e olio: quale profilo aromatico scegliere

- 🇮🇹 IT title: Olio per la pasta aglio e olio: quale profilo aromatico scegliere
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-per-pasta-aglio-olio
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/best-olive-oil-for-garlic-oil-pasta
  resolved now: /en/blog/category/recipes-pairings/best-olive-oil-for-garlic-oil-pasta
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-spaghetti-aglio-olio
  resolved now: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-spaghetti-aglio-olio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pasta-aglio-olio
  resolved now: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pasta-aglio-olio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pasta-aglio-olio
  resolved now: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pasta-aglio-olio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pasta-aglio-olio
  resolved now: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pasta-aglio-olio
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-4 | Olio per legumi e zuppe: quale funziona meglio e come usarlo

- 🇮🇹 IT title: Olio per legumi e zuppe: quale funziona meglio e come usarlo
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-per-legumi-zuppe
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/best-olive-oil-for-soups-legumes
  resolved now: /en/blog/category/recipes-pairings/best-olive-oil-for-soups-legumes
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-suppen-und-eintoepfe
  resolved now: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-suppen-und-eintoepfe
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-soep-en-peulvruchten
  resolved now: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-soep-en-peulvruchten
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/olivenolie-til-baelgfrugter-supper
  resolved now: /da/blog/kategori/opskrifter-parringer/olivenolie-til-baelgfrugter-supper
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-belgfrukter-supper
  resolved now: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-belgfrukter-supper
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-5 | Pane e olio: mini guida degustazione per ospiti (e box assaggio)

- 🇮🇹 IT title: Pane e olio: mini guida degustazione per ospiti (e box assaggio)
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: pane-e-olio-degustazione
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/bread-and-olive-oil-tasting-guide-guests
  resolved now: /en/blog/category/recipes-pairings/bread-and-olive-oil-tasting-guide-guests
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/brot-und-olivenoel-verkostung-gaeste
  resolved now: /de/blog/kategorie/rezepte-kombinationen/brot-und-olivenoel-verkostung-gaeste
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/brood-en-olijfolie-proeverij-gasten
  resolved now: /nl/blog/categorie/recepten-combinaties/brood-en-olijfolie-proeverij-gasten
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/broed-og-olivenolie-smagningsguide-gaester
  resolved now: /da/blog/kategori/opskrifter-parringer/broed-og-olivenolie-smagningsguide-gaester
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/broed-og-olivenolje-smaksguide-gjester
  resolved now: /no/blog/kategori/oppskrifter-parringer/broed-og-olivenolje-smaksguide-gjester
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-6 | Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi

- 🇮🇹 IT title: Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-nei-dolci
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/baking-with-extra-virgin-olive-oil-desserts
  resolved now: /en/blog/category/recipes-pairings/baking-with-extra-virgin-olive-oil-desserts
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/backen-mit-olivenoel-extra-desserts
  resolved now: /de/blog/kategorie/rezepte-kombinationen/backen-mit-olivenoel-extra-desserts
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/bakken-met-extra-vierge-olijfolie
  resolved now: /nl/blog/categorie/recepten-combinaties/bakken-met-extra-vierge-olijfolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/bagning-med-ekstra-jomfruolivenolie
  resolved now: /da/blog/kategori/opskrifter-parringer/bagning-med-ekstra-jomfruolivenolie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/baking-med-ekstra-jomfruolivenolje
  resolved now: /no/blog/kategori/oppskrifter-parringer/baking-med-ekstra-jomfruolivenolje
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-7 | Olio su pesce crudo e carpaccio: quale scegliere e perché

- 🇮🇹 IT title: Olio su pesce crudo e carpaccio: quale scegliere e perché
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-per-pesce-crudo-carpaccio
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/olive-oil-for-raw-fish-carpaccio
  resolved now: /en/blog/category/recipes-pairings/olive-oil-for-raw-fish-carpaccio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-rohen-fisch-und-carpaccio
  resolved now: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-rohen-fisch-und-carpaccio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-rauwe-vis-en-carpaccio
  resolved now: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-rauwe-vis-en-carpaccio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/olivenolie-til-raa-fisk-og-carpaccio
  resolved now: /da/blog/kategori/opskrifter-parringer/olivenolie-til-raa-fisk-og-carpaccio
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-raa-fisk-og-carpaccio
  resolved now: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-raa-fisk-og-carpaccio
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-8 | Olio per carne alla griglia: fruttato intenso e il perché del contrasto

- 🇮🇹 IT title: Olio per carne alla griglia: fruttato intenso e il perché del contrasto
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-per-carne-grigliat
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/olive-oil-for-grilled-meat-intense-fruity
  resolved now: /en/blog/category/recipes-pairings/olive-oil-for-grilled-meat-intense-fruity
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-gegrilltes-fleisch-intensiv-fruchtig
  resolved now: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-gegrilltes-fleisch-intensiv-fruchtig
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-gegrild-vlees-intensief-fruitig
  resolved now: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-gegrild-vlees-intensief-fruitig
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/olivenolie-til-grillet-koed-intens-frugtighed
  resolved now: /da/blog/kategori/opskrifter-parringer/olivenolie-til-grillet-koed-intens-frugtighed
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-grillet-kjoett-intens-fruktighet
  resolved now: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-grillet-kjoett-intens-fruktighet
  missing fields: content
  issues: content falls back to Italian
  info: none

### ric-9 | Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo

- 🇮🇹 IT title: Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo
- 🇮🇹 IT category: Ricette e abbinamenti
- 🇮🇹 IT slug: olio-per-pizza
- 🇮🇹 IT url: /blog/categoria/ricette-e-abbinamenti/olio-per-pizza
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/recipes-pairings/olive-oil-for-pizza-raw-or-after-baking
  resolved now: /en/blog/category/recipes-pairings/olive-oil-for-pizza-raw-or-after-baking
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-pizza-roh-oder-nach-dem-backen
  resolved now: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-pizza-roh-oder-nach-dem-backen
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pizza-rauw-of-na-het-bakken
  resolved now: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pizza-rauw-of-na-het-bakken
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pizza-raa-eller-efter-bagning
  resolved now: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pizza-raa-eller-efter-bagning
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pizza-raa-eller-etter-steking
  resolved now: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pizza-raa-eller-etter-steking
  missing fields: content
  issues: content falls back to Italian
  info: none

### tec-1 | NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione

- 🇮🇹 IT title: NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: nmr-olio-oliva-analisi
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/nmr-spectroscopy-olive-oil-authentication-adulteration
  resolved now: /en/blog/category/olive-oil-chemistry/nmr-spectroscopy-olive-oil-authentication-adulteration
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/nmr-spektroskopie-olivenoel-authentifizierung-verfaelschung
  resolved now: /de/blog/kategorie/olivenolchemie/nmr-spektroskopie-olivenoel-authentifizierung-verfaelschung
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/nmr-spectroscopie-olijfolie-authenticatie-adulteratie
  resolved now: /nl/blog/categorie/olijfoliechemie/nmr-spectroscopie-olijfolie-authenticatie-adulteratie
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/nmr-spektroskopi-olivenolie-autentificering
  resolved now: /da/blog/kategori/olivenoliekemi/nmr-spektroskopi-olivenolie-autentificering
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/nmr-spektroskopi-olivenolje-autentisering
  resolved now: /no/blog/kategori/olivenoljekjemi/nmr-spektroskopi-olivenolje-autentisering
  missing fields: content
  issues: content falls back to Italian
  info: none

### tec-2 | Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli

- 🇮🇹 IT title: Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: spettrometria-massa-olio-oliva-gcms-lcms
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/olive-oil-mass-spectrometry-gc-ms-lc-ms
  resolved now: /en/blog/category/olive-oil-chemistry/olive-oil-mass-spectrometry-gc-ms-lc-ms
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/massenspektrometrie-olivenoel-gcms-lcms
  resolved now: /de/blog/kategorie/olivenolchemie/massenspektrometrie-olivenoel-gcms-lcms
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/massaspectrometrie-olijfolie-gcms-lcms
  resolved now: /nl/blog/categorie/olijfoliechemie/massaspectrometrie-olijfolie-gcms-lcms
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/massespektrometri-olivenolie-gc-ms-lc-ms
  resolved now: /da/blog/kategori/olivenoliekemi/massespektrometri-olivenolie-gc-ms-lc-ms
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/massespektrometri-olivenolje-gc-ms-lc-ms
  resolved now: /no/blog/kategori/olivenoljekjemi/massespektrometri-olivenolje-gc-ms-lc-ms
  missing fields: content
  issues: content falls back to Italian
  info: none

### tec-3 | Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa

- 🇮🇹 IT title: Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa
- 🇮🇹 IT category: Chimica dell'olio di oliva
- 🇮🇹 IT slug: metodi-iso-analisi-olio-oliva
- 🇮🇹 IT url: /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva
- Needs work in: 🇬🇧 EN content | 🇩🇪 DE content | 🇳🇱 NL content | 🇩🇰 DA content | 🇳🇴 NO content
- Ready in: none

- 🇬🇧 EN ⚠️ needs work
  expected url: /en/blog/category/olive-oil-chemistry/iso-methods-olive-oil-analysis-guide
  resolved now: /en/blog/category/olive-oil-chemistry/iso-methods-olive-oil-analysis-guide
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇪 DE ⚠️ needs work
  expected url: /de/blog/kategorie/olivenolchemie/iso-methoden-olivenoel-analyse-leitfaden
  resolved now: /de/blog/kategorie/olivenolchemie/iso-methoden-olivenoel-analyse-leitfaden
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇱 NL ⚠️ needs work
  expected url: /nl/blog/categorie/olijfoliechemie/iso-methoden-olijfolie-analyse-gids
  resolved now: /nl/blog/categorie/olijfoliechemie/iso-methoden-olijfolie-analyse-gids
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇩🇰 DA ⚠️ needs work
  expected url: /da/blog/kategori/olivenoliekemi/iso-metoder-til-olivenolieanalyse-guide
  resolved now: /da/blog/kategori/olivenoliekemi/iso-metoder-til-olivenolieanalyse-guide
  missing fields: content
  issues: content falls back to Italian
  info: none
- 🇳🇴 NO ⚠️ needs work
  expected url: /no/blog/kategori/olivenoljekjemi/iso-metoder-for-olivenoljeanalyse-guide
  resolved now: /no/blog/kategori/olivenoljekjemi/iso-metoder-for-olivenoljeanalyse-guide
  missing fields: content
  issues: content falls back to Italian
  info: none


## Locale Appendix


### 🇬🇧 EN

Coverage: 51/51 translation entries, 9 complete translations.

Full checklist:
- [ ] chim-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo | TARGET: /en/blog/category/olive-oil-chemistry/chemical-composition-extra-virgin-olive-oil | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/chemical-composition-extra-virgin-olive-oil | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile
- [ ] chim-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina | TARGET: /en/blog/category/olive-oil-chemistry/polyphenols-in-olive-oil-oleocanthal-oleuropein-hydroxytyrosol | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/polyphenols-in-olive-oil-oleocanthal-oleuropein-hydroxytyrosol | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati
- [ ] chim-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio | TARGET: /en/blog/category/olive-oil-chemistry/fatty-acid-profile-olive-oil-oleic-linoleic-palmitic | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/fatty-acid-profile-olive-oil-oleic-linoleic-palmitic | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto
- [ ] chim-4 | IT: /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura | TARGET: /en/blog/category/olive-oil-chemistry/peroxide-value-in-olive-oil-quality | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/peroxide-value-in-olive-oil-quality | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio
- [ ] chim-5 | IT: /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano | TARGET: /en/blog/category/olive-oil-chemistry/k232-k270-uv-extinction-coefficients-olive-oil | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/k232-k270-uv-extinction-coefficients-olive-oil | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: K232 e K270: cosa misurano e perché indicano la qualità dell'olio
- [ ] chim-6 | IT: /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma | TARGET: /en/blog/category/olive-oil-chemistry/malaxation-chemistry-extra-virgin-olive-oil-aroma | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/malaxation-chemistry-extra-virgin-olive-oil-aroma | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio
- [ ] chim-7 | IT: /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita | TARGET: /en/blog/category/olive-oil-chemistry/extra-virgin-olive-oil-filtration-stability-effects | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/extra-virgin-olive-oil-filtration-stability-effects | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità
- [x] com-2 | IT: /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti | TARGET: /en/blog/category/buying-guide/light-fruity-olive-oil-pairings | RESOLVED_NOW: /en/blog/category/buying-guide/light-fruity-olive-oil-pairings | MISSING: none | ISSUES: ok | TITLE_IT: Abbinamenti con EVO fruttato leggero
- [x] com-4 | IT: /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo | TARGET: /en/blog/category/buying-guide/robust-intense-fruity-olive-oil-how-to-use | RESOLVED_NOW: /en/blog/category/buying-guide/robust-intense-fruity-olive-oil-how-to-use | MISSING: none | ISSUES: ok | TITLE_IT: Come e quando usare l'Olio EVO Fruttato Intenso
- [x] com-6 | IT: /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura | TARGET: /en/blog/category/buying-guide/what-is-new-olive-oil-benefits | RESOLVED_NOW: /en/blog/category/buying-guide/what-is-new-olive-oil-benefits | MISSING: none | ISSUES: ok | TITLE_IT: Cos'è l'Olio Nuovo e perché conviene acquistarlo?
- [ ] com-8 | IT: /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze | TARGET: /en/blog/category/buying-guide/dop-igp-100-percent-italian-olive-oil-labels-explained | RESOLVED_NOW: /en/blog/category/buying-guide/dop-igp-100-percent-italian-olive-oil-labels-explained | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?
- [ ] dif-1 | IT: /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa | TARGET: /en/blog/category/olive-oil-defects/extra-virgin-olive-oil-defects-guide | RESOLVED_NOW: /en/blog/category/olive-oil-defects/extra-virgin-olive-oil-defects-guide | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetti dell'olio EVO: guida completa ai principali vizi sensoriali
- [ ] dif-2 | IT: /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione | TARGET: /en/blog/category/olive-oil-defects/rancid-olive-oil-causes-prevention | RESOLVED_NOW: /en/blog/category/olive-oil-defects/rancid-olive-oil-causes-prevention | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Rancido: cos'è, perché succede e come evitarlo
- [ ] dif-3 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio | TARGET: /en/blog/category/olive-oil-defects/winey-vinegary-defect-in-olive-oil-causes-detection | RESOLVED_NOW: /en/blog/category/olive-oil-defects/winey-vinegary-defect-in-olive-oil-causes-detection | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] dif-4 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio | TARGET: /en/blog/category/olive-oil-defects/musty-muddy-sediment-defects-olive-oil | RESOLVED_NOW: /en/blog/category/olive-oil-defects/musty-muddy-sediment-defects-olive-oil | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] faq-1 | IT: /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo | TARGET: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-faq-questions | RESOLVED_NOW: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-faq-questions | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa
- [ ] fid-1 | IT: /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio | TARGET: /en/blog/category/our-olive-mill/how-our-olive-oil-is-made-harvest-mill-storage | RESOLVED_NOW: /en/blog/category/our-olive-mill/how-our-olive-oil-is-made-harvest-mill-storage | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come nasce il nostro olio: raccolta → frantoio → stoccaggio
- [ ] fid-2 | IT: /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti | TARGET: /en/blog/category/our-olive-mill/how-to-taste-olive-oil-in-five-minutes | RESOLVED_NOW: /en/blog/category/our-olive-mill/how-to-taste-olive-oil-in-five-minutes | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come degustare l'olio EVO in 5 minuti: guida pratica per tutti
- [ ] fid-3 | IT: /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita | TARGET: /en/blog/category/our-olive-mill/olive-oil-traceability-batch-analysis-provenance | RESOLVED_NOW: /en/blog/category/our-olive-mill/olive-oil-traceability-batch-analysis-provenance | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità
- [ ] fid-4 | IT: /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno | TARGET: /en/blog/category/our-olive-mill/why-olive-oil-changes-every-year-climate-yield | RESOLVED_NOW: /en/blog/category/our-olive-mill/why-olive-oil-changes-every-year-climate-yield | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Perché l'olio cambia ogni anno: clima, resa, maturazione
- [ ] fid-5 | IT: /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio | TARGET: /en/blog/category/our-olive-mill/oleotourism-olive-oil-tours-mill-visits | RESOLVED_NOW: /en/blog/category/our-olive-mill/oleotourism-olive-oil-tours-mill-visits | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena
- [ ] glos-1 | IT: /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo | TARGET: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-glossary | RESOLVED_NOW: /en/blog/category/olive-oil-information/extra-virgin-olive-oil-glossary | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro
- [ ] info-1 | IT: /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto | TARGET: /en/blog/category/olive-oil-information/bitterness-pungency-extra-virgin-olive-oil | RESOLVED_NOW: /en/blog/category/olive-oil-information/bitterness-pungency-extra-virgin-olive-oil | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)
- [ ] info-10 | IT: /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo | TARGET: /en/blog/category/proper-usage/raw-vs-cooked-when-extra-virgin-olive-oil-makes-difference | RESOLVED_NOW: /en/blog/category/proper-usage/raw-vs-cooked-when-extra-virgin-olive-oil-makes-difference | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Crudo o in cottura: quando usare l'EVO fa davvero la differenza
- [x] info-2 | IT: /blog/categoria/conservazione/conservare-olio-casa | TARGET: /en/blog/category/storage-preservation/how-to-store-extra-virgin-olive-oil-at-home | RESOLVED_NOW: /en/blog/category/storage-preservation/how-to-store-extra-virgin-olive-oil-at-home | MISSING: none | ISSUES: ok | TITLE_IT: Come conservare l'olio EVO a casa: luce, ossigeno, temperatura
- [ ] info-4 | IT: /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido | TARGET: /en/blog/category/olive-oil-defects/how-to-tell-if-olive-oil-is-rancid | RESOLVED_NOW: /en/blog/category/olive-oil-defects/how-to-tell-if-olive-oil-is-rancid | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come capire se un olio EVO è rancido: segnali e cosa fare
- [ ] info-5 | IT: /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore | TARGET: /en/blog/category/olive-oil-information/olive-oil-color-myth-is-green-better | RESOLVED_NOW: /en/blog/category/olive-oil-information/olive-oil-color-myth-is-green-better | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Colore dell'olio: il verde è sinonimo di migliore? (No)
- [ ] info-6 | IT: /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo | TARGET: /en/blog/category/proper-usage/smoke-point-frying-with-extra-virgin-olive-oil | RESOLVED_NOW: /en/blog/category/proper-usage/smoke-point-frying-with-extra-virgin-olive-oil | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Punto di fumo dell'olio EVO: si può friggere con l'extravergine?
- [ ] info-7 | IT: /blog/categoria/salute-benessere/calorie-olio-evo-porzioni | TARGET: /en/blog/category/health-wellbeing/calories-extra-virgin-olive-oil-recommended-portions | RESOLVED_NOW: /en/blog/category/health-wellbeing/calories-extra-virgin-olive-oil-recommended-portions | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Quante calorie ha l'olio EVO e quali sono le porzioni consigliate
- [ ] info-8 | IT: /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli | TARGET: /en/blog/category/health-wellbeing/olive-oil-health-benefits-science-polyphenols | RESOLVED_NOW: /en/blog/category/health-wellbeing/olive-oil-health-benefits-science-polyphenols | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)
- [ ] info-9 | IT: /blog/categoria/conservazione/errori-conservazione-olio-cucina | TARGET: /en/blog/category/storage-preservation/seven-common-mistakes-storing-olive-oil-kitchen | RESOLVED_NOW: /en/blog/category/storage-preservation/seven-common-mistakes-storing-olive-oil-kitchen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: I 7 errori più comuni nella conservazione dell'olio EVO in cucina
- [x] post-1 | IT: /blog/categoria/salute-benessere/benefici-olio-evo-salute | TARGET: /en/blog/category/health-wellbeing/benefits-extra-virgin-olive-oil-health | RESOLVED_NOW: /en/blog/category/health-wellbeing/benefits-extra-virgin-olive-oil-health | MISSING: none | ISSUES: ok | TITLE_IT: I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana
- [x] post-buy-2 | IT: /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio | TARGET: /en/blog/category/buying-guide/supermarket-vs-olive-mill-price-artisanal-olive-oil | RESOLVED_NOW: /en/blog/category/buying-guide/supermarket-vs-olive-mill-price-artisanal-olive-oil | MISSING: none | ISSUES: ok | TITLE_IT: Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale
- [x] post-chem-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo | TARGET: /en/blog/category/olive-oil-chemistry/acidity-extra-virgin-olive-oil-myths | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/acidity-extra-virgin-olive-oil-myths | MISSING: none | ISSUES: ok | TITLE_IT: L'acidità dell'Olio EVO: sfatiamo i miti comuni
- [x] post-chem-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi | TARGET: /en/blog/category/olive-oil-chemistry/polyphenols-peroxides-deciphering-olive-oil-analyses | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/polyphenols-peroxides-deciphering-olive-oil-analyses | MISSING: none | ISSUES: ok | TITLE_IT: Polifenoli e Perossidi: come decifrare le analisi dell'olio
- [x] post-store-1 | IT: /blog/categoria/conservazione/quanto-dura-olio-evo | TARGET: /en/blog/category/storage-preservation/how-long-does-extra-virgin-olive-oil-last-storage | RESOLVED_NOW: /en/blog/category/storage-preservation/how-long-does-extra-virgin-olive-oil-last-storage | MISSING: none | ISSUES: ok | TITLE_IT: Quanto dura un Olio EVO e come conservarlo al meglio
- [ ] post-store-2 | IT: /blog/categoria/conservazione/bottiglia-scura-o-latta | TARGET: /en/blog/category/storage-preservation/dark-glass-bottle-vs-tin-can-olive-oil-storage | RESOLVED_NOW: /en/blog/category/storage-preservation/dark-glass-bottle-vs-tin-can-olive-oil-storage | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Lattina o bottiglia scura? Quale conserva meglio l'olio EVO
- [ ] post-use-1 | IT: /blog/categoria/consumo-corretto/friggere-con-olio-evo | TARGET: /en/blog/category/proper-usage/frying-with-extra-virgin-olive-oil-myth-or-reality | RESOLVED_NOW: /en/blog/category/proper-usage/frying-with-extra-virgin-olive-oil-myth-or-reality | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Friggere con l'olio extravergine: falso mito o realtà culinaria?
- [ ] post-use-2 | IT: /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo | TARGET: /en/blog/category/proper-usage/how-to-enjoy-fresh-new-olive-oil-raw | RESOLVED_NOW: /en/blog/category/proper-usage/how-to-enjoy-fresh-new-olive-oil-raw | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio nuovo d'annata: come esaltarlo nei piatti a crudo
- [ ] ric-1 | IT: /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta | TARGET: /en/blog/category/recipes-pairings/best-olive-oil-for-bruschetta | RESOLVED_NOW: /en/blog/category/recipes-pairings/best-olive-oil-for-bruschetta | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per la bruschetta: 3 profili e come scegliere
- [ ] ric-2 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-insalata | TARGET: /en/blog/category/recipes-pairings/best-olive-oil-for-salad-dressing | RESOLVED_NOW: /en/blog/category/recipes-pairings/best-olive-oil-for-salad-dressing | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per l'insalata: emulsione, sale e il giusto profilo
- [ ] ric-3 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio | TARGET: /en/blog/category/recipes-pairings/best-olive-oil-for-garlic-oil-pasta | RESOLVED_NOW: /en/blog/category/recipes-pairings/best-olive-oil-for-garlic-oil-pasta | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per la pasta aglio e olio: quale profilo aromatico scegliere
- [ ] ric-4 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe | TARGET: /en/blog/category/recipes-pairings/best-olive-oil-for-soups-legumes | RESOLVED_NOW: /en/blog/category/recipes-pairings/best-olive-oil-for-soups-legumes | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per legumi e zuppe: quale funziona meglio e come usarlo
- [ ] ric-5 | IT: /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione | TARGET: /en/blog/category/recipes-pairings/bread-and-olive-oil-tasting-guide-guests | RESOLVED_NOW: /en/blog/category/recipes-pairings/bread-and-olive-oil-tasting-guide-guests | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Pane e olio: mini guida degustazione per ospiti (e box assaggio)
- [ ] ric-6 | IT: /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci | TARGET: /en/blog/category/recipes-pairings/baking-with-extra-virgin-olive-oil-desserts | RESOLVED_NOW: /en/blog/category/recipes-pairings/baking-with-extra-virgin-olive-oil-desserts | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi
- [ ] ric-7 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio | TARGET: /en/blog/category/recipes-pairings/olive-oil-for-raw-fish-carpaccio | RESOLVED_NOW: /en/blog/category/recipes-pairings/olive-oil-for-raw-fish-carpaccio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio su pesce crudo e carpaccio: quale scegliere e perché
- [ ] ric-8 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat | TARGET: /en/blog/category/recipes-pairings/olive-oil-for-grilled-meat-intense-fruity | RESOLVED_NOW: /en/blog/category/recipes-pairings/olive-oil-for-grilled-meat-intense-fruity | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per carne alla griglia: fruttato intenso e il perché del contrasto
- [ ] ric-9 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pizza | TARGET: /en/blog/category/recipes-pairings/olive-oil-for-pizza-raw-or-after-baking | RESOLVED_NOW: /en/blog/category/recipes-pairings/olive-oil-for-pizza-raw-or-after-baking | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo
- [ ] tec-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi | TARGET: /en/blog/category/olive-oil-chemistry/nmr-spectroscopy-olive-oil-authentication-adulteration | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/nmr-spectroscopy-olive-oil-authentication-adulteration | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione
- [ ] tec-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms | TARGET: /en/blog/category/olive-oil-chemistry/olive-oil-mass-spectrometry-gc-ms-lc-ms | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/olive-oil-mass-spectrometry-gc-ms-lc-ms | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli
- [ ] tec-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva | TARGET: /en/blog/category/olive-oil-chemistry/iso-methods-olive-oil-analysis-guide | RESOLVED_NOW: /en/blog/category/olive-oil-chemistry/iso-methods-olive-oil-analysis-guide | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa

### 🇩🇪 DE

Coverage: 51/51 translation entries, 9 complete translations.

Full checklist:
- [ ] chim-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo | TARGET: /de/blog/kategorie/olivenolchemie/chemische-zusammensetzung-olivenoel-extra | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/chemische-zusammensetzung-olivenoel-extra | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile
- [ ] chim-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina | TARGET: /de/blog/kategorie/olivenolchemie/polyphenole-im-olivenoel-extra-oleocanthal-oleuropein-hydroxytyrosol | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/polyphenole-im-olivenoel-extra-oleocanthal-oleuropein-hydroxytyrosol | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati
- [ ] chim-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio | TARGET: /de/blog/kategorie/olivenolchemie/fettsaeureprofil-olivenoel-oelsaeure-linolsaeure-palmitinsaeure | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/fettsaeureprofil-olivenoel-oelsaeure-linolsaeure-palmitinsaeure | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto
- [ ] chim-4 | IT: /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura | TARGET: /de/blog/kategorie/olivenolchemie/peroxidzahl-olivenoel-bedeutung-qualitaet | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/peroxidzahl-olivenoel-bedeutung-qualitaet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio
- [ ] chim-5 | IT: /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano | TARGET: /de/blog/kategorie/olivenolchemie/k232-k270-uv-extinktionskoeffizienten-olivenoel | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/k232-k270-uv-extinktionskoeffizienten-olivenoel | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: K232 e K270: cosa misurano e perché indicano la qualità dell'olio
- [ ] chim-6 | IT: /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma | TARGET: /de/blog/kategorie/olivenolchemie/kneten-der-olivenpaste-chemie-aroma | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/kneten-der-olivenpaste-chemie-aroma | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio
- [ ] chim-7 | IT: /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita | TARGET: /de/blog/kategorie/olivenolchemie/olivenoel-filtration-effekte-stabilitaet | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/olivenoel-filtration-effekte-stabilitaet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità
- [x] com-2 | IT: /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti | TARGET: /de/blog/kategorie/einkaufsfuhrer/leicht-fruchtiges-olivenoel-kombinationen | RESOLVED_NOW: /de/blog/kategorie/einkaufsfuhrer/leicht-fruchtiges-olivenoel-kombinationen | MISSING: none | ISSUES: ok | TITLE_IT: Abbinamenti con EVO fruttato leggero
- [x] com-4 | IT: /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo | TARGET: /de/blog/kategorie/einkaufsfuhrer/intensiv-fruchtiges-olivenoel-anwendung | RESOLVED_NOW: /de/blog/kategorie/einkaufsfuhrer/intensiv-fruchtiges-olivenoel-anwendung | MISSING: none | ISSUES: ok | TITLE_IT: Come e quando usare l'Olio EVO Fruttato Intenso
- [x] com-6 | IT: /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura | TARGET: /de/blog/kategorie/einkaufsfuehrer/was-ist-frisches-olivenoel-vorteile | RESOLVED_NOW: /de/blog/kategorie/einkaufsfuehrer/was-ist-frisches-olivenoel-vorteile | MISSING: none | ISSUES: ok | TITLE_IT: Cos'è l'Olio Nuovo e perché conviene acquistarlo?
- [ ] com-8 | IT: /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze | TARGET: /de/blog/kategorie/einkaufsfuhrer/gud-gga-100-prozent-italienisches-olivenoel-etiketten-erklaert | RESOLVED_NOW: /de/blog/kategorie/einkaufsfuhrer/gud-gga-100-prozent-italienisches-olivenoel-etiketten-erklaert | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?
- [ ] dif-1 | IT: /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa | TARGET: /de/blog/kategorie/olivenolfehler/olivenoelfehler-erkennen-kompletter-leitfaden | RESOLVED_NOW: /de/blog/kategorie/olivenolfehler/olivenoelfehler-erkennen-kompletter-leitfaden | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetti dell'olio EVO: guida completa ai principali vizi sensoriali
- [ ] dif-2 | IT: /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione | TARGET: /de/blog/kategorie/olivenolfehler/ranziges-olivenoel-ursachen-vermeidung | RESOLVED_NOW: /de/blog/kategorie/olivenolfehler/ranziges-olivenoel-ursachen-vermeidung | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Rancido: cos'è, perché succede e come evitarlo
- [ ] dif-3 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio | TARGET: /de/blog/kategorie/olivenolfehler/stichig-essigartiger-fehler-olivenoel-ursachen | RESOLVED_NOW: /de/blog/kategorie/olivenolfehler/stichig-essigartiger-fehler-olivenoel-ursachen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] dif-4 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio | TARGET: /de/blog/kategorie/olivenolfehler/schimmel-und-schlammiger-bodensatz-olivenoelfehler | RESOLVED_NOW: /de/blog/kategorie/olivenolfehler/schimmel-und-schlammiger-bodensatz-olivenoelfehler | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] faq-1 | IT: /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo | TARGET: /de/blog/kategorie/olivenol-informationen/olivenoel-extra-faq-haeufige-fragen | RESOLVED_NOW: /de/blog/kategorie/olivenol-informationen/olivenoel-extra-faq-haeufige-fragen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa
- [ ] fid-1 | IT: /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio | TARGET: /de/blog/kategorie/unsere-olmuhle/wie-unser-olivenoel-entsteht-ernte-oelmuehle-lagerung | RESOLVED_NOW: /de/blog/kategorie/unsere-olmuhle/wie-unser-olivenoel-entsteht-ernte-oelmuehle-lagerung | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come nasce il nostro olio: raccolta → frantoio → stoccaggio
- [ ] fid-2 | IT: /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti | TARGET: /de/blog/kategorie/unsere-olmuhle/olivenoel-verkosten-in-fuenf-minuten | RESOLVED_NOW: /de/blog/kategorie/unsere-olmuhle/olivenoel-verkosten-in-fuenf-minuten | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come degustare l'olio EVO in 5 minuti: guida pratica per tutti
- [ ] fid-3 | IT: /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita | TARGET: /de/blog/kategorie/unsere-olmuhle/rueckverfolgbarkeit-charge-laboranalyse-herkunft | RESOLVED_NOW: /de/blog/kategorie/unsere-olmuhle/rueckverfolgbarkeit-charge-laboranalyse-herkunft | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità
- [ ] fid-4 | IT: /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno | TARGET: /de/blog/kategorie/unsere-olmuhle/warum-olivenoel-jedes-jahr-anders-schmeckt | RESOLVED_NOW: /de/blog/kategorie/unsere-olmuhle/warum-olivenoel-jedes-jahr-anders-schmeckt | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Perché l'olio cambia ogni anno: clima, resa, maturazione
- [ ] fid-5 | IT: /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio | TARGET: /de/blog/kategorie/unsere-olmuhle/oleotourismus-oelmuehle-besichtigen-erlebnis | RESOLVED_NOW: /de/blog/kategorie/unsere-olmuhle/oleotourismus-oelmuehle-besichtigen-erlebnis | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena
- [ ] glos-1 | IT: /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo | TARGET: /de/blog/kategorie/olivenol-informationen/olivenoel-glossar-fachbegriffe-erklaert | RESOLVED_NOW: /de/blog/kategorie/olivenol-informationen/olivenoel-glossar-fachbegriffe-erklaert | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro
- [ ] info-1 | IT: /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto | TARGET: /de/blog/kategorie/olivenol-informationen/bitterkeit-schaerfe-olivenoel-extra | RESOLVED_NOW: /de/blog/kategorie/olivenol-informationen/bitterkeit-schaerfe-olivenoel-extra | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)
- [ ] info-10 | IT: /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo | TARGET: /de/blog/kategorie/richtiges-genie-en/roh-oder-gekocht-wann-olivenoel-extra-unterschied-macht | RESOLVED_NOW: /de/blog/kategorie/richtiges-genie-en/roh-oder-gekocht-wann-olivenoel-extra-unterschied-macht | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Crudo o in cottura: quando usare l'EVO fa davvero la differenza
- [x] info-2 | IT: /blog/categoria/conservazione/conservare-olio-casa | TARGET: /de/blog/kategorie/lagerung-aufbewahrung/olivenoel-extra-zuhause-lagern-tipps | RESOLVED_NOW: /de/blog/kategorie/lagerung-aufbewahrung/olivenoel-extra-zuhause-lagern-tipps | MISSING: none | ISSUES: ok | TITLE_IT: Come conservare l'olio EVO a casa: luce, ossigeno, temperatura
- [ ] info-4 | IT: /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido | TARGET: /de/blog/kategorie/olivenolfehler/ranciges-olivenoel-erkennen-tipps | RESOLVED_NOW: /de/blog/kategorie/olivenolfehler/ranciges-olivenoel-erkennen-tipps | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come capire se un olio EVO è rancido: segnali e cosa fare
- [ ] info-5 | IT: /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore | TARGET: /de/blog/kategorie/olivenol-informationen/farbe-olivenoel-ist-gruen-besser | RESOLVED_NOW: /de/blog/kategorie/olivenol-informationen/farbe-olivenoel-ist-gruen-besser | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Colore dell'olio: il verde è sinonimo di migliore? (No)
- [ ] info-6 | IT: /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo | TARGET: /de/blog/kategorie/richtiges-genie-en/rauchpunkt-frittieren-mit-olivenoel-extra | RESOLVED_NOW: /de/blog/kategorie/richtiges-genie-en/rauchpunkt-frittieren-mit-olivenoel-extra | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Punto di fumo dell'olio EVO: si può friggere con l'extravergine?
- [ ] info-7 | IT: /blog/categoria/salute-benessere/calorie-olio-evo-porzioni | TARGET: /de/blog/kategorie/gesundheit-wohlbefinden/kalorien-olivenoel-extra-empfohlene-portionen | RESOLVED_NOW: /de/blog/kategorie/gesundheit-wohlbefinden/kalorien-olivenoel-extra-empfohlene-portionen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Quante calorie ha l'olio EVO e quali sono le porzioni consigliate
- [ ] info-8 | IT: /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli | TARGET: /de/blog/kategorie/gesundheit-wohlbefinden/olivenoel-und-gesundheit-wissenschaft-polyphenole | RESOLVED_NOW: /de/blog/kategorie/gesundheit-wohlbefinden/olivenoel-und-gesundheit-wissenschaft-polyphenole | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)
- [ ] info-9 | IT: /blog/categoria/conservazione/errori-conservazione-olio-cucina | TARGET: /de/blog/kategorie/lagerung-aufbewahrung/sieben-fehler-lagerung-olivenoel-kueche | RESOLVED_NOW: /de/blog/kategorie/lagerung-aufbewahrung/sieben-fehler-lagerung-olivenoel-kueche | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: I 7 errori più comuni nella conservazione dell'olio EVO in cucina
- [x] post-1 | IT: /blog/categoria/salute-benessere/benefici-olio-evo-salute | TARGET: /de/blog/kategorie/gesundheit-wohlbefinden/vorteile-extra-vergine-olivenoel-gesundheit | RESOLVED_NOW: /de/blog/kategorie/gesundheit-wohlbefinden/vorteile-extra-vergine-olivenoel-gesundheit | MISSING: none | ISSUES: ok | TITLE_IT: I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana
- [x] post-buy-2 | IT: /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio | TARGET: /de/blog/kategorie/einkaufsfuhrer/supermarkt-vs-oelmuehle-preis-handwerkliches-olivenoel | RESOLVED_NOW: /de/blog/kategorie/einkaufsfuhrer/supermarkt-vs-oelmuehle-preis-handwerkliches-olivenoel | MISSING: none | ISSUES: ok | TITLE_IT: Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale
- [x] post-chem-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo | TARGET: /de/blog/kategorie/olivenolchemie/saeuregehalt-olivenoel-extra-mythen | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/saeuregehalt-olivenoel-extra-mythen | MISSING: none | ISSUES: ok | TITLE_IT: L'acidità dell'Olio EVO: sfatiamo i miti comuni
- [x] post-chem-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi | TARGET: /de/blog/kategorie/olivenolchemie/polyphenole-peroxide-olivenoel-analysen-verstehen | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/polyphenole-peroxide-olivenoel-analysen-verstehen | MISSING: none | ISSUES: ok | TITLE_IT: Polifenoli e Perossidi: come decifrare le analisi dell'olio
- [x] post-store-1 | IT: /blog/categoria/conservazione/quanto-dura-olio-evo | TARGET: /de/blog/kategorie/lagerung-aufbewahrung/haltbarkeit-olivenoel-extra-lagerung-tipps | RESOLVED_NOW: /de/blog/kategorie/lagerung-aufbewahrung/haltbarkeit-olivenoel-extra-lagerung-tipps | MISSING: none | ISSUES: ok | TITLE_IT: Quanto dura un Olio EVO e come conservarlo al meglio
- [ ] post-store-2 | IT: /blog/categoria/conservazione/bottiglia-scura-o-latta | TARGET: /de/blog/kategorie/lagerung-aufbewahrung/dunkle-glasflasche-oder-blechdose-olivenoel-aufbewahrung | RESOLVED_NOW: /de/blog/kategorie/lagerung-aufbewahrung/dunkle-glasflasche-oder-blechdose-olivenoel-aufbewahrung | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Lattina o bottiglia scura? Quale conserva meglio l'olio EVO
- [ ] post-use-1 | IT: /blog/categoria/consumo-corretto/friggere-con-olio-evo | TARGET: /de/blog/kategorie/richtiges-genie-en/frittieren-mit-olivenoel-extra-mythos-oder-realitaet | RESOLVED_NOW: /de/blog/kategorie/richtiges-genie-en/frittieren-mit-olivenoel-extra-mythos-oder-realitaet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Friggere con l'olio extravergine: falso mito o realtà culinaria?
- [ ] post-use-2 | IT: /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo | TARGET: /de/blog/kategorie/richtiges-genie-en/frisches-olivenoel-jahrgang-roh-geniessen | RESOLVED_NOW: /de/blog/kategorie/richtiges-genie-en/frisches-olivenoel-jahrgang-roh-geniessen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio nuovo d'annata: come esaltarlo nei piatti a crudo
- [ ] ric-1 | IT: /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta | TARGET: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-bruschetta | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-bruschetta | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per la bruschetta: 3 profili e come scegliere
- [ ] ric-2 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-insalata | TARGET: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-salat | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/bestes-olivenoel-fuer-salat | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per l'insalata: emulsione, sale e il giusto profilo
- [ ] ric-3 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio | TARGET: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-spaghetti-aglio-olio | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-spaghetti-aglio-olio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per la pasta aglio e olio: quale profilo aromatico scegliere
- [ ] ric-4 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe | TARGET: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-suppen-und-eintoepfe | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-suppen-und-eintoepfe | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per legumi e zuppe: quale funziona meglio e come usarlo
- [ ] ric-5 | IT: /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione | TARGET: /de/blog/kategorie/rezepte-kombinationen/brot-und-olivenoel-verkostung-gaeste | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/brot-und-olivenoel-verkostung-gaeste | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Pane e olio: mini guida degustazione per ospiti (e box assaggio)
- [ ] ric-6 | IT: /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci | TARGET: /de/blog/kategorie/rezepte-kombinationen/backen-mit-olivenoel-extra-desserts | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/backen-mit-olivenoel-extra-desserts | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi
- [ ] ric-7 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio | TARGET: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-rohen-fisch-und-carpaccio | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-rohen-fisch-und-carpaccio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio su pesce crudo e carpaccio: quale scegliere e perché
- [ ] ric-8 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat | TARGET: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-gegrilltes-fleisch-intensiv-fruchtig | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-gegrilltes-fleisch-intensiv-fruchtig | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per carne alla griglia: fruttato intenso e il perché del contrasto
- [ ] ric-9 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pizza | TARGET: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-pizza-roh-oder-nach-dem-backen | RESOLVED_NOW: /de/blog/kategorie/rezepte-kombinationen/olivenoel-fuer-pizza-roh-oder-nach-dem-backen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo
- [ ] tec-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi | TARGET: /de/blog/kategorie/olivenolchemie/nmr-spektroskopie-olivenoel-authentifizierung-verfaelschung | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/nmr-spektroskopie-olivenoel-authentifizierung-verfaelschung | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione
- [ ] tec-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms | TARGET: /de/blog/kategorie/olivenolchemie/massenspektrometrie-olivenoel-gcms-lcms | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/massenspektrometrie-olivenoel-gcms-lcms | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli
- [ ] tec-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva | TARGET: /de/blog/kategorie/olivenolchemie/iso-methoden-olivenoel-analyse-leitfaden | RESOLVED_NOW: /de/blog/kategorie/olivenolchemie/iso-methoden-olivenoel-analyse-leitfaden | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa

### 🇳🇱 NL

Coverage: 51/51 translation entries, 9 complete translations.

Full checklist:
- [ ] chim-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo | TARGET: /nl/blog/categorie/olijfoliechemie/chemische-samenstelling-extra-vierge-olijfolie | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/chemische-samenstelling-extra-vierge-olijfolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile
- [ ] chim-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina | TARGET: /nl/blog/categorie/olijfoliechemie/polifenolen-in-olijfolie-oleocanthal-oleuropeine-hydroxytyrosol | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/polifenolen-in-olijfolie-oleocanthal-oleuropeine-hydroxytyrosol | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati
- [ ] chim-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio | TARGET: /nl/blog/categorie/olijfoliechemie/vetzuurprofiel-olijfolie-oliezuur-linolzuur-palmitinezuur | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/vetzuurprofiel-olijfolie-oliezuur-linolzuur-palmitinezuur | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto
- [ ] chim-4 | IT: /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura | TARGET: /nl/blog/categorie/olijfoliechemie/peroxidegetal-olijfolie-kwaliteit-betekenis | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/peroxidegetal-olijfolie-kwaliteit-betekenis | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio
- [ ] chim-5 | IT: /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano | TARGET: /nl/blog/categorie/olijfoliechemie/k232-en-k270-uv-extinctiecoefficienten-olijfolie | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/k232-en-k270-uv-extinctiecoefficienten-olijfolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: K232 e K270: cosa misurano e perché indicano la qualità dell'olio
- [ ] chim-6 | IT: /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma | TARGET: /nl/blog/categorie/olijfoliechemie/mengen-van-olijfpasta-gramolatie-chemie-aroma | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/mengen-van-olijfpasta-gramolatie-chemie-aroma | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio
- [ ] chim-7 | IT: /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita | TARGET: /nl/blog/categorie/olijfoliechemie/olijfolie-filtratie-effecten-op-stabiliteit | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/olijfolie-filtratie-effecten-op-stabiliteit | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità
- [x] com-2 | IT: /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti | TARGET: /nl/blog/categorie/koopgids/licht-fruitige-olijfolie-combinaties | RESOLVED_NOW: /nl/blog/categorie/koopgids/licht-fruitige-olijfolie-combinaties | MISSING: none | ISSUES: ok | TITLE_IT: Abbinamenti con EVO fruttato leggero
- [x] com-4 | IT: /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo | TARGET: /nl/blog/categorie/koopgids/intensief-fruitige-olijfolie-gebruik | RESOLVED_NOW: /nl/blog/categorie/koopgids/intensief-fruitige-olijfolie-gebruik | MISSING: none | ISSUES: ok | TITLE_IT: Come e quando usare l'Olio EVO Fruttato Intenso
- [x] com-6 | IT: /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura | TARGET: /nl/blog/categorie/koopgids/wat-is-nieuwe-olijfolie-kopen | RESOLVED_NOW: /nl/blog/categorie/koopgids/wat-is-nieuwe-olijfolie-kopen | MISSING: none | ISSUES: ok | TITLE_IT: Cos'è l'Olio Nuovo e perché conviene acquistarlo?
- [ ] com-8 | IT: /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze | TARGET: /nl/blog/categorie/koopgids/bob-bgp-100-procent-italiaanse-olijfolie-keurmerken-uitleg | RESOLVED_NOW: /nl/blog/categorie/koopgids/bob-bgp-100-procent-italiaanse-olijfolie-keurmerken-uitleg | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?
- [ ] dif-1 | IT: /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa | TARGET: /nl/blog/categorie/olijfolie-defecten/olijfolie-defecten-herkennen-complete-gids | RESOLVED_NOW: /nl/blog/categorie/olijfolie-defecten/olijfolie-defecten-herkennen-complete-gids | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetti dell'olio EVO: guida completa ai principali vizi sensoriali
- [ ] dif-2 | IT: /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione | TARGET: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-oorzaken-en-voorkomen | RESOLVED_NOW: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-oorzaken-en-voorkomen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Rancido: cos'è, perché succede e come evitarlo
- [ ] dif-3 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio | TARGET: /nl/blog/categorie/olijfolie-defecten/wijnachtig-azijnachtig-defect-olijfolie-oorzaken | RESOLVED_NOW: /nl/blog/categorie/olijfolie-defecten/wijnachtig-azijnachtig-defect-olijfolie-oorzaken | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] dif-4 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio | TARGET: /nl/blog/categorie/olijfolie-defecten/schimmel-en-bezinksel-defecten-olijfolie | RESOLVED_NOW: /nl/blog/categorie/olijfolie-defecten/schimmel-en-bezinksel-defecten-olijfolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] faq-1 | IT: /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo | TARGET: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-veelgestelde-vragen-faq | RESOLVED_NOW: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-veelgestelde-vragen-faq | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa
- [ ] fid-1 | IT: /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio | TARGET: /nl/blog/categorie/onze-olijfmolen/hoe-onze-olijfolie-wordt-gemaakt-oogst-persing | RESOLVED_NOW: /nl/blog/categorie/onze-olijfmolen/hoe-onze-olijfolie-wordt-gemaakt-oogst-persing | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come nasce il nostro olio: raccolta → frantoio → stoccaggio
- [ ] fid-2 | IT: /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti | TARGET: /nl/blog/categorie/onze-olijfmolen/olijfolie-proeven-in-vijf-minuten | RESOLVED_NOW: /nl/blog/categorie/onze-olijfmolen/olijfolie-proeven-in-vijf-minuten | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come degustare l'olio EVO in 5 minuti: guida pratica per tutti
- [ ] fid-3 | IT: /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita | TARGET: /nl/blog/categorie/onze-olijfmolen/traceerbaarheid-partij-laboratoriumanalyse-herkomst | RESOLVED_NOW: /nl/blog/categorie/onze-olijfmolen/traceerbaarheid-partij-laboratoriumanalyse-herkomst | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità
- [ ] fid-4 | IT: /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno | TARGET: /nl/blog/categorie/onze-olijfmolen/waarom-olijfolie-elk-jaar-verandert-klimaat-oogst | RESOLVED_NOW: /nl/blog/categorie/onze-olijfmolen/waarom-olijfolie-elk-jaar-verandert-klimaat-oogst | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Perché l'olio cambia ogni anno: clima, resa, maturazione
- [ ] fid-5 | IT: /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio | TARGET: /nl/blog/categorie/onze-olijfmolen/oleotoerisme-olijfmolen-bezoeken-ervaring | RESOLVED_NOW: /nl/blog/categorie/onze-olijfmolen/oleotoerisme-olijfmolen-bezoeken-ervaring | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena
- [ ] glos-1 | IT: /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo | TARGET: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-woordenlijst | RESOLVED_NOW: /nl/blog/categorie/olijfolie-informatie/extra-vierge-olijfolie-woordenlijst | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro
- [ ] info-1 | IT: /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto | TARGET: /nl/blog/categorie/olijfolie-informatie/bitterheid-prikkeling-extra-vierge-olijfolie | RESOLVED_NOW: /nl/blog/categorie/olijfolie-informatie/bitterheid-prikkeling-extra-vierge-olijfolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)
- [ ] info-10 | IT: /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo | TARGET: /nl/blog/categorie/correct-gebruik/rauw-of-verwarmd-wanneer-olijfolie-verschil-maakt | RESOLVED_NOW: /nl/blog/categorie/correct-gebruik/rauw-of-verwarmd-wanneer-olijfolie-verschil-maakt | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Crudo o in cottura: quando usare l'EVO fa davvero la differenza
- [x] info-2 | IT: /blog/categoria/conservazione/conservare-olio-casa | TARGET: /nl/blog/categorie/opslag-bewaring/extra-vierge-olijfolie-thuis-bewaren | RESOLVED_NOW: /nl/blog/categorie/opslag-bewaring/extra-vierge-olijfolie-thuis-bewaren | MISSING: none | ISSUES: ok | TITLE_IT: Come conservare l'olio EVO a casa: luce, ossigeno, temperatura
- [ ] info-4 | IT: /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido | TARGET: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-herkennen-tips | RESOLVED_NOW: /nl/blog/categorie/olijfolie-defecten/rancige-olijfolie-herkennen-tips | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come capire se un olio EVO è rancido: segnali e cosa fare
- [ ] info-5 | IT: /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore | TARGET: /nl/blog/categorie/olijfolie-informatie/kleur-olijfolie-is-groen-beter | RESOLVED_NOW: /nl/blog/categorie/olijfolie-informatie/kleur-olijfolie-is-groen-beter | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Colore dell'olio: il verde è sinonimo di migliore? (No)
- [ ] info-6 | IT: /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo | TARGET: /nl/blog/categorie/correct-gebruik/rookpunt-frituren-met-extra-vierge-olijfolie | RESOLVED_NOW: /nl/blog/categorie/correct-gebruik/rookpunt-frituren-met-extra-vierge-olijfolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Punto di fumo dell'olio EVO: si può friggere con l'extravergine?
- [ ] info-7 | IT: /blog/categoria/salute-benessere/calorie-olio-evo-porzioni | TARGET: /nl/blog/categorie/gezondheid-welzijn/calorieen-extra-vierge-olijfolie-porties | RESOLVED_NOW: /nl/blog/categorie/gezondheid-welzijn/calorieen-extra-vierge-olijfolie-porties | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Quante calorie ha l'olio EVO e quali sono le porzioni consigliate
- [ ] info-8 | IT: /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli | TARGET: /nl/blog/categorie/gezondheid-welzijn/olijfolie-gezondheid-wetenschap-polifenolen | RESOLVED_NOW: /nl/blog/categorie/gezondheid-welzijn/olijfolie-gezondheid-wetenschap-polifenolen | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)
- [ ] info-9 | IT: /blog/categoria/conservazione/errori-conservazione-olio-cucina | TARGET: /nl/blog/categorie/opslag-bewaring/zeven-fouten-bewaren-olijfolie-keuken | RESOLVED_NOW: /nl/blog/categorie/opslag-bewaring/zeven-fouten-bewaren-olijfolie-keuken | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: I 7 errori più comuni nella conservazione dell'olio EVO in cucina
- [x] post-1 | IT: /blog/categoria/salute-benessere/benefici-olio-evo-salute | TARGET: /nl/blog/categorie/gezondheid-welzijn/voordelen-extra-vierge-olijfolie-gezondheid | RESOLVED_NOW: /nl/blog/categorie/gezondheid-welzijn/voordelen-extra-vierge-olijfolie-gezondheid | MISSING: none | ISSUES: ok | TITLE_IT: I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana
- [x] post-buy-2 | IT: /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio | TARGET: /nl/blog/categorie/koopgids/supermarkt-vs-olijfmolen-prijs-ambachtelijke-olijfolie | RESOLVED_NOW: /nl/blog/categorie/koopgids/supermarkt-vs-olijfmolen-prijs-ambachtelijke-olijfolie | MISSING: none | ISSUES: ok | TITLE_IT: Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale
- [x] post-chem-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo | TARGET: /nl/blog/categorie/olijfoliechemie/zuurgraad-extra-vierge-olijfolie-mythen | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/zuurgraad-extra-vierge-olijfolie-mythen | MISSING: none | ISSUES: ok | TITLE_IT: L'acidità dell'Olio EVO: sfatiamo i miti comuni
- [x] post-chem-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi | TARGET: /nl/blog/categorie/olijfoliechemie/polifenolen-peroxiden-olijfolie-analyse-lezen | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/polifenolen-peroxiden-olijfolie-analyse-lezen | MISSING: none | ISSUES: ok | TITLE_IT: Polifenoli e Perossidi: come decifrare le analisi dell'olio
- [x] post-store-1 | IT: /blog/categoria/conservazione/quanto-dura-olio-evo | TARGET: /nl/blog/categorie/opslag-bewaring/houdbaarheid-extra-vierge-olijfolie-bewaren-tips | RESOLVED_NOW: /nl/blog/categorie/opslag-bewaring/houdbaarheid-extra-vierge-olijfolie-bewaren-tips | MISSING: none | ISSUES: ok | TITLE_IT: Quanto dura un Olio EVO e come conservarlo al meglio
- [ ] post-store-2 | IT: /blog/categoria/conservazione/bottiglia-scura-o-latta | TARGET: /nl/blog/categorie/opslag-bewaring/donkere-glasfles-of-blik-extra-vierge-olijfolie-bewaren | RESOLVED_NOW: /nl/blog/categorie/opslag-bewaring/donkere-glasfles-of-blik-extra-vierge-olijfolie-bewaren | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Lattina o bottiglia scura? Quale conserva meglio l'olio EVO
- [ ] post-use-1 | IT: /blog/categoria/consumo-corretto/friggere-con-olio-evo | TARGET: /nl/blog/categorie/correct-gebruik/frituren-met-extra-vierge-olijfolie-mythe-of-realiteit | RESOLVED_NOW: /nl/blog/categorie/correct-gebruik/frituren-met-extra-vierge-olijfolie-mythe-of-realiteit | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Friggere con l'olio extravergine: falso mito o realtà culinaria?
- [ ] post-use-2 | IT: /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo | TARGET: /nl/blog/categorie/correct-gebruik/verse-nieuwe-olijfolie-rauw-gebruiken | RESOLVED_NOW: /nl/blog/categorie/correct-gebruik/verse-nieuwe-olijfolie-rauw-gebruiken | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio nuovo d'annata: come esaltarlo nei piatti a crudo
- [ ] ric-1 | IT: /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta | TARGET: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-bruschetta | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-bruschetta | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per la bruschetta: 3 profili e come scegliere
- [ ] ric-2 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-insalata | TARGET: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-salade | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/beste-olijfolie-voor-salade | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per l'insalata: emulsione, sale e il giusto profilo
- [ ] ric-3 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio | TARGET: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pasta-aglio-olio | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pasta-aglio-olio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per la pasta aglio e olio: quale profilo aromatico scegliere
- [ ] ric-4 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe | TARGET: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-soep-en-peulvruchten | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-soep-en-peulvruchten | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per legumi e zuppe: quale funziona meglio e come usarlo
- [ ] ric-5 | IT: /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione | TARGET: /nl/blog/categorie/recepten-combinaties/brood-en-olijfolie-proeverij-gasten | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/brood-en-olijfolie-proeverij-gasten | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Pane e olio: mini guida degustazione per ospiti (e box assaggio)
- [ ] ric-6 | IT: /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci | TARGET: /nl/blog/categorie/recepten-combinaties/bakken-met-extra-vierge-olijfolie | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/bakken-met-extra-vierge-olijfolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi
- [ ] ric-7 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio | TARGET: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-rauwe-vis-en-carpaccio | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-rauwe-vis-en-carpaccio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio su pesce crudo e carpaccio: quale scegliere e perché
- [ ] ric-8 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat | TARGET: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-gegrild-vlees-intensief-fruitig | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-gegrild-vlees-intensief-fruitig | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per carne alla griglia: fruttato intenso e il perché del contrasto
- [ ] ric-9 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pizza | TARGET: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pizza-rauw-of-na-het-bakken | RESOLVED_NOW: /nl/blog/categorie/recepten-combinaties/olijfolie-voor-pizza-rauw-of-na-het-bakken | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo
- [ ] tec-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi | TARGET: /nl/blog/categorie/olijfoliechemie/nmr-spectroscopie-olijfolie-authenticatie-adulteratie | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/nmr-spectroscopie-olijfolie-authenticatie-adulteratie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione
- [ ] tec-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms | TARGET: /nl/blog/categorie/olijfoliechemie/massaspectrometrie-olijfolie-gcms-lcms | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/massaspectrometrie-olijfolie-gcms-lcms | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli
- [ ] tec-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva | TARGET: /nl/blog/categorie/olijfoliechemie/iso-methoden-olijfolie-analyse-gids | RESOLVED_NOW: /nl/blog/categorie/olijfoliechemie/iso-methoden-olijfolie-analyse-gids | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa

### 🇩🇰 DA

Coverage: 51/51 translation entries, 9 complete translations.

Full checklist:
- [ ] chim-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo | TARGET: /da/blog/kategori/olivenoliekemi/kemiske-sammensaetning-ekstra-jomfruolivenolie | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/kemiske-sammensaetning-ekstra-jomfruolivenolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile
- [ ] chim-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina | TARGET: /da/blog/kategori/olivenoliekemi/polyfenoler-i-olivenolie-oleocanthal-oleuropein-hydroxytyrosol | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/polyfenoler-i-olivenolie-oleocanthal-oleuropein-hydroxytyrosol | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati
- [ ] chim-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio | TARGET: /da/blog/kategori/olivenoliekemi/fedtsyreprofil-olivenolie-oliesyre-linolsyre-palmitinsyre | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/fedtsyreprofil-olivenolie-oliesyre-linolsyre-palmitinsyre | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto
- [ ] chim-4 | IT: /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura | TARGET: /da/blog/kategori/olivenoliekemi/peroxidtal-olivenolie-hvad-betyder-det | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/peroxidtal-olivenolie-hvad-betyder-det | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio
- [ ] chim-5 | IT: /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano | TARGET: /da/blog/kategori/olivenoliekemi/k232-og-k270-uv-absorptionskoefficienter-olivenolie | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/k232-og-k270-uv-absorptionskoefficienter-olivenolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: K232 e K270: cosa misurano e perché indicano la qualità dell'olio
- [ ] chim-6 | IT: /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma | TARGET: /da/blog/kategori/olivenoliekemi/aeltning-af-olivenpasta-kemi-og-aroma | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/aeltning-af-olivenpasta-kemi-og-aroma | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio
- [ ] chim-7 | IT: /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita | TARGET: /da/blog/kategori/olivenoliekemi/olivenoliefiltrering-effekter-paa-vand-enzymer-og-stabilitet | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/olivenoliefiltrering-effekter-paa-vand-enzymer-og-stabilitet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità
- [x] com-2 | IT: /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti | TARGET: /da/blog/kategori/k-bsguide/let-frugtig-olivenolie-parringer | RESOLVED_NOW: /da/blog/kategori/k-bsguide/let-frugtig-olivenolie-parringer | MISSING: none | ISSUES: ok | TITLE_IT: Abbinamenti con EVO fruttato leggero
- [x] com-4 | IT: /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo | TARGET: /da/blog/kategori/k-bsguide/intensiv-frugtig-olivenolie-brug | RESOLVED_NOW: /da/blog/kategori/k-bsguide/intensiv-frugtig-olivenolie-brug | MISSING: none | ISSUES: ok | TITLE_IT: Come e quando usare l'Olio EVO Fruttato Intenso
- [x] com-6 | IT: /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura | TARGET: /da/blog/kategori/koebsguide/hvad-er-ny-olivenolie-fordele | RESOLVED_NOW: /da/blog/kategori/koebsguide/hvad-er-ny-olivenolie-fordele | MISSING: none | ISSUES: ok | TITLE_IT: Cos'è l'Olio Nuovo e perché conviene acquistarlo?
- [ ] com-8 | IT: /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze | TARGET: /da/blog/kategori/k-bsguide/bob-bgp-100-procent-italiensk-olivenolie-maerkater-forklaret | RESOLVED_NOW: /da/blog/kategori/k-bsguide/bob-bgp-100-procent-italiensk-olivenolie-maerkater-forklaret | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?
- [ ] dif-1 | IT: /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa | TARGET: /da/blog/kategori/olivenoliefejl/olivenoliefejl-guide-til-sensoriske-fejl | RESOLVED_NOW: /da/blog/kategori/olivenoliefejl/olivenoliefejl-guide-til-sensoriske-fejl | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetti dell'olio EVO: guida completa ai principali vizi sensoriali
- [ ] dif-2 | IT: /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione | TARGET: /da/blog/kategori/olivenoliefejl/harsk-olivenolie-aarsager-og-forebyggelse | RESOLVED_NOW: /da/blog/kategori/olivenoliefejl/harsk-olivenolie-aarsager-og-forebyggelse | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Rancido: cos'è, perché succede e come evitarlo
- [ ] dif-3 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio | TARGET: /da/blog/kategori/olivenoliefejl/vinedikkesmag-fejl-i-olivenolie-aarsager-og-forebyggelse | RESOLVED_NOW: /da/blog/kategori/olivenoliefejl/vinedikkesmag-fejl-i-olivenolie-aarsager-og-forebyggelse | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] dif-4 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio | TARGET: /da/blog/kategori/olivenoliefejl/mug-og-bundfald-defekter-i-olivenolie-aarsager-og-forebyggelse | RESOLVED_NOW: /da/blog/kategori/olivenoliefejl/mug-og-bundfald-defekter-i-olivenolie-aarsager-og-forebyggelse | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] faq-1 | IT: /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo | TARGET: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-faq-ofte-stillede-spoergsmaal | RESOLVED_NOW: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-faq-ofte-stillede-spoergsmaal | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa
- [ ] fid-1 | IT: /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio | TARGET: /da/blog/kategori/vores-oliem-lle/hvordan-vores-olivenolie-bliver-til-hoest-oliemoelle | RESOLVED_NOW: /da/blog/kategori/vores-oliem-lle/hvordan-vores-olivenolie-bliver-til-hoest-oliemoelle | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come nasce il nostro olio: raccolta → frantoio → stoccaggio
- [ ] fid-2 | IT: /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti | TARGET: /da/blog/kategori/vores-oliem-lle/smag-paa-olivenolie-paa-fem-minutter | RESOLVED_NOW: /da/blog/kategori/vores-oliem-lle/smag-paa-olivenolie-paa-fem-minutter | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come degustare l'olio EVO in 5 minuti: guida pratica per tutti
- [ ] fid-3 | IT: /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita | TARGET: /da/blog/kategori/vores-oliem-lle/sporbarhed-batchnummer-laboratorieanalyser-oersprungsland | RESOLVED_NOW: /da/blog/kategori/vores-oliem-lle/sporbarhed-batchnummer-laboratorieanalyser-oersprungsland | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità
- [ ] fid-4 | IT: /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno | TARGET: /da/blog/kategori/vores-oliem-lle/hvorfor-olivenolie-aendrer-sig-hvert-aar-klima-udbytte | RESOLVED_NOW: /da/blog/kategori/vores-oliem-lle/hvorfor-olivenolie-aendrer-sig-hvert-aar-klima-udbytte | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Perché l'olio cambia ogni anno: clima, resa, maturazione
- [ ] fid-5 | IT: /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio | TARGET: /da/blog/kategori/vores-oliem-lle/oleoturisme-besoeg-paa-oliemoelle-oplevelser | RESOLVED_NOW: /da/blog/kategori/vores-oliem-lle/oleoturisme-besoeg-paa-oliemoelle-oplevelser | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena
- [ ] glos-1 | IT: /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo | TARGET: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-ordbog | RESOLVED_NOW: /da/blog/kategori/olivenolie-information/ekstra-jomfruolivenolie-ordbog | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro
- [ ] info-1 | IT: /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto | TARGET: /da/blog/kategori/olivenolie-information/bitterhed-skarphed-ekstra-jomfruolivenolie | RESOLVED_NOW: /da/blog/kategori/olivenolie-information/bitterhed-skarphed-ekstra-jomfruolivenolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)
- [ ] info-10 | IT: /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo | TARGET: /da/blog/kategori/korrekt-forbrug/raa-eller-tilberedt-hvornaar-olivenolie-goer-forskel | RESOLVED_NOW: /da/blog/kategori/korrekt-forbrug/raa-eller-tilberedt-hvornaar-olivenolie-goer-forskel | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Crudo o in cottura: quando usare l'EVO fa davvero la differenza
- [x] info-2 | IT: /blog/categoria/conservazione/conservare-olio-casa | TARGET: /da/blog/kategori/opbevaring/opbevaring-ekstra-jomfruolivenolie-hjemme | RESOLVED_NOW: /da/blog/kategori/opbevaring/opbevaring-ekstra-jomfruolivenolie-hjemme | MISSING: none | ISSUES: ok | TITLE_IT: Come conservare l'olio EVO a casa: luce, ossigeno, temperatura
- [ ] info-4 | IT: /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido | TARGET: /da/blog/kategori/olivenoliefejl/harkent-harsk-olivenolie-tegn | RESOLVED_NOW: /da/blog/kategori/olivenoliefejl/harkent-harsk-olivenolie-tegn | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come capire se un olio EVO è rancido: segnali e cosa fare
- [ ] info-5 | IT: /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore | TARGET: /da/blog/kategori/olivenolie-information/olivenoliefarve-er-groen-bedre | RESOLVED_NOW: /da/blog/kategori/olivenolie-information/olivenoliefarve-er-groen-bedre | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Colore dell'olio: il verde è sinonimo di migliore? (No)
- [ ] info-6 | IT: /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo | TARGET: /da/blog/kategori/korrekt-forbrug/roegpunkt-friturestegning-med-ekstra-jomfruolivenolie | RESOLVED_NOW: /da/blog/kategori/korrekt-forbrug/roegpunkt-friturestegning-med-ekstra-jomfruolivenolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Punto di fumo dell'olio EVO: si può friggere con l'extravergine?
- [ ] info-7 | IT: /blog/categoria/salute-benessere/calorie-olio-evo-porzioni | TARGET: /da/blog/kategori/sundhed-velv-re/kalorier-ekstra-jomfruolivenolie-anbefalede-portioner | RESOLVED_NOW: /da/blog/kategori/sundhed-velv-re/kalorier-ekstra-jomfruolivenolie-anbefalede-portioner | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Quante calorie ha l'olio EVO e quali sono le porzioni consigliate
- [ ] info-8 | IT: /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli | TARGET: /da/blog/kategori/sundhed-velv-re/olivenolie-sundhed-videnskab-polyfenoler | RESOLVED_NOW: /da/blog/kategori/sundhed-velv-re/olivenolie-sundhed-videnskab-polyfenoler | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)
- [ ] info-9 | IT: /blog/categoria/conservazione/errori-conservazione-olio-cucina | TARGET: /da/blog/kategori/opbevaring/syv-fejl-opbevaring-olivenolie-koekken | RESOLVED_NOW: /da/blog/kategori/opbevaring/syv-fejl-opbevaring-olivenolie-koekken | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: I 7 errori più comuni nella conservazione dell'olio EVO in cucina
- [x] post-1 | IT: /blog/categoria/salute-benessere/benefici-olio-evo-salute | TARGET: /da/blog/kategori/sundhed-velv-re/fordele-ekstra-jomfruolivenolie-sundhed | RESOLVED_NOW: /da/blog/kategori/sundhed-velv-re/fordele-ekstra-jomfruolivenolie-sundhed | MISSING: none | ISSUES: ok | TITLE_IT: I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana
- [x] post-buy-2 | IT: /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio | TARGET: /da/blog/kategori/k-bsguide/supermarked-vs-oliemoelle-prisen-paa-haandvaerksolivenolie | RESOLVED_NOW: /da/blog/kategori/k-bsguide/supermarked-vs-oliemoelle-prisen-paa-haandvaerksolivenolie | MISSING: none | ISSUES: ok | TITLE_IT: Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale
- [x] post-chem-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo | TARGET: /da/blog/kategori/olivenoliekemi/syreindhold-ekstra-jomfruolivenolie-myter | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/syreindhold-ekstra-jomfruolivenolie-myter | MISSING: none | ISSUES: ok | TITLE_IT: L'acidità dell'Olio EVO: sfatiamo i miti comuni
- [x] post-chem-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi | TARGET: /da/blog/kategori/olivenoliekemi/polyfenoler-peroxider-forstaa-olivenolieanalyser | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/polyfenoler-peroxider-forstaa-olivenolieanalyser | MISSING: none | ISSUES: ok | TITLE_IT: Polifenoli e Perossidi: come decifrare le analisi dell'olio
- [x] post-store-1 | IT: /blog/categoria/conservazione/quanto-dura-olio-evo | TARGET: /da/blog/kategori/opbevaring/hvor-laenge-holder-ekstra-jomfruolivenolie-opbevaring | RESOLVED_NOW: /da/blog/kategori/opbevaring/hvor-laenge-holder-ekstra-jomfruolivenolie-opbevaring | MISSING: none | ISSUES: ok | TITLE_IT: Quanto dura un Olio EVO e come conservarlo al meglio
- [ ] post-store-2 | IT: /blog/categoria/conservazione/bottiglia-scura-o-latta | TARGET: /da/blog/kategori/opbevaring/moerk-glasflaske-eller-dunk-hvad-bevarer-olivenolien-bedst | RESOLVED_NOW: /da/blog/kategori/opbevaring/moerk-glasflaske-eller-dunk-hvad-bevarer-olivenolien-bedst | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Lattina o bottiglia scura? Quale conserva meglio l'olio EVO
- [ ] post-use-1 | IT: /blog/categoria/consumo-corretto/friggere-con-olio-evo | TARGET: /da/blog/kategori/korrekt-forbrug/friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag | RESOLVED_NOW: /da/blog/kategori/korrekt-forbrug/friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Friggere con l'olio extravergine: falso mito o realtà culinaria?
- [ ] post-use-2 | IT: /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo | TARGET: /da/blog/kategori/korrekt-forbrug/frisk-ny-s-son-olivenolie-nyd-den-raa | RESOLVED_NOW: /da/blog/kategori/korrekt-forbrug/frisk-ny-s-son-olivenolie-nyd-den-raa | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio nuovo d'annata: come esaltarlo nei piatti a crudo
- [ ] ric-1 | IT: /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta | TARGET: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-bruschetta | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-bruschetta | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per la bruschetta: 3 profili e come scegliere
- [ ] ric-2 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-insalata | TARGET: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-salat | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/bedste-olivenolie-til-salat | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per l'insalata: emulsione, sale e il giusto profilo
- [ ] ric-3 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio | TARGET: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pasta-aglio-olio | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pasta-aglio-olio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per la pasta aglio e olio: quale profilo aromatico scegliere
- [ ] ric-4 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe | TARGET: /da/blog/kategori/opskrifter-parringer/olivenolie-til-baelgfrugter-supper | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/olivenolie-til-baelgfrugter-supper | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per legumi e zuppe: quale funziona meglio e come usarlo
- [ ] ric-5 | IT: /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione | TARGET: /da/blog/kategori/opskrifter-parringer/broed-og-olivenolie-smagningsguide-gaester | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/broed-og-olivenolie-smagningsguide-gaester | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Pane e olio: mini guida degustazione per ospiti (e box assaggio)
- [ ] ric-6 | IT: /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci | TARGET: /da/blog/kategori/opskrifter-parringer/bagning-med-ekstra-jomfruolivenolie | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/bagning-med-ekstra-jomfruolivenolie | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi
- [ ] ric-7 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio | TARGET: /da/blog/kategori/opskrifter-parringer/olivenolie-til-raa-fisk-og-carpaccio | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/olivenolie-til-raa-fisk-og-carpaccio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio su pesce crudo e carpaccio: quale scegliere e perché
- [ ] ric-8 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat | TARGET: /da/blog/kategori/opskrifter-parringer/olivenolie-til-grillet-koed-intens-frugtighed | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/olivenolie-til-grillet-koed-intens-frugtighed | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per carne alla griglia: fruttato intenso e il perché del contrasto
- [ ] ric-9 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pizza | TARGET: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pizza-raa-eller-efter-bagning | RESOLVED_NOW: /da/blog/kategori/opskrifter-parringer/olivenolie-til-pizza-raa-eller-efter-bagning | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo
- [ ] tec-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi | TARGET: /da/blog/kategori/olivenoliekemi/nmr-spektroskopi-olivenolie-autentificering | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/nmr-spektroskopi-olivenolie-autentificering | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione
- [ ] tec-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms | TARGET: /da/blog/kategori/olivenoliekemi/massespektrometri-olivenolie-gc-ms-lc-ms | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/massespektrometri-olivenolie-gc-ms-lc-ms | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli
- [ ] tec-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva | TARGET: /da/blog/kategori/olivenoliekemi/iso-metoder-til-olivenolieanalyse-guide | RESOLVED_NOW: /da/blog/kategori/olivenoliekemi/iso-metoder-til-olivenolieanalyse-guide | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa

### 🇳🇴 NO

Coverage: 51/51 translation entries, 9 complete translations.

Full checklist:
- [ ] chim-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/composizione-chimica-olio-evo | TARGET: /no/blog/kategori/olivenoljekjemi/kjemiske-sammensetten-ekstra-jomfruolivenolje | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/kjemiske-sammensetten-ekstra-jomfruolivenolje | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile
- [ ] chim-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-oleocantale-oleuropeina | TARGET: /no/blog/kategori/olivenoljekjemi/polyfenoler-i-olivenolje-oleocanthal-oleuropein-hydroxytyrosol | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/polyfenoler-i-olivenolje-oleocanthal-oleuropein-hydroxytyrosol | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati
- [ ] chim-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/profilo-acidi-grassi-olio | TARGET: /no/blog/kategori/olivenoljekjemi/fettsyreprofil-olivenolje-oljesyre-linolsyre-palmitinsyre | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/fettsyreprofil-olivenolje-oljesyre-linolsyre-palmitinsyre | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto
- [ ] chim-4 | IT: /blog/categoria/chimica-dell-olio-di-oliva/numero-perossidi-che-misura | TARGET: /no/blog/kategori/olivenoljekjemi/peroksidtall-olivenolje-hva-betyr-det | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/peroksidtall-olivenolje-hva-betyr-det | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio
- [ ] chim-5 | IT: /blog/categoria/chimica-dell-olio-di-oliva/k232-k270-cosa-misurano | TARGET: /no/blog/kategori/olivenoljekjemi/k232-og-k270-uv-absorpsjonskoeffisienter-olivenolje | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/k232-og-k270-uv-absorpsjonskoeffisienter-olivenolje | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: K232 e K270: cosa misurano e perché indicano la qualità dell'olio
- [ ] chim-6 | IT: /blog/categoria/chimica-dell-olio-di-oliva/gramolazione-chimica-aroma | TARGET: /no/blog/kategori/olivenoljekjemi/elting-av-olivenmasse-kjemisk-og-aroma | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/elting-av-olivenmasse-kjemisk-og-aroma | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio
- [ ] chim-7 | IT: /blog/categoria/chimica-dell-olio-di-oliva/filtrazione-olio-effetti-stabilita | TARGET: /no/blog/kategori/olivenoljekjemi/olivenoljefiltrering-effekter-paa-vann-enzymer-og-stabilitet | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/olivenoljefiltrering-effekter-paa-vann-enzymer-og-stabilitet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità
- [x] com-2 | IT: /blog/categoria/consigli-di-acquisto/fruttato-leggero-abbinamenti | TARGET: /no/blog/kategori/kj-psguide/lett-fruktig-olivenolje-parringer | RESOLVED_NOW: /no/blog/kategori/kj-psguide/lett-fruktig-olivenolje-parringer | MISSING: none | ISSUES: ok | TITLE_IT: Abbinamenti con EVO fruttato leggero
- [x] com-4 | IT: /blog/categoria/consigli-di-acquisto/fruttato-intenso-quando-usarlo | TARGET: /no/blog/kategori/kj-psguide/intensiv-fruktig-olivenolje-bruk | RESOLVED_NOW: /no/blog/kategori/kj-psguide/intensiv-fruktig-olivenolje-bruk | MISSING: none | ISSUES: ok | TITLE_IT: Come e quando usare l'Olio EVO Fruttato Intenso
- [x] com-6 | IT: /blog/categoria/consigli-di-acquisto/olio-nuovo-cose-e-quanto-dura | TARGET: /no/blog/kategori/kjoepsguide/hva-er-ny-olivenolje-fordeler | RESOLVED_NOW: /no/blog/kategori/kjoepsguide/hva-er-ny-olivenolje-fordeler | MISSING: none | ISSUES: ok | TITLE_IT: Cos'è l'Olio Nuovo e perché conviene acquistarlo?
- [ ] com-8 | IT: /blog/categoria/consigli-di-acquisto/dop-igp-100-italiano-differenze | TARGET: /no/blog/kategori/kj-psguide/dop-igp-100-prosent-italiensk-olivenolje-merking-forklart | RESOLVED_NOW: /no/blog/kategori/kj-psguide/dop-igp-100-prosent-italiensk-olivenolje-merking-forklart | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?
- [ ] dif-1 | IT: /blog/categoria/difetti-dell-olio-evo/difetti-olio-evo-guida-completa | TARGET: /no/blog/kategori/olivenoljefeil/olivenoljefeil-guide-til-sensoriske-feil | RESOLVED_NOW: /no/blog/kategori/olivenoljefeil/olivenoljefeil-guide-til-sensoriske-feil | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetti dell'olio EVO: guida completa ai principali vizi sensoriali
- [ ] dif-2 | IT: /blog/categoria/difetti-dell-olio-evo/rancido-cause-prevenzione | TARGET: /no/blog/kategori/olivenoljefeil/harsk-olivenolje-aarsaker-og-forebygging | RESOLVED_NOW: /no/blog/kategori/olivenoljefeil/harsk-olivenolje-aarsaker-og-forebygging | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Rancido: cos'è, perché succede e come evitarlo
- [ ] dif-3 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-avvinato-inacetito-olio | TARGET: /no/blog/kategori/olivenoljefeil/vinedikksmak-feil-i-olivenolje-aarsaker-og-forebygging | RESOLVED_NOW: /no/blog/kategori/olivenoljefeil/vinedikksmak-feil-i-olivenolje-aarsaker-og-forebygging | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] dif-4 | IT: /blog/categoria/difetti-dell-olio-evo/difetto-muffa-morchia-olio | TARGET: /no/blog/kategori/olivenoljefeil/mugg-og-bunndfall-defekter-i-olivenolje-aarsaker-og-forebygging | RESOLVED_NOW: /no/blog/kategori/olivenoljefeil/mugg-og-bunndfall-defekter-i-olivenolje-aarsaker-og-forebygging | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione
- [ ] faq-1 | IT: /blog/categoria/informazioni-sull-olio-evo/faq-olio-evo | TARGET: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-faq-ofte-stilte-spoersmaal | RESOLVED_NOW: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-faq-ofte-stilte-spoersmaal | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa
- [ ] fid-1 | IT: /blog/categoria/il-nostro-frantoio/come-nasce-nostro-olio | TARGET: /no/blog/kategori/var-oljem-lle/hvordan-vaar-olivenolje-blir-til-hoest-oljemoelle | RESOLVED_NOW: /no/blog/kategori/var-oljem-lle/hvordan-vaar-olivenolje-blir-til-hoest-oljemoelle | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come nasce il nostro olio: raccolta → frantoio → stoccaggio
- [ ] fid-2 | IT: /blog/categoria/il-nostro-frantoio/come-degustare-olio-5-minuti | TARGET: /no/blog/kategori/var-oljem-lle/smak-paa-olivenolje-paa-fem-minutter | RESOLVED_NOW: /no/blog/kategori/var-oljem-lle/smak-paa-olivenolje-paa-fem-minutter | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come degustare l'olio EVO in 5 minuti: guida pratica per tutti
- [ ] fid-3 | IT: /blog/categoria/il-nostro-frantoio/tracciabilita-lotto-analisi-qualita | TARGET: /no/blog/kategori/var-oljem-lle/sporbarhet-batchnummer-laboratorieanalyser-opprinnelse | RESOLVED_NOW: /no/blog/kategori/var-oljem-lle/sporbarhet-batchnummer-laboratorieanalyser-opprinnelse | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità
- [ ] fid-4 | IT: /blog/categoria/il-nostro-frantoio/perche-olio-cambia-ogni-anno | TARGET: /no/blog/kategori/var-oljem-lle/hvorfor-olivenolje-endrer-seg-hvert-aar-klima-utbytte | RESOLVED_NOW: /no/blog/kategori/var-oljem-lle/hvorfor-olivenolje-endrer-seg-hvert-aar-klima-utbytte | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Perché l'olio cambia ogni anno: clima, resa, maturazione
- [ ] fid-5 | IT: /blog/categoria/il-nostro-frantoio/oleoturismo-degustazioni-frantoio | TARGET: /no/blog/kategori/var-oljem-lle/oleoturisme-besoek-paa-oljemoelle-opplevelser | RESOLVED_NOW: /no/blog/kategori/var-oljem-lle/oleoturisme-besoek-paa-oljemoelle-opplevelser | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena
- [ ] glos-1 | IT: /blog/categoria/informazioni-sull-olio-evo/glossario-olio-evo | TARGET: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-ordliste | RESOLVED_NOW: /no/blog/kategori/olivenolje-informasjon/ekstra-jomfruolivenolje-ordliste | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro
- [ ] info-1 | IT: /blog/categoria/informazioni-sull-olio-evo/amaro-piccante-olio-non-e-difetto | TARGET: /no/blog/kategori/olivenolje-informasjon/bitterhet-skarphet-ekstra-jomfruolivenolje | RESOLVED_NOW: /no/blog/kategori/olivenolje-informasjon/bitterhet-skarphet-ekstra-jomfruolivenolje | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)
- [ ] info-10 | IT: /blog/categoria/consumo-corretto/crudo-vs-cottura-quando-usare-evo | TARGET: /no/blog/kategori/riktig-bruk/raa-eller-tilberedt-naar-olivenolje-gjoer-forskjell | RESOLVED_NOW: /no/blog/kategori/riktig-bruk/raa-eller-tilberedt-naar-olivenolje-gjoer-forskjell | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Crudo o in cottura: quando usare l'EVO fa davvero la differenza
- [x] info-2 | IT: /blog/categoria/conservazione/conservare-olio-casa | TARGET: /no/blog/kategori/lagring/lagring-ekstra-jomfruolivenolje-hjemme | RESOLVED_NOW: /no/blog/kategori/lagring/lagring-ekstra-jomfruolivenolje-hjemme | MISSING: none | ISSUES: ok | TITLE_IT: Come conservare l'olio EVO a casa: luce, ossigeno, temperatura
- [ ] info-4 | IT: /blog/categoria/difetti-dell-olio-evo/come-capire-olio-rancido | TARGET: /no/blog/kategori/olivenoljefeil/harkent-harsk-olivenolje-tegn | RESOLVED_NOW: /no/blog/kategori/olivenoljefeil/harkent-harsk-olivenolje-tegn | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Come capire se un olio EVO è rancido: segnali e cosa fare
- [ ] info-5 | IT: /blog/categoria/informazioni-sull-olio-evo/colore-olio-verde-migliore | TARGET: /no/blog/kategori/olivenolje-informasjon/olivenoljefarge-er-groenn-bedre | RESOLVED_NOW: /no/blog/kategori/olivenolje-informasjon/olivenoljefarge-er-groenn-bedre | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Colore dell'olio: il verde è sinonimo di migliore? (No)
- [ ] info-6 | IT: /blog/categoria/consumo-corretto/punto-di-fumo-friggere-evo | TARGET: /no/blog/kategori/riktig-bruk/roykpunkt-fritering-med-ekstra-jomfruolivenolje | RESOLVED_NOW: /no/blog/kategori/riktig-bruk/roykpunkt-fritering-med-ekstra-jomfruolivenolje | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Punto di fumo dell'olio EVO: si può friggere con l'extravergine?
- [ ] info-7 | IT: /blog/categoria/salute-benessere/calorie-olio-evo-porzioni | TARGET: /no/blog/kategori/helse-velv-re/kalorier-ekstra-jomfruolivenolje-anbefalte-porsjoner | RESOLVED_NOW: /no/blog/kategori/helse-velv-re/kalorier-ekstra-jomfruolivenolje-anbefalte-porsjoner | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Quante calorie ha l'olio EVO e quali sono le porzioni consigliate
- [ ] info-8 | IT: /blog/categoria/salute-benessere/olio-evo-salute-scienza-polifenoli | TARGET: /no/blog/kategori/helse-velv-re/olivenolie-sundhed-videnskab-polyfenoler | RESOLVED_NOW: /no/blog/kategori/helse-velv-re/olivenolie-sundhed-videnskab-polyfenoler | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)
- [ ] info-9 | IT: /blog/categoria/conservazione/errori-conservazione-olio-cucina | TARGET: /no/blog/kategori/lagring/syv-feil-lagring-olivenolje-kjoekken | RESOLVED_NOW: /no/blog/kategori/lagring/syv-feil-lagring-olivenolje-kjoekken | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: I 7 errori più comuni nella conservazione dell'olio EVO in cucina
- [x] post-1 | IT: /blog/categoria/salute-benessere/benefici-olio-evo-salute | TARGET: /no/blog/kategori/helse-velv-re/fordeler-ekstra-jomfruolivenolje-helse | RESOLVED_NOW: /no/blog/kategori/helse-velv-re/fordeler-ekstra-jomfruolivenolje-helse | MISSING: none | ISSUES: ok | TITLE_IT: I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana
- [x] post-buy-2 | IT: /blog/categoria/consigli-di-acquisto/supermercato-vs-frantoio | TARGET: /no/blog/kategori/kj-psguide/supermarked-vs-oljemolle-prisen-paa-haandverksolivenolje | RESOLVED_NOW: /no/blog/kategori/kj-psguide/supermarked-vs-oljemolle-prisen-paa-haandverksolivenolje | MISSING: none | ISSUES: ok | TITLE_IT: Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale
- [x] post-chem-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/acidita-olio-evo | TARGET: /no/blog/kategori/olivenoljekjemi/syreinnhold-ekstra-jomfruolivenolje-myter | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/syreinnhold-ekstra-jomfruolivenolje-myter | MISSING: none | ISSUES: ok | TITLE_IT: L'acidità dell'Olio EVO: sfatiamo i miti comuni
- [x] post-chem-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/polifenoli-e-perossidi | TARGET: /no/blog/kategori/olivenoljekjemi/polyfenoler-peroksider-forstaa-olivenoljeanalyser | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/polyfenoler-peroksider-forstaa-olivenoljeanalyser | MISSING: none | ISSUES: ok | TITLE_IT: Polifenoli e Perossidi: come decifrare le analisi dell'olio
- [x] post-store-1 | IT: /blog/categoria/conservazione/quanto-dura-olio-evo | TARGET: /no/blog/kategori/lagring/hvor-lenge-holder-ekstra-jomfruolivenolje-lagring | RESOLVED_NOW: /no/blog/kategori/lagring/hvor-lenge-holder-ekstra-jomfruolivenolje-lagring | MISSING: none | ISSUES: ok | TITLE_IT: Quanto dura un Olio EVO e come conservarlo al meglio
- [ ] post-store-2 | IT: /blog/categoria/conservazione/bottiglia-scura-o-latta | TARGET: /no/blog/kategori/lagring/moerk-glassflaske-eller-blikkboks-hva-bevarer-olivenoljen-best | RESOLVED_NOW: /no/blog/kategori/lagring/moerk-glassflaske-eller-blikkboks-hva-bevarer-olivenoljen-best | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Lattina o bottiglia scura? Quale conserva meglio l'olio EVO
- [ ] post-use-1 | IT: /blog/categoria/consumo-corretto/friggere-con-olio-evo | TARGET: /no/blog/kategori/riktig-bruk/fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet | RESOLVED_NOW: /no/blog/kategori/riktig-bruk/fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Friggere con l'olio extravergine: falso mito o realtà culinaria?
- [ ] post-use-2 | IT: /blog/categoria/consumo-corretto/esaltare-olio-nuovo-crudo | TARGET: /no/blog/kategori/riktig-bruk/frisk-ny-sesong-olivenolje-nyt-den-raa | RESOLVED_NOW: /no/blog/kategori/riktig-bruk/frisk-ny-sesong-olivenolje-nyt-den-raa | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio nuovo d'annata: come esaltarlo nei piatti a crudo
- [ ] ric-1 | IT: /blog/categoria/ricette-e-abbinamenti/miglior-olio-bruschetta | TARGET: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-bruschetta | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-bruschetta | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per la bruschetta: 3 profili e come scegliere
- [ ] ric-2 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-insalata | TARGET: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-salat | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/beste-olivenolje-til-salat | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Miglior olio per l'insalata: emulsione, sale e il giusto profilo
- [ ] ric-3 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pasta-aglio-olio | TARGET: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pasta-aglio-olio | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pasta-aglio-olio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per la pasta aglio e olio: quale profilo aromatico scegliere
- [ ] ric-4 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-legumi-zuppe | TARGET: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-belgfrukter-supper | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-belgfrukter-supper | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per legumi e zuppe: quale funziona meglio e come usarlo
- [ ] ric-5 | IT: /blog/categoria/ricette-e-abbinamenti/pane-e-olio-degustazione | TARGET: /no/blog/kategori/oppskrifter-parringer/broed-og-olivenolje-smaksguide-gjester | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/broed-og-olivenolje-smaksguide-gjester | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Pane e olio: mini guida degustazione per ospiti (e box assaggio)
- [ ] ric-6 | IT: /blog/categoria/ricette-e-abbinamenti/olio-nei-dolci | TARGET: /no/blog/kategori/oppskrifter-parringer/baking-med-ekstra-jomfruolivenolje | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/baking-med-ekstra-jomfruolivenolje | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio EVO nei dolci: sì, si fa — con limone, cioccolato e aromi
- [ ] ric-7 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pesce-crudo-carpaccio | TARGET: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-raa-fisk-og-carpaccio | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-raa-fisk-og-carpaccio | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio su pesce crudo e carpaccio: quale scegliere e perché
- [ ] ric-8 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-carne-grigliat | TARGET: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-grillet-kjoett-intens-fruktighet | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-grillet-kjoett-intens-fruktighet | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per carne alla griglia: fruttato intenso e il perché del contrasto
- [ ] ric-9 | IT: /blog/categoria/ricette-e-abbinamenti/olio-per-pizza | TARGET: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pizza-raa-eller-etter-steking | RESOLVED_NOW: /no/blog/kategori/oppskrifter-parringer/olivenolje-til-pizza-raa-eller-etter-steking | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo
- [ ] tec-1 | IT: /blog/categoria/chimica-dell-olio-di-oliva/nmr-olio-oliva-analisi | TARGET: /no/blog/kategori/olivenoljekjemi/nmr-spektroskopi-olivenolje-autentisering | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/nmr-spektroskopi-olivenolje-autentisering | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione
- [ ] tec-2 | IT: /blog/categoria/chimica-dell-olio-di-oliva/spettrometria-massa-olio-oliva-gcms-lcms | TARGET: /no/blog/kategori/olivenoljekjemi/massespektrometri-olivenolje-gc-ms-lc-ms | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/massespektrometri-olivenolje-gc-ms-lc-ms | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli
- [ ] tec-3 | IT: /blog/categoria/chimica-dell-olio-di-oliva/metodi-iso-analisi-olio-oliva | TARGET: /no/blog/kategori/olivenoljekjemi/iso-metoder-for-olivenoljeanalyse-guide | RESOLVED_NOW: /no/blog/kategori/olivenoljekjemi/iso-metoder-for-olivenoljeanalyse-guide | MISSING: content | ISSUES: content falls back to Italian | TITLE_IT: Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa
