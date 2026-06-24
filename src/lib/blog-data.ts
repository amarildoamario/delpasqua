export interface BlogReference {
    label: string;
    url: string;
    note?: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    updateDate: string;
    readingTime: string;
    author: string;
    imageUrl: string;
    category: string;
    references?: BlogReference[];
}

import { postsCommerciali } from "./blog-posts-commercial";
import { postsInformativi } from "./blog-posts-info";
import { postsRicette } from "./blog-posts-recipes";
import { postsDifetti, postsChimica, postsFiducia, postsGlossario } from "./blog-posts-extra";
import { postsBatch2 } from "./blog-posts-batch2";
import { postsTecnici } from "./blog-posts-tecnici";
import { BLOG_POST_TRANSLATIONS } from "./blogTranslationsData";
import { findBlogPostBySlug, type Locale } from "./blogSlugs";

const corePosts: BlogPost[] = [

    {
        id: "post-1",
        slug: "benefici-olio-evo-salute",
        title: "I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana",
        excerpt: "Non è solo un condimento, è il carburante pulito per chi ama vivere una vita attiva. Scopri come l'Olio EVO supporta le tue giornate, nutre i muscoli e protegge il cuore.",
        content: "",
        references: [
            {
                label: "Covas M.I. et al. (2006) — The effect of polyphenols in olive oil on heart disease risk factors. Annals of Internal Medicine",
                url: "https://www.acpjournals.org/doi/10.7326/0003-4819-145-5-200609050-00006",
                note: "Studio clinico incrociato che dimostra come l'assunzione di olio EVO ad alto contenuto di polifenoli aumenti il colesterolo HDL e protegga l'LDL dall'ossidazione."
            },
            {
                label: "Mataix J. et al. (2001) — Olive oil and exercise. International Journal for Vitamin and Nutrition Research",
                url: "https://econtent.hogrefe.com/doi/abs/10.1024/0300-9831.71.3.161",
                note: "Analisi di come i grassi monoinsaturi e gli antiossidanti dell'olio EVO supportino il metabolismo lipidico e la risposta allo stress ossidativo indotto dall'esercizio fisico."
            }
        ],
        date: "2026-03-01",
        updateDate: "2026-03-02",
        readingTime: "4 min",
        author: "Frantoio del Pasqua",
        imageUrl: "/blog/benefici-olio-evo-salute.jpg",
        category: "Salute & Benessere"
    },
    {
        id: "post-chem-1",
        slug: "acidita-olio-evo",
        title: "L'acidità dell'Olio EVO: sfatiamo i miti comuni",
        excerpt: "Spesso si confonde il sentore di 'piccante' in gola con l'acidità. Scopriamo cos'è veramente e come si misura.",
        content: "",
        date: "2026-02-28",
        updateDate: "2026-02-28",
        readingTime: "4 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/acidita-olio-oliva.png",
        category: "Chimica dell'olio di oliva"
    },
    {
        id: "post-chem-2",
        slug: "polifenoli-e-perossidi",
        title: "Polifenoli e Perossidi: come decifrare le analisi dell'olio",
        excerpt: "Impariamo a leggere insieme il referto chimico di un Olio Extravergine: cosa indicano i valori di perossidi e polifenoli.",
        content: "",
        date: "2026-02-27",
        updateDate: "2026-02-27",
        readingTime: "5 min",
        author: "Dipartimento Qualità",
        imageUrl: "/blog/polifenoli-e-perossidi.jpg",
        category: "Chimica dell'olio di oliva"
    },
    {
        id: "post-buy-2",
        slug: "supermercato-vs-frantoio",
        title: "Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale",
        excerpt: "Perché sugli scaffali troviamo olio EVO a 5€ quando al frantoio ne costa più del doppio? Facciamo i conti senza filtri e scopriamo cosa beviamo davvero.",
        content: "",
        references: [
            {
                label: "ISMEA Mercati — Osservatorio economico e andamento dei prezzi dell'olio d'oliva in Italia",
                url: "http://www.ismeamercati.it/olio-oliva",
                note: "Rapporto istituzionale italiano sui costi di produzione reale della filiera agricola olearia, che conferma la soglia fisiologica dei costi dell'Evo artigianale nazionale."
            },
            {
                label: "Frankel E.N. et al. (2011) — Evaluation of Extra-Virgin Olive Oil Sold in California. UC Davis Olive Center",
                url: "https://olivecenter.ucdavis.edu/media/files/report041211finalreduced.pdf",
                note: "Report shock che evidenziò come oltre il 70% degli oli extravergine industriali venduti in GDO ai piani bassi del prezzo in USA fossero in realtà vecchi, ossidati e al di sotto degli standard sensoriali dell'Extravergine."
            }
        ],
        date: "2026-02-20",
        updateDate: "2026-02-20",
        readingTime: "5 min",
        author: "Emanuele Del Pasqua",
        imageUrl: "/blog/come-nasce-nostro-olio.jpg", 
        category: "Consigli di acquisto"
    },
    {
        id: "post-store-1",
        slug: "quanto-dura-olio-evo",
        title: "Quanto dura un Olio EVO e come conservarlo al meglio",
        excerpt: "L'olio non scade, ma invecchia. Scopri come leggere il TMC, perché il calore e la luce sono i veri nemici, e i trucchi per mantenere intatti profumi e polifenoli in dispensa.",
        content: "",
        references: [
            {
                label: "Reg. (UE) 1169/2011 — Fornitura di informazioni sugli alimenti ai consumatori",
                url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=celex%3A32011R1169",
                note: "Normativa europea che definisce la differenza legale e concettuale tra Data di Scadenza e Termine Minimo di Conservazione (TMC)."
            },
            {
                label: "Mendez A.I. & Falque E. (2007) — Effect of storage time and container type on the quality of extra-virgin olive oil. Food Control",
                url: "https://www.sciencedirect.com/science/article/abs/pii/S0956713506000557",
                note: "Studio empirico sul decadimento degli indicatori di freschezza in bottiglie aperte conservate a temperatura ambiente (sopra i 3 mesi)."
            },
            {
                label: "Lozano-Sánchez J. et al. (2010) — Shelf-life of extra virgin olive oil under different storage conditions. Comprehensive Reviews in Food Science and Food Safety",
                url: "https://onlinelibrary.wiley.com/doi/10.1111/j.1541-4337.2010.00108.x",
                note: "Revisione accademica sull'impatto di ossigeno, temperatura e luce sulla longevità dei polifenoli."
            }
        ],
        date: "2026-02-18",
        updateDate: "2026-02-18",
        readingTime: "4 min",
        author: "Frantoio del Pasqua",
        imageUrl: "/blog/quanto-dura-olio-evo.jpg",
        category: "Conservazione"
    },
    {
        id: "post-store-2",
        slug: "bottiglia-scura-o-latta",
        title: "Lattina o bottiglia scura? Quale conserva meglio l'olio EVO",
        excerpt: "Sembrano solo contenitori, ma la scelta tra lattina e bottiglia di vetro incide concretamente su quanto a lungo il vostro olio mantiene qualità e polifenoli. Vediamo perché.",
        content: "",
        references: [
            {
                label: "Frankel E.N. (2011) — Nutritional and Biological Properties of Extra Virgin Olive Oil. Journal of Agricultural and Food Chemistry",
                url: "https://pubs.acs.org/doi/10.1021/jf2015872",
                note: "Analisi dettagliata dei meccanismi di degradazione dell'olio EVO, inclusa fotossidazione e ossidazione termica."
            },
            {
                label: "Pristouri G. et al. (2010) — Effect of packaging material headspace, and storage conditions on quality indicators of extra virgin olive oil. Food Control",
                url: "https://www.sciencedirect.com/science/article/abs/pii/S0956713509002606",
                note: "Studio sperimentale sul confronto tra diversi materiais di packaging (vetro, PET, lattina) e loro effetto sulla qualità dell'EVO nel tempo."
            },
            {
                label: "Reg. UE 29/2012 — Norme di commercializzazione applicabili all'olio d'oliva",
                url: "https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A32012R0029",
                note: "Normativa europea che definisce i requisiti di imballaggio e confezionamento per l'olio d'oliva extravergine."
            },
            {
                label: "Lerma-García M.J. et al. (2009) — Prediction of olive oil sensory scores by means of near-infrared spectroscopy. Food Chemistry",
                url: "https://www.sciencedirect.com/science/article/abs/pii/S0308814608011345",
                note: "Evidenza scientifica della correlazione tra esposizione alla luce e degradazione dei parametri qualitativi sensoriali dell'olio EVO."
            }
        ],
        date: "2026-02-12",
        updateDate: "2026-02-12",
        readingTime: "5 min",
        author: "Frantoio del Pasqua",
        imageUrl: "/blog/lattina-bottiglie-confronto.jpg",
        category: "Conservazione"
    },
    {
        id: "post-use-1",
        slug: "friggere-con-olio-evo",
        title: "Friggere con l'olio extravergine: falso mito o realtà culinaria?",
        excerpt: "Risolleviamo l'onore del fritto con olio EVO smontando alcune false credenze radicate sui punti di fumo.",
        content: "",
        references: [
          {
            label: "Abrante-Pascual S. et al. (2024) — Olive oil as a premium frying oil (Foods, MDPI)",
            url: "https://www.mdpi.com/2304-8158/13/24/4186",
            note: "Review: perché l’olio d’oliva risulta spesso più stabile in frittura rispetto a oli più ricchi di polinsaturi."
          },
          {
            label: "Katragadda H.R. et al. (2010) — Aldehydes from heated cooking oils (Food Chemistry, ScienceDirect)",
            url: "https://www.sciencedirect.com/science/article/abs/pii/S0308814609011303",
            note: "Base scientifica sulle differenze tra oli in termini di aldeidi prodotte durante il riscaldamento."
          },
          {
            label: "Freis A.M. et al. (2025) — Effects of thermal exposure on edible oils (open access, PMC)",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11816481/",
            note: "Confronti sperimentali su oli riscaldati e prodotti di degradazione in condizioni simili all’uso domestico."
          }
        ],
        date: "2026-02-05",
        updateDate: "2026-02-05",
        readingTime: "3 min",
        author: "Chef del Frantoio",
        imageUrl: "/blog/frittura.jpg",
        category: "Consumo corretto"
    },
    {
        id: "post-use-2",
        slug: "esaltare-olio-nuovo-crudo",
        title: "Olio nuovo d'annata: come esaltarlo nei piatti a crudo",
        excerpt: "Esiste una sola regola inconfutabile quando l'Olio è novello, verde smeraldo e ricchissimo di polifenoli: niente fiamme!",
        content: "",
        references: [
          {
            label: "CREA — Conoscere e riconoscere l’olio (analisi sensoriale e attributi positivi)",
            url: "https://oleario.crea.gov.it/il_mondo_dell_olio/conoscere-e-riconoscere-lolio/",
            note: "Risorsa autorevole italiana: spiega fruttato/amaro/piccante e come leggere le sensazioni in modo corretto."
          },
          {
            label: "Klisović D. et al. (2024) — Thermal-induced alterations in phenolic and volatile profiles of EVOO (open access, PMC)",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11545581/",
            note: "Studio su come il riscaldamento modifica profilo aromatico (volatili) e componenti fenoliche."
          },
          {
            label: "Ambra R. et al. (2022) — Review su cottura e composti bioattivi dell’olio (open access, PMC)",
            url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8838846/",
            note: "Rassegna: perché a crudo si preservano meglio aroma e componenti più delicati."
          }
        ],
        date: "2026-02-02",
        updateDate: "2026-02-02",
        readingTime: "4 min",
        author: "Chef del Frantoio",
        imageUrl: "/blog/olio-nuovo-cose-e-quanto-dura.jpg",
        category: "Consumo corretto"
    }
];

