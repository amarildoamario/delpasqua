import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# ----------------- BLOCK 1: post-use-2 -----------------
start_marker_1 = '"post-use-2": {'
end_marker_1 = '  "ric-1": {'

start_idx_1 = content.find(start_marker_1)
end_idx_1 = content.find(end_marker_1)

if start_idx_1 == -1 or end_idx_1 == -1:
    print("Block 1 Markers not found!")
    exit(1)

new_block_1 = """"post-use-2": {
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
      content: `## Praise for raw simplicity

New olive oil is a special moment: when it comes out of the mill, it has a more intense, greener, livelier voice. It is the kind of oil that does not want to "accompany" the dish: it wants to be noticed. And to allow it to stay that way, there is one simple rule that is more important than any other: **do not put it on the stove**.

Heat does not make the oil bad, but it takes away exactly what makes it unique in this phase: the most delicate aromas and that kick you feel between bitter and spicy. If you respect it, new oil rewards you with an experience that only lasts a few months a year.

## How to use it without ruining the magic

The trick is to treat it as a "finish": you add it when the dish is ready, perhaps still hot, but off the heat. This way, the oil opens up, releases its aroma, and remains the protagonist without losing too much along the way.

And if you really want to taste it, every now and then make a simple gesture: a piece of warm bread, a pinch of salt, and a drizzle of oil. That is it. It is a small ritual, but it teaches you in an instant what freshness means.

## Pairings that make it shine

New oil loves simplicity: toasted bread, legumes, potatoes, bitter vegetables. On simple soups, it does something beautiful: it adds depth and makes the dish complete. And with vegetables that have a more decisive flavor (chicory, black cabbage, radicchio), it creates a contrast that feels like it was made on purpose.

If, on the other hand, you have a particularly intense new oil, you can also "tame" it with soft foods: a chickpea puree, a burrata, a creamy soup. Not to hide it, but to make it stand out even more.

> New oil does not need to be "explained": it must be tasted. And raw, it tells you everything.

:::cta
Book the new season oil of the next campaign
Available from October — limited quantities.
[Book now](/shop)
:::`,
    },
    "de": {
      slug: "frisches-olivenoel-jahrgang-roh-geniessen",
      title: "Frisches Olivenöl des Jahrgangs: Wie man es am besten roh genießt",
      excerpt: "Es gibt nur eine unumstößliche Regel, wenn das Öl frisch, smaragdgrün und extrem reich an Polyphenolen ist: Keine Hitze!",
      category: "Richtiges Genießen",
      content: `## Lob der rohen Einfachheit

Frisches Olivenöl des neuen Jahrgangs ist ein besonderer Moment: Wenn es aus der Mühle kommt, hat es eine intensivere, grünere, lebendigere Stimme. Es ist die Art von Öl, die das Gericht nicht nur begleiten, sondern auffallen möchte. Und damit das so bleibt, gibt es eine einfache Regel, die wichtiger ist als jede andere: **Bringen Sie es nicht auf den Herd**.

Hitze macht das Öl zwar nicht schlecht, aber sie entzieht ihm genau das, was es in dieser Phase so einzigartig macht: die zartesten Aromen und den spürbaren Kick zwischen Bitterkeit und Schärfe. Wenn Sie es respektieren, belohnt Sie das frische Öl mit einem Erlebnis, das es nur wenige Monate im Jahr gibt.

## Wie man es verwendet, ohne den Zauber zu verderben

Der Trick besteht darin, es als „Finish“ zu behandeln: Sie fügen es hinzu, wenn das Gericht fertig und vielleicht noch heiß ist, aber vom Herd genommen wurde. Auf diese Weise entfaltet das Öl sein Aroma, duftet wunderbar und bleibt der Hauptdarsteller, ohne unterwegs zu viel zu verlieren.

Und wenn Sie es wirklich intensiv schmecken möchten, machen Sie ab und zu eine einfache Geste: Ein Stück warmes Brot, eine Prise Salz und ein Schuss Olivenöl. Fertig. Es ist ein kleines Ritual, aber es lehrt Sie im Handumdrehen, was Frische wirklich bedeutet.

## Kombinationen, die es zum Glänzen bringen

Frisches Olivenöl liebt die Einfachheit: geröstetes Brot, Hülsenfrüchte, Kartoffeln, bittere Gemüse. Auf einfachen Suppen bewirkt es etwas Wunderschönes: Es verleiht Tiefe und rundet das Gericht perfekt ab. Und zu Gemüsesorten mit kräftigerem Geschmack (Chicorée, Schwarzkohl, Radicchio) bildet es einen wunderbaren Kontrast.

Wenn Sie hingegen ein besonders intensives frisches Öl haben, können Sie es auch mit milden Speisen „zähmen“: Einem Kichererbsenpüree, einer Burrata oder einer Cremesuppe. Nicht, um es zu verstecken, sondern um es noch mehr hervorzuheben.

> Frisches Olivenöl muss nicht „erklärt“ werden: Man muss es verkosten. Und roh erzählt es Ihnen alles.

:::cta
Reservieren Sie das neue Öl der nächsten Ernte
Verfügbar ab Oktober – begrenzte Mengen.
[Jetzt reservieren](/shop)
:::`,
    },
    "nl": {
      slug: "verse-nieuwe-olijfolie-rauw-gebruiken",
      title: "Verse nieuwe olijfolie: hoe je deze het beste rauw gebruikt",
      excerpt: "Er is slechts één onomstotelijke regel wanneer de olijfolie vers, smaragdgroen en rijk aan polifenolen is: geen vuur!",
      category: "Correct Gebruik",
      content: `## Lofzang op de pure eenvoud

Nieuwe olijfolie is een speciaal moment: wanneer hij uit de pers komt, heeft hij een intensere, groenere en levendigere stem. Dit is het soort olie dat niet zomaar "gezelschap" wil houden aan het gerecht: hij wil opgemerkt worden. En om hem zo te laten blijven, is er één simpele regel die belangrijker is dan alle andere: **zet hem niet op het vuur**.

Warmte maakt de olie niet per definitie slecht, maar het ontneemt hem precies wat hem in deze fase zo uniek maakt: de meest delicate aroma's en de prikkeling die je voelt tussen bitter en scherp. Als je hem met respect behandelt, beloont nieuwe olie je met een ervaring die slechts een paar maanden per jaar duurt.

## Hoe te gebruiken zonder de magie te verpesten

De truc is om het te behandelen als een "finishing touch": je voegt het toe als het gerecht klaar is, misschien nog heet, maar van het vuur af. Zo opent de olie zich, gaat geuren en blijft hij de hoofdrol spelen zonder onderweg te veel te verliezen.

And en als je het echt wilt proeven, maak dan af en toe een eenvoudig gebaar: een stukje warm brood, een snufje zout en een scheutje olie. Klaar. Het is een klein ritueel, maar het leert je in een oogwenk wat versheid betekent.

## Combinaties die hem laten schitteren

Nieuwe olie houdt van eenvoud: geroosterd brood, peulvruchten, aardappelen, bittere groenten. Op eenvoudige soepen doet hij iets prachtigs: hij voegt diepte toe en maakt het gerecht compleet. En met groenten met een sterkere smaak (chicorei, boerenkool, radicchio) creëert hij een prachtig contrast.

Als je daarentegen een bijzonder intense nieuwe olie hebt, kun je deze ook "temmen" met zachte gerechten: een kikkererwtenpuree, een burrata of een romige soep. Niet om hem te verbergen, maar om hem juist nog meer te laten opvallen.

> Nieuwe olie hoeft niet te worden "uitgelegd": je moet hem proeven. En rauw vertelt hij je alles.

:::cta
Reserveer de nieuwe olijfolie van de volgende oogst
Beschikbaar vanaf oktober — beperkte hoeveelheid.
[Nu reserveren](/shop)
:::`,
    },
    "da": {
      slug: "frisk-ny-sæson-olivenolie-nyd-den-raa",
      title: "Frisk ny sæson olivenolie: Sådan fremhæver du den rå",
      excerpt: "Der er kun én uomtvistelig regel, når olivenolien er helt frisk, smaragdgrøn og fyldt med polyfenoler: ingen varme!",
      category: "Korrekt Forbrug",
      content: `## Hyldest til den rå enkelhed

Helt frisk olivenolie er et særligt øjeblik: Når den kommer ud af pressen, har den en mere intens, grønnere og mere levende stemme. Det er den slags olie, der ikke bare vil være "tilbehør" til retten: Den vil bemærkes. Og for at lade den forblive sådan, er der én simpel regel, der gælder mere end alle andre: **Sæt den ikke på blusset**.

Varme gør ikke olien dårlig, men den fjerner præcis det, der gør den unik i denne fase: De mest delikate aromaer og det spark, du mærker mellem det bitre og det pikante. Hvis du respekterer den, belønner den friske olie dig med en oplevelse, der kun varer få måneder om året.

## Sådan bruger du den uden at ødelægge magien

Tricket er at behandle den som en "finish": Du tilføjer den, når retten er klar, måske stadig varm, men taget af varmen. Så åbner olien sig, dufter og forbliver hovedpersonen uden at miste for meget undervejs.

Og hvis du virkelig vil smage den, så lav af og til en helt enkel gestus: Et stykke lunt brød, et drys salt og en ring af olivenolie. Færdig. Det er et lille ritual, men det lærer dig på et øjeblik, hvad friskhed betyder.

## Parringer, der får den til at stråle

Helt frisk olivenolie elsker enkelhed: Ristet brød, bælgfrugter, kartofler, bitre grøntsager. På enkle supper gør den noget smukt: Den tilføjer dybde og fuldender retten. Og med grøntsager med en mere markant smag (cikorie, grønkål, radichio) skaber den en perfekt kontrast.

Hvis du derimod har en særligt intens frisk olie, kan du også "tæmme" den med bløde madvarer: En kikærtepuré, en burrata eller en cremet suppe. Ikke for at skjule den, men for at få den til at træde endnu tydeligere frem.

> Helt frisk olivenolie skal ikke "forklares": Den skal smages. Og rå fortæller den alt.

:::cta
Reserver den friske olivenolie fra næste høst
Tilgængelig fra oktober – begrænsede mængder.
[Reserver nu](/shop)
:::`,
    },
    "no": {
      slug: "frisk-ny-sesong-olivenolje-nyt-den-raa",
      title: "Frisk ny sesong olivenolje: Hvordan best nyte den rå",
      excerpt: "Det er bare én ubestridelig regel når oljen er fersk, smaragdgrønn og rik på polyfenoler: hold den unna varme!",
      category: "Lagring",
      content: `## Hyllest til den rå enkelheten

Helt fersk olivenolje er et spesielt øyeblikk: Når den kommer ut av pressen, har den en mer intens, grønnere og mer levende stemme. Det er den typen olje som ikke bare vil være "tilbehør" til retten: Den vil bli lagt merke til. Og for å la den forbli slik, er det én enkel regel som gjelder mer enn alle andre: **Ikke sett den på varmen**.

Varme gjør ikke oljen dårlig, men den fjerner akkurat det som gjør den unik i denne fasen: De mest delikate aromaene og det sparket du mjenner mellom det bitre og det pikante. Hvis du respekterer den, belønner den ferske oljen deg med en opplevelse som bare varer noen få måneder i året.

## Slik bruker du den uten å ødelegge magien

Trikset er å behandle den som en "finish": Du tilsetter den når retten er klar, kanskje fortsatt varm, men tatt av varmen. Slik åpner oljen seg, dufter og forblir hovedpersonen uten å mister for mye underveis.

Og hvis du virkelig vil smake den, kan du av og til gjøre en helt enkel gest: Et stykke lunt brød, et dryss salt og en stripe olivenolje. Ferdig. Det er et lite rituale, men det lærer deg på et øyeblikk hva friskhet betyr.

## Parringer som får den til å stråle

Helt fersk olivenolje elsker enkelhet: Ristet brød, belgfrukter, poteter, bitre grønnsaker. På enkle supper gjør den noe vakkert: Den tilfører dybde og fullfører retten. Og med grønnsaker med en mer markert smak (sikori, grønnkål, radicchio) skaper den en perfekt kontrast.

Hvis du derimot har en spesielt intens fersk olje, kan du også "temme" den med myke matvarer: En kikerterpuré, en burrata eller en kremet suppe. Ikke for å skjule den, men for å få den til å fremtre enda tydeligere.

> Helt fersk olivenolje skal ikke "forklares": Den skal smakes. Og rå forteller den alt.

:::cta
Reserver den ferske olivenoljen fra neste høst
Tilgjengelig fra oktober – begrensede mengder.
[Reserver nå](/shop)
:::`,
    },
  },
  """

