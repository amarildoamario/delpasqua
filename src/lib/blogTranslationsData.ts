export interface BlogTranslation {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  content?: string;
}

export type Locale = 'it' | 'en' | 'de' | 'nl' | 'da' | 'no';

export const BLOG_POST_TRANSLATIONS: Record<string, Record<Locale, BlogTranslation>> = {
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
  },
};
