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

const corePosts: BlogPost[] = [

    {
        id: "post-1",
        slug: "benefici-olio-evo-salute",
        title: "I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana",
        excerpt: "Non è solo un condimento, è il carburante pulito per chi ama vivere una vita attiva. Scopri come l'Olio EVO supporta le tue giornate, nutre i muscoli e protegge il cuore.",
        content: `## Più di un semplice ingrediente

Spesso releghiamo l'olio d'oliva al ruolo di semplice comparsa: un filo sull'insalata, una passata in padella per non far attaccare la carne. Ma per chi è attento al proprio benessere e ama condurre una vita vibrante e attiva, l'Olio Extra Vergine di Oliva (quello vero, estratto a freddo) dovrebbe essere considerato il vero protagonista della nutrizione quotidiana.

Non è un caso che i popoli del Mediterraneo, storicamente grandi consumatori di questo "oro liquido", registrino un'aspettativa e una qualità di vita tra le più alte al mondo. Ma l'olio non fa magie: fa scienza.

## Il carburante per chi si muove

Quando facciamo sport — che sia una corsa all'alba, una lezione di pilates o una lunga camminata in salita — il nostro corpo subisce uno stress. I muscoli si infiammano leggermente e produciamo radicali liberi. È il normale prezzo da pagare per tenersi in forma.

È qui che entra in gioco l'olio EVO. Essendo la fonte più ricca in natura di **acido oleico** (un grasso monoinsaturo eccezionale per il sistema vascolare) e di antiossidanti potentissimi chiamati *polifenoli*, l'olio agisce come un pompiere naturale. L'oleocantale, in particolare, ha un'azione anti-infiammatoria documentata che aiuta i tessuti a recuperare più in fretta dopo lo sforzo fisico. 

Immaginate l'olio non come un condimento pesante, ma come un "olio motore" purissimo che lubrifica e sfiamma il corpo dall'interno, permettendovi di recuperare prima e meglio.

## Una scelta d'amore per il cuore

Tornare a casa dopo una giornata intensa e prepararsi una cena sana è un rito. Consumare quotidianamente Olio Extravergine estratto rigorosamente a freddo significa introdurre nel flusso sanguigno uno scudo naturale. 

Migliaia di medici nutrizionisti oggi invitano a non lesinare sull'olio sano: i suoi grassi buoni hanno dimostrato in decenni di studi di saper ripulire le arterie, abbassando il colesterolo LDL (quello problematico) e alzando contemporaneamente l'HDL, il famoso colesterolo "spazzino". Insieme, questi fattori contribuiscono a mantenere la pressione sanguigna sotto controllo, proteggendo il cuore battito dopo battito.

> Non abbiate paura di condire la vostra vita. Un cucchiaio di olio EVO a crudo su un pasto bilanciato non vi appesantisce: vi dà l'energia pulita e la protezione di cui il vostro corpo ha un disperato bisogno per funzionare al meglio.

:::cta
Scopri i nostri oli estratti a freddo
Coltivati con amore, franti in giornata per mantenere intatti tutti i polifenoli.
[Vai allo shop](/shop)
:::`,
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
        content: `## Cosa intendiamo per Acidità?

C'è un equivoco diffusissimo: molti credono che l'olio *"che pizzica"* in gola sia acido. Niente di più falso! Il pizzicore è dovuto all'**oleocantale**, un polifenolo potentissimo e benefico. L'acidità di un olio, al contrario, **non è percepibile al palato**.

### Come si misura

L'acidità si esprime in grammi di acido oleico libero per 100 grammi di olio e si misura esclusivamente tramite analisi di laboratorio. Affinché un olio possa classificarsi come "Extra Vergine", per legge la sua acidità non deve superare lo **0,8%**.

L'acidità misura lo stato di degradazione del frutto: un'oliva sana, staccata dall'albero e molita rapidamente produrrà un olio con acidità minima (es. 0.1% o 0.2%). Un'oliva caduta a terra o lavorata in ritardo avrà acidità molto più alta.

> Il piccante in gola non è acidità — l'acidità si misura solo in laboratorio, non si sente in bocca.`,
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
        content: `## Oltre l'etichetta commerciale

Quando ci capita sottomano il referto delle analisi chimiche di un olio d'oliva, troviamo diverse voci che possono apparire criptiche. Oltre all'acidità, spiccano i **Perossidi** e i **Polifenoli**.

### I Perossidi: l'ossidazione in atto

Il numero di perossidi (espresso in mEq O₂/kg) indica l'alterazione ossidativa. La legge fissa il limite a **20 mEq O₂/kg** per l'extravergine. Un olio eccellente si attesta spesso tra **4 e 8**.

### I Polifenoli: la difesa naturale

Sono il vero tesoro dell'olio EVO: contrastano l'ossidazione e mantengono basso il numero di perossidi nel tempo. Un alto valore di polifenoli (> 300–400 mg/kg) indica un olio con forte impronta sensoriale — amaro e piccante — ed estremamente longevo.

- *< 100 mg/kg*: olio povero (industriale, invecchiato)
- *100–300 mg/kg*: standard commerciale
- *300–500 mg/kg*: buona qualità
- *> 500 mg/kg*: eccellenza assoluta

> Richiedete sempre le analisi al vostro produttore — un buon frantoio le fornisce con piacere.`,
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
        content: `## Il trucco del prezzo basso

È uno spettacolo ormai familiare: lunghe corsie di supermercato piene di luccicanti bottiglie dorate con scritto a grandi lettere "Olio Extra Vergine di Oliva" e, accanto, un cartellino del prezzo che segna cifre inverosimili come 4,99€ o 5,99€ al litro. Diveniamo scettici e ci chiediamo se chi produce artigianalmente a più di 12€ ci stia semplicemente lucrando. 

Ma la matematica e l'agricoltura non mentono mai, e fare i conti in tasca alla filiera olearia svela una verità sorprendente e a tratti sconcertante.

## Quanto costa davvero un litro d'olio

Per capire il reale valore dell'olio EVO bisogna partire dagli uliveti. A seconda della cultivar, del grado di maturazione e dell'annata, per estrarre e produrre un singolo litro di olio perfetto occorrono dai **5 ai 10 kg di olive fresche e completamente sane**. 

Provate a sommare solo i costi primari: il lavoro manuale per raccogliere delicatamente senza danneggiare il frutto; le operazioni annuali di potatura e pulizia; il trasporto rapido al frantoio; il processo tecnologico di estrazione meccanica rigorosamente a freddo e, per finire, i costi di confezionamento del vetro scuro e le accise doganali e dell'IVA. Sommando queste spese incomprimibili e fisse, produrre un solo litro di Olio EVO italiano e di vera alta qualità artigianale a meno della soglia dei **10-12€** è semplicemente un'operazione irrealizzabile per qualsiasi azienda.

## Cosa compriamo con lo sconto

Ma allora come fanno le industrie a uscire a prezzi stracciati? La risposta sta nella provenienza e nelle tempistiche. I colossi del mercato comprano partite di extravergine dall'estero – spesso bacini iberici o nordafricani – dove le olive vengono pesantemente meccanizzate o raccolte a terra. Le oliere gigantesche raccolgono le miscele (i cosiddetti "blend" comunitari) mescolandoli, stoccandoli lungamente e imbottigliandoli massivamente.

I parametri chimico-legali per essere commercializzato come "Extravergine" vengono rispettati sul filo del rasoio, ma il profilo organolettico di quell'olio – la vera vitalità del prodotto – è compromesso e annichilito. 

> Acquistare direttamente dal frantoio non è uno snobismo gastronomico, ma l'unica garanzia chirurgica di stare nutrendo il proprio corpo con un alimento vero, fresco e incontaminato. Un cucchiaio di vero EVO vale cento bottiglie piegate al ribasso.

:::cta
Dal nostro frantoio alla tua tavola, senza intermediari
Salta la grande distribuzione e regalati il puro succo d'oliva toscano.
[Ordina l'Olio del Pasqua](/shop)
:::`,
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
        content: `## Il malinteso della "scadenza"

Cominciamo dalla domanda più frequente: l'olio d'oliva ha una data di scadenza? La risposta breve è no. L'olio d'oliva non diventa tossico o pericoloso per la salute da un giorno all'altro, come accade per il latte o la carne fresca.

Quello che trovate in etichetta stampato dal frantoio è il **TMC** — *Termine Minimo di Conservazione* — introdotto tipicamente dalla dicitura *"da consumarsi preferibilmente entro il"*.

Per l'olio EVO, la legge europea e le consuetudini dei produttori fissano questo termine a **18 mesi dal confezionamento**. Oltre quella data, l'olio è ancora commestibile e sicuro. Ha semplicemente iniziato a perdere la sua vivacità aromatica e parte della sua carica antiossidante.

## Quando inizia l'orologio dell'olio?

A differenza del vino, che in cantina spesso migliora maturando in bottiglia, l'olio d'oliva vive il suo momento di gloria assoluta il giorno stesso in cui esce dalle macchine del frantoio. Da quel momento, inizia un lento, naturale e inesorabile processo di decadimento.

Il nostro obiettivo in cucina non è "fermare" questo orologio — che è chimicamente impossibile — ma rallentarlo il più possibile.

## I tre grandi nemici in cucina

I fattori che accelerano l'invecchiamento dell'olio (tecnicamente, l'ossidazione) sono tre. E spesso abitano proprio sui nostri piani di lavoro.

- **La luce (fotossidazione)**: Come abbiamo visto in altri articoli, la luce innesca reazioni distruttive a catena. Una bottiglia di vetro bianco o trasparente, lasciata per un mese vicino a una finestra illuminata, può degradare un EVO eccellente facendolo sapere di plastica o di "stantio". *Soluzione: Buio assoluto. Dispensa chiusa, latte in banda stagnata, bottiglie scure riposte via.*
- **L'ossigeno**: Più la bottiglia si svuota, più si riempie d'aria. L'ossigeno a contatto con la superficie dell'olio lavora silenziosamente per irrancidirlo. *Soluzione: Non tenete bottiglie quasi vuote per mesi. Se consumate poco, chiudete bene e usate formati piccoli.*
- **Il calore**: È l'errore più tragico e diffuso, ovvero la bella oliera lasciata fissa di fianco ai fornelli. Ogni volta che bolle l'acqua della pasta o si accende il forno, l'olio subisce uno shock termico che decima i suoi preziosi polifenoli. *Soluzione: La temperatura ideale è tra i 12°C e i 18°C. Uno sportello basso lontano dai fuochi è perfetto.*

## Quanto dura davvero nella pratica?

Se avete comprato un ottimo olio e l'avete tenuto al riparo da questi tre nemici, ecco quanto aspettarsi:

- **Lattina grande chiusa in cantina fresca**: sfiora tranquillamente i 24 mesi senza cedimenti strutturali.
- **Bottiglia scura chiusa in dispensa**: 12–18 mesi perfetti.
- **Bottiglia (o oliera) usata tutti i giorni in cucina**: consumatela entro **2–3 mesi**.

> Il vero e unico test per capire se un olio è andato a male oltre il TMC è il vostro naso: se sa di fresco, di oliva o di erba, usatelo con gioia. Se l'odore vi ricorda del burro lasciato fuori frigo, la vernice o vecchie noci... usatelo per oliare i cardini delle porte.`,
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
        content: `## La domanda che non ci si fa mai

Quando compriamo l'olio, guardiamo la cultivar, l'acidità, l'anno di raccolta. Raramente guardiamo il contenitore con la stessa attenzione. Eppure è lì che l'olio passerà i prossimi 12-18 mesi — e il materiale che lo circonda determina quanto velocemente si degraderà.

Non è una questione estetica. È chimica.

## Il problema della luce: fotossidazione

Il nemico numero uno dell'olio EVO è la luce. Quando la luce — solare o artificiale — colpisce l'olio, eccita le molecole di clorofilla presenti nell'extravergine (quelle che danno il colore verde). Questa clorofilla eccitata trasferisce energia all'ossigeno disciolto, generando **ossigeno singoletto**: una forma altamente reattiva che attacca i doppi legami degli acidi grassi insaturi e avvia la catena dell'ossidazione lipidica.

Il processo si chiama **fotossidazione** ed è molto più rapido dell'ossidazione termica normale. Una bottiglia di vetro trasparente esposta alla luce solare diretta può compromettere seriamente l'olio nel giro di 2-3 settimane.

## La bottiglia di vetro scuro: brava, ma non perfetta

Il vetro scuro — verde intenso o ambrato con filtro UV — è una soluzione dignitosa. Blocca buona parte dello spettro luminoso responsabile della fotossidazione e offre totale inerzia chimica: il vetro non cede nulla all'olio, neanche a lungo termine.

Il problema è che "scuro" non significa "opaco". Molte bottiglie verde scuro lasciano passare ancora una quota di luce, soprattutto se tenute vicino a finestre o sotto luci fluorescenti forti. E poi c'è un secondo limite: il vetro è pesante, si rompe, e ogni volta che apriamo e richiudiamo la bottiglia entriamo in contatto con l'aria.

Più l'olio scende e più aria rimane sopra — e quella aria continua a ossidare lentamente il contenuto.

## La lattina: perché gli intenditori la preferiscono

La **banda stagnata** — acciaio con rivestimento interno neutro — è il contenitore preferito dai frantoiani seri e dai degustatori professionisti. I motivi sono concreti:

- **Opacità assoluta**: zero luce passa attraverso il metallo. Il problema della fotossidazione è eliminato alla radice.
- **Barriera all'ossigeno quasi totale**: la lattina sigillata limita gli scambi gassosi meglio del vetro.
- **Nessuna migrazione chimica**: i rivestimenti interni della banda stagnata moderna sono certificati per il contatto alimentare prolungato con grassi — nessun rilascio di plastificanti o composti indesiderati.
- **Robustezza**: non si rompe, si trasporta facilmente, è più pratica da stivare in cantina.

L'unico svantaggio reale è che una volta aperta la lattina grande, se consumate poco, l'aria interna aumenta progressivamente. Il workaround è semplice.

## Il metodo pratico: lattina grande + oliera piccola

Il setup che usano i professionisti in cucina è questo: si compra in **lattina da 3 o 5 litri** (il formato che offre il rapporto qualità-prezzo migliore), si tiene la lattina chiusa in dispensa al buio, e si rabbit ogni pochi giorni una piccola **oliera in ceramica opaca** da 150-250ml da tenere sul piano di lavoro.

La lattina rimane quasi sempre chiusa, con poco ossigeno dentro. L'oliera si svuota in fretta — abbastanza da non dare tempo all'ossidazione di fare danni seri.

Questo approccio batte sia la bottiglia trasparente sul piano cucina che la grande bottiglia di vetro scuro aperta da settimane.

## E la bottiglia trasparente?

Va bene per la fotografia. Per conservare l'olio, non serve a niente.

> Se il vostro olio è in una bottiglia trasparente esposta alla luce, state perdendo polifenoli e qualità ogni giorno che passa. Non è allarmismo — è ossidazione.

:::cta
Le nostre lattine da 3 e 5 litri
Olio EVO del Frantoio del Pasqua, campagna olearia indicata, conservazione ottimale garantita.
[Vai allo shop](/shop)
:::`,
        references: [
            {
                label: "Frankel E.N. (2011) — Nutritional and Biological Properties of Extra Virgin Olive Oil. Journal of Agricultural and Food Chemistry",
                url: "https://pubs.acs.org/doi/10.1021/jf2015872",
                note: "Analisi dettagliata dei meccanismi di degradazione dell'olio EVO, inclusa fotossidazione e ossidazione termica."
            },
            {
                label: "Pristouri G. et al. (2010) — Effect of packaging material headspace, and storage conditions on quality indicators of extra virgin olive oil. Food Control",
                url: "https://www.sciencedirect.com/science/article/abs/pii/S0956713509002606",
                note: "Studio sperimentale sul confronto tra diversi materiali di packaging (vetro, PET, lattina) e loro effetto sulla qualità dell'EVO nel tempo."
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
        content: 
        
        `## L'olio Extra Vergine frigge bene?

Sì, frigge bene. E non solo “si può fare”: spesso è una scelta più sensata di quanto crediamo. Il problema è che per anni abbiamo associato l’extravergine a qualcosa di delicato e “da crudo”, mentre la frittura la immaginiamo come un mondo a parte, fatto di oli neutri e anonimi.

In realtà, un buon olio d’oliva è stabile, regge il calore se non lo spingi oltre, e ti dà un fritto più profumato e pulito. La frittura migliore non nasce da temperature estreme: nasce da una temperatura giusta e costante, che cuoce bene senza bruciare.

## Il punto di fumo, senza ansia

Il punto di fumo è utile, ma non va trasformato in una paura. Se l’olio fuma, vuol dire che sei salito troppo. Se invece friggi con calma e non fai “fumate”, stai lavorando nel modo corretto.

E soprattutto: non inseguire l’idea che “più caldo è, meglio è”. Il fritto viene bene quando il calore è controllato, non quando l’olio è al limite.

## Due accortezze che cambiano tutto

La prima è semplice: se devi friggere, usa olio sufficiente. Con poco olio scaldi male, crei sbalzi e peggiori la qualità del risultato.

La seconda è ancora più importante: non far fare all’olio una vita infinita. Se lo riusi troppe volte, perde pulizia, cambia odore e peggiora. Meglio friggere meno spesso, ma farlo bene.

> Un fritto fatto con calma e con un olio stabile è un piacere, non un “peccato”.

:::cta
Vuoi un EVO adatto anche alla cucina di tutti i giorni?
Equilibrato, pulito, stabile: perfetto sia a crudo che in cottura.
[Scopri gli oli in shop](/shop)
:::`,

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
]
,
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
        content:
        
        `## Elogio alla cruda semplicità

L’olio nuovo è un momento speciale: quando esce dal frantoio ha una voce più intensa, più verde, più viva. È il tipo di olio che non vuole “fare compagnia” al piatto: vuole essere notato. E per permettergli di restare così, c’è una regola semplice che vale più di tutte: **non metterlo sul fuoco**.

Il calore non rende l’olio cattivo, ma gli toglie proprio ciò che lo rende unico in questa fase: i profumi più delicati e quella spinta che senti tra amaro e piccante. Se lo rispetti, l’olio nuovo ti ripaga con un’esperienza che dura pochi mesi l’anno.

## Come usarlo senza rovinare la magia

Il trucco è trattarlo come un “finale”: lo aggiungi quando il piatto è pronto, magari ancora caldo, ma fuori dal fuoco. Così l’olio si apre, profuma, e resta protagonista senza perdere troppo in strada.

E se vuoi sentirlo davvero, ogni tanto fai un gesto semplice: un pezzetto di pane caldo, un pizzico di sale e un filo d’olio. Fine. È un piccolo rito, ma ti insegna in un attimo cosa significa freschezza.

## Abbinamenti che lo fanno brillare

L’olio nuovo ama la semplicità: pane tostato, legumi, patate, verdure amare. Sulle minestre “povere” fa una cosa bellissima: aggiunge profondità e rende il piatto completo. E con le verdure dal gusto più deciso (cicoria, cavolo nero, radicchio) crea un contrasto che sembra fatto apposta.

Se invece hai un olio nuovo particolarmente intenso, puoi anche “domarlo” con cibi morbidi: una crema di ceci, una burrata, una vellutata. Non per nasconderlo, ma per farlo risaltare ancora di più.

> L’olio nuovo non va “spiegato”: va assaggiato. E a crudo, racconta tutto.

:::cta
Prenota l'olio novello della prossima campagna
Disponibile da ottobre — quantità limitate.
[Prenota ora](/shop)
:::`,
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

export async function getBlogPosts(): Promise<BlogPost[]> {
    return mockBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return mockBlogPosts.find(post => post.slug === slug) || null;
}



