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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",

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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",
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
        content: "",

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


