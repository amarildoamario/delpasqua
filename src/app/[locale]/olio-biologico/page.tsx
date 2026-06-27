import { locales, type Locale } from "@/i18n/pathnames";
import { readPublicCatalog } from "@/lib/server/catalog";
import OlioBiologicoClient, { type BiologicoContent } from "./OlioBiologicoClient";
import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const pageContent: Record<Exclude<Locale, "es" | "fr" | "us">, BiologicoContent> = {
  it: {
    kicker: "Sostenibilità",
    title: "Olio EVO Biologico",
    subtitle: "Pura espressione della natura: un olio extravergine ottenuto da uliveti coltivati nel pieno rispetto dell'equilibrio biologico.",
    heroImage: "/hero/tradizione.png",
    introTitle: "La scelta naturale per un olio sano e sostenibile",
    introText: "L'olio extravergine di oliva biologico rappresenta l'impegno concreto del Frantoio Del Pasqua verso la salvaguardia dell'ambiente e la salute dei consumatori. Coltivare in regime biologico significa bandire pesticidi chimici, diserbanti e concimi di sintesi, affidandosi a metodi naturali che preservano la biodiversità del terreno e la forza vitale degli alberi.\n\nNel nostro frantoio ad Arezzo, dedichiamo linee di produzione specifiche a questa tipologia di olive. La frangitura meccanica immediata ed a freddo assicura un olio integro, caratterizzato da un profilo organolettico eccezionale, ricco di polifenoli e vitamine. Perfetto per un'alimentazione sana e pulita, è l'ideale per il condimento a crudo di insalate, zuppe, verdure e per l'alimentazione quotidiana della famiglia.",
    features: [
      { icon: "leaf", title: "Certificazione Bio", description: "Olio da olive coltivate seguendo i rigidi standard europei per il biologico." },
      { icon: "shield", title: "Nessun Additivo Chimico", description: "Escluso l'uso di pesticidi, diserbanti o concimi chimici di sintesi." },
      { icon: "droplet", title: "Sapore Puro", description: "Un extravergine dal gusto pulito ed equilibrato, ricco di aromi naturali." }
    ],
    ctaTitle: "Scegli il Biologico di Frantoio",
    ctaText: "Acquista direttamente online le nostre migliori selezioni biologiche ed artigianali.",
    ctaButton: "Vai allo Shop",
    seoTitleText: "Perché scegliere l'Olio Extravergine Biologico?",
    seoBodyText: "Comprare olio EVO biologico online direttamente dal frantoio garantisce un prodotto fresco, non industriale e totalmente tracciabile. Scegliere il biologico significa sostenere un'agricoltura rispettosa delle generazioni future e del nostro prezioso territorio toscano.",
    stats: [
      { value: "100% Bio", label: "Coltivazione Naturale", description: "Uliveti gestiti senza pesticidi, diserbanti o concimi chimici di sintesi." },
      { value: "< 4 ore", label: "Frangitura Immediata", description: "Dalla raccolta alla spremitura a freddo per preservare tutti gli antiossidanti." },
      { value: "ICEA", label: "Organismo Certificatore", description: "Certificazione ufficiale che garantisce il rispetto degli standard bio europei." }
    ],
    comparisonTable: {
      title: "Bio Del Pasqua vs Altre Realtà",
      headers: ["Criterio", "Bio Del Pasqua", "Bio Industriale", "Supermercato"],
      rows: [
        { 
          name: "Certificazione Biologica", 
          description: "Certificazione ufficiale rilasciata da enti terzi accreditati.",
          values: ["✓ ICEA (Rigido controllo indipendente su filiera)", "✓ Standard UE (Controlli minimi obbligatori)", "✗ Nessuna (Trattamenti chimici intensivi)"] 
        },
        { 
          name: "Origine delle Olive", 
          description: "Provenienza geografica certificata e tracciabilità delle olive.",
          values: ["100% Arezzo (Toscana) - Singolo Uliveto", "Miscele UE ed extra-UE da lotti multipli", "Origine mista e non tracciabile"] 
        },
        { 
          name: "Raccolta delle Olive", 
          description: "Tecnica di distacco del frutto per preservare l'integrità.",
          values: ["Manuale a mano (brucatura)", "Meccanica intensiva con scuotitori", "Meccanizzata o raccolta a terra tardiva"] 
        },
        { 
          name: "Tempo di Frangitura", 
          description: "Tempo intercorso tra il distacco dall'albero e la spremitura.",
          values: ["Entro 4 ore dalla raccolta", "Entro 24-48 ore dalla raccolta", "Fino a 72+ ore o stoccaggio prolungato"] 
        },
        { 
          name: "Metodo di Estrazione", 
          description: "Temperatura e ciclo di lavorazione nel frantoio.",
          values: ["Ciclo continuo a freddo (<22°C) sotto azoto", "Centrifugazione standard a freddo (<27°C)", "Estrazione a caldo con trattamenti chimici"] 
        },
        { 
          name: "Conservazione e Bottiglia", 
          description: "Protezione dall'ossidazione indotta da luce e ossigeno.",
          values: ["Sotto azoto in vetro scuro anti-UV brevettato", "Lattina o vetro scuro senza azoto", "Plastica trasparente o vetro chiaro al sole"] 
        },
        { 
          name: "Tenore in Polifenoli", 
          description: "Antiossidanti naturali benefici per la salute.",
          values: ["Elevatissimo (>420 mg/kg - Terapeutico)", "Basso-medio (circa 180-220 mg/kg)", "Minimo (<90 mg/kg) degradato"] 
        },
        { 
          name: "Acidità Libera", 
          description: "Indicatore primario di freschezza ed integrità.",
          values: ["Bassissima (≤0.18% - Qualità eccellente)", "Standard (circa 0.4% - 0.5%)", "Elevata (fino a 0.8% - Limite massimo)"] 
        },
        { 
          name: "Sostenibilità del Suolo", 
          description: "Pratiche agricole per la biodiversità e la rigenerazione del suolo.",
          values: ["Agricoltura rigenerativa e tutela delle api", "Monocultura intensiva ad alto impatto idrico", "Uso intensivo di diserbanti chimici"] 
        }
      ]
    },
    pairings: [
      { name: "Insalata Caprese", description: "Fette di pomodoro maturo, mozzarella di bufala campana DOP, origano e basilico fresco completati con un filo di Olio Biologico Del Pasqua." },
      { name: "Pinzimonio di Verdure", description: "Ideale per accompagnare verdure fresche e di stagione come finocchi, carote e sedano da intingere in olio grezzo e sale." },
      { name: "Pesce al Vapore o al Forno", description: "Un olio dal profilo leggero e fruttato, perfetto per valorizzare pesci bianchi e cotture delicate a vapore." }
    ]
  },
  en: {
    kicker: "Sustainability",
    title: "Organic Extra Virgin Olive Oil",
    subtitle: "Pure expression of nature: extra virgin olive oil obtained from groves cultivated in full respect of the biological balance.",
    heroImage: "/hero/tradizione.png",
    introTitle: "The natural choice for a healthy and sustainable oil",
    introText: "Organic extra virgin olive oil represents the concrete commitment of Frantoio Del Pasqua to environmental protection and consumer health. Organic cultivation means banning chemical pesticides, herbicides, and synthetic fertilizers, relying on natural methods that preserve soil biodiversity and tree vitality.\n\nIn our mill in Arezzo, we dedicate specific production lines to organic olives. Instant, cold mechanical pressing ensures an intact oil, characterized by an outstanding organoleptic profile, rich in polyphenols and vitamins. Perfect for a healthy and clean diet, it is ideal for raw seasoning of salads, soups, vegetables, and everyday family meals.",
    features: [
      { icon: "leaf", title: "Certified Organic", description: "Oil from olives grown following strict European organic standards." },
      { icon: "shield", title: "No Chemical Additives", description: "Excluded use of pesticides, herbicides, or synthetic fertilizers." },
      { icon: "droplet", title: "Pure Flavor", description: "An extra virgin oil with a clean and balanced taste, rich in natural aromas." }
    ],
    ctaTitle: "Choose Mill Organic Oil",
    ctaText: "Buy directly online our best organic and artisanal selections.",
    ctaButton: "Go to Shop",
    seoTitleText: "Why Choose Organic Extra Virgin Olive Oil?",
    seoBodyText: "Buying organic extra virgin olive oil online directly from the mill guarantees a fresh, non-industrial, and fully traceable product. Choosing organic means supporting an agriculture respectful of future generations and of our precious Tuscan territory.",
    stats: [
      { value: "100% Bio", label: "Natural Cultivation", description: "Olive groves managed with zero pesticides, herbicides, or chemical fertilizers." },
      { value: "< 4 hours", label: "Immediate Milling", description: "From harvest to cold extraction to preserve fresh healthy polyphenols." },
      { value: "ICEA", label: "Certifying Body", description: "Official certification guaranteeing compliance with European bio standards." }
    ],
    comparisonTable: {
      title: "Bio Del Pasqua vs Alternatives",
      headers: ["Criterion", "Bio Del Pasqua", "Industrial Bio", "Supermarket"],
      rows: [
        { 
          name: "Organic Certification", 
          description: "Official organic certification issued by accredited third-party bodies.",
          values: ["✓ ICEA Certified (Strict independent control)", "✓ Standard EU (Minimum mandatory legal controls)", "✗ None (Treatments with synthetic chemicals)"] 
        },
        { 
          name: "Origin of Olives", 
          description: "Certified geographical origin and traceability of the olives.",
          values: ["100% Arezzo (Tuscany) - Single Estate", "EU/non-EU blends from multiple locations", "Mixed, non-traceable industrial origin"] 
        },
        { 
          name: "Harvesting Method", 
          description: "Fruit detachment technique used to preserve structural integrity.",
          values: ["Manual hand-picked (brucatura)", "Intensive mechanical shaking", "Mechanical or late harvest from the ground"] 
        },
        { 
          name: "Milling Time", 
          description: "Time elapsed between picking from the tree and milling.",
          values: ["Under 4 hours (maximum freshness)", "24 - 48 hours (risk of fermentation)", "Up to 72+ hours or prolonged storage"] 
        },
        { 
          name: "Extraction Method", 
          description: "Processing temperature and cycle inside the mill.",
          values: ["Continuous cold extraction (<22°C) under nitrogen", "Standard cold extraction (<27°C)", "Hot extraction with chemical refining"] 
        },
        { 
          name: "Storage & Packaging", 
          description: "Protection from light- and oxygen-induced oxidation.",
          values: ["Under nitrogen in patented anti-UV dark glass", "Cans or standard dark glass without nitrogen", "Clear plastic or clear glass in the light"] 
        },
        { 
          name: "Polyphenol Level", 
          description: "Natural antioxidants beneficial for health.",
          values: ["Very high (>420 mg/kg - Therapeutic)", "Low-medium (approx. 180-220 mg/kg)", "Minimal (<90 mg/kg) degraded by oxidation"] 
        },
        { 
          name: "Free Acidity", 
          description: "Primary chemical marker of olive freshness and health.",
          values: ["Extremely low (≤0.18% - Pristine quality)", "Standard (approx. 0.4% - 0.5%)", "High (up to 0.8% - Legal limit threshold)"] 
        },
        { 
          name: "Soil Sustainability", 
          description: "Agricultural practices for biodiversity and soil protection.",
          values: ["Regenerative farming & bee protection", "Intensive monoculture with high water use", "Intensive use of chemical herbicides"] 
        }
      ]
    },
    pairings: [
      { name: "Caprese Salad", description: "Slices of ripe tomato, buffalo mozzarella cheese, oregano, and fresh basil completed with a drizzle of Del Pasqua Organic Oil." },
      { name: "Fresh Vegetable Dip", description: "Ideal to accompany fresh, seasonal vegetables like fennel, carrots, and celery to dip in raw organic oil and sea salt." },
      { name: "Steamed or Baked Fish", description: "An oil with a light, fruity profile, perfect to enhance white fish and delicate steamed preparations." }
    ]
  },
  de: {
    kicker: "Nachhaltigkeit",
    title: "Bio-Olivenöl Extra Vergine",
    subtitle: "Reiner Ausdruck der Natur: Olivenöl extra vergine aus Hainen, die unter voller Achtung des ökologischen Gleichgewichts bewirtschaftet werden.",
    heroImage: "/hero/tradizione.png",
    introTitle: "Die natürliche Wahl für ein gesundes Öl",
    introText: "Bio-Olivenöl extra vergine steht für das Engagement von Frantoio Del Pasqua für Umweltschutz und Gesundheit. Ökologischer Anbau bedeutet den Verzicht auf chemische Pestizide, Herbizide und Kunstdünger. Wir setzen auf natürliche Methoden, die die Artenvielfalt des Bodens erhalten.\n\nIn unserer Mühle in Arezzo pressen wir diese Oliven in eigenen Durchgängen schonend kalt. Das Ergebnis ist ein unbelastetes Öl, reich an Polyphenolen und Vitaminen. Ideal für Salate, Suppen und die tägliche Küche.",
    features: [
      { icon: "leaf", title: "Bio-Zertifiziert", description: "Olivenöl aus Anbau nach strengen europäischen Bio-Richtlinien." },
      { icon: "shield", title: "Ohne Chemie", description: "Kein Einsatz von chemischen Pestiziden oder Kunstdüngern." },
      { icon: "droplet", title: "Reiner Geschmack", description: "Ein natives Olivenöl extra mit sauberem, ausgewogenem Aroma." }
    ],
    ctaTitle: "Wählen Sie Bio-Öl ab Mühle",
    ctaText: "Kaufen Sie unsere besten biologischen und handwerklichen Auswahlen direkt online.",
    ctaButton: "Zum Shop",
    seoTitleText: "Warum biologisches Olivenöl extra vergine wählen?",
    seoBodyText: "Biologisches Olivenöl direkt online zu kaufen, garantiert ein frisches, handwerkliches Produkt aus der Toskana. Schützen Sie die Umwelt mit Ihrem Kauf.",
    stats: [
      { value: "100% Bio", label: "Natürlicher Anbau", description: "Olivenhaine ohne Pestizide, Herbizide oder Kunstdünger bewirtschaftet." },
      { value: "< 4 Std.", label: "Sofortige Pressung", description: "Vom Baum zur Mühle in unter 4 Std. zur Schonung aller Antioxidantien." },
      { value: "ICEA", label: "Zertifizierungsstelle", description: "Offizielle Zertifizierung nach den strengen EU-Bio-Richtlinien." }
    ],
    comparisonTable: {
      title: "Bio Del Pasqua im Vergleich",
      headers: ["Kriterium", "Bio Del Pasqua", "Industrielles Bio", "Supermarkt"],
      rows: [
        { 
          name: "Bio-Zertifizierung", 
          description: "Offizielle Bio-Zertifizierung durch akkreditierte Stellen.",
          values: ["✓ ICEA-zertifiziert (Strikte unabhängige Kontrolle)", "✓ EU-Standard (Minimale gesetzliche Kontrollen)", "✗ Keine (Einsatz von synthetischen Pestiziden)"] 
        },
        { 
          name: "Herkunft der Oliven", 
          description: "Zertifizierte geografische Herkunft und Rückverfolgbarkeit.",
          values: ["100% Arezzo (Toskana) - Einzelner Familienhain", "Mischungen aus EU- und Nicht-EU-Ländern", "Mischungen unbekannter Herkunft"] 
        },
        { 
          name: "Erntemethode", 
          description: "Technik der Olivenernte zur Schonung der Früchte.",
          values: ["Manuelle Handernte (brucatura)", "Intensive mechanische Ernteschüttler", "Maschinell oder überreife Bodenlese"] 
        },
        { 
          name: "Zeitspanne bis zur Pressung", 
          description: "Zeit zwischen der Ernte vom Baum und der Pressung.",
          values: ["Unter 4 Stunden (maximale Frische)", "24 bis 48 Stunden (Fermentationsrisiko)", "Bis zu 72+ Stunden oder lange Lagerung"] 
        },
        { 
          name: "Extraktionsmethode", 
          description: "Verarbeitungstemperatur und -zyklus in der Ölmühle.",
          values: ["Kontinuierliche Kaltextraktion (<22°C) unter Stickstoff", "Standard-Kaltextraktion (<27°C)", "Heißextraktion mit chemischer Raffination"] 
        },
        { 
          name: "Lagerung & Flasche", 
          description: "Schutz vor Oxidation durch Licht und Sauerstoff.",
          values: ["Unter Stickstoff in patentiertem UV-Schutz-Dunkelglas", "Kanister oder Standard-Dunkelglas ohne Stickstoff", "Transparente Plastik- oder Klarglasflaschen"] 
        },
        { 
          name: "Polyphenolgehalt", 
          description: "Natürliche Antioxidantien mit gesundheitlichem Nutzen.",
          values: ["Sehr hoch (>420 mg/kg - Therapeutisch)", "Niedrig-mittel (ca. 180-220 mg/kg)", "Minimal (<90 mg/kg) durch Oxidation zerstört"] 
        },
        { 
          name: "Freie Säure", 
          description: "Primärer chemischer Indikator für die Frische der Oliven.",
          values: ["Extrem niedrig (≤0,18% - Hervorragende Qualität)", "Standard (ca. 0,4% - 0,5%)", "Hoch (bis zu 0,8% - Gesetzlicher Grenzwert)"] 
        },
        { 
          name: "Boden-Nachhaltigkeit", 
          description: "Landwirtschaftliche Praktiken für Artenvielfalt und Bodenschutz.",
          values: ["Regenerative Landwirtschaft & Bienenschutz", "Intensive Monokultur mit hohem Wasserverbrauch", "Intensiver Einsatz von chemischen Herbiziden"] 
        }
      ]
    },
    pairings: [
      { name: "Caprese-Salat", description: "Reife Tomatenscheiben, Büffelmozzarella, Oregano und frisches Basilikum, abgerundet mit Bio-Öl von Del Pasqua." },
      { name: "Gemüse-Dip (Pinzimonio)", description: "Ideal zu frischem, saisonalem Gemüse wie Fenchel, Karotten und Sellerie, zum Dippen in Bio-Öl mit etwas Meersalz." },
      { name: "Gedämpfter Fisch", description: "Ein Öl mit einem leichten, fruchtigen Profil, perfekt für weißen Fisch und feine gedämpfte Speisen." }
    ]
  },
  nl: {
    kicker: "Duurzaamheid",
    title: "Biologische Extra Vierge Olijfolie",
    subtitle: "Pure uitdrukking van de natuur: extra vierge olijfolie verkregen uit boomgaarden geteeld met respect voor het ecologische evenwicht.",
    heroImage: "/hero/tradizione.png",
    introTitle: "De natuurlijke keuze voor een gezonde en duurzame olijfolie",
    introText: "Biologische extra vierge olijfolie weerspiegelt de toewijding van Frantoio Del Pasqua aan het milieu en uw gezondheid. Biologische teelt betekent het vermijden van chemische bestrijdingsmiddelen, pesticiden en kunstmest. Wij vertrouwen op natuurlijke methoden dat de bodembiodiversiteit beschermen.\n\nIn onze perserij in Arezzo hebben we specifieke productielijnen voor biologische olijven. Directe koude persing garandeert een pure olie.",
    features: [
      { icon: "leaf", title: "Biologisch Gecertificeerd", description: "Olijfolie van olijven geteeld volgens de strenge Europese biologische normen." },
      { icon: "shield", title: "Geen Chemische Toevoegingen", description: "Uitgesloten gebruik van chemische bestrijdingsmiddelen of kunstmest." },
      { icon: "droplet", title: "Pure Smaak", description: "Een extra vierge olijfolie met uniek aroma." }
    ],
    ctaTitle: "Kies voor Biologische Olijfolie",
    ctaText: "Koop onze beste biologische en ambachtelijke selecties rechtstreeks online.",
    ctaButton: "Naar de Winkel",
    seoTitleText: "Waarom Biologische Extra Vierge Olijfolie kopen?",
    seoBodyText: "Biologische extra vierge olijfolie rechtstreeks online kopen bij de molen garandeert een vers en traceerbaar product. Steun duurzame landbouw in Toscane.",
    stats: [
      { value: "100% Bio", label: "Natuurlijke Teelt", description: "Olijfgaarden beheerd zonder pesticiden, herbiciden of kunstmest." },
      { value: "< 4 uur", label: "Snelle Persing", description: "Binnen 4 uur geperst om alle gezonde polyfenolen optimaal te behouden." },
      { value: "ICEA", label: "Keuringsinstantie", description: "Officiële certificering die naleving van de EU-biorichtlijnen garandeert." }
    ],
    comparisonTable: {
      title: "Bio Del Pasqua vs Alternatieven",
      headers: ["Criterium", "Bio Del Pasqua", "Industrieel Bio", "Supermarkt"],
      rows: [
        { 
          name: "Biologische Certificering", 
          description: "Officiële biologische certificering door geaccrediteerde instanties.",
          values: ["✓ ICEA-gecertificeerd (Strenge onafhankelijke controle)", "✓ EU-standaard (Minimale wettelijke controles)", "✗ Geen (Behandeling met synthetische chemicaliën)"] 
        },
        { 
          name: "Herkomst van de Olijven", 
          description: "Gecertificeerde geografische herkomst en traceerbaarheid.",
          values: ["100% Arezzo (Toscane) - Enkele boomgaard", "EU/niet-EU melanges van meerdere locaties", "Gemengde, niet-traceerbare industriële herkomst"] 
        },
        { 
          name: "Oogstmethode", 
          description: "Technik gebruikt om de olijven te plukken zonder beschadiging.",
          values: ["Handgeplukt (brucatura)", "Intensief mechanisch schudden", "Machinale of late oogst van de grond"] 
        },
        { 
          name: "Perstijd", 
          description: "Tijd verstreken tussen het plukken en het persen.",
          values: ["Binnen 4 uur (maximale versheid)", "24 - 48 uur (risico op fermentatie)", "Tot 72+ uur of langdurige opslag"] 
        },
        { 
          name: "Extractiemethode", 
          description: "Verwerkingstemperatuur en cyclus in de perserij.",
          values: ["Continue koude extractie (<22°C) onder stikstof", "Standaard koude extractie (<27°C)", "Warme extractie met chemische raffinage"] 
        },
        { 
          name: "Opslag & Fles", 
          description: "Bescherming tegen door licht en zuurstof veroorzaakte oxidatie.",
          values: ["Onder stikstof in gepatenteerd UV-werend donker glas", "Blik of standaard donker glas zonder stikstof", "Transparant plastic of helder glas in het licht"] 
        },
        { 
          name: "Polyfenolengehalte", 
          description: "Natuurlijke antioxidanten die gunstig zijn voor de gezondheid.",
          values: ["Zeer hoog (>420 mg/kg - Therapeutisch)", "Laag-gemiddeld (ca. 180-220 mg/kg)", "Minimaal (<90 mg/kg) aangetast door oxidatie"] 
        },
        { 
          name: "Vrije Zuurgraad", 
          description: "Primaire chemische indicator voor de versheid van de olijven.",
          values: ["Zeer laag (≤0,18% - Uitmuntende kwaliteit)", "Standaard (ca. 0,4% - 0,5%)", "Hoog (tot 0,8% - Wettelijke limiet)"] 
        },
        { 
          name: "Bodemduurzaamheid", 
          description: "Landbouwpraktijken voor biodiversiteit en bodembescherming.",
          values: ["Regeneratieve landbouw & bijenbescherming", "Intensieve monocultuur met hoog waterverbruik", "Intensief gebruik van chemische herbiciden"] 
        }
      ]
    },
    pairings: [
      { name: "Caprese Salade", description: "Plakjes rijpe tomaat, buffelmozzarella, oregano en verse basilicum overgoten met biologische olijfolie van Del Pasqua." },
      { name: "Verse Groentendip", description: "Ideaal om rauwe seizoensgroenten zoals venkel, wortel en selderij in te dippen met wat zeezout." },
      { name: "Gestoomde of Gebakken Vis", description: "Een olijfolie met een licht en fruitig profiel, perfect voor witvis en delicate gestoomde gerechten." }
    ]
  },
  da: {
    kicker: "Bæredygtighed",
    title: "Økologisk Ekstra Jomfruolivenolie",
    subtitle: "Rent udtryk for naturen: ekstra jomfruolivenolie fremstillet af lunde dyrket i fuld respekt for den biologiske balance.",
    heroImage: "/hero/tradizione.png",
    introTitle: "Det naturlige valg for en sund og bæredygtig olie",
    introText: "Økologisk ekstra jomfruolivenolie repræsenterer Frantoio Del Pasquas forpligtelse til miljøbeskyttelse og forbrugernes sundhed. Økologisk dyrkning betyder forbud mod kemiske pesticider, ukrudtsmidler og syntetisk gødning. Vi stoler på naturlige metoder, der bevarer jordens biodiversitet og træernes vitalitet.",
    features: [
      { icon: "leaf", title: "Certificeret Økologisk", description: "Olie fra oliven dyrket efter strenge økologiske standarder." },
      { icon: "shield", title: "Ingen Kemiske Tilsætningsstoffer", description: "Udelukket brug av pesticider eller syntetisk gødning." },
      { icon: "droplet", title: "Ren Smag", description: "En ekstra jomfruolie med en ren og afbalanceret smag." }
    ],
    ctaTitle: "Vælg Økologisk Mølleolie",
    ctaText: "Køb vores bedste økologiske udvalg direkte online.",
    ctaButton: "Til Butik",
    seoTitleText: "Hvorfor Vælge Økologisk Ekstra Jomfruolivenolie?",
    seoBodyText: "Køb af økologisk ekstra jomfruolivenolie direkte online fra møllen garanterer et friskt, ikke-industrielt og fuldt sporbart produkt.",
    stats: [
      { value: "100% Øko", label: "Naturlig Dyrkning", description: "Olivenlunde dyrket helt uden pesticider eller kunstgødning." },
      { value: "< 4 timer", label: "Hurtig Pressning", description: "Fra høst til koldpresning på under 4 timer for at bevare polyphenoler." },
      { value: "ICEA", label: "Certificeringsorgan", description: "Officiel kontrolgodkendelse efter EUs økologistandarder." }
    ],
    comparisonTable: {
      title: "Bio Del Pasqua vs Alternativer",
      headers: ["Kriterium", "Bio Del Pasqua", "Industriel Bio", "Supermarked"],
      rows: [
        { 
          name: "Økologisk Certificering", 
          description: "Officiel økologisk certificering udstedt af godkendte organer.",
          values: ["✓ ICEA-certificeret (Streng uafhængig kontrol)", "✓ Standard EU (Minimale lovpligtige kontroller)", "✗ Ingen (Behandlinger med syntetiske pesticider)"] 
        },
        { 
          name: "Olivenens Oprindelse", 
          description: "Certificeret geografisk oprindelse og sporbarhed af olivenene.",
          values: ["100% Arezzo (Toscana) - Enkelt egne marker", "EU/ikke-EU blandinger fra flere steder", "Blandet, ikke-sporbar industriel oprindelse"] 
        },
        { 
          name: "Høstmetode", 
          description: "Teknik til plukning af frugten for at bevare dens struktur.",
          values: ["Håndplukket manuelt (brucatura)", "Intensiv mekanisk rystning", "Mekaniseret eller sen høst fra jorden"] 
        },
        { 
          name: "Pressetid", 
          description: "Tid forløbet mellem plukning fra træet og presning.",
          values: ["Under 4 timer (maksimal friskhed)", "24 - 48 timer (risiko for gæring)", "Op til 72+ timer eller forlænget opbevaring"] 
        },
        { 
          name: "Ekstraktionsmetode", 
          description: "Behandlingstemperatur og cyklus inde i møllen.",
          values: ["Kontinuerlig kold ekstraktion (<22°C) under nitrogen", "Standard kold ekstraktion (<27°C)", "Varmekstraktion med kemisk raffinering"] 
        },
        { 
          name: "Opbevaring & Flaske", 
          description: "Beskyttelse mod iltning forårsaget av lys og ilt.",
          values: ["Under nitrogen i patenteret UV-blokerende mørkt glas", "Dåser og standard mørkt glas uden nitrogen", "Klar plast eller klart glas udsat for lys"] 
        },
        { 
          name: "Polyphenolindhold", 
          description: "Naturlige antioxidanter med sundhedsmæssige fordele.",
          values: ["Meget højt (>420 mg/kg - Terapeutisk)", "Lavt til moderat (ca. 180-220 mg/kg)", "Minimalt (<90 mg/kg) nedbrudt af iltning"] 
        },
        { 
          name: "Fri Syregrad", 
          description: "Primær kemisk markør for olivens friskhed og sundhed.",
          values: ["Ekstremt lav (≤0,18% - Fremragende kvalitet)", "Standard (ca. 0,4% - 0,5%)", "Høj (op til 0,8% - Lovlig grænseværdi)"] 
        },
        { 
          name: "Jordbæredygtighed", 
          description: "Landbrugspraksis for biodiversitet og jordbundsbeskyttelse.",
          values: ["Regenerativt landbrug & bibeskyttelse", "Intensiv monokultur med højt vandforbrug", "Intensiv brug af kemiske ukrudtsmidler"] 
        }
      ]
    },
    pairings: [
      { name: "Caprese Salat", description: "Skiver af modne tomater, bøffelmozzarella, oregano og frisk basilikum dryppet med Del Pasquas økologiske olie." },
      { name: "Friske grøntsagsstænger", description: "Ideel til friske grøntsager som fennikel, gulerødder og selleri til at dyppe i rå økologisk olie og havsalt." },
      { name: "Dampet eller bagt fisk", description: "En olie med en let, frugtig profil, perfekt til at fremhæve hvid fisk og dampede retter." }
    ]
  },
  no: {
    kicker: "Bærekraft",
    title: "Økologisk Ekstra Virgin Olivenolje",
    subtitle: "Rent uttrykk for naturen: ekstra virgin olivenolje oppnådd fra lunder dyrket i full respekt for den biologiske balansen.",
    heroImage: "/hero/tradizione.png",
    introTitle: "Det naturlige valget for en sunn og bærekraftig olje",
    introText: "Økologisk ekstra virgin olivenolje representerer Frantoio Del Pasquas engasjement for miljøvern og forbrukernes helse. Økologisk dyrkning betyr forbud mot kjemiske sprøytemidler, ugressmidler og syntetisk gjødsel. Vi stoler på naturlige metoder som bevarer jordens biologiske mangfold.",
    features: [
      { icon: "leaf", title: "Sertifisert Olje", description: "Olje fra oliven dyrket etter strenge økologiske standarder." },
      { icon: "shield", title: "Ingen Kjemikalier", description: "Utelukket bruk av sprøytemidler eller syntetisk gjødsel." },
      { icon: "droplet", title: "Ren Smag", description: "En ekstra virgin olje med en ren og balansert smak." }
    ],
    ctaTitle: "Velg Økologisk Mølleolje",
    ctaText: "Kjøp våre beste økologiske utvalg direkte online.",
    ctaButton: "Til Butikk",
    seoTitleText: "Hvorfor Velge Økologisk Ekstra Virgin Olivenolje?",
    seoBodyText: "Kjøp av økologisk ekstra virgin olivenolje direkte online fra møllen garanterer et friskt, ikke-industrielt og fullt sporbart produkt.",
    stats: [
      { value: "100% Bio", label: "Naturlig Dyrking", description: "Olivenlunder drevet helt uten sprøytemidler eller kjemisk gjødsel." },
      { value: "< 4 timer", label: "Umiddelbar Pressing", description: "Malt på under 4 timer fra høsting for å låse inn antioksidantene." },
      { value: "ICEA", label: "Sertifiseringsorgan", description: "Offisiell godkjenning for samsvar med EUs økologistandarder." }
    ],
    comparisonTable: {
      title: "Bio Del Pasqua vs Alternativer",
      headers: ["Kriterium", "Bio Del Pasqua", "Industriell Bio", "Supermarked"],
      rows: [
        { 
          name: "Økologisk Sertifisering", 
          description: "Offisiell økologisk sertifisering utstedt av godkjente kontrollorganer.",
          values: ["✓ ICEA-sertifisert (Streng uavhengig kontroll)", "✓ Standard EU (Minimale lovpålagte kontroller)", "✗ Ingen (Behandling med syntetiske sprøytemidler)"] 
        },
        { 
          name: "Olivenens Opprinnelse", 
          description: "Sertifisert geografisk opprinnelse og sporbarhet for olivenene.",
          values: ["100% Arezzo (Toscana) - Enkelt egen eiendom", "EU/ikke-EU blandinger fra flere steder", "Blandet, ikke-sporbar industriell opprinnelse"] 
        },
        { 
          name: "Høstingsmetode", 
          description: "Teknikk brukt til å plukke frukten for å bevare dens kvalitet.",
          values: ["Håndplukket manuelt (brucatura)", "Intensiv mekanisk risting", "Mekanisert eller sen høsting fra bakken"] 
        },
        { 
          name: "Pressetid", 
          description: "Tid gått mellom plukking fra treet og pressing.",
          values: ["Under 4 timer (maksimal friskhet)", "24 - 48 timer (risiko for gjæring)", "Opptil 72+ timer eller forlenget lagring"] 
        },
        { 
          name: "Ekstraksjonsmetode", 
          description: "Behandlingstemperatur og syklus inne i møllen.",
          values: ["Kontinuerlig kaldpress (<22°C) under nitrogen", "Standard kaldpress (<27°C)", "Varmekstraksjon med kjemisk raffinering"] 
        },
        { 
          name: "Lagring & Flaske", 
          description: "Beskyttelse mot oksidering forårsaket av lys og oksygen.",
          values: ["Under nitrogen i patentert UV-blokkerende mørkt glass", "Bokser eller standard mørkt glass uten nitrogen", "Klar plast eller klart glass utsatt for lys"] 
        },
        { 
          name: "Polyphenolnivå", 
          description: "Naturlige antioksidanter som er bra for helsen.",
          values: ["Svært høyt (>420 mg/kg - Terapeutisk)", "Lavt til middels (ca. 180-220 mg/kg)", "Minimalt (<90 mg/kg) nedbrutt av oksidering"] 
        },
        { 
          name: "Fri Syregrad", 
          description: "Primær kjemisk markør for olivenens friskhet og helse.",
          values: ["Ekstremt lav (≤0,18% - Fremragende kvalitet)", "Standard (ca. 0,4% - 0,5%)", "Høy (opptil 0,8% - Lovlig grenseverdi)"] 
        },
        { 
          name: "Jordbærekraft", 
          description: "Landbrukspraksis for biologisk mangfold og jordvern.",
          values: ["Regenerativt landbruk & biebeskyttelse", "Intensiv monokultur med høyt vannforbruk", "Intensiv bruk av kjemiske ugressmidler"] 
        }
      ]
    },
    pairings: [
      { name: "Caprese Salat", description: "Skiver av modne tomater, bøffelmozzarella, oregano og frisk basilicum dryppet med Del Pasquas økologiske olje." },
      { name: "Friske grønnsaker", description: "Ideell til friske grønnsaker som fennikel, gulrøtter og selleri til å dyppe i rå økologisk olje og havsalt." },
      { name: "Dampet eller bakt fisk", description: "En olje med en let, fruktig profil, perfekt til å fremheve hvit fisk og dampede retter." }
    ]
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OlioBiologicoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  const tp = await getTranslations({ locale: activeLocale, namespace: "Products" });
  const hasTranslation = (key: string) => typeof tp.has === "function" && tp.has(key);

  const rawCatalog = await readPublicCatalog();
  const targetIds = ["fruttato-leggero", "evo"];
  const products = rawCatalog
    .filter((p) => targetIds.includes(p.id))
    .map((product) => {
      const firstVariant = product.variants?.[0];
      const priceCents = firstVariant?.priceCents ?? 0;
      const priceLabel = new Intl.NumberFormat(activeLocale === "it" ? "it-IT" : "en-US", {
        style: "currency",
        currency: "EUR",
      }).format(priceCents / 100);

      const title = activeLocale === "it"
        ? (product.title ?? product.id)
        : (hasTranslation(`${product.id}.title`) ? tp(`${product.id}.title`) : product.title || product.id);

      return {
        id: product.id,
        title,
        priceLabel,
        imageSrc: firstVariant?.imageSrc ?? product.imageSrc ?? "",
        slug: product.slug ?? product.id,
      };
    });

  return <OlioBiologicoClient locale={activeLocale} content={content} products={products} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  return pageMetadata({
    title: content.title,
    description: content.subtitle,
    path: "/olio-biologico/",
    locale,
    hreflang: true,
  });
}
