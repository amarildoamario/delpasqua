import { locales, type Locale } from "@/i18n/pathnames";
import { readPublicCatalog } from "@/lib/server/catalog";
import OlioToscanoClient, { type OlioToscanoContent } from "./OlioToscanoClient";
import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const pageContent: Record<Exclude<Locale, "es" | "fr" | "us">, OlioToscanoContent> = {
  it: {
    kicker: "Territorio",
    title: "Olio Extravergine Toscano",
    subtitle: "L'essenza olivicola della Valdichiana: un legame indissolubile tra terra, tradizione ed il nostro frantoio ad Arezzo.",
    heroImage: "/hero/storia.jpeg",
    introTitle: "Un viaggio nel cuore della Toscana dell'olio",
    introText: "L'olio extravergine toscano è rinomato nel mondo per il suo profilo sensoriale unico, caratterizzato da note erbacee fresche, sentori di carciofo e una piacevole sensazione di amaro e piccante sul finale. Presso il Frantoio Del Pasqua, coltiviamo e frangiamo le olive tipiche del nostro territorio (tra cui Frantoio, Moraiolo e Leccino) a Monte San Savino, Arezzo.\n\nOgni passaggio è curato per preservare questo patrimonio: raccogliamo le olive al perfetto grado di maturazione e le portiamo in frantoio entro poche ore, procedendo ad una spremitura a freddo con impianti di ultima generazione. Il risultato è un olio vivo, profumato, perfetto per esaltare i piatti tipici toscani e la cucina di ogni giorno.",
    features: [
      { icon: "leaf", title: "100% Olive Toscane", description: "Olio ottenuto esclusivamente da olive raccolte nel territorio toscano." },
      { icon: "shield", title: "Estrazione a Freddo", description: "Lavorazione sotto i 27°C per mantenere intatti antiossidanti e profumi." },
      { icon: "sprout", title: "Cultivar Storiche", description: "Un sapiente blend di Frantoio, Moraiolo e Leccino della Valdichiana." }
    ],
    ctaTitle: "Porta la Toscana a Tavola",
    ctaText: "Scopri le nostre bottiglie ed acquista direttamente dal produttore.",
    ctaButton: "Vai allo Shop",
    seoTitleText: "L'Autenticità dell'Olio di Frantoio",
    seoBodyText: "Comprare olio extravergine toscano online direttamente dal frantoio garantisce tracciabilità assoluta, freschezza ed un legame sincero con il produttore. Ogni bottiglia Del Pasqua racconta la storia della nostra famiglia, dedita all'agricoltura in Valdichiana dagli anni '60 con passione immutata.",
    stats: [
      { value: "100%", label: "Olive Toscane", description: "Coltivate e raccolte esclusivamente nel territorio toscano." },
      { value: "< 6 ore", label: "Frangitura Rapida", description: "Dalla raccolta alla spremitura a freddo per preservare i polifenoli freschi." },
      { value: "3 Cultivar", label: "Blend Tradizionale", description: "Unione equilibrata di Frantoio, Moraiolo e Leccino della Valdichiana." }
    ],
    pairings: [
      { name: "Bruschetta all'Aglio", description: "Pane toscano arrostito, sfregato con aglio fresco e condito con un filo generoso di Olio Toscano grezzo per esaltarne le note piccanti." },
      { name: "Ribollita e Zuppe", description: "Ideale da aggiungere a crudo su zuppe di pane, fagioli e verdure tipiche della cucina contadina toscana." },
      { name: "Bistecca alla Fiorentina", description: "Completa il sapore robusto della carne alla griglia con i sentori erbacei freschi del nostro olio." }
    ],
    chemicalTitle: "Certificato di Eccellenza e Qualità",
    chemicalIntro: "La qualità di un olio extravergine si misura in laboratorio. Ecco i parametri chimici del nostro Olio Toscano confrontati con i limiti di legge.",
    chemicalSpecs: [
      { label: "Acidità Libera", value: "< 0.20%", limit: "Limite di legge: < 0.80%", description: "Indica l'uso di olive freschissime, sane ed esenti da difetti lavorate immediatamente." },
      { label: "Numero di Perossidi", value: "< 8 meq O2/kg", limit: "Limite di legge: < 20 meq", description: "Misura lo stato di ossidazione. Valori bassi garantiscono freschezza e lunga conservazione." },
      { label: "Polifenoli Totali", value: "> 350 mg/kg", limit: "Valore elevato (antiossidanti)", description: "Gli antiossidanti naturali responsabili delle caratteristiche note di amaro e piccante." }
    ],
    sensoryTitle: "Profilo Sensoriale (Tasting)",
    sensorySpecs: [
      { label: "Fruttato Verde", value: 7.5, description: "Note fresche di erba appena tagliata, foglia di pomodoro e carciofo selvatico." },
      { label: "Amaro", value: 6.0, description: "Equilibrato e persistente, ricorda la mandorla verde e il cardo." },
      { label: "Piccante", value: 7.0, description: "Pulito e stimolante in gola, indice di un'elevata concentrazione di polifenoli." }
    ],
    cultivarsTitle: "Il Blend Tradizionale della Valdichiana",
    cultivars: [
      { name: "Frantoio", description: "Dona struttura ed intensità aromatica. È responsabile delle note di erba verde, carciofo e di quel gradevole finale piccante in gola." },
      { name: "Moraiolo", description: "Apporta complessità e vigore. Ricchissimo di polifenoli, definisce la componente amara pulita e regala sentori di foglia d'olivo." },
      { name: "Leccino", description: "Rappresenta l'armonia e la morbidezza del blend. Bilancia le note più robuste con profumi fruttati delicati e sfumature di mandorla." }
    ]
  },
  en: {
    kicker: "Territory",
    title: "Tuscan Extra Virgin Olive Oil",
    subtitle: "The olive-growing essence of Valdichiana: an unbreakable bond between land, tradition, and our mill in Arezzo.",
    heroImage: "/hero/storia.jpeg",
    introTitle: "A journey into the heart of Tuscan olive oil",
    introText: "Tuscan extra virgin olive oil is world-renowned for its unique sensory profile, characterized by fresh herbaceous notes, hints of artichoke, and a pleasant bitter and peppery finish. At Frantoio Del Pasqua, we cultivate and press the typical olives of our territory (including Frantoio, Moraiolo, and Leccino) in Monte San Savino, Arezzo.\n\nEvery step is managed to preserve this heritage: we harvest the olives at the perfect stage of ripeness and bring them to the mill within a few hours, proceeding with a cold extraction using latest-generation machinery. The result is a living, fragrant oil, perfect for enhancing typical Tuscan dishes and everyday cooking.",
    features: [
      { icon: "leaf", title: "100% Tuscan Olives", description: "Oil obtained exclusively from olives harvested in the Tuscan territory." },
      { icon: "shield", title: "Cold Extracted", description: "Processed below 27°C to keep antioxidants and aromas intact." },
      { icon: "sprout", title: "Historic Cultivars", description: "A wise blend of Frantoio, Moraiolo, and Leccino from Valdichiana." }
    ],
    ctaTitle: "Bring Tuscany to Your Table",
    ctaText: "Discover our bottles and buy directly from the producer.",
    ctaButton: "Go to Shop",
    seoTitleText: "The Authenticity of Mill Oil",
    seoBodyText: "Buying Tuscan extra virgin olive oil online directly from the mill guarantees absolute traceability, freshness, and a sincere connection with the producer. Every Del Pasqua bottle tells the story of our family, dedicated to farming in Valdichiana since the 1960s.",
    stats: [
      { value: "100%", label: "Tuscan Olives", description: "Cultivated and harvested exclusively in the Tuscan territory." },
      { value: "< 6 hours", label: "Fast Milling", description: "From harvest to cold extraction within hours to preserve polyphenols." },
      { value: "3 Cultivars", label: "Traditional Blend", description: "A balanced combination of Frantoio, Moraiolo, and Leccino." }
    ],
    pairings: [
      { name: "Garlic Bruschetta", description: "Toasted Tuscan bread, rubbed with fresh garlic and drizzled with raw Tuscan oil to highlight its peppery notes." },
      { name: "Ribollita & Bean Soups", description: "Perfect to add raw on bread, bean, and vegetable soups typical of Tuscan country cooking." },
      { name: "Fiorentina Steak", description: "Enhances the robust flavor of grilled meats with the fresh herbaceous notes of our oil." }
    ],
    chemicalTitle: "Certificate of Excellence and Quality",
    chemicalIntro: "The quality of an extra virgin olive oil is measured in the lab. Here are the chemical parameters of our Tuscan Oil compared to legal limits.",
    chemicalSpecs: [
      { label: "Free Acidity", value: "< 0.20%", limit: "Legal limit: < 0.80%", description: "Indicates the use of pristine, healthy olives pressed immediately." },
      { label: "Peroxide Value", value: "< 8 meq O2/kg", limit: "Legal limit: < 20 meq", description: "Measures oxidation status. Low values ensure freshness and long storage life." },
      { label: "Total Polyphenols", value: "> 350 mg/kg", limit: "High value (antioxidants)", description: "Natural antioxidants responsible for the signature bitter and peppery notes." }
    ],
    sensoryTitle: "Sensory Profile (Tasting)",
    sensorySpecs: [
      { label: "Green Fruity", value: 7.5, description: "Fresh notes of freshly cut grass, green tomato leaf, and wild artichoke." },
      { label: "Bitter", value: 6.0, description: "Balanced and persistent, reminiscent of green almonds and cardoon." },
      { label: "Pungent / Peppery", value: 7.0, description: "Clean and stimulating on the throat, indicating a high concentration of fresh polyphenols." }
    ],
    cultivarsTitle: "The Traditional Valdichiana Blend",
    cultivars: [
      { name: "Frantoio", description: "Provides structure and aromatic intensity. It is responsible for green grass notes, artichoke, and the signature peppery throat finish." },
      { name: "Moraiolo", description: "Adds complexity and character. Highly rich in polyphenols, it shapes the clean bitter profile and gives hints of olive leaf." },
      { name: "Leccino", description: "Brings harmony and sweetness to the blend. It balances the robust cultivars with delicate fruity notes and almond undertones." }
    ]
  },
  de: {
    kicker: "Herkunft",
    title: "Toskanisches Olivenöl Extra Vergine",
    subtitle: "Die Essenz des Olivenanbaus im Valdichiana: Eine unlösbare Verbindung zwischen Land, Tradition und unserer Ölmühle in Arezzo.",
    heroImage: "/hero/storia.jpeg",
    introTitle: "Eine Reise ins Herz des toskanischen Olivenöls",
    introText: "Toskanisches Olivenöl extra vergine ist weltweit bekannt für sein einzigartiges sensorisches Profil, das sich durch frische krautige Noten, Anklänge von Artischocke und einen angenehm bitteren und scharfen Abgang auszeichnet. Im Frantoio Del Pasqua kultivieren und pressen wir die typischen Oliven unseres Territoriums (darunter Frantoio, Moraiolo und Leccino) in Monte San Savino, Arezzo.\n\nJeder Schritt wird gepflegt, um dieses Erbe zu bewahren: Wir ernten die Oliven zum perfekten Reifezeitpunkt und bringen sie innerhalb weniger Stunden in die Mühle, wo sie in modernen Anlagen kalt gepresst werden. Das Ergebnis ist ein lebendiges, duftendes Öl, ideal für toskanische Gerichte.",
    features: [
      { icon: "leaf", title: "100% Toskanische Oliven", description: "Ausschließlich aus im toskanischen Territorium geernteten Oliven gewonnen." },
      { icon: "shield", title: "Kaltextrahiert", description: "Verarbeitung unter 27 °C, um Antioxidantien und Aromen vollständig zu erhalten." },
      { icon: "sprout", title: "Historische Sorten", description: "Eine feine Mischung aus Frantoio, Moraiolo und Leccino aus dem Valdichiana." }
    ],
    ctaTitle: "Bringen Sie die Toskana auf Ihren Tisch",
    ctaText: "Entdecken Sie unsere Flaschen und kaufen Sie direkt beim Hersteller.",
    ctaButton: "Zum Shop",
    seoTitleText: "Die Authentizität des Mühlenöls",
    seoBodyText: "Toskanisches Olivenöl extra vergine direkt online ab Ölmühle zu kaufen, garantiert absolute Rückverfolgbarkeit, Frische und eine ehrliche Beziehung zum Erzeuger. Jede Flasche Del Pasqua erzählt die Geschichte unserer Familie.",
    stats: [
      { value: "100%", label: "Toskanische Oliven", description: "Ausschließlich im toskanischen Territorium kultiviert und geerntet." },
      { value: "< 6 Std.", label: "Schnelle Pressung", description: "Vom Baum zur Mühle in unter 6 Stunden zur Schonung der Polyphenole." },
      { value: "3 Sorten", label: "Traditioneller Blend", description: "Ausgewogene Mischung aus Frantoio, Moraiolo und Leccino." }
    ],
    pairings: [
      { name: "Knoblauch-Bruschetta", description: "Geröstetes toskanisches Brot, mit frischem Knoblauch eingerieben und mit rohem toskanischen Öl beträufelt." },
      { name: "Ribollita & Bohnensuppen", description: "Ideal, um Suppen aus Brot, Bohnen und Gemüse der traditionellen toskanischen Küche zu verfeinern." },
      { name: "Fiorentina-Steak", description: "Ergänzt den kräftigen Geschmack von gegrilltem Fleisch mit den frischen Kräuternoten unseres Öls." }
    ],
    chemicalTitle: "Zertifikat für Exzellenz und Qualität",
    chemicalIntro: "Die Qualität eines Olivenöls extra vergine wird im Labor gemessen. Hier sind die chemischen Parameter unseres toskanischen Öls im Vergleich zu den gesetzlichen Grenzwerten.",
    chemicalSpecs: [
      { label: "Freie Säure", value: "< 0,20%", limit: "Gesetzlicher Grenzwert: < 0,80%", description: "Zeigt die Verwendung von absolut gesunden Oliven an, die sofort gepresst wurden." },
      { label: "Peroxidzahl", value: "< 8 meq O2/kg", limit: "Gesetzlicher Grenzwert: < 20 meq", description: "Misst den Oxidationsgrad. Niedrige Werte garantieren Frische und lange Haltbarkeit." },
      { label: "Gesamtpolyphenole", value: "> 350 mg/kg", limit: "Hoher Wert (Antioxidantien)", description: "Natürliche Antioxidantien, die für die typisch grasige, bittere und scharfe Note sorgen." }
    ],
    sensoryTitle: "Sensorisches Profil (Verkostung)",
    sensorySpecs: [
      { label: "Grüne Fruchtigkeit", value: 7.5, description: "Frische Noten von frisch gemähtem Gras, grünen Tomatenblättern und wilder Artischocke." },
      { label: "Bitterkeit", value: 6.0, description: "Ausgewogen und anhaltend, erinnert an grüne Mandeln und Artischockenblüten." },
      { label: "Schärfe", value: 7.0, description: "Sauber und anregend im Abgang, ein Zeichen für eine hohe Dichte an frischen Polyphenolen." }
    ],
    cultivarsTitle: "Die traditionelle Valdichiana-Mischung",
    cultivars: [
      { name: "Frantoio", description: "Verleiht Struktur und aromatische Dichte. Verantwortlich für grasige Noten, Artischocke und den typisch scharfen Abgang im Hals." },
      { name: "Moraiolo", description: "Bringt Komplexität und Charakter. Sehr reich an Polyphenolen, prägt es das sauber bittere Profil und Noten von Olivenblättern." },
      { name: "Leccino", description: "Sorgt für Harmonie und Weichheit in der Cuvée. Es rundet robustere Noten mit feinen Fruchtaromen und Mandelnuancen ab." }
    ]
  },
  nl: {
    kicker: "Herkomst",
    title: "Toscaanse Extra Vierge Olijfolie",
    subtitle: "De olijventeelt in de Valdichiana: een onbreekbare band tussen land, traditie en onze perserij in Arezzo.",
    heroImage: "/hero/storia.jpeg",
    introTitle: "Een reis naar het hart van de Toscaanse olijfolie",
    introText: "Toscaanse extra vierge olijfolie staat wereldwijd bekend om haar unieke zintuiglijke profiel, gekenmerkt door frisse kruidachtige tonen, hints van artisjok en een aangenaam bittere en peperige afdronk. Bij Frantoio Del Pasqua telen en persen we de typische olijven van onze regio (waaronder Frantoio, Moraiolo en Leccino) in Monte San Savino, Arezzo.\n\nElke stap is gericht op het behoud van dit erfgoed: we oogsten de olijven op het perfecte rijpheidsmoment e brengen ze binnen een paar uur naar de molen voor koude persing. Het resultaat is een levendige, geurige olie.",
    features: [
      { icon: "leaf", title: "100% Toscaanse Olijven", description: "Olijfolie die uitsluitend is verkregen uit in Toscane geoogste olijven." },
      { icon: "shield", title: "Koude Extractie", description: "Verwerkt onder 27°C om antioxidanten en aroma's optimaal te behouden." },
      { icon: "sprout", title: "Historische Cultivars", description: "Een uitgebalanceerde blend van Frantoio, Moraiolo en Leccino uit de Valdichiana." }
    ],
    ctaTitle: "Breng Toscane naar uw Tafel",
    ctaText: "Ontdek onze flessen en koop rechtstreeks bij de producent.",
    ctaButton: "Naar de Winkel",
    seoTitleText: "De Authenticiteit van Molenolie",
    seoBodyText: "Toscaanse extra vierge olijfolie rechtstreeks online kopen bij de molen garandeert absolute traceerbaarheid, versheid en een oprechte verbinding met de producent. Elke fles Del Pasqua vertelt ons familieverhaal.",
    stats: [
      { value: "100%", label: "Toscaanse Olijven", description: "Uitsluitend geteeld en geoogst in Toscane." },
      { value: "< 6 uur", label: "Snelle Persing", description: "Binnen 6 uur geperst om alle gezonde polyfenolen te behouden." },
      { value: "3 Cultivars", label: "Traditionele Blend", description: "Een gebalanceerde combinatie van Frantoio, Moraiolo en Leccino." }
    ],
    pairings: [
      { name: "Knoflookbruschetta", description: "Geroosterd Toscaans brood, ingewreven met verse knoflook en overgoten met toscaanse olijfolie." },
      { name: "Ribollita & Bonensoep", description: "Ideaal om rauw toe te voegen aan maaltijdsoepen van brood en bonen uit de Toscaanse keuken." },
      { name: "Fiorentina Steak", description: "Maakt de robuuste smaak van gegrild rood vlees compleet met de frisse tonen van onze olijfolie." }
    ],
    chemicalTitle: "Certificaat van Uitmuntendheid en Kwaliteit",
    chemicalIntro: "De kwaliteit van een extra vierge olijfolie wordt gemeten in het laboratorium. Hier zijn de chemische parameters van onze Toscaanse olijfolie vergeleken met de wettelijke limieten.",
    chemicalSpecs: [
      { label: "Vrije Zuurgraad", value: "< 0,20%", limit: "Wettelijke limiet: < 0,80%", description: "Duidt op het gebruik van zeer gezonde, onbeschadigde olijven die direct zijn verwerkt." },
      { label: "Peroxidegetal", value: "< 8 meq O2/kg", limit: "Wettelijke limiet: < 20 meq", description: "Meet de oxidatietoestand. Lage waarden garanderen versheid en een lange levensduur." },
      { label: "Totale Polyfenolen", value: "> 350 mg/kg", limit: "Hoge waarde (antioxidanten)", description: "Natuurlijke antioxidanten die verantwoordelijk zijn voor de kenmerkende bittere en peperige tonen." }
    ],
    sensoryTitle: "Sensorisch Profiel (Proeverij)",
    sensorySpecs: [
      { label: "Groen Fruitig", value: 7.5, description: "Frisse tonen van gemaaid gras, groen tomatenblad en wilde artisjok." },
      { label: "Bitter", value: 6.0, description: "Gebalanceerd en aanhoudend, doet denken aan groene amandel en distel." },
      { label: "Peperig", value: 7.0, description: "Schoon en prikkelend in de keel, een indicator van een hoge concentratie verse polyfenolen." }
    ],
    cultivarsTitle: "De Traditionele Valdichiana Blend",
    cultivars: [
      { name: "Frantoio", description: "Biedt structuur en aromatische intensiteit. Verantwoordelijk voor groene grastonen, artisjok en de karakteristieke peperige afdronk." },
      { name: "Moraiolo", description: "Brengt complexiteit en kracht. Zeer rijk aan polyfenolen, bepaalt het bittertje en geeft hints van olijfblad." },
      { name: "Leccino", description: "Vertegenwoordigt de harmonie en zachtheid van de blend. Balanceert de robuuste runderen met zacht fruitige tonen en amandelnuances." }
    ]
  },
  da: {
    kicker: "Oprindelse",
    title: "Toscansk Ekstra Jomfruolivenolie",
    subtitle: "Olivenavl i Valdichiana: et ubrydeligt bånd mellem land, tradition og vores mølle in Arezzo.",
    heroImage: "/hero/storia.jpeg",
    introTitle: "En rejse ind i hjertet af toscansk olivenolie",
    introText: "Toscansk ekstra jomfruolivenolie er verdenskendt for sin unikke smagsprofil, præget af friske noter af urter, hints af artiskok og en behagelig bitter og krydret eftersmag. Hos Frantoio Del Pasqua dyrker og presser vi de typiske oliven fra vores område (herunder Frantoio, Moraiolo og Leccino) in Monte San Savino, Arezzo.\n\nAlle trin styres for at bevare denne arv: vi høster oliven på det perfekte modenhedstidspunkt og bringer dem til møllen inden for få timer til koldpresning. Resultatet er en levende, automatisk olie.",
    features: [
      { icon: "leaf", title: "100% Toscanske Oliven", description: "Olie fremstillet udelukkende af oliven høstet i det toscanske område." },
      { icon: "shield", title: "Koldpresset", description: "Forarbejdet under 27°C for at holde antioxidanter og aromaer intakte." },
      { icon: "sprout", title: "Historiske Sorter", description: "En fin blanding af Frantoio, Moraiolo og Leccino fra Valdichiana." }
    ],
    ctaTitle: "Bring Toscana til dit Bord",
    ctaText: "Oplev vores flasker og køb direkte fra producenten.",
    ctaButton: "Til Butik",
    seoTitleText: "Autenticiteten af Mølleolie",
    seoBodyText: "Køb af toscansk ekstra jomfruolivenolie direkte online fra møllen garanterer absolut sporbarhed, friskhed og en oprigtig forbindelse til producenten.",
    stats: [
      { value: "100%", label: "Toscanske Oliven", description: "Dyrket og høstet udelukkende i det toscanske område." },
      { value: "< 6 timer", label: "Hurtig Presning", description: "Fra høst to koldpresning inden for 6 timer for at bevare polyphenoler." },
      { value: "3 Sorter", label: "Traditionel Blanding", description: "En afbalanceret kombination af sorterne Frantoio, Moraiolo og Leccino." }
    ],
    pairings: [
      { name: "Hvidløgsbruschetta", description: "Ristet toscansk brød gnedet med frisk hvidløg og dryppet med rå toscansk olie." },
      { name: "Ribollita & Bønnesuppe", description: "Perfekt at hælde rå over toscanske brød- og grøntsagssupper." },
      { name: "Fiorentina Steak", description: "Fremhæver den fyldige smag af grillet kød med oliens friske noter." }
    ],
    chemicalTitle: "Certifikat for Excellence og Kvalitet",
    chemicalIntro: "Kvaliteten af en ekstra jomfruolivenolie måles i laboratoriet. Her er de kemiske parametre for vores toscanske olie sammenlignet med lovgrænserne.",
    chemicalSpecs: [
      { label: "Fri Syre", value: "< 0,20%", limit: "Lovgrænse: < 0,80%", description: "Indikerer anvendelse af helt friske, fejlfrie oliven, der er presset med det samme." },
      { label: "Peroxidtal", value: "< 8 meq O2/kg", limit: "Lovgrænse: < 20 meq", description: "Måler iltningstilstanden. Lave værdier garanterer friskhed og lang holdbarhed." },
      { label: "Samlet Polyphenol", value: "> 350 mg/kg", limit: "Højt indhold (antioxidant)", description: "Naturlige antioxidanter, der giver de karakteristiske bitre og pebrede noter." }
    ],
    sensoryTitle: "Sensorisk Profil (Smagning)",
    sensorySpecs: [
      { label: "Grøn Frugtighed", value: 7.5, description: "Friske noter af nyslået græs, grønne tomatblade og vild artiskok." },
      { label: "Bitterhed", value: 6.0, description: "Afbalanceret og vedvarende, minder om grønne mandler og tidsel." },
      { label: "Krydret / Peber", value: 7.0, description: "Rent og prikkende i halsen, hvilket indikerer en høj koncentration af friske polyphenoler." }
    ],
    cultivarsTitle: "Den Traditionelle Valdichiana Blanding",
    cultivars: [
      { name: "Frantoio", description: "Giver struktur og aromatisk intensitet. Ansvarlig for grønne græsnoter, artiskok og den typiske pebrede afslutning i halsen." },
      { name: "Moraiolo", description: "Giver kompleksitet og karakter. Rigt på polyphenoler, definerer den rene bitre tone og antydninger af olivenblade." },
      { name: "Leccino", description: "Bringer harmoni og blødhed til blandingen. Balancerer de kraftigere sorter med delikate frugtagtige noter og mandelaromaer." }
    ]
  },
  no: {
    kicker: "Opprinnelse",
    title: "Toskansk Ekstra Virgin Olivenolje",
    subtitle: "Olivenavlen i Valdichiana: et ubrydelig bånd mellom land, tradisjon og vår mølle in Arezzo.",
    heroImage: "/hero/storia.jpeg",
    introTitle: "En reise inn i hjertet av toscansk olivenolje",
    introText: "Toskansk ekstra virgin olivenolje er verdenskjent for sin unikke smaksprofil, preget av friske noter av urter, hints av artisjokk og en behagelig bitter og krydret ettersmak. Hos Frantoio Del Pasqua dyrker og presser vi de typiske olivene fra vårt område (inkludert Frantoio, Moraiolo og Leccino) i Monte San Savino, Arezzo.\n\nAlle trinn styres for at bevare denne arven: vi høster oliven på det perfekte modenhedstidspunktet og bringer dem til møllen innen få timer til kaldpressing. Resultatet er en levende, aromatisk olje.",
    features: [
      { icon: "leaf", title: "100% Toskanske Oliven", description: "Olje utvunnet utelukkende fra oliven høstet i det toscanske området." },
      { icon: "shield", title: "Kaldpresset", description: "Forarbeidet under 27°C for å holde antioksidanter og aromaer intakte." },
      { icon: "sprout", title: "Historiske Sorter", description: "En fin blanding av Frantoio, Moraiolo og Leccino fra Valdichiana." }
    ],
    ctaTitle: "Bring Toscana til ditt Bord",
    ctaText: "Oppdag våre flasker og kjøp direkte fra produsenten.",
    ctaButton: "Til Butikk",
    seoTitleText: "Autentisiteten av Mølleolje",
    seoBodyText: "Kjøp av toskansk ekstra virgin olivenolje direkte online fra møllen garanterer absolutt sporbarhet, friskhet og en oppriktig forbindelse til produsenten.",
    stats: [
      { value: "100%", label: "Toskanske Oliven", description: "Dyrket og høstet utelukkende i det toscanske området." },
      { value: "< 6 timer", label: "Hurtig Pressing", description: "Fra høst til kaldpressing innen 6 timer for å bevare polyfenoler." },
      { value: "3 Sorter", label: "Tradisjonell Blanding", description: "En balansert kombinasjon av sortene Frantoio, Moraiolo og Leccino." }
    ],
    pairings: [
      { name: "Hvitløksbruschetta", description: "Ristet toscansk brød gnidd med fersk hvitløg og dryppet med rå toscansk olje." },
      { name: "Ribollita & Bønnesupper", description: "Perfekt å helle rå over toscanske brød- og grønnsakssupper." },
      { name: "Fiorentina Biff", description: "Fremhever den fyldige smaken av grillet kjøtt med oljens friske noter." }
    ],
    chemicalTitle: "Sertifikat for Kvalitet og Ekspertise",
    chemicalIntro: "Kvaliteten på en ekstra virgin olivenolje måles i laboratoriet. Her er de kjemiske parametrene til vår toskanske olje sammenlignet med lovgrenser.",
    chemicalSpecs: [
      { label: "Fri Syre", value: "< 0,20%", limit: "Lovgrense: < 0,80%", description: "Indikerer bruk av helt friske, feilfrie oliven som er presset umiddelbart." },
      { label: "Peroksidverdi", value: "< 8 meq O2/kg", limit: "Lovgrense: < 20 meq", description: "Måler oksideringsgraden. Lave verdier garanterer friskhet og lang holdbarhet." },
      { label: "Totalt Polyfenol", value: "> 350 mg/kg", limit: "Høy verdi (antioksidant)", description: "Naturlige antioksidanter som gir den karakteristiske bitre og krydrede smaken." }
    ],
    sensoryTitle: "Sensory Profile (Smaking)",
    sensorySpecs: [
      { label: "Grønn Fruktighet", value: 7.5, description: "Friske noter av nyslått gress, grønt tomatblad og vill artisjokk." },
      { label: "Bitterhet", value: 6.0, description: "Balansert og vedvarende, minner om grønn mandel og tistel." },
      { label: "Peppret", value: 7.0, description: "Rent og stimulerende i halsen, en indikator på en høy konsentrasjon av friske polyfenoler." }
    ],
    cultivarsTitle: "Den Tradisjonelle Valdichiana-Blandingen",
    cultivars: [
      { name: "Frantoio", description: "Gir struktur og aromatisk intensitet. Ansvarlig for grønne gressnoter, artisjokk og den typiske pepprede finishen i halsen." },
      { name: "Moraiolo", description: "Gir kompleksitet og karakter. Svært rik på polyfenoler, definerer den rene bitre tonen og antydninger av olivenblader." },
      { name: "Leccino", description: "Bringer harmoni og mykhet til blandingen. Balancerer de mer robuste sortene med delikate fruktige noter og mandeltoner." }
    ]
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function OlioToscanoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  const tp = await getTranslations({ locale: activeLocale, namespace: "Products" });
  const hasTranslation = (key: string) => typeof tp.has === "function" && tp.has(key);

  const rawCatalog = await readPublicCatalog();
  const targetIds = ["evo", "fruttato-medio", "fruttato-intenso"];
  const products = rawCatalog
    .filter((p) => targetIds.includes(p.id))
    .map((product) => {
      // Find the first variant to get price/label
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

  return <OlioToscanoClient locale={activeLocale} content={content} products={products} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  return pageMetadata({
    title: content.title,
    description: content.subtitle,
    path: "/olio-toscano/",
    locale,
    hreflang: true,
  });
}