export const mockBlogPosts: BlogPost[] = [
    ...corePosts,
    ...postsCommerciali,
    ...postsInformativi,
    ...postsRicette,
    ...postsDifetti,
    ...postsChimica,
    ...postsFiducia,
    ...postsGlossario,
    ...postsBatch2,
    ...postsTecnici,
];

export function hasBlogPostTranslation(post: { id: string }, locale: string): boolean {
    if (locale === "it") return true;
    const supportedLocale = (locale === "us") ? "en" : locale;
    const trans = BLOG_POST_TRANSLATIONS[post.id];
    return !!(trans && trans[supportedLocale as Locale]);
}

export async function loadMarkdownPost(post: BlogPost, locale: string): Promise<BlogPost> {
    const migratedIds = [
        "post-1", "post-chem-1", "post-chem-2", "post-buy-2", "post-store-1",
        "post-store-2", "post-use-1", "post-use-2",
        "ric-1", "ric-2", "ric-3", "ric-4", "ric-5", "ric-6",
        "tec-1", "tec-2", "tec-3", "com-2", "com-4", "com-6", "com-8",
        "dif-1", "dif-2", "chim-1", "chim-2", "fid-1", "fid-2", "glos-1",
        "info-1", "info-2", "info-4", "info-5", "info-6", "info-7", "info-8", "info-9", "info-10",
        "chim-3", "chim-4", "chim-5", "chim-6", "chim-7", "dif-3", "dif-4",
        "ric-7", "ric-8", "ric-9", "fid-3", "fid-4", "fid-5", "faq-1"
    ];
    if (!migratedIds.includes(post.id)) {
        return post;
    }

    try {
        const fs = await import("node:fs");
        const path = await import("node:path");
        const matter = (await import("gray-matter")).default;

        const basePost = mockBlogPosts.find(p => p.id === post.id);
        const folderName = basePost ? basePost.slug : post.slug;

        let mdPath = path.join(process.cwd(), "content", "blog", folderName, `${locale}.md`);
        if (!fs.existsSync(mdPath)) {
            const fallbackLocale = (locale === "es" || locale === "fr" || locale === "us") ? "en" : "it";
            mdPath = path.join(process.cwd(), "content", "blog", folderName, `${fallbackLocale}.md`);
        }
        if (fs.existsSync(mdPath)) {
            const fileContent = fs.readFileSync(mdPath, "utf-8");
            const { data, content } = matter(fileContent);

            return {
                ...post,
                content: content.trim(),
                title: data.title ?? post.title,
                excerpt: data.excerpt ?? post.excerpt,
                category: data.category ?? post.category,
                references: data.references ?? post.references,
                date: data.date ?? post.date,
                updateDate: data.updateDate ?? post.updateDate,
                readingTime: data.readingTime ?? post.readingTime,
                author: data.author ?? post.author,
                imageUrl: data.imageUrl ?? post.imageUrl
            };
        }
    } catch (error) {
        console.error(`Failed to load markdown for ${post.id} in ${locale}:`, error);
    }

    return post;
}

export async function getBlogPosts(locale: string = "it"): Promise<BlogPost[]> {
    const localized = mockBlogPosts
        .filter(post => hasBlogPostTranslation(post, locale))
        .map(post => localizeBlogPost(post, locale));

    const loaded = await Promise.all(
        localized.map(post => loadMarkdownPost(post, locale))
    );

    return loaded.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string, locale: string = "it"): Promise<BlogPost | null> {
    const basePost = findBlogPostBySlug(mockBlogPosts, slug);
    if (!basePost) return null;
    const localized = localizeBlogPost(basePost, locale);
    return loadMarkdownPost(localized, locale);
}

export function localizeBlogPost(post: BlogPost, locale: string): BlogPost {
    const translations = BLOG_POST_TRANSLATIONS[post.id];
    if (!translations) return post;
    const supportedLocale = (locale === "us") ? "en" : locale;
    const trans = translations[supportedLocale as Locale];
    if (!trans) return post;

    return {
        ...post,
        slug: trans.slug,
        title: trans.title,
        excerpt: trans.excerpt,
        category: trans.category,
        content: trans.content ?? post.content
    };
}



