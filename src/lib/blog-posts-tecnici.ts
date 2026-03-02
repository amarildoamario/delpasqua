import type { BlogPost } from "./blog-data";

export const postsTecnici: BlogPost[] = [
    // ─────────────────────────────────────────────────────────────
    // Articolo 1: NMR
    // ─────────────────────────────────────────────────────────────
    {
        id: "tec-1",
        slug: "nmr-olio-oliva-analisi",
        title: "NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione",
        excerpt: "La risonanza magnetica nucleare è oggi uno degli strumenti più potenti per l'autenticazione dell'olio EVO. ¹H-NMR e ¹³C-NMR rivelano composizione in acidi grassi, presenza di adulteranti e origine geografica.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "12 min",
        author: "Dipartimento Qualità",
        imageUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=2070&auto=format&fit=crop",
        category: "Chimica dell'olio di oliva",
        content: `## Introduzione: perché la NMR è rivoluzionaria nell'analisi degli oli

La **Risonanza Magnetica Nucleare** (NMR, *Nuclear Magnetic Resonance*) è una tecnica spettroscopica non distruttiva basata sull'assorbimento di radiazione a radiofrequenza da parte di nuclei atomici con spin non nullo (principalmente ¹H e ¹³C) posti in un campo magnetico intenso.

Nel contesto dell'olio d'oliva, la NMR rappresenta un cambio di paradigma rispetto alle tecniche tradizionali:

- **Non distruttiva**: il campione viene recuperato integro dopo l'analisi
- **Rapida**: analisi complete in 5–15 minuti
- **Altamente informativa**: un singolo spettro ¹H rivela simultaneamente composizione in acidi grassi, qualità, adulterazioni e, con metodi chemiometrici, origine geografica

La tecnica è regolata per l'olio d'oliva dal metodo **COI/T.20/Doc. No 30** (Panel Test NMR approach) e da procedure ISO in sviluppo.

## ¹H-NMR dell'olio d'oliva: assegnazione dei segnali principali

Il campione di olio viene tipicamente disciolto in **CDCl₃** (*cloroformio deuterato*) o **CCl₄** in rapporto 1:3, con TMS (*tetrametilsilano*) o toluene-d₈ come riferimento interno (δ = 0.00 ppm per TMS).

### Regioni spettrali e assegnazione

**δ 5.20–5.45 ppm** — *Protone vinilico (=CH–) nelle catene acil insature*
L'integrale di questa regione (chiamata segnale **C** nella notazione standard) è proporzionale al numero di doppi legami nella catena degli acidi grassi insaturi. Discrimina direttamente il contenuto di acido oleico (1 doppio legame), linoleico (2 doppi legami) e linolenico (3 doppi legami).

**δ 5.20–5.30 ppm** — *Protone del glicerolo in posizione sn-2 (CH)*
Segnale caratteristico della posizione centrale del trigliceride. Il **rapporto di integrazione** tra questo segnale e quello del CH vinilico viene utilizzato per calcolare la percentuale di insaturazione.

**δ 4.10–4.35 ppm** — *Metileni del glicerolo (–OCH₂–, posizioni sn-1 e sn-3)*
Due sistemi AB caratteristici del glicerolo esterificato. La loro molteplicità e separazione chimica dipendono dalla simmetria dell'esterificazione.

**δ 2.75 ppm** — *Protoni bis-allilici (=CH–CH₂–CH=)*
Segnale **cruciale** per la quantificazione dell'acido linoleico (C18:2, due doppi legami non coniugati). l'integrale di questo segnale è direttamente proporzionale al contenuto di linoleico nel campione.

**δ 2.30 ppm** — *CH₂ in α rispetto al gruppo carbonilico (–OC(O)–CH₂–)*
Segnale quantitativo per la stima del numero di catene acil presente. Viene usato come segnale di riferimento interno relativo.

**δ 2.00–2.08 ppm** — *CH₂ allilici (–CH₂–CH=)*
Segnale sovrapposto di più componenti: linoleico, linolenico e oleico contribuiscono qui. La deconvoluzione richiede tecniche di fitting spettrale (Lorentziana o gaussiana).

**δ 1.95–2.05 ppm** — *Particolarmente: CH₂ allilici dell'acido α-linolenico (C18:3)*
Picco caratteristico per la quantificazione del linolenico, spesso differenziato dalla baseline con integrazione selettiva.

**δ 1.55–1.65 ppm** — *CH₂ β rispetto al carbonile*
Segnale largo che include più componenti delle catene acil.

**δ 1.25–1.35 ppm** — *Metileni della catena idrocarburica (–(CH₂)ₙ–)*
Segnale largo e dominante, proporzionale alla lunghezza media delle catene acil.

**δ 0.85–0.90 ppm** — *Metili terminali (–CH₃)*
Tre segnali tipicamente sovrapposti dal t (triplet): acidi grassi con catena normale vs. acidi grassi con isomerizzazione.

### Formule di calcolo dalla ¹H-NMR

Il profilo degli acidi grassi si ricava da:

1. **Acido linoleico (C18:2)** → integrale segnale bis-allilico (δ 2.75) = 2H per ogni molecola di linoleico
2. **Acido oleico (C18:1)** → integrale vinilico totale - 2 × I(linoleico) - 3 × I(linolenico)
3. **Acido α-linolenico (C18:3)** → segnale a δ 2.05 (CH₂ allilici ω-3)

Il metodo è standardizzato con olio puro di singola catena acil (oli di riferimento IRMM, BCR o standard ISO).

## ¹³C-NMR: informazioni regioisomeriche

La spettroscopia ¹³C ha una risoluzione chimica molto maggiore (range δ = 0–220 ppm vs. 0–15 ppm per ¹H), ma tempi di acquisizione più lunghi e NOE (*Nuclear Overhauser Effect*) che complicano la quantificazione.

### Regioni chiave per l'olio d'oliva

**δ 167–174 ppm** — *Carboni carbossilici (C=O)*
Tre picchi distinti per le tre posizioni del trigliceride (sn-1/sn-3 vs. sn-2). Il loro **rapporto di intensità** rivela la distribuzione regiosiomerica degli acidi grassi nelle posizioni del glicerolo — informazione impossibile da ottenere con ¹H-NMR.

Questa regione è cruciale per la **distinzione tra oli di origine diversa**: l'olio d'oliva ha distribuzione degli acidi grassi preferenziale con oleico in sn-2, mentre alcuni oli di semi hanno distribuzione completamente diversa.

**δ 127–132 ppm** — *Carboni olefinici (C=C)*
Picchi separati per i vari acidi insaturi con diversa posizione del doppio legame. Il ¹³C distingue il C9=C10 dell'oleico dal C9=C10 e C12=C13 del linoleico.

**δ 24–34 ppm** — *Metileni della catena*
Cluster di picchi complesso. Con *DEPT* (Distortionless Enhancement by Polarization Transfer) si differenziano CH₂ da CH₃, consentendo l'identificazione di ramificazioni (acidi grassi ramificati = marker di adulterazione o fermentazione batterica).

## Applicazioni per l'autenticazione: adulturazione e origine

### Rilevazione di oli di semi

L'adulterazione con oli di semi (olio di girasole, di mais, di soia) è storicamente la frode più diffusa nell'EVO. La ¹H-NMR la rileva con eccellente sensibilità:

- **Olio di girasole** (alto oleico o normale): il segnale bis-allilico (δ 2.75) è molto più intenso rispetto all'EVO puro → elevato contenuto di linoleico
- **Olio di mais**: profilo linoleico elevato + segnale caratteristico dello sterolo **β-sitosterolo** nella regione 0.6–1.1 ppm
- **Olio di soia**: presenza di acido α-linolenico (rilevabile a δ 2.05)

La soglia di rilevazione dell'adulterazione per miscelazione con olio di girasole classico è di circa **3–5%** in peso con approccio quantitativo diretto, e inferiore all'**1%** con metodi chemiometrici su database NMR.

### Discriminazione geografica e varietale (1D e 2D NMR + chemiometria)

L'applicazione più sofisticata della NMR nell'analisi degli oli è la **discriminazione di origine geografi** mediante analisi multivariata (PCA, LDA, *Random Forest*) su profilo NMR completo.

Studi pubblicati su *Food Chemistry* e *Journal of Agricultural and Food Chemistry* hanno dimostrato che:

- La ¹H-NMR a **600 MHz** (o superiore) rivela differenze sottili nel profilo dei trigliceridi correlate con la cultivar e il territorio
- Combinando ¹H-NMR con ¹³C-NMR e HSQC (*Heteronuclear Single Quantum Correlation*) bidimensionale, si ottiene una "fingerprint" unica per ogni origine
- I database di riferimento IRMM (*Institute for Reference Materials and Measurements*, Geel, BE) sono usati come standard per la certificazione DOP

### SNIF-NMR: isotopi stabili e frode sofisticata

La variante **SNIF-NMR** (*Site-Specific Natural Isotope Fractionation NMR*) sfrutta il deuterio naturalmente presente (²H, D) nelle molecole organiche in posizioni specifiche. La distribuzione isotopica del deuterio nelle catene acil è funzione:

- Della specie botanica
- Della zona climatica (effetto frazionamento durante la fotosintesi)
- Del metabolismo della pianta

Permette di distinguere olio da **climi temperati** (Europa meridionale) da oli di **climi tropicali** o da prodotti sintetici, con una sensibilità che va ben oltre l'analisi degli acidi grassi.

Il metodo SNIF-NMR è adottato dall'UE per la verifica di vini e succhi di frutta (Reg. CEE 2676/90 per il vino) ed è in via di adozione formale per gli oli.

## Limiti della tecnica NMR

- **Costo strumentale elevato**: un magnete superconduttore a 400–600 MHz costa 200.000–800.000€. Applicazione limitata a laboratori specializzati.
- **Database di riferimento**: l'autenticazione geografica richiede database ampi e aggiornati — soggetti a variabilità d'annata
- **Segnali sovrapposti**: alcuni segnali critici richiedono deconvoluzione o tecniche 2D (COSY, HSQC, HMBC)
- **Standard interni**: la scelta dello standard interno influenza la quantificazione; TMS non è ideale per campioni in CDCl₃ con tracce di acqua

:::cta
Trasparenza analitica: le nostre analisi di laboratorio
Richiedete il certificato di analisi del vostro lotto — inclusa spettroscopia se disponibile.
[Contattaci](/shop)
:::`,
    },
    // ─────────────────────────────────────────────────────────────
    // Articolo 2: GC-MS / LC-MS / HPLC
    // ─────────────────────────────────────────────────────────────
    {
        id: "tec-2",
        slug: "spettrometria-massa-olio-oliva-gcms-lcms",
        title: "Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli",
        excerpt: "GC-MS per i composti volatili e LC-MS/MS per il profilo polifenolico: due tecniche che insieme forniscono un ritratto molecolare completo dell'olio EVO, dalla C6 verde all'oleocantale.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "10 min",
        author: "Dipartimento Qualità",
        imageUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=2070&auto=format&fit=crop",
        category: "Chimica dell'olio di oliva",
        content: `## Principio della spettrometria di massa applicata agli oli

La **spettrometria di massa** (MS) è una tecnica analitica che separa e rivela molecole in funzione del loro rapporto **massa/carica (m/z)**. Abbinata a tecniche di separazione cromatografica — **GC** (*Gas Chromatography*) per composti volatili e semivolatili, **HPLC** (*High Performance Liquid Chromatography*) per composti non volatili — fornisce l'analisi molecolare più completa disponibile per l'olio EVO.

Il principio operativo in sintesi:
1. Il campione viene introdotto nello strumento (spesso previa derivatizzazione chimica)
2. Le molecole vengono **ionizzate** (EI, ESI, APCI, APPI — vedi sotto)
3. Gli ioni vengono separati in base al rapporto m/z tramite analizzatori di massa (quadrupolo, trappola ionica, TOF, Orbitrap)
4. Il rivelatore registra l'intensità di ogni m/z → spettro di massa

## GC-MS per l'analisi dei composti volatili

### Cosa analizza

L'olio EVO contiene oltre **200 composti volatili** identificati, ma solo una trentina contribuisce significativamente al profilo aromatico percettivo. GC-MS è la tecnica di riferimento per la loro identificazione e quantificazione.

### Schema analitico tipico

**Estrazione dei volatili:**
- *SPME* (*Solid Phase Microextraction*): fibra di PDMS/DVB o CAR/PDMS esposta all'headspace del campione (30–60 min, 40–60°C). Tecnica senza solvente, ideale per trace amounts. Normativa: ISO 16240.
- *LLME* (*Liquid-Liquid Microextraction*): estrazione con piccoli volumi di solvente organico (n-pentano, dietiletere)
- *SAFE* (*Solvent Assisted Flavour Evaporation*): distillazione sotto vuoto a temperatura controllata per campioni con alto contenuto lipidico

**Colonna cromatografica GC:**
- Colonna capillare DB-Wax (polietilenglicole) 60m × 0.25mm, 0.25μm — ottimale per aldeidi e alcoli C5-C6
- Gradiente di temperatura: 40°C (3 min) → 240°C a 3°C/min — durata totale circa 70 min

**Rivelatore:** quadrupolo oppure IT (*Ion Trap*), ionizzazione EI a 70 eV

### I composti chiave e i loro ioni di frammentazione (EI, 70 eV)

***(E)-2-Esenale** (C6H10O, M⁺ = 98 m/z)*
- Il principale "verde" dell'olio fresco. Ione di base: 41 (C3H5⁺)
- Ioni caratteristici: 41, 69, 83, 98
- Soglia di percezione aromatica: ~0.017 mg/kg in olio

***(E)-2-Esenolo** (C6H12O, M⁺ = 100 m/z)*
- Note erbacee-fruttate, co-elue con altri C6
- Ioni: 41, 57, 69, 82

***Esanale** (C6H12O, M⁺ = 100 m/z)*
- Nota "erba fresca". Ione di base: 44, 41, 56
- Marker del profilo "verde" — prodotto della via LOX su acido linoleico

***(Z)-3-Esenolo** (leaf alcohol, C6H12O)*
- Odore caratteristico di foglia verde tagliata
- Ione di base: 41, 67, 82

***(E,E)-2,4-Decadienale** (C10H16O, M⁺ = 152)*
- Marker di ossidazione termica dell'acido linoleico (frittura)
- Assente in olio di qualità non riscaldato, presente come marker di adulterazione termica

***(Z)-3-Esenil acetato***
- Nota frutto-fresca, tipica di alcune cultivar (Nocellara del Belice)

**Nonanale, Decanale (aldeidi C9, C10)**
- Prodotti dell'ossidazione dell'acido oleico — marker di irrancidimento lieve
- Valori elevati indicano inizio di ossidazione

**Esteri di etile (acetato di etile, esanoato di etile)**
- Marker del difetto **avvinato-fermentativo**

***2-Metil-1-propanolo, 3-Metil-1-butanolo***
- Alcoli di Fusel — prodotti dalla fermentazione batterica di aminoacidi
- Marker di difetto **riscaldo**

### Analisi quantitativa: standard deuterati

La quantificazione assoluta dei volatili utilizza **standard interni deuterati** (*d₄-esanale*, *d₅-2-esenale*) per correggere la variabilità dell'efficienza di estrazione SPME e della risposta dello strumento. Il metodo è pubblicato su *Food Chemistry* (Di Bella et al., 2021) e *European Food Research and Technology*.

### AMDIS e identificazione spettrale

L'identificazione dei picchi GC-MS utilizza:
- **NIST/EPA/NIH Mass Spectral Database** (>300.000 spettri) per matching spettrale
- **Adams Library** (Retention Index su DB-Wax e DB-5) per conferma tramite IR (*Kovàts Retention Index*)
- Soglia di match score ≥ 90% per identificazione certa; 80–90% per identificazione probabile

## LC-MS/MS per il profilo polifenolico

### Perché la HPLC-DAD da sola non basta

La tecnica tradizionale HPLC con rivelatore a diodi (*DAD*, Diode Array Detector) a 280 nm separa i polifenoli cromatograficamente ma li identifica con certezza solo se si dispone degli standard puri di riferimento. Molti secoiridoidi dell'olio sono commercialmente non disponibili in forma pura.

La **LC-MS/MS** (tipicamente ESI-Qtrap, ESI-Orbitrap o UHPLC-Q-TOF) supera questo limite:
- **Massa precisa** del precursore (*full scan* o *targeted MS1*) identifica la formula molecolare
- **Frammentazione tandem** (MS/MS → prodotto ioni) fornisce informazioni strutturali dettagliate

### Schema analitico standard

**Preparazione del campione:**
- SPE (*Solid Phase Extraction*) su cartucce **C18** o **HLB** (Oasis) con eluizione in metanolo o ACN/acqua 70:30
- Oppure LLE con metanolo/acqua 80:20, centrifugazione 3000×g, 10 min

**Colonna UHPLC:**
- Colonna C18 a fase inversa, 100 × 2.1 mm, 1.7 μm (Acquity BEH C18 o equivalente)
- Gradiente: H₂O + 0.1% acido formico (A) / ACN + 0.1% acido formico (B) — da 5% B a 90% B in 12–15 min

**Sorgente di ionizzazione:**
- **ESI negativo** (ESI⁻): preferito per polifenoli — le strutture fenolate deprotonano facilmente (pKa 8–10), maggiore sensibilità per idrossitirosolo, oleuropeina e derivati
- ESI⁺ usato per clorofille e carotenoidi

### Principali polifenoli identificati e loro ioni diagnostici

**Idrossitirosolo** (HT, MW 154.06)
- ione [M-H]⁻ = 153.0556 m/z
- Frammentazione caratteristica: 153 → 123 (perdita di CH₂O, 30 Da), 153 → 107 (perdita CO₂ + H₂O, 46 Da)

**Tirosolo** (MW 138.07)
- ione [M-H]⁻ = 137.0607 m/z
- Frammentazione: 137 → 119 (-H₂O), 137 → 93 (-CO₂-H₂O)

**Oleuropeina** (MW 540.16)
- ione [M-H]⁻ = 539.1766 m/z
- Frammentazione MS/MS: 539 → 377 (perdita parte glucosidica 162 Da = glucosio), 539 → 307, 539 → 275
- Il pattern di frammentazione 539→377→307 è diagnostico e univoco

**Aglicone dell'oleuropeina** (MW 378.13)
- ione [M-H]⁻ = 377.1242 m/z
- Prodotto dell'idrolisi enzimatica durante la gramolazione

**Oleocantale** (MW 304.13, dialdéido aperto)
- Analisi complicata dall'instabilità: tautomeria aldeidica/enolica in soluzione
- ione [M-H]⁻ sperimentalmente a 303.1238 m/z
- Quantificazione preferibilmente con standard sintetico (Cayman Chemical #10009207) o HPLC-NMR

**Ligstrosidi agliconi** (MW 362.14)
- Precursori dell'oleocantale
- ione [M-H]⁻ = 361.1293 m/z

**Luteolina** (MW 286.05)
- ione [M-H]⁻ = 285.0405 m/z
- Frammentazione diagnostica: 285 → 241, 285 → 151, 285 → 133

### Quantificazione assoluta

La quantificazione assoluta dei singoli polifenoli richiede:
- Standard di calibrazione puri (HPLC grade, ≥ 98%): HT, tirosolo, oleuropeina disponibili (Sigma-Aldrich, Extrasynthese, Cayman)
- Standard interni: acido siringico deuterato o apigenina-d₄ per correzione matrice
- Linearità: tipicamente verificata su 5–7 punti di calibrazione (r² > 0.999)
- LOD e LOQ calcolati con metodo S/N = 3 e 10 rispettivamente

La quantificazione del solo **HT + derivati** (per verifica Claim EFSA 432/2012) è richiesta in mg per 20g di olio, con soglia minima di 5 mg.

## Analisi isotopica accoppiata MS: IRMS e CSIA

La **IRMS** (*Isotope Ratio Mass Spectrometry*, basata su analizzatore di settore magnetico) abbinata a **GC-IRMS** (*GC/Combustion/IRMS*) misura i rapporti isotopici **¹³C/¹²C** (δ¹³C) e **D/H** (δ²H) di singoli composti (CSIA, *Compound-Specific Isotope Analysis*).

Applicazioni per l'olio EVO:
- **Discriminazione geografica**: il δ¹³C degli acidi grassi riflette il ciclo di fotosintesi (C3 per olivo — tutti gli ulivi sono C3) e le condizioni climatiche locali (temperatura, precipitazioni, umidità dell'aria)
- **Rilevazione adulterazione con oli tropicali** (palma, cocco): le piante C4 hanno valori di δ¹³C significativamente diversi (-14 a -12‰ vs. -28 a -25‰ per C3)
- **Certificazione DOP**: database CSIA per le principali DOP italiane (Garda, Toscana, Riviera Ligure, Terra di Bari) in via di costruzione, coordinato dal CNR-ISC



La tecnica GC-IRMS-CSIA è attualmente la più avanzata disponibile per la certificazione dell'autenticità dell'olio EVO, ed è utilizzata in accuse di frode alimentare davanti ai tribunali europei.`,
    },
    // ─────────────────────────────────────────────────────────────
    // Articolo 3: Metodi ISO
    // ─────────────────────────────────────────────────────────────
    {
        id: "tec-3",
        slug: "metodi-iso-analisi-olio-oliva",
        title: "Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa",
        excerpt: "ISO 660, 662, 3960, 3961, 5509, 11701, 27107: i metodi ufficiali per l'analisi dell'olio d'oliva spiegati in dettaglio, con principio chimico, procedura e limiti di legge applicabili.",
        date: "2026-03-01",
        updateDate: "2026-03-01",
        readingTime: "12 min",
        author: "Dipartimento Qualità",
        imageUrl: "https://images.unsplash.com/photo-1628595351029-c2bf17511435?q=80&w=2070&auto=format&fit=crop",
        category: "Chimica dell'olio di oliva",
        content: `## Contesto normativo: ISO e regolamenti UE

Il quadro normativo per l'analisi dell'olio d'oliva è strutturato su due livelli interconnessi:

1. **Standard ISO** (*International Organization for Standardization*, Ginevra): definiscono i metodi analitici ufficiali a livello internazionale. Adottati come standard nazionali dai paesi membri (EN ISO in Europa, UNI EN ISO in Italia).

2. **Regolamento UE 2568/91** (e s.m.i.) con i suoi allegati: stabilisce i metodi di analisi ufficiali accettati per la classificazione doganale e commerciale dell'olio d'oliva nell'Unione Europea. Rimanda esplicitamente a specifici metodi ISO e COI.

Il **COI** (*Consiglio Oleicolo Internazionale*, Madrid) pubblica metodi analitici propri (serie COI/T.20) che spesso precedono o affiancano la standardizzazione ISO, specialmente per l'analisi sensoriale.

I laboratori accreditati (**ISO/IEC 17025:2017**) devono implementare i metodi ISO validati, con documentazione di:
- Dichiarazione di applicabilità del metodo
- Parametri di validazione (LOD, LOQ, ripetibilità, riproducibilità, incertezza)
- Riferimento alla versione ISO corrente (molte sono in revisione continua)

## ISO 660:2009 — Acidità libera (metodo titolimetrico)

### Principio chimico

L'**acidità libera** misura il contenuto di **acidi grassi liberi** (FFA, *Free Fatty Acids*) nell'olio, espressa convenzionalmente in g di **acido oleico** per 100 g (% di acidità) oppure in mg KOH/g (indice di acidità).

Reazione di neutralizzazione:
> RCOOH + KOH → RCOOK + H₂O

Gli FFA si formano dall'**idrolisi enzimatica** (lipasi) dei trigliceridi durante la maturazione del frutto, la conservazione post-raccolta e la lavorazione. Valori elevati indicano olive danneggiate, fermentate o molitura ritardata.

### Procedura

1. Pesare **2.000 g** di olio (bilancia analitica, d = 0.0001 g)
2. Sciogliere in **50 ml** di miscela solvente: etanolo 95° v/v / dietiletere 1:1 (precedentemente neutralizzata con KOH 0.1 mol/L)
3. Aggiungere 5 gocce di soluzione alcolica di **fenolftaleina** 10 g/L (indicatore vira da incolore a rosa a pH 8.2)
4. Titolare con **soluzione KOH 0.5 mol/L** fino a viraggio rosa persistente (30 s)
5. Calcolo: **A% = (V × M × 28.2) / m** dove V = volume KOH (mL), M = molarità, m = massa campione

### Limiti di legge (Reg. UE 2568/91, Allegato I)
- *Extra Vergine*: ≤ **0.8%** (≤ 8.0 mg KOH/g)
- *Vergine*: ≤ **2.0%**
- *Lampante*: > **2.0%** (non commercializzabile direttamente)
- *Olio di sansa vergine*: ≤ **3.0%**

### Varianti e interferenze

Il metodo ISO 660 prevede anche la **determinazione potenziometrica** (titolazione con pH-metro, più accurata per campioni colorati che rendono difficile la lettura del viraggio visivo dell'indicatore). La variante potenziometrica è obbligatoria per il metodo ufficiale UE.

---

## ISO 3960:2017 — Numero di perossidi (metodo iodometrico)

### Principio chimico

Il **numero di perossidi** (NP) quantifica i perossidi lipidici (idroperossidi ROOH) — prodotti primari dell'ossidazione. L'iodo viene liberato per reazione dei perossidi con ioduro di potassio in condizioni acide:

> ROOH + 2 KI + 2 AcOH → ROH + I₂ + 2 KOAc + H₂O

Lo iodio libero viene poi titolato con **Na₂S₂O₃** (*tiosolfato di sodio*):

> I₂ + 2 Na₂S₂O₃ → 2 NaI + Na₂S₄O₆

L'NP è espresso in **mEq O₂ / kg** di olio.

### Procedura

1. **5.000 g** di olio in beuta iodometrica a tappo smerigliato
2. Sciogliere in **30 ml** di soluzione cloroformio:acido acetico glaciale 2:3 (v/v; in alternativa: isoottano/acido acetico 3:2 secondo ISO 3960:2007)
3. **Aggiungere 0.5 ml** di soluzione KI satura (fresca, preparata in acqua bidistillata priva di ossigeno)
4. **Agitare 1 minuto** in oscurità a temperatura ambiente
5. Aggiungere **75 ml** di acqua bidistillata e 1 ml di soluzione amido 5 g/L (indicatore)
6. Titolare immediatamente con **Na₂S₂O₃ 0.01 mol/L** fino a scomparsa del colore blu
7. Calcolo: **NP = (V − V₀) × 10 × M / m** dove V₀ = blank senza campione

**Attenzione critica**: la presenza di ossigeno disciolto nella soluzione cloroformio/AcOH produce valori falsamente elevati (*falso positivo*). La soluzione solvente deve essere *purgata con N₂* prima dell'uso.

### Limiti di legge e valori indicativi

- *Extra Vergine*: ≤ **20 mEq O₂/kg**
- *Olio di oliva vergine*: ≤ 20
- *Olio di sansa vergine*: ≤ 15
- **Olio fresco di alta qualità**: tipicamente 4–10 mEq O₂/kg

---

## ISO 3961:2013 — Indice di iodio

### Principio e significato

L'**indice di iodio** (II) misura il grado di insaturazione di un grasso: quanti grammi di I₂ vengono assorbiti da 100 g di olio. Un olio ricco di acidi grassi insaturi (molti doppi legami) assorbe più iodio.

Per l'olio d'oliva: II tipico = **75–94 g I₂/100 g** (Wijs).

Calcolato dalla composizione in acidi grassi, l'II *teorico* è:
> II = 0.899 × (%C18:1) + 1.810 × (%C18:2) + 2.735 × (%C18:3) + ...

Il metodo di Wijs (reattivo: ICl in acido acetico glaciale) è quello ufficiale ISO 3961.

**Utilizzo**: non più primario per la classificazione doganale (sostituito dall'analisi GC degli acidi grassi), ma ancora usato per verifiche rapide di adulterazione grossolana con oli molto diversi (palma, cocco con II bassissimo vs. oli polinsaturi con II > 100).

---

## ISO 5509:2000 (EN ISO 5508:1995) — Profilo degli acidi grassi tramite GC con metilazione

### Principio

Il metodo di riferimento per l'analisi quantitativa degli **acidi grassi** nell'olio è la **gascromatografia su colonna capillare** previa conversione degli acidi in **esteri metilici** (FAME, *Fatty Acid Methyl Esters*).

La derivatizzazione a FAME è necessaria perché gli acidi grassi liberi e i trigliceridi non sono abbastanza volatili per essere analizzati direttamente in GC a temperature ragionevoli.

### Derivatizzazione (transmetilazione)

Il metodo ISO 5509 prevede la transesterificazione alcalina con **metanolo/KOH 2M** (metodo "rapido" per oli saponificabili):

1. **0.1 g** di olio + 1 ml di soluzione KOH 2M in metanolo
2. Agitazione in bagno d'acqua a **60°C per 5 min** (o a temperatura ambiente per 30 min con agitazione continua)
3. Aggiungere **5 ml isoottano** + **1 ml di H₂SO₄** per abbassare il pH e separare la fase organica
4. Centrifugare brevemente; la fase isoottanica superiore contiene i FAME
5. Prelevare 1 μL per iniezione in GC

**Alternativa con BF₃/metanolo** (ISO 5509 variante acida): più lenta, usata per acidi grassi a corta catena o campioni difficili.

### Condizioni GC per FAME

- Colonna: **capillare CP-Sil 88** (50 m × 0.25 mm × 0.25 μm) — colonna polare specifica per FAME. Alternativa: DB-225
- Carrier: He a 1.2 mL/min
- Injection: *split* 1:50, 250°C
- Programma temperatura: 80°C (2 min) → 220°C a 5°C/min → 220°C (30 min)
- Rivelatore: FID (*Flame Ionization Detector*) a 250°C

### Fattori di risposta e quantificazione

La risposta FID è proporzionale alla massa di carbonio bruciato. Per i FAME si usano **fattori di risposta teorici** (calcolati dalla formula chimica) oppure **standard multi-component** (Supelco FAME Mix 37 o Sigma PUFA No.3). La quantificazione è tipicamente a *normalizzazione interna* (% in area su totale FAME).

### Limiti di legge (acidi grassi — Reg. UE 2568/91 Allegato I, aggiornato)

Per l'olio extra vergine:

| Acido grasso | Simbolo | Limiti |
| Acido miristico | C14:0 | ≤ 0.05% |
| Acido palmitico | C16:0 | 7.5–20% |
| Acido palmitoleico | C16:1 | 0.3–3.5% |
| Acido eptadecanoico | C17:0 | ≤ 0.3% |
| Acido eptadecenoico | C17:1 | ≤ 0.3% |
| Acido stearico | C18:0 | 0.5–5.0% |
| Acido oleico | C18:1 | 55.0–83.0% |
| Acido linoleico | C18:2 | 3.5–21.0% |
| Acido α-linolenico | C18:3 | ≤ 1.0% |
| Acido arachidico | C20:0 | ≤ 0.6% |
| Acido gadoleico | C20:1 | ≤ 0.4% |
| Acido beenico | C22:0 | ≤ 0.2% |
| Acido lignocerico | C24:0 | ≤ 0.2% |

Valori fuori da questi range → reclassificazione o frode.

---

## ISO 27107:2008 — Determinazione degli steroli con GC-FID

### Perché gli steroli sono fondamentali

La composizione sterolica è uno dei **marker di autenticità** più importanti per l'olio d'oliva. Ogni specie vegetale produce un profilo sterolifico caratteristico che non viene alterato significativamente dai processi di estrazione. Pertanto, la presenza di steroli anomali (not tipici dell'olivo) rivela adulterazioni.

### Principio

Gli **steroli** nell'olio sono presenti nella frazione insaponificabile (0.05–0.5% dell'olio) come steroli liberi e steroli esterificati. ISO 27107 prevede:

1. **Saponificazione** dell'olio con KOH/etanolo a riflusso (90 min)
2. Estrazione della **frazione insaponificabile** con etere etilico
3. Separazione degli steroli su colonna **SPE Si** (silice), eluizione con cloroformio/acetone
4. **Sililazione** degli steroli OH in trimetilsililil etere (TMS): BSTFA/TMCS (99:1) a 60°C per 30 min → aumenta la volatilità per GC
5. Analisi GC su colonna **DB-1HT** o **CP-Sil 5** (capillare non polare) a 260-290°C
6. Rivelatore FID; quantificazione con standard interno: **α-colestanolo** (non presente negli oli vegetali)

### Profilo sterolifico tipico dell'olio di oliva EVO

| Sterolo | % tipica nell'EVO | Note |
| β-Sitosterolo | 75–90% | Fitosterolo dominante |
| Δ-5-Avenasterolo | 5–15% | Specifico dell'oliva |
| Campesterolo | 1.5–4% | < 4% obbligatorio per legge |
| Stigmasterolo | 0.5–2% | Deve essere < campesterolo |
| Colesterolo | < 0.5% | Tipico degli animali — tracce nell'olio vegetale |
| Δ-7-Stigmastenolo | < 0.5% | Critico: > 0.5% indica oli di semi |
| Eritrodiol + Uvaolo | < 4.5% | Marker per oli di sansa raffinato quando > 4.5% |

**Marker di frode:**
- *Campesterolo > 4%*: probabile presenza di olio di colza (canola ha ~30% campesterolo)
- *Stigmasterolo > campesterolo*: probabile presenza di oli di soia, mais
- *Δ-7-Stigmastenolo > 0.5%*: possibile adulterazione con oli di girasole convenzionale
- *β-Sitosterolo < 75%*: miscela con altri oli vegetali

---

## ISO 29822:2009 — Determinazione delle cere con GC (marker sansa)

Le **cere** sono esteri di acidi grassi a lunga catena con alcoli alifatici a lunga catena (> C20). Nell'olio extra vergine da spremitura meccanica delle olive, le cere sono presenti in bassissima quantità (< 150 mg/kg). L'olio di sansa raffinato (estratto con solventi dalla polpa residua) ha concentrazioni di cere molto più alte (> 300 mg/kg) perché il solvente estrae anche le cere della cuticola del frutto.

Il metodo ISO 29822 separa le cere su colonna SPE e le analizza su GC capillare non polare (50 m DB-1 o equivalente) a temperature programmate fino a 320°C. La concentrazione di cere totali C40–C46 è il parametro discriminante:

- *EVO da spremitura*: cere ≤ 150 mg/kg (limite di legge)
- *Olio di sansa*: cere > 300 mg/kg
- Zona grigia 150–300: possibili miscele, richiede analisi ergosterolo complementare

---

## ISO/TS 18363:2015 — Acidi grassi 3-MCPD esteri (marker di raffinazione termica)

I **3-MCPD esteri** (3-monocloropropandiolo diesterificato) sono contaminanti di processo che si formano durante la **raffinazione chimica e termica** a temperature > 200°C in presenza di cloruri. Sono stati classificati come possibilmente cancerogeni (IARC Gruppo 2A).

La loro presenza in concentrazioni significative (> 0.5–1.0 mg/kg equivalenti di 3-MCPD libero) nell'olio EVO indicherebbe un trattamento termico non conforme o adulterazione con olio raffinato.

Il metodo ISO/TS 18363-4 (variante GC-MS in modalità MRM su triplo quadrupolo) è il più sensibile per la loro quantificazione assoluta nella matrice grassa.

> La batteria completa dei metodi ISO applicati all'olio EVO — acidità, perossidi, K-values, acidi grassi, steroli, cere, 3-MCPD — costituisce il "profilo analitico completo" richiesto per la certificazione DOP e per la difesa in contenziosi commerciali.`,
    },
];
