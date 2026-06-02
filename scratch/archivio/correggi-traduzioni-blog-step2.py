import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = '  "ric-3": {'
end_marker = '  "ric-7": {'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

print(f"Replacing block of length {end_idx - start_idx} characters.")

new_block = """  "ric-3": {
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
      content: `## The most difficult dish in Italian cuisine

Pasta with garlic and oil (Spaghetti Aglio e Olio) is the dish where the quality of every single ingredient truly *shines*. There is no tomato, no sauce — just pasta, garlic, olive oil, and chili. A bad cook makes it in 5 minutes with a mediocre result. A good cook transforms those three ingredients into something unforgettable.

## Which olive oil to choose

The recommended profile is **medium-intense fruity**: robust enough not to disappear between the garlic and the chili, but not so dominant as to clash with them.

Look for an oil with notes of:
- *Artichoke* and *green grass* (they pair perfectly with garlic)
- *Decisive spiciness* (fuses with the chili without contradicting it)

A light fruity oil will get lost; an extremely long, bitter oil can overpower the garlic. Medium is the keyword.

## The correct technique

1. **Thinly sliced garlic** (not chopped, not pressed) — this allows it to brown evenly without burning
2. **Low temperature** at the start: the garlic should be *gently sautéed*, not fried on high heat
3. **Remove the garlic** before it turns dark brown (or keep it if you love a bolder flavor)
4. **Add pasta cooking water** to create an emulsion: the starch in the water stabilizes the oil
5. **Finish with a drizzle of raw olive oil** off the heat — this is the secret of the professionals

> Pasta aglio e olio is a poem of three words. The wrong oil is the word out of place.

## Proportions for 2 people

- 200g pasta (spaghetti no. 5 or linguine)
- 4–5 tablespoons of EVOO
- 3 cloves of garlic
- 1–2 chili peppers (or dried chili to taste)
- Fresh parsley (optional)
- Salt + pasta water to taste`,
    },
    "de": {
      slug: "olivenoel-fuer-spaghetti-aglio-olio",
      title: "Das beste Olivenöl für Spaghetti Aglio e Olio: Welches Profil passt",
      excerpt: "Knoblauch, Öl und Chili – drei Zutaten, kein Raum für Fehler. Die Ölqualität ist in diesem Gericht alles. So gelingt die perfekte Zubereitung.",
      category: "Rezepte & Kombinationen",
      content: `## Das schwierigste Gericht der italienischen Küche

Pasta Aglio e Olio ist das Gericht, bei dem sich die Qualität jeder einzelnen Zutat *zeigt*. Es gibt keine Tomaten, keine Sauce – nur Pasta, Knoblauch, Olivenöl und Chili. Wer schlecht kocht, macht es in 5 Minuten mit einem mittelmäßigen Ergebnis. Wer es gut macht, verwandelt diese drei Zutaten in etwas Unvergessliches.

## Welches Olivenöl wählen

Das empfohlene Profil ist **mittelfruchtig bis intensiv fruchtig**: robust genug, um zwischen Knoblauch und Chili nicht unterzugehen, aber nicht so dominant, dass es sich mit ihnen streitet.

Suchen Sie nach einem Öl mit folgenden Noten:
- *Artischocke* und *frisches Gras* (sie harmonieren perfekt mit Knoblauch)
- *Kräftige Schärfe* (verschmilzt mit dem Chili, ohne ihm zu widersprechen)

Ein leicht fruchtiges Öl geht verloren; ein sehr langanhaltendes, bitteres Öl kann den Knoblauch überdecken. „Medium“ ist das Zauberwort.

## Die richtige Technik

1. **Knoblauch in feine Scheiben schneiden** (nicht hacken, nicht pressen) – so bräunt er gleichmäßig, ohne zu verbrennen
2. **Niedrige Temperatur** am Anfang: Der Knoblauch wird *sanft angedünstet*, nicht bei starker Hitze frittiert
3. **Knoblauch entfernen**, bevor er dunkelbraun wird (oder im Öl lassen, wenn Sie einen kräftigeren Geschmack lieben)
4. **Nudelkochwasser hinzufügen**, um eine Emulsion zu erzeugen: Die Stärke im Wasser stabilisiert das Öl
5. **Mit einem Faden rohem Olivenöl verfeinern**, wenn die Pasta vom Herd genommen wurde – das ist das Geheimnis der Profis

> Spaghetti Aglio e Olio ist ein Gedicht aus drei Worten. Das falsche Öl ist das Wort am falschen Platz.

## Proportionen für 2 Personen

- 200g Pasta (Spaghetti Nr. 5 oder Linguine)
- 4–5 Esslöffel Olivenöl Extra Vergine
- 3 Knoblauchzehen
- 1–2 Chilis (oder getrocknete Chilis nach Geschmack)
- Frische Petersilie (optional)
- Salz + Nudelkochwasser nach Bedarf`,
    },
    "nl": {
      slug: "olijfolie-voor-pasta-aglio-olio",
      title: "Olijfolie voor pasta aglio e olio: welk smaakprofiel te kiezen",
      excerpt: "Knoflook, olie en chilipeper — drie ingrediënten, nul foutmarges. De kwaliteit van de olijfolie in dit gerecht is alles. Zo kies je het en pas je de techniek toe.",
      category: "Recepten & Combinaties",
      content: `## Het moeilijkste gerecht in de Italiaanse keuken

Pasta aglio e olio is het gerecht waarin de kwaliteit van elk ingrediënt zich *laat zien*. Er is geen tomaat, geen saus — alleen pasta, knoflook, olijfolie en chilipeper. Wie slecht kookt, maakt het in 5 minuten met een matig resultaat. Wie het goed doet, verandert die drie ingrediënten in iets onvergetelijks.

## Welke olijfolie te kiezen

Het aanbevolen smaakprofiel is **medium-intens fruitig**: robuust genoeg om niet te verdwijnen tussen de knoflook en de chilipeper, maar niet zo dominant dat het ermee botst.

Zoek naar een olijfolie met tonen van:
- *Artisjok* en *vers gras* (deze passen perfect bij knoflook)
- *Duidelijke pittigheid* (smelt samen met de chilipeper zonder ermee in strijd te zijn)

Een licht fruitige olijfolie raakt verloren; een zeer lange, bittere olijfolie kan de knoflook overstemmen. Medium is het sleutelwoord.

## De juiste techniek

1. **Knoflook in dunne plakjes snijden** (niet hakken, niet persen) — zo bakt het gelijkmatig goudbruin zonder te verbranden
2. **Lage temperatuur** in het begin: de knoflook moet *zachtjes fruiten*, niet bakken op hoog vuur
3. **Verwijder de knoflook** voordat deze donkerbruin wordt (of laat hem zitten als je van een krachtigere smaak houdt)
4. **Voeg kookwater van de pasta toe** om een emulsie te creëren: het zetmeel in het water stabiliseert de olijfolie
5. **Eindig met een scheutje rauwe olijfolie** van het vuur af — dit is het geheim van de professionals

> Pasta aglio e olio is een gedicht van drie woorden. De verkeerde olijfolie is het woord dat uit de toon valt.

## Verhoudingen voor 2 personen

- 200g pasta (spaghetti nr. 5 of linguine)
- 4–5 eetlepels extra vierge olijfolie
- 3 teentjes knoflook
- 1–2 chilipepers (of gedroogde chilipeper naar smaak)
- Verse peterselie (optioneel)
- Zout + kookwater naar behoefte`,
    },
    "da": {
      slug: "olivenolie-til-pasta-aglio-olio",
      title: "Olivenolie til pasta aglio e olio: Hvilken aromatisk profil skal man vælge",
      excerpt: "Hvidløg, olie og chili — tre ingredienser, ingen fejlmargen. Oliekvaliteten i denne ret er alt. Her er valget og den rigtige teknik.",
      category: "Opskrifter & Parringer",
      content: `## Den sværeste ret i det italienske køkken

Pasta aglio e olio er retten, hvor kvaliteten af hver enkelt ingrediens *træder frem*. Der er ingen tomater, ingen sauce — kun pasta, hvidløg, olie og chili. En dårlig kok laver den på 5 minutter med et middelmådigt resultat. En god kok forvandler de tre ingredienser to noget uforglemmeligt.

## Hvilken olie skal man vælge

Den anbefalede profil er **medium-intensiv frugtig**: Robust nok til ikke at forsvinde mellem hvidløg og chili, men ikke så dominerende at den overdøver dem.

Søg efter en olie med noter af:
- *Artiskok* og *græs* (de passer perfekt til hvidløg)
- *Markant skarphed* (smelter sammen med chilien uden at modarbejde den)

En let frugtig olie vil gå tabt; en meget lang og bitter olie kan dække for hvidløget. Medium er kodeordet.

## Den rigtige teknik

1. **Hvidløg i tynde skiver** (ikke hakket, ikke presset) — så bliver det jævnt gyldent uden at brænde på
2. **Lav varme** i starten: Hvidløget skal sauteres *blidt*, ikke friteres ved høj varme
3. **Fjern hvidløget** før det bliver mørkebrunt (eller behold det, hvis du elsker en kraftigere smag)
4. **Tilsæt pastavand** for at skabe en emulsion: Stivelsen i pastavandet stabiliserer olien
5. **Afslut med en generøs ring af rå olie** taget af varmen — dette er professionelles hemmelighed

> Pasta aglio e olio is a poem of three words. The wrong oil is the word out of place.

## Forhold til 2 personer

- 200g pasta (spaghetti nr. 5 eller linguine)
- 4–5 spiseskeer ekstra jomfruolivenolie
- 3 fed hvidløg
- 1–2 chilier (eller tørret chili efter smag)
- Frisk persille (valgfrit)
- Salt + pastavand efter behov`,
    },
    "no": {
      slug: "olivenolje-til-pasta-aglio-olio",
      title: "Olivenolje til pasta aglio e olio: Hvilken aromatisk profil bør man velge",
      excerpt: "Hvitløk, olje og chili — tre ingredienser, ingen feilmargin. Oljekvaliteten i denne retten er alt. Slik velger du riktig og bruker riktig teknikk.",
      category: "Oppskrifter & Parringer",
      content: `## Den vanskeligste retten i det italienske kjøkken

Pasta aglio e olio er retten der kvaliteten på hver enkelt ingrediens virkelig *viser seg*. Det er ingen tomater, ingen saus — bare pasta, hvitløk, olje og chili. En dårlig kokk gjør det på 5 minutter med et middelmådig resultat. En god kokk forvandler disse tre ingrediensene til noe uforglemmelig.

## Hvilken olje bør du velge

Den anbefalte profilen er **medium-intens fruktig**: Robust nok til ikke å forsvinne mellom hvitløk og chili, men ikke så dominerende at den overdøver dem.

Se etter en olje med toner av:
- *Artisjokk* og *gress* (disse passer perfekt til hvitløk)
- *Markant skarphet* (smelter sammen med chilien uten å modarbeide den)

En lett fruktig olje vil gå tapt; en veldig lang og bitter olje kan dekke over hvitløken. Medium er stikkordet.

## Den riktige teknikken

1. **Hvitløk i tynne skiver** (ikke hakket, ikke presset) — slik at det blir gyllent uten å brenne seg
2. **Lav varme** i starten: Hvitløket skal sauteres *skånsomt*, ikke friteres på høy varme
3. **Fjern hvitløket** før det blir mørkebrunt (eller behold det hvis du elsker en kraftigere smak)
4. **Tilsett pastavann** for å skape en emulsjon: Stivelsen i pastavannet stabiliserer oljen
5. **Avslutt med en stripe rå olje** tatt av varmen — dette er hemmeligheten til de profesjonelle

> Pasta aglio e olio er et dikt på tre ord. Feil olje er ordet som er malplassert.

## Forhold til 2 personer

- 200g pasta (spaghetti nr. 5 eller linguine)
- 4–5 spiseskjeer ekstra jomfruolivenolje
- 3 fedd hvitløk
- 1–2 chilier (eller tørket chili etter smak)
- Frisk persille (valgfrit)
- Salt + pastavand etter behov`,
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
      content: `## Why olive oil on soups and legumes is fundamental

Italian "cucina povera" (peasant cooking)—ribollita, pasta and beans (pasta e fagioli), lentil soup, spelt with vegetables—was never truly poor. It was a cuisine of simple ingredients assembled with absolute mastery. And the act of drizzling raw olive oil at the very end of cooking was one of the key moments.

The reason is chemical: many aromatic and fat-soluble compounds are carried *through fat*. A high-quality oil on a hot soup (taken off the heat) carries its aromas deep into the dish and integrates with the broth, creating a complexity that cannot be achieved in any other way.

## Which flavor profile to choose

- **Lentils** (earthy and sweet flavor): *medium-intense fruity* — the green notes of the oil amplify the savory flavors
- **Pasta and beans (pasta e fagioli)**: *medium fruity* — the classic, balanced choice
- **Ribollita** (Tuscan kale, beans, bread): *intense fruity* — the robustness of the vegetables requires a bold oil
- **Minestrone** (delicate vegetables): *light-medium fruity*
- **Chickpea soup** with rosemary: *intense fruity* — the contrast with the neutral chickpea is magnificent

## The correct technique

- **Never add the oil during cooking** if you want to preserve its delicate aromas
- **At the moment of serving**, directly in the bowl: a generous tablespoon right in the center
- Optionally, a good grind of fresh black pepper and a few fresh rosemary leaves
- The oil melts in the heat of the dish — do not stir immediately; look at it first

:::cta
Our robust fruity olive oil: ideal for winter soups
[Order now](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-fuer-suppen-und-eintoepfe",
      title: "Olivenöl für Hülsenfrüchte und Suppen: Welches passt und wie man es nutzt",
      excerpt: "Ein Faden Olivenöl auf der Linsensuppe ist ein uralter Küchentrick. Doch nicht jedes Öl schmeckt gleich gut auf Bohnen, Ribollita und Minestrone.",
      category: "Rezepte & Kombinationen",
      content: `## Warum Olivenöl für Suppen und Hülsenfrüchte grundlegend ist

Die italienische „cucina povera“ (die traditionelle einfache Küche) – Ribollita, Pasta e Fagioli (Nudeln mit Bohnen), Linsensuppe, Dinkel mit Gemüse – war nie wirklich arm. Es war eine Küche aus einfachen Zutaten, die mit absoluter Meisterschaft zusammengestellt wurden. Und der finale Faden rohen Olivenöls am Ende der Zubereitung war einer der Schlüsselmomente.

Der Grund ist chemischer Natur: Viele Aroma- und fettlösliche Verbindungen werden *durch das Fett transportiert*. Ein hervorragendes Öl auf einer heißen Suppe (vom Herd genommen) transportiert seine Aromen tief in das Gericht und verbindet sich mit der Brühe zu einer Komplexität, die man auf keine andere Weise erreichen kann.

## Welches Profil wählen

- **Linsen** (erdiger und süßer Geschmack): **mittelfruchtig bis intensiv fruchtig** – die grünen Noten des Öls verstärken den herzhaften Geschmack
- **Pasta e Fagioli**: **mittelfruchtig** – der klassische, ausgewogene Partner
- **Ribollita** (Schwarzkohl, Bohnen, Brot): **intensiv fruchtig** – die Robustheit des Gemüses verlangt nach einem kräftigen Öl
- **Minestrone** (feines Gemüse): **leicht- bis mittelfruchtig**
- **Kichererbsensuppe** mit Rosmarin: **intensiv fruchtig** – der Kontrast zu den milden Kichererbsen ist großartig

## Die richtige Technik

- **Fügen Sie das Olivenöl niemals während des Kochens hinzu**, wenn Sie seine feinen Aromen bewahren wollen
- **Beim Servieren** direkt auf den Teller geben: Ein großzügiger Esslöffel genau in die Mitte
- Nach Belieben frisch gemahlener schwarzer Pfeffer und ein paar frische Rosmarinnadeln
- Das Öl schmilzt in der Wärme des Tellers – rühren Sie nicht sofort um, sondern genießen Sie zuerst den Anblick

:::cta
Unser intensiv fruchtiges Olivenöl: Ideal für winterliche Suppen
[Jetzt bestellen](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-voor-soep-en-peulvruchten",
      title: "Olijfolie voor peulvruchten en soepen: welke werkt het best en hoe te gebruiken",
      excerpt: "Een scheutje olijfolie over de linzensoep is een oud en wijs gebruik. Maar niet alle olijfoliën zijn gelijk op bonen, ribollita en minestrone.",
      category: "Recepten & Combinaties",
      content: `## Waarom olijfolie op soepen en peulvruchten essentieel is

De Italiaanse "cucina povera" (arme keuken) — ribollita, pasta en bonen (pasta e fagioli), linzensoep, spelt met groenten — was nooit echt arm. Het was een keuken van eenvoudige ingrediënten die met meesterschap werden gecombineerd. En het schenken van een scheutje rauwe olijfolie aan het einde van de bereiding was een van de sleutelmomenten.

De reason is scheikundig: veel aromatische en vetoplosbare verbindingen worden *via het vet* getransporteerd. Een kwalitatieve olijfolie op een hete soep (van het vuur af) brengt de aroma's diep in het gerecht en integreert met de bouillon, wat een complexiteit creëert die op geen enkele andere manier te bereiken is.

## Welk profiel te kiezen

- **Linzen** (aardse en zoete smaak): *medium-intens fruitig* — het groene karakter van de olie versterkt de hartige tonen
- **Pasta e fagioli**: *medium fruitig* — de klassieke, gebalanceerde keuze
- **Ribollita** (boerenkool/palmkool, bonen, brood): *intens fruitig* — de robuustheid van de groenten vraagt om een krachtige olie
- **Minestrone** (fijne groenten): *licht-medium fruitig*
- **Kikkererwtensoep** met rozemarijn: *intens fruitig* — het contrast met de neutrale kikkererwt is magnifiek

## De juiste techniek

- **Voeg de olijfolie nooit toe tijdens het koken** als je de delicate aroma's wilt behouden
- **Bij het serveren**, direct in het bord: een gulle eetlepel in het midden van het gerecht
- Eventueel een flinke draai verse zwarte peper en een paar naaldjes verse rozemarijn
- De olie smelt door de warmte van de soep — roer niet meteen, geniet eerst van het gezicht

:::cta
Onze intens fruitige olijfolie: ideaal voor winterse soepen
[Bestel nu](/shop)
:::`,
    },
    "da": {
      slug: "olivenolie-til-baelgfrugter-supper",
      title: "Olivenolie til bælgfrugter og supper: Hvilken virker bedst, og hvordan bruges den",
      excerpt: "Et stænk af olivenolie på linsesuppen er en gammel og klog tradition. Men ikke alle olier er ens på bønner, ribollita og minestrone.",
      category: "Opskrifter & Parringer",
      content: `## Hvorfor olivenolie på supper og bælgfrugter er helt afgørende

Italiensk "cucina povera" (det enkle landkøkken)—ribollita, pasta og bønner (pasta e fagioli), linsesuppe, spelt med grøntsager—har aldrig rigtig været fattigt. Det var et køkken af enkle ingredienser sat sammen med stor mesterlighed. Og det at dryppe en generøs ring af rå olivenolie på retten lige inden servering var et af de absolutte nøglepunkter.

Årsagen er kemisk: Mange aromatiske og fedtopløselige forbindelser transporteres *gennem fedt*. En god olie på en varm suppe (taget af blusset) transporterer sine aromaer dybt ind i retten og integreres med bouillonen, hvilket skaber en kompleksitet, der ikke kan opnås på nogen anden måde.

## Hvilken profil skal man vælge

- **Linser** (jordagtig og sød smag): *medium-intensiv frugtig* — oliens grønne noter fremhæver de fyldige smagsnuancer
- **Pasta og bønner (pasta e fagioli)**: *medium frugtig* — den klassiske, velbalancerede løsning
- **Ribollita** (grønkål, bønner, brød): *intensiv frugtig* — grøntsagernes robusthed kræver en markant olie
- **Minestrone** (delikate grøntsager): *let-medium frugtig*
- **Kikærtesuppe** med rosmarin: *intensiv frugtig* — kontrasten til de neutrale kikærter er fantastisk

## Den rigtige teknik

- **Tilsæt aldrig olien under selve kogningen**, hvis du vil bevare dens delikate aromaer
- **Ved servering**, direkte i den varme dybe tallerken: En generøs spiseskefuld i midten
- Eventuelt en god omgang friskkværnet sort peber og et par friske rosmarinnåle
- Olien smelter i rettens varme — rør ikke rundt med det samme; kig på den først

:::cta
Vores intense frugtige olivenolie: Ideel til vinterens supper
[Bestil nu](/shop)
:::`,
    },
    "no": {
      slug: "olivenolje-til-belgfrukter-supper",
      title: "Olivenolje til belgfrukter og supper: Hvilken fungerer best og hvordan brukes den",
      excerpt: "En stråle olivenolje over linsesuppen er en eldgammel og klok tradisjon. Men ikke alle oljer er luke på bønner, ribollita og minestrone.",
      category: "Oppskrifter & Parringer",
      content: `## Hvorfor olivenolje på supper og belgfrukter er helt avgjørende

Italiensk "cucina povera" (det enkle bondekjøkkenet)—ribollita, pasta og bønner (pasta e fagioli), linsesuppe, spelt med grønnsaker—har aldri egentlig vært fattig. Det var et kjøkken av enkle ingredienser satt sammen med stor mesterlighet. Og det å dryppe en stripe med rå olivenolje på retten rett før servering var et av de absolutte nøkkelpunktene.

Årsaken er kjemisk: Mange aromatiske og fettløselige forbindelser transporteres *gjennom fett*. En god olje på en varm suppe (tatt av varmen) transporterer sine aromaer dypt inn i retten og integreres med buljongen, noe som skaper en kompleksitet som ikke kan oppnås på noen annen måte.

## Hvilken profil bør man velge

- **Linser** (jordaktig og søt smak): *medium-intens fruktig* — oljens grønne toner fremhever de fyldige smaksnyansene
- **Pasta og bønner (pasta e fagioli)**: *medium fruktig* — den klassiske, velbalanserte løsningen
- **Ribollita** (grønnkål, bønner, brød): *intens fruktig* — grønnsakenes robusthet krever en markant olje
- **Minestrone** (delikate grønnsaker): *lett-medium fruktig*
- **Kikertsuppe** med rosmarin: *intens fruktig* — kontrasten til de nøytrale kikertene er fantastisk

## Den riktige teknikken

- **Tilsett aldri oljen under selve kokingen** hvis du vil bevare dens delikate aromaer
- **Ved servering**, direkte i den varme dype tallerkenen: En generøs spiseskje i midten
- Eventuelt en god omgang friskkvernet sort pepper og et par friske rosmarinnåler
- Oljen smelter i rettens varme — ikke rør rundt med en gang; se på den først

:::cta
Vår intense fruktige olivenolje: Ideell til vinterens supper
[Bestill nå](/shop)
:::`,
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
      content: `## The art of simple tasting

You do not need to be a sommelier to organize a memorable olive oil tasting. Just follow a few basic rules and have the right materials. The effect on your guests and family is guaranteed.

## What you need

- **2 or 3 different olive oils** (e.g., light, medium, and intense fruity)
- **Unsalted bread** (Tuscan style bread, made without salt) or neutral crackers
- **Dark or opaque glass cups** (or small ceramic bowls)
- **Still water at room temperature** to cleanse the palate
- **A small tasting sheet** for each oil (name, cultivar, tasting notes)

## The tasting procedure

1. **Pour 5–10ml** of olive oil into the tasting glass
2. **Warm** the glass in the palm of your hands for 30 seconds — the warmth releases the volatile aromas
3. **Cover with your other hand** and swirl the glass gently to concentrate the scents
4. **Smell** with your nose inside the glass: look for notes (grass, tomato leaf, almond, green fruit)
5. **Taste**: take a small sip, distribute it over your entire tongue, and draw in air through your mouth (strippaggio, similar to wine tasting)
6. Wait 20–30 seconds: the *spiciness/pepperiness* arrives last, at the back of the throat

Between each oil: drink a sip of **water** and eat a small piece of unsalted bread to cleanse the palate.

## How to describe what you feel

There is no need to use complex technical terms. Ask simple questions instead:
- *"Do you smell anything green? Like fresh-cut grass?"*
- *"Does it remind you of something? Tomato leaf, almond, or artichoke?"*
- *"How bitter is it? How much does it tickle in your throat?"*

This creates engagement and curiosity — much more effective than a dry technical explanation.

:::cta
Tasting Box by Frantoio del Pasqua
Three olive oils, three flavor profiles, with guiding tasting notes included. Perfect for host evenings or as a gift.
[Discover the tasting box](/shop)
:::`,
    },
    "de": {
      slug: "brot-und-olivenoel-verkostung-gaeste",
      title: "Brot und Olivenöl: Mini-Verkostungsleitfaden für Gäste (und Probierbox)",
      excerpt: "Brot und Olivenöl zu servieren, ist ein Zeichen herzlicher Gastfreundschaft. Machen wir ein kleines Verkostungsspiel daraus, um Ihren Gästen die Aromen zu zeigen.",
      category: "Rezepte & Kombinationen",
      content: `## Die Kunst der einfachen Verkostung

Man muss kein Sommelier sein, um eine unvergessliche Olivenölverkostung zu veranstalten. Es genügt, ein paar Grundregeln zu befolgen und das richtige Zubehör bereitzuhalten. Der WOW-Effekt bei Gästen und Familie ist garantiert.

## Was Sie benötigen

- **2 oder 3 verschiedene Olivenöle** (z. B. leicht, mittel und intensiv fruchtig)
- **Salzloses Brot** (nach toskanischer Art, ohne Salz gebacken) oder neutrale Cracker
- **Dunkle oder opake Gläser** (alternativ kleine Keramikschälchen)
- **Stilles Wasser bei Raumtemperatur** zur Reinigung des Gaumens
- **Ein kleiner Verkostungszettel** für jedes Öl (Name, Sorte, Noten)

## Der Ablauf

1. **Gießen Sie 5–10 ml** Olivenöl in das Glas
2. **Erwärmen** Sie das Glas 30 Sekunden lang in Ihren Händen – die Wärme setzt die flüchtigen Aromen frei
3. **Decken Sie das Glas mit der Handfläche ab** und schwenken Sie es leicht, um die Düfte zu konzentrieren
4. **Riechen** Sie mit der Nase tief im Glas: Suchen Sie nach Noten (Gras, Tomatenblatt, Mandel, grüne Früchte)
5. **Verkosten**: Nehmen Sie einen kleinen Schluck, verteilen Sie ihn auf der gesamten Zunge und saugen Sie Luft durch den Mund ein (Strippaggio, ähnlich wie bei einer Weinprobe)
6. Warten Sie 20–30 Sekunden: Die *Schärfe* zeigt sich ganz zum Schluss im Rachen

Zwischen den Ölen: **Wasser** trinken und ein Stückchen salzloses Brot essen, um den Gaumen zu neutralisieren.

## Wie Sie beschreiben, was Sie wahrnehmen

Es ist nicht notwendig, technische Fachbegriffe zu verwenden. Stellen Sie einfache Fragen:
- *„Riechst du etwas Grünes? Wie frisch gemähtes Gras?“*
- *„Erinnert es dich an etwas? Tomatenblatt, Mandel oder Artischocke?“*
- *„Wie bitter is es? Wie sehr kitzelt es im Hals?“*

Das weckt Interesse und Neugier – viel effektiver als eine trockene technische Erklärung.

:::cta
Probierbox von Frantoio del Pasqua
Drei Olivenöle, drei Profile, inklusive Leitfaden für die Verkostung. Perfekt für Abende mit Gästen oder als edles Geschenk.
[Probierbox entdecken](/shop)
:::`,
    },
    "nl": {
      slug: "brood-en-olijfolie-proeverij-gasten",
      title: "Brood en olijfolie: mini-proeverijgids voor gasten (en proefpakket)",
      excerpt: "Brood en olijfolie serveren is een daad van warme gastvrijheid. Verander het in een klein proeverijspel om je gasten de verschillende profielen te laten herkennen.",
      category: "Recepten & Combinaties",
      content: `## De kunst van de eenvoudige proeverij

Je hoeft geen sommelier te zijn om een gedenkwaardige olijfolieproeverij te organiseren. Het volstaat om een paar basisregels te volgen en de juiste materialen te hebben. Het effect op gasten en familie is gegarandeerd.

## Wat heb je nodig

- **2 of 3 verschillende olijfoliën** (bijvoorbeeld: licht, medium en intens fruitig)
- **Zoutloos brood** (Toscaanse stijl, zonder zout gebakken) of neutrale crackers
- **Donkere of ondoorzichtige glazen** (of kleine keramische schaaltjes)
- **Plat water op kamertemperatuur** om het palet te reinigen
- **Een klein notitieblaadje** voor elke olijfolie (naam, cultivar, tonen)

## De proeverijprocedure

1. **Schenk 5–10 ml** olijfolie in het proefglaasje
2. **Verwarm** het glaasje 30 seconden lang tussen je handen — de warmte laat de vluchtige aroma's vrijkomen
3. **Dek het af met je handpalm** en draai het glaasje rond om de geuren te concentreren
4. **Ruik** met je neus diep in het glas: zoek naar tonen (gras, tomatenblad, amandel, groen fruit)
5. **Proef**: neem een klein slokje, verdeel het over je hele tong en zuig lucht door je mond naar binnen (strippaggio, vergelijkbaar met wijnproeven)
6. Wacht 20–30 seconden: de *pittigheid/peperigheid* komt als laatste aan, achter in de keel

Tussen de olijfoliën door: neem een slok **water** en eet een klein stukje zoutloos brood om de smaak te neutraliseren.

## Hoe te omschrijven wat je proeft

Het is niet nodig om complexe technische termen te gebruiken. Handige vragen zijn:
- *"Ruik je iets groens? Zoals versgemaaid gras?"*
- *"Doet het je ergens aan denken? Tomatenblad, amandel of artisjok?"*
- *"Hoe bitter is het? In welke mate prikkelt het in je keel?"*

Dit zorgt voor betrokkenheid en nieuwsgierigheid — veel effectiever dan een droge technische uitleg.

:::cta
Proeverij Box van Frantoio del Pasqua
Drie olijfoliën, drie smaakprofielen, inclusief handige proefnotities. Perfect voor gezellige avonden met gasten of als cadeau.
[Ontdek het proefpakket](/shop)
:::`,
    },
    "da": {
      slug: "broed-og-olivenolie-smagningsguide-gaester",
      title: "Brød og olivenolie: Mini-smagningsguide til gæster (og smagekasse)",
      excerpt: "At servere brød og olivenolie er en varm gæstfrihed. Lad os gøre det to en lille smageleg, der hjælper dine gæster med at skelne mellem profilerne.",
      category: "Opskrifter & Parringer",
      content: `## Kunsten at smage helt enkelt

Man behøver ikke at være sommelier for at arrangere en mindeværdig olivenoliesmagning. Det kræver blot et par grundregler og det rigtige udstyr. Effekten på gæster og familie er garanteret.

## Det skal du bruge

- **2 eller 3 forskellige olivenolier** (f.eks. let, medium og intensiv frugtig)
- **Saltfrit brød** (af toscansk type, bagt uden salt) eller neutrale kiks
- **Mørke eller uigennemsigtige glas** (eller små keramikskåle)
- **Kildevand ved stuetemperatur** til at rense ganen
- **Et lille smageskema** til hver olie (navn, olivensort, noter)

## Fremgangsmåde

1. **Hæld 5–10 ml** olivenolie i det lille glas
2. **Opvarm** glasset mellem hænderne i 30 sekunder — varmen frigiver de flygtige aromaer
3. **Dæk glasset med håndfladen** og sving det rundt for at koncentrere duftene
4. **Duft** med næsen nede i glasset: Led efter noter (græs, tomatblad, mandel, grøn frugt)
5. **Smag**: Tag en lille tår, fordel den over hele tungen, og træk luft ind gennem munden (strippaggio, ligesom ved vinsmagning)
6. Vent 20–30 sekunder: Den *pebrede skarphed* kommer til sidst, bagerst i halsen

Mellem de forskellige olier: Drik en tår **vand** og spis et lille stykke saltfrit brød for at rense ganen.

## Hvordan beskriver du det, du sanser

Det er ikke nødvendigt at bruge svære fagudtryk. Stil blot enkle spørgsmål:
- *"Dufter du noget grønt? Som nyslået græs?"*
- *"Minder det dig om noget? Tomatblade, mandel eller artiskok?"*
- *"Hvor bitter er den? Hvor meget kildrer den i halsen?"*

Dette skaber engagement og nysgerrighed — langt mere effektivt end en tør teknisk forklaring.

:::cta
Smagekasse fra Frantoio del Pasqua
Tre olivenolier, tre profiler, med vejledende smagsnoter inkluderet. Perfekt til gæsteaftener eller som en eksklusiv gave.
[Se smagekassen](/shop)
:::`,
    },
    "no": {
      slug: "broed-og-olivenolje-smaksguide-gjester",
      title: "Brød og olivenolje: En mini-smaksguide for gjester (og smaksboks)",
      excerpt: "Å servere brød og olivenolje er en handling av varm gjestfrihet. La oss gjøre det til et lite smaksspill for å hjelpe gjestene dine med å skille mellom profilene.",
      category: "Oppskrifter & Parringer",
      content: `## Kunsten å smake helt enkelt

Man behøver ikke å være vinkelner for å arrangere en minneverdig olivenoljesmaking. Det krever bare noen få grunnregler og det riktige utstyret. Effekten på gjester og familie er garantert.

## Dette trenger du

- **2 eller 3 forskjellige olivenoljer** (f.eks. lett, medium og intensiv fruktig)
- **Saltfritt brød** (av toskansk type, bakt uten salt) eller nøytrale kjeks
- **Mørke eller ugjennomsiktige glass** (eller små keramikkskåler)
- **Kildevann ved romtemperatur** for å rense ganen
- **Et lite smaksskjema** til hver olje (navn, olivensort, smaksnotater)

## Fremgangsmåte

1. **Hell 5–10 ml** olivenolje i det lille glasset
2. **Varm opp** glasset mellom hendene i 30 sekunder — varmen frigjør de flyktige aromaene
3. **Dekk glasset med håndflaten** og sving det rundt for å konsentrere duftene
4. **Luktfinn** med nesen nede i glasset: Se etter toner (gress, tomatblad, mandel, grønn frukt)
5. **Smak**: Ta en liten tår, fordel den over hele tungen, og trekk luft inn gjennom munnen (strippaggio, akkurat som ved vinsmaking)
6. Vent 20–30 sekunder: Den *peprede skarpheten* kommer til sist, bakerst i halsen

Mellom de forskjellige oljene: Drikk en tår **vann** og spis et lite stykke saltfritt brød for å rense ganen.

## Hvordan beskriver du det du sanser

Det er ikke nødvendig å bruke vanskelige faguttrykk. Still bare enkle spørsmål:
- *"Dufter du noe gress? Som nyslått gress?"*
- *"Minner det deg om noe? Tomatblader, mandel eller artisjokk?"*
- *"Hvor bitter er den? Hvor mye kiler den i halsen?"*

Dette skaper engasjement og nysgjerrighet — langt mer effektivt enn en tørr teknisk forklaring.

:::cta
Smaksboks fra Frantoio del Pasqua
Tre olivenoljer, tre profiler, med veiledende smaksnoter inkludert. Perfekt til gjestekvelder eller som en eksklusiv gave.
[Se smaksboksen](/shop)
:::`,
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
      content: `## An ancient tradition

Throughout the Mediterranean coast—from Liguria to Greece, via Sicily and Spain—vegetable oils have been used in sweets for millennia. Before butter became dominant in pastry making, olive oil was the go-to fat for cakes, biscuits, fritters, and sweet focaccias.

The result is a dessert with a **moist and soft texture** that lasts much longer compared to butter-based batters, along with a delicately fruity undertone.

## Which olive oil to choose for baking

- **Light fruity**: the most versatile and safest choice. It does not interfere with delicate flavors like vanilla or lemon.
- **Delicate medium fruity**: excellent with chocolate (the mild-bitter contrast is very interesting) and with oranges.
- **Intense fruity**: use sparingly in desserts, as it can dominate. But in certain pairings (oil + 85% dark chocolate, oil + bitter citrus fruits), it is absolutely extraordinary.

## Where it works best

1. **Lemon cake with olive oil**: replace butter with 2/3 of its weight in light olive oil — the result is wonderfully moist.
2. **Ciambellone (Italian bundt cake) with olive oil**: a classic of home baking, the perfect breakfast.
3. **Sesame cookies** (Sicilian style): extra virgin olive oil with toasted sesame seeds is an ancestral pairing.
4. **Brownies with olive oil and dark chocolate**: the herbal note of the oil beautifully enhances the bitterness of the chocolate.
5. **Pistachio panna cotta with olive oil**: a thin drizzle of light olive oil right before serving.

## Butter to olive oil conversion

As a general rule: **100g of butter = 75ml of EVOO** (butter contains water and milk solids in addition to fat, so less oil is needed by volume).`,
    },
    "de": {
      slug: "backen-mit-olivenoel-extra-desserts",
      title: "Backen mit Olivenöl Extra: Ja, das geht – mit Zitrone, Schokolade und Aromen",
      excerpt: "Butter beim Backen durch Olivenöl Extra zu ersetzen, ist möglich und köstlich. Erfahren Sie, welche Kuchen sich am besten eignen und wie die Mengen aussehen.",
      category: "Rezepte & Kombinationen",
      content: `## Eine uralte Tradition

An der gesamten Mittelmeerküste – von Ligurien über Sizilien und Spanien bis nach Griechenland – werden seit Jahrtausenden pflanzliche Öle in Süßspeisen verwendet. Bevor Butter die Oberhand in der Backstube gewann, war Olivenöl das Fett der Wahl für Kuchen, Kekse, Krapfen und süße Focaccias.

Das Ergebnis ist ein Gebäck mit einer **wunderbar feuchten und weichen Textur**, das deutlich länger frisch bleibt als Teige mit Butter, begleitet von einer dezent fruchtigen Note im Hintergrund.

## Welches Olivenöl für Süßspeisen wählen

- **Leicht fruchtig**: Die vielseitigste und sicherste Wahl. Es übertönt feine Aromen wie Vanille oder Zitrone nicht.
- **Mild-mittelfruchtig**: Hervorragend zu Schokolade (der Kontrast zwischen milder Bitterkeit und Süße ist hochinteressant) und Orangen.
- **Intensiv fruchtig**: In Süßspeisen sparsam verwenden, da es dominieren kann. In bestimmten Kombinationen (Öl + 85% dunkle Schokolade, Öl + bittere Zitrusfrüchte) ist es jedoch absolut außergewöhnlich.

## Wo es am besten gelingt

1. **Zitronenkuchen mit Olivenöl**: Ersetzen Sie die Butter durch 2/3 des Gewichts an leichtem Olivenöl – das Ergebnis ist fantastisch saftig.
2. **Ciambellone (italienischer Napfkuchen) mit Öl**: Der Klassiker der hausgemachten Küche, das perfekte Frühstück.
3. **Sesamkekse** (nach sizilianischer Art): Olivenöl Extra Vergine mit gerösteten Sesamsamen ist eine traditionelle Traumkombination.
4. **Brownies mit Olivenöl und dunkler Schokolade**: Die pflanzliche Note des Öls unterstreicht die Herbe der Schokolade perfekt.
5. **Pistazien-Panna-Cotta mit Olivenöl**: Ein hauchdünner Faden leichten Olivenöls direkt vor dem Servieren.

## Umrechnung Butter → Olivenöl

Als allgemeine Faustregel gilt: **100 g Butter = 75 ml Olivenöl Extra Vergine** (da Butter neben Fett auch Wasser und Milchbestandteile enthält, wird volumenmäßig weniger Öl benötigt).`,
    },
    "nl": {
      slug: "bakken-met-extra-vierge-olijfolie",
      title: "Bakken met extra vierge olijfolie: ja, dat kan — met citroen, chocolade en aroma's",
      excerpt: "Boter vervangen door extra vierge olijfolie in desserts kan uitstekend en is heerlijk. Ontdek welke taarten zich hier het beste voor lenen en de juiste verhoudingen.",
      category: "Recepten & Combinaties",
      content: `## Een eeuwenoude traditie

Langs de hele Middellandse Zeekust — van Ligurië tot Griekenland, via Sicilië en Spanje — worden al duizenden jaren plantaardige oliën gebruikt in zoete gerechten. Voordat boter dominant werd in de banketbakkerswereld, was olijfolie het vet bij uitstek voor taarten, koekjes, beignets en zoete focaccia's.

Het resultaat is een gebak met een **vochtige en zachte textuur** die veel langer meegaat dan beslag op basis van boter, met een verfijnde, subtiel fruitige ondertoon.

## Welke olijfolie te kiezen voor desserts

- **Licht fruitig**: de meest veelzijdige en veilige keuze. Het interfereert niet met delicate smaken zoals vanille of citroen.
- **Mild medium fruitig**: uitstekend in combinatie met chocolade (het contrast tussen mild bitter en zoet is zeer interessant) en met sinaasappels.
- **Intens fruitig**: wees hier spaarzaam mee in desserts — het kan snel overheersen. Maar in specifieke combinaties (olijfolie + 85% pure chocolade, olijfolie + bittere citrusvruchten) is het absoluut fantastisch.

## Waar het het beste werkt

1. **Citroentaart met olijfolie**: vervang de boter door 2/3 van het gewicht aan lichte olijfolie — het resultaat is ongeëvenaard smeuïg.
2. **Ciambellone (Italiaanse tulband) met olijfolie**: de ultieme klassieker uit de familierecepten, perfect voor het ontbijt.
3. **Sesamkoekjes** (op zijn Siciliaans): extra vierge olijfolie met geroosterd sesamzaad is een aloude succeskombinatie.
4. **Brownie met olijfolie en pure chocolade**: de plantaardige noot van de olijfolie versterkt de rijke bitterheid van de chocolade.
5. **Pistache panna cotta met olijfolie**: een subtiel scheutje lichte olijfolie net voor het serveren.

## Omberekening boter → olijfolie

Als algemene regel geldt: **100g boter = 75ml extra vierge olijfolie** (boter bevat naast vet ook water en eiwitten, waardoor er in volume minder olie nodig is).`,
    },
    "da": {
      slug: "bagning-med-ekstra-jomfruolivenolie",
      title: "Bagning med ekstra jomfruolivenolie: Ja, du kan — med citron, chokolade og aromaer",
      excerpt: "Det er fuldt ud muligt og lækkert at erstatte smør med ekstra jomfruolivenolie i bagværk. Se, hvilke kager der egner sig bedst, og find de rette forhold.",
      category: "Opskrifter & Parringer",
      content: `## En gammel tradition

Langs hele Middelhavets kyst—fra Ligurien til Grækenland, via Sicilien og Spanien—har man brugt vegetabilske olier i søde sager i årtusinder. Før smør blev dominerende i bagværk, var olivenolie fedtstoffet til kager, småkager, frituret bagværk og søde focacciaer.

Resultatet er bagværk med en **svampet og blød konsistens**, som holder sig frisk meget længere end dej lavet på smør, ledsaget af en delikat frugtig undertone.

## Hvilken olivenolie skal man vælge til bagning

- **Let frugtig**: Det mest alsidige og sikre valg. Det overdøver ikke fine smage som vanilje eller citron.
- **Mild medium frugtig**: Fremragende sammen med chokolade (den let bitre kontrast er spændende) og med appelsiner.
- **Intensiv frugtig**: Skal bruges med omhu i desserter — den kan nemt dominere. Men i visse sammensætninger (olie + 85 % mørk chokolade, olie + bitre citrusfrugter) er den helt fantastisk.

## Hvor fungerer det bedst

1. **Citronkage med olivenolie**: Erstat smørret med 2/3 af vægten i let olivenolie — resultatet er utrolig svampet.
2. **Ciambellone (italiensk sandkage) med olie**: En klassiker i hjemmekøkkenet, den perfekte morgenmad.
3. **Sesamsmåkager** (siciliansk stil): Ekstra jomfruolivenolie med ristede sesamfrø er en klassisk drømmekombination.
4. **Brownies med olivenolie og mørk chokolade**: Oliens grønne og urtede noter fremhæver chokoladens dybe bitterhed smukt.
5. **Pistacie-panna cotta med olivenolie**: En tynd ring af let olivenolie lige inden servering.

## Omregning smør → olivenolie

Som generel tommelfingerregel gælder: **100 g smør = 75 ml ekstra jomfruolivenolie** (smør indeholder også vand og mælkebestanddele, hvorfor der skal bruges mindre olie i volumen).`,
    },
    "no": {
      slug: "baking-med-ekstra-jomfruolivenolje",
      title: "Baking med ekstra jomfruolivenolje: Ja, du kan – med sitron, sjokolade og aromaer",
      excerpt: "Å erstatte smør med ekstra jomfruolivenolje i bakverk er fretent mulig og kjempegodt. Oppdag hvilke kaker som egner seg best og de perfekte forholdene.",
      category: "Oppskrifter & Parringer",
      content: `## En eldgammel tradisjon

Langs hele Middelhavskysten – fra Liguria til Hellas, via Sicilia og Spania – har man brukt vegetabilske oljer i søtsaker i årtusener. Før smør ble dominerende i bakverk, var olivenolje det foretrukne fettstoffet til kaker, kjeks, frityrbakst og søte focacciaer.

Resultatet er bakverk med en **saftig og myk konsistens** som holder seg fersk mye lenger enn deig laget på smør, ledsaget av en delikat fruktig undertone.

## Hvilken olivenolje bør du velge til baking

- **Lett fruktig**: Det mest allsidige og sikre valget. Det overdøver ikke fine smaker som vanilje eller sitron.
- **Mild medium fruktig**: Fremragende sammen med sjokolade (den lett bitre kontrasten er spennende) og med appelsiner.
- **Intens fruktig**: Bør brukes med omhu i desserter – den kan lett dominere. Men i visse sammensætninger (olje + 85 % mørk sjokolade, olje + bitre sitrusfrukter) er den helt fantastisk.

## Hvor fungerer det best

1. **Sitronkake med olivenolje**: Erstatt smøret med 2/3 av vekten i lett olivenolje – resultatet blir utrolig saftig.
2. **Ciambellone (italiensk formkake) med olje**: En klassiker i hjemmekjøkkenet, den perfekte frokosten.
3. **Sesamkjeks** (siciliansk stil): Ekstra jomfruolivenolje med ristede sesamfrø er en klassisk drømmekombinasjon.
4. **Brownies med olivenolje og mørk sjokolade**: Oljens grønne og urtete toner fremhever sjokoladens dype bitterhet nydelig.
5. **Pistasj-panna cotta med olivenolje**: En tynn stripe lett olivenolje rett før servering.

## Omregning smør → olivenolje

Som generell tommelfingerregel gjelder: **100 g smør = 75 ml ekstra jomfruolivenolje** (siden smør inneholder vann og melkebestanddeler i tillegg til fett, brukes mindre olje i volum).`,
    },
  },
"""

content = content[:start_idx] + new_block + content[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement successful!")
