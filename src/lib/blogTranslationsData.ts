export interface BlogTranslation {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content?: string;
}

export type Locale = 'it' | 'en' | 'de' | 'nl' | 'da' | 'no' | 'es' | 'fr' | 'us';

export const BLOG_POST_TRANSLATIONS: Record<string, Partial<Record<Locale, BlogTranslation>>> = {
"post-1": {
    "it": {
      slug: "benefici-olio-evo-salute",
      title: "I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana",
      excerpt: "Non è solo un condimento, è il carburante pulito per chi ama vivere una vita attiva. Scopri come l'Olio EVO supporta le tue giornate, nutre i muscoli e protegge il cuore.",
      category: "Salute & Benessere"
    },
    "en": {
      slug: "benefits-extra-virgin-olive-oil-health",
      title: "The Health Benefits of Extra Virgin Olive Oil in Daily Life",
      excerpt: "It's not just a condiment; it's clean fuel for an active life. Discover how EVOO supports your day, nourishes muscles, and protects the heart.",
      category: "Health & Wellbeing"
    },
    "de": {
      slug: "vorteile-extra-vergine-olivenoel-gesundheit",
      title: "Die gesundheitlichen Vorteile von nativem Olivenöl Extra im Alltag",
      excerpt: "Es ist nicht nur ein Gewürz, sondern sauberer Kraftstoff für ein aktives Leben. Erfahren Sie, wie Olivenöl Extra Ihren Tag unterstützt, Muskeln nährt und das Herz schützt.",
      category: "Gesundheit & Wohlbefinden"
    },
    "nl": {
      slug: "voordelen-extra-vierge-olijfolie-gezondheid",
      title: "De gezondheidsvoordelen van extra vierge olijfolie in het dagelijks leven",
      excerpt: "Het is niet zomaar een smaakmaker, het is schone brandstof voor een actief leven. Ontdek hoe extra vierge olijfolie je dag ondersteunt, spieren voedt en het hart beschermt.",
      category: "Gezondheid & Welzijn"
    },
    "da": {
      slug: "fordele-ekstra-jomfruolivenolie-sundhed",
      title: "Fordelene ved ekstra jomfruolivenolie for dit daglige helbred",
      excerpt: "Det er ikke bare en ingrediens, det er rent brændstof til et aktivt liv. Oplev, hvordan ekstra jomfruolivenolie støtter din dag, nærer musklerne og beskytter hjertet.",
      category: "Sundhed & Velvære"
    },
    "no": {
      slug: "fordeler-ekstra-jomfruolivenolje-helse",
      title: "Fordelene med ekstra jomfruolivenolje for din daglige helse",
      excerpt: "Det er ikke bare et tilbehør, det er rent drivstoff for et aktivt liv. Oppdag hvordan ekstra jomfruolivenolje støtter hverdagen, nærer musklene og beskytter hjertet.",
      category: "Helse & Velvære"
    },
  
    "es": {
      slug: "los-beneficios-para-la-salud-del-aceite-de-oliva-virgen-extra-en-la-vida-diaria",
      title: "Los Beneficios para la Salud del Aceite de Oliva Virgen Extra en la Vida Diaria",
      excerpt: "No es solo un condimento; es combustible limpio para una vida activa. Descubre cómo el AOVE apoya tu día a día, nutre los músculos y protege el corazón.",
      category: "Salud y Bienestar"
    },
    "fr": {
      slug: "les-bienfaits-pour-la-sante-de-l-huile-d-olive-extra-vierge-au-quotidien",
      title: "Les bienfaits pour la santé de l'huile d'olive extra vierge au quotidien",
      excerpt: "Ce n'est pas seulement un condiment, c'est un carburant propre pour une vie active. Découvrez comment l'EVOO soutient votre journée, nourrit les muscles et protège le cœur.",
      category: "Santé & Bien-être"
    },
  },
"post-chem-1": {
    "it": {
      slug: "acidita-olio-evo",
      title: "L'acidità dell'Olio EVO: sfatiamo i miti comuni",
      excerpt: "Spesso si confonde il sentore di 'piccante' in gola con l'acidità. Scopriamo cos'è veramente e come si misura.",
      category: "Chimica dell'olio di oliva"
    },
    "en": {
      slug: "acidity-extra-virgin-olive-oil-myths",
      title: "Acidity in Extra Virgin Olive Oil: Debunking Common Myths",
      excerpt: "People often confuse the burning sensation in the throat with acidity. Let's discover what acidity really is and how it is measured.",
      category: "Olive Oil Chemistry"
    },
    "de": {
      slug: "saeuregehalt-olivenoel-extra-mythen",
      title: "Der Säuregehalt von Olivenöl Extra: Häufige Mythen entkräftet",
      excerpt: "Oft wird das Kratzen im Hals mit dem Säuregehalt verwechselt. Wir erklären, was Säuregehalt wirklich bedeutet und wie er gemessen wird.",
      category: "Olivenölchemie"
    },
    "nl": {
      slug: "zuurgraad-extra-vierge-olijfolie-mythen",
      title: "De zuurgraad van extra vierge olijfolie: veelvoorkomende mythen ontkracht",
      excerpt: "Men verwisselt de prikkelende smaak in de keel vaak met de zuurgraad. Ontdek wat het werkelijk is en hoe het wordt gemeten.",
      category: "Olijfoliechemie"
    },
    "da": {
      slug: "syreindhold-ekstra-jomfruolivenolie-myter",
      title: "Syreindholdet i ekstra jomfruolivenolie: Vi afliver de almindelige myter",
      excerpt: "Man forveksler ofte den kildrende fornemmelse i halsen med syreindholdet. Lad os se, hvad det egentlig er, og hvordan det måles.",
      category: "Olivenoliekemi"
    },
    "no": {
      slug: "syreinnhold-ekstra-jomfruolivenolje-myter",
      title: "Syreinnholdet i ekstra jomfruolivenolje: Vi avliver vanlige myter",
      excerpt: "Mante forveksler den kildrende følelsen i halsen med syreinnholdet. La oss oppdage hva det egentlig er og hvordan det måles.",
      category: "Olivenoljekjemi"
    },
  
    "es": {
      slug: "acidez-en-el-aceite-de-oliva-virgen-extra-desmitificando-mitos-comunes",
      title: "Acidez en el Aceite de Oliva Virgen Extra: Desmitificando Mitos Comunes",
      excerpt: "A menudo se confunde la sensación de ardor en la garganta con la acidez. Descubramos qué es realmente la acidez y cómo se mide.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "l-acidite-dans-l-huile-d-olive-extra-vierge-demystifier-les-croyances-communes",
      title: "L'acidité dans l'huile d'olive extra vierge : démystifier les croyances communes",
      excerpt: "On confond souvent la sensation de brûlure dans la gorge avec l'acidité. Découvrons ce qu'est réellement l'acidité et comment elle est mesurée.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
"post-chem-2": {
    "it": {
      slug: "polifenoli-e-perossidi",
      title: "Polifenoli e Perossidi: come decifrare le analisi dell'olio",
      excerpt: "Impariamo a leggere insieme il referto chimico di un Olio Extravergine: cosa indicano i valori di perossidi e polifenoli.",
      category: "Chimica dell'olio di oliva"
    },
    "en": {
      slug: "polyphenols-peroxides-deciphering-olive-oil-analyses",
      title: "Polyphenols and Peroxides: How to Decipher Olive Oil Analyses",
      excerpt: "Let's learn how to read the lab report for extra virgin olive oil and what peroxide and polyphenol values really mean.",
      category: "Olive Oil Chemistry"
    },
    "de": {
      slug: "polyphenole-peroxide-olivenoel-analysen-verstehen",
      title: "Polyphenole und Peroxide: Wie man Olivenöl-Analysen entziffert",
      excerpt: "Wir lernen gemeinsam, den chemischen Bericht eines Olivenöls Extra zu lesen: Was sagen Peroxid- und Polyphenolwerte aus?",
      category: "Olivenölchemie"
    },
    "nl": {
      slug: "polifenolen-peroxiden-olijfolie-analyse-lezen",
      title: "Polifenolen en peroxiden: hoe je olijfolie-analyses ontcijfert",
      excerpt: "Leer samen met ons het chemische rapport van een extra vierge olijfolie te lezen: wat betekenen de waarden voor peroxiden en polifenolen?",
      category: "Olijfoliechemie"
    },
    "da": {
      slug: "polyfenoler-peroxider-forstaa-olivenolieanalyser",
      title: "Polyfenoler og peroxider: Sådan tyder du olivenolieanalyser",
      excerpt: "Lad os lære at læse den kemiske rapport for en ekstra jomfruolivenolie: Hvad betyder værdierne for peroxider og polyfenoler.",
      category: "Olivenoliekemi"
    },
    "no": {
      slug: "polyfenoler-peroksider-forstaa-olivenoljeanalyser",
      title: "Polyfenoler og peroksider: Slik tyder du olivenoljeanalyser",
      excerpt: "La oss lære å lese den kjemiske rapporten for en ekstra jomfruolivenolje: Hva betyr verdiene for peroksider og polyfenoler.",
      category: "Olivenoljekjemi"
    },
  
    "es": {
      slug: "polifenoles-y-peroxidos-como-descifrar-los-analisis-del-aceite-de-oliva",
      title: "Polifenoles y peróxidos: cómo descifrar los análisis del aceite de oliva",
      excerpt: "Aprendamos a leer el informe de laboratorio del aceite de oliva virgen extra y lo que realmente significan los valores de peróxidos y polifenoles.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "polyphenols-et-peroxydes-comment-decrypter-les-analyses-de-lhuile-dolive",
      title: "Polyphénols et peroxydes : comment décrypter les analyses de l'huile d'olive",
      excerpt: "Apprenons à lire le rapport d'analyse en laboratoire de l'huile d'olive vierge extra et ce que signifient réellement les valeurs de peroxydes et de polyphénols.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
"post-buy-2": {
    "it": {
      slug: "supermercato-vs-frantoio",
      title: "Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale",
      excerpt: "Perché sugli scaffali troviamo olio EVO a 5€ quando al frantoio ne costa più del doppio? Facciamo i conti senza filtri e scopriamo cosa beviamo davvero.",
      category: "Consigli di acquisto"
    },
    "en": {
      slug: "supermarket-vs-olive-mill-price-artisanal-olive-oil",
      title: "Supermarket vs. Olive Mill: The Truth Behind Artisanal Olive Oil Prices",
      excerpt: "Why do we find EVOO for €5 on shelves when it costs more than double at the mill? Let's look at the real numbers and find out what we are really buying.",
      category: "Buying Guide"
    },
    "de": {
      slug: "supermarkt-vs-oelmuehle-preis-handwerkliches-olivenoel",
      title: "Supermarkt oder Ölmühle? Die Wahrheit über den Preis von handwerklichem Olivenöl",
      excerpt: "Warum gibt es Olivenöl im Supermarkt für 5 €, während es in der Ölmühle das Doppelt kostet? Rechnen wir schonungslos ab und entdecken, was wir wirklich konsumieren.",
      category: "Einkaufsführer"
    },
    "nl": {
      slug: "supermarkt-vs-olijfmolen-prijs-ambachtelijke-olijfolie",
      title: "Supermarkt of rechtstreeks van de molen? De waarheid over de prijs van ambachtelijke olijfolie",
      excerpt: "Waarom vinden we extra vierge olijfolie voor €5 in de schappen als het bij de molen meer dan het dubbele kost? We rekenen het zonder filters uit.",
      category: "Koopgids"
    },
    "da": {
      slug: "supermarked-vs-oliemoelle-prisen-paa-haandvaerksolivenolie",
      title: "Supermarked eller direkte fra møllen? Sandheden om prisen på håndværksolivenolie",
      excerpt: "Hvorfor finder vi ekstra jomfruolivenolie til 5 € på hylderne, når det koster mere end det dobbelte på møllen? Lad os regne det ud uden filtre.",
      category: "Købsguide"
    },
    "no": {
      slug: "supermarked-vs-oljemolle-prisen-paa-haandverksolivenolje",
      title: "Supermarked eller direkte fra møllen? Sannheten om prisen på håndverksolivenolje",
      excerpt: "Hvorfor finner vi ekstra jomfruolivenolje til 5 € i hyllene når det koster mer enn det dobbelte hos møllen? La oss regne det ut uten filtre.",
      category: "Kjøpsguide"
    },
  
    "es": {
      slug: "supermercado-vs-almazara-la-verdad-detras-del-precio-del-aceite-de-oliva-artesanal",
      title: "Supermercado vs. Almazara: La verdad detrás del precio del aceite de oliva artesanal",
      excerpt: "¿Por qué encontramos AOVE a 5 € en las estanterías cuando en la almazara cuesta más del doble? Analicemos las cifras reales y descubramos qué estamos comprando de verdad.",
      category: "Guía de Compra"
    },
    "fr": {
      slug: "supermarche-vs-moulin-la-verite-derriere-le-prix-de-l-huile-d-olive-artisanale",
      title: "Supermarché vs. Moulin : La vérité derrière le prix de l'huile d'olive artisanale",
      excerpt: "Pourquoi trouve-t-on de l'HOVE à 5 € en rayon alors qu'elle coûte plus du double au moulin ? Regardons les vrais chiffres et découvrons ce que nous achetons réellement.",
      category: "Guide d'Achat"
    },
  },
"post-store-1": {
    "it": {
      slug: "quanto-dura-olio-evo",
      title: "Quanto dura un Olio EVO e come conservarlo al meglio",
      excerpt: "L'olio extravergine non scade nel senso classico, ma invecchia. Impariamo a leggere la data di scadenza e a difenderlo da luce e calore.",
      category: "Conservazione"
    },
    "en": {
      slug: "how-long-does-extra-virgin-olive-oil-last-storage",
      title: "How Long Does Extra Virgin Olive Oil Last, and How to Store It",
      excerpt: "Olive oil doesn't spoil like milk, but it does age. Learn to read best-by dates, why heat and light are the real enemies, and tips for proper home storage.",
      category: "Storage & Preservation"
    },
    "de": {
      slug: "wie-lange-ist-olivenoel-extra-haltbar-lagerung",
      title: "Wie lange ist Olivenöl Extra haltbar, und wie lagert man es richtig",
      excerpt: "Olivenöl verdirbt nicht, aber es altert. Lernen Sie, das Mindesthaltbarkeitsdatum zu lesen, warum Licht und Hitze die wahren Feinde sind, und Tipps zur Lagerung.",
      category: "Lagerung & Aufbewahrung"
    },
    "nl": {
      slug: "hoe-lang-is-extra-vierge-olijfolie-houdbaar-bewaren",
      title: "Hoe lang is extra vierge olijfolie houdbaar, en hoe bewaar je het",
      excerpt: "Olijfolie bederft niet, maar veroudert wel. Leer de houdbaarheidsdatum te lezen, waarom licht en warmte de echte vijanden zijn, en tips voor het bewaren.",
      category: "Opslag & Bewaring"
    },
    "da": {
      slug: "hvor-laenge-holder-ekstra-jomfruolivenolie-opbevaring",
      title: "Hvor laenge holder ekstra jomfruolivenolie, og hvordan opbevares den bedst",
      excerpt: "Olivenolie bliver ikke for gammel, men den aeldes. Laer at laese mindste holdbarhedsdato, hvorfor varme og lys er de virkelige fjender, og tricks til opbevaring.",
      category: "Opbevaring"
    },
    "no": {
      slug: "hvor-lenge-holder-ekstra-jomfruolivenolje-lagring",
      title: "Hvor lenge holder ekstra jomfruolivenolje, og hvordan lagres den best",
      excerpt: "Olivenolje gaar ikke ut paa dato, men den eldes. Laer aa lese best-foer-datoen, hvorfor varme og lys er de virkelige fiendene, og tips til lagring.",
      category: "Lagring"
    },
  
    "es": {
      slug: "cuanto-dura-el-aceite-de-oliva-virgen-extra-y-como-conservarlo",
      title: "¿Cuánto dura el aceite de oliva virgen extra y cómo conservarlo?",
      excerpt: "El aceite de oliva no se echa a perder como la leche, pero sí envejece. Aprende a leer las fechas de consumo preferente, por qué el calor y la luz son los verdaderos enemigos y consejos para su conservación en casa.",
      category: "Conservación"
    },
    "fr": {
      slug: "combien-de-temps-se-conserve-l-huile-d-olive-vierge-extra-et-comment-la-conserver",
      title: "Combien de temps se conserve l'huile d'olive vierge extra et comment la conserver",
      excerpt: "L'huile d'olive ne tourne pas comme le lait, mais elle vieillit. Apprenez à lire les dates de durabilité minimale, découvrez pourquoi la chaleur et la lumière sont ses pires ennemies, et comment bien la conserver chez soi.",
      category: "Stockage et conservation"
    },
  },
"post-store-2": {
    "it": {
      slug: "bottiglia-scura-o-latta",
      title: "Lattina o bottiglia scura? Quale conserva meglio l'olio EVO",
      excerpt: "Sembrano solo contenitori, ma la scelta tra lattina e bottiglia di vetro incide concretamente su quanto a lungo il vostro olio mantiene qualità e polifenoli. Vediamo perché.",
      category: "Conservazione"
    },
    "en": {
      slug: "dark-glass-bottle-vs-tin-can-olive-oil-storage",
      title: "Dark Glass Bottle or Tin Can? Which Stores Extra Virgin Olive Oil Better",
      excerpt: "They might seem like just containers, but the choice between a tin can and a glass bottle directly affects how long your oil retains quality and polyphenols. Let's see why.",
      category: "Storage & Preservation"
    },
    "de": {
      slug: "dunkle-glasflasche-oder-blechdose-olivenoel-lagerung",
      title: "Dunkle Glasflasche oder Blechdose? Was natives Olivenöl Extra besser schützt",
      excerpt: "Sie scheinen nur Behälter zu sein, aber die Wahl zwischen einer Blechdose und einer Glasflasche hat direkten Einfluss darauf, wie lange Ihr Öl Qualität und Polyphenole behält. Sehen wir uns an, warum.",
      category: "Lagerung & Aufbewahrung"
    },
    "nl": {
      slug: "donker-glas-fles-of-blik-olijfolie-bewaren",
      title: "Donkere glazen fles of blik? Wat bewaart extra vierge olijfolie beter",
      excerpt: "Het lijken misschien gewoon containers, maar de keuze tussen een blik en een glazen fles heeft direct invloed op hoe lang uw olie zijn kwaliteit en polyfenolen behoudt. Laten we kijken waarom.",
      category: "Opslag & Bewaring"
    },
    "da": {
      slug: "moerk-glasflaske-eller-dunk-hvad-bevarer-olivenolien-bedst",
      title: "Mørk glasflaske eller dunk? Hvad bevarer ekstra jomfruolivenolie bedst",
      excerpt: "Det virker måske bare som beholdere, men valget mellem dunk og glasflaske påvirker direkte, hvor længe din olie bevarer kvalitet og polyfenoler. Lad os se hvorfor.",
      category: "Opbevaring"
    },
    "no": {
      slug: "moerk-glassflaske-eller-blikkboks-hva-bevarer-olivenoljen-best",
      title: "Mørk glassflaske eller blikkboks? Hva bevarer ekstra jomfruolivenolje best",
      excerpt: "Det virker kanskje bare som beholdere, men valget mellom blikkboks og glassflaske påvirker direkte hvor lenge oljen din bevarer kvalitet og polyfenoler. La oss se hvorfor.",
      category: "Lagring"
    }
  ,
    "es": {
      slug: "botella-de-vidrio-oscuro-o-lata-cual-conserva-mejor-el-aceite-de-oliva-virgen-extra",
      title: "¿Botella de Vidrio Oscuro o Lata? Cuál Conserva Mejor el Aceite de Oliva Virgen Extra",
      excerpt: "Pueden parecer simples envases, pero la elección entre una lata y una botella de vidrio afecta directamente al tiempo que el aceite conserva su calidad y polifenoles. Veamos por qué.",
      category: "Conservación"
    },
    "fr": {
      slug: "bouteille-en-verre-fonce-ou-bidon-en-metal-quel-contenant-conserve-le-mieux-l-huile-d-olive-extra-vierge",
      title: "Bouteille en verre foncé ou bidon en métal ? Quel contenant conserve le mieux l'huile d'olive extra vierge",
      excerpt: "Ils peuvent sembler être de simples contenants, mais le choix entre un bidon en métal et une bouteille en verre affecte directement la durée pendant laquelle votre huile conserve sa qualité et ses polyphénols. Voyons pourquoi.",
      category: "Stockage et conservation"
    },
  },
"post-use-1": {
    "it": {
      slug: "friggere-con-olio-evo",
      title: "Friggere con l'olio extravergine: falso mito o realtà culinaria?",
      excerpt: "Risolleviamo l'onore del fritto con olio EVO smontando alcune false credenze radicate sui punti di fumo.",
      category: "Consumo corretto"
    },
    "en": {
      slug: "frying-with-extra-virgin-olive-oil-myth-or-reality",
      title: "Frying with Extra Virgin Olive Oil: Myth or Culinary Reality?",
      excerpt: "Let's restore the honor of frying with EVOO by debunking deeply rooted myths about smoke points.",
      category: "Proper Usage"
    },
    "de": {
      slug: "frittieren-mit-olivenoel-extra-mythos-oder-realitaet",
      title: "Frittieren mit nativem Olivenöl Extra: Mythos oder kulinarische Realität?",
      excerpt: "Wir stellen die Ehre des Frittierens mit Olivenöl Extra wieder her, indem wir gegen hartnäckige Mythen über den Rauchpunkt vorgehen.",
      category: "Richtiges Genießen"
    },
    "nl": {
      slug: "frituren-met-extra-vierge-olijfolie-mythe-of-realiteit",
      title: "Frituren met extra vierge olijfolie: mythe of culinaire realiteit?",
      excerpt: "We herstellen de eer van gefrituurd eten met extra vierge olijfolie door hardnekkige mythen over het rookpunt te ontkrachten.",
      category: "Correct Gebruik"
    },
    "da": {
      slug: "friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag",
      title: "Friturestegning med ekstra jomfruolivenolie: Myte eller kulinarisk virkelighed?",
      excerpt: "Vi genopretter æren for friturestegt mad med ekstra jomfruolivenolie by aflive nogle dybt forankrede myter om røgpunkter.",
      category: "Korrekt Forbrug"
    },
    "no": {
      slug: "fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet",
      title: "Fritering med ekstra jomfruolivenolje: Myte eller kulinarisk virkelighet?",
      excerpt: "Vi gjenreiser æren for fritert mat med ekstra jomfruolivenolje ved av avlive noen dypt forankrede myter om røykpunkter.",
      category: "Riktig Bruk"
    }
  ,
    "es": {
      slug: "freir-con-aceite-de-oliva-virgen-extra-mito-o-realidad-culinaria",
      title: "¿Freír con aceite de oliva virgen extra: mito o realidad culinaria?",
      excerpt: "Restauremos el honor de freír con AOVE desmitificando creencias arraigadas sobre el punto de humo.",
      category: "Uso correcto"
    },
    "fr": {
      slug: "frire-a-l-huile-d-olive-extra-vierge-mythe-ou-realite-culinaire",
      title: "Frire à l'huile d'olive extra vierge : mythe ou réalité culinaire ?",
      excerpt: "Restaurons l'honneur de la friture à l'huile d'olive extra vierge en démystifiant les croyances ancrées sur le point de fumée.",
      category: "Utilisation correcte"
    },
  },
  "post-use-2": {
    "it": {
      slug: "esaltare-olio-nuovo-crudo",
      title: "Olio nuovo d'annata: come esaltarlo nei piatti a crudo",
      excerpt: "Esiste una sola regola inconfutabile quando l'Olio è novello, verde smeraldo e ricchissimo di polifenoli: niente fiamme!",
      category: "Consumo corretto",
    },
    "en": {
      slug: "how-to-enjoy-fresh-new-season-olive-oil-raw",
      title: "Fresh New Season Olive Oil: How to Best Enjoy It Raw",
      excerpt: "There is only one irrefutable rule when the oil is fresh, emerald green, and rich in polyphenols: keep it away from heat!",
      category: "Proper Usage",
    },
    "de": {
      slug: "frisches-olivenoel-jahrgang-roh-geniessen",
      title: "Frisches Olivenöl des Jahrgangs: Wie man es am besten roh genießt",
      excerpt: "Es gibt nur eine unumstößliche Regel, wenn das Öl frisch, smaragdgrün und extrem reich an Polyphenolen ist: Keine Hitze!",
      category: "Richtiges Genießen",
    },
    "nl": {
      slug: "verse-nieuwe-olijfolie-rauw-gebruiken",
      title: "Verse nieuwe olijfolie: hoe je deze het beste rauw gebruikt",
      excerpt: "Er is slechts één onomstotelijke regel wanneer de olijfolie vers, smaragdgroen en rijk aan polifenolen is: geen vuur!",
      category: "Correct Gebruik",
    },
    "da": {
      slug: "frisk-ny-sæson-olivenolie-nyd-den-raa",
      title: "Frisk ny sæson olivenolie: Sådan fremhæver du den rå",
      excerpt: "Der er kun én uomtvistelig regel, når olivenolien er helt frisk, smaragdgrøn og fyldt med polyfenoler: ingen varme!",
      category: "Korrekt Forbrug",
    },
    "no": {
      slug: "frisk-ny-sesong-olivenolje-nyt-den-raa",
      title: "Frisk ny sesong olivenolje: Hvordan best nyte den rå",
      excerpt: "Det er bare én ubestridelig regel når oljen er fersk, smaragdgrønn og rik på polyfenoler: hold den unna varme!",
      category: "Riktig Bruk",
    },
  
    "es": {
      slug: "aceite-nuevo-de-campana-como-disfrutarlo-mejor-en-crudo",
      title: "Aceite nuevo de campaña: cómo disfrutarlo mejor en crudo",
      excerpt: "Solo existe una regla irrefutable cuando el aceite es nuevo, verde esmeralda y rico en polifenoles: ¡mantenerlo alejado del calor!",
      category: "Uso correcto"
    },
    "fr": {
      slug: "huile-d-olive-nouvelle-de-l-annee-comment-la-deguster-au-mieux-a-cru",
      title: "Huile d'olive nouvelle de l'année : comment la déguster au mieux à cru",
      excerpt: "Il n'existe qu'une seule règle irréfutable lorsque l'huile est nouvelle, vert émeraude et riche en polyphénols : tenez-la éloignée de la chaleur !",
      category: "Utilisation correcte"
    },
  },
    "ric-1": {
    "it": {
      slug: "miglior-olio-bruschetta",
      title: "Miglior olio per la bruschetta: 3 profili e come scegliere",
      excerpt: "La bruschetta sembra semplice ma l'olio fa tutta la differenza. Ecco i tre profili aromatici da abbinare e la tecnica per un risultato perfetto.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "best-olive-oil-for-bruschetta",
      title: "Best Olive Oil for Bruschetta: 3 Profiles and How to Choose",
      excerpt: "Bruschetta seems simple, but the olive oil makes all the difference. Here are the three flavor profiles to pair and the technique for a perfect result.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "beste-olivenoel-fuer-bruschetta",
      title: "Bestes Olivenöl für Bruschetta: 3 Profile und wie man wählt",
      excerpt: "Bruschetta scheint einfach zu sein, aber das Olivenöl macht den Unterschied. Hier sind die drei Aromenprofile zum Kombinieren und die Technik für ein perfektes Ergebnis.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "beste-olijfolie-voor-bruschetta",
      title: "Beste olijfolie voor bruschetta: 3 profielen en hoe te kiezen",
      excerpt: "Bruschetta lijkt eenvoudig, maar de olijfolie maakt het verschil. Hier zijn de drie smaakprofielen om te combineren en de techniek voor een perfect resultaat.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "bedste-olivenolie-til-bruschetta",
      title: "Bedste olivenolie til bruschetta: 3 profiler og hvordan du vælger",
      excerpt: "Bruschetta virker måske simpelt, men olivenolien gør hele forskellen. Her er de tre smagsprofiler, der passer til, og teknikken til et perfekt resultat.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "beste-olivenolje-til-bruschetta",
      title: "Beste olivenolje til bruschetta: 3 profiler og hvordan du velger",
      excerpt: "Bruschetta virker kanskje enkelt, men olivenoljen gjør hele forskjellen. Her er de tre smaksprofilene som passer til, og teknikken for et perfekt resultat.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "el-mejor-aceite-de-oliva-para-bruschetta-3-perfiles-y-como-elegir",
      title: "El mejor aceite de oliva para bruschetta: 3 perfiles y cómo elegir",
      excerpt: "La bruschetta parece simple, pero el aceite de oliva marca la diferencia. Aquí tienes los tres perfiles de sabor para maridar y la técnica para un resultado perfecto.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "meilleure-huile-dolive-pour-bruschetta-3-profils-et-comment-choisir",
      title: "Meilleure huile d'olive pour bruschetta : 3 profils et comment choisir",
      excerpt: "La bruschetta semble simple, mais l'huile d'olive fait toute la différence. Voici les trois profils de saveurs à associer et la technique pour un résultat parfait.",
      category: "Recettes et Accords"
    },
  },
  "ric-2": {
    "it": {
      slug: "olio-per-insalata",
      title: "Miglior olio per l'insalata: emulsione, sale e il giusto profilo",
      excerpt: "Fare un buon dressing con l'olio EVO non è banale. Dalla scelta del profilo all'emulsione con aceto o limone: piccola guida completa.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "best-olive-oil-for-salad-dressing",
      title: "Best Olive Oil for Salad Dressing: Emulsion, Salt, and the Right Profile",
      excerpt: "Making a good dressing with EVOO is not trivial. From choosing the profile to emulsifying with vinegar or lemon: a short but complete guide.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "bestes-olivenoel-fuer-salatdressing",
      title: "Bestes Olivenöl für Salatdressing: Emulsion, Salz und das richtige Profil",
      excerpt: "Ein gutes Dressing mit Olivenöl Extra herzustellen ist nicht trivial. Von der Wahl des Profils bis zur Emulsion mit Essig oder Zitrone: Ein kleiner, kompletter Leitfaden.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "beste-olijfolie-voor-salatedressing",
      title: "Beste olijfolie voor saladedressing: emulsie, zout en het juiste profiel",
      excerpt: "Een goede dressing maken met extra vierge olijfolie is niet zomaar wat. Van het kiezen van het profiel tot het emulgeren met azijn of citroen: een kleine complete gids.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "bedste-olivenolie-til-salatdressing",
      title: "Bedste olivenolie til salatdressing: Emulsion, salt og den rette profil",
      excerpt: "At lave en god dressing med ekstra jomfruolivenolie er ikke så ligetil, som man tror. Fra valg af profil til emulsion med eddike eller citron: en lille, komplet guide.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "beste-olivenolje-til-salatdressing",
      title: "Beste olivenolje til salatdressing: Emulsjon, salt og den rette profilen",
      excerpt: "Å lage en god dressing med ekstra jomfruolivenolje er ikke så rett frem som man tror. Fra valg av profil til emulsjon med eddik eller sitron: en liten, komplett guide.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "el-mejor-aceite-de-oliva-para-ensaladas-emulsion-sal-y-el-perfil-adecuado",
      title: "El mejor aceite de oliva para ensaladas: emulsión, sal y el perfil adecuado",
      excerpt: "Preparar un buen aliño con AOVE no es trivial. Desde la elección del perfil hasta la emulsión con vinagre o limón: una guía breve pero completa.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "meilleure-huile-dolive-pour-la-salade-emulsion-sel-et-bon-profil",
      title: "Meilleure huile d'olive pour la salade : émulsion, sel et bon profil",
      excerpt: "Préparer une bonne vinaigrette avec de l'HOVE n'est pas trivial. Du choix du profil à l'émulsion avec du vinaigre ou du citron : un guide court mais complet.",
      category: "Recettes et Accords"
    },
  },
  "ric-3": {
    "it": {
      slug: "olio-per-pasta-aglio-olio",
      title: "Olio per la pasta aglio e olio: quale profilo aromatico scegliere",
      excerpt: "Aglio, olio e peperoncino — tre ingredienti, zero margine di errore. La qualità dell'olio in questo piatto è tutto. Ecco come sceglierlo e la tecnica corretta.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "best-olive-oil-for-garlic-oil-pasta",
      title: "Olive Oil for Garlic and Oil Pasta: Which Flavor Profile to Choose",
      excerpt: "Garlic, oil, and chili—three ingredients, zero margin for error. The quality of the oil in this dish is everything. Here is how to choose it and the correct technique.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "olivenoel-fuer-spaghetti-aglio-olio",
      title: "Das beste Olivenöl für Spaghetti Aglio e Olio: Welches Profil passt",
      excerpt: "Knoblauch, Öl und Chili – drei Zutaten, kein Raum für Fehler. Die Ölqualität ist in diesem Gericht alles. So gelingt die perfekte Zubereitung.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "olijfolie-voor-pasta-aglio-olio",
      title: "Olijfolie voor pasta aglio e olio: welk smaakprofiel te kiezen",
      excerpt: "Knoflook, olie en chilipeper — drie ingrediënten, nul foutmarges. De kwaliteit van de olijfolie in dit gerecht is alles. Zo kies je het en pas je de techniek toe.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "olivenolie-til-pasta-aglio-olio",
      title: "Olivenolie til pasta aglio e olio: Hvilken aromatisk profil skal man vælge",
      excerpt: "Hvidløg, olie og chili — tre ingredienser, ingen fejlmargen. Oliekvaliteten i denne ret er alt. Her er valget og den rigtige teknik.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "olivenolje-til-pasta-aglio-olio",
      title: "Olivenolje til pasta aglio e olio: Hvilken aromatisk profil bør man velge",
      excerpt: "Hvitløk, olje og chili — tre ingredienser, ingen feilmargin. Oljekvaliteten i denne retten er alt. Slik velger du riktig og bruker riktig teknikk.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "aceite-de-oliva-para-pasta-de-ajo-y-aceite-que-perfil-de-sabor-elegir",
      title: "Aceite de oliva para pasta de ajo y aceite: qué perfil de sabor elegir",
      excerpt: "Ajo, aceite y guindilla: tres ingredientes, cero margen de error. La calidad del aceite en este plato lo es todo. Te contamos cómo elegirlo y la técnica correcta.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "huile-dolive-pour-pates-ail-et-huile-quel-profil-aromatique-choisir",
      title: "Huile d'olive pour pâtes ail et huile : quel profil aromatique choisir",
      excerpt: "Ail, huile et piment — trois ingrédients, aucune marge d'erreur. La qualité de l'huile dans ce plat fait tout. Voici comment la choisir et la bonne technique.",
      category: "Recettes et Accords"
    },
  },
  "ric-4": {
    "it": {
      slug: "olio-per-legumi-zuppe",
      title: "Olio per legumi e zuppe: quale funziona meglio e come usarlo",
      excerpt: "Il filo di olio sulla zuppa di lenticchie è un gesto antico e sapientissimo. Ma non tutti gli oli sono uguali su legumi, ribollita e minestrone.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "best-olive-oil-for-soups-legumes",
      title: "Olive Oil for Legumes and Soups: Which Works Best and How to Use It",
      excerpt: "A drizzle of olive oil on lentil soup is an ancient and wise tradition. But not all oils are equal when it comes to beans, ribollita, and minestrone.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "olivenoel-fuer-suppen-und-eintoepfe",
      title: "Olivenöl für Hülsenfrüchte und Suppen: Welches passt und wie man es nutzt",
      excerpt: "Ein Faden Olivenöl auf der Linsensuppe ist ein uralter Küchentrick. Doch nicht jedes Öl schmeckt gleich gut auf Bohnen, Ribollita und Minestrone.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "olijfolie-voor-soep-en-peulvruchten",
      title: "Olijfolie voor peulvruchten en soepen: welke werkt het best en hoe te gebruiken",
      excerpt: "Een scheutje olijfolie over de linzensoep is een oud en wijs gebruik. Maar niet alle olijfoliën zijn gelijk op bonen, ribollita en minestrone.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "olivenolie-til-baelgfrugter-supper",
      title: "Olivenolie til bælgfrugter og supper: Hvilken virker bedst, og hvordan bruges den",
      excerpt: "Et stænk af olivenolie på linsesuppen er en gammel og klog tradition. Men ikke alle olier er ens på bønner, ribollita og minestrone.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "olivenolje-til-belgfrukter-supper",
      title: "Olivenolje til belgfrukter og supper: Hvilken fungerer best og hvordan brukes den",
      excerpt: "En stråle olivenolje over linsesuppen er en eldgammel og klok tradisjon. Men ikke alle oljer er luke på bønner, ribollita og minestrone.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "aceite-de-oliva-para-legumbres-y-sopas-cual-funciona-mejor-y-como-usarlo",
      title: "Aceite de oliva para legumbres y sopas: cuál funciona mejor y cómo usarlo",
      excerpt: "Un hilo de aceite de oliva sobre una sopa de lentejas es una tradición antigua y sabia. Pero no todos los aceites son iguales cuando se trata de alubias, ribollita y minestrone.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "huile-dolive-pour-legumes-et-soupes-laquelle-choisir-et-comment-lutiliser",
      title: "Huile d'olive pour légumes et soupes : laquelle choisir et comment l'utiliser",
      excerpt: "Un filet d'huile d'olive sur une soupe de lentilles est une tradition ancienne et sage. Mais toutes les huiles ne se valent pas lorsqu'il s'agit de haricots, de ribollita et de minestrone.",
      category: "Recettes et Accords"
    },
  },
  "ric-5": {
    "it": {
      slug: "pane-e-olio-degustazione-ospiti",
      title: "Pane e olio: mini guida degustazione per ospiti (e box assaggio)",
      excerpt: "Portare in tavola pane e olio è un atto di calda ospitalità. Trasformiamolo in un piccolo gioco di degustazione per guidare i tuoi ospiti a distinguere i profili.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "bread-and-olive-oil-tasting-guide-guests",
      title: "Bread and Olive Oil: A Mini Tasting Guide for Guests (and Tasting Box)",
      excerpt: "Serving bread and olive oil is an act of warm hospitality. Let's turn it into a fun tasting game to help your guests distinguish between flavor profiles.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "brot-und-olivenoel-verkostung-gaeste",
      title: "Brot und Olivenöl: Mini-Verkostungsleitfaden für Gäste (und Probierbox)",
      excerpt: "Brot und Olivenöl zu servieren, ist ein Zeichen herzlicher Gastfreundschaft. Machen wir ein kleines Verkostungsspiel daraus, um Ihren Gästen die Aromen zu zeigen.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "brood-en-olijfolie-proeverij-gasten",
      title: "Brood en olijfolie: mini-proeverijgids voor gasten (en proefpakket)",
      excerpt: "Brood en olijfolie serveren is een daad van warme gastvrijheid. Verander het in een klein proeverijspel om je gasten de verschillende profielen te laten herkennen.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "broed-og-olivenolie-smagningsguide-gaester",
      title: "Brød og olivenolie: Mini-smagningsguide til gæster (og smagekasse)",
      excerpt: "At servere brød og olivenolie er en varm gæstfrihed. Lad os gøre det to en lille smageleg, der hjælper dine gæster med at skelne mellem profilerne.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "broed-og-olivenolje-smaksguide-gjester",
      title: "Brød og olivenolje: En mini-smaksguide for gjester (og smaksboks)",
      excerpt: "Å servere brød og olivenolje er en handling av varm gjestfrihet. La oss gjøre det til et lite smaksspill for å hjelpe gjestene dine med å skille mellom profilene.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "pan-y-aceite-una-miniguia-de-degustacion-para-invitados-y-caja-de-degustacion",
      title: "Pan y aceite: una miniguía de degustación para invitados (y Caja de Degustación)",
      excerpt: "Servir pan y aceite de oliva es un acto de cálida hospitalidad. Conviértelo en un divertido juego de degustación para ayudar a tus invitados a distinguir los distintos perfiles de sabor.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "pain-et-huile-un-mini-guide-de-degustation-pour-les-invites-et-coffret-degustation",
      title: "Pain et huile : un mini-guide de dégustation pour les invités (et Coffret Dégustation)",
      excerpt: "Servir du pain et de l'huile d'olive est un geste d'hospitalité chaleureux. Transformez-le en un jeu de dégustation ludique pour aider vos invités à distinguer les profils aromatiques.",
      category: "Recettes et Accords"
    },
  },
  "ric-6": {
    "it": {
      slug: "olio-evo-nei-dolci",
      title: "Olio EVO nei dolci: sì, si fa — e con limone, cioccolato e aromi",
      excerpt: "Sostituire il burro con l'olio extravergine nei dolci si può ed è delizioso. Scopriamo quali dolci si prestano meglio e le proporzioni perfette.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "baking-with-extra-virgin-olive-oil-desserts",
      title: "Baking with EVOO: Yes, You Can—with Lemon, Chocolate, and Aromas",
      excerpt: "Replacing butter with extra virgin olive oil in baking is possible and delicious. Discover which desserts work best and the perfect proportions.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "backen-mit-olivenoel-extra-desserts",
      title: "Backen mit Olivenöl Extra: Ja, das geht – mit Zitrone, Schokolade und Aromen",
      excerpt: "Butter beim Backen durch Olivenöl Extra zu ersetzen, ist möglich und köstlich. Erfahren Sie, welche Kuchen sich am besten eignen und wie die Mengen aussehen.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "bakken-met-extra-vierge-olijfolie",
      title: "Bakken met extra vierge olijfolie: ja, dat kan — met citroen, chocolade en aroma's",
      excerpt: "Boter vervangen door extra vierge olijfolie in desserts kan uitstekend en is heerlijk. Ontdek welke taarten zich hier het beste voor lenen en de juiste verhoudingen.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "bagning-med-ekstra-jomfruolivenolie",
      title: "Bagning med ekstra jomfruolivenolie: Ja, du kan — med citron, chokolade og aromaer",
      excerpt: "Det er fuldt ud muligt og lækkert at erstatte smør med ekstra jomfruolivenolie i bagværk. Se, hvilke kager der egner sig bedst, og find de rette forhold.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "baking-med-ekstra-jomfruolivenolje",
      title: "Baking med ekstra jomfruolivenolje: Ja, du kan – med sitron, sjokolade og aromaer",
      excerpt: "Å erstatte smør med ekstra jomfruolivenolje i bakverk er fretent mulig og kjempegodt. Oppdag hvilke kaker som egner seg best og de perfekte forholdene.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "reposteria-con-aove-si-se-puede-con-limon-chocolate-y-aromas",
      title: "Repostería con AOVE: sí, se puede (con limón, chocolate y aromas)",
      excerpt: "Sustituir la mantequilla por aceite de oliva virgen extra en la repostería es posible y delicioso. Descubre qué postres funcionan mejor y las proporciones perfectas.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "patisserie-a-lhove-oui-cest-possible-avec-du-citron-du-chocolat-et-des-aromes",
      title: "Pâtisserie à l'HOVE : oui, c'est possible (avec du citron, du chocolat et des arômes)",
      excerpt: "Remplacer le beurre par l'huile d'olive vierge extra en pâtisserie est possible et délicieux. Découvrez quels desserts s'y prêtent le mieux et les proportions idéales.",
      category: "Recettes et Accords"
    },
  },
  "ric-7": {
    "it": {
      slug: "olio-per-pesce-crudo-carpaccio",
      title: "Olio su pesce crudo e carpaccio: quale scegliere e perché",
      excerpt: "Il pesce crudo è delicato — l'olio deve valorizzarlo senza coprirlo. Ecco il profilo giusto e la tecnica per carpacci, tartare e crudi di mare perfetti.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "olive-oil-for-raw-fish-carpaccio",
      title: "Olive Oil for Raw Fish and Carpaccio: Which to Choose and Why",
      excerpt: "Raw fish is delicate—the oil must enhance it without overpowering it. Here is the right profile and technique for perfect carpaccios, tartares, and raw seafood.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "olivenoel-fuer-rohen-fisch-und-carpaccio",
      title: "Olivenöl für rohen Fisch und Carpaccio: Welches passt und warum",
      excerpt: "Roher Fisch ist empfindlich – das Olivenöl muss ihn veredeln, ohne ihn zu dominieren. Hier ist das richtige Profil und die Technik für Carpaccio und Tatar.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "olijfolie-voor-rauwe-vis-en-carpaccio",
      title: "Olijfolie voor rauwe vis en carpaccio: welke te kiezen en waarom",
      excerpt: "Rauwe vis is delicaat — de olijfolie moet het versterken zonder het te overheersen. Dit is het juiste profiel en de techniek voor carpaccio, tartaar en zeevruchten.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "olivenolie-til-raa-fisk-og-carpaccio",
      title: "Olivenolie til rå fisk og carpaccio: Hvilken skal du vælge og hvorfor",
      excerpt: "Rå fisk er sart — olien skal fremhæve den uden at overdøve den. Her er den rigtige profil og teknik til perfekte carpaccioer, tartarer og rå skaldyr.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "olivenolje-til-raa-fisk-og-carpaccio",
      title: "Olivenolje til rå fisk og carpaccio: Hvilken bør du velge og hvorfor",
      excerpt: "Rå fisk er sart — oljen må fremheve den uten å overdøve den. Her er den riktige profilen og teknikken for perfekte carpaccioer, tartarer og rå skalldyr.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "aceite-de-oliva-para-pescado-crudo-y-carpaccio-cual-elegir-y-por-que",
      title: "Aceite de oliva para pescado crudo y carpaccio: cuál elegir y por qué",
      excerpt: "El pescado crudo es delicado: el aceite debe realzarlo sin abrumarlo. Te contamos el perfil correcto y la técnica para carpaccios, tartares y mariscos perfectos.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "huile-dolive-pour-poisson-cru-et-carpaccio-laquelle-choisir-et-pourquoi",
      title: "Huile d'olive pour poisson cru et carpaccio : laquelle choisir et pourquoi",
      excerpt: "Le poisson cru est délicat — l'huile doit le sublimer sans le masquer. Voici le bon profil et la bonne technique pour des carpaccios, tartares et fruits de mer parfaits.",
      category: "Recettes et Accords"
    },
  },
  "ric-8": {
    "it": {
      slug: "olio-per-carne-grigliata",
      title: "Olio per carne alla griglia: fruttato intenso e il perché del contrasto",
      excerpt: "La bistecca alla griglia con un filo di olio EVO fruttato intenso è un'esperienza sensoriale potente. Il contrasto tra grasso animale e amaro vegetale è magistrale.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "olive-oil-for-grilled-meat-intense-fruity",
      title: "Olive Oil for Grilled Meat: Intense Fruity and the Reason Behind the Contrast",
      excerpt: "Grilled steak with a drizzle of intense fruity EVOO is a powerful sensory experience. The contrast between animal fat and vegetable bitterness is masterful.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "olivenoel-fuer-gegrilltes-fleisch-intensiv-fruchtig",
      title: "Olivenöl für gegrilltes Fleisch: Intensiv fruchtig und der Grund für den Kontrast",
      excerpt: "Gegrilltes Steak mit einem Faden intensiv fruchtigem Olivenöl ist ein kraftvolles Erlebnis. Der Kontrast zwischen tierischem Fett und pflanzlicher Bitterkeit ist genial.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "olijfolie-voor-gegrild-vlees-intensief-fruitig",
      title: "Olijfolie voor gegrild vlees: intensief fruitig en het geheim van het contrast",
      excerpt: "Gegrilde biefstuk met een scheutje intensief fruitige extra vierge olijfolie is een krachtige zintuiglijke ervaring. Het contrast tussen dierlijk vet en plantaardige bitterheid is magistraal.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "olivenolie-til-grillet-koed-intens-frugtighed",
      title: "Olivenolie til grillet kød: Intens frugtighed og hemmeligheden bag kontrasten",
      excerpt: "Grillet steak med et stænk af intens frugtig ekstra jomfruolivenolie is en kraftfuld oplevelse. Kontrasten mellem animalsk fedt og vegetabilsk bitterhed er genial.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "olivenolje-til-grillet-kjoett-intens-fruktighet",
      title: "Olivenolje til grillet kjøtt: Intens fruktighet og hemmeligheten bak kontrasten",
      excerpt: "Grillet biff med en stråle intens fruktig ekstra jomfruolivenolje er en kraftfull opplevelse. Kontrasten mellom animalsk fett og vegetabilsk bitterhet er mesterlig.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "aceite-de-oliva-para-carne-a-la-parrilla-frutado-intenso-y-el-porque-del-contraste",
      title: "Aceite de oliva para carne a la parrilla: frutado intenso y el porqué del contraste",
      excerpt: "El filete a la parrilla con un chorrito de AOVE frutado intenso es una potente experiencia sensorial. El contraste entre la grasa animal y el amargor vegetal es magistral.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "huile-dolive-pour-viande-grillee-le-fruite-intense-et-la-raison-du-contraste",
      title: "Huile d'olive pour viande grillée : le fruité intense et la raison du contraste",
      excerpt: "Une viande grillée avec un filet d'HOVE au fruité intense es une expérience sensorielle puissante. Le contraste entre le gras animal et l'amertume végétale est magistral.",
      category: "Recettes et Accords"
    },
  },
  "ric-9": {
    "it": {
      slug: "olio-per-pizza",
      title: "Olio per pizza: a crudo o in uscita? Quale profilo e quando aggiungerlo",
      excerpt: "L'olio sulla pizza è un gesto quasi automatico — ma quanti si chiedono quale olio usare, quando aggiungerlo e perché? Piccola guida per pizzaioli casalinghi.",
      category: "Ricette e abbinamenti",
    },
    "en": {
      slug: "olive-oil-for-pizza-raw-or-after-baking",
      title: "Olive Oil for Pizza: Raw or After Baking? Which Profile and When to Add It",
      excerpt: "Drizzling olive oil on pizza is almost automatic—but how many ask which oil to use, when to add it, and why? A quick guide for home pizza makers.",
      category: "Recipes & Pairings",
    },
    "de": {
      slug: "olivenoel-fuer-pizza-roh-oder-nach-dem-backen",
      title: "Olivenöl für Pizza: Roh oder erst nach dem Backen? Welches Profil und wann",
      excerpt: "Olivenöl auf der Pizza ist fast schon ein Reflex. Aber welches Öl passt, wann kommt es drauf und warum? Ein kleiner Leitfaden für Hobby-Pizzabäcker.",
      category: "Rezepte & Kombinationen",
    },
    "nl": {
      slug: "olijfolie-voor-pizza-rauw-of-na-het-bakken",
      title: "Olijfolie voor pizza: rauw of na het bakken? Welk profiel en wanneer toe te voegen",
      excerpt: "Olijfolie over de pizza is bijna een automatisme — maar wie vraagt zich af welke olie te gebruiken, wanneer toe te voegen en waarom? Korte gids voor thuisbakkers.",
      category: "Recepten & Combinaties",
    },
    "da": {
      slug: "olivenolie-til-pizza-raa-eller-efter-bagning",
      title: "Olivenolie til pizza: Rå eller efter bagning? Hvilken profil og hvornår",
      excerpt: "Olivenolie på pizza er næsten automatisk — men hvor mange tænker over, hvilken olie man skal bruge, hvornår den skal på og hvorfor? Mini-guide til hjemmebagere.",
      category: "Opskrifter & Parringer",
    },
    "no": {
      slug: "olivenolje-til-pizza-raa-eller-etter-steking",
      title: "Olivenolje til pizza: Rå eller etter steking? Hvilken profil og når",
      excerpt: "Olivenolje på pizza er nesten automatisk – men hvor mange tenker over hvilken olje man skal bruke, når den skal på og hvorfor? En liten guide for hjemmebaking.",
      category: "Oppskrifter & Parringer",
    },
  
    "es": {
      slug: "aceite-de-oliva-para-pizza-en-crudo-o-al-horno-que-perfil-y-cuando-anadirlo",
      title: "Aceite de oliva para pizza: ¿en crudo o al horno? Qué perfil y cuándo añadirlo",
      excerpt: "Verter un hilo de aceite de oliva en la pizza es casi automático, pero ¿cuántos se preguntan qué aceite usar, cuándo añadirlo y por qué? Una guía rápida para pizzeros caseros.",
      category: "Recetas y Maridajes"
    },
    "fr": {
      slug: "huile-dolive-pour-pizza-crue-ou-au-four-quel-profil-et-quand-lajouter",
      title: "Huile d'olive pour pizza : crue ou au four ? Quel profil et quand l'ajouter",
      excerpt: "Verser un filet d'huile d'olive sur une pizza est presque un réflexe — mais combien se demandent quelle huile utiliser, quand l'ajouter et pourquoi ? Un guide rapide pour les pizzaïolos maison.",
      category: "Recettes et Accords"
    },
  },
  "com-2": {
    "it": {
      slug: "fruttato-leggero-abbinamenti",
      title: "Abbinamenti con EVO fruttato leggero",
      excerpt: "L'olio fruttato leggero è il compagno perfetto per le ricette più delicate. Scopri come usarlo per non coprire i sapori e stupire tutti a tavola.",
      category: "Consigli di acquisto",
    },
    "en": {
      slug: "light-fruity-olive-oil-pairings",
      title: "Light Fruity Olive Oil Pairings",
      excerpt: "Light fruity olive oil is the perfect companion for the most delicate recipes. Discover how to use it without masking flavors.",
      category: "Buying Guide",
    },
    "de": {
      slug: "leicht-fruchtiges-olivenoel-kombinationen",
      title: "Kombinationen mit leicht fruchtigem Olivenöl Extra",
      excerpt: "Leicht fruchtiges Olivenöl ist der perfekte Begleiter für feinste Gerichte. Erfahren Sie, wie Sie es verwenden, ohne Aromen zu verdecken.",
      category: "Einkaufsführer",
    },
    "nl": {
      slug: "licht-fruitige-olijfolie-combinaties",
      title: "Combinaties met licht fruitige extra vierge olijfolie",
      excerpt: "Licht fruitige olijfolie is de perfecte partner voor de meest delicate recepten. Ontdek hoe je het gebruikt zonder smaken te overheersen.",
      category: "Koopgids",
    },
    "da": {
      slug: "let-frugtig-olivenolie-parringer",
      title: "Parringer med let frugtig olivenolie",
      excerpt: "Let frugtig olivenolie er den perfekte ledsager til de mest delikate opskrifter. Se, hvordan du bruger den uden at overdøve smagen.",
      category: "Købsguide",
    },
    "no": {
      slug: "lett-fruktig-olivenolje-parringer",
      title: "Parringer med lett fruktig olivenolje",
      excerpt: "Lett fruktig olivenolje er den perfekte ledsageren for sarte oppskrifter. Oppdag hvordan du bruker den uten å dekke over smakene.",
      category: "Kjøpsguide",
    },
  
    "es": {
      slug: "maridajes-para-el-aceite-de-oliva-de-frutado-ligero",
      title: "Maridajes para el aceite de oliva de frutado ligero",
      excerpt: "El aceite de oliva de frutado ligero es el compañero perfecto para las recetas más delicadas. Descubra cómo usarlo sin enmascarar los sabores.",
      category: "Guía de Compra"
    },
    "fr": {
      slug: "accords-et-mariages-de-l-huile-d-olive-au-fruite-leger",
      title: "Accords et mariages de l'huile d'olive au fruité léger",
      excerpt: "L'huile d'olive au fruité léger est le compagnon idéal des recettes les plus délicates. Découvrez comment l'utiliser sans masquer les saveurs.",
      category: "Guide d'Achat"
    },
  },
  "com-4": {
    "it": {
      slug: "fruttato-intenso-quando-usarlo",
      title: "Come e quando usare l'Olio EVO Fruttato Intenso",
      excerpt: "Amaro vigoroso, pungente caparbietà e profumi inebrianti di bosco. Il fruttato intenso spiazza i palati distratti, ma è un concentrato nutrizionale assoluto ineguagliato. Ecco quando osare.",
      category: "Consigli di acquisto",
    },
    "en": {
      slug: "robust-intense-fruity-olive-oil-how-to-use",
      title: "How and When to Use Intense Fruity EVOO",
      excerpt: "Vigorous bitterness, pungent persistence, and forest aromas. Intense fruity EVOO surprises casual palates but represents an unequaled nutritional concentrate.",
      category: "Buying Guide",
    },
    "de": {
      slug: "intensiv-fruchtiges-olivenoel-anwendung",
      title: "Wie und wann Sie intensiv fruchtiges Olivenöl Extra verwenden",
      excerpt: "Kräftige Bitterkeit, markante Schärfe und betörende Waldaromen. Intensiv fruchtiges Olivenöl überrascht, ist aber ein unübertroffenes Konzentrat.",
      category: "Einkaufsführer",
    },
    "nl": {
      slug: "intensief-fruitige-olijfolie-gebruik",
      title: "Hoe en wanneer intensief fruitige extra vierge olijfolie te gebruiken",
      excerpt: "Krachtige bitterheid, markante pittigheid en rijke aroma's. Intensief fruitige olijfolie verrast, maar is een ongeëvenaard gezondheidselixer.",
      category: "Koopgids",
    },
    "da": {
      slug: "intensiv-frugtig-olivenolie-brug",
      title: "Hvordan og hvornår du bruger intensiv frugtig olivenolie",
      excerpt: "Kraftfuld bitterhed, markant skarphed og dufte af grønt. Intensiv frugtig olivenolie overrasker, men er et uforligneligt ernæringskoncentrat.",
      category: "Købsguide",
    },
    "no": {
      slug: "intensiv-fruktig-olivenolje-bruk",
      title: "Hvordan og når du bruker intensiv fruktig olivenolje",
      excerpt: "Kraftig bitterhet, markant skarphet og dufter av grønt. Intensiv fruktig olivenolje overrasker, men er et enestående næringskonsentrat.",
      category: "Kjøpsguide",
    },
  
    "es": {
      slug: "como-y-cuando-usar-un-aove-de-frutado-intenso",
      title: "Cómo y cuándo usar un AOVE de frutado intenso",
      excerpt: "Amargor vigoroso, persistencia picante y aromas a bosque. El AOVE de frutado intenso sorprende a los paladares ocasionales, pero representa un concentrado nutricional sin igual.",
      category: "Guía de Compra"
    },
    "fr": {
      slug: "comment-et-quand-utiliser-une-huile-d-olive-extra-vierge-au-fruite-intense",
      title: "Comment et quand utiliser une huile d'olive extra vierge au fruité intense",
      excerpt: "Amertume vigoureuse, persistance piquante et arômes de forêt. L'huile d'olive extra vierge au fruité intense surprend les palais occasionnels, mais représente un concentré nutritionnel inégalé.",
      category: "Guide d'Achat"
    },
  },
  "com-6": {
    "it": {
      slug: "olio-nuovo-cose-e-quanto-dura",
      title: "Cos'è l'Olio Nuovo e perché conviene acquistarlo?",
      excerpt: "Appena spremuto e caldissimo di torchio, l'Olio Nuovo vi regala un tripudio di scosse sensoriali incredibili per pochissime deliziose settimane prima invernali. Svisceriamo i segreti del vero tempismo perfetto per procurarselo.",
      category: "Consigli di acquisto",
    },
    "en": {
      slug: "what-is-new-olive-oil-benefits",
      title: "What is New Season Olive Oil and Why Should You Buy It?",
      excerpt: "Freshly pressed and warm from the mill, New Season Olive Oil offers an incredible burst of sensory notes for just a few weeks. Discover the secrets of perfect timing.",
      category: "Buying Guide",
    },
    "de": {
      slug: "was-ist-frisches-olivenoel-vorteile",
      title: "Was ist frisches Olivenöl der Saison und warum lohnt sich der Kauf?",
      excerpt: "Frisch gepresst und noch warm aus der Mühle bietet das frische Olivenöl (Olio Nuovo) für wenige Wochen ein unvergleichliches Erlebnis.",
      category: "Einkaufsführer",
    },
    "nl": {
      slug: "wat-is-nieuwe-olijfolie-kopen",
      title: "Wat is nieuwe olijfolie (Olio Nuovo) en waarom moet je dit proberen?",
      excerpt: "Vers geperst en warm uit de pers biedt nieuwe olijfolie gedurende een paar weken een ongekende zintuiglijke ervaring. Ontdek de geheimen.",
      category: "Koopgids",
    },
    "da": {
      slug: "hvad-er-ny-olivenolie-fordele",
      title: "Hvad er ny olivenolie (Olio Nuovo) og hvorfor købe den?",
      excerpt: "Nypresset og helt frisk fra kværnen byder den nye olivenolie på en fantastisk smagsoplevelse i få uger. Se hemmelighederne bag det perfekte tidspunkt.",
      category: "Købsguide",
    },
    "no": {
      slug: "hva-er-ny-olivenolje-fordeler",
      title: "Hva er ny sesong-olivenolje og hvorfor bør du kjøpe den?",
      excerpt: "Nypresset og helt fersk fra møllen byr den nye olivenoljen på en fantastisk smaksbølge i noen uker. Oppdag hemmelighetene.",
      category: "Kjøpsguide",
    },
  
    "es": {
      slug: "que-es-el-aceite-de-oliva-nuevo-y-por-que-deberia-comprarlo",
      title: "¿Qué es el aceite de oliva nuevo y por qué debería comprarlo?",
      excerpt: "Recién prensado y tibio de la almazara, el aceite de oliva nuevo ofrece una increíble explosión de notas sensoriales durante solo unas semanas. Descubra los secretos del momento perfecto.",
      category: "Guía de Compra"
    },
    "fr": {
      slug: "quest-ce-que-lhuile-dolive-nouvelle-et-pourquoi-devriez-vous-lacheter",
      title: "Qu'est-ce que l'huile d'olive nouvelle et pourquoi devriez-vous l'acheter ?",
      excerpt: "Fraîchement pressée et encore tiède du moulin, l'huile d'olive nouvelle offre une incroyable explosion de notes sensorielles pendant quelques semaines seulement. Découvrez les secrets du moment idéal.",
      category: "Guide d'Achat"
    },
  },
  "com-8": {
    "it": {
      slug: "dop-igp-100-italiano-differenze",
      title: "DOP, IGP o 100% Italiano: Cosa significano le sigle dell'Olio?",
      excerpt: "Tra marchi industriali e filiere artigianali, nei supermercati regna la confusione. Scopriamo le reali differenze tra queste sigle chiave per districarsi nel mercato dell'olio EVO.",
      category: "Consigli di acquisto",
    },
    "en": {
      slug: "dop-igp-100-percent-italian-olive-oil-labels-explained",
      title: "DOP, IGP or 100% Italian: What do the Oil Acronyms Mean?",
      excerpt: "Between industrial brands and artisanal supply chains, supermarkets are full of confusion. Discover the real differences between these key labels.",
      category: "Buying Guide",
    },
    "de": {
      slug: "gud-gga-100-prozent-italienisches-olivenoel-etiketten-erklaert",
      title: "g.U., g.g.A. oder 100% Italienisch: Was bedeuten die Kürzel beim Olivenöl?",
      excerpt: "Zwischen Industriemarken und handwerklichen Produkten herrscht im Supermarkt Verwirrung. Wir erklären die wahren Unterschiede.",
      category: "Einkaufsführer",
    },
    "nl": {
      slug: "bob-bgp-100-procent-italiaanse-olijfolie-keurmerken-uitleg",
      title: "BOB, BGP of 100% Italiaans: Wat betekenen de Keurmerken op Olijfolie?",
      excerpt: "Tussen industriële merken en ambachtelijke leveranciers heerst in de supermarkt veel verwarring. Ontdek de echte verschillen.",
      category: "Koopgids",
    },
    "da": {
      slug: "bob-bgp-100-procent-italiensk-olivenolie-maerkater-forklaret",
      title: "BOB, BGB eller 100 % italiensk: Hvad betyder olivenoliens mærkninger?",
      excerpt: "Mellem industrielle mærker og håndværksmæssige olier hersker der stor forvirring i supermarkedet. Se de reelle forskelle.",
      category: "Købsguide",
    },
    "no": {
      slug: "dop-igp-100-prosent-italiensk-olivenolje-merking-forklart",
      title: "DOP, IGP eller 100 % italiensk: Hva betyr olivenoljens merking?",
      excerpt: "Mellom industrielle merker og håndverksoljer hersker det stor forvirring i supermarkedet. Vi forklarer de reelle forskjellene.",
      category: "Kjøpsguide",
    },
  
    "es": {
      slug: "dop-igp-o-100-italiano-que-significan-las-siglas-del-aceite",
      title: "DOP, IGP o 100 % italiano: ¿qué significan las siglas del aceite?",
      excerpt: "Entre marcas industriales y cadenas de suministro artesanales, los supermercados están llenos de confusión. Descubre las diferencias reales entre estas etiquetas clave.",
      category: "Guía de Compra"
    },
    "fr": {
      slug: "aop-igp-ou-100-italien-que-signifient-les-acronymes-de-l-huile-d-olive",
      title: "AOP, IGP ou 100% italien : que signifient les acronymes de l'huile d'olive ?",
      excerpt: "Entre marques industrielles et circuits courts artisanaux, les supermarchés sont source de confusion. Découvrez les vraies différences entre ces labels clés.",
      category: "Guide d'Achat"
    },
  },
  "dif-1": {
    "it": {
      slug: "difetti-olio-evo-guida-completa",
      title: "Difetti dell'olio EVO: guida completa ai principali vizi sensoriali",
      excerpt: "Rancido, avvinato, riscaldo, muffa. I difetti dell'olio EVO sono classificati e valutati nel Panel Test COI. Ecco cosa significano e da dove vengono.",
      category: "Difetti dell'olio EVO",
    },
    "en": {
      slug: "extra-virgin-olive-oil-defects-guide",
      title: "EVO Olive Oil Defects: A Complete Guide to Sensory Vices",
      excerpt: "Rancid, winey, musty, muddy sediment. Olive oil defects are classified and evaluated in the IOC Panel Test. Learn what they mean and their origins.",
      category: "Olive Oil Defects",
    },
    "de": {
      slug: "olivenoelfehler-erkennen-kompletter-leitfaden",
      title: "Olivenölfehler erkennen: Kompletter Leitfaden für Verbraucher",
      excerpt: "Ranzig, stichig, schimmelig, morchia. Olivenölfehler werden im Panel-Test klassifiziert. Erfahren Sie, woher sie kommen.",
      category: "Olivenölfehler",
    },
    "nl": {
      slug: "olijfolie-defecten-herkennen-complete-gids",
      title: "Olijfolie-defecten herkennen: Complete gids voor de consument",
      excerpt: "Ranzig, wijnachtig, schimmelig, morchia. De defecten van extra vierge olijfolie worden beoordeeld in de Panel Test. Ontdek de oorzaken.",
      category: "Olijfolie-defecten",
    },
    "da": {
      slug: "olivenoliefejl-guide-til-sensoriske-fejl",
      title: "Olivenoliefejl: En komplet guide til sensoriske fejl",
      excerpt: "Harsk, vinedikke-agtig, muggen, bundfald. Olivenoliefejl klassificeres og evalueres i en Panel Test. Lær, hvad de betyder og hvorfor de opstår.",
      category: "Olivenoliefejl",
    },
    "no": {
      slug: "olivenoljefeil-guide-til-sensoriske-feil",
      title: "Olivenoljefeil: En komplett guide til sensoriske feil",
      excerpt: "Harsk, vinedikksmak, muggen, bunndfall. Olivenoljefeil klassifiseres og evalueres i en Panel Test. Lær hva de betyr.",
      category: "Olivenoljefeil",
    },
  
    "es": {
      slug: "defectos-del-aceite-de-oliva-virgen-extra-guia-completa-de-los-vicios-sensoriales",
      title: "Defectos del aceite de oliva virgen extra: guía completa de los vicios sensoriales",
      excerpt: "Rancio, avinado, moho, borras. Los defectos del aceite de oliva se clasifican y evalúan en el Panel Test del COI. Aprende qué significan y su origen.",
      category: "Defectos del Aceite de Oliva"
    },
    "fr": {
      slug: "defauts-de-l-huile-d-olive-extra-vierge-guide-complet-des-vices-sensoriels",
      title: "Défauts de l'huile d'olive extra vierge : guide complet des vices sensoriels",
      excerpt: "Rance, vinant, moisi, lies. Les défauts de l'huile d'olive sont classés et évalués par le Panel Test du COI. Découvrez leur signification et leur origine.",
      category: "Défauts de l'huile d'olive"
    },
  },
  "dif-2": {
    "it": {
      slug: "rancido-cause-prevenzione",
      title: "Rancido: cos'è, perché succede e come evitarlo",
      excerpt: "Il rancido è il difetto più comune e più dannoso per la qualità dell'olio. Capire il meccanismo chimico aiuta a prevenirlo con semplici accorgimenti.",
      category: "Difetti dell'olio EVO",
    },
    "en": {
      slug: "rancid-olive-oil-causes-prevention",
      title: "Rancid Olive Oil: Causes and Prevention",
      excerpt: "Rancidity is the most common and damaging defect for oil quality. Understanding the chemical mechanism helps prevent it with simple steps.",
      category: "Olive Oil Defects",
    },
    "de": {
      slug: "ranziges-olivenoel-ursachen-vermeidung",
      title: "Ranziges Olivenöl: Ursachen und Vermeidung",
      excerpt: "Ranzigkeit ist der häufigste und schädlichste Fehler für die Qualität des Öls. Die Chemie zu verstehen, hilft bei der einfachen Prävention.",
      category: "Olivenölfehler",
    },
    "nl": {
      slug: "rancige-olijfolie-oorzaken-en-voorkomen",
      title: "Rancige olijfolie: Oorzaken en Voorkomen",
      excerpt: "Ranzigheid is het meest voorkomende en schadelijke defect voor olijfolie. Het begrijpen van de chemie helpt dit met eenvoudige stappen te voorkomen.",
      category: "Olijfolie-defecten",
    },
    "da": {
      slug: "harsk-olivenolie-aarsager-og-forebyggelse",
      title: "Harsk olivenolie: Årsager og forebyggelse",
      excerpt: "Harskhed er den mest almindelige og skadelige fejl for oliens kvalitet. At forstå den kemiske proces hjælper dig med nem forebyggelse.",
      category: "Olivenoliefejl",
    },
    "no": {
      slug: "harsk-olivenolje-aarsaker-og-forebygging",
      title: "Harsk olivenolje: Årsaker og forebygging",
      excerpt: "Harskhet er den mest vanlige og skadelige feilen for oljens kvalitet. Å forstå den kjemiske prosessen hjelper deg med enkel forebygging.",
      category: "Olivenoljefeil",
    },
  
    "es": {
      slug: "aceite-de-oliva-rancio-causas-y-prevencion",
      title: "Aceite de oliva rancio: causas y prevención",
      excerpt: "La rancidez es el defecto más común y perjudicial para la calidad del aceite. Entender su mecanismo químico ayuda a prevenirlo con pasos sencillos.",
      category: "Defectos del Aceite de Oliva"
    },
    "fr": {
      slug: "huile-d-olive-rance-causes-et-prevention",
      title: "Huile d'olive rance : causes et prévention",
      excerpt: "Le rancissement est le défaut le plus courant et le plus préjudiciable pour la qualité de l'huile. Comprendre le mécanisme chimique aide à le prévenir par des gestes simples.",
      category: "Défauts de l'huile d'olive"
    },
  },
  "fid-1": {
    "it": {
      slug: "come-nasce-nostro-olio",
      title: "Come nasce il nostro olio: raccolta → frantoio → stoccaggio",
      excerpt: "Dal campo alla bottiglia: ogni fase della produzione influenza il risultato finale. Vi raccontiamo il processo passo per passo con foto e dettagli tecnici.",
      category: "Il nostro frantoio",
    },
    "en": {
      slug: "how-our-oil-is-born-harvest-mill-storage",
      title: "How Our Oil Is Made: Harvest -> Mill -> Storage",
      excerpt: "From field to bottle: every production phase influences the final result. Discover our step-by-step cold extraction process.",
      category: "Our Mill",
    },
    "de": {
      slug: "wie-unser-oel-entsteht-ernte-pressung-lagerung",
      title: "Wie unser Öl entsteht: Ernte → Ölmühle → Lagerung",
      excerpt: "Vom Feld bis zur Flasche: Jede Phase beeinflusst das Ergebnis. Wir erklären den Kaltpressungsprozess Schritt für Schritt.",
      category: "Unsere Ölmühle",
    },
    "nl": {
      slug: "hoe-onze-olijfolie-wordt-gemaakt",
      title: "Hoe onze olijfolie ontstaat: Oogst → Perserij → Opslag",
      excerpt: "Van boomgaard tot fles: elke productiefase beïnvloedt het eindresultaat. Ontdek onze ambachtelijke koude persing stap voor stap.",
      category: "Onze Perserij",
    },
    "da": {
      slug: "olivenoliens-rejse-fra-jord-til-bord",
      title: "Hvordan vores olie bliver til: Høst → Oliemølle → Lagring",
      excerpt: "Fra mark til flaske: Hver enkelt fase påvirker resultatet. Vi guider dig igennem koldpresningsprocessen trin for trin.",
      category: "Vores Mølle",
    },
    "no": {
      slug: "hvordan-olivenoljen-vaar-blir-til",
      title: "Hvordan oljen vår blir til: Høsting → Mølle → Lagring",
      excerpt: "Fra felt til flaske: Hver enkelt fase påvirker resultatet. Vi guider deg gjennom kaldpressingsprosessen trinn for trinn.",
      category: "Vår Mølle",
    },
  
    "es": {
      slug: "como-se-hace-nuestro-aceite-cosecha-almazara-almacenamiento",
      title: "Cómo se Hace Nuestro Aceite: Cosecha -> Almazara -> Almacenamiento",
      excerpt: "Del campo a la botella: cada fase de producción influye en el resultado final. Descubre nuestro proceso de extracción en frío paso a paso.",
      category: "Nuestra Almazara"
    },
    "fr": {
      slug: "comment-notre-huile-est-faite-recolte-moulin-stockage",
      title: "Comment notre huile est faite : Récolte -> Moulin -> Stockage",
      excerpt: "Du champ à la bouteille : chaque phase de production influence le résultat final. Découvrez notre processus d'extraction à froid étape par étape.",
      category: "Notre Moulin"
    },
  },
  "fid-2": {
    "it": {
      slug: "come-degustare-olio-5-minuti",
      title: "Come degustare l'olio EVO in 5 minuti: guida pratica per tutti",
      excerpt: "Non serve essere assaggiatori professionisti. Con qualche strumento e le istruzioni giuste puoi degustare l'olio come un esperto — in cinque minuti, a casa tua.",
      category: "Il nostro frantoio",
    },
    "en": {
      slug: "how-to-taste-evoo-in-5-minutes-practical-guide",
      title: "How to Taste EVOO in 5 Minutes: Practical Guide for Everyone",
      excerpt: "You don't need to be a professional taster. With a few simple steps, you can taste olive oil like an expert — in five minutes at home.",
      category: "Our Mill",
    },
    "de": {
      slug: "olivenoel-verkosten-in-5-minuten-anleitung",
      title: "Olivenöl verkosten in 5 Minuten: Eine praktische Anleitung",
      excerpt: "Man muss kein Profi sein. Mit ein paar einfachen Schritten verkosten Sie Olivenöl wie ein Experte – in fünf Minuten, bequem zu Hause.",
      category: "Unsere Ölmühle",
    },
    "nl": {
      slug: "olijfolie-proeven-in-5-minuten-praktische-gids",
      title: "Olijfolie proeven in 5 minuten: Praktische gids voor iedereen",
      excerpt: "Je hoeft geen professionele proever te zijn. Met een paar simpele stappen proef je olijfolie als een expert — in vijf minuten thuis.",
      category: "Onze Perserij",
    },
    "da": {
      slug: "smagning-af-olivenolie-paa-5-minutter",
      title: "Smagning af olivenolie på 5 minutter: En praktisk guide",
      excerpt: "Du behøver ikke at være professionel smager. Med nogle enkle trin kan du smage olivenolie som en ekspert derhjemme på fem minutter.",
      category: "Vores Mølle",
    },
    "no": {
      slug: "smaking-av-olivenolje-paa-5-minutter",
      title: "Smaking av olivenolje på 5 minutter: En praktisk guide",
      excerpt: "Du trenger ikke å være profesjonell smaker. Med noen enkle trinn kan du smake olivenolje som en ekspert hjemme på fem minutter.",
      category: "Vår Mølle",
    },
  
    "es": {
      slug: "como-catar-aove-en-5-minutos-guia-practica-para-todos",
      title: "Cómo Catar AOVE en 5 Minutos: Guía Práctica para Todos",
      excerpt: "No necesitas ser un catador profesional. Con unos sencillos pasos, podrás catar el aceite de oliva como un experto, en cinco minutos y en tu propia casa.",
      category: "Nuestra Almazara"
    },
    "fr": {
      slug: "comment-deguster-l-evoo-en-5-minutes-guide-pratique-pour-tous",
      title: "Comment déguster l'EVOO en 5 minutes : guide pratique pour tous",
      excerpt: "Nul besoin d'être un dégustateur professionnel. En quelques étapes simples, vous pouvez déguster l'huile d'olive comme un expert — en cinq minutes chez vous.",
      category: "Notre Moulin"
    },
  },
  "info-1": {
    "it": {
      slug: "amaro-piccante-olio-non-e-difetto",
      title: "A cosa serve l'amaro e il piccante nell'olio EVO (non è un difetto)",
      excerpt: "Il pizzicore in gola e l'amaro persistente spaventano molti. Eppure sono i migliori indicatori di un olio di qualità. Scopri perché.",
      category: "Informazioni sull'olio EVO",
    },
    "en": {
      slug: "bitter-and-pungent-in-olive-oil-not-a-defect",
      title: "Why EVOO Is Bitter and Pungent (It's Not a Defect)",
      excerpt: "The throat tickle and persistent bitterness scare many. Yet they are the best indicators of a quality olive oil. Discover why.",
      category: "Olive Oil Information",
    },
    "de": {
      slug: "bitter-und-scharf-im-olivenoel-kein-fehler",
      title: "Bitter und Scharf im Olivenöl Extra Vergine: Kein Fehler",
      excerpt: "Das Kratzen im Hals und die anhaltende Bitterkeit schrecken viele ab. Doch sie sind die besten Qualitätsmerkmale. Erfahren Sie warum.",
      category: "Olivenöl-Informationen",
    },
    "nl": {
      slug: "bitter-en-pittig-in-olijfolie-geen-defect",
      title: "Waar Bitter en Pittig voor Dienen in Extra Vierge Olijfolie",
      excerpt: "De kriebel in de keel en de aanhoudende bitterheid schrikken velen af. Toch zijn dit de beste kwaliteitsindicatoren. Ontdek waarom.",
      category: "Olijfolie-informatie",
    },
    "da": {
      slug: "bitter-og-skarp-i-olivenolie-ikke-en-fejl",
      title: "Hvorfor bitterhed og skarphed i olivenolie er et sundhedstegn",
      excerpt: "Det kradsende prik i halsen og den bitre eftersmag skræmmer mange. Men de er de bedste indikatorer for kvalitet. Se hvorfor.",
      category: "Olivenolie-information",
    },
    "no": {
      slug: "bitter-og-skarp-i-olivenolje-ikke-en-feil",
      title: "Hvorfor bitterhet og skarphet i olivenolje er et sunnhetstegn",
      excerpt: "Det kileende prikket i halsen og den bitre ettersmaken skremmer mange. Men de er de beste indikatorene for kvalitet. Se hvorfor.",
      category: "Olivenolje-informasjon",
    },
  
    "es": {
      slug: "por-que-el-aove-es-amargo-y-picante-no-es-un-defecto",
      title: "Por Qué el AOVE es Amargo y Picante (No Es un Defecto)",
      excerpt: "El picor en la garganta y el amargor persistente asustan a muchos. Sin embargo, son los mejores indicadores de un aceite de oliva de calidad. Descubre por qué.",
      category: "Información sobre el Aceite de Oliva"
    },
    "fr": {
      slug: "pourquoi-l-huile-d-olive-extra-vierge-est-amere-et-piquante-ce-n-est-pas-un-défaut",
      title: "Pourquoi l'huile d'olive extra vierge est amère et piquante (ce n'est pas un défaut)",
      excerpt: "Le picotement dans la gorge et l'amertume persistante en effraient plus d'un. Pourtant, ce sont les meilleurs indicateurs d'une huile d'olive de qualité. Découvrez pourquoi.",
      category: "Informations sur l'huile d'olive"
    },
  },
  "info-2": {
    "it": {
      slug: "conservare-olio-casa",
      title: "Come conservare l'olio EVO a casa: luce, ossigeno, temperatura",
      excerpt: "I tre nemici dell'olio extravergine sono luce, ossigeno e calore. Errori banali di conservazione possono rovinare anche un olio eccellente in poche settimane.",
      category: "Conservazione",
    },
    "en": {
      slug: "how-to-store-evoo-at-home-light-oxygen-temperature",
      title: "How to Store EVOO at Home: Light, Oxygen, Temperature",
      excerpt: "The three enemies of extra virgin olive oil are light, oxygen, and heat. Avoid simple mistakes that can ruin a great oil in weeks.",
      category: "Storage & Preservation",
    },
    "de": {
      slug: "olivenoel-richtig-lagern-licht-sauerstoff-temperatur",
      title: "Olivenöl richtig lagern: Licht, Sauerstoff, Temperatur",
      excerpt: "Die drei Feinde des Olivenöls sind Licht, Sauerstoff und Wärme. Einfache Fehler können ein hervorragendes Öl in Wochen ruinieren.",
      category: "Lagerung & Aufbewahrung",
    },
    "nl": {
      slug: "olijfolie-bewaren-licht-zuurstof-temperatuur",
      title: "Olijfolie Bewaren: Licht, Zuurstof, Temperatuur",
      excerpt: "De drie vijanden van extra vierge olijfolie zijn licht, zuurstof en warmte. Banale fouten kunnen een geweldige olijfolie in weken bederven.",
      category: "Opslag & Bewaring",
    },
    "da": {
      slug: "opbevaring-af-olivenolie-hjemme",
      title: "Opbevaring af olivenolie derhjemme: Lys, ilt, temperatur",
      excerpt: "De tre fjender for ekstra jomfruolivenolie er lys, ilt og varme. Undgå enkle fejl, der kan ødelægge en fantastisk olie på få uger.",
      category: "Opbevaring",
    },
    "no": {
      slug: "oppbevaring-af-olivenolje-hjemme",
      title: "Oppbevaring av olivenolje hjemme: Lys, oksygen, temperatur",
      excerpt: "De tre fiendene til ekstra jomfruolivenolje er lys, oksygen og varme. Unngå enkle feil som kan ødelegge en fantastisk olje på få uker.",
      category: "Lagring",
    },
  
    "es": {
      slug: "como-conservar-el-aove-en-casa-luz-oxigeno-temperatura",
      title: "Cómo conservar el AOVE en casa: luz, oxígeno, temperatura",
      excerpt: "Los tres enemigos del aceite de oliva virgen extra son la luz, el oxígeno y el calor. Evita errores sencillos que pueden estropear un gran aceite en pocas semanas.",
      category: "Conservación"
    },
    "fr": {
      slug: "comment-conserver-l-evoo-a-la-maison-lumiere-oxygene-temperature",
      title: "Comment conserver l'EVOO à la maison : lumière, oxygène, température",
      excerpt: "Les trois ennemis de l'huile d'olive extra vierge sont la lumière, l'oxygène et la chaleur. Évitiez les erreurs simples qui peuvent gâcher une excellente huile en quelques semaines.",
      category: "Stockage et conservation"
    },
  },
  "dif-3": {
    "it": {
      slug: "difetto-avvinato-inacetito-olio",
      title: "Difetto avvinato-inacetito nell'olio EVO: cause, riconoscimento e prevenzione",
      excerpt: "L'olio che sa di aceto non è un olio buono — è un olio con un difetto di fermentazione. Scopri da dove viene e come si previene nella produzione.",
      category: "Difetti dell'olio EVO",
    },
    "en": {
      slug: "winey-vinegary-defect-in-olive-oil-causes-detection",
      title: "Winey-Vinegary Defect in Olive Oil: Causes, Recognition, and Prevention",
      excerpt: "Oil that tastes like vinegar is not a good oil — it has a fermentation defect. Discover where it comes from and how to prevent it in production.",
      category: "Olive Oil Defects",
    },
    "de": {
      slug: "stichig-essigartiger-fehler-olivenoel-ursachen",
      title: "Stichig-essigartiger Fehler in Olivenöl: Ursachen, Erkennung und Vermeidung",
      excerpt: "Öl, das nach Essig schmeckt, ist kein gutes Öl – es handelt sich um einen Gärungsfehler. Erfahren Sie, woher er kommt und wie er vermieden wird.",
      category: "Olivenölfehler",
    },
    "nl": {
      slug: "wijnachtig-azijnachtig-defect-olijfolie-oorzaken",
      title: "Wijnachtig-azijnachtig defect in olijfolie: oorzaken, herkenning en preventie",
      excerpt: "Olijfolie die naar azijn smaakt is geen goede olie — het is een olie met een gistingsdefect. Ontdek waar het vandaan komt en hoe je het voorkomt in de productie.",
      category: "Olijfolie-defecten",
    },
    "da": {
      slug: "vinedikkesmag-fejl-i-olivenolie-aarsager-og-forebyggelse",
      title: "Vinedikkesmag-fejl i olivenolie: Årsager, genkendelse og forebyggelse",
      excerpt: "Olie, der smager af eddike, er ikke en god olie — det er en olie med en gæringsfejl. Se, hvor den kommer fra, og hvordan den forebygges i produktionen.",
      category: "Olivenoliefejl",
    },
    "no": {
      slug: "vinedikksmak-feil-i-olivenolje-aarsaker-og-forebygging",
      title: "Vinedikksmak-feil i olivenolje: Årsaker, genkjenning og forebygging",
      excerpt: "Olje som smaker eddik er ikke en god olje — det er en olje med en gjæringsfeil. Se hvor den kommer fra, og hvordan den forebygges i produksjonen.",
      category: "Olivenoljefeil",
    },
  
    "es": {
      slug: "defecto-avinado-avinagrado-en-el-aceite-de-oliva-causas-reconocimiento-y-prevencion",
      title: "Defecto avinado-avinagrado en el aceite de oliva: causas, reconocimiento y prevención",
      excerpt: "El aceite que sabe a vinagre no es un buen aceite: presenta un defecto de fermentación. Descubre de dónde viene y cómo prevenirlo en la producción.",
      category: "Defectos del Aceite de Oliva"
    },
    "fr": {
      slug: "defaut-vinant-vinaigre-de-l-huile-d-olive-causes-reconnaissance-et-prevention",
      title: "Défaut vinant-vinaigré de l'huile d'olive : causes, reconnaissance et prévention",
      excerpt: "Une huile qui a un goût de vinaigre n'est pas une bonne huile : elle présente un défaut de fermentation. Découvrez d'où il vient et comment le prévenir lors de la production.",
      category: "Défauts de l'huile d'olive"
    },
  },
  "dif-4": {
    "it": {
      slug: "difetto-muffa-morchia-olio",
      title: "Muffa e morchia nell'olio EVO: cause, riconoscimento e prevenzione",
      excerpt: "Due difetti distinti ma spesso confusi. La muffa viene dalle olive, la morchia dai serbatoi sporchi. Entrambi rovinano irrimediabilmente l'olio.",
      category: "Difetti dell'olio EVO",
    },
    "en": {
      slug: "musty-muddy-sediment-defects-olive-oil",
      title: "Musty and Muddy Sediment Defects in Olive Oil: Causes and Prevention",
      excerpt: "Two distinct defects often confused. Musty comes from the olives, muddy sediment from dirty tanks. Both ruin the oil irreparably.",
      category: "Olive Oil Defects",
    },
    "de": {
      slug: "schimmel-und-schlammiger-bodensatz-olivenoelfehler",
      title: "Schimmel und schlammiger Bodensatz: Zwei kapitale Fehler in Olivenöl",
      excerpt: "Zwei unterschiedliche Fehler, die oft verwechselt werden. Schimmel kommt von den Oliven, Bodensatz (Morchia) von schmutzigen Tanks.",
      category: "Olivenölfehler",
    },
    "nl": {
      slug: "schimmel-en-bezinksel-defecten-olijfolie",
      title: "Schimmel en bezinksel (morchia) in olijfolie: oorzaken en preventie",
      excerpt: "Twee verschillende defecten die vaak worden verward. Schimmel komt van de olijven, bezinksel door vuile tanks of gebrek aan filtering.",
      category: "Olijfolie-defecten",
    },
    "da": {
      slug: "mug-og-bundfald-defekter-i-olivenolie-aarsager-og-forebyggelse",
      title: "Mug og bundfald (morchia) i olivenolie: Årsager, genkendelse og forebyggelse",
      excerpt: "To forskellige fejl, der ofte forveksles. Mug kommer fra olivenerne, mens bundfald skyldes snavsede tanke eller manglende dekantering.",
      category: "Olivenoliefejl",
    },
    "no": {
      slug: "mugg-og-bunndfall-defekter-i-olivenolje-aarsaker-og-forebygging",
      title: "Mugg og bunndfall (morchia) i olivenolje: Årsaker, genkjenning og forebygging",
      excerpt: "To forskjellige feil som ofte forveksles. Mugg kommer fra olivene, mens bunndfall skyldes skitne tanker eller manglende dekantering.",
      category: "Olivenoljefeil",
    },
  
    "es": {
      slug: "defectos-de-moho-y-borras-en-el-aceite-de-oliva-causas-y-prevencion",
      title: "Defectos de moho y borras en el aceite de oliva: causas y prevención",
      excerpt: "Dos defectos distintos que a menudo se confunden. El moho proviene de las aceitunas, las borras de los depósitos sucios. Ambos estropean el aceite de forma irreparable.",
      category: "Defectos del Aceite de Oliva"
    },
    "fr": {
      slug: "defauts-de-moisi-et-de-lies-dans-l-huile-d-olive-causes-et-prevention",
      title: "Défauts de moisi et de lies dans l'huile d'olive : causes et prévention",
      excerpt: "Deux défauts distincts souvent confondus. Le moisi provient des olives, les lies des cuves sales. Tous deux gâchent l'huile de manière irréparable.",
      category: "Défauts de l'huile d'olive"
    },
  },
  "fid-3": {
    "it": {
      slug: "tracciabilita-lotto-analisi-qualita",
      title: "Tracciabilità: lotto, analisi, provenienza — come garantiamo la qualità",
      excerpt: "La parola 'qualità' è abusata. Noi la documentiamo: ogni lotto ha un numero tracciabile, analisi di laboratorio e provenienza verificabile. Ecco come funziona.",
      category: "Il nostro frantoio",
    },
    "en": {
      slug: "olive-oil-traceability-batch-analysis-provenance",
      title: "Traceability: Batch, Analysis, and Provenance — How We Guarantee Quality",
      excerpt: "The word 'quality' is overused. We document it: every batch has a traceable number, laboratory analysis, and verifiable origin. Here is how it works.",
      category: "Our Mill",
    },
    "de": {
      slug: "rueckverfolgbarkeit-charge-laboranalyse-herkunft",
      title: "Rückverfolgbarkeit: Charge, Analyse, Herkunft – Wie wir Qualität garantieren",
      excerpt: "Das Wort 'Qualität' wird oft missbraucht. Wir dokumentieren sie: Jede Charge hat eine rückverfolgbare Nummer, Laboranalysen und eine nachprüfbare Herkunft.",
      category: "Unsere Ölmühle",
    },
    "nl": {
      slug: "olijfolie-traceerbaarheid-lotnummer-analyse-herkomst",
      title: "Traceerbaarheid: Lotnummer, Analyse, Herkomst — Hoe we kwaliteit garanderen",
      excerpt: "Het woord 'kwaliteit' wordt te vaak misbruikt. Wij documenteren het: elk lotnummer heeft laboratoriumanalyses en een verifieerbare herkomst.",
      category: "Onze Perserij",
    },
    "da": {
      slug: "olivenolie-sporbarhed-batch-analyse-oprindelse",
      title: "Sporbarhed: Batch, Analyse, Oprindelse — Sådan garanterer vi kvaliteten",
      excerpt: "Ordet 'kvalitet' er misbrugt. Vi dokumenterer det: Hver batch har et sporbart nummer, laboratorieanalyse og verificerbar oprindelse.",
      category: "Vores Mølle",
    },
    "no": {
      slug: "olivenolje-sporbarhet-batch-analyse-opprinnelse",
      title: "Sporbarhet: Batch, Analyse, Opprinnelse — Slik garanterer vi kvaliteten",
      excerpt: "Ordet 'kvalitet' er misbrukt. Vi dokumenterer det: Hver batch har et sporbart nummer, laboratorieanalyse og verifiserbar opprinnelse.",
      category: "Vår Mølle",
    },
  
    "es": {
      slug: "trazabilidad-lote-analisis-y-procedencia-como-garantizamos-la-calidad",
      title: "Trazabilidad: lote, análisis y procedencia — Cómo garantizamos la calidad",
      excerpt: "La palabra 'calidad' se usa en exceso. Nosotros la documentamos: cada lote cuenta con un número trazable, análisis de laboratorio y origen verificable. Así es como funciona.",
      category: "Nuestra Almazara"
    },
    "fr": {
      slug: "tracabilite-lot-analyse-et-provenance-comment-nous-garantissons-la-qualite",
      title: "Traçabilité : Lot, analyse et provenance — Comment nous garantissons la qualité",
      excerpt: "Le mot « qualité » est galvaudé. Nous le documentons : chaque lot possède un numéro traçable, des analyses de laboratoire et une origine vérifiable. Voici comment cela fonctionne.",
      category: "Notre Moulin"
    },
  },
  "fid-4": {
    "it": {
      slug: "perche-olio-cambia-ogni-anno",
      title: "Perché l'olio cambia ogni anno: clima, resa, maturazione",
      excerpt: "Come il vino, l'olio EVO cambia ogni anno. Colore, intensità, note aromatiche — tutto dipende dall'annata. Ecco perché è normale e perché è bello.",
      category: "Il nostro frantoio",
    },
    "en": {
      slug: "why-olive-oil-changes-every-year-climate-yield",
      title: "Why Olive Oil Changes Every Year: Climate, Yield, and Ripening",
      excerpt: "Just like wine, EVOO changes every year. Color, intensity, aromatic notes — everything depends on the vintage. Here is why it is normal and beautiful.",
      category: "Our Mill",
    },
    "de": {
      slug: "warum-olivenoel-jedes-jahr-anders-schmeckt",
      title: "Warum Olivenöl jedes Jahr anders schmeckt: Klima, Ertrag, Reife",
      excerpt: "Genau wie Wein verändert sich Olivenöl Extra Vergine jedes Jahr. Farbe, Intensität, Aromen – alles hängt vom Jahrgang ab. Das ist normal und wunderbar.",
      category: "Unsere Ölmühle",
    },
    "nl": {
      slug: "waarom-olijfolie-elk-jaar-verandert-klimaat-oogst",
      title: "Waarom olijfolie elk jaar verandert: Klimaat, Opbrengst en Rijping",
      excerpt: "Net als wijn verandert extra vierge olijfolie elk jaar. Kleur, intensiteit, aromatische tonen — alles hangt af van het jaar. Dit is normaal en mooi.",
      category: "Onze Perserij",
    },
    "da": {
      slug: "hvorfor-olivenolie-aendrer-sig-hvert-aar-klima-hoest",
      title: "Hvorfor olivenolie ændrer sig hvert år: Klima, Udbytte og Modning",
      excerpt: "Ligesom vin ændrer ekstra jomfruolivenolie sig hvert år. Farve, intensitet, aromaer — alt afhænger af årgangen. Det er helt normalt og smukt.",
      category: "Vores Mølle",
    },
    "no": {
      slug: "hvorfor-olivenolje-endrer-seg-hvert-aar-klima-hoest",
      title: "Hvorfor olivenolje endrer seg hvert år: Klima, Utbytte og Modning",
      excerpt: "Akkurat som vin endrer ekstra jomfruolivenolje seg hvert år. Farge, intensitet, aromaer — alt avhenger av årgangen. Det er helt normalt og vakkert.",
      category: "Vår Mølle",
    },
  
    "es": {
      slug: "por-que-el-aceite-de-oliva-cambia-cada-ano-clima-rendimiento-y-maduracion",
      title: "Por qué el aceite de oliva cambia cada año: clima, rendimiento y maduración",
      excerpt: "Al igual que el vino, el AOVE cambia cada año. Color, intensidad, notas aromáticas: todo depende de la cosecha. Te explicamos por qué es normal y hermoso.",
      category: "Nuestra Almazara"
    },
    "fr": {
      slug: "pourquoi-lhuile-dolive-change-chaque-annee-climat-rendement-et-maturation",
      title: "Pourquoi l'huile d'olive change chaque année : climat, rendement et maturation",
      excerpt: "Tout comme le vin, l'HOVE change chaque année. Couleur, intégrité, notes aromatiques — tout dépend du millésime. Voici pourquoi c'est normal et merveilleux.",
      category: "Notre Moulin"
    },
  },
  "fid-5": {
    "it": {
      slug: "oleoturismo-degustazioni-frantoio",
      title: "Oleoturismo e visite al frantoio: cos'è, cosa si fa e perché vale la pena",
      excerpt: "L'oleoturismo è una delle esperienze enogastronomiche più autentiche d'Italia. Visitare un frantoio durante la spremitura cambia per sempre il modo di vivere l'olio.",
      category: "Il nostro frantoio",
    },
    "en": {
      slug: "oleotourism-olive-oil-tours-mill-visits",
      title: "Oleotourism and Olive Mill Visits: What It Is, What We Do, and Why It Is Worth It",
      excerpt: "Oleotourism is one of Italy's most authentic food and wine experiences. Visiting an olive mill during the harvest changes forever the way you experience olive oil.",
      category: "Our Mill",
    },
    "de": {
      slug: "oleotourismus-oelmuehle-besichtigen-erlebnis",
      title: "Oleotourismus und Ölmühlenbesuche: Was man macht und warum es sich lohnt",
      excerpt: "Oleotourismus ist eine der authentischsten kulinarischen Erfahrungen in Italien. Der Besuch einer Ölmühle während der Pressung verändert Ihre Sicht auf das Öl.",
      category: "Unsere Ölmühle",
    },
    "nl": {
      slug: "oleotoerisme-olijfmolen-bezoeken-ervaring",
      title: "Oleotoerisme en Olijfmolenbezoeken: Wat het is, Wat we doen en Waarom het de moeite waard is",
      excerpt: "Oleotoerisme is een van de meest authentieke culinaire ervaringen in Italië. Een bezoek aan een olijfmolen tijdens de persing verandert voorgoed hoe je olijfolie beleeft.",
      category: "Onze Perserij",
    },
    "da": {
      slug: "olivenolieturisme-besoeg-oliemoelle-oplevelse",
      title: "Olivenolieturisme og besøg på oliemølle: Hvad man gør, og hvorfor det er det hele værd",
      excerpt: "Olivenolieturisme (oleoturisme) er en af Italiens mest autentiske mad- og vinoplevelser. Besøg oliemøllen under presningen.",
      category: "Vores Mølle",
    },
    "no": {
      slug: "olivenoljeturisme-besoek-oliemoelle-opplevelse",
      title: "Olivenoljeturisme og besøk på oliemølle: Hva man gjør, og hvorfor det er verdt det",
      excerpt: "Olivenoljeturisme (oleoturisme) er en av Italias mest autentiske mat- og vinopplevelser. Besøk oliemøllen under pressingen.",
      category: "Vår Mølle",
    },
  
    "es": {
      slug: "oleoturismo-y-visitas-a-almazaras-que-es-que-hacemos-y-por-que-merece-la-pena",
      title: "Oleoturismo y visitas a almazaras: qué es, qué hacemos y por qué merece la pena",
      excerpt: "El oleoturismo es una de las experiencias enogastronómicas más auténticas de Italia. Visitar una almazara durante la cosecha cambia para siempre la forma de vivir el aceite de oliva.",
      category: "Nuestra Almazara"
    },
    "fr": {
      slug: "oleotourisme-et-visites-de-moulins-quest-ce-que-cest-ce-que-nous-faisons-et-pourquoi-ca-en-vaut-la-peine",
      title: "Oléotourisme et visites de moulins : qu'est-ce que c'est, ce que nous faisons et pourquoi ça en vaut la peine",
      excerpt: "L'oléotourisme est l'une des expériences œnogastronomiques les plus authentiques d'Italie. Visiter un moulin à huile pendant la récolte change à jamais votre façon de vivre l'huile d'olive.",
      category: "Notre Moulin"
    },
  },
  "faq-1": {
    "it": {
      slug: "faq-olio-evo",
      title: "FAQ sull'olio EVO: perché pizzica, perché è torbido, quanto dura, perché costa",
      excerpt: "Le domande più frequenti sull'olio extravergine di oliva, con risposte dirette e senza tecnicismi inutili. Dalla conservazione al prezzo, dall'aspetto al gusto.",
      category: "Informazioni sull'olio EVO",
    },
    "en": {
      slug: "extra-virgin-olive-oil-faq-questions",
      title: "FAQ on EVOO: Why It Stings, Why It's Cloudy, How Long It Lasts, and Why It Costs",
      excerpt: "The most frequently asked questions about extra virgin olive oil, with direct answers and without useless jargon. From storage to price, from appearance to taste.",
      category: "Olive Oil Information",
    },
    "de": {
      slug: "olivenoel-extra-faq-haeufige-fragen",
      title: "FAQ zu Olivenöl Extra: Warum es kratzt, warum es trüb ist, Haltbarkeit",
      excerpt: "Die häufigsten Fragen zu nativem Olivenöl Extra mit direkten Antworten ohne unnötiges Fachchinesisch. Von der Lagerung bis zum Preis.",
      category: "Olivenöl-Informationen",
    },
    "nl": {
      slug: "extra-vierge-olijfolie-veelgestelde-vragen-faq",
      title: "FAQ over Extra Vierge Olijfolie: Waarom het prikkelt, houdbaarheid en prijs",
      excerpt: "De meest gestelde vragen over extra vierge olijfolie, met directe antwoorden zonder onnodig jargon. Van bewaring tot prijs.",
      category: "Olijfolie-informatie",
    },
    "da": {
      slug: "olivenolie-information/extra-virgin-olive-oil-faq-questions",
      title: "FAQ om olivenolie: Hvorfor kradser den, holdbarhed og pris",
      excerpt: "De mest almindelige spørgsmål om ekstra jomfruolivenolie med direkte svar uden svære fagord. Fra opbevaring til pris.",
      category: "Olivenolie-information",
    },
    "no": {
      slug: "olivenoljefeil/hva-betyr-det",
      title: "FAQ om olivenolje: Hvorfor kiler den i halsen, holdbarhet og pris",
      excerpt: "De mest vanlige spørsmålene om ekstra jomfruolivenolje med direkte svar uten vanskelige fagord. Fra lagring til pris.",
      category: "Olivenolje-informasjon",
    },
  
    "es": {
      slug: "preguntas-frecuentes-sobre-el-aove-por-que-pica-por-que-esta-turbio-cuanto-dura-y-por-que-cuesta",
      title: "Preguntas frecuentes sobre el AOVE: por qué pica, por qué está turbio, cuánto dura y por qué cuesta",
      excerpt: "Las preguntas más frecuentes sobre el aceite de oliva virgen extra, con respuestas directas y sin tecnicismos inútiles. De la conservación al precio, del aspecto al gusto.",
      category: "Información sobre el Aceite de Oliva"
    },
    "fr": {
      slug: "faq-sur-l-huile-d-olive-extra-vierge-pourquoi-elle-pique-pourquoi-elle-est-trouble-combien-de-temps-elle-se-conserve-et-pourquoi-elle-coute",
      title: "FAQ sur l'huile d'olive extra vierge : pourquoi elle pique, pourquoi elle est trouble, combien de temps elle se conserve et pourquoi elle coûte",
      excerpt: "Les questions les plus fréquemment posées sur l'huile d'olive extra vierge, avec des réponses directes et sans jargon inutile. De la conservation au prix, de l'aspect au goût.",
      category: "Informations sur l'huile d'olive"
    },
  },
  "info-4": {
    "it": {
      slug: "come-capire-olio-rancido",
      title: "Come capire se un olio EVO è rancido: segnali e cosa fare",
      excerpt: "L'odore di olio rancido è inconfondibile, ma non sempre ovvio per chi non conosce i segnali. Ecco come riconoscerlo e perché non vale la pena tenerlo.",
      category: "Difetti dell'olio EVO",
    },
    "en": {
      slug: "how-to-tell-if-olive-oil-is-rancid",
      title: "How to Tell If Your Extra Virgin Olive Oil is Rancid",
      excerpt: "The smell of rancid olive oil is unmistakable once you know it. Discover the signs and why it's not worth keeping in your kitchen.",
      category: "Olive Oil Defects",
    },
    "de": {
      slug: "wie-man-ranziges-olivenoel-erkennt",
      title: "Wie Sie erkennen, ob ein Olivenöl ranzig ist",
      excerpt: "Der Geruch von ranzigem Öl ist unverwechselbar. Erfahren Sie, wie Sie ihn erkennen und warum sich ranziges Öl in der Küche nicht lohnt.",
      category: "Olivenölfehler",
    },
    "nl": {
      slug: "hoe-herken-je-ranzige-olijfolie",
      title: "Hoe je herkent of een olijfolie ranzig is",
      excerpt: "De geur van ranzige olijfolie is onmiskenbaar als je weet waar je op moet letten. Ontdek de signalen en waarom je het beter kunt weggooien.",
      category: "Olijfolie-defecten",
    },
    "da": {
      slug: "hvordan-genkender-man-harsk-olivenolie",
      title: "Sådan genkender du en harsk olivenolie: tegn og gode råd",
      excerpt: "Duften af harsk olivenolie er ikke til at tage fejl af. Se, hvordan du genkender den, og hvorfor den ikke er værd at gemme på.",
      category: "Olivenoliefejl",
    },
    "no": {
      slug: "hvordan-gjenkjenne-harsk-olivenolje",
      title: "Slik gjenkjenner du en harsk olivenolje: tegn og råd",
      excerpt: "Duften av harsk olivenolje er ikke til å ta feil av. Se hvordan du gjenkjenner den og hvorfor du bør kaste den.",
      category: "Olivenoljefeil",
    },
  
    "es": {
      slug: "como-saber-si-tu-aceite-de-oliva-virgen-extra-esta-rancio",
      title: "Cómo Saber Si Tu Aceite de Oliva Virgen Extra Está Rancio",
      excerpt: "El olor del aceite de oliva rancio es inconfundible una vez que lo conoces. Descubre las señales y por qué no vale la pena conservarlo en tu cocina.",
      category: "Defectos del Aceite de Oliva"
    },
    "fr": {
      slug: "comment-savoir-si-votre-huile-d-olive-extra-vierge-est-rancie",
      title: "Comment savoir si votre huile d'olive extra vierge est rancie",
      excerpt: "L'odeur de l'huile d'olive rancie est inconfondable une fois que vous la connaissez. Découvrez les signes et pourquoi elle ne vaut plus la peine d'être conservée en cuisine.",
      category: "Défauts de l'huile d'olive"
    },
  },
  "info-5": {
    "it": {
      slug: "colore-olio-verde-migliore",
      title: "Colore dell'olio: il verde è sinonimo di migliore? (No)",
      excerpt: "Il verde intenso dell'olio novello è bellissimo. Ma il colore è davvero un indicatore di qualità? La risposta scientifica vi sorprenderà.",
      category: "Informazioni sull'olio EVO",
    },
    "en": {
      slug: "olive-oil-color-myth-is-green-better",
      title: "Olive Oil Color: Is Green a Sign of Better Quality?",
      excerpt: "The vibrant green of freshly milled olive oil is beautiful. But is color a reliable indicator of quality? The scientific answer might surprise you.",
      category: "Olive Oil Information",
    },
    "de": {
      slug: "olivenoel-farbe-ist-gruen-besser",
      title: "Die Farbe von Olivenöl: Ist grün wirklich besser?",
      excerpt: "Das kräftige Grün von frisch gepresstem Olivenöl ist wunderschön. Doch ist die Farbe wirklich ein Zeichen für Qualität?",
      category: "Olivenöl-Informationen",
    },
    "nl": {
      slug: "kleur-olijfolie-is-groen-beter",
      title: "De kleur van olijfolie: is groen synoniem voor beter?",
      excerpt: "Het diepe groen van nieuwe olijfolie is prachtig. Maar is kleur echt een indicator van kwaliteit? De wetenschap vertelt het ons.",
      category: "Olijfolie-informatie",
    },
    "da": {
      slug: "olivenolie-farve-er-groen-bedre",
      title: "Olivenoliens farve: Er grøn altid bedst?",
      excerpt: "Den smukke grønne farve på ny olivenolie er fantastisk. Men er farven et tegn på kvalitet? Svaret vil overraske dig.",
      category: "Olivenolie-information",
    },
    "no": {
      slug: "olivenoljens-farge-er-groenn-best",
      title: "Olivenoljens farge: Er grønn alltid best?",
      excerpt: "Den vakre grønnfargen på fersk olivenolje er flott. Men er fargen et tegn på kvalitet? Svaret vil overraske deg.",
      category: "Olivenolje-informasjon",
    },
  
    "es": {
      slug: "color-del-aceite-de-oliva-es-el-verde-un-signo-de-mejor-calidad",
      title: "Color del Aceite de Oliva: ¿Es el Verde un Signo de Mejor Calidad?",
      excerpt: "El verde vibrante del aceite de oliva recién molido es hermoso. Pero ¿es el color un indicador fiable de calidad? La respuesta científica podría sorprenderte.",
      category: "Información sobre el Aceite de Oliva"
    },
    "fr": {
      slug: "couleur-de-l-huile-d-olive-le-vert-est-il-un-signe-de-meilleure-qualite",
      title: "Couleur de l'huile d'olive : le vert est-il un signe de meilleure qualité ?",
      excerpt: "Le vert éclatant de l'huile d'olive fraîchement pressée est magnifique. Mais la couleur est-elle un indicateur de qualité fiable ? La réponse scientifique pourrait vous surprendre.",
      category: "Informations sur l'huile d'olive"
    },
  },
  "info-6": {
    "it": {
      slug: "punto-di-fumo-friggere-evo",
      title: "Punto di fumo dell'olio EVO: si può friggere con l'extravergine?",
      excerpt: "La risposta è sì — e scientificamente è più corretto dell'olio di semi. Ma ci sono cose importanti da sapere sul punto di fumo e sulla stabilità all'ossidazione termica.",
      category: "Consumo corretto",
    },
    "en": {
      slug: "smoke-point-frying-with-extra-virgin-olive-oil",
      title: "Smoke Point: Can You Fry with Extra Virgin Olive Oil?",
      excerpt: "The answer is yes—and scientifically it is better than seed oils. Discover the facts about the smoke point and thermal stability.",
      category: "Proper Usage",
    },
    "de": {
      slug: "rauchpunkt-braten-mit-olivenoel-extra",
      title: "Rauchpunkt: Kann man mit Olivenöl Extra braten und frittieren?",
      excerpt: "Die Antwort ist ja – und wissenschaftlich gesehen ist es sogar stabiler als viele Pflanzenöle. Erfahren Sie die Fakten.",
      category: "Richtiges Genießen",
    },
    "nl": {
      slug: "rookpunt-frituren-met-extra-vierge-olijfolie",
      title: "Het rookpunt: Kun je frituren met extra vierge olijfolie?",
      excerpt: "Het antwoord is ja. Wetenschappelijk gezien is het zelfs stabieler dan zonnebloemolie. Ontdek het rookpunt en de feiten.",
      category: "Correct Gebruik",
    },
    "da": {
      slug: "rygepunkt-kan-man-stege-i-ekstra-jomfruolivenolie",
      title: "Rygepunkt: Kan man stege i ekstra jomfruolivenolie?",
      excerpt: "Svaret er ja – og det er faktisk sundere end de fleste planteolier. Se sandheden om rygepunktet.",
      category: "Korrekt Forbrug",
    },
    "no": {
      slug: "rygepunkt-kan-man-steke-i-ekstra-jomfruolivenolje",
      title: "Røkpunkt: Kan man steke i ekstra jomfruolivenolje?",
      excerpt: "Svaret er ja – og det er faktisk sunnere enn de fleste planteoljer. Se sannheten om røkpunktet.",
      category: "Riktig Bruk",
    },
  
    "es": {
      slug: "punto-de-humo-se-puede-freir-con-aceite-de-oliva-virgen-extra",
      title: "Punto de humo: ¿Se puede freír con aceite de oliva virgen extra?",
      excerpt: "La respuesta es sí, y científicamente es mejor que los aceites de semillas. Descubre los datos sobre el punto de humo y la estabilidad térmica.",
      category: "Uso correcto"
    },
    "fr": {
      slug: "point-de-fumee-peut-on-frire-avec-de-l-huile-d-olive-vierge-extra",
      title: "Point de fumée : Peut-on frire avec de l'huile d'olive vierge extra ?",
      excerpt: "La réponse est oui — et scientifiquement, c'est bien meilleur que les huiles de graines. Découvrez les faits sur le point de fumée et la stabilité thermique.",
      category: "Utilisation correcte"
    },
  },
  "info-7": {
    "it": {
      slug: "calorie-olio-evo-porzioni",
      title: "Quante calorie ha l'olio EVO e quali sono le porzioni consigliate",
      excerpt: "L'olio d'oliva è un grasso e fa ingrassare? Solo se ne abusi. Capire calorie e porzioni aiuta a inserirlo con intelligenza nella dieta quotidiana.",
      category: "Salute & Benessere",
    },
    "en": {
      slug: "calories-extra-virgin-olive-oil-recommended-portions",
      title: "How Many Calories in EVOO and Recommended Portions",
      excerpt: "Is extra virgin olive oil fattening? Only if you abuse it. Understanding the calories helps you enjoy it mindfully.",
      category: "Health & Wellbeing",
    },
    "de": {
      slug: "kalorien-olivenoel-extra-empfohlene-portionen",
      title: "Wie viele Kalorien hat Olivenöl Extra und was sind die Portionen?",
      excerpt: "Macht Olivenöl dick? Nur bei übermäßigem Konsum. Erfahren Sie alles über Kalorien und die empfohlenen Mengen.",
      category: "Gesundheit & Wohlbefinden",
    },
    "nl": {
      slug: "calorieen-extra-vierge-olijfolie-porties",
      title: "Hoeveel calorieën bevat olijfolie en wat zijn de aanbevolen porties?",
      excerpt: "Is olijfolie een dikmaker? Alleen bij overmatig gebruik. Ontdek de calorieën en porties.",
      category: "Gezondheid & Welzijn",
    },
    "da": {
      slug: "kalorier-ekstra-jomfruolivenolie-anbefalede-portioner",
      title: "Hvor mange kalorier er der i olivenolie, og hvor meget skal man bruge?",
      excerpt: "Er olivenolie fedende? Kun hvis du overdriver. Se kalorietallet og de anbefalede portionsstørrelser.",
      category: "Sundhed & Velvære",
    },
    "no": {
      slug: "kalorier-ekstra-jomfruolivenolje-anbefalte-porsjoner",
      title: "Hvor mange kalorier er det i olivenolje, og hvor mye bør man bruke?",
      excerpt: "Er olivenolje fetende? Bare hvis du overdriver. Se kaloritallet og anbefalte porsjonsstørrelser.",
      category: "Helse & Velvære",
    },
  
    "es": {
      slug: "cuantas-calorias-tiene-el-aove-y-porciones-recomendadas",
      title: "Cuántas Calorías tiene el AOVE y Porciones Recomendadas",
      excerpt: "¿Engorda el aceite de oliva virgen extra? Solo si se abusa de él. Comprender sus calorías te ayuda a disfrutarlo de manera consciente.",
      category: "Salud y Bienestar"
    },
    "fr": {
      slug: "combien-de-calories-dans-l-evoo-et-portions-recommandees",
      title: "Combien de calories dans l'EVOO et portions recommandées",
      excerpt: "L'huile d'olive extra vierge fait-elle grossir ? Seulement si vous en abusez. Comprendre ses calories vous aide à la savourer en toute conscience.",
      category: "Santé & Bien-être"
    },
  },
  "info-8": {
    "it": {
      slug: "olio-evo-salute-scienza-polifenoli",
      title: "Olio EVO e salute: cosa dice davvero la scienza (polifenoli e non solo)",
      excerpt: "Tutti dicono che l'olio fa bene, ma perché? Scopriamo come l'olio extravergine protegge il nostro cuore, riduce l'infiammazione e supporta una vita attiva, dati scientifici alla mano.",
      category: "Salute & Benessere",
    },
    "en": {
      slug: "olive-oil-health-benefits-science-polyphenols",
      title: "Olive Oil and Health: What Science Really Says (Polyphenols and Beyond)",
      excerpt: "Everyone says olive oil is healthy, but why? Let's explore how extra virgin olive oil protects the heart and reduces inflammation with hard scientific data.",
      category: "Health & Wellbeing",
    },
    "de": {
      slug: "olivenoel-und-gesundheit-wissenschaft-polyphenole",
      title: "Olivenöl und Gesundheit: Was sagt die Wissenschaft wirklich?",
      excerpt: "Erfahren Sie, wie natives Olivenöl Extra Ihr Herz schützt und Entzündungen hemmt – belegt durch wissenschaftliche Daten.",
      category: "Gesundheit & Wohlbefinden",
    },
    "nl": {
      slug: "olijfolie-gezondheid-wetenschap-polifenolen",
      title: "Olijfolie en gezondheid: Wat zegt de wetenschap over polifenolen?",
      excerpt: "Ontdek hoe extra vierge olijfolie het hart beschermt en ontstekingen tegengaat op basis van harde wetenschappelijke feiten.",
      category: "Gezondheid & Welzijn",
    },
    "da": {
      slug: "olivenolie-sundhed-videnskab-polyfenoler",
      title: "Olivenolie og sundhed: Hvad siger videnskaben om polyfenoler?",
      excerpt: "Læs, hvordan ekstra jomfruolivenolie beskytter dit hjerte og dæmper inflammation baseret på medicinsk forskning.",
      category: "Sundhed & Velvære",
    },
    "no": {
      slug: "olivenolie-sundhed-videnskab-polyfenoler",
      title: "Olivenolje og helse: Hva sier vitenskapen om polyfenoler?",
      excerpt: "Les hvordan ekstra jomfruolivenolje beskytter hjertet ditt og demper inflammasjon basert på medisinsk forskning.",
      category: "Helse & Velvære",
    },
  
    "es": {
      slug: "aceite-de-oliva-y-salud-lo-que-realmente-dice-la-ciencia-polifenoles-y-mas-alla",
      title: "Aceite de oliva y salud: lo que realmente dice la ciencia (polifenoles y más allá)",
      excerpt: "Todo el mundo dice que el aceite de oliva es saludable, pero ¿por qué? Exploremos cómo el aceite de oliva virgen extra protege el corazón y reduce la inflamación con datos científicos objetivos.",
      category: "Salud y Bienestar"
    },
    "fr": {
      slug: "huile-dolive-et-sante-ce-que-dit-vraiment-la-science-polyphenols-et-au-dela",
      title: "Huile d'olive et santé : ce que dit vraiment la science (polyphénols et au-delà)",
      excerpt: "Tout le monde dit que l'huile d'olive est bonne pour la santé, mais pourquoi ? Découvrez comment l'huile d'olive vierge extra protège le cœur et réduit l'inflammation grâce à des données scientifiques concrètes.",
      category: "Santé & Bien-être"
    },
  },
  "info-9": {
    "it": {
      slug: "errori-conservazione-olio-cucina",
      title: "I 7 errori più comuni nella conservazione dell'olio EVO in cucina",
      excerpt: "Vicino ai fornelli, in bottiglia trasparente, nel frigorifero: quanti errori di conservazione diffondiamo inconsapevolmente. Ecco i 7 più classici da evitare.",
      category: "Conservazione",
    },
    "en": {
      slug: "seven-common-mistakes-storing-olive-oil-kitchen",
      title: "The 7 Most Common Mistakes When Storing Olive Oil in the Kitchen",
      excerpt: "Near the stove, in transparent glass, or in the fridge: so many mistakes are made every day. Discover the 7 classic errors to avoid.",
      category: "Storage & Preservation",
    },
    "de": {
      slug: "sieben-fehler-lagerung-olivenoel-kueche",
      title: "Die 7 häufigsten Fehler bei der Lagerung von Olivenöl in der Küche",
      excerpt: "Neben dem Herd, in klarem Glas oder im Kühlschrank: Vermeiden Sie die 7 klassischen Fehler für perfekten Genuss.",
      category: "Lagerung & Aufbewahrung",
    },
    "nl": {
      slug: "zeven-fouten-bewaren-olijfolie-keuken",
      title: "De 7 meest gemaakte fouten bij het bewaren van olijfolie in de keuken",
      excerpt: "Naast het fornuis, in helder glas of in de koelkast. Ontdek de 7 klassieke fouten en hoe je ze voorkomt.",
      category: "Opslag & Bewaring",
    },
    "da": {
      slug: "syv-fejl-opbevaring-olivenolie-koekken",
      title: "De 7 mest almindelige fejl ved opbevaring af olivenolie i køkkenet",
      excerpt: "Ved siden af komfuret, i klart glas eller i køleskabet: Se de 7 klassiske fejl, du skal undgå.",
      category: "Opbevaring",
    },
    "no": {
      slug: "syv-feil-lagring-olivenolje-kjoekken",
      title: "De 7 mest vanlige feilene ved lagring av olivenolje i kjøkkenet",
      excerpt: "Ved siden av komfyren, i klart glass eller i kjøleskapet: Se de 7 klassiske feilene du må unngå.",
      category: "Lagring",
    },
  
    "es": {
      slug: "los-7-errores-mas-comunes-al-conservar-el-aceite-de-oliva-en-la-cocina",
      title: "Los 7 errores más comunes al conservar el aceite de oliva en la cocina",
      excerpt: "Cerca de los fogones, en vidrio transparente o en la nevera: se cometen muchos errores a diario. Descubre los 7 fallos clásicos que debes evitar.",
      category: "Conservación"
    },
    "fr": {
      slug: "les-7-erreurs-les-plus-courantes-lors-du-stockage-de-l-huile-d-olive-en-cuisine",
      title: "Les 7 erreurs les plus courantes lors du stockage de l'huile d'olive en cuisine",
      excerpt: "Près de la cuisinière, dans du verre transparent ou au réfrigérateur : tant d'erreurs sont commises chaque jour. Découvrez les 7 erreurs classiques à éviter.",
      category: "Stockage et conservation"
    },
  },
  "info-10": {
    "it": {
      slug: "crudo-vs-cottura-quando-usare-evo",
      title: "Crudo o in cottura: quando usare l'EVO fa davvero la differenza",
      excerpt: "Usare l'olio a crudo preserva i polifenoli. Ma in cottura è sbagliato? E quando ha senso scegliere un olio diverso? Guida pratica.",
      category: "Consumo corretto",
    },
    "en": {
      slug: "raw-vs-cooked-when-extra-virgin-olive-oil-makes-difference",
      title: "Raw or Cooked: When Using EVOO Really Makes a Difference",
      excerpt: "Using olive oil raw preserves polyphenols. But is cooking with it a mistake? A practical kitchen guide.",
      category: "Proper Usage",
    },
    "de": {
      slug: "roh-oder-gekocht-wann-olivenoel-den-unterschied-macht",
      title: "Roh oder erhitzt: Wann Olivenöl Extra wirklich den Unterschied macht",
      excerpt: "Kaltes Olivenöl schont die Polyphenole. Aber ist Erhitzen ein Fehler? Erfahren Sie die Wahrheit.",
      category: "Richtiges Genießen",
    },
    "nl": {
      slug: "rauw-of-verwarmd-wanneer-olijfolie-het-verschil-maakt",
      title: "Rauw of verwarmd: Wanneer maakt extra vierge olijfolie echt het verschil?",
      excerpt: "Rauw gebruik behoudt de polifenolen. Maar is bakken erin verkeerd? Een praktische keukengids.",
      category: "Correct Gebruik",
    },
    "da": {
      slug: "raa-eller-tilberedt-hvornaar-olivenolie-goer-forskellen",
      title: "Rå eller opvarmet: Hvornår gør ekstra jomfruolivenolie forskellen?",
      excerpt: "At bruge olien rå bevarer polyfenolerne. Men er det en fejl at stege i den? Få den praktiske guide.",
      category: "Korrekt Forbrug",
    },
    "no": {
      slug: "raa-eller-tilberedt-hvornaar-olivenolje-gjoer-forskjellen",
      title: "Rå eller oppvarmet: Når gjør ekstra jomfruolivenolje forskjellen?",
      excerpt: "Å bruke oljen rå bevarer polyfenolene. Men er det en feil å steke i den? Få den praktiske guiden.",
      category: "Riktig Bruk",
    },
  
    "es": {
      slug: "en-crudo-o-cocinado-cuando-usar-aove-marca-realmente-la-diferencia",
      title: "En crudo o cocinado: cuándo usar AOVE marca realmente la diferencia",
      excerpt: "El uso del aceite de oliva en crudo preserva los polifenoles. ¿Pero es un error cocinar con él? Una guía práctica de cocina.",
      category: "Uso correcto"
    },
    "fr": {
      slug: "cru-ou-cuit-quand-l-utilisation-de-l-evoo-fait-vraiment-la-difference",
      title: "Cru ou cuit : quand l'utilisation de l'EVOO fait vraiment la différence",
      excerpt: "L'utilisation de l'huile d'olive à cru préserve les polyphénols. Mais est-ce une erreur de cuisiner avec ? Un guide pratique de cuisine.",
      category: "Utilisation correcte"
    },
  },
  "chim-1": {
    "it": {
      slug: "composizione-chimica-olio-evo",
      title: "Composizione chimica dell'olio EVO: trigliceridi, acidi grassi e frazione insaponificabile",
      excerpt: "Un viaggio molecolare all'interno dell'oro liquido: scopriamo cosa rende l'olio EVO un capolavoro della chimica naturale.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "chemical-composition-extra-virgin-olive-oil",
      title: "Chemical Composition of Extra Virgin Olive Oil: Triglycerides and Saponifiables",
      excerpt: "A molecular journey inside liquid gold: discover what makes EVOO a masterpiece of natural chemistry.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "chemische-zusammensetzung-olivenoel-extra",
      title: "Chemische Zusammensetzung von Olivenöl Extra: Fettsäuren und Begleitstoffe",
      excerpt: "Eine molekulare Reise ins Innere des flüssigen Goldes: Was macht Olivenöl Extra zu einem Meisterwerk der Naturchemie?",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "chemische-samenstelling-extra-vierge-olijfolie",
      title: "Chemische samenstelling van olijfolie: Triglyceriden en onzeepbare fractie",
      excerpt: "Een moleculaire reis in het vloeibare goud: ontdek wat extra vierge olijfolie tot een meesterwerk van de natuur maakt.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "kemiske-sammensaetning-ekstra-jomfruolivenolie",
      title: "Kemisk sammensætning af olivenolie: Fedtsyrer og bioaktive stoffer",
      excerpt: "En molekylær rejse ind i det flydende guld: Hvad gør ekstra jomfruolivenolie så unik?",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "kjemiske-sammensetten-ekstra-jomfruolivenolje",
      title: "Kjemisk sammensetning av olivenolje: Fettsyrer og bioaktive stoffer",
      excerpt: "En molekylær reise inn i det flytende gullet: Hva gjør ekstra jomfruolivenolje så unik?",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "composicion-quimica-del-aceite-de-oliva-virgen-extra-trigliceridos-y-saponificables",
      title: "Composición química del aceite de oliva virgen extra: triglicéridos y saponificables",
      excerpt: "Un viaje molecular por el interior del oro líquido: descubre qué hace del AOVE una obra maestra de la química natural.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "composition-chimique-de-l-huile-d-olive-extra-vierge-triglycerides-et-saponifiables",
      title: "Composition chimique de l'huile d'olive extra vierge : triglycérides et saponifiables",
      excerpt: "Un voyage moléculaire au cœur de l'or liquide : découvrez ce qui fait de l'EVOO un chef-d'œuvre de la chimie naturelle.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "chim-2": {
    "it": {
      slug: "polifenoli-oleocantale-oleuropeina",
      title: "Polifenoli nell'olio EVO: oleocantale, oleuropeina e idrossitirosolo spiegati",
      excerpt: "Polifenoli nell'olio EVO: scopriamo l'oleocantale, l'oleuropeina e l'idrossitirosolo, i veri segreti della qualità dell'olio extravergine.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "polyphenols-in-olive-oil-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyphenols in Olive Oil: Oleocanthal, Oleuropein, and Hydroxytyrosol",
      excerpt: "Discover the chemistry behind high-quality EVOO. Learn how oleocanthal, oleuropein, and hydroxytyrosol protect your body and define taste.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "polyphenole-im-olivenoel-extra-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyphenole im Olivenöl: Oleocanthal, Oleuropein und Hydroxytyrosol",
      excerpt: "Erfahren Sie alles über die wertvollen Polyphenole im Olivenöl Extra – die echten Geheimnisse der Qualität.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "polifenolen-in-olijfolie-oleocanthal-oleuropeine-hydroxytyrosol",
      title: "Polifenolen in olijfolie: Oleocanthal, Oleuropeine en Hydroxytyrosol",
      excerpt: "Ontdek de actieve verbindingen die olijfolie uniek maken en hoe ze smaak en gezondheid beïnvloeden.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "polyfenoler-i-olivenolie-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyfenoler i olivenolie: Oleocanthal, Oleuropein og Hydroxytyrosol",
      excerpt: "Lær kemien bag olivenolien at kende. Hvordan beskytter disse stoffer din krop og definerer smagen?",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "polyfenoler-i-olivenolje-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyfenoler i olivenolje: Oleocanthal, Oleuropein og Hydroxytyrosol",
      excerpt: "Lær kjemien bak olivenoljen å kjenne. Hvordan beskytter disse stoffene kroppen din og definerer smaken?",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "polifenoles-en-el-aceite-de-oliva-oleocantal-oleuropeina-e-hidroxitirosol",
      title: "Polifenoles en el aceite de oliva: Oleocantal, oleuropeína e hidroxitirosol",
      excerpt: "Descubre la química detrás del AOVE de alta calidad. Aprende cómo el oleocantal, la oleuropeína y el hidroxitirosol protegen tu cuerpo y definen el sabor.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "polyphenols-dans-l-huile-d-olive-oleocanthal-oleuropeine-et-hydroxytyrosol",
      title: "Polyphénols dans l'huile d'olive : Oléocanthal, oléuropeïne et hydroxytyrosol",
      excerpt: "Découvrez la chimie derrière l'HOVE de haute qualité. Apprenez comment l'oléocanthal, l'oléuropeïne et l'hydroxytyrosol protègent votre corps et définissent le goût.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "chim-3": {
    "it": {
      slug: "profilo-acidi-grassi-olio",
      title: "Profilo degli acidi grassi: oleico, linoleico, palmitico — stabilità e gusto",
      excerpt: "Cos'hanno in comune l'acido oleico, il linoleico e il palmitico? Sono i mattoni dell'olio EVO. Capire il loro ruolo spiega stabilità, gusto e salute.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "fatty-acid-profile-olive-oil-oleic-linoleic-palmitic",
      title: "Fatty Acid Profile of Olive Oil: Oleic, Linoleic, and Palmitic Acid",
      excerpt: "Discover the building blocks of olive oil. Learn how the ratios of oleic, linoleic, and palmitic acids dictate stability, frying resistance, and taste.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "fettsaeureprofil-olivenoel-oelsaeure-linolsaeure-palmitinsaeure",
      title: "Fettsäureprofil von Olivenöl: Ölsäure, Linolsäure und Palmitinsäure",
      excerpt: "Erfahren Sie, wie das Verhältnis der Fettsäuren die Stabilität beim Erhitzen und den Wert für Ihre Gesundheit bestimmt.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "vetzuurprofiel-olijfolie-oliezuur-linolzuur-palmitinezuur",
      title: "Vetzuurprofiel van olijfolie: Oliezuur, linolzuur en palmitinezuur",
      excerpt: "Ontdek de bouwstenen van olijfolie en hoe de verhoudingen de stabiliteit en gezondheidswaarde bepalen.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "fedtsyreprofil-olivenolie-oliesyre-linolsyre-palmitinsyre",
      title: "Fedtsyreprofil i olivenolie: Oliesyre, linolsyre og palmitinsyre",
      excerpt: "Se, hvordan forholdet mellem fedtsyrerne bestemmer oliens stabilitet under opvarmning.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "fettsyreprofil-olivenolje-oljesyre-linolsyre-palmitinsyre",
      title: "Fettsyreprofil i olivenolje: Oljesyre, linolsyre og palmitinsyre",
      excerpt: "Se hvordan forholdet mellom fettsyrene bestemmer oljens stabilitet under oppvarming.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "perfil-de-acidos-grasos-del-aceite-de-oliva-acido-oleico-linoleico-y-palmitico",
      title: "Perfil de ácidos grasos del aceite de oliva: Ácido oleico, linoleico y palmítico",
      excerpt: "Descubre los componentes básicos del aceite de oliva. Aprende cómo la proporción de los ácidos oleico, linoleico y palmítico determinan la estabilidad, resistencia a la fritura y sabor.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "profil-des-acides-gras-de-l-huile-d-olive-acide-oleique-linoleique-et-palmitique",
      title: "Profil des acides gras de l'huile d'olive : Acide oléique, linoléique et palmitique",
      excerpt: "Découvrez les composants de base de l'huile d'olive. Apprenez comment les proportions d'acides oléique, linoléique et palmitique déterminent la stabilité, la résistance à la friture et le goût.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "chim-4": {
    "it": {
      slug: "numero-perossidi-che-misura",
      title: "Numero di perossidi: cos'è e cosa indica davvero nella qualità dell'olio",
      excerpt: "Il numero di perossidi è il primo indicatore di ossidazione dell'olio. Ecco come si forma, cosa misura e perché valori bassi significano olio fresco e ben fatto.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "peroxide-value-in-olive-oil-quality",
      title: "Peroxide Value in Olive Oil: Understanding Freshness and Quality",
      excerpt: "Discover what the peroxide value measures, how oxidation starts in the olive, and why low peroxide values are critical for fresh EVOO.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "peroxidzahl-olivenoel-bedeutung-qualitaet",
      title: "Peroxidzahl bei Olivenöl: Was sie über die Frische aussagt",
      excerpt: "Erfahren Sie, wie Peroxide entstehen, was sie messen und warum niedrige Werte für absolute Frische stehen.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "peroxidegetal-olijfolie-kwaliteit-betekenis",
      title: "Peroxidegetal van olijfolie: Wat betekent het voor de kwaliteit?",
      excerpt: "Het peroxidegetal is de belangrijkste graadmeter voor de beginnende veroudering van olijfolie. Ontdek de details.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "peroxidtal-olivenolie-hvad-betyder-det",
      title: "Peroxidtal i olivenolie: Hvad måler det, og hvorfor er det vigtigt?",
      excerpt: "Peroxidtallet er den første indikator for oliens oxidation. Se grænserne og de ideelle værdier.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "peroksidtall-olivenolje-hva-betyr-det",
      title: "Peroksidtall i olivenolje: Hva måler det, og hvorfor er det viktig?",
      excerpt: "Peroksidtallet er den første indikatoren på oljens oksidasjon. Se grensene og de ideelle verdiene.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "indice-de-peroxidos-en-el-aceite-de-oliva-comprender-la-frescura-y-la-calidad",
      title: "Índice de peróxidos en el aceite de oliva: comprender la frescura y la calidad",
      excerpt: "Descubre qué mide el índice de peróxidos, cómo comienza la oxidación en la aceituna y por qué los valores bajos de peróxidos son críticos para un AOVE fresco.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "indice-de-peroxydes-dans-lhuile-dolive-comprendre-la-fraicheur-et-la-qualite",
      title: "Indice de peroxydes dans l'huile d'olive : comprendre la fraîcheur et la qualité",
      excerpt: "Découvrez ce que mesure l'indice de peroxydes, comment l'oxydation commence dans l'olive, et pourquoi des indices bas sont essentiels pour une HOVE fraîche.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "chim-5": {
    "it": {
      slug: "k232-k270-cosa-misurano",
      title: "K232 e K270: cosa misurano e perché indicano la qualità dell'olio",
      excerpt: "I coefficienti di estinzione UV sono forse i parametri più tecnici dell'analisi dell'olio. Ecco cosa misurano, come si leggono e perché contano.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "k232-k270-uv-extinction-coefficients-olive-oil",
      title: "K232 and K270: What UV Extinction Coefficients Measure in Olive Oil",
      excerpt: "UV spectrophotometric indicators are crucial for detecting old or adulterated oil. Understand K232, K270, and Delta-K values.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "k232-k270-uv-extinktionskoeffizienten-olivenoel",
      title: "K232 und K270: Die UV-Spektrophotometrie bei Olivenöl erklärt",
      excerpt: "Erfahren Sie, was diese Werte messen, wie man sie liest und warum sie die chemische Reinheit des Öls garantieren.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "k232-en-k270-uv-extinctiecoefficienten-olijfolie",
      title: "K232 en K270: Wat meten de UV-waarden in olijfolie?",
      excerpt: "De K-waarden zijn de meest technische parameters om de ouderdom en puurheid van extra vierge olijfolie te bewijzen.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "k232-og-k270-uv-absorptionskoefficienter-olivenolie",
      title: "K232 og K270: Hvad måler disse værdier i olivenolien?",
      excerpt: "K-værdierne måler oliens lysabsorption og afslører, om den er frisk, gammel eller blandet med raffineret olie.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "k232-og-k270-uv-absorpsjonskoeffisienter-olivenolje",
      title: "K232 og K270: Hva måler disse verdiene i olivenoljen?",
      excerpt: "K-verdiene måler oljens lysabsorpsjon og avslører om den er fersk, gammel eller blandet med raffinert olje.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "k232-y-k270-que-miden-los-coeficientes-de-extincion-ultravioleta-en-el-aceite-de-oliva",
      title: "K232 y K270: qué miden los coeficientes de extinción ultravioleta en el aceite de oliva",
      excerpt: "Los indicadores espectrofotométricos UV son cruciales para detectar aceites viejos o adulterados. Entienda los valores K232, K270 y Delta-K.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "k232-et-k270-ce-que-mesurent-les-coefficients-d-extinction-uv-dans-l-huile-d-olive",
      title: "K232 et K270 : ce que mesurent les coefficients d'extinction UV dans l'huile d'olive",
      excerpt: "Les indicateurs spectrophotométriques UV sont cruciaux pour détecter les huiles vieilles ou frelatées. Comprendre les valeurs K232, K270 et Delta-K.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "chim-6": {
    "it": {
      slug: "gramolazione-chimica-aroma",
      title: "Gramolazione: cosa succede chimicamente e come influenza l'aroma dell'olio",
      excerpt: "La gramolazione è la fase più critica e meno conosciuta dell'estrazione dell'olio. Temperatura e durata determinano il profilo polifenolico e aromatico finale.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "malaxation-chemistry-extra-virgin-olive-oil-aroma",
      title: "Malaxation: The Chemistry and Science of Olive Oil Aromas",
      excerpt: "Malaxation is the most critical step in milling. Discover how temperature and time dictate the final polyphenol and aroma profiles of EVOO.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "kneten-der-olivenpaste-chemie-aroma",
      title: "Die Knetung (Gramulation) der Olivenpaste: Entstehung der Aromen",
      excerpt: "Erfahren Sie, wie Temperatur und Dauer in dieser entscheidenden Phase das Aroma und die Polyphenole des Öls bestimmen.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "mengen-van-olijfpasta-gramolatie-chemie-aroma",
      title: "Gramolatie (mengen van olijfpasta): De chemie achter het aroma",
      excerpt: "De gramolatie is de meest kritische fase in het frantoio. Temperatuur en duur bepalen de polifenolen en aroma's.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "æltning-af-olivenpasta-kemi-og-aroma",
      title: "Æltning af olivenpasta (Malaxation): Kemien bag duften",
      excerpt: "Æltningen er det mest kritiske trin i presningen. Temperatur og varighed afgør polyfenoler og aroma.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "eltning-av-olivenpasta-kjemie-og-aroma",
      title: "Elting av olivenpasta (Malaxation): Kjemien bak duften",
      excerpt: "Eltningen er det mest kritiske trinnet i pressingen. Temperatur og varighet avgjør polyfenoler og aroma.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "batido-la-quimica-y-la-ciencia-de-los-aromas-del-aceite-de-oliva",
      title: "Batido: la química y la ciencia de los aromas del aceite de oliva",
      excerpt: "El batido es el paso más crítico de la molienda. Descubra cómo la temperatura y el tiempo determinan los perfiles finales de polifenoles y aromas del AOVE.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "malaxage-la-chimie-et-la-science-des-aromes-de-l-huile-d-olive",
      title: "Malaxage : la chimie et la science des arômes de l'huile d'olive",
      excerpt: "Le malaxage est l'étape la plus critique du pressage. Découvrez comment la température et le temps dictent les profils finaux de polyphénols et d'arômes de l'EVOO.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "chim-7": {
    "it": {
      slug: "filtrazione-olio-effetti-stabilita",
      title: "Filtrazione dell'olio EVO: effetti su acqua, enzimi, fermentazioni e stabilità",
      excerpt: "La filtrazione non è solo questione di aspetto. Ha effetti profondi sulla stabilità microbiologica e chimica dell'olio nel tempo. Ecco come e perché.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "extra-virgin-olive-oil-filtration-stability-effects",
      title: "Filtration of EVOO: Effects on Water, Enzymes, and Stability",
      excerpt: "Filtration is not just about appearance. It removes suspended water and active enzymes, dramatically improving the oil's shelf-life.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "filtrierung-von-olivenoel-effekte-stabilitaet",
      title: "Filtrierung von Olivenöl Extra: Effekte auf Wasser, Enzyme und Haltbarkeit",
      excerpt: "Die Filtrierung ist keine reine Ästhetik. Sie entfernt Wasser und Enzyme und schützt das Öl vor dem Verderb.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "filtratie-van-olijfolie-stabiliteit-effecten",
      title: "Filtratie van olijfolie: Effecten op water, enzymen en houdbaarheid",
      excerpt: "Filtratie is niet alleen esthetisch. Het verwijdert water en actieve enzymen, wat de houdbaarheid aanzienlijk verlengt.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "filtrering-af-olivenolie-effekt-paa-holdbarhed",
      title: "Filtrering af olivenolie: Betydning for vand, enzymer og holdbarhed",
      excerpt: "Filtrering er ikke kun for udseendets skyld. Det fjerner vand og enzymer, hvilket forlænger holdbarheden markant.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "filtrering-av-olivenolje-betydning-for-holdbarhet",
      title: "Filtrering av olivenolje: Betydning for vann, enzymer og holdbarhet",
      excerpt: "Filtrering er ikke bare for utseendets skyld. Det fjerner vann og enzymer, noe som forlenger holdbarheten markant.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "filtracion-del-aove-efectos-sobre-el-agua-las-enzimas-y-la-estabilidad",
      title: "Filtración del AOVE: efectos sobre el agua, las enzimas y la estabilidad",
      excerpt: "La filtración no es solo una cuestión de aspecto. Elimina el agua en suspensión y las enzimas activas, mejorando drásticamente la vida útil del aceite.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "filtration-de-l-evoo-effets-sur-l-eau-les-enzymes-et-la-stabilite",
      title: "Filtration de l'EVOO : effets sur l'eau, les enzymes et la stabilité",
      excerpt: "La filtration n'est pas seulement une question d'apparence. Elle élimine l'eau en suspension et les enzymes actives, améliorant considérablement la durée de conservation de l'huile.",
      category: "Chimie de l'Huile d'Olive"
    },
  },

  "tec-1": {
    "it": {
      slug: "nmr-olio-oliva-analisi",
      title: "NMR dell'olio di oliva: ¹H e ¹³C spettroscopia per autenticazione e adulterazione",
      excerpt: "La risonanza magnetica nucleare è oggi uno degli strumenti più potenti per l'autenticazione dell'olio EVO. ¹H-NMR e ¹³C-NMR rivelano composizione in acidi grassi, presenza di adulteranti e origine geografica.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "nmr-spectroscopy-olive-oil-authentication-adulteration",
      title: "NMR of Olive Oil: ¹H and ¹³C Spectroscopy for Authentication and Adulteration Detection",
      excerpt: "Nuclear Magnetic Resonance is today one of the most powerful tools for EVOO authentication. ¹H-NMR and ¹³C-NMR reveal fatty acid composition, adulterants, and geographic origin.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "nmr-spektroskopie-olivenoel-authentifizierung-verfaelschung",
      title: "NMR-Spektroskopie bei Olivenöl: ¹H- und ¹³C-NMR zur Authentifizierung und Verfälschungsanalyse",
      excerpt: "Die magnetische Kernresonanz ist heute eines der stärksten Instrumente zur Olivenöl-Authentifizierung. ¹H-NMR und ¹³C-NMR zeigen die Fettsäuren und Herkunft.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "nmr-spectroscopie-olijfolie-authenticatie-adulteratie",
      title: "NMR van olijfolie: ¹H- en ¹³C-spectroscopie voor authenticatie en adulteratie",
      excerpt: "Kernspinresonantie is vandaag een van de krachtigste instrumenten voor extra vierge olijfolie-authenticatie. ¹H-NMR en ¹³C-NMR tonen vetzuursamenstelling en geografische herkomst.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "nmr-spektroskopi-olivenolie-autentificering",
      title: "NMR af olivenolie: ¹H og ¹³C spektroskopi til autentificering og påvisning af forfalskning",
      excerpt: "Kernebiomagnetisk resonans (NMR) er i dag et af de stærkeste værktøjer til autentificering af olivenolie. ¹H-NMR og ¹³C-NMR afslører fedtsyreprofil og oprindelse.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "nmr-spektroskopi-olivenolje-autentisering",
      title: "NMR av olivenolje: ¹H og ¹³C spektroskopi for autentisering og påvisning av forfalskning",
      excerpt: "Kjernefysisk magnetisk resonans (NMR) er i dag et av de sterkeste verktøyene for autentisering av ekstra jomfruolivenolje. ¹H-NMR og ¹³C-NMR avslører fettsyreprofil og opprinnelse.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "rmn-del-aceite-de-oliva-espectroscopia-de-1h-y-13c-para-autenticacion-y-deteccion-de-adulteraciones",
      title: "RMN del aceite de oliva: Espectroscopia de ¹H y ¹³C para la autenticación y detección de adulteraciones",
      excerpt: "La resonancia magnética nuclear es hoy en día una de las herramientas más potentes para la autenticación del AOVE. La RMN-¹H y la RMN-¹³C revelan la composición de ácidos grasos, los adulterantes y el origen geográfico.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "rmn-de-lhuile-dolive-spectroscopie-1h-et-13c-pour-lauthentification-et-la-detection-des-adulterations",
      title: "RMN de l'huile d'olive : Spectroscopie ¹H et ¹³C pour l'authentification et la détection des adultérations",
      excerpt: "La Résonance Magnétique Nucléaire est aujourd'hui l'un des outils les plus puissants pour l'authentification de l'HOVE. La RMN-¹H et la RMN-¹³C révèlent la composition en acides gras, les adultérants et l'origine géographique.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "tec-2": {
    "it": {
      slug: "spettrometria-massa-olio-oliva-gcms-lcms",
      title: "Spettrometria di massa dell'olio di oliva: GC-MS per volatili, LC-MS per polifenoli",
      excerpt: "GC-MS per i composti volatili e LC-MS/MS per il profilo polifenolico: due tecniche che insieme forniscono un ritratto molecolare completo dell'olio EVO, dalla C6 verde all'oleocantale.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "olive-oil-mass-spectrometry-gc-ms-lc-ms",
      title: "Mass Spectrometry of Olive Oil: GC-MS for Volatiles, LC-MS for Polyphenols",
      excerpt: "GC-MS for volatile compounds and LC-MS/MS for the polyphenol profile: two techniques that together provide a complete molecular portrait of EVOO.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "massenspektrometrie-olivenoel-gcms-lcms",
      title: "Massenspektrometrie von Olivenöl: GC-MS für Aromastoffe, LC-MS für Polyphenole",
      excerpt: "GC-MS für flüchtige Verbindungen und LC-MS/MS für das Polyphenolprofil: Zwei Techniken, die zusammen ein vollständiges molekulares Porträt zeichnen.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "massaspectrometrie-olijfolie-gcms-lcms",
      title: "Massaspectrometrie van olijfolie: GC-MS voor aromastoffen, LC-MS voor polifenolen",
      excerpt: "GC-MS voor vluchtige verbindingen en LC-MS/MS voor het polifenolenprofiel: twee technieken die samen een compleet moleculair portret schetsen.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "massespektrometri-olivenolie-gc-ms-lc-ms",
      title: "Massespektrometri af olivenolie: GC-MS til flygtige stoffer, LC-MS til polyfenoler",
      excerpt: "GC-MS til flygtige forbindelser og LC-MS/MS til polyfenolprofilen: To teknikker, der tilsammen tegner et komplet molekylært portræt af ekstra jomfruolivenolie.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "massespektrometri-olivenolje-gc-ms-lc-ms",
      title: "Massespektrometri av olivenolje: GC-MS for flyktige forbindelser, LC-MS for polyfenoler",
      excerpt: "GC-MS for flyktige forbindelser og LC-MS/MS for polyfenolprofilen: to teknikker som til sammen gir et komplett molekylært portrett av ekstra jomfruolivenolje.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "espectrometria-de-masas-del-aceite-de-oliva-gc-ms-para-compuestos-volatiles-y-lc-ms-para-polifenoles",
      title: "Espectrometría de masas del aceite de oliva: GC-MS para compuestos volátiles y LC-MS para polifenoles",
      excerpt: "¿Qué hay detrás de siglas como GC-MS y LC-MS? Descubramos de forma sencilla cómo la ciencia analiza las moléculas del aceite de oliva para garantizar los aromas, los beneficios para la salud y la autenticidad.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "spectrometrie-de-masse-de-l-huile-d-olive-gc-ms-pour-les-volatils-lc-ms-pour-les-polyphenols",
      title: "Spectrométrie de masse de l'huile d'olive : GC-MS pour les volatils, LC-MS pour les polyphénols",
      excerpt: "Qu'y a-t-il derrière les acronymes comme GC-MS et LC-MS ? Découvrons en termes simples comment la science analyse les molécules de l'huile d'olive pour en garantir les arômes, les bienfaits pour la santé et l'authenticité.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "tec-3": {
    "it": {
      slug: "metodi-iso-analisi-olio-oliva",
      title: "Metodi ISO per l'analisi dell'olio di oliva: da ISO 660 a ISO 27107 — guida completa",
      excerpt: "ISO 660, 662, 3960, 3961, 5509, 11701, 27107: i metodi ufficiali per l'analisi dell'olio d'oliva spiegati in dettaglio, con principio chimico, procedura e limiti di legge applicabili.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "iso-methods-olive-oil-analysis-guide",
      title: "ISO Methods for Olive Oil Analysis: From ISO 660 to ISO 27107—A Complete Guide",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: the official methods for olive oil analysis explained in detail, including chemical principles, procedures, and legal limits.",
      category: "Olive Oil Chemistry",
    },
    "de": {
      slug: "iso-methoden-olivenoel-analyse-leitfaden",
      title: "ISO-Methoden zur Olivenölanalyse: Von ISO 660 bis ISO 27107—Ein kompletter Leitfaden",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: Die offiziellen Methoden zur Analyse von Olivenöl im Detail erklärt, inklusive chemischer Prinzipien und Grenzwerte.",
      category: "Olivenölchemie",
    },
    "nl": {
      slug: "iso-methoden-olijfolie-analyse-gids",
      title: "ISO-methoden voor olijfolie-analyse: van ISO 660 tot ISO 27107—een complete gids",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: de officiële methoden voor olijfolie-analyse in detail uitgelegd, inclusief chemische principes, procedures en wettelijke limieten.",
      category: "Olijfoliechemie",
    },
    "da": {
      slug: "iso-metoder-til-olivenolieanalyse-guide",
      title: "ISO-metoder til olivenolieanalyse: Fra ISO 660 til ISO 27107—En komplet guide",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: De officielle metoder til olivenolieanalyse forklaret i detaljer, herunder kemiske principper, procedurer og lovmæssige grænser.",
      category: "Olivenoliekemi",
    },
    "no": {
      slug: "iso-metoder-for-olivenoljeanalyse-guide",
      title: "ISO-metoder for olivenoljeanalyse: Fra ISO 660 til ISO 27107—En komplett guide",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: De offisielle metodene for olivenoljeanalyse forklart i detalj, inkludert kjemiske prinsipper, prosedyrer og lovbestemte grenser.",
      category: "Olivenoljekjemi",
    },
  
    "es": {
      slug: "metodos-iso-para-el-analisis-del-aceite-de-oliva-de-la-iso-660-a-la-iso-27107-una-guia-completa",
      title: "Métodos ISO para el análisis del aceite de oliva: de la ISO 660 a la ISO 27107—Una guía completa",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: los métodos oficiales para el análisis del aceite de oliva explicados al detalle, incluyendo principios químicos, procedimientos y límites legales.",
      category: "Química del Aceite de Oliva"
    },
    "fr": {
      slug: "methodes-iso-pour-l-analyse-de-l-huile-d-olive-de-l-iso-660-a-l-iso-27107-un-guide-complet",
      title: "Méthodes ISO pour l'analyse de l'huile d'olive : de l'ISO 660 à l'ISO 27107—Un guide complet",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107 : les méthodes officielles pour l'analyse de l'huile d'olive expliquées en détail, y compris les principes chimiques, les procédures et les limites légales.",
      category: "Chimie de l'Huile d'Olive"
    },
  },
  "glos-1": {
    "it": {
      slug: "glossario-olio-evo",
      title: "Glossario dell'olio EVO: fruttato, amaro, piccante, difetti, gramolazione e altro",
      excerpt: "Tutti i termini dell'universo dell'olio extravergine spiegati in modo semplice. Dal fruttato al Panel Test, dalla morchia alla cultivar.",
      category: "Informazioni sull'olio EVO",
    },
    "en": {
      slug: "extra-virgin-olive-oil-glossary",
      title: "EVOO Glossary: Fruity, Bitter, Pungent, Defects, Malaxation, and More",
      excerpt: "All the terms of the extra virgin olive oil world explained simply. From fruity to Panel Test, from sediment to cultivar.",
      category: "Olive Oil Information",
    },
    "de": {
      slug: "olivenoel-extra-vergine-glossar",
      title: "Olivenöl-Glossar: Fruchtig, bitter, scharf, Mängel, Kneten und mehr",
      excerpt: "Alle Begriffe aus der Welt des nativen Olivenöls extra einfach erklärt. Von fruchtig bis Panel-Test, von Bodensatz bis Sorte.",
      category: "Olivenöl-Informationen",
    },
    "nl": {
      slug: "extra-vierge-olijfolie-glossarium",
      title: "Extra Vierge Olijfolie Glossarium: Fruitig, bitter, pittig, defecten en meer",
      excerpt: "Alle termen uit de wereld van extra vierge olijfolie eenvoudig uitgelegd. Van fruitig tot Panel Test, van bezinksel tot cultivar.",
      category: "Olijfolie-informatie",
    },
    "da": {
      slug: "ekstra-jomfruolivenolie-ordbog",
      title: "Ordliste for ekstra jomfruolivenolie: Frugtig, bitter, skarp, fejl og mere",
      excerpt: "Alle begreber inden for ekstra jomfruolivenolie forklaret på en enkel måde. Fra frugtig til Panel Test, fra bundfald til cultivar.",
      category: "Olivenolie-information",
    },
    "no": {
      slug: "ekstra-jomfruolivenolje-ordbok",
      title: "Ordliste for ekstra jomfruolivenolje: Fruktig, bitter, skarp, feil og mer",
      excerpt: "Alle begreper innen ekstra jomfruolivenolje forklart på en omhyggelig måte. Fra fruktig til Panel Test, fra bunnfall til cultivar.",
      category: "Olivenolje-informasjon",
    },
  
    "es": {
      slug: "glosario-del-aove-frutado-amargo-picante-defectos-batido-y-mas",
      title: "Glosario del AOVE: frutado, amargo, picante, defectos, batido y más",
      excerpt: "Todos los términos del mundo del aceite de oliva virgen extra explicados de forma sencilla. Del frutado al Panel Test, del poso a la variedad.",
      category: "Información sobre el Aceite de Oliva"
    },
    "fr": {
      slug: "glossaire-de-l-huile-d-olive-extra-vierge-fruite-amer-piquant-defauts-malaxation-et-plus",
      title: "Glossaire de l'huile d'olive extra vierge : fruité, amer, piquant, défauts, malaxation et plus",
      excerpt: "Tous les termes du monde de l'huile d'olive extra vierge expliqués simplement. Du fruité au Panel Test, de la lie au cultivar.",
      category: "Informations sur l'huile d'olive"
    },
  },
};