content = content[:start_idx_1] + new_block_1 + content[end_idx_1:]

# ----------------- BLOCK 2: ric-1 and ric-2 -----------------
# Let's locate the markers again in the modified content!
start_marker_2 = '  "ric-1": {'
end_marker_2 = '  "ric-3": {'

start_idx_2 = content.find(start_marker_2)
end_idx_2 = content.find(end_marker_2)

if start_idx_2 == -1 or end_idx_2 == -1:
    print("Block 2 Markers not found!")
    exit(1)

print(f"Replacing block 2 of length {end_idx_2 - start_idx_2} characters.")

new_block_2 = """  "ric-1": {
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
      content: `## Bruschetta as a blank canvas

Bruschetta is the purest test for an EVOO. Toasted bread, perhaps rubbed with garlic, fresh tomatoes in summer—and then the oil. There is nothing to hide behind a complex sauce. The oil is the absolute protagonist.

## The three profiles to pair

### 1. Light fruity — for delicate bruschettas

Ideal pairing with:
- Very ripe and sweet tomatoes (datterino, summer beefsteak tomatoes)
- Buffalo mozzarella or stracciatella
- Zucchini flowers

*Why it works*: light fruity oil does not overpower the sweetness of the ripe tomato. It creates harmony, not contrast.

### 2. Medium fruity — the classic Tuscan style

Ideal pairing with:
- Plum tomatoes or San Marzano tomatoes
- Rubbed garlic, basil, coarse salt
- The traditional "standard" bruschetta

*Why it works*: medium fruity oil balances the acidity of the tomato with herbaceous notes that amplify it. It is the most comforting and familiar combination.

### 3. Intense fruity — for the authentic Tuscan fettunta

The *fettunta* (literally "oiled slice") has no tomato: only toasted bread, garlic, salt, and a green, pungent oil covering the whole bread.

*Why it works*: without distracting ingredients, the bitterness and spiciness of the intense fruity oil are the absolute protagonist. Every drop of oleocanthal is felt. It is the most intense and direct sensory experience the oil can offer.

## The technique matters

- Toast the bread in the oven or on a dry cast iron griddle (not in a pan with oil)
- Rub the garlic *just as it comes out of the oven*, while still very hot—so it melts
- Drizzle the oil generously: do not make "diet" bruschettas
- Serve **immediately**: every minute reduces the freshness of the aromas

:::cta
Discover our robust fruity oil — perfect for fettunta
Early harvest, maximum polyphenol content.
[Buy now](/shop)
:::`,
    },
    "de": {
      slug: "beste-olivenoel-fuer-bruschetta",
      title: "Bestes Olivenöl für Bruschetta: 3 Profile und wie man wählt",
      excerpt: "Bruschetta scheint einfach zu sein, aber das Olivenöl macht den Unterschied. Hier sind die drei Aromenprofile zum Kombinieren und die Technik für ein perfektes Ergebnis.",
      category: "Rezepte & Kombinationen",
      content: `## Bruschetta als leere Leinwand

Bruschetta ist der reinste Test für ein Olivenöl Extra Vergine. Geröstetes Brot, vielleicht mit Knoblauch eingerieben, frische Tomaten im Sommer – und dann das Öl. Es gibt keine komplexe Sauce, hinter der man sich verstecken könnte. Das Öl ist der absolute Hauptdarsteller.

## Die drei Profile zum Kombinieren

### 1. Leicht fruchtig – für feine Bruschettas

Idealer Partner für:
- Sehr reife und süße Tomaten (Datterino, Fleischtomaten im Sommer)
- Büffelmozzarella oder Stracciatella
- Zucchiniblüten

*Warum es funktioniert*: Leicht fruchtiges Öl übertönt die Süße der reifen Tomaten nicht. Es entsteht Harmonie, kein Kontrast.

### 2. Mittelfruchtig – der klassische toskanische Stil

Idealer Partner für:
- Eiertomaten oder San-Marzano-Tomaten
- Eingeriebener Knoblauch, Basilikum, grobes Salz
- Das traditionelle, klassische Bruschetta

*Warum es funktioniert*: Mittelfruchtiges Öl gleicht die Säure der Tomate mit grasigen Noten aus, die sie intensivieren. Es ist die vertrauteste und beliebteste Kombination.

### 3. Intensiv fruchtig – für die authentische toskanische Fettunta

Die *Fettunta* (wörtlich „geölte Scheibe“) kommt ohne Tomate aus: Nur geröstetes Brot, Knoblauch, Salz und ein grünes, scharfes Öl, das das gesamte Brot bedeckt.

*Warum es funktioniert*: Ohne ablenkende Zutaten sind Bitterkeit und Schärfe des intensiv fruchtigen Öls der absolute Star. Jeder Tropfen Oleocanthal ist spürbar. Es ist das intensivste und direkteste sensorische Erlebnis, das ein Öl bieten kann.

## Auf die Technik kommt es an

- Rösten Sie das Brot im Ofen oder auf einer trockenen Gusseisenplatte (nicht in der Pfanne mit Öl).
- Reiben Sie den Knoblauch *sofort nach dem Rösten* ein, solange das Brot noch sehr heiß ist – so schmilzt er.
- Gießen Sie das Öl großzügig darüber: Sparen Sie nicht am guten Olivenöl.
- Servieren Sie **sofort**: Jede Minute verringert die Frische der Aromen.

:::cta
Entdecken Sie unser intensiv fruchtiges Öl – perfekt für Fettunta
Frühe Ernte, maximaler Polyphenolgehalt.
[Jetzt kaufen](/shop)
:::`,
    },
    "nl": {
      slug: "beste-olijfolie-voor-bruschetta",
      title: "Beste olijfolie voor bruschetta: 3 profielen en hoe te kiezen",
      excerpt: "Bruschetta lijkt eenvoudig, maar de olijfolie maakt het verschil. Hier zijn de drie smaakprofielen om te combineren en de techniek voor een perfect resultaat.",
      category: "Recepten & Combinaties",
      content: `## Bruschetta als blanco canvas

Bruschetta is de ultieme test voor een extra vierge olijfolie. Geroosterd brood, eventueel ingewreven met knoflook, verse tomaten in de zomer — en dan de olie. Er is geen complexe saus om fouten te verbergen. De olijfolie is de absolute hoofdrolspeler.

## De drie smaakprofielen

### 1. Licht fruitig — voor delicate bruschetta's

Ideale combinatie met:
- Zeer rijpe en zoete tomaten (datterini, zomervleestomaten)
- Buffelmozzarella of stracciatella
- Courgettebloemen

*Waarom het werkt*: de licht fruitige olijfolie overheerst de zoetheid van de rijpe tomaat niet. Het creëert harmonie, geen contrast.

### 2. Medium fruitig — de klassieke Toscaanse stijl

Ideale combinatie met:
- Pruimtomaten of San Marzano-tomaten
- Ingewreven knoflook, basilicum, grof zout
- De traditionele "standaard" bruschetta

*Waarom het werkt*: de medium fruitige olijfolie balanceert de zuurgraad van de tomaat met kruidachtige tonen die de smaak versterken. Het is de meest vertrouwde en geliefde combinatie.

### 3. Intens fruitig — voor de authentieke Toscaanse fettunta

De *fettunta* (letterlijk "geoliede schijf") heeft geen tomaat: alleen geroosterd brood, knoflook, zout en een groene, scherpe olie die het hele brood bedekt.

*Waarom het werkt*: zonder afleidende ingrediënten zijn de bitterheid en het pikante karakter van de intens fruitige olie de absolute hoofdrolspeler. Elke druppel oleocanthal is voelbaar. Het is de meest intense en directe zintuiglijke ervaring die olijfolie kan bieden.

## De techniek is belangrijk

- Rooster het brood in de oven of op een droge gietijzeren plaat (niet in de pan met olie).
- Wrijf de knoflook in *zodra het brood uit de oven komt*, als het nog superheet is — zo smelt de knoflook.
- Giet de olie er gul over: wees niet te zuinig.
- Serveer **direct**: elke minuut vermindert de frisheid van de aroma's.

:::cta
Ontdek onze intens fruitige olijfolie — perfect voor fettunta
Vroege oogst, maximaal gehalte aan polifenolen.
[Nu kopen](/shop)
:::`,
    },
    "da": {
      slug: "bedste-olivenolie-til-bruschetta",
      title: "Bedste olivenolie til bruschetta: 3 profiler og hvordan du vælger",
      excerpt: "Bruschetta virker måske simpelt, men olivenolien gør hele forskellen. Her er de tre smagsprofiler, der passer til, og teknikken til et perfekt resultat.",
      category: "Opskrifter & Parringer",
      content: `## Bruschetta som et tomt lærred

Bruschetta er den reneste test for en ekstra jomfruolivenolie. Ristet brød, måske gnedet med hvidløg, friske tomater om sommeren — og så olien. Der er intet at gemme bag en kompliceret sauce. Olien er den absolutte hovedperson.

## De tre smagsprofiler

### 1. Let frugtig — til delikate bruschettaer

Ideel parring med:
- Meget modne og søde tomater (datterino, kødfulde sommertomater)
- Bøffelmozzarella eller stracciatella
- Squashblomster

*Hvorfor det virker*: Den let frugtige olie overdøver ikke de modne tomaters sødme. Det skaber harmoni, ikke kontrast.

### 2. Medium frugtig — den klassiske toscanske stil

Ideel parring med:
- Blommetomater eller San Marzano-tomater
- Gnedet hvidløg, basilikum, groft salt
- Den traditionelle "standard" bruschetta

*Hvorfor det virker*: Den medium frugtige olie balancerer tomatens syre med grønne noter, der fremhæver smagen. Det er den mest velkendte og elskede kombination.

### 3. Intensiv frugtig — til den autentiske toscanske fettunta

Den traditionelle *fettunta* (bogstaveligt talt "smurt skive") har ingen tomater: Kun ristet brød, hvidløg, salt og en intens, grøn og pebret olie, der dækker hele brødet.

*Hvorfor det virker*: Uden ingredienser til at aflede opmærksomheden er den intense frugtige olies bitterhed og skarphed den absolutte stjerne. Hver dråbe oleocanthal mærkes. Det er den mest intense og direkte sensoriske oplevelse, olien kan byde på.

## Teknikken tæller

- Rist brødet i ovnen eller på en tør gussejnsplade (ikke på panden med olie)
- Gnid hvidløget *så snart brødet kommer ud*, mens det stadig er rygende varmt — så det smelter
- Hæld generøst med olie: Spar ikke på de gode dråber
- Server **straks**: Hvert minut reducerer aromaernes friskhed

:::cta
Oplev vores intense frugtige olie – perfekt til fettunta
Tidlig høst, maksimalt polyfenolindhold.
[Køb nu](/shop)
:::`,
    },
    "no": {
      slug: "beste-olivenolje-til-bruschetta",
      title: "Beste olivenolje til bruschetta: 3 profiler og hvordan du velger",
      excerpt: "Bruschetta virker kanskje enkelt, men olivenoljen gjør hele forskjellen. Her er de tre smaksprofilene som passer til, og teknikken for et perfekt resultat.",
      category: "Oppskrifter & Parringer",
      content: `## Bruschetta som et tomt lerret

Bruschetta er den reneste testen for en ekstra jomfruolivenolje. Ristet brød, kanskje gnidd med hvitløk, ferske tomater om sommeren — og så oljen. Det er ingenting å gjemme bak en komplisert saus. Oljen er den absolutte hovedpersonen.

## De tre smaksprofilene

### 1. Lett fruktig — til delikate bruschettaer

Ideell parring med:
- Svært modne og søte tomater (datterino, kjøttfulle sommertomater)
- Bøffelmozzarella eller stracciatella
- Squashblomster

*Hvorfor det fungerer*: Den lett fruktige oljen overdøver ikke de modne tomatenes sødme. Det skaper harmoni, ikke kontrast.

### 2. Medium fruktig — den klassiske toskanske stilen

Ideell parring med:
- Plommetomater eller San Marzano-tomater
- Gnidd hvitløk, basilikum, grovt salt
- Den tradisjonelle "standard" bruschettaen

*Hvorfor det fungerer*: Den medium fruktige oljen balanserer tomatens syre med grønne noter som fremhever smaken. Det er den mest velkjente og elskede kombinasjonen.

### 3. Intens fruktig — til den autentiske toskanske fettuntaen

Den tradisjonelle *fettuntaen* (bokstavelig talt "smurt skive") har ingen tomater: Bare ristet brød, hvitløk, salt og en intens, grønn og pebret olje som dekker hele brødet.

*Hvorfor det fungerer*: Uten ingredienser til å avlede oppmerksomheten er den intense fruktige oljens bitterhet og skarphet den absolutte stjernen. Hver dråpe oleocanthal merkes. Det er den mest intense og direkte sensoriske opplevelsen oljen kan by på.

## Teknikken teller

- Rist brødet i ovnen eller på en tørr støpejernskanne (ikke i pannen med olje)
- Gni hvitløket *så snart brødet kommer ut*, mens det fortsatt er rykende varmt — slik at det smelter
- Hell sjenerøst med olje: Ikke spar på de gode dråpene
- Server **straks**: Hvert minutt reduserer aromaenes friskhet

:::cta
Oppdag vår intense fruktige olje – perfekt til fettunta
Tidlig høst, maksimalt polyfenolinnhold.
[Kjøp nå](/shop)
:::`,
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
      excerpt: "Making a good dressing with EVOO is not trivial. From choosing the profile to emulsifying with vinegar or lemon: a short complete guide.",
      category: "Recipes & Pairings",
      content: `## Not all salads are equal

The choice of olive oil for your salad depends on the type of greens:

- **Delicate salads** (lettuce, lamb's lettuce, young arugula): *light fruity*
- **Robust salads** (spinach, radicchio, chicory, wild arugula): *medium or robust fruity*
- **Mixed salads with chicken or proteins**: *medium fruity*
- **Caprese or tomato salads**: *light-medium fruity*

## The perfect emulsion

Oil and vinegar (or lemon juice) do not mix spontaneously—they are immiscible. For a stable dressing, you need three things:

1. **An emulsifier**: whole grain mustard works great (even in small amounts), or a pinch of honey, or very finely minced garlic which releases pectins
2. **Agitation**: shake vigorously in a closed jar for 15–20 seconds
3. **Proportion**: classically **3 parts oil to 1 part vinegar**

> A stable dressing does not "separate" during the meal—it coats every leaf evenly.

## Basic recipe

- 3 tablespoons of medium fruity EVOO
- 1 tablespoon of white wine vinegar or lemon juice
- 1/2 teaspoon of Dijon mustard
- Salt and pepper
- (Optional) 1/2 clove of garlic, very finely minced

Place everything in a small jar, close it, and shake vigorously for 20 seconds. Dress the salad just before serving.

:::cta
Our medium fruity olive oil: versatile, balanced, for every salad
[Discover in our shop](/shop)
:::`,
    },
    "de": {
      slug: "bestes-olivenoel-fuer-salatdressing",
      title: "Bestes Olivenöl für Salatdressing: Emulsion, Salz und das richtige Profil",
      excerpt: "Ein gutes Dressing mit Olivenöl Extra herzustellen ist nicht trivial. Von der Wahl des Profils bis zur Emulsion mit Essig oder Zitrone: Ein kleiner, kompletter Leitfaden.",
      category: "Rezepte & Kombinationen",
      content: `## Nicht alle Salate sind gleich

Die Wahl des Olivenöls für den Salat hängt von den Gemüsesorten ab:

- **Feine Salate** (Kopfsalat, Feldsalat, junger Rucola): *leicht fruchtig*
- **Kräftige Salate** (Spinat, Radicchio, Chicorée, wilder Rucola): *mittelfruchtig oder intensiv fruchtig*
- **Gemischte Salate mit Hähnchen oder Proteinen**: *mittelfruchtig*
- **Caprese oder Tomatensalate**: *leicht bis mittelfruchtig*

## Die perfekte Emulsion

Öl und Essig (oder Zitrone) vermischen sich nicht von selbst – sie sind nicht mischbar. Für ein stabiles Dressing benötigen Sie drei Dinge:

1. **Einen Emulgator**: Senfkörner funktionieren hervorragend (auch in kleinen Mengen), ebenso ein Hauch Honig oder sehr fein gehackter Knoblauch, der Pektine freisetzt.
2. **Bewegung**: Schütteln Sie die Zutaten in einem geschlossenen Glas 15–20 Sekunden lang kräftig.
3. **Verhältnis**: Klassischerweise **3 Teile Öl auf 1 Teil Essig**.

> Ein stabiles Dressing trennt sich während des Essens nicht – es umhüllt jedes Blatt gleichmäßig.

## Grundrezept

- 3 Esslöffel mittelfruchtiges Olivenöl Extra Vergine
- 1 Esslöffel Weißweinessig oder Zitronensaft
- 1/2 Teelöffel Dijonsenf
- Salz und Pfeffer
- (Optional) 1/2 Knoblauchzehe, sehr fein gehackt

Geben Sie alle Zutaten in ein kleines Glas, schließen Sie es und schütteln Sie es 20 Sekunden lang kräftig. Erst kurz vor dem Servieren über den Salat geben.

:::cta
Unser mittelfruchtiges Olivenöl: Vielseitig, ausgewogen, für jeden Salat.
[Im Shop entdecken](/shop)
:::`,
    },
    "nl": {
      slug: "beste-olijfolie-voor-salatedressing",
      title: "Beste olijfolie voor saladedressing: emulsie, zout en het juiste profiel",
      excerpt: "Een goede dressing maken met extra vierge olijfolie is niet zomaar wat. Van het kiezen van het profiel tot het emulgeren met azijn of citroen: een kleine complete gids.",
      category: "Recepten & Combinaties",
      content: `## Niet alle salades zijn hetzelfde

De keuze van de olijfolie voor de salade hangt af van het type groente:

- **Delicate salades** (kopsla, veldsla, jonge rucola): *licht fruitig*
- **Robuuste salades** (spinazie, radicchio, chicorei, wilde rucola): *medium of intens fruitig*
- **Gemengde salades met kip of proteïnen**: *medium fruitig*
- **Caprese of tomatensalades**: *licht-medium fruitig*

## De perfecte emulsie

Olie en azijn (of citroen) mengen niet uit zichzelf — ze stoten elkaar af. Voor een stabiele dressing heb je drie dingen nodig:

1. **Een emulsificator**: mosterdzaadjes werken heel goed (zelfs in kleine hoeveelheden), of een vleugje honing, of heel fijngehakte knoflook die pectines afgeeft
2. **Beweging**: schud krachtig in een gesloten potje gedurende 15–20 seconden
3. **Verhouding**: klassiek **3 delen olie op 1 deel azijn**

> Een slagvaste dressing scheidt zich niet tijdens de maaltijd — het bedekt elk blaadje gelijkmatig.

## Basisrecept

- 3 eetlepels medium fruitige extra vierge olijfolie
- 1 eetlepel wittewijnazijn of citrosap
- 1/2 theelepel Dijonmosterd
- Zout en peper
- (Optioneel) 1/2 teentje knoflook, heel fijngehakt

Doe alles in een potje, sluit het af en schud krachtig gedurende 20 seconden. Breng de salade pas op het moment van serveren op smaak.

:::cta
Onze medium fruitige olijfolie: veelzijdig, gebalanceerd, voor elke salade
[Ontdek in de shop](/shop)
:::`,
    },
    "da": {
      slug: "bedste-olivenolie-til-salatdressing",
      title: "Bedste olivenolie til salatdressing: Emulsion, salt og den rette profil",
      excerpt: "At lave en god dressing med ekstra jomfruolivenolie er ikke så ligetil, som man tror. Fra valg af profil til emulsion med eddike eller citron: en lille, komplet guide.",
      category: "Opskrifter & Parringer",
      content: `## Ikke alle salater er ens

Valget af olivenolie til salaten afhænger af typen af grøntsager:

- **Delikate salater** (hovedsalat, feldsalat, ung ruccola): *let frugtig*
- **Robuste salater** (spinat, radicchio, cikorie, vild ruccola): *medium eller intens frugtig*
- **Blandede salater med kylling eller proteiner**: *medium frugtig*
- **Caprese eller tomatsalater**: *let-medium frugtig*

## Den perfekte emulsion

Olie og eddike (eller citron) blander sig ikke af sig selv — de er uforenelige. Til en stabil dressing skal du bruge tre ting:

1. **En emulator**: Sennepskorn fungerer rigtig godt (selv i små mængder), en knivspids honning eller finthakket hvidløg, som frigiver pektin
2. **Omrøring**: Ryst kraftigt i et lukket glas i 15–20 sekunder
3. **Forhold**: Traditionelt **3 dele olie til 1 del eddike**

> En stabil dressing skiller ikke under måltidet — den dækker hvert salatblad ensartet.

## Grundopskrift

- 3 spsk. medium frugtig ekstra jomfruolivenolie
- 1 spsk. hvidvinseddike or citronsaft
- 1/2 tsk. Dijonsennep
- Salt og peber
- (Valgfrit) 1/2 fed hvidløg, finthakket

Kom det hele i et lille glas, luk det og ryst kraftigt i 20 sekunder. Hæld over salaten umiddelbart inden servering.

:::cta
Vores medium frugtige olivenolie: Alsidig, balanceret, til enhver salat
[Se den i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "beste-olivenolje-til-salatdressing",
      title: "Beste olivenolje til salatdressing: Emulsjon, salt og den rette profilen",
      excerpt: "Å lage en god dressing med ekstra jomfruolivenolje er ikke så rett frem som man tror. Fra valg av profil til emulsjon med eddik eller sitron: en liten, komplett guide.",
      category: "Oppskrifter & Parringer",
      content: `## Ikke alle salater er like

Valget av olivenolje til salaten avhenger av typen grønnsaker:

- **Delikate salater** (hodesalat, feltsalat, ung ruccola): *lett fruktig*
- **Robuste salater** (spinat, radicchio, sikori, vill ruccola): *medium eller intens fruktig*
- **Blandede salater med kylling eller proteiner**: *medium fruktig*
- **Caprese of tomatsalater**: *lett-medium fruktig*

## Den perfekte emulsjonen

Olje og eddik (eller sitron) blander seg ikke av seg selv — de støyter hverandre bort. Til en stabil dressing trenger du tre ting:

1. **En emulator**: Sennepskorn fungerer veldig bra (selv i små mengder), en knivspiss honning eller finhakket hvitløk, som frigjør pektin
2. **Omrøring**: Rist kraftig i et lukket glass i 15–20 sekunder
3. **Forhold**: Tradisjonelt **3 deler olje til 1 del eddik**

> En stabil dressing skiller seg ikke under måltidet — den dekker hvert salatblad jevnt.

## Grunnoppskrift

- 3 ss. medium fruktig ekstra jomfruolivenolje
- 1 ss. hvitvinseddik eller sitronsaft
- 1/2 ts. Dijonsennep
- Salt og pepper
- (Valgfritt) 1/2 fedd hvitløk, finhakket

Ha alt i et lite glass, lukk det og rist kraftig i 20 sekunder. Hell over salaten umiddelbart før servering.

:::cta
Vår medium fruktige olivenolje: Allsidig, balansert, til enhver salat
[Se den i butikken](/shop)
:::`,
    },
  },
"""

content = content[:start_idx_2] + new_block_2 + content[end_idx_2:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement 2 successful!")
