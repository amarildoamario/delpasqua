import type { BlogPost } from "./blog-data";

export const postsBatch2: BlogPost[] = [
    // ─── Chimica avanzata ───
    {
        id: "chim-3",
        slug: "profilo-acidi-grassi-olio",
        title: "Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto",
        excerpt: "Cos'hanno in comune l'acido oleico, il linoleico e il palmitico? Sono i mattoni dell'olio EVO. Capire il loro ruolo spiega stabilità, gusto e salute.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "5 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/acidi-grassi.jpg",
        category: "Chimica dell'olio di oliva",
        content: `## I tre acidi grassi principali dell'EVO

L'olio d'oliva è composto per oltre il 98% da **trigliceridi** — molecole formate da glicerolo e tre acidi grassi. Il profilo di questi acidi grassi è ciò che distingue l'EVO da tutti gli altri oli vegetali.

## Acido oleico (C18:1) — il protagonista

L'**acido oleico** costituisce tra il **65 e l'80%** della frazione grassa dell'olio d'oliva — una percentuale eccezionalmente alta tra tutti i grassi vegetali. È un acido grasso *monoinsaturo*: ha un solo doppio legame nella catena carboniosa.

**Perché è importante:**
- *Alta stabilità ossidativa*: un solo doppio legame = meno punti vulnerabili all'attacco dell'ossigeno rispetto ai polinsaturi
- *Punto di fumo elevato*: contribuisce alla resistenza termica dell'EVO
- *Effetti cardiovascolari*: documentata riduzione del colesterolo LDL senza abbassare l'HDL

## Acido linoleico (C18:2) — l'omega-6

L'**acido linoleico** è presente in percentuali tra il **5 e il 10%**. È un acido grasso *polinsaturo* essenziale (il corpo non lo sintetizza): due doppi legami lo rendono più reattivo dell'oleico.

**Caratteristiche:**
- *Essenziale*: necessario per la salute cellulare e la risposta infiammatoria
- *Meno stabile*: due doppi legami = maggiore vulnerabilità all'ossidazione
- Un contenuto troppo alto di linoleico in un olio è spesso segno di adulterazione con oli di semi

## Acido palmitico (C16:0) — il saturo

L'**acido palmitico** (7–14%) è il principale acido grasso *saturo* dell'EVO. Nessun doppio legame: è chimicamente inerte, stabile, non contribuisce all'ossidazione.

**Ruolo:**
- Contribuisce alla consistenza dell'olio a basse temperature (cristallizzazione parziale sotto i 10°C — normale, non è un difetto)
- Nessun effetto diretto sull'aromaticità

## Perché il profilo varia

Il profilo degli acidi grassi dipende da:
- *Cultivar*: ogni varietà ha un range tipico di oleico (la Coratina è ricchissima, la Taggiasca meno)
- *Clima*: temperature più calde favoriscono maggiore contenuto di oleico
- *Maturazione*: le olive mature hanno tendenzialmente più oleico delle verdi

> Un olio con oleico > 75% è generalmente più stabile e di qualità superiore.`,
    },
    {
        id: "chim-4",
        slug: "numero-perossidi-che-misura",
        title: "Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio",
        excerpt: "Il numero di perossidi è il primo indicatore di ossidazione dell'olio. Ecco come si forma, cosa misura e perché valori bassi significano olio fresco e ben fatto.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/polifenoli-e-perossidi.jpg",
        category: "Chimica dell'olio di oliva",
        content: `## Cos'è un perossido

Quando i doppi legami degli acidi grassi insaturi (principalmente linoleico e oleico) reagiscono con l'ossigeno molecolare, si formano i primi prodotti dell'ossidazione: gli **idroperossidi** (o perossidi lipidici).

Questi composti sono instabili — si decompongono rapidamente in **aldeidi**, **chetoni** e acidi a catena corta: le molecole responsabili dell'odore e del sapore di rancido.

Il **numero di perossidi (NP)** misura la quantità di idroperossidi presenti nell'olio al momento dell'analisi, espressa in **mEq O₂ per kg di olio**.

## I limiti di legge e i valori ideali

Secondo il Reg. UE 2568/91:

- **Limite massimo** per l'extra vergine: **≤ 20 mEq O₂/kg**
- Un olio eccellente fresco di frangitura: **4–8 mEq O₂/kg**
- Un olio buono ben conservato dopo 6 mesi: **8–14 mEq O₂/kg**
- Vicino al limite: **15–20** (già percepibilmente meno fresco)

## Perché i perossidi salgono nel tempo

L'ossidazione lipidica è autocatalitica: una volta iniziata, i radicali liberi prodotti accelerano ulteriormente la reazione. Fattori che la accelerano:

- **Luce** (foto-ossidazione via clorofille)
- **Calore** (ogni 10°C in più raddoppia la velocità)
- **Ossigeno** (più aria = più ossidazione)
- **Ioni metallici** (ferro, rame catalizzano le reazioni radicaliche)

## Il paradosso dei perossidi

Un aspetto interessante: i perossidi sono **intermedi instabili**. Un olio molto vecchio e rancido può avere un NP *relativamente basso* perché gli idroperossidi si sono già decomposti nelle aldeidi finali.

Per questo il NP va sempre letto insieme ai **coefficienti K232 e K270** (che misurano prodotti sia primari che secondari dell'ossidazione) per un quadro completo.

> Un NP basso su un olio fresco è un ottimo segno. Su un olio molto vecchio, va sempre integrato con K232/K270.`,
    },
    {
        id: "chim-5",
        slug: "k232-k270-cosa-misurano",
        title: "K232 e K270: cosa misurano e perché indicano la qualità dell'olio",
        excerpt: "I coefficienti di estinzione UV sono forse i parametri più tecnici dell'analisi dell'olio. Ecco cosa misurano, come si leggono e perché contano.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "5 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/k232.jpg",
        category: "Chimica dell'olio di oliva",
        content: `## Cosa sono i coefficienti di estinzione UV

I **coefficienti di estinzione UV** (detti anche *K-values*) misurano quanto l'olio assorbe la radiazione ultravioletta a specifiche lunghezze d'onda. Questa assorbanza è strettamente correlata alla presenza di determinati composti di ossidazione.

Si misurano con uno spettrofotometro UV, senza distruggere il campione.

## K232 — ossidazione primaria

A **232 nm** assorbono principalmente i **dieni coniugati** — strutture che si formano quando i doppi legami degli acidi grassi polinsaturi si riorganizzano in seguito all'attacco di radicali liberi.

**Cosa misura**: l'ossidazione **primaria** — lo stesso stadio degli idroperossidi, ma con maggiore sensibilità.

**Limiti di legge per l'extra vergine**: K232 ≤ **2,50**

Un olio fresco di ottima qualità ha K232 spesso tra **1,5 e 2,0**.

## K270 — ossidazione secondaria

A **270 nm** assorbono i **trieni coniugati** e i **composti carbonilici** (aldeidi, chetoni) — prodotti della *decomposizione* degli idroperossidi. Sono i prodotti finali dell'ossidazione.

**Cosa misura**: l'ossidazione **secondaria** — stadio avanzato, correlato all'irrancidimento già in atto o pregressa.

**Limiti di legge per l'extra vergine**: K270 ≤ **0,22**

Un olio eccellente fresco ha K270 spesso tra **0,08 e 0,14**.

## ΔK — indicatore di adulterazione

Il **ΔK** (delta-K) è calcolato come:

> ΔK = K270 − (K266 + K274) / 2

Misura la curvatura dello spettro UV intorno a 270 nm. Un valore anomalo di ΔK indica possibile presenza di **oli raffinati** (lampante deacidificato, olio di sansa raffinato) miscelati fraudolentemente con EVO.

**Limite di legge**: ΔK ≤ **0,01**

## Come leggere insieme i K-values

| Scenario | K232 | K270 |
| Olio eccellente fresco | 1.5–2.0 | 0.08–0.14 |
| Olio buono | 2.0–2.4 | 0.14–0.20 |
| Olio al limite (ancora EVO) | 2.4–2.5 | 0.20–0.22 |
| Fuori legge (non è EVO) | > 2.5 | > 0.22 |`,
    },
    {
        id: "chim-6",
        slug: "gramolazione-chimica-aroma",
        title: "Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio",
        excerpt: "La gramolazione è la fase più critica e meno conosciuta dell'estrazione dell'olio. Temperatura e durata determinano il profilo polifenolico e aromatico finale.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "5 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/gramolazione-aroma.jpg",
        category: "Chimica dell'olio di oliva",
        content: `## Cos'è la gramolazione

Dopo la **frangitura** (frantumazione delle olive), si ottiene una pasta composta da frammenti di buccia, polpa, nocciolo spezzato, acqua di vegetazione e, sospese in forma di micro-emulsione, le goccioline di olio.

La **gramolazione** è il processo di mescolamento lento di questa pasta (tipicamente 20–40 minuti) in vasche chiamate *gramolatrici*. L'obiettivo è destabilizzare l'emulsione acqua-olio e aggregare le micro-goccioline in gocce più grandi, facilitando la separazione centrifuga successiva.

## La chimica durante la gramolazione

In questi 20–40 minuti si verificano reazioni chimiche fondamentali:

### Via LOX (lipossigenasi) — formazione degli aromi

La **lipossigenasi** è un enzima presente nelle olive che, in presenza di ossigeno e acidi grassi liberati dalla frangitura, innesca la *via LOX*:

1. Acidi grassi polinsaturi (linolenico, linoleico) → idroperossidi
2. Idroperossidi → **C5 e C6 aldeidi** e alcoli (via lisasi)
3. Le aldeidi principali: *esanale*, *(E)-2-esenale*, *(E)-2-esenolo*

Sono queste le molecole che danno all'olio fresco le note di **erba tagliata, pomodoro verde, carciofo, foglia di olivo** — tutto l'universo aromatico "verde" dell'EVO.

### Idrolisi dei secoiridoidi — amaro e piccante

Le glucosidasi e le esterasi presenti nelle olive idrolizzano l'**oleuropeina** e i suoi precursori, liberando:
- **Aglicone dell'oleuropeina** (amaro principale)
- **Oleocantale** (piccante)
- **Idrossitirosolo** (antiossidante)

## Il trade-off fondamentale: temperatura e durata

Il mastro oleario deve bilanciare due esigenze opposte:

| Parametro | Effetto su resa | Effetto su qualità |
| Temperatura alta (>27°C) | ↑ resa in olio | ↓ polifenoli, ↓ volatili aromatici |
| Temperatura bassa (<27°C) | ↓ resa | ↑ polifenoli, ↑ aromi verdi |
| Gramolazione lunga | ↑ resa | Rischio ossidazione, ↓ polifenoli |
| Gramolazione breve | ↓ resa | ↑ polifenoli, minore ossidazione |

**"Estratto a freddo"** significa gramolazione e centrifugazione a temperatura massima di **27°C**. A dispetto della resa inferiore, è la scelta che preserva polifenoli e aromi.

> Il mastro oleario decide in sala gramolazione. È qui che si fa o si disfà la qualità di una campagna olearia.`,
    },
    {
        id: "chim-7",
        slug: "filtrazione-olio-effetti-stabilita",
        title: "Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità",
        excerpt: "La filtrazione non è solo questione di aspetto. Ha effetti profondi sulla stabilità microbiologica e chimica dell'olio nel tempo. Ecco come e perché.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/filtraggio-olio.jpg",
        category: "Chimica dell'olio di oliva",
        content: `## Cosa contiene un olio non filtrato

Appena uscito dal separatore centrifugo, l'olio EVO non è chimicamente "puro" — contiene ancora in sospensione:

- **Micro-goccioline d'acqua** di vegetazione (0,1–0,3%)
- **Frammenti di polpa** (cellule vegetali, membrane)
- **Enzimi** ancora attivi (lipasi, polifenolossidasi)
- **Lieviti e batteri** (flora endogena delle olive)
- **Clorofille** e cere in parte ancora sospese

Questi componenti sono responsabili dell'aspetto torbido — e di fenomeni chimici e biologici che si sviluppano nel tempo.

## Perché la filtrazione migliora la stabilità

### Eliminazione dell'acqua

L'acqua in sospensione è il substrato ideale per:
- **Idrolisi enzimatica**: le lipasi scindono i trigliceridi in acidi grassi liberi → acidità in aumento
- **Crescita microbica**: lieviti e batteri fermentano i residui zuccherini → difetti avvinato e riscaldo

### Eliminazione degli enzimi

La **polifenolossidasi** (PPO) ossida i polifenoli in presenza di ossigeno. Se non eliminata dalla filtrazione, continua il suo lavoro nell'olio già imbottigliato — riducendo progressivamente il contenuto di polifenoli.

### Eliminazione della flora microbica

I microrganismi responsabili di fermentazioni indesiderate vengono trattenuti nei filtri di cellulosa (pori da 0.5–5 micron).

## Quando il non filtrato è preferibile

Un olio non filtrato **consumato nelle prime 4–6 settimane** dalla frangitura può avere aromi più vivaci e un profilo leggermente più ricco. Passato questo periodo, i fenomeni descritti sopra iniziano a manifestarsi:

- L'acidità tende a salire più rapidamente
- Compaiono note fermentative lievi
- Il colore opalescente si deposita in fondo (morchia)

> Per la conservazione prolungata: sempre filtrato. Per una degustazione di novello freschissimo: il non filtrato ha il suo fascino — ma consumatelo subito.`,
    },
    // ─── Difetti specifici ───
    {
        id: "dif-3",
        slug: "difetto-avvinato-inacetito-olio",
        title: "Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione",
        excerpt: "L'olio che sa di aceto non è un olio buono — è un olio con un difetto di fermentazione. Scopri da dove viene e come si previene nella produzione.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/difetto-1.jpg",
        category: "Difetti dell'olio EVO",
        content: 
        
        `## Cos'è il difetto avvinato-inacetito

Se un olio ti richiama il vino “andato” o l’aceto, non è una sfumatura curiosa: è quasi sempre un difetto. L’**avvinato–inacetito** nasce quando le olive, prima di essere molite, entrano in una fase di **fermentazione**. In quel momento il frutto perde pulizia e l’olio smette di profumare di verde e freschezza, prendendo una direzione più “vinoso-acida”, che in un extra vergine non dovrebbe mai comparire.

È un difetto fastidioso perché copre tutto: spegne il fruttato e lascia addosso una sensazione pungente, poco armonica, che si sente anche su un piatto semplice.

## Perché succede (la storia tipica)

Di solito succede per una combinazione molto concreta di fattori: **tempo** e **gestione delle olive**. Le olive vengono raccolte, ma poi restano ferme troppo a lungo prima della molitura. Se stanno in un ambiente caldo, se sono ammassate, se non “respirano”, o se la partita è già un po’ stressata (olive danneggiate, bacate, troppo mature), i microrganismi trovano l’ambiente perfetto per partire.

È una di quelle situazioni in cui basta poco per cambiare il risultato: magari non te ne accorgi a occhio, ma l’olio te lo racconta subito al naso.

## Il meccanismo chimico (spiegato semplice)

Quando partono le fermentazioni, aumentano alcune sostanze volatili tipiche di quel mondo lì: componenti “alcoliche” e “acetiche” (come etanolo e acido acetico) e, spesso, l’**acetato di etile**, che è tra i responsabili di quella sensazione pungente e un po’ “fermentata” che ricorda il vino/aceto.

Non serve ricordarsi i nomi: la cosa importante è che questi composti spostano l’aroma su un registro estraneo all’EVO. È come se l’olio smettesse di parlare di oliva fresca e iniziasse a parlare di trasformazioni non controllate.

## Come riconoscerlo davvero (senza confonderlo)

### All’olfatto

Qui di solito è abbastanza netto: ti arrivano note di **aceto di vino**, **vino ossidato** o frutta che ha iniziato a fermentare. A volte può avere anche un’impressione “di cantina”, ma la differenza è che l’avvinato è più **acido e pungente**, meno “umido”.

Un olio sano, anche intenso, tende a darti segnali verdi (erba, carciofo, pomodoro, mandorla fresca). L’avvinato invece sembra “uscire di carreggiata” e portarti su profumi che non ti aspetti da un extra vergine.

### In bocca

In bocca l’avvinato non è il piccante elegante dei polifenoli. Il **piccante buono** è pulito, vivo, spesso lo senti in gola e accompagna un fruttato presente. L’avvinato, invece, dà una sensazione più “scomposta”: pungente, vinosa, a volte quasi leggermente solvente, e soprattutto non ha quella freschezza vegetale che ti aspetteresti.

### Un test semplice a casa

Se hai un dubbio, prova a versare un filo d’olio in un bicchierino e a scaldarlo qualche secondo tra le mani. Poi annusa con respiri piccoli: se la nota aceto/vino emerge chiaramente e “prende la scena”, difficilmente è suggestione.

## Le cause nella filiera (dove nasce quasi sempre)

Questo difetto, quasi sempre, è figlio della fase che precede il frantoio: **attese troppo lunghe**, olive tenute in modo poco ventilato, accumuli che scaldano internamente, contenitori sbagliati (tipo sacchi chiusi), oppure partite non perfettamente sane che vengono lavorate come se lo fossero. Anche l’igiene conta: residui e sporco facilitano derive fermentative e amplificano il problema.

In sostanza, è il classico difetto che ti dice: “qui non si è lavorato abbastanza in fretta e abbastanza pulito”.

## Come si previene (cosa conta davvero)

La prevenzione è soprattutto una questione di **rapidità** e **buone pratiche**. Le olive devono arrivare in frantoio e diventare olio in tempi brevi, senza soste inutili. Devono stare in contenitori che lasciano passare aria, senza cumuli compatti che si scaldano. E, quando una partita è visibilmente compromessa, va gestita con attenzione: “mescolare per recuperare” spesso significa trascinare il difetto anche negli oli buoni.

Quando tutto questo è sotto controllo, l’avvinato semplicemente non trova spazio.

## Cosa può fare chi compra (anche senza essere esperto)

Tu non puoi controllare il frantoio, ma puoi ridurre molto il rischio scegliendo oli che comunicano bene la loro freschezza (campagna/periodo di produzione, filiera chiara) e fidandoti del tuo naso alla prima apertura. Se un olio appena aperto ti dà subito un’impronta vinosa o acetica, non è una “caratteristica”: è un segnale.

E poi c’è la parte finale, quella domestica: conservare bene non “cura” l’avvinato, ma impedisce che un olio già debole peggiori ancora più in fretta.

:::cta
Vuoi un EVO pulito, senza note fermentative?
La qualità nasce da olive sane e lavorazione rapida: è lì che si decide tutto.
[Scopri gli oli in shop](/shop)
:::`,
references: [
  {
    label: "International Olive Council (IOC/COI) — Specific vocabulary for virgin olive oil (negative attributes)",
    url: "https://www.internationaloliveoil.org/wp-content/uploads/2022/10/COI-T20-Doc.-15-REV-8-2015-ENG.pdf",
    note: "Vocabolario ufficiale COI con definizioni dei difetti sensoriali (incluso winey-vinegary / avvinato-inacetito)."
  },
  {
    label: "Regulation (EU) 2022/2104 — Marketing standards for olive oil (EUR-Lex PDF)",
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX%3A32022R2104",
    note: "Quadro UE degli standard di commercializzazione (inclusi riferimenti a requisiti e controlli)."
  },
  {
    label: "Morales et al. (2000) — Sensory and chemical evaluation of winey-vinegary defect (Springer)",
    url: "https://link.springer.com/article/10.1007/s002170050028",
    note: "Studio su correlazioni tra difetto avvinato e composti volatili come acido acetico ed etil acetato."
  }
]
    },
    {
        id: "dif-4",
        slug: "difetto-muffa-morchia-olio",
        title: "Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione",
        excerpt: "Due difetti distinti ma spesso confusi. La muffa viene dalle olive, la morchia dai serbatoi sporchi. Entrambi rovinano irrimediabilmente l'olio.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/difetto-2.jpg",
        category: "Difetti dell'olio EVO",
        content: 
        
        `## Il difetto muffa-umido

### Origine

Il difetto *muffa-umido* nasce quasi sempre prima ancora che l’olio esista. Succede quando le olive restano in condizioni dove umidità e microrganismi fanno festa: frutti raccolti già compromessi, partite lasciate in ambienti chiusi e umidi, oppure olive cadute a terra e recuperate tardi.

Durante la frangitura tutto quello che era sulla buccia e nella polpa entra nel processo, e i metaboliti prodotti da muffe e lieviti si trascinano fino all’olio. Il risultato è un profilo che “chiude” ogni nota positiva.

### Note sensoriali

All’olfatto richiama subito una cantina umida: muffa, carta bagnata, terra, a volte fungo.

In bocca la sensazione è coerente: ritorno terroso, sporco, con un retrogusto che copre completamente il fruttato.

### Come prevenirlo

Qui la regola è dura ma semplice: l’olio buono nasce da olive sane. Quindi selezione, velocità e ambiente contano più di tutto.

Evitare raccolte da terra non controllate, ridurre i tempi di attesa prima della molitura e usare contenitori aerati fa una differenza enorme. E se una partita è visibilmente compromessa, va separata: “mescolare per salvare” spesso significa rovinare tutto.

## La morchia: un difetto diverso

### Cos'è la morchia

La **morchia** è il deposito naturale che si forma soprattutto negli oli non filtrati: micro-gocce d’acqua, particelle di polpa, frammenti vegetali, enzimi e una microflora residua.

Di per sé non è “il male assoluto”. Il problema nasce quando l’olio resta a contatto con questo deposito troppo a lungo: lì sotto, in condizioni poco ossigenate, possono partire fermentazioni e degradazioni che cambiano l’olio.

### Il difetto morchia-sedimento

Quando il contatto è prolungato, l’olio può sviluppare note più pesanti e sporche, spesso confuse con altre famiglie di difetti fermentativi. Il fruttato si spegne e lascia spazio a sensazioni “di fondo”, come se il profilo fosse sceso di tono e diventato opaco.

### Come prevenirlo

La prevenzione qui è gestione post-produzione: travasi, pulizia, e (se serve) filtrazione.

Serbatoi adatti, travasi periodici per separare l’olio limpido dai sedimenti e sanificazione corretta evitano che la morchia diventi un problema. Se invece si vuole un non filtrato “da novello”, la chiave è una sola: consumarlo fresco, senza lasciarlo mesi a depositare.

:::cta
Vuoi un EVO pulito e stabile nel tempo?
Filiera curata e stoccaggio corretto fanno la differenza: profumo più chiaro, gusto più pulito.
[Scopri gli oli in shop](/shop)
:::`,

references: [
  {
    label: "International Olive Council (IOC/COI) — Specific vocabulary for virgin olive oil (negative attributes)",
    url: "https://www.internationaloliveoil.org/wp-content/uploads/2022/10/COI-T20-Doc.-15-REV-8-2015-ENG.pdf",
    note: "Definizioni ufficiali di difetti come musty-humid-earthy e fusty/muddy sediment."
  },
  {
    label: "Morales et al. (2005) — Comparative study of virgin olive oil sensory defects (Food Chemistry / ScienceDirect)",
    url: "https://www.sciencedirect.com/science/article/abs/pii/S0308814604004601",
    note: "Studio di riferimento sui principali difetti sensoriali e la loro caratterizzazione."
  },
  {
    label: "CREA (Italia) — Sensory analysis: conoscere e riconoscere l’olio",
    url: "https://oleario.crea.gov.it/en/the-sensory-analysis-of-olive-oil-knowing-and-recognising-the-oil/",
    note: "Spiegazione divulgativa autorevole sui difetti e sul riconoscimento sensoriale."
  }
]
    },
    // ─── Ricette aggiuntive ───
    {
        id: "ric-7",
        slug: "olio-per-pesce-crudo-carpaccio",
        title: "Olio su pesce crudo e carpaccio: quale scegliere e perché",
        excerpt: "Il pesce crudo è delicato — l'olio deve valorizzarlo senza coprirlo. Ecco il profilo giusto e la tecnica per carpacci, tartare e crudi di mare perfetti.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "3 min",
        author: "Chef del Frantoio",
        imageUrl: "/blog/carpaccio.jpg",
        category: "Ricette e abbinamenti",
        content: `## Il pesce crudo non perdona

Quando servite un carpaccio di spada, una tartare di tonno o un crudo di gamberi, ogni ingrediente è in primo piano — non ci sono salse dense o cotture che compensano. L'olio è protagonista insieme al pesce.

La regola d'oro: **l'olio non deve competere col pesce, deve ampliarlo**.

## Il profilo ideale

Per il pesce crudo il profilo ottimale è il **fruttato leggero-medio**, con:
- Note di *mandorla fresca* o *frutta* (pesca, mela)
- Amaro quasi assente o molto lieve
- Piccante contenuto (non deve sopraffare la delicatezza del pesce)

Un fruttato intenso con amaro e piccante decisi copre i sapori iodurati del mare — errore classico degli inizio-appassionati.

## Abbinamenti specifici

- **Carpaccio di spada o tonno**: fruttato leggero, sale Maldon, qualche goccia di limone. *Nient'altro*.
- **Tartare di gamberi rossi**: un filo di fruttato leggero e scorza di limone grattugiata
- **Crudo di ricciola**: fruttato medio delicato + fiocchi di sale + qualche foglia di menta
- **Ostrica aperta** (abbinamento insolito ma magnifico): una goccia di fruttato leggero esalta la sapidità marina

## La tecnica

1. Versate l'olio **al momento del servizio** — non prima, o il pH del pesce inizia a "cuocere" la proteina (effetto ceviche)
2. Usate un biberon o un cucchiaio per dosare con precisione — non siate avari ma nemmeno generosi
3. Un pizzico di **sale in fiocchi** (Maldon, Fleur de sel) amplifica tutto
4. Servite su piatto freddo

:::cta
Il nostro fruttato leggero — ideale per i crudi di mare
[Acquista ora](/shop)
:::`,
    },
    {
        id: "ric-8",
        slug: "olio-per-carne-grigliat",
        title: "Olio per carne alla griglia: fruttato intenso e il perché del contrasto",
        excerpt: "La bistecca alla griglia con un filo di olio EVO fruttato intenso è un'esperienza sensoriale potente. Il contrasto tra grasso animale e amaro vegetale è magistrale.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "3 min",
        author: "Chef del Frantoio",
        imageUrl: "/blog/carne-griglia.jpg",
        category: "Ricette e abbinamenti",
        content: `## Il contrasto che funziona

La carne alla griglia, soprattutto quella rossa (bistecca fiorentina, tagliata di manzo, entrecôte), ha caratteristiche sensoriali forti: **grassezza, sapidità, note di brace, umami intenso**. Un olio delicato si perderebbe completamente.

Serve un olio con carattere — e il **fruttato intenso** è la scelta perfetta.

## Perché il fruttato intenso funziona sulla carne

Il contrasto tra il **grasso della carne** e l'**amaro/piccante del fruttato intenso** crea una delle combinazioni più equilibrate in assoluto:

- L'amaro del polifenolo "pulisce" il palato dal grasso della carne
- Il piccante dell'oleocantale crea un contrasto piacevole con la sapidità
- Le note verdi e vegetali dell'olio si integrano con le note di brace

È il principio del contrasto: sapori opposti che si amplificano a vicenda.

## Come usarlo

L'olio sulla carne si usa **sempre a crudo, dopo la cottura**:

1. Grigliate la carne fino al grado di cottura voluto (per la fiorentina: al sangue!)
2. Togliete dal fuoco e lasciate riposare 2 minuti su tagliere
3. Affettate (per le bistecche grandi)
4. **Versate un filo generoso di fruttato intenso** sulle fette ancora calde
5. Sale grosso o Maldon sopra
6. Servite immediatamente

Il calore residuo della carne apre gli aromi dell'olio senza cuocerlo — il momento perfetto.

## Altri abbinamenti con la carne

- **Agnello alla griglia**: fruttato intenso con note erbacee (rosmarino, timo nell'olio)
- **Fegato di vitello**: l'amaro dell'olio bilancia il sapore ferroso del fegato
- **Pollo allo spiedo**: fruttato medio — la carne bianca non regge l'intenso

:::cta
Il nostro fruttato intenso — la scelta della griglia
[Ordina ora](/shop)
:::`,
    },
    {
        id: "ric-9",
        slug: "olio-per-pizza",
        title: "Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo",
        excerpt: "L'olio sulla pizza è un gesto quasi automatico — ma quanti si chiedono quale olio usare, quando aggiungerlo e perché? Piccola guida per pizzaioli casalinghi.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "3 min",
        author: "Chef del Frantoio",
        imageUrl: "/blog/olio-pizza.jpg",
        category: "Ricette e abbinamenti",
        content: `## L'olio nella pizza: due momenti diversi

Ci sono due modi in cui l'olio interagisce con la pizza, e hanno effetti completamente diversi:

1. **L'olio nell'impasto**: un cucchiaio di EVO nell'impasto serve per la struttura — rende il punto di taglio più morbido e favorisce la croccantezza del cornicione. Qui la qualità conta meno.

2. **L'olio finisher a crudo** (dopo l'uscita dal forno): qui la qualità conta moltissimo — è quello che sentite davvero.

## A che temperatura finisce il vostro olio?

Una pizza esce dal forno a legna o pietra refrattaria a **300–450°C** al centro. Se aggiungete l'olio in forno, lo cuocete a temperature altissime — distruggendo tutti i polifenoli e gli aromi. È uno spreco.

La tecnica corretta: **olio sempre fuori dal forno, sul prodotto finito e ancora caldo**.

## Quale profilo per quale pizza

- **Margherita classica**: *fruttato medio* — l'equilbrio tra pomodoro e mozzarella non sopporta eccessi
- **Pizza bianca con funghi**: *fruttato medio-intenso* — il fungo ha un sapore terroso che regge l'olio più deciso
- **Marinara** (aglio, pomodoro, origano, niente formaggio): *fruttato intenso* — gli ingredienti robusti vogliono un olio con carattere
- **Pizza con verdure grigliate**: *fruttato medio*
- **Calzone ripieno**: un filo generoso di *fruttato medio* appena uscito

## La quantità

Non abbiate paura di usarne: **un giro generoso** sul cornicione e sulla superficie mentre la pizza è ancora calda. L'olio si integra con il calore residuo — è in quel momento che la pizza trasforma da buona a memorabile.`,
    },
    // ─── Fiducia / E-E-A-T ───
    {
        id: "fid-3",
        slug: "tracciabilita-lotto-analisi-qualita",
        title: "Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità",
        excerpt: "La parola 'qualità' è abusata. Noi la documentiamo: ogni lotto ha un numero tracciabile, analisi di laboratorio e provenienza verificabile. Ecco come funziona.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Emanuele Del Pasqua",
        imageUrl: "/blog/tracciabilita-prodotto.jpg",
        category: "Il nostro frantoio",
        content: `## La tracciabilità non è un optional

Nel settore alimentare italiano, la tracciabilità di filiera è regolata dal **Reg. UE 178/2002**: ogni operatore deve poter identificare fornitori e clienti (tracciabilità "un passo avanti, un passo indietro"). Per l'olio EVO extra vergine, le norme sono particolarmente dettagliate.

Ma la tracciabilità obbligatoria è il minimo. Noi andiamo oltre.

## Come funziona il nostro sistema

### Il numero di lotto

Ogni imbottigliamento è identificato da un **numero di lotto** stampato sul fondo di ogni bottiglia o lattina. Questo numero rimanda a:

- **Data di imbottigliamento** specifica
- **Campagna olearia** di riferimento (es. 2025/2026)
- **Oliveto di provenienza** (coordinate GPS dell'appezzamento)
- **Data di frangitura** (da quando all'imbottigliamento)

### Le analisi di laboratorio per lotto

Prima di ogni imbottigliamento, il lotto viene analizzato da un **laboratorio accreditato** (UNI CEI EN ISO/IEC 17025) per:

- *Acidità libera* (titolazione)
- *Numero di perossidi* (iodometria)
- *K232 e K270* (spettrofotometria UV)
- *Polifenoli totali* (Folin-Ciocalteu)
- *Panel Test sensoriale* (assaggiatori interni certificati COI)

Il certificato di analisi è disponibile su richiesta per ogni lotto.

### Provenienza verificabile

Le olive provengono esclusivamente dai nostri oliveti in Toscana. Non acquistiamo olive da terzi o da cooperative miste. Questo ci permette di garantire:

- Controllo completo delle pratiche agronomiche
- Nessuna mescolanza con olive di provenienza ignota
- Tracciabilità varietale (cultivar specifiche per lotto, ove possibile)

## Come verificare voi stessi

1. Trovate il **numero di lotto** sulla vostra bottiglia
2. Contattateci indicando il numero di lotto
3. Vi inviamo il certificato di analisi completo del laboratorio

> La trasparenza non si dichiara — si dimostra con i dati.`,
    },
    {
        id: "fid-4",
        slug: "perche-olio-cambia-ogni-anno",
        title: "Perché l'olio cambia ogni anno: clima, resa, maturazione",
        excerpt: "Come il vino, l'olio EVO cambia ogni anno. Colore, intensità, note aromatiche — tutto dipende dall'annata. Ecco perché è normale e perché è bello.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Emanuele Del Pasqua",
        imageUrl: "/blog/olio-cambiamento.avif",
        category: "Il nostro frantoio",
        content: `## L'olio è un prodotto agricolo, non industriale

Chi compra il solito olio da supermercato anno dopo anno riceve sempre lo stesso prodotto — perché è una miscela standardizzata di oli da origini diverse, miscelata per ottenere un profilo costante. Non è necessariamente sbagliato — ma non ha la ricchezza di un olio artigianale.

Un olio artigianale *cambia ogni anno*. Ed è proprio questo che lo rende interessante.

## Le variabili che determinano l'annata

### Il clima primaverile ed estivo

Le piogge di primavera determinano la **dimensione del frutto**. Un'estate calda e asciutta favorisce la concentrazione dei polifenoli (la pianta sotto stress produce più composti di difesa). Un'estate piovosa produce olive più grandi ma meno concentrate.

**Annate calde e secche** → olive più piccole, resa inferiore, ma olio più ricco di polifenoli e più aromatico.

**Annate fresche e piovose** → olive più grandi, resa migliore, olio più delicato.

### La fioritura e l'allegagione

La percentuale di fiori che diventano frutti (allegagione) dipende dalle temperature e dalle piogge di maggio. Un maggio freddo o molto piovoso può ridurre drasticamente la produzione.

### Le avversità fitosanitarie

La **mosca dell'olivo** (*Bactrocera oleae*) colpisce in modo diverso ogni anno, a seconda delle temperature estive:
- Estati molto calde (>35°C) → la mosca non si riproduce bene → danno limitato
- Estati fresche e umide → proliferazione intensa → danno potenzialmente grave

### Il momento di raccolta

Anche a parità di olive, raccogliere a ottobre o a novembre cambia tutto: le olive di novembre hanno più olio ma meno polifenoli. La scelta del momento della raccolta è una delle decisioni più critiche del produttore.

## Cosa significa per il consumatore

- Il colore dell'olio varia: più verde nelle annate di raccolta precoce, più dorato in quelle tardive
- L'intensità aromatica varia: le annate siccitose producono oli più concentrati e polifenolici
- La resa varia: in certi anni il prezzo è inevitabilmente più alto

> Comprare olio artigianale è come comprare vino da un piccolo produttore: ogni annata è un'interpretazione diversa dello stesso luogo.`,
    },
    {
        id: "fid-5",
        slug: "oleoturismo-degustazioni-frantoio",
        title: "Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena",
        excerpt: "L'oleoturismo è una delle esperienze enogastronomiche più autentiche d'Italia. Visitare un frantoio durante la spremitura cambia per sempre il modo di vivere l'olio.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Frantoio del Pasqua",
        imageUrl: "/blog/degustazione-olio.avif",
        category: "Il nostro frantoio",
        content: `## Cos'è l'oleoturismo

L'**oleoturismo** è la forma di turismo enogastronomico legata al mondo dell'olio d'oliva. In Italia è stato ufficialmente riconosciuto con la **Legge 12 dicembre 2019, n. 158**, che equipara i produttori di olio agli enoturisti nella possibilità di aprire le proprie strutture per visite, degustazioni, ristorazione e accoglienza.

È una risposta alla crescente domanda di esperienze autentiche, legate al territorio e ai produttori diretti.

## Cosa si fa in un frantoio durante la visita

### In periodo di spremitura (ottobre–dicembre)

Visitare un frantoio *durante la campagna olearia* è l'esperienza più completa e immersiva:

1. **Visita all'oliveto**: osservare la raccolta manuale o con agevolatori, capire l'indice di maturazione, parlare con chi raccoglie
2. **Visita al frantoio in funzione**: vedere la frangitura, la gramolazione, la centrifuga — il profumo del frantoio in funzione è inconfondibile
3. **Assaggio dell'olio appena estratto** (mosto d'olio): torbido, verde, pungente — un'esperienza che non si dimentica
4. **Degustazione guidata** di più oli con diversi profili aromatici

### Al di fuori della spremitura

Anche fuori stagione, la visita a un frantoio ben strutturato offre:

- Tour dell'impianto con spiegazione del processo
- Degustazione ragionata con abbinamenti a prodotti locali
- Possibilità di acquisto diretto con conoscenza del produttore

## Perché vale la pena

Chi visita un frantoio torna a casa con:

- Una comprensione completamente diversa di quello che mette nel piatto ogni giorno
- La capacità di distinguere un olio buono da uno mediocre — per sempre
- Un rapporto diretto con il produttore (e la fiducia che ne consegue)
- Ricordi sensoriali impossibili da avere altrimenti

> Non si può spiegare a parole il sapore del mosto d'olio appena uscito dal separatore. Va vissuto.

:::cta
Prenota la tua visita o degustazione al Frantoio del Pasqua
Disponibile tutto l'anno — con esperienza di raccolta in ottobre/novembre.
[Prenota ora](/degustazioni)
:::`,
    },
    // ─── Informazionale: etichetta e olio leggero ───

    // ─── FAQ ───
    {
        id: "faq-1",
        slug: "faq-olio-evo",
        title: "FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa",
        excerpt: "Le domande più frequenti sull'olio extravergine di oliva, con risposte dirette e senza tecnicismi inutili. Dalla conservazione al prezzo, dall'aspetto al gusto.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "6 min",
        author: "Redazione Frantoio",
        imageUrl: "/blog/FAQ.jpg",
        category: "Informazioni sull'olio EVO",
        content: `## Sul gusto

### Perché l'olio pizzica in gola?

Il pizzicore è causato dall'**oleocantale**, un polifenolo presente quasi esclusivamente nell'olio extravergine di qualità. Non è un difetto — è uno dei migliori indicatori di freschezza e qualità. Più pizzica, più oleocantale c'è, più il tuo olio è salutare.

### Perché l'olio è amaro?

L'amaro è causato principalmente dall'**oleuropeina** e dai suoi derivati. Come il pizzicore, è un attributo *positivo*: indica un olio con alto contenuto di polifenoli. Un olio piatto e dolce è quasi sempre di qualità inferiore.

### Il mio olio non pizzica più — è scaduto?

Non necessariamente scaduto, ma ha perso parte dei polifenoli. Questi si degradano nel tempo, specialmente se l'olio è stato esposto a luce, calore o aria. Il gusto piatto significa che i benefici salutistici sono ridotti, ma l'olio potrebbe ancora essere commestibile se non sa di rancido.

## Sull'aspetto

### Perché il mio olio è diventato torbido?

Se è un olio *non filtrato* novello, il torbido è normale — sono particelle di polpa in sospensione. Si depositeranno con il tempo.

Se è un olio *filtrato* che è diventato torbido: probabilmente ha subito una cristallizzazione parziale delle cere a bassa temperatura (< 10°C). Portandolo a temperatura ambiente, torna limpido — nessun danno.

### L'olio si è solidificato in frigo — è andato a male?

No, per niente. L'olio d'oliva cristallizza parzialmente sotto i 10–12°C. È un comportamento fisico normale degli acidi grassi. Basta portarlo a temperatura ambiente e si scioglie completamente, senza alcun cambiamento di qualità.

### Il colore dell'olio indica la qualità?

*No*. Il colore varia da verde intenso a giallo dorato a seconda della cultivar, del grado di maturazione e del metodo di conservazione. Un olio verde non è necessariamente migliore di uno dorato.

## Sulla conservazione

### Dove tengo l'olio in cucina?

**Lontano dai fornelli, al buio, chiuso**. L'oliera sul piano cottura è l'errore più comune. Meglio: oliera piccola di ceramica opaca da rabboccare frequentemente, la scorta al buio in dispensa o cantina.

### Posso mettere l'olio in frigo?

Puoi, ma non serve. L'olio cristallizza a basse temperature (vedi sopra) e poi si scioglie — nessun danno, ma inutilmente scomodo. Una cantina fresca (12–18°C) è l'ideale. Il frigorifero per l'olio non è necessario.

### Quanto tempo posso tenere l'olio aperto?

**Idealmente 60–90 giorni dall'apertura** per sfruttare le qualità migliori. Dopo 3 mesi in condizioni normali di cucina, l'olio è ancora commestibile ma ha perso intensità aromatica e parte degli antiossidanti.

## Sul prezzo

### Perché l'olio EVO artigianale costa così tanto?

Perché produrlo costa davvero così tanto. Per ogni litro d'olio servono 5–10 kg di olive, raccolte a mano o con agevolatori (non a terra). Aggiungete: manodopera, molitura, imbottigliamento, IVA, logistica. Sotto gli 8–12€ al litro è matematicamente impossibile fare qualità vera con olive italiane.

### Perché il prezzo cambia ogni anno?

L'olio è un prodotto agricolo: la resa dipende dall'annata. Gli anni di siccità producono meno olive (talvolta il 30–50% in meno) con costi di produzione per litro molto più alti. Gli anni buoni abbassano il prezzo.

### Olio da supermercato a 4€/litro: com'è possibile?

Con olive non italiane (spagnole, tunisine, greche), raccolta meccanica intensiva, olive mature o cadute, stoccaggio lungo, meno controlli sulla qualità. È legale — non è necessariamente cattivo per tutti gli usi — ma non è comparabile a un EVO artigianale.

:::cta
Hai altre domande? Siamo qui
Per qualsiasi dubbio sull'olio, sul processo o sui nostri prodotti — scriveteci.
[Contattaci](/shop)
:::`,

references: [
  {
    label: "Regolamento delegato (UE) 2022/2104 — Standard di commercializzazione dell’olio d’oliva",
    url: "https://eur-lex.europa.eu/eli/reg_del/2022/2104/oj/eng",
    note: "Riferimento UE su categorie/standard e quadro generale utile per domande “da etichetta”."
  },
  {
    label: "COI/IOC — Standards, Methods & Guides (pagina ufficiale)",
    url: "https://www.internationaloliveoil.org/what-we-do/chemistry-standardisation-unit/standards-and-methods/",
    note: "Standard internazionali COI: metodi e documenti base per qualità, valutazione e definizioni."
  },
  {
    label: "Caipo L. et al. (2021) — Effect of storage conditions on EVOO quality (Foods, MDPI)",
    url: "https://www.mdpi.com/2304-8158/10/9/2161",
    note: "Supporta in modo scientifico i principi della conservazione: luce e temperatura accelerano decadimento qualitativo."
  },
  {
    label: "Torrecilla J.S. et al. (2015) — Photodegradation & photooxidation in EVOO (PubMed)",
    url: "https://pubmed.ncbi.nlm.nih.gov/26452834/",
    note: "Approfondimento sul ruolo dei pigmenti (clorofille) nei fenomeni di foto-ossidazione."
  }
],
    },

];


