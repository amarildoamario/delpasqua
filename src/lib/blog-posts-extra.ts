import type { BlogPost } from "./blog-data";

export const postsDifetti: BlogPost[] = [
    {
        id: "dif-1",
        slug: "difetti-olio-evo-guida-completa",
        title: "Difetti dell'olio EVO: guida completa ai principali vizi sensoriali",
        excerpt: "Rancido, avvinato, riscaldo, muffa. I difetti dell'olio EVO sono classificati e valutati nel Panel Test COI. Ecco cosa significano e da dove vengono.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "6 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/rancido.jpg",
        category: "Difetti dell'olio EVO",
        content: "",
    },
    {
        id: "dif-2",
        slug: "rancido-cause-prevenzione",
        title: "Rancido: cos'è, perché succede e come evitarlo",
        excerpt: "Il rancido è il difetto più comune e più dannoso per la qualità dell'olio. Capire il meccanismo chimico aiuta a prevenirlo con semplici accorgimenti.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/rancido-cause.jpg",
        category: "Difetti dell'olio EVO", 
        content: "",

references: [
  {
    label: "International Olive Council (IOC/COI) — Standards & Methods (sensory + quality assessment)",
    url: "https://www.internationaloliveoil.org/what-we-do/chemistry-standardisation-unit/standards-and-methods/",
    note: "Raccolta ufficiale di standard e metodi di valutazione dell’olio d’oliva."
  },
  {
    label: "Tarapoulouzi et al. (2022) — Recent advances in analytical methods for oxidation/rancidity detection (Biomolecules, MDPI)",
    url: "https://www.mdpi.com/2218-273X/12/9/1180",
    note: "Review sui metodi analitici e indicatori dell’ossidazione nell’olio."
  },
  {
    label: "Cecchi et al. (2019) — Volatile markers of rancidity in virgin olive oil (PubMed)",
    url: "https://pubmed.ncbi.nlm.nih.gov/31684730/",
    note: "Marker volatili associati al rancido e loro evoluzione in diverse condizioni di conservazione."
  }
]

    }, 
];

export const postsChimica: BlogPost[] = [
    {
        id: "chim-1",
        slug: "composizione-chimica-olio-evo",
        title: "Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile",
        excerpt: "L'olio extravergine non è solo grasso. La sua composizione chimica è sorprendentemente complessa e spiega la maggior parte delle sue proprietà sensoriali e salutistiche.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "7 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/composizione-chimica-olio.jpg",
        category: "Chimica dell'olio di oliva",
        content: "",
    },
    {
        id: "chim-2",
        slug: "polifenoli-oleocantale-oleuropeina",
        title: "Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati",
        excerpt: "I polifenoli sono il cuore salutistico dell'olio extravergine. Tre molecole in particolare — oleocantale, oleuropeina e idrossitirosolo — meritano attenzione speciale.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "6 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/polifenoli-olio.jpg",
        category: "Chimica dell'olio di oliva",
        content: "",
    },
];

export const postsFiducia: BlogPost[] = [
    {
        id: "fid-1",
        slug: "come-nasce-nostro-olio",
        title: "Come nasce il nostro olio: raccolta → frantoio → stoccaggio",
        excerpt: "Dal campo alla bottiglia: ogni fase della produzione influenza il risultato finale. Vi raccontiamo il processo passo per passo con foto e dettagli tecnici.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "5 min",
        author: "Emanuele Del Pasqua",
        imageUrl: "/blog/come-nasce-il-nostro-olio.jpg",
        category: "Il nostro frantoio",
        content: "",
    },
    {
        id: "fid-2",
        slug: "come-degustare-olio-5-minuti",
        title: "Come degustare l'olio EVO in 5 minuti: guida pratica per tutti",
        excerpt: "Non serve essere assaggiatori professionisti. Con qualche strumento e le istruzioni giuste puoi degustare l'olio come un esperto — in cinque minuti, a casa tua.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "4 min",
        author: "Frantoio del Pasqua",
        imageUrl: "/blog/oleoturismo.jpg",
        category: "Il nostro frantoio",
        content: "",
    },
];

export const postsGlossario: BlogPost[] = [
    {
        id: "glos-1",
        slug: "glossario-olio-evo",
        title: "Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro",
        excerpt: "Tutti i termini dell'universo dell'olio extravergine spiegati in modo semplice. Dal fruttato al Panel Test, dalla morchia alla cultivar.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "8 min",
        author: "Redazione Frantoio",
        imageUrl: "/blog/glossario.jpg",
        category: "Informazioni sull'olio EVO",
        content: "",

references: [
  {
    label: "Regolamento delegato (UE) 2022/2104 — Standard di commercializzazione dell’olio d’oliva",
    url: "https://eur-lex.europa.eu/eli/reg_del/2022/2104/oj/eng",
    note: "Definisce categorie, caratteristiche e requisiti legali (quadro UE aggiornato; abroga i vecchi riferimenti storici)."
  },
  {
    label: "Regolamento di esecuzione (UE) 2022/2105 — Controlli di conformità per gli standard dell’olio d’oliva",
    url: "https://eur-lex.europa.eu/eli/reg_impl/2022/2105/oj/eng",
    note: "Regole e procedure di controllo; rimanda ai limiti/parametri della 2022/2104."
  },
  {
    label: "COI/IOC — Standards, Methods & Guides (pagina ufficiale)",
    url: "https://www.internationaloliveoil.org/what-we-do/chemistry-standardisation-unit/standards-and-methods/",
    note: "Hub COI con standard di commercio, metodi analitici e documenti di analisi sensoriale."
  },
  {
    label: "COI/IOC (2024) — Metodo Panel Test (COI/T.20/Doc. n. 15/Rev. 11)",
    url: "https://www.internationaloliveoil.org/wp-content/uploads/2024/10/COI-T20-Doc.-15-REV-11-2024-IT.pdf",
    note: "Riferimento per termini come fruttato/amaro/piccante, difetti e criteri statistici (mediana)."
  },
  {
    label: "EU Register — Health claim ufficiale sui polifenoli dell’olio d’oliva",
    url: "https://ec.europa.eu/food/food-feed-portal/screen/health-claims/eu-register/details/POL-HC-6431",
    note: "Condizioni d’uso del claim e definizione di idrossitirosolo + derivati."
  },
  {
    label: "Regolamento (UE) 2018/848 — Produzione biologica ed etichettatura dei prodotti biologici",
    url: "https://eur-lex.europa.eu/eli/reg/2018/848/oj/eng",
    note: "Base normativa per il termine “biologico” citato nel glossario."
  }
],

    },


];


