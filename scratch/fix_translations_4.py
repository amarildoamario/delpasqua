import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We will insert the new translation block right before "dif-3": {
target_marker = '  "dif-3": {'

target_idx = content.find(target_marker)

if target_idx == -1:
    print("Target marker not found!")
    exit(1)

new_translations = """  "com-2": {
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
      content: `## Debunking a myth about good olive oil

We often think that for an extra virgin olive oil to be truly "genuine" and healthy, it must scratch our throat like sandpaper. We think that if it doesn't leave our mouth very bitter, perhaps it's not an artisanal product.

> Olive oil with a "light fruitiness" is clear proof that you can be of the highest quality but also... very polite at the table.

We are not talking about old or watered-down oils, but about cold extraction of olives from very specific varieties, such as the fantastic Tuscan Leccino or the Ligurian Taggiasca. These cultivars have, by genetic nature, a milder flavor that accompanies dishes beautifully without ever stealing the show.

## Aromas of apple and almond

If you smell a freshly poured light fruity oil, you won't smell the sharp scent of cut grass or artichoke, but elegant and welcoming aromas:

*   **Fresh almond:** A sweet and round scent, typical of the most delicate varieties.
*   **Ripe yellow apple:** A fruity sweetness that does not saturate the sense of smell.
*   **Pine and wild flowers:** Light floral notes in the background.

In the mouth, the slight peppery tickle is there (otherwise it wouldn't be fresh!), but it is almost a sweet tickle and never aggressive. It is a balanced and round oil that cleanses the palate, leaving a very pleasant sensation.

## When the dish is delicate, it takes the right touch

Light fruity oil gives its best on dishes with a mild and unobtrusive flavor. Imagine dressing a delicate raw red shrimp with a very bitter oil: a disaster for the palate!

Here are the best pairings to make this oil stand out:

1.  **Raw or steamed fish:** White fish carpaccios, seared scallops, or seafood salads.
2.  **Fresh dairy products:** It glides beautifully over a nice buffalo mozzarella or a candid treccia, without covering the sweetness of the milk.
3.  **Homemade desserts:** Replace butter with 3/4 its weight in olive oil to get incredibly soft, digestible cakes (like apple cake) that stay fragrant for days.

:::cta
Try our light fruity selection
A delicate extract, perfect for raw fish, fresh salads, or for baking delicious desserts.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "leicht-fruchtiges-olivenoel-kombinationen",
      title: "Kombinationen mit leicht fruchtigem Olivenöl Extra",
      excerpt: "Leicht fruchtiges Olivenöl ist der perfekte Begleiter für feinste Gerichte. Erfahren Sie, wie Sie es verwenden, ohne Aromen zu verdecken.",
      category: "Einkaufsführer",
      content: `## Ein Mythos über gutes Olivenöl entschlüsselt

Wir denken oft, dass ein Olivenöl Extra Vergine, um wirklich „echt“ und gesund zu sein, unseren Hals wie Sandpapier kratzen muss. Wir glauben, wenn es den Mund nicht extrem bitter hinterlässt, ist es vielleicht kein handwerkliches Produkt.

> Ein Olivenöl mit einer „leichten Fruchtigkeit“ ist der schlagende Beweis dafür, dass man von höchster Qualität und gleichzeitig... sehr höflich bei Tisch sein kann.

Wir sprechen hier nicht von alten oder verwässerten Ölen, sondern von Kaltpressungen ganz bestimmter Olivensorten, wie der fantastischen toskanischen Leccino oder der ligurischen Taggiasca. Diese Sorten haben von Natur aus einen milderen Geschmack, der Gerichte hervorragend begleitet, ohne ihnen jemals die Show zu stehlen.

## Aromen von Apfel und Mandel

Wenn Sie ein frisch eingeschenktes leicht fruchtiges Öl riechen, vernehmen Sie nicht den scharfen Duft von frisch gemähtem Gras oder Artischocke, sondern elegante und einladende Aromen:

*   **Frische Mandel:** Ein süßer und runder Duft, typisch für die zartesten Sorten.
*   **Reifer gelber Apfel:** Eine fruchtige Süße, die den Geruchssinn umschmeichelt.
*   **Kiefer und Wildblumen:** Leichte blumige Noten im Hintergrund.

Im Mund ist ein leichtes Kitzeln spürbar (sonst wäre es nicht frisch!), aber es ist fast ein süßes und niemals aggressives Kitzeln. Es ist ein ausgewogenes und rundes Öl, das den Gaumen reinigt und ein sehr angenehmes Gefühl hinterlässt.

## Wenn das Gericht zart ist, braucht es die richtige Note

Leicht fruchtiges Öl zeigt seine Stärken bei Gerichten mit mildem und unaufdringlichem Geschmack. Stellen Sie sich vor, Sie würden eine feine rohe rote Garnele mit einem sehr bitteren Öl beträufeln: eine Katastrophe für den Gaumen!

Hier sind die besten Kombinationen, um dieses Öl zur Geltung zu bringen:

1.  **Roher oder gedämpfter Fisch:** Carpaccio von weißem Fisch, kurz gebratene Jakobsmuscheln oder Meeresfrüchtesalate.
2.  **Frische Milchprodukte:** Es fließt wunderbar über Büffelmozzarella oder frischen Käse, ohne die Süße der Milch zu überdecken.
3.  **Hausgemachtes Gebäck:** Ersetzen Sie Butter durch 3/4 ihres Gewichts an Olivenöl, um superweiche, bekömmliche Kuchen (wie Apfelkuchen) zu erhalten, die tagelang duften.

:::cta
Probieren Sie unsere leicht fruchtige Auswahl
Ein delikates Öl, ideal für rohen Fisch, frische Salate oder zum Backen köstlicher Desserts.
[Jetzt kaufen](/shop)
:::`,
    },
    "nl": {
      slug: "licht-fruitige-olijfolie-combinaties",
      title: "Combinaties met licht fruitige extra vierge olijfolie",
      excerpt: "Licht fruitige olijfolie is de perfecte partner voor de meest delicate recepten. Ontdek hoe je het gebruikt zonder smaken te overheersen.",
      category: "Koopgids",
      content: `## Een mythe over goede olijfolie ontkracht

We denken vaak dat een extra vierge olijfolie, om echt \"puur\" en gezond te zijn, in onze keel moet krassen als schuurpapier. We denken dat als het de mond niet erg bitter achterlaat, het misschien geen ambachtelijk product is.

> Olijfolie met een \"lichte fruitigheid\" is het overtuigende bewijs dat je van de hoogste kwaliteit kunt zijn maar ook... heel beleefd aan tafel.

We hebben het niet over oude of verwaterde oliën, maar over koude extracties van zeer specifieke olijfvariëteiten, zoals de fantastische Toscaanse Leccino of de Ligurische Taggiasca. Deze cultivars hebben genetisch gezien een mildere smaak die gerechten prachtig begeleidt zonder ooit de show te stelen.

## Aroma's van appel en amandel

Als je een vers ingeschonken licht fruitige olie ruikt, ruik je niet de scherpe geur van gemaaid gras of artisjok, maar elegante en uitnodigende aroma's:

*   **Verse amandel:** Een zoete en ronde geur, typisch voor de meest delicate variëteiten.
*   **Rijpe gele appel:** Een fruitige zoetheid die de reukzin niet overprikkelt.
*   **Dennegroen en wilde bloemen:** Lichte bloemige tonen op de achtergrond.

In de mond is de lichte pittige prikkeling aanwezig (anders zou het niet vers zijn!), maar het is bijna een milde tinteling en nooit agressief. Het is een harmonieuze en ronde olijfolie die het palet reinigt en een zeer aangename sensatie achterlaat.

## Als het gerecht delicaat is, is de juiste touch vereist

Licht fruitige olijfolie komt het best tot zijn recht bij gerechten met een milde en subtiele smaak. Stelt u zich eens voor dat u een delicate rauwe rode garnaal besprenkelt met een zeer bittere olie: een ramp voor het palet!

Dit zijn de beste combinaties om deze olie te laten schitteren:

1.  **Rauwe of gestoomde vis:** Carpaccio van witte vis, kort gebakken sint-jakobsschelpen of salades met zeevruchten.
2.  **Verse zuivel:** Het glijdt prachtig over een lekkere buffelmozzarella of burrata, zonder de zoetheid van de melk te maskeren.
3.  **Huisgemaakt gebak:** Vervang boter door 3/4 van het gewicht aan olijfolie voor heerlijk zachte, licht verteerbare taarten (zoals appeltaart) die dagenlang geurig blijven.

:::cta
Probeer onze licht fruitige selectie
Een delicaat extract, perfect voor rauwe vis, frisse salades of het bakken van heerlijke desserts.
[Ontdek de Shop](/shop)
:::`,
    },
    "da": {
      slug: "let-frugtig-olivenolie-parringer",
      title: "Parringer med let frugtig olivenolie",
      excerpt: "Let frugtig olivenolie er den perfekte ledsager til de mest delikate opskrifter. Se, hvordan du bruger den uden at overdøve smagen.",
      category: "Købsguide",
      content: `## Vi afliber en myte om god olivenolie

Vi tror ofte, at en ekstra jomfruolivenolie skal kradse i halsen som sandpapir for at være ægte og sund. Vi tror, at hvis den ikke efterlader en bitter smag i munden, er det måske inte et håndværksmæssigt produkt.

> Olivenolie med en "let frugtighed" er det klare bevis på, at man kan være af højeste kvalitet og samtidig... yderst høflig ved bordet.

Vi taler ikke om gamle eller udvandede olier, men om koldpresning af meget specifikke olivensorter, som den fantastiske toscanske Leccino of den liguriske Taggiasca. Disse sorter har af genetiske årsager en mildere smag, som ledsager retterne fremragende uden at stjæle rampelyset.

## Dufte af æble og mandel

Hvis du dufter til en let frugtig olie, vil du ikke mærke den skarpe duft af nyslået græs eller artiskok, men elegante og imødekommende aromaer:

*   **Frisk mandel:** En sød og rund duft, typisk for de mest delikate sorter.
*   **Modent gult æble:** En frugtig sødme, der ikke overvælder lugtesansen.
*   **Fyrrenåle og vilde blomster:** Lette blomsternoter i baggrunden.

I munden er der en let prikken (ellers ville den ikke være frisk!), men det er næsten som en blid kildren og aldrig aggressivt. Det er en balanceret og rund olie, der renser ganen og efterlader en yderst behagelig fornemmelse.

## Når retten er delikat, kræver det den rette berøring

Let frugtig olivenolie er bedst til retter med en mild og diskret smag. Forestil dig at dryppe en delikat rå rød reje med en meget bitter olie: en katastrofe for ganen!

Here er de bedste parringer for at få denne olie til at skinne:

1.  **Rå eller dampet fisk:** Carpaccio af hvid fisk, lynstegte kammuslinger eller skaldyrssalater.
2.  **Friske mejeriprodukter:** Den glider perfekt over en god bøffelmozzarella, uden at dække over mælkens sødme.
3.  **Hjemmebagte kager:** Erstat smørret med 3/4 af vægten i let olivenolie for at få utrolig svampede og letfordøjelige kager (f.eks. æblekage).

:::cta
Prøv vores let frugtige udvalg
En delikat olie, perfekt til rå fisk, friske salater eller til bagning af lækre desserter.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "lett-fruktig-olivenolje-parringer",
      title: "Parringer med lett fruktig olivenolje",
      excerpt: "Lett fruktig olivenolje er den perfekte ledsageren for sarte oppskrifter. Oppdag hvordan du bruker den uten å dekke over smakene.",
      category: "Kjøpsguide",
      content: `## Vi avliver en myte om god olivenolje

Vi tror ofte at for at en ekstra jomfruolivenolje skal være ekte og sunn, må den skrape i halsen som sandpapir. Vi tror at hvis den ikke etterlater en veldig bitter smak, er det kanskje ikke et håndverksprodukt.

> Olivenolje with a "lett fruktighet" er det klare beviset på at man kan være av høyeste kvalitet og samtidig... opptre yderst høflig ved bordet.

Vi snakker ikke om gamle eller utvannede oljer, men om kaldpressing av helt spesifikke olivensorter, som den fantastiske toskaniske Leccino eller den liguriske Taggiasca. Disse sortene har av genetiske årsaker en mildere smak som ledsager retter utmerket uten å stjele oppmerksomheten.

## Dufte av eple og mandel

Hvis du lukter på en nylig opphelt lett fruktig olje, vil du ikke kjenne den skarpe lukten av nyslått gress eller artisjokk, men elegante og innbydende aromaer:

*   **Frisk mandel:** En søt og rund duft, typisk for de mest delikate sortene.
*   **Modent gult eple:** En fruktig sødme som ikke overvelder luktesansen.
*   **Furu og ville blomster:** Lette blomsternoter i bakgrunnen.

I munnen er det en lett prikking (ellers ville den ikke vært frisk!), men det er nesten som en mild kiling og aldri aggressivt. Det er en balansert og rund olje som renser ganen og etterlater en veldig behagelig følelse.

## Når retten er delikat, kreves det riktig berøring

Lett fruktig olivenolje er best til retter med en mild og diskret smak. Forestill deg å dryppe en delikat rå rød reke med en veldig bitter olje: en katastrofe for ganen!

Her er de beste parringene for å få denne oljen til å skinne:

1.  **Rå eller dampet fisk:** Carpaccio av hvit fisk, lynstekte kamskjell eller skalldyrsalater.
2.  **Friske meieriprodukter:** Den glir perfekt over en god bøffelmozzarella, uten at dekke over melkens sødme.
3.  **Hjemmebakte kaker:** Erstatt smøret med 3/4 av vekten i lett olivenolje for å få utrolig saftige og lettfordøyelige kaker (f.eks. eplekake).

:::cta
Prøv vårt lett fruktige utvalg
En delikat olje, perfekt til rå fisk, friske salater eller til baking av deilige desserter.
[Se butikken](/shop)
:::`,
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
      content: `## How and when to use Intense Fruity EVOO

If there is an olive oil that does not go unnoticed, it is the **intense fruity**. You understand it as soon as you pour it: a "green," alive aroma, almost like a vegetable garden. And when you taste it, you immediately notice two things that make it unique: a **pleasant bitter note** and a **distinct peppery throat-kick**. If you are not used to it, it can be surprising, but it is not a defect: it is its character.

The point is this: intense fruity is not a "difficult" oil, it is an oil that must be put **in the right place**. When you pair it well, it performs a simple magic: the dish seems more fragrant, fuller, more "real."

## What flavor to expect

Imagine aromas reminiscent of cut grass, artichoke, and green tomatoes. Then in the mouth comes the more decisive side: a bitterness that remains clean and a spiciness that lasts for a few seconds.

The useful thing to know is this: an intense fruity oil tends to be more energetic because it is often made from olives harvested early, when they are still green. Translated to the kitchen? It is an oil that does not want to stay in the background: it wants to **give personality**.

## When to use it (and why it works)

Intense fruity gives its best when it meets dishes that already have a savory or structured base. It is like a spice: it doesn't cover, it **pulls out**.

For example, on a **bean soup**: if you add it at the end, when the dish is ready, it immediately changes the aroma. The chickpeas become "warmer," the beans seem creamier, and everything takes on a richer direction without having to add anything else.

It also works beautifully with **robust greens**. Think of chicory, kale, radicchio: these are vegetables that already have their own personality, and the bitterness of the intense fruity oil locks in well, as if it was meant to be. And often, that is precisely where many change their minds: what seemed "too much" suddenly becomes "perfect."

Then there are the dishes where the effect is immediate, almost instinctive: **meats**, **grilled dishes**, **mushrooms**, grilled vegetables. The intense fruity oil adds that final touch that makes you want another bite, because it brings freshness and depth at the same time.

And yes, it is always worth saying: if you want to really understand what an intense fruity is, the simplest test is **warm bread**. Nothing else is needed. A drizzle of good oil, a pinch of salt, and that's it.

## When to use with caution

There are cases where the intense fruity risks being too much of a protagonist. Not because "it's not good," but because some dishes ask for delicacy and this oil, if abundant, can shift the balance.

If you are preparing something very soft and subtle — such as a super delicate white fish, a sweet mozzarella, a light cream that you want to keep velvety — you can still use it, but with a very light hand. In those dishes, the easiest choice is a medium or light fruity, while you keep the intense one for when you really want to feel the condiment.

## The trick to never make a mistake

The simplest secret is one: **add it at the end of cooking**.

When the dish is ready, when the heat makes the aromas rise, put a drizzle of oil and taste. It is a simple gesture, but it changes everything, because intense fruity (if it is good) has aromas that are part of the pleasure: cooking it too much or putting it "at random" can ruin that freshness.

:::cta
Want to try the real deal?
You recognize a good intense fruity oil immediately: green aroma, full taste, clean finish.
[Discover the selection in the shop](/shop)
:::`,
    },
    "de": {
      slug: "intensiv-fruchtiges-olivenoel-anwendung",
      title: "Wie und wann Sie intensiv fruchtiges Olivenöl Extra verwenden",
      excerpt: "Kräftige Bitterkeit, markante Schärfe und betörende Waldaromen. Intensiv fruchtiges Olivenöl überrascht, ist aber ein unübertroffenes Konzentrat.",
      category: "Einkaufsfuehrer",
      content: `## Wie und wann Sie intensiv fruchtiges Olivenöl verwenden

Wenn es ein Öl gibt, das nicht unbemerkt bleibt, dann ist es das **intensiv fruchtige**. Man riecht es schon beim Einschenken: ein „grünes“, lebendiges Aroma, fast wie frisch aus dem Gemüsegarten. Und wenn man es probiert, bemerkt man sofort zwei Dinge, die es einzigartig machen: eine **angenehme Bitternote** und eine **deutliche Schärfe im Rachen**. Wenn Sie nicht daran gewöhnt sind, kann es überraschen, aber es ist kein Fehler: Es ist sein wahrer Charakter.

Der Punkt ist der: Intensiv fruchtiges Olivenöl ist kein „schwieriges“ Öl, es ist ein Öl, das **an die richtige Stelle** gehört. Wenn man es gut kombiniert, bewirkt es eine einfache Magie: Das Gericht wirkt duftender, voller, „echter“.

## Welchen Geschmack man erwarten kann

Stellen Sie sich Aromen vor, die an frisch gemähtes Gras, Artischocke und grüne Tomaten erinnern. Dann kommt im Mund die kräftigere Seite durch: eine Bitterkeit, die sauber bleibt, und eine Schärfe, die einige Sekunden anhält.

Das Wichtigste ist: Ein intensiv fruchtiges Öl ist temperamentvoller, weil es oft aus früh geernteten Oliven hergestellt wird, wenn diese noch grün sind. In der Küche bedeutet das: Dieses Öl will nicht im Hintergrund bleiben, es will **Persönlichkeit verleihen**.

## Wann man es verwendet (und warum es funktioniert)

Intensiv fruchtiges Öl zeigt seine Stärken, wenn es auf Gerichte trifft, die bereits eine herzhafte oder strukturierte Basis haben. Es ist wie ein Gewürz: Es überdeckt nicht, es **hebt hervor**.

Zum Beispiel auf einer **Bohnensuppe**: Wenn man es am Ende hinzufügt, verändert es sofort das Aroma. Die Kichererbsen werden „wärmer“, die Bohnen wirken cremiger und alles bekommt eine reichere Note, ohne dass man etwas anderes hinzufügen müsste.

Es funktioniert auch hervorragend mit **Gemüsesorten mit starkem Eigengeschmack**. Denken Sie an Chicorée, Grünkohl, Radicchio: Dies sind Gemüse, die bereits eine eigene Persönlichkeit haben, und die Bitterkeit des intensiv fruchtigen Öls passt perfekt dazu.

Und ja, es ist immer eine Erwähnung wert: Wenn Sie wirklich verstehen wollen, was ein intensiv fruchtiges Öl ist, ist der einfachste Test **warmes Brot**. Mehr braucht es nicht. Ein Faden gutes Öl, eine Prise Salz, fertig.

## Wann man es mit Vorsicht verwendet

Es gibt Fälle, in denen das intensiv fruchtige Öl Gefahr läuft, zu sehr im Vordergrund zu stehen. Nicht, weil es „nicht gut“ ist, sondern weil manche Gerichte nach Zartheit verlangen.

Wenn Sie etwas sehr Mildes zubereiten – zum Beispiel einen superzarten weißen Fisch, einen süßen Mozzarella oder eine leichte Creme –, können Sie es zwar verwenden, aber mit sehr feiner Hand. Bei diesen Gerichten ist ein mildes oder leicht fruchtiges Öl meist die einfachere Wahl.

## Der Trick, um nie einen Fehler zu machen

Das einfachste Geheimnis lautet: **Erst ganz am Ende hinzufügen**.

Wenn das Gericht fertig ist und die Hitze die Aromen aufsteigen lässt, geben Sie einen Faden Öl darüber und probieren Sie. Es ist eine einfache Geste, aber sie verändert alles.

:::cta
Möchten Sie es wirklich probieren?
Ein gutes intensiv fruchtiges Öl erkennen Sie sofort: grünes Aroma, voller Geschmack, sauberer Nachhall.
[Entdecken Sie die Auswahl im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "intensief-fruitige-olijfolie-gebruik",
      title: "Hoe en wanneer intensief fruitige extra vierge olijfolie te gebruiken",
      excerpt: "Krachtige bitterheid, markante pittigheid en rijke aroma's. Intensief fruitige olijfolie verrast, maar is een ongeëvenaard gezondheidselixer.",
      category: "Koopgids",
      content: `## Hoe en wanneer intensief fruitige olijfolie te gebruiken

Als er één olijfolie is die niet onopgemerkt blijft, dan is het wel de **intensief fruitige**. Je ruikt het al zodra je het inschenkt: een \"groen\", levendig aroma, bijna zoals een moestuin. En als je het proeft, merk je meteen twee dingen die het uniek maken: een **aangename bittere noot** en een **duidelijke prikkeling achter in de keel**. Als je er niet aan gewend bent, kan het verrassen, maar het is geen defect: het is juist zijn karakter.

Het punt is dit: intensief fruitig is geen \"moeilijke\" olie, het is een olie die **op de juiste plek** moet worden gebruikt. Als je het goed combineert, doet het iets magisch: het gerecht lijkt geuriger, voller, \"echter\".

## Welke smaak kun je verwachten

Stel je aroma's voor die doen denken aan gemaaid gras, artisjok en groene tomaten. Dan komt in de mond de krachtigere kant naar voren: een bitterheid die schoon blijft en een pittigheid die een paar seconden aanhoudt.

Wat handig is om te weten: een intensief fruitige olijfolie is energieker omdat deze vaak wordt gemaakt van olijven die vroeg zijn geoogst, toen ze nog groen waren. Vertaald naar de keuken? Dit is een olie die niet op de achtergrond wil blijven: hij wil **persoonlijkheid geven**.

## Wanneer te gebruiken (en waarom het werkt)

Intensief fruitig komt het best tot zijn recht bij gerechten die al een hartige of gestructureerde basis hebben. Het is als een specerij: het maskeert niet, het **haalt op**.

Bijvoorbeeld op een **bonensoep**: als je het aan het einde toevoegt, wanneer het gerecht klaar is, verandert het aroma direct. De kikkererwten worden \"warmer\", de bonen lijken romiger en alles krijgt een rijkere dimensie zonder dat je iets anders hoeft toe te voegen.

Het werkt ook prachtig met **groenten met een sterke smaak**. Denk aan witlof, boerenkool, radicchio: dit zijn groenten die al een eigen persoonlijkheid hebben, en de bitterheid van de intensief fruitige olie sluit hier perfect op aan.

En ja, het is altijd de moeite waard om te zeggen: als je echt wilt begrijpen wat een intensief fruitige olie is, dan is de eenvoudigste test **warm brood**. Niets anders is nodig. Een scheutje goede olie, een snufje zout en klaar.

## Wanneer voorzichtig te gebruiken

Er zijn gevallen waarin de intensief fruitige olie het risico loopt te veel de hoofdrol op te eisen. Niet omdat het \"niet goed\" is, maar omdat sommige gerechten om subtiliteit vragen.

Als je iets heel zachts en delicaats bereidt — zoals een superzachte witte vis, een milde mozzarella of een lichte crème — kun je het nog steeds gebruiken, maar met een zeer bescheiden hand. Bij die gerechten is een medium of licht fruitige olijfolie vaak de makkelijkste keuze.

## De truc om nooit een fout te maken

Het eenvoudigste geheim is: **voeg het toe na de bereiding**.

Wanneer het gerecht klaar is en de hitte de aroma's doet opstijgen, giet je er een scheutje olijfolie over. Het is een simpel gebaar, maar het verandert alles.

:::cta
Wilt u de echte ervaring proberen?
Een goede intensief fruitige olijfolie herken je meteen: groen aroma, volle smaak, zuivere afdronk.
[Ontdek de selectie in de shop](/shop)
:::`,
    },
    "da": {
      slug: "intensiv-frugtig-olivenolie-brug",
      title: "Hvordan og hvornår du bruger intensiv frugtig olivenolie",
      excerpt: "Kraftfuld bitterhed, markant skarphed og dufte af grønt. Intensiv frugtig olivenolie overrasker, men er et uforligneligt ernæringskoncentrat.",
      category: "Købsguide",
      content: `## Hvordan og hvornår du bruger intensiv frugtig olivenolie

Hvis der er en olie, der ikke går ubemærket hen, er det den **intensive frugtige**. Du fornemmer det så snart du hælder den op: En frisk, grøn duft, næsten som en køkkenhave. Og når du smager den, bemærker du straks to ting, der gør den unik: En **behagelig bitter note** og en **prikkende skarphed i halsen**. Hvis du ikke er vant til det, kan det overraske, men det er ikke en fejl: Det er oliens sande karakter.

Pointen er denne: Intensiv frugtig er ikke en "svær" olie, det er en olie, der skal bruges **de rigtige steder**. Når du parrer den godt, gør den noget magisk: Retten virker mere aromatisk, fyldigere, mere "ægte".

## Hvilken smag kan man forvente

Forestil dig aromaer, der minder om nyslået græs, artiskok og grønne tomater. Derefter kommer den mere markante side i munden: En bitterhed, der forbliver ren, og en skarphed, der varer i nogle sekunder.

Det er værd at vide: En intensiv frugtig olie har mere kant, fordi den ofte er lavet af olivener høstet tidligt, mens de stadig er grønne. Vertaald til køkkenet? Det er en olie, der ikke vil stå i baggrunden: Den vil **give personlighed**.

## Hvornår skal du bruge den (og hvorfor det virker)

Intensiv frugtig er bedst, når den møder retter, der allerede har en fyldig eller struktureret base. Den fungerer som et krydderi: Den dækker ikke, den **fremhæver**.

For eksempel på en **bønnesuppe**: Hvis du tilføjer den til sidst, når retten er færdig, ændrer det straks duften. Kikærterne bliver "varmere", bønnerne virker mere cremede, og det hele får en rigere smag uden at skulle tilføje andet.

Den fungerer også fantastisk med **grøntsager med en kraftig smag**. Tænk på cikorie, grønkål, radicchio: Det er grøntsager, der allerede har masser af personlighed, og bitterheden fra den intensive frugtige olie passer perfekt hertil.

Og ja, det er altid værd at nævne: Hvis du virkelig vil forstå, hvad en intensiv frugtig olie er, er den enkleste test **lunt brød**. Intet andet er nødvendigt. En ring af god olie, en knivspids salt, og det er det.

## Hvornår skal du bruge den med forsigtighed

Der er tilfælde, hvor den intensive frugtige olie risikerer at dominere for meget. Ikke fordi den "ikke er god", men fordi nogle retter kræver delikatesse.

Hvis du tilbereder noget meget mildt – for eksempel en superdelikat hvid fisk eller en mild mozzarella – kan du stadig bruge den, men med en meget let hånd. Til de retter er en let eller medium frugtig olie ofte det nemmeste valg.

## Tricket til aldrig at slå fejl

Det enkleste hemmelighed er: **Tilsæt den altid efter tilberedning**.

Når retten er klar, og varmen får aromaerne til at stige op, hælder du en ring af olie over og smager. Det er en simpel detalje, der gør hele forskellen.

:::cta
Vil du prøve den ægte vare?
En god intensiv frugtig olie genkender du straks: Grøn duft, fyldig smag, ren eftersmag.
[Se udvalget i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "intensiv-fruktig-olivenolje-bruk",
      title: "Hvordan og når du bruker intensiv fruktig olivenolje",
      excerpt: "Kraftig bitterhet, markant skarphet og dufter av grønt. Intensiv fruktig olivenolje overrasker, men er et enestående næringskonsentrat.",
      category: "Kjøpsguide",
      content: `## Hvordan og når du bruker intensiv fruktig olivenolje

Hvis det er en olje som ikke går ubemerket hen, er det den **intensive fruktige**. Du merker det så snart du heller den opp: En frisk, grønn duft, nesten som en grønnsakshage. Og når du smaker den, merker du straks to ting som gjør den unik: En **behagelig bitter tone** og en **prikkende skarphet i halsen**. Hvis du ikke er vant til det, kan det overraske, men det er ikke en feil: Det er oljens sanne karakter.

Poenget er dette: Intensiv fruktig er ikke en "vanskelig" olje, det er en olje som må brukes **på de riktige stedene**. Når du parrer den godt, gjør den noe magisk: Retten virker mer aromatisk, fyldigere, mer "ekte".

## Hvilken smak kan man forvente

Se for deg aromaer som minner om nyslått gress, artisjokk og grønne tomater. Deretter kommer den mer markante siden i munnen: En bitterhet som forblir ren, og en skarphet som varer i noen sekunder.

Det er verdt å vite: En intensiv fruktig olje har mer kraft, fordi den ofte er laget av oliven høstet tidlig, mens de fremdeles er grønne. Vertaald til kjøkkenet? Det er en olje som ikke vil stå i bakgrunnen: Den vil **gi personlighet**.

## Når skal du bruke den (og hvorfor det fungerer)

Intensiv fruktig er best når den møter retter som allerede har en fyldig eller strukturert base. Den fungerer som et krydderi: Den dekker ikke, den **fremhever**.

For eksempel på en **bønnesuppe**: Hvis du tilsetter den til slutt, når retten er ferdig, endrer det straks duften. Kikerter blir "varmere", bønnene virker mer kremete, og det hele får en rikere smak uten at du må tilsette noe annet.

Den fungerer også fantastisk med **grønnsaker med kraftig smak**. Tenk på sikori, grønnkål, radicchio: Det er grønnsaker som allerede har mye personllighet, og bitterheten fra den intensive fruktige oljen passer perfekt til dette.

Og ja, det er alltid verdt å nevne: Hvis du virkelig vil forstå hva en intensiv fruktig olje er, er den enkleste testen **varmt brød**. Ingenting annet trengs. En stripe god olje, en klype salt, og det er alt.

## Når skal du bruke den med forsiktighet

Det er tilfeller der den intensive fruktige oljen risikerer å dominere for mye. Ikke fordi den "ikke er god", men fordi noen retter krever delikatesse.

Hvis du tilbereder noe veldig mildt – for eksempel en superdelikat hvit fisk eller en mild mozzarella – kan du fremdeles bruke den, men med en veldig lett hånd. Til de rettene er en lett eller medium fruktig olje ofte det enkleste valget.

## Trikset til aldri å feile

Den enkleste hemmeligheten er: **Hell den på etter steking**.

Når retten er klar, og varmen får aromaene til å stige opp, heller du en stripe olje over. Det er en enkel detalj som gjør hele forskjellen.

:::cta
Vil du prøve den ekte varen?
En god intensiv fruktig olje kjenner du straks: Grønn duft, fyldig smak, ren ettersmak.
[Se utvalget i butikken](/shop)
:::`,
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
      content: `## What exactly is New Season Olive Oil?

When we talk about "New Season Olive Oil" (or "Novello" in Italy), we are not referring to some bureaucratic category, but simply to extra virgin olive oil immediately after pressing. It is incredibly fresh, bottled right away without settling or filtering.

> The first thing you will notice is its incredible color: a bright, vibrant, and cloudy green, which looks like wet autumn leaves.

## What does freshly made olive oil taste like?

In the mouth, New Season Olive Oil has a very decisive flavor. It is rustic, bold, and has a significant peppery kick in the throat compared to the standard olive oil you find in supermarkets.

This strong flavor is a sign of absolute quality! The main aromas you will notice are:
*   **Cut grass and artichoke:** Fresh scents typical of olives just picked from the tree.
*   **Lively bitterness and spiciness:** Indicators that the oil is packed with polyphenols, the valuable antioxidant substances that are so good for our health.

It is perfect to enjoy strictly raw, especially on a simple hot bruschetta, which is ideal for warming up during autumn evenings.

## How long does this magic last?

Unfortunately, the intense flavor of New Season Olive Oil does not last forever! Over the months, it will naturally and slowly sweeten.

1.  **In November and December:** The perfect period to consume New Season Olive Oil and enjoy its lively, fresh kick.
2.  **During Winter:** As the olive particles and pulp settle to the bottom, the oil will become clearer, and the pungent taste will gradually soften.
3.  **By Spring:** You will finally have the classic extra virgin olive oil, sweeter and more delicate, perfect for everyday cooking.

> New Season Olive Oil is a celebration that lasts just a short time! Buy it in November and use it raw on hot soups or toasted bread to experience the true essence of autumn.

:::cta
Pre-order your New Season Olive Oil now!
Bottles of freshly milled oil are limited and available only for a few weeks each year.
[Buy now and bring the taste of autumn to your table](/shop)
:::`,
    },
    "de": {
      slug: "was-ist-frisches-olivenoel-vorteile",
      title: "Was ist frisches Olivenöl der Saison und warum lohnt sich der Kauf?",
      excerpt: "Frisch gepresst und noch warm aus der Mühle bietet das frische Olivenöl (Olio Nuovo) für wenige Wochen ein unvergleichliches Erlebnis.",
      category: "Einkaufsfuehrer",
      content: `## Was genau ist „Olio Nuovo“?

Wenn wir von „frischem Olivenöl“ (in Italien *Olio Nuovo* oder *Novello*) sprechen, meinen wir keine bürokratische Sonderklasse, sondern einfach das Olivenöl Extra Vergine direkt nach der Pressung. Es ist unglaublich frisch und wird sofort ohne Ruhephase oder Filterung abgefüllt.

> Das Erste, was Ihnen auffallen wird, ist seine unglaubliche Farbe: ein leuchtendes, lebendiges und trübes Grün, das an nasse Herbstblätter erinnert.

## Wie schmeckt frisch gepresstes Olivenöl?

Im Mund hat das frische Olivenöl einen sehr intensiven Geschmack. Es ist rustikal, kräftig und kratzt deutlich ausgeprägter im Rachen als das normale Olivenöl aus dem Supermarkt.

Dieser starke Geschmack ist ein Zeichen absoluter Spitzenqualität! Die Hauptaromen, die Sie wahrnehmen werden, sind:
*   **Frisch gemähtes Gras und Artischocke:** Typische frische Düfte von Oliven, die gerade erst vom Baum gepflückt wurden.
*   **Lebendige Bitterkeit und Schärfe:** Ein Zeichen dafür, dass das Öl reich an Polyphenolen ist – den wertvollen Antioxidantien, die so gut für unsere Gesundheit sind.

Es eignet sich hervorragend für den rein rohen Verzehr, besonders auf einer einfachen warmen Bruschetta.

## Wie lange hält dieser Zauber an?

Leider bleibt der intensiv-fruchtige Geschmack des frischen Olivenöls nicht ewig so ausgeprägt! Im Laufe der Monate wird es auf natürliche Weise milder.

1.  **Im November und Dezember:** Die perfekte Zeit, um das frische Olivenöl zu genießen und seinen lebendigen Charakter zu erleben.
2.  **Im Laufe des Winters:** Da sich die kleinen Olivenpartikel am Boden absetzen, wird das Öl klarer und der scharfe Geschmack flacht allmählich ab.
3.  **Im Frühjahr:** Schließlich erhalten Sie das klassische Olivenöl Extra Vergine, milder und ausgewogener, perfekt für das tägliche Kochen.

> Frisches Olivenöl ist ein Fest, das nur kurz dauert! Kaufen Sie es im November und verwenden Sie es roh auf warmen Suppen oder geröstetem Brot.

:::cta
Bestellen Sie Ihr frisches Olivenöl jetzt vor!
Die Flaschen mit frisch gepresstem Öl sind limitiert und nur wenige Wochen im Jahr erhältlich.
[Jetzt kaufen und den Geschmack des Herbstes auf den Tisch bringen](/shop)
:::`,
    },
    "nl": {
      slug: "wat-is-nieuwe-olijfolie-kopen",
      title: "Wat is nieuwe olijfolie (Olio Nuovo) en waarom moet je dit proberen?",
      excerpt: "Vers geperst en warm uit de pers biedt nieuwe olijfolie gedurende een paar weken een ongekende zintuiglijke ervaring. Ontdek de geheimen.",
      category: "Koopgids",
      content: `## Wat is nieuwe olijfolie precies?

Wanneer we het hebben over \"nieuwe olijfolie\" (in Italië *Olio Nuovo* of *Novello* genoemd), bedoelen we geen officiële bureaucratische categorie, maar simpelweg extra vierge olijfolie die net uit de pers komt. Het is olijfolie op zijn allerschoonst, direct gebotteld zonder te rusten of gefilterd te worden.

> Het eerste dat opvalt is de fantastische kleur: een intens, helder en troebel groen, dat doet denken aan natte herfstbladeren.

## Hoe smaakt net geperste olijfolie?

In de mond heeft nieuwe olijfolie een zeer uitgesproken smaak. Het is robuust, krachtig en prikkelt aanzienlijk meer achter in de keel dan de standaard olijfolie die je in de supermarkt vindt.

Deze krachtige smaak is een teken van absolute topkwaliteit! De belangrijkste aroma's die je zult herkennen zijn:
*   **Gemaaid gras en artisjok:** De frisse geuren die typisch zijn voor olijven die net van de boom zijn geplukt.
*   **Levendige bitterheid en pittigheid:** Dit geeft aan dat de olijfolie boordevol polifenolen zit, de kostbare antioxidanten die zo goed zijn voor onze gezondheid.

Het is perfect om puur rauw te consumeren, vooral op een eenvoudige warme bruschetta.

## Hoe lang duurt deze magie?

De intense smaak van nieuwe olijfolie blijft helaas niet eeuwig zo krachtig! In de loop der maanden zal de olie op natuurlijke wijze langzaam milder worden.

1.  **In november en december:** Dit is de ultieme periode om nieuwe olijfolie te consumeren en te genieten van zijn levendige prikkeling.
2.  **Gedurende de winter:** Doordat de micro-deeltjes olijf naar de bodem zakken (natuurlijke decantatie), wordt de olie helderder en vlakt de scherpe smaak geleidelijk af.
3.  **In de lente:** Uiteindelijk houd je de klassieke extra vierge olijfolie over, milder en zachter, perfect voor het dagelijks koken.

> Nieuwe olijfolie is een feest dat maar kort duurt! Koop het in november en gebruik het rauw op warme soepen of geroosterd brood om de ware essentie van de herfst te ervaren.

:::cta
Reserveer nu uw nieuwe olijfolie!
De flessen met net geperste olijfolie zijn beperkt beschikbaar en slechts enkele weken per jaar verkrijgbaar.
[Koop nu en breng de smaak van de herfst op tafel](/shop)
:::`,
    },
    "da": {
      slug: "hvad-er-ny-olivenolie-fordele",
      title: "Hvad er ny olivenolie (Olio Nuovo) og hvorfor købe den?",
      excerpt: "Nypresset og helt frisk fra kværnen byder den nye olivenolie på en fantastisk smagsoplevelse i få uger. Se hemmelighederne bag det perfekte tidspunkt.",
      category: "Købsguide",
      content: `## Hvad er ny olivenolie præcist?

Når vi taler om "ny olivenolie" (eller *Olio Nuovo* på italiensk), mener vi ikke en særlig bureaukratisk klasse, men blot den ekstra jomfruolivenolie, der lige er presset. Den er utrolig frisk og tappes med det samme uden at hvile eller blive filtreret.

> Det første, du vil bemærke, er den fantastiske farve: En intens, klar og uklar grøn, der minder om våde efterårsblade.

## Hvad smager nypresset olivenolie af?

I munden har den nye olivenolie en yderst markant smag. Den er rustik, kraftig og kradser betydeligt mere i halsen end almindelig olivenolie fra supermarkedet.

Denne stærke smag er et tegn på absolut topkvalitet! De primære aromaer, du vil opleve, er:
*   **Nyslået græs og artiskok:** De friske dufter, der er typiske for olivener lige plukket fra træet.
*   **Levende bitterhed og skarphed:** Dette viser, at olien er spækket med polyfenoler – de værdifulde antioxidanter, der er så sunde for os.

Den er perfekt til at nyde rå, især på en simpel varm bruschetta.

## Hvor længe varer magien?

Desværre varer den intense smag af den nye olivenolie ikke evigt! I løbet af månederne vil den naturligt og langsomt blive mildere.

1.  **I november og december:** Det perfekte tidspunkt til at spise ny olivenolie og nyde dens levende, prikkende karakter.
2.  **I løbet af vinteren:** Efterhånden som olivendelene bundfælder sig, bliver olien klarere, og den skarpe smag aftager gradvist.
3.  **Til foråret:** Du har nu den klassiske ekstra jomfruolivenolie, som er mildere og mere delikat, perfekt til hverdagsmadlavning.

:::cta
Forudbestil din nye olivenolie nu!
Flasker med nypresset olie er begrænsede og fås kun i få uger om året.
[Køb nu og bring efterårets smag til bordet](/shop)
:::`,
    },
    "no": {
      slug: "hva-er-ny-olivenolje-fordeler",
      title: "Hva er ny sesong-olivenolje og hvorfor bør du kjøpe den?",
      excerpt: "Nypresset og helt fersk fra møllen byr den nye olivenoljen på en fantastisk smaksbølge i noen uker. Oppdag hemmelighetene.",
      category: "Kjøpsguide",
      content: `## Hva er ny olivenolje nøyaktig?

Når vi snakker om "ny olivenolje" (eller *Olio Nuovo* på italiensk), mener vi ikke en spesiell byråkratisk klasse, men rett og slett ekstra jomfruolivenolje som akkurat er presset. Den er utrolig fersk og tappes med en gang uten å hvile eller filtreres.

> Det første du vil legge merke til er den fantastiske fargen: En intens, klar og uklar grønnfarge som minner om våte høstblader.

## Hva smaker nypresset olivenolje?

I munnen har den nye olivenoljen en veldig markant smak. Den er rustikk, kraftig og kiler betydelig mer i halsen enn vanlig olivenolje fra supermarkedet.

Denne sterke smaken er et tegn på absolutt toppkvalitet! De viktigste aromaene du vil merke er:
*   **Nyslått gress og artisjokk:** De friske duftene som er typiske for oliven som akkurat er plukket fra treet.
*   **Levende bitterhet og skarphet:** Dette viser at oljen er full av polyfenoler – de verdifulle antioksidantene som gjør så godt for helsen vår.

Den er perfekt til å nytes rå, spesielt på en enkel varm bruschetta.

## Hvor lenge varer magien?

Dessverre varer ikke den intense smaken av den nye olivenoljen evig! I løpet av månedene vil den naturlig og langsomt bli mildere.

1.  **I november og desember:** Den perfekte tiden for å spise ny olivenolje og nyte dens levende, prikkende karakter.
2.  **I løpet av vinteren:** Etter hvert som olivendelene legger seg på bunnen, blir oljen klarere, og den skarpe smaken avtar gradvis.
3.  **Til våren:** Du har nå den klassiske ekstra jomfruolivenoljen, som er mildere og mer delikat, perfekt til hverdagsmatlaging.

:::cta
Forhåndsbestill din nye olivenolje nå!
Flasker med nypresset olje er begrenset og tilgjengelig kun noen få uker i året.
[Kjøp nå og bring høstens smak til bordet](/shop)
:::`,
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
      content: `## A confusing maze of acronyms

Choosing a quality Extra Virgin Olive Oil often forces you to decipher labels filled with graphic decorations, flags, and ministerial seals. Unfortunately, sometimes these formal wordings hide huge loopholes that legitimize the use of untraceable blends.

Let's clarify things starting with the certification considered the "inviolable shield" of quality:

## The benevolent dictatorship of the DOP (PDO)

The seal of excellence par excellence is the **Protected Designation of Origin (DOP / PDO)**. A product with the red-and-gold seal certifies that:

1.  **The olive grove is geolocalized:** The olives come strictly from restricted and mapped areas (e.g., Sabina, Riviera Ligure, Chianti Classico).
2.  **Inviolable production cycle:** Not only the harvest, but also the milling, storage, and physical bottling must take place *within* those boundaries.
3.  **Panel test approval:** Before being sold, the oil must pass strict laboratory and tasting exams to verify that it respects the characteristics of the territory.

> In essence, the DOP binds you both to the flower and the hand that tended it. If you see this seal, you are completely safe.

## The intermediate step: the IGP (PGI) certification

Going down one step and slightly easing the restrictions, we find the **Protected Geographical Indication (IGP / PGI)** (blue-and-yellow seal). In this case, we typically find excellent regional oils (e.g., IGP Toscana, IGP Sicilia).

However, unlike the DOP, an IGP allows **only one** of the phases of cultivation, processing, or transformation to take place in the area of origin. You are still looking at an excellent and highly regulated product, but with slightly "freer" operational boundaries.

## "100% Italian": The bare minimum

And here is the most common wording in supermarkets: "100% Italian" or "Italian Olives." The text is clear:
* It saves you from purchasing the terrible "blend of olive oils originating in the EU."
* It guarantees that the oil was pressed from olives harvested and processed within the country.

> Unfortunately, the "100% Italian" wording guarantees the origin but tells us nothing about the methods, harvest timing, or storage oxidation. You will be safe geographically, but without any guarantee of prestige or balanced aromas.

Our gold advice? Find your trusted local mill and buy directly from them!

:::cta
Experience the pride of a short traceable supply chain like Frantoio del Pasqua.
From our Tuscan fields to our cold-extraction mill. All at the correct pace.
[Shop our selection directly online](/shop)
:::`,
    },
    "de": {
      slug: "gud-gga-100-prozent-italienisches-olivenoel-etiketten-erklaert",
      title: "g.U., g.g.A. oder 100% Italienisch: Was bedeuten die Kürzel beim Olivenöl?",
      excerpt: "Zwischen Industriemarken und handwerklichen Produkten herrscht im Supermarkt Verwirrung. Wir erklären die wahren Unterschiede.",
      category: "Einkaufsfuehrer",
      content: `## Ein Labyrinth aus Abkürzungen und Siegeln

Die bewusste Auswahl eines hochwertigen Olivenöls zwingt Verbraucher oft dazu, Etiketten voller Siegel und Flaggen zu entziffern. Leider verbergen diese formalen Bezeichnungen manchmal Schlupflöcher, die die Verwendung von nicht rückverfolgbaren EU-Mischungen legitimieren.

Lassen Sie uns Licht ins Dunkel bringen und mit der Zertifizierung beginnen, die als „unverletzlicher Schutzschild“ der Qualität gilt:

## Die wohlwollende Diktatur der g.U. (DOP)

Das Exzellenzsiegel schlechthin ist die **geschützte Ursprungsbezeichnung (g.U. bzw. italienisch DOP)**. Ein Produkt mit dem rot-goldenen Siegel bescheinigt Folgendes:

1.  **Der Olivenhain ist klar eingegrenzt:** Die Oliven stammen zwingend aus abgegrenzten und kartierten Gebieten (z. B. Sabina, Riviera Ligure, Chianti Classico).
2.  **Unverletzlicher Produktionszyklus:** Nicht nur die Ernte, sondern auch die Pressung, Lagerung und physische Abfüllung müssen *innerhalb* dieser Grenzen erfolgen.
3.  **Zulassung durch Panel-Test:** Vor dem Verkauf muss das Öl strenge Labor- und Verkostungsprüfungen bestehen, um sicherzustellen, dass es den typischen Eigenschaften des Territoriums entspricht.

> Kurz gesagt: Die DOP (g.U.) sichert Ihnen sowohl das Terroir als auch das Handwerk zu. Wenn dieses Siegel vorhanden ist, sind Sie auf der sicheren Seite.

## Die Zwischenstufe: Die g.g.A. (IGP) Zertifizierung

Eine Stufe darunter finden wir die **geschützte geografische Angabe (g.g.A. bzw. italienisch IGP)** (gelb-blaues Siegel). In diesem Fall finden wir hervorragende regionale Öle (z. B. IGP Toscana, IGP Sicilia).

Im Gegensatz zur DOP erlaubt eine IGP jedoch, dass **nur eine** der Phasen von Anbau, Verarbeitung oder Veredelung im Herkunftsgebiet erfolgen muss. Man hat es immer noch mit einem hervorragenden und streng regulierten Produkt zu tun, jedoch mit etwas freieren Grenzen.

## „100% Italienisch“: Das absolute Minimum

Und hier ist die am weitesten verbreitete Bezeichnung in den Supermärkten: „100% Italiano“ oder „Italienische Oliven“. Die Aufschrift lügt nicht:
* Sie bewahrt Sie vor dem Kauf der gefürchteten „Mischung aus Olivenölen aus dem EU-Raum“.
* Sie garantiert, dass das Öl aus Oliven gepresst wurde, die im Land geerntet und verarbeitet wurden.

> Leider garantiert die Bezeichnung „100% Italienisch“ zwar die Herkunft, sagt uns aber nichts über die Erntemethoden, die Frische oder die Lagerung. Sie sind geografisch geschützt, aber ohne Garantie für Aroma-Exzellenz.

Unser goldener Rat zum Schluss? Finden Sie die Mühle Ihres Vertrauens und kaufen Sie direkt dort!

:::cta
Erleben Sie den Stolz einer kurzen, rückverfolgbaren Lieferkette wie bei Frantoio del Pasqua.
Von unseren Hainen in der Toskana bis zu unserer Kaltpressung.
[Jetzt online direkt ab Mühle bestellen](/shop)
:::`,
    },
    "nl": {
      slug: "bob-bgp-100-procent-italiaanse-olijfolie-keurmerken-uitleg",
      title: "BOB, BGP of 100% Italiaans: Wat betekenen de Keurmerken op Olijfolie?",
      excerpt: "Tussen industriële merken en ambachtelijke leveranciers heerst in de supermarkt veel verwarring. Ontdek de echte verschillen.",
      category: "Koopgids",
      content: `## Een verwarrende jungle van keurmerken

Het bewust kiezen van een kwalitatieve Extra Vierge Olijfolie dwingt je vaak om etiketten vol logo's, vlaggen en keurmerken te ontcijferen. Helaas verbergen deze formele aanduidingen soms mazen in de wet die het gebruik van niet-traceerbare EU-mengsels legitimeren.

Laten we direct duidelijkheid scheppen, beginnend bij de certificering die wordt beschouwd als het \"onschendbare schild\" van kwaliteit:

## Het absolute keurmerk: BOB (DOP)

Het keurmerk van uitmuntendheid bij uitstek is de **Beschermde Oorsprungsbenaming (BOB, of DOP in het Italiaans)**. Een product met het rood-gouden keurmerk garandeert dat:

1.  **De olijengaard is geolokaliseerd:** De olijven zijn afkomstig uit strikt omschreven en in kaart gebrachte gebieden (bijv. Sabina, Riviera Ligure, Chianti Classico).
2.  **Onschendbare productiecyclus:** Niet alleen de oogst, maar ook het persen, de opslag en de fysieke botteling moeten *binnen* die grenzen plaatsvinden.
3.  **Goedkeuring door paneltest:** Voordat het wordt verkocht, moet de olie strenge laboratorium- en proeftesten ondergaan om te controleren of het de specifieke kenmerken van het gebied respecteert.

> Kortom: BOB (DOP) verbindt het terroire en het vakmanschap onlosmakelijk met elkaar. Met dit keurmerk zit je gegarandeerd goed.

## De tussenstap: BGP (IGP) certificering

Als we een stapje lager gaan en de regels iets versoepelen, vinden we de **Beschermde Geografische Aanduiding (BGP, of IGP in het Italiaans)** (geel-blauw keurmerk). In dit geval vinden we uitstekende regionale oliën (bijv. IGP Toscana, IGP Sicilia).

In tegenstelling tot de BOB, staat een BGP toe dat **slechts één** van de fasen van teelt, verwerking of transformatie in het herkomstgebied plaatsvindt. Dit is nog steeds een uitstekend en streng gereguleerd product, maar met iets ruimere grenzen.

## \"100% Italiaans\": Het absolute minimum

En dan is er de meest voorkomende aanduiding in de supermarkten: \"100% Italiano\" of \"Italiaanse olijven\". De tekst is helder:
* Het behoedt je voor de aankoop van de gevreesde \"mengeling van olijfolie uit de EU\".
* Het garandeert dat de olie is geperst uit olijven die in het land zijn geoogst en verwerkt.

> Helaas garandeert de aanduiding \"100% Italiaans\" wel de herkomst, maar zegt het niets over de oogstmethode, de snelheid van verwerking of de opslagomstandigheden. Je bent geografisch veilig, maar zonder garantie op de beste smaak.

Ons gouden advies? Zoek uw vertrouwde lokale perserij en koop rechtstreeks!

:::cta
Ervaar de trots van een korte, traceerbare keten zoals die van Frantoio del Pasqua.
Van onze boomgaarden in Toscane tot onze koude persing. Alles in eigen hand.
[Ontdek de oliën direct in onze online winkel](/shop)
:::`,
    },
    "da": {
      slug: "bob-bgp-100-procent-italiensk-olivenolie-maerkater-forklaret",
      title: "BOB, BGB eller 100 % italiensk: Hvad betyder olivenoliens mærkninger?",
      excerpt: "Mellem industrielle mærker og håndværksmæssige olier hersker der stor forvirring i supermarkedet. Se de reelle forskelle.",
      category: "Købsguide",
      content: `## En forvirrende jungle af mærkninger

At vælge en god ekstra jomfruolivenolie tvinger dig ofte til at afkode etiketter fulde af logoer, flag og mærkninger. Desværre skjuler disse formelle betegnelser nogle gange smuthuller, der tillader brugen af uigennemskuelige EU-blandinger.

Lad os skabe klarhed og starte med certificeringen, der anses for at være kvalitetens "ubrydelige skjold":

## Den absolutte konge: BOB (DOP)

Det ypperste kvalitetsstempel er den **Beskyttede Oprindelsesbetegnelse (BOB, eller DOP på italiensk)** (det rød-gyldne stempel). Et produkt med denne mærkning garanterer, at:

1.  **Olivenlunden er præcist placeret:** Olivenerne stammer udelukkende fra afgrænsede og registrerede områder (f.eks. Sabina, Riviera Ligure, Chianti Classico).
2.  **Ubrydelig produktionscyklus:** Ikke kun høsten, men også presningen, lagringen og selve flaskeaffyldningen skal ske *inden for* disse grænser.
3.  **Godkendelse i Panel Test:** Før salg skal olien bestå strenge laboratorie- og smagstests for at sikre, at den lever op til områdets standarder.

> Kort sagt binder en BOB (DOP) terroiret og håndværket uløseligt sammen. Hvis dette stempel er på flasken, er du helt sikker.

## Mellemtrinet: BGB (IGP) certificering

Et skridt nede finder vi den **Beskyttede Geografiske Betegnelse (BGB, eller IGP på italiensk)** (det gul-blå stempel). Her finder vi typisk fremragende regionale olier (f.eks. IGP Toscana, IGP Sicilia).

Men i modsætning til en BOB, tillader en BGB, at **kun én** af faserne for dyrkning, forarbejdning eller transformation sker i oprindelsesområdet. Det er stadig et fremragende og strengt kontrolleret produkt, men med lidt friere rammer.

## "100 % italiensk": Det absolutte minimum

Og her er den mest almindelige mærkning i supermarkederne: "100% Italiano" eller "Italienske olivener". Teksten lyver ikke:
* Den redder dig fra at købe den forfærdelige "blanding af olivenolier med oprindelse i EU".
* Den garanterer, at olien er presset af olivener høstet og forarbejdet i Italien.

> Desværre garanterer mærkningen "100 % italiensk" kun oprindelsen, men siger intet om høstmetoden, friskheden eller lagringen. Du er geografisk sikret, men uden nogen garanti for smagsmæssig topklasse.

Vores bedste råd? Find dit lokale yndlingsfrantoio og køb direkte!

:::cta
Oplev stoltheden ved en kort, fuldt sporbar forsyningskæde som hos Frantoio del Pasqua.
Fra vores marker i Toscana til vores koldpresning. Alt udført i rette tid.
[Se vores udvalg direkte i webshoppen](/shop)
:::`,
    },
    "no": {
      slug: "dop-igp-100-prosent-italiensk-olivenolje-merking-forklart",
      title: "DOP, IGP eller 100 % italiensk: Hva betyr olivenoljens merking?",
      excerpt: "Mellom industrielle merker og håndverksoljer hersker det stor forvirring i supermarkedet. Vi forklarer de reelle forskjellene.",
      category: "Kjøpsguide",
      content: `## En forvirrende jungel av merking

Å velge en god ekstra jomfruolivenolje tvinger deg ofte til å avkode etiketter fulle av logoer, flagg og stempler. Dessverre skjuler disse formelle betegnelsene noen ganger smutthull som tillater bruken av uigjennomsiktige EU-blandinger.

La oss skape klarhet og starte med sertifiseringen som anses for å være kvalitetens "ubrytelige skjold":

## Den absolutte kongen: DOP (BOB)

Det ypperste kvalitetsstempelet er den **Beskyttede Opprinnelsesbetegnelsen (DOP, eller BOB på norsk)** (det rød-gylne stempelet). Et produkt med denne merkingen garanterer at:

1.  **Olivenlunden er nøyaktig plassert:** Olivene stammer utelukkende fra avgrensede og registrerte områder (f.eks. Sabina, Riviera Ligure, Chianti Classico).
2.  **Ubrytelig produksjonssyklus:** Ikke bare høstingen, men også pressingen, lagringen og selve flaskeavfyllingen må skje *innenfor* disse grensene.
3.  **Godkjenning i Panel Test:** Før salg må oljen bestå strenge laboratorie- og smakstester for å sikre at den lever opp til områdets standarder.

> Kort sagt binder en DOP terroiret og håndverket uløselig sammen. Hvis dette stempelet er på flasken, er du helt sikker.

## Mellomtrinnet: IGP (BGB) sertifisering

Et skritt ned finner vi den **Beskyttede Geografiske Betegnelsen (IGP, eller BGB på norsk)** (det gul-blå stempelet). Her finner vi typisk fremragende regionale oljer (f.eks. IGP Toscana, IGP Sicilia).

Men i motsetning til en DOP, tillater en IGP at **bare én** av fasene for dyrking, foredling eller transformasjon skjer i opprinnelsesområdet. Det er fremdeles et fremragende og strengt kontrollert produkt, men med litt friere rammer.

## "100 % italiensk": Det absolutte minimum

Og her er den mest vanlige merkingen i supermarkedene: "100% Italiano" eller "Italienske oliven". Teksten lyver ikke:
* Den redder deg fra å kjøpe den forferdelige "blandingen av olivenoljer med opprinnelse i EU".
* Den garanterer at oljen er presset av oliven høstet og foredlet i Italia.

> Dessverre garanterer merkingen "100 % italiensk" bare opprinnelsen, men sier ingenting om høstmetoden, ferskheten eller lagringen. Du er geografisk sikret, men uten noen garanti for smaksmessig toppklasse.

Vårt beste råd? Finn ditt lokale favorittfrantoio og kjøp direkte!

:::cta
Opplev stoltheten ved en kort, fullt sporbar forsyningskjede som hos Frantoio del Pasqua.
Fra våre marker i Toscana til vår kaldpressing. Alt utført i rette tid.
[Se vårt utvalg direkte i nettbutikken](/shop)
:::`,
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
      content: `## How defects are evaluated

The **Panel Test** (IOC/EU method) is the official sensory analysis for olive oil classification. A group of certified tasters evaluates both positive attributes (fruity, bitter, pungent) and defects — always measured as the "median of defects."

An *extra virgin* olive oil must have a **median of defects = 0** and a median of fruitiness > 0. If even a single defect exceeds this threshold, the oil falls in category: it can no longer be legally called "extra virgin."

## The main defects

### Rancid

The most famous defect. It comes from **lipid oxidation** — the reaction of unsaturated fats with atmospheric oxygen. It develops over time, accelerated by light, heat, and air.

*On the nose*: smell of stale fat, similar to old butter or oxidized walnuts.
*On the palate*: a persistent aftertaste of "old grease," leaving a dry sensation.

**Cause**: inadequate storage (light, heat, open container for too long), or poorly stored olives before milling.

### Winey-Vinegary

A smell and taste reminiscent of wine or vinegar. It is due to the production of **acetic acid, ethanol, and ethyl acetate** by fermentative yeasts and bacteria.

*On the nose*: acidic, winey notes, sometimes sharp like wine vinegar.
*On the palate*: perceived acidity (unlike chemical acidity, this one is tasted!), a sharp sensation.

**Cause**: fermented olives (piled up too long before milling, in anaerobic silos), or excessive processing temperatures.

### Musty-Humid

A characteristic smell and taste of molds and yeasts developed on the olives.

*On the nose*: typical smell of mold, damp cellar, wet paper.
*On the palate*: earthy aftertaste, rotten mushroom.

**Cause**: olives with surface mold, stored in excessively humid conditions, or harvested already damaged.

### Muddy Sediment (Morchia)

An aftertaste of oil sediment that decants and ferments at the bottom of storage tanks.

*On the nose*: similar to musty but heavier and greasier.
*On the palate*: aftertaste of fermented grease.

**Cause**: tanks not cleaned properly between seasons, or oil left in contact with its own heavy sediments.

:::cta
High-quality olive oil is completely free of defects
In well-made oil—from healthy, rapidly milled, and cold-extracted olives—defects do not exist.
[Discover the clean oils in our shop](/shop)
:::`,
    },
    "de": {
      slug: "olivenoelfehler-erkennen-kompletter-leitfaden",
      title: "Olivenölfehler erkennen: Kompletter Leitfaden für Verbraucher",
      excerpt: "Ranzig, stichig, schimmelig, morchia. Olivenölfehler werden im Panel-Test klassifiziert. Erfahren Sie, woher sie kommen.",
      category: "Olivenölfehler",
      content: `## Wie Fehler bewertet werden

Der **Panel-Test** (IOC/EU-Methode) ist die offizielle sensorische Analyse zur Klassifizierung von Olivenöl. Eine Gruppe zertifizierter Prüfer bewertet sowohl positive Attribute (fruchtig, bitter, scharf) als auch Fehler – gemessen als „Median der Fehler“.

Ein *natives Olivenöl Extra* muss einen **Fehlermedian von 0** und einen Fruchtigkeitsmedian von über 0 aufweisen. Wenn auch nur ein einziger Fehler diesen Schwellenwert überschreitet, verliert das Öl seine Kategorie: Es darf rechtlich nicht mehr als „nativ extra“ deklariert werden.

## Die Hauptfehler

### Ranzig

Der bekannteste Fehler. Er resultiert aus der **Lipidoxidation** – der Reaktion ungesättigter Fette mit Sauerstoff. Er entwickelt sich im Laufe der Zeit, beschleunigt durch Licht, Wärme und Luft.

*In der Nase*: Geruch nach altem Fett, ähnlich wie alte Butter oder oxidierte Nüsse.
*Im Mund*: Ein anhaltender Nachgeschmack von „altem Fett“, der ein trockenes Gefühl hinterlässt.

**Ursache**: Unzureichende Lagerung (Licht, Wärme, zu lange offenes Gefäß) oder schlecht gelagerte Oliven vor der Pressung.

### Stichig-Essigartig

Geruch und Geschmack, die an Wein oder Essig erinnern. Dies liegt an der Produktion von **Essigsäure, Ethanol und Ethylacetat** durch gärende Hefen und Bakterien.

*In der Nase*: Saure, weinige Noten, manchmal stechend wie Weinessig.
*Im Mund*: Wahrnehmbare Säure (im Gegensatz zur chemischen Säure schmeckt man diese tatsächlich!), ein scharfes Gefühl.

**Ursache**: Fermentierte Oliven (zu lange vor dem Pressen in luftdichten Silos gelagert) oder zu hohe Verarbeitungstemperaturen.

### Schimmelig-Feucht

Ein charakteristischer Geruch und Geschmack nach Schimmel und Hefen, die sich auf den Oliven entwickelt haben.

*In der Nase*: Typischer Geruch nach Schimmel, feuchtem Keller, nassem Papier.
*Im Mund*: Erdiger Nachgeschmack, fauler Pilz.

**Ursache**: Oliven mit oberflächlichem Schimmel, gelagert unter übermäßig feuchten Bedingungen oder bereits verdorben geerntet.

### Schlammiger Bodensatz (Morchia)

Ein Nachgeschmack von Ölsedimenten, die sich am Boden von Lagertanks absetzen und dort gären.

*In der Nase*: Ähnlich wie stichig, aber schwerer und fettiger.
*Im Mund*: Nachgeschmack von vergorenem Fett.

**Ursache**: Tanks, die zwischen den Ernten nicht richtig gereinigt wurden, oder Öl, das zu lange mit seinen eigenen schweren Sedimenten in Kontakt blieb.

:::cta
Hochwertiges Olivenöl ist völlig fehlerfrei
Bei gut hergestelltem Öl – aus gesunden, schnell gepressten und kalt extrahierten Oliven – gibt es keine Fehler.
[Entdecken Sie die reinen Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-defecten-herkennen-complete-gids",
      title: "Olijfolie-defecten herkennen: Complete gids voor de consument",
      excerpt: "Ranzig, wijnachtig, schimmelig, morchia. De defecten van extra vierge olijfolie worden beoordeeld in de Panel Test. Ontdek de oorzaken.",
      category: "Olijfolie-defecten",
      content: `## Hoe defecten worden beoordeeld

De **Panel Test** (IOC/EU-methode) is de officiële zintuiglijke analyse voor de classificatie van olijfolie. Een groep gecertificeerde proevers beoordeelt zowel positieve eigenschappen (fruitigheid, bitterheid, pittigheid) als defecten — altijd gemeten als de \"mediaan van defecten\".

Een *extra vierge* olijfolie moet een **mediaan van defecten = 0** hebben en een mediaan van fruitigheid > 0. Als zelfs maar één defect deze drempel overschrijdt, verliest de olijfolie zijn categorie: het mag dan wettelijk niet meer \"extra vierge\" worden genoemd.

## De belangrijkste defecten

### Ranzig

Het bekendste defect onder het grote publiek. Het is het resultaat van **lipidoxidatie** — de reactie van onverzadigde vetten met zuurstof. Het ontwikkelt zich in de loop van de tijd en wordt versneld door licht, warmte en lucht.

*In de neus*: geur van oud vet, vergelijkbaar met oude boter of geoxideerde noten.
*In de mond*: een aanhoudende nasmaak van \"oud vet\", die een droog gevoel achterlaat.

**Oorzaak**: onjuiste opslag (licht, warmte, te lang open laten staan) of slecht bewaarde olijven vóór het persen.

### Wijnachtig-Azijnachtig

Een geur en smaak die doen denken aan wijn of azijn. Dit is te wijten aan de productie van **azijnzuur, ethanol en ethylacetaat** door gistingsbacteriën en gisten.

*In de neus*: zure, wijnachtige tonen, soms scherp als wijnazijn.
*In de mond*: voelbare zuurgraad (in tegenstelling tot chemische zuurgraad proef je deze echt!), een scherpe sensatie.

**Oorzaak**: gefermenteerde olijven (te lang opgestapeld vóór het persen, in zuurstofloze silo's) of te hoge verwerkingstemperaturen.

### Schimmelig-Vochtig

Een karakteristieke geur en smaak van schimmels en gisten die zich op de olijven hebben ontwikkeld.

*In de neus*: typische geur van schimmel, vochtige kelder, nat papier.
*In de mond*: aardse nasmaak, rotte paddenstoel.

**Oorzaak**: olijven met oppervlakkige schimmel, bewaard onder te vochtige omstandigheden of reeds beschadigd geoogst.

### Bezinksel (Morchia)

Een nasmaak van olijfsediment dat naar de bodem van opslagtanks zakt en daar gaat gisten.

*In de neus*: vergelijkbaar met wijnachtig maar zwaarder en vetter.
*In de mond*: nasmaak van gefermenteerd vet.

**Oorzaak**: tanks die tussen de seizoenen door niet goed zijn schoongemaakt, of olie die te lang in contact is gebleven met zijn eigen zware sedimenten.

:::cta
Hoogwaardige olijfolie is volledig vrij van defecten
Bij goed gemaakte olie — van gezonde, snel geperste en koud geëxtraheerde olijven — komen defecten niet voor.
[Ontdek de zuivere oliën in onze shop](/shop)
:::`,
    },
    "da": {
      slug: "olivenoliefejl-guide-til-sensoriske-fejl",
      title: "Olivenoliefejl: En komplet guide til sensoriske fejl",
      excerpt: "Harsk, vinedikke-agtig, muggen, bundfald. Olivenoliefejl klassificeres og evalueres i en Panel Test. Lær, hvad de betyder og hvorfor de opstår.",
      category: "Olivenoliefejl",
      content: `## Hvordan fejl vurderes

En **Panel Test** (IOC/EU-metode) er den officielle sensoriske analyse til klassificering af olivenolie. En gruppe certificerede smagere vurderer både positive egenskaber (frugtighed, bitterhed, skarphed) og fejl – altid målt som "Fejlmedianen".

En *ekstra jomfruolivenolie* skal have en **fejlmedian = 0** og en frugtighedsmedian > 0. Hvis blot én enkelt fejl overskrider denne tærskel, falder olien i kategori: Den må ikke længere kaldes "ekstra jomfruolivenolie".

## De primære fejl

### Harsk

Den mest kendte fejl. Den skyldes **lipidoxidation** – en reaktion mellem umættede fedtsyrer og ilt. Den udvikler sig over tid og fremskyndes af lys, varme og luft.

*I næsen*: Duft af gammelt fedt, der minder om gammelt smør eller harske nødder.
*I munden*: En vedvarende eftersmag af "gammelt fedt", som efterlader en tør fornemmelse.

**Årsag**: Uhensigtsmæssig opbevaring (lys, varme, åben flaske i for lang tid) eller dårligt opbevarede olivener inden presning.

### Vinedikke-agtig

En duft og smag, der minder om vin eller eddike. Det skyldes dannelsen af **eddikesyre, ethanol og ethylacetat** fra gærbakterier.

*I næsen*: Sure noter, der minder om vineddike.
*I munden*: Mærkbar syre (i modsætning til kemisk syre kan denne smages!), en skarp fornemmelse.

**Årsag**: Gærede olivener (hvis de har ligget for længe i store dynger inden presning) eller for høje temperaturer under produktionen.

### Mug- og fugtfejl

En karakteristisk smag og duft af mug og svampe udviklet på olivenerne.

*I næsen*: Typisk lugt af mug, fugtig kælder, vådt papir.
*I munden*: Jordagtig eftersmag, rådden svamp.

**Årsag**: Olivener med overflademug, opbevaret under for fugtige forhold, eller høstet i dårlig stand.

### Bundfald (Morchia)

Eftersmag af sediment, der har lagt sig og gæret i bunden af tankene.

*I næsen*: Minder om stichig, men tungere og mere fedtet.
*I munden*: Eftersmag af gæret fedt.

**Årsag**: Tanke, der ikke er rengjort ordentligt mellem sæsonerne, eller olie, der har stået for længe i kontakt med sit eget bundfald.

:::cta
Olivenolie af høj kvalitet er helt fri for fejl
I en velproduceret olie – af sunde olivener, der presses hurtigt og koldpresses – findes der ingen fejl.
[Se de rene olier i vores shop](/shop)
:::`,
    },
    "no": {
      slug: "olivenoljefeil-guide-til-sensoriske-feil",
      title: "Olivenoljefeil: En komplett guide til sensoriske feil",
      excerpt: "Harsk, vinedikksmak, muggen, bunndfall. Olivenoljefeil klassifiseres og evalueres i en Panel Test. Lær hva de betyr.",
      category: "Olivenoljefeil",
      content: `## Hvordan feil vurderes

En **Panel Test** (IOC/EU-metode) er den offisielle sensoriske analysen for klassifisering av olivenolje. En gruppe sertifiserte smakere vurderer både positive egenskaper (fruktighet, bitterhet, skarphet) og feil – alltid målt som "Feilmedianen".

En *ekstra jomfruolivenolje* må ha en **feilmedian = 0** og en fruktighetsmedian > 0. Hvis bare én enkelt feil overskrider denne terskelen, faller oljen i kategori: Den kan ikke lenger kalles "ekstra jomfruolivenolje".

## De viktigste feilene

### Harsk

Den mest kjente feilen. Den skyldes **lipidoksidasjon** – en reaksjon mellom umettede fettsyrer og oksygen. Den utvikler seg over tid og fremskyndes av lys, varme og luft.

*I nesen*: Duft av gammelt fett som minner om gammelt smør eller harske nøtter.
*I munnen*: En vedvarende ettersmak av "gammelt fett", som etterlater en tørr følelse.

**Årsak**: Dårlig oppbevaring (lys, varme, åpen flaske for lenge) eller dårlig oppbevarte oliven før pressing.

### Vinedikksmak

En duft og smak som minner om vin eller eddik. Det skyldes dannelsen av **eddiksyre, etanol og etylacetat** fra gjærbakterier.

*I nesen*: Sure noter som minner om vineddik.
*I munnen*: Merkbar syre (i motsetning til kjemisk syre kan denne smakes!), en skarp følelse.

**Årsak**: Gjærede oliven (hvis de har ligget for lenge i store hauger før pressing) eller for høye temperaturer under produksjonen.

### Mugg- og fuktfeil

En karakteristisk smak og duft av mugg og sopp utviklet på olivene.

*I nesen*: Typisk lukt av mugg, fuktig kjeller, vått papir.
*I munnen*: Jordaktig ettersmak, råtten sopp.

**Årsak**: Oliven med overflatemugg, oppbevart under for fuktige forhold, eller høstet i dårlig stand.

### Bunndfall (Morchia)

Ettersmak av sediment som har lagt seg og gjæret i bunnen av tankene.

*I nesen*: Minner om gjæret, men tyngre og mer fettete.
*I munnen*: Ettersmak av gjæret fett.

**Årsak**: Tanker som ikke er rengjort skikkelig mellom sesongene, eller olje som har stått for lenge i kontakt med sitt eget bunndfall.

:::cta
Olivenolje av høy kvalitet er helt fri for feil
I en velprodusert olje – av sunne oliven som presses raskt og kaldpresses – finnes det ingen feil.
[Se de rene oljene i butikken](/shop)
:::`,
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
      content: `## The mechanism of oxidation

*Rancidity* does not come from "outside" as a contamination: it is born **inside the oil**, when its fats slowly react with oxygen. EVOO is rich in unsaturated fatty acids (those with double bonds): they are precious, but also highly sensitive to oxidation.

Simply put: at the beginning, the oil is protected and fragrant. Then, over time and under the wrong conditions, molecules form that completely change the aroma. And when the transformation really starts, it tends to accelerate.

The process can be imagined in three steps:

1.  **Initiation**: something "triggers" the reaction (light, heat, metals, time) and the first radicals form.
2.  **Propagation**: oxygen comes into play and the reaction self-sustains.
3.  **Termination**: volatile compounds responsible for the stale smell accumulate (those that make you think of old butter, oxidized nuts, or stale fat).

This is why an oil that "just starts" to turn can degrade very quickly if left in the same conditions.

## Factors that accelerate oxidation

Rancidity is not bad luck: it is almost always due to the **environment**.

Light is one of the worst accelerants (especially if the oil is kept in clear glass). Heat does the rest: near stoves or in a very hot kitchen, the oil ages much faster. Then there is air: the more oxygen remains in contact with the oil (bottle opened often, mostly "empty," imperfect cap), the more fuel the reaction has.

## How polyphenols prevent it

Here is the beautiful part: EVOO has a natural defense, the **polyphenols**. They are the ones who "sacrifice themselves" first, blocking the oxidative chain and slowing down aromatic aging.

It is one of the reasons why an oil rich in polyphenols is often **bitter and pungent**: those sensations are a signal (not a defect) showing that the oil has a structure more resistant over time.

However, when polyphenols are consumed (due to light, heat, and oxygen), the oil remains exposed and rancidity takes over.

## How to prevent it

The goal is simple: protect the oil from its three main enemies — **light, heat, and air**.

- Choose containers that block light (tins or very dark glass).
- Keep it in a cool, stable place (not above the oven, not in the sun).
- Always close the cap tightly and reduce the time of exposure to air.
- If you consume little, buy smaller sizes: oil should be finished while "alive," not dragged on for months.

:::cta
Want an EVOO that stays fresh longer?
Choose oils rich in polyphenols and store them correctly: you can tell from the very first sniff.
[Discover the oils in our shop](/shop)
:::`,
    },
    "de": {
      slug: "ranziges-olivenoel-ursachen-vermeidung",
      title: "Ranziges Olivenöl: Ursachen und Vermeidung",
      excerpt: "Ranzigkeit ist der häufigste und schädlichste Fehler für die Qualität des Öls. Die Chemie zu verstehen, hilft bei der einfachen Prävention.",
      category: "Olivenölfehler",
      content: `## Der Mechanismus der Oxidation

*Ranzigkeit* kommt nicht als Verunreinigung von „außen“: Sie entsteht **im Öl selbst**, wenn seine Fette langsam mit Sauerstoff reagieren. Olivenöl Extra Vergine ist reich an ungesättigten Fettsäuren (denen mit Doppelbindungen): Sie sind wertvoll, aber auch sehr empfindlich gegenüber Oxidation.

Einfach ausgedrückt: Am Anfang ist das Öl geschützt und aromatisch. Doch im Laufe der Zeit und unter falschen Bedingungen bilden sich Moleküle, die das Aroma völlig verändern. Und wenn die Umwandlung erst einmal begonnen hat, beschleunigt sie sich meist.

Der Prozess lässt sich in drei Schritten beschreiben:

1.  **Initiierung**: Etwas „startet“ die Reaktion (Licht, Wärme, Metalle, Zeit) und es bilden sich die ersten Radikale.
2.  **Fortpflanzung**: Sauerstoff kommt ins Spiel und die Reaktion hält sich selbst aufrecht.
3.  **Terminierung**: Flüchtige Verbindungen, die für den muffigen Geruch verantwortlich sind, reichern sich an (die an alte Butter oder ranzige Nüsse erinnern).

Aus diesem Grund kann sich ein Öl, das „gerade erst anfängt“, sehr schnell verschlechtern, wenn es unter den gleichen Bedingungen gelassen wird.

## Faktoren, die die Oxidation beschleunigen

Ranzigkeit ist kein Pech: Sie liegt fast immer am **Umfeld**.

Licht ist einer der schlimmsten Beschleuniger (besonders wenn das Öl in klarem Glas gelagert wird). Wärme tut ihr Übriges: In der Nähe des Herds oder in einer sehr warmen Küche altert das Öl viel schneller. Dann ist da noch die Luft: Je mehr Sauerstoff mit dem Öl in Kontakt bleibt (Flasche oft geöffnet, fast „leer“, unvollständiger Verschluss), desto mehr Brennstoff hat die Reaktion.

## Wie Polyphenole sie verhindern

Hier kommt das Schöne: Olivenöl Extra Vergine besitzt eine natürliche Abwehrkraft – die **Polyphenole**. Sie sind es, die sich zuerst „opfern“, indem sie die Oxidationskette blockieren und die aromatische Alterung verlangsamen.

Das ist einer der Gründe, warum ein polyphenolreiches Öl oft **bitter und scharf** schmeckt: Diese Empfindungen sind ein Qualitätszeichen (kein Fehler) und zeigen, dass das Öl eine im Laufe der Zeit widerstandsfähigere Struktur besitzt.

## Wie man ranziges Öl vermeidet

Das Ziel ist einfach: Schützen Sie das Öl vor seinen drei Hauptfeinden – **Licht, Wärme und Luft**.

- Wählen Sie Behälter, die das Licht abschirmen (Blechdosen oder sehr dunkles Glas).
- Lagern Sie es an einem kühlen, stabilen Ort (nicht über dem Ofen, nicht in der Sonne).
- Schließen Sie den Deckel immer fest und verkürzen Sie die Zeit, in der das Öl der Luft ausgesetzt ist.
- Wenn Sie wenig verbrauchen, wählen Sie kleinere Flaschen: Öl sollte frisch aufgebraucht werden.

:::cta
Möchten Sie ein Olivenöl, das länger frisch bleibt?
Wählen Sie Öle, die reich an Polyphenolen sind, und lagern Sie sie richtig.
[Entdecken Sie die Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "rancige-olijfolie-oorzaken-en-voorkomen",
      title: "Rancige olijfolie: Oorzaken en Voorkomen",
      excerpt: "Ranzigheid is het meest voorkomende en schadelijke defect voor olijfolie. Het begrijpen van de chemie helpt dit met eenvoudige stappen te voorkomen.",
      category: "Olijfolie-defecten",
      content: `## Het mechanisme van oxidatie

*Ranzigheid* komt niet als een verontreiniging van \"buitenaf\": het ontstaat **in de olijfolie zelf**, wanneer de vetten langzaam reageren met zuurstof. Extra vierge olijfolie is rijk aan onverzadigde vetzuren (die met dubbele verbindingen): deze zijn kostbaar, maar ook zeer gevoelig voor oxidatie.

Simpel gezegd: in het begin is de olie beschermd en geurig. Na verloop van tijd en onder de verkeerde omstandigheden vormen zich moleculen die het aroma volledig veranderen. En wanneer die transformatie eenmaal echt op gang komt, heeft ze de neiging te versnellen.

Het proces kan in drie stappen worden voorgesteld:

1.  **Initiatie**: iets \"triggert\" de reactie (licht, warmte, metalen, tijd) en de eerste radicalen worden gevormd.
2.  **Propagatie**: zuurstof komt in het spel en de reactie houdt zichzelf in stand.
3.  **Terminatie**: verbindingen die verantwoordelijk zijn voor de muffe geur hopen zich op (die je doen denken aan oude boter, geoxideerde noten of oud vet).

Dit is de reden waarom een olie die \"net begint\" te veranderen, heel snel achteruit kan gaan als je hem in dezelfde omstandigheden laat staan.

## Factoren die oxidatie versnellen

Ranzigheid is geen pech: het ligt vrijwel altijd aan de **omgeving**.

Licht is een van de ergste versnellers (vooral als de olie in helder glas zit). Warmte doet de rest: in de buurt van het fornuis of in een zeer warme keuken veroudert de olie veel sneller. Dan is er lucht: hoe meer zuurstof in contact blijft met de olie (fles vaak geopend, grotendeels \"leeg\", slechte dop), hoe meer brandstof de reactie heeft.

## Hoe polifenolen het voorkomen

Nu het mooie deel: extra vierge olijfolie heeft een natuurlijke afweer, de **polifenolen**. Zij zijn degenen die zich als eerste \"opofferen\" door de oxidatieve keten te blokkeren en de aromatische veroudering te vertragen.

Dit is een van de redenen waarom een olie rijk aan polifenolen vaak **bitter en pittig** is: die sensaties zijn een kwaliteitsteken (geen defect) en laten zien dat de olie een structuur heeft die beter bestand is tegen de tijd.

## Hoe ranzigheid te voorkomen

Het doel is eenvoudig: bescherm de olijfolie tegen zijn drie belangrijkste vijanden — **licht, warmte en lucht**.

- Kies flessen die licht tegenhouden (blik of zeer donker glas).
- Bewaar het op een koele, stabiele plek (niet boven de oven, niet in de zon).
- Sluit de dop altijd goed en beperk de tijd van blootstelling aan de lucht.
- Als je weinig verbruikt, koop dan kleinere formaten: olie moet vers worden geconsumeerd.

:::cta
Wilt u een extra vierge olijfolie die langer vers blijft?
Kies oliën die rijk zijn aan polifenolen en bewaar ze correct.
[Ontdek de oliën in de shop](/shop)
:::`,
    },
    "da": {
      slug: "harsk-olivenolie-aarsager-og-forebyggelse",
      title: "Harsk olivenolie: Årsager og forebyggelse",
      excerpt: "Harskhed er den mest almindelige og skadelige fejl for oliens kvalitet. At forstå den kemiske proces hjælper dig med nem forebyggelse.",
      category: "Olivenoliefejl",
      content: `## Oxidationsprocessen

*Harskhed* kommer ikke udefra som en forurening: Den opstår **inde i olien**, når dens fedtsyrer langsomt reagerer med ilt. Ekstra jomfruolivenolie er rig på umættede fedtsyrer (dem med dobbeltbindinger): De er værdifulde, men også meget følsomme over for iltning.

Kort sagt: I begyndelsen er olien beskyttet og aromatisk. Men over tid og under de forkerte forhold dannes der molekyler, som ændrer aromaen fuldstændigt. Og når først denne forandring starter, har den tendens til at accelerere.

Processen kan opdeles i tre trin:

1.  **Initiering**: Noget "starter" reaktionen (lys, varme, metaller, tid), og de første radikaler dannes.
2.  **Formering**: Ilt kommer i spil, og reaktionen bliver selvkørende.
3.  **Afslutning**: Der ophobes flygtige forbindelser, som er ansvarlige for den harske lugt (dem, der minder om gammelt smør eller harske nødder).

## Faktorer, der fremskynder iltning

Harskhed er ikke uheld: Det skyldes næsten altid **miljøet**.

Lys er en af de værste accelerationsfaktorer (især hvis olien opbevares i klart glas). Varme gør resten: Nær komfuret eller i et meget varmt køkken ældes olien meget hurtigere. Derudover er der luft: Jo mere ilt, der er i kontakt med olien (flasken åbnes ofte, er næsten "tom", dårligt låg), jo mere brændstof har processen.

## Hvordan polyfenoler forebygger det

Her kommer den gode del: Ekstra jomfruolivenolie har et naturligt forsvar – **polyfenolerne**. Det er dem, der "ofrer sig" først ved at blokere oxidationskæden og forhale den aromatiske ældning.

Det er en af grundene til, at en olie rig på polyfenoler ofte er **bitter og skarp**: Disse smagsindtryk er et kvalitetstegn (ikke en fejl) og viser, at olien har en mere modstandsdygtig struktur over tid.

## Sådan forebygger du det

Målet er enkelt: Beskyt olien mod dens tre største fjender – **lys, varme og luft**.

- Vælg beholdere, der skærmer mod lys (dunke eller meget mørkt glas).
- Opbevar den på et køligt, stabilt sted (ikke over ovnen, ikke i solen).
- Luk altid låget tæt, og minimer den tid, olien udsættes for luft.
- Hvis dit forbrug er lille, bør du vælge mindre flasker: Olie skal bruges frisk.

:::cta
Vil du have en olivenolie, der holder sig frisk længere?
Vælg olier med et højt indhold af polyfenoler, og opbevar dem korrekt.
[Se olierne i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "harsk-olivenolje-aarsaker-og-forebygging",
      title: "Harsk olivenolje: Årsaker og forebygging",
      excerpt: "Harskhet er den mest vanlige og skadelige feilen for oljens kvalitet. Å forstå den kjemiske prosessen hjelper deg med enkel forebygging.",
      category: "Olivenoljefeil",
      content: `## Oksidasjonsprosessen

*Harskhet* kommer ikke utenfra som en forurensning: Den oppstår **inne i oljen**, når fettsyrene langsomt reagerer med oksygen. Ekstra jomfruolivenolje er rik på umettede fettsyrer (de med dobbeltbindinger): De er verdifulle, men også svært følsomme for oksidasjon.

Kort sagt: I begynnelsen er oljen beskyttet og aromatisk. Men over tid og under feil forhold dannes det molekyler som endrer aromaen fullstendig. Og når denne forandringen starter, har den en tendens til å akselerere.

Prosessen kan deles inn i tre trinn:

1.  **Initiering**: Noe "starter" reaksjonen (lys, varme, metaller, tid), og de første radikalene dannes.
2.  **Formering**: Oksygen kommer i spill, og reaksjonen blir selvgående.
3.  **Avslutning**: Det hopes opp flyktige forbindelser som er ansvarlige for den harske lukten (de som minner om gammelt smør eller harske nøtter).

## Faktorer som fremskynder iltning

Harskhet er ikke uhell: Det skyldes nesten alltid **miljøet**.

Lys er en av de verste akselerasjonsfaktorene (spesielt hvis oljen oppbevares i klart glass). Varme gjør resten: Nær komfyren eller i et veldig varmt kjøkken eldes oljen mye raskere. Dessuten er det luft: Jo mer oksygen som er i kontakt med oljen (flasken åpnes ofte, er nesten "tom", dårlig kork), jo mer drivstoff har prosessen.

## Hvordan polyfenoler forebygger det

Her kommer den gode delen: Ekstra jomfruolivenolje har et naturlig forsvar – **polyfenolene**. Det er de som "offrer seg" først ved å blokkere oksidasjonskjeden og forhale den aromatiske aldringen.

Det er en av grunnene til at en olje rik på polyfenoler ofte er **bitter og skarp**: Disse smaksintrykkene er et kvalitetstegn (ikke en feil) og viser at oljen har en mer motstandsdyktig struktur over tid.

## Slik forebygger du det

Målet er enkelt: Beskytt oljen mot dens tre største fiender – **lys, varme og luft**.

- Velg beholdere som skjermer mot lys (bokser eller veldig mørkt glass).
- Oppbevar den på et kjølig, stabilt sted (ikke over ovnen, ikke i solen).
- Lukk alltid korken tett, og minimer tiden oljen utsettes for luft.
- Hvis forbruket ditt er lite, bør du velge mindre flasker: Olje skal brukes fersk.

:::cta
Vil du ha en olivenolje som holder seg fersk lenger?
Velg oljer med et høyt innhold av polyfenoler, og oppbevar dem riktig.
[Se oljene i butikken](/shop)
:::`,
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
      title: "How Our Oil is Born: Harvest → Mill → Storage",
      excerpt: "From field to bottle: every production phase influences the final result. Discover our step-by-step cold extraction process.",
      category: "Our Mill",
      content: `## Philosophy: Quality is built before the harvest

There is no quality oil without a quality olive grove. Pruning, soil management, integrated pest control — everything we do in the olive grove during the year directly conditions the result in the mill.

At Frantoio del Pasqua, we work on hillside olive groves with optimal exposure and well-drained soils in Tuscany. The prevalent variety is *Frantoio*, supported by *Moraiolo* and *Leccino* — the classic Tuscan blend.

## The harvest: The decisive moment

Harvest is the moment when oil quality is decided. Key variables:

### Harvest timing (ripening index)

We harvest with a **ripening index between 2 and 3.5** (Jaen scale, from 0 = completely green to 7 = completely black). This means olives are still predominantly green-violet, with polyphenol content at its peak and a decent oil yield (around 12-14%).

*Harvesting early* means less oil yield but:
- **More polyphenols** → healthier and longer-lasting oil
- **Intense aromas** → rich and complex fruity profile
- **Very low acidity** → superior organoleptic quality

### Harvesting technique

We use **mechanical harvesters** (shakers) on nets spread under the trees. We do not harvest from the ground: fallen olives undergo oxidation and fermentation that compromise oil quality.

Olives are placed in **aerated bins** to prevent overheating and transported to the mill within **4-6 hours** of harvest.

## At the mill: The extraction process

### Milling

Whole olives (leaves and twigs removed by the defoliator) are crushed with a **hammer mill** to break olive cells and release the olive paste.

### Malaxation (Gramolatura)

The olive paste is slowly mixed (*malaxed*) for **20-30 minutes** at a **controlled temperature below 27°C** (cold extraction). Malaxation is crucial to break down micro-emulsions, allowing the oil to gather into larger droplets, facilitating separation.

Key parameters managed by the master olive oil maker:
- *Temperature*: higher = more yield, but fewer polyphenols. We prioritize polyphenols.
- *Duration*: longer = more yield, but risk of oxidation. We maintain the perfect balance.

### Centrifugal extraction (decanter)

The malaxed paste is centrifuged in a **horizontal decanter**. Our mill works primarily in **two phases** (oil + wet pomace), requiring less water addition and producing an oil richer in polyphenols.

### Final separation

The raw oil passes through a **vertical separator** to remove the last traces of water. The product is now raw EVOO — ready for chemical parameter verification.

## Storage: The secret of conservation

The oil is stored in **stainless steel tanks** with conical bottoms (to easily rack the natural sediment) and a **cover of inert gas** (nitrogen). The nitrogen fills the headspace above the oil, eliminating contact with oxygen and blocking oxidation during storage.

The storage room temperature is kept at **13-16°C** year-round.

:::cta
Total transparency: Request analysis of your batch
We provide complete chemical analyses upon request for every batch produced (acidity, peroxides, polyphenols).
[Contact us](/shop)
:::`,
    },
    "de": {
      slug: "wie-unser-oel-entsteht-ernte-pressung-lagerung",
      title: "Wie unser Öl entsteht: Ernte → Ölmühle → Lagerung",
      excerpt: "Vom Feld bis zur Flasche: Jede Phase beeinflusst das Ergebnis. Wir erklären den Kaltpressungsprozess Schritt für Schritt.",
      category: "Unsere Oelmühle",
      content: `## Die Philosophie: Qualität entsteht vor der Ernte

Es gibt kein Qualitätsöl ohne einen Qualitäts-Olivenhain. Der Schnitt, die Bodenpflege, die integrierte Schädlingsbekämpfung – alles, was wir das Jahr über im Hain tun, bestimmt das Ergebnis in der Mühle.

Im Frantoio del Pasqua arbeiten wir auf Hängen mit optimaler Ausrichtung und gut entwässerten Böden in der Toskana. Die dominierende Sorte ist *Frantoio*, ergänzt durch *Moraiolo* und *Leccino* – die klassische toskanische Mischung (Blend).

## Die Ernte: Der entscheidende Moment

Die Ernte entscheidet über die Qualität des Öls. Die Schlüsselvariablen:

### Erntezeitpunkt (Reifegrad)

Wir ernten bei einem **Reifegrad zwischen 2 und 3,5** (Jaen-Skala, von 0 = ganz grün bis 7 = ganz schwarz). Das bedeutet, dass die Oliven noch überwiegend grün-violett sind, der Polyphenolgehalt auf dem Höchststand ist und die Ölausbeute bereits akzeptabel ist (ca. 12–14 %).

*Frühes Ernten* bedeutet zwar weniger Ausbeute, aber:
- **Mehr Polyphenole** → gesünderes und stabileres Öl
- **Intensivere Aromen** → ein kräftiges und komplexes fruchtiges Profil
- **Sehr niedrige Säurewerte** → überragende organoleptische Qualität

### Erntetechnik

Wir verwenden **mechanische Erntehelfer** (Rüttler) auf Netzen, die unter den Bäumen ausgebreitet werden. Wir sammeln keine Oliven vom Boden auf: Heruntergefallene Oliven oxidieren und gären schnell, was die Qualität ruiniert.

Die Oliven werden in **belüftete Kisten** gelegt, um ein Überhitzen zu vermeiden, und innerhalb von **4–6 Stunden** nach der Ernte zur Mühle transportiert.

## In der Ölmühle: Der Extraktionsprozess

### Mahlen

Die ganzen Oliven werden mit einer **Hammermühle** zerkleinert, um die Olivenzellen aufzubrechen und die Olivenpaste freizusetzen.

### Kneten (Gramolatura)

Die Paste wird **20–30 Minuten** lang bei einer **kontrollierten Temperatur unter 27 °C** langsam gerührt (Kaltpressung). Dieser Schritt ist wichtig, damit sich das Öl in größeren Tropfen sammelt, was die Trennung erleichtert.

Vom Mühlenmeister gesteuerte Parameter:
- *Temperatur*: Höher = mehr Ausbeute, weniger Polyphenole. Wir bevorzugen Polyphenole.
- *Dauer*: Länger = mehr Ausbeute, aber Oxidationsrisiko. Wir halten die perfekte Balance.

### Zentrifugieren (Decanter)

Die Paste wird in einem **horizontalen Decanter** zentrifugiert. Unsere Mühle arbeitet hauptsächlich im **Zwei-Phasen-System** (Öl + feuchter Trester). Das verbraucht weniger Wasser und liefert ein Öl mit mehr Polyphenolen.

### Endabscheidung

Das Rohöl durchläuft einen **vertikalen Separator**, um letzte Wasserspuren zu entfernen. Das Ergebnis ist das reine Olivenöl Extra Vergine.

## Lagerung: Das Geheimnis der Frische

Das Öl wird in **Edelstahltanks** gelagert, die unter **Schutzgas (Stickstoff)** stehen. Der Stickstoff verdrängt den Sauerstoff über dem Öl und blockiert die Oxidation während der Lagerung vollständig.

Die Lagertemperatur wird das ganze Jahr über auf **13–16 °C** gehalten.

:::cta
Volle Transparenz: Fordern Sie die Analyse Ihrer Charge an
Wir stellen auf Anfrage vollständige Laboranalysen für jede produzierte Charge zur Verfügung.
[Kontaktieren Sie uns](/shop)
:::`,
    },
    "nl": {
      slug: "hoe-onze-olijfolie-wordt-gemaakt",
      title: "Hoe onze olijfolie ontstaat: Oogst → Perserij → Opslag",
      excerpt: "Van boomgaard tot fles: elke productiefase beïnvloedt het eindresultaat. Ontdek onze ambachtelijke koude persing stap voor stap.",
      category: "Onze Perserij",
      content: `## De filosofie: Kwaliteit begint in de boomgaard

Er bestaat geen kwaliteitsolie zonder een kwalitatieve olijfgaard. Het snoeien, de bodemzorg, de biologische bescherming – alles wat we het hele jaar door in de boomgaard doen, bepaalt direct het resultaat in de perserij.

Bij Frantoio del Pasqua werken we op heuvelachtige olijfgaarden met optimale zonligging en goed gedraineerde gronden in Toscane. De belangrijkste variëteit is *Frantoio*, ondersteund door *Moraiolo* en *Leccino* – de klassieke Toscaanse blend.

## De oogst: Het beslissende moment

De oogst is het moment waarop de kwaliteit van de olijfolie wordt bepaald. De belangrijkste variabelen:

### Oogsttijdstip (rijpingsindex)

We oogsten bij een **rijpingsindex tussen 2 en 3,5** (Jaen-schaal, van 0 = volledig groen tot 7 = volledig zwart). Dit betekent dat de olijven nog voornamelijk groen-paars zijn, het polifenolengehalte op zijn piek is en de olieopbrengst al acceptabel is (ongeveer 12-14%).

*Vroeg oogsten* betekent minder olie-opbrengst maar:
- **Meer polifenolen** → gezondere en stabielere olie
- **Intensere aroma's** → een rijk en complex fruitig profiel
- **Zeer lage zuurgraad** → superieure organoleptische kwaliteit

### Oogsttechniek

We gebruiken **mechanische schudders** op netten die onder de bomen zijn uitgespreid. We rapen geen olijven van de grond op: gevallen olijven ondergaan snel oxidatie en gisting, wat de olijfolie schaadt.

De olijven worden verzameld in **geventileerde kratten** om oververhitting te voorkomen en binnen **4-6 uur** na de oogst naar de perserij getransporteerd.

## In de perserij: Het extractieproces

### Het persen (malen)

De hele olijven worden vermalen met een **hamermolen** om de olijfcellen open te breken en de olijfpasta vrij te maken.

### Mengen (Gramolatie / Malaxeren)

De olijfpasta wordt langzaam gemengd gedurende **20-30 minuten** op een **gecontroleerde temperatuur onder 27°C** (koude extractie). Dit proces is essentieel om de micro-emulsies te doorbreken en de olie te laten samensmelten tot grotere druppels, wat de scheiding vergemakkelijkt.

Belangrijkste parameters beheerd door de persmeester:
- *Temperatuur*: hoger = meer opbrengst, minder polifenolen. Wij geven prioriteit aan polifenolen.
- *Duur*: langer = meer opbrengst, maar risico op oxidatie. Wij bewaren de perfecte balans.

### Centrifugale scheiding (decanter)

De gemixte pasta wordt gecentrifugeerd in een **horizontale decanter**. Onze perserij werkt hoofdzakelijk in **twee fasen** (olie + natte perskoek), wat minder water vereist en een olijfolie oplevert die rijker is aan polifenolen.

### Eindscheiding

De ruwe olijfolie passeert een **verticale scheider** om de laatste sporen van water te verwijderen. Het resultaat is de pure extra vierge olijfolie.

## Opslag: Het geheim van de houdbaarheid

De olijfolie wordt opgeslagen in **roestvrijstalen tanks** met een kegelvormige bodem (voor het decanteren van bezinksel) en onder **stikstofbescherming**. De stikstof vult de ruimte boven de olie op, waardoor contact met zuurstof wordt vermeden en oxidatie tijdens de opslag volledig wordt geblokkeerd.

De temperatuur in de opslagruimte wordt het hele jaar door constant gehouden op **13-16°C**.

:::cta
Volledige transparantie: Vraag de chemische analyse van uw partij aan
Wij bieden op verzoek volledige laboratoriumrapporten voor elke geproduceerde partij.
[Neem contact met ons op](/shop)
:::`,
    },
    "da": {
      slug: "olivenoliens-rejse-fra-jord-til-bord",
      title: "Hvordan vores olie bliver til: Høst → Oliemølle → Lagring",
      excerpt: "Fra mark til flaske: Hver enkelt fase påvirker resultatet. Vi guider dig igennem koldpresningsprocessen trin for trin.",
      category: "Vores Mølle",
      content: `## Filosofi: Kvalitet skabes før høsten

Der findes ikke kvalitetsolie uden en kvalitetolivenlund. Beskæring, jordpleje og beskyttelse af træerne – alt det, vi gør i lunden i årets løb, har direkte indflydelse på resultatet på oliemøllen.

Hos Frantoio del Pasqua arbejder vi på skråninger med optimal sol og veldrænet jord i Toscana. Den dominerende sort er *Frantoio*, suppleret af *Moraiolo* og *Leccino* – den klassiske toscanske blanding.

## Høsten: Det afgørende øjeblik

Høsten er det tidspunkt, hvor oliens kvalitet besluttes. De vigtigste faktorer:

### Høsttidspunkt (modenhedsindeks)

Vi høster med et **modenhedsindeks mellem 2 og 3,5** (Jaen-skalaen, fra 0 = helt grøn til 7 = helt sort). Det betyder, at olivenerne stadig er overvejende grøn-violette, hvor polyfenolindholdet er på sit højeste, og olieudbyttet allerede er acceptabelt (ca. 12-14 %).

*Tidlig høst* betyder mindre olieudbytte, men:
- **Flere polyfenoler** → en sundere og mere stabil olie
- **Intensere aromaer** → en fyldig og kompleks frugtig profil
- **Meget lavt syreindhold** → uovertruffen organoleptisk kvalitet

### Høstteknik

Vi bruger **mekaniske rystere** på net, der er spredt ud under træerne. Vi samler ikke olivener op fra jorden: Nedfaldne olivener oxiderer og gærer hurtigt, hvilket ødelægger oliens kvalitet.

Olivenerne lægges i **ventilerede kasser** for at forhindre overophedning og transporteres til møllen inden for **4-6 timer** efter høst.

## På oliemøllen: Ekstraktionsprocessen

### Kværning

De hele olivener kværnes med en **hammermølle** for at bryde olivencellerne og frigøre olivenmassen.

### Aeltning (Malaxering)

Olivenmassen omrøres langsomt i **20-30 minutter** ved en **kontrolleret temperatur under 27 °C** (koldpresning). Denne proces er afgørende for at få olien til at samle sig i større dråber, hvilket letter adskillelsen.

Kritiske parametre styret af møllemesteren:
- *Temperatur*: Højere = mere udbytte, færre polyfenoler. Vi prioriterer polyfenolerne.
- *Varighed*: Længere = mere udbytte, men risiko for oxidation. Vi holder den perfekte balance.

### Centrifugering (Decanter)

Den æltede masse centrifugeres i en **vandret decanter**. Vores mølle arbejder hovedsageligt i **to faser** (olie + våd presserest), hvilket kræver mindre tilsætning af vand og giver en olie rigere på polyfenoler.

### Endelig adskillelse

Råolien passerer gennem en **lodret separator** for at fjerne de sidste spor af vand. Resultatet er den rene ekstra jomfruolivenolie.

## Lagring: Hemmeligheden bag friskheden

Olien lagres i **tanke af rustfrit stål** under **stickstofbeskyttelse**. Kvælstof fortrænger ilten over olien og forhindrer oxidation under lagringen fuldstændigt.

Lagertemperaturen holdes på **13-16 °C** året rundt.

:::cta
Fuld gennemsigtighed: Anmod om analysen af dit parti
Vi leverer komplette laboratorieanalyser efter anmodning for hvert produceret parti.
[Kontakt os](/shop)
:::`,
    },
    "no": {
      slug: "hvordan-olivenoljen-vaar-blir-til",
      title: "Hvordan oljen vår blir til: Høsting → Mølle → Lagring",
      excerpt: "Fra felt til flaske: Hver enkelt fase påvirker resultatet. Vi guider deg gjennom kaldpressingsprosessen trinn for trinn.",
      category: "Vår Mølle",
      content: `## Filosofi: Kvalitet skapes før høsting

Det finnes ikke kvalitetsolje uten en kvalitetolivenlund. Beskjæring, jordpleie og beskyttelse av trærne – alt det vi gjør i lunden i løpet av året, har direkte innflytelse på resultatet på oliemøllen.

Hos Frantoio del Pasqua arbeider vi på skråninger med optimal sol og veldrenert jord i Toscana. Den dominerende sorten er *Frantoio*, supplert av *Moraiolo* og *Leccino* – den klassiske toskanske blandingen.

## Høstingen: Det avgjørende øyeblikket

Høstingen er tidspunktet der oljens kvalitet bestemmes. De viktigste faktorene:

### Høstetidspunkt (modningsindeks)

Vi høster med en **modningsindeks mellom 2 og 3,5** (Jaen-skalaen, fra 0 = helt grønn til 7 = helt sort). Det betyr at olivene fremdeles er overveiende grønn-lilla, der polyfenolinnholdet er på sitt høyeste, og oljeutbyttet allerede er akseptabelt (ca. 12-14 %).

*Tidlig høst* betyr mindre oljeutbytte, men:
- **Flere polyfenoler** → en sunnere og mer stabil olje
- **Intensere aromaer** → en fyldig og kompleks fruktig profil
- **Svært lavt syreinnhold** → uovertruffen organoleptisk kvalitet

### Høstteknikk

Vi bruker **mekaniske høstere** (ristere) på nett som er spent ut under trærne. Vi samler ikke oliven opp fra bakken: Nedfalne oliven oksiderer og gjærer raskt, noe som ødelegger oljens kvalitet.

Olivene legges i **ventilerte kasser** for å forhindre overoppheting og transporteres til møllen innen **4-6 timer** etter høsting.

## På møllen: Ekstraksjonsprosessen

### Kverning

De hele olivene kvernes med en **hammermølle** for å bryte oliven-cellene og frigjøre olivenmassen.

### Elting (Malaksering)

Olivenmassen omrøres langsomt i **20-30 minutter** ved en **kontrollert temperatur under 27 °C** (kaldpressing). Denne prosessen er avgjørende for å få oljen til å samle seg i større dråper, noe som letter separasjonen.

Kritiske parametere styrt av møllemesteren:
- *Temperatur*: Høyere = mer utbytte, færre polyfenoler. Vi prioriterer polyfenolene.
- *Varighet*: Lengre = mer utbytte, men risiko for oksidasjon. Vi holder den perfekte balansen.

### Sentrifugering (Decanter)

Den eltede massen sentrifugeres i en **vannrett decanter**. Møllen vår arbeider hovedsakelig i **to faser** (olje + våt pressrest), noe som krever mindre tilsetning av vann og gir en olje rikere på polyfenoler.

### Endelig separasjon

Råoljen passerer gjennom en **loddrett separator** for å fjerne de siste sporene av vann. Resultatet er den rene ekstra jomfruolivenoljen.

## Lagring: Himmelen bak ferskheten

Oljen lagres i **tanker av rustfritt stål** under **stikstoffbeskyttelse**. Nitrogen fortrenger oksygenet over oljen og forhindrer oksidasjon under lagringen fullstendig.

Lagertemperaturen holdes på **13-16 °C** året rundt.

:::cta
Full gjennomsiktighet: Be om analysen av ditt parti
Vi leverer komplette laboratorieanalyser etter forespørsel for hvert produserte parti.
[Kontakt oss](/shop)
:::`,
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
      content: `## What you need (and what you don't)

**You need:**
- A small glass (preferably dark blue or opaque — so you can't see the color)
- Your body heat (we warm the glass with our hands)
- Still water at room temperature
- Neutral crackers or unsalted white bread
- Curiosity

**You do NOT need:**
- Professional equipment
- Sommelier training
- Technical jargon

## The 5-minute procedure

### Minute 1 — Prepare

Pour about **10ml** of olive oil into the small glass. Cover it with one hand. Warm it with both hands, gently swirling the glass, for **60 seconds**. Heat brings the oil temperature towards 28°C — the optimal temperature for releasing volatile aromatic compounds.

### Minute 2 — Sniff

Remove your palm quickly and bring the glass to your nose immediately. Take a deep breath.

*What to look for:*
- **Positive notes**: green grass, tomato leaf, fresh almond, artichoke, wild flowers
- **Negative notes**: old butter (rancid), vinegar, damp cellar, mold

Take two or three sniffs, then move the glass away and breathe neutral air for a few seconds.

### Minute 3 — Taste

Take a sip (about 3-5ml). *Do not swallow immediately*. Distribute the oil across your tongue — under and to the sides — and then **slurp air through semi-closed lips** (strippaggio), as if you were whistling softly. This slurping vaporizes the oil, sending volatile compounds towards the retro-nasal olfactory receptors.

Keep the oil in your mouth for **20-30 seconds** before swallowing.

### Minute 4 — Wait for the pepper

After swallowing, wait. The **spiciness** (throat kick) is not felt immediately — it comes *after*, in the back of the throat. It might make you cough: this is normal and very positive. The more intense it is, the higher the concentration of oleocanthal.

Evaluate also:
- The **bitterness** (tasted primarily at the back of the tongue)
- The **balance** between fruity, bitter, and pungent notes.

### Minute 5 — Cleanse and repeat

Drink some room-temperature water and eat a piece of neutral bread. Wait a minute. Now you are ready to taste a second oil for comparison.

:::cta
Try our Olive Oil Tasting Box
Three different flavor profiles, tasting guide included. Perfect for beginners and groups.
[Discover the box](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-verkosten-in-5-minuten-anleitung",
      title: "Olivenöl verkosten in 5 Minuten: Eine praktische Anleitung",
      excerpt: "Man muss kein Profi sein. Mit ein paar einfachen Schritten verkosten Sie Olivenöl wie ein Experte – in fünf Minuten, bequem zu Hause.",
      category: "Unsere Oelmühle",
      content: `## Was Sie brauchen (und was nicht)

**Sie brauchen:**
- Ein kleines Glas (am besten dunkelblau oder undurchsichtig, damit die Farbe nicht ablenkt)
- Ihre Körperwärme (wir wärmen das Glas mit den Händen)
- Stilles Wasser bei Raumtemperatur
- Neutrale Cracker oder ungesalzenes Brot
- Neugier

**Sie brauchen NICHT:**
- Professionelle Ausrüstung
- Sommelier-Ausbildung
- Fachjargon

## Die 5-Minuten-Anleitung

### Minute 1 — Vorbereiten

Gießen Sie etwa **10 ml** Olivenöl in das kleine Glas. Decken Sie es mit einer Hand ab. Wärmen Sie das Glas mit beiden Händen und schwenken Sie es vorsichtig **60 Sekunden** lang. Die Wärme bringt das Öl auf ca. 28 °C – die optimale Temperatur zur Freisetzung der Aromastoffe.

### Minute 2 — Riechen

Nehmen Sie die Hand schnell weg und führen Sie das Glas sofort an die Nase. Atmen Sie tief ein.

*Wonach Sie suchen sollten:*
- **Positive Noten**: grünes Gras, Tomatenblatt, frische Mandel, Artischocke, Wildblumen.
- **Negative Noten**: alte Butter (ranzig), Essig, feuchter Keller, Schimmel.

Riechen Sie zwei- bis dreimal, stellen Sie das Glas dann kurz beiseite und atmen Sie frische Luft.

### Minute 3 — Schmecken

Nehmen Sie einen kräftigen Schluck (ca. 3–5 ml). *Nicht sofort herunterschlucken*. Verteilen Sie das Öl auf der ganzen Zunge und **ziehen Sie dann stoßweise Luft durch die fast geschlossenen Zähne ein** (*strippaggio*), als ob Sie leise pfeifen würden. Dies vernebelt das Öl im Mund und transportiert die Aromen retro-nasal.

Behalten Sie das Öl vor dem Schlucken **20–30 Sekunden** im Mund.

### Minute 4 — Auf die Schärfe warten

Warten Sie nach dem Schlucken ab. Die **Schärfe** (Kratzen im Hals) ist nicht sofort spürbar – sie kommt *danach*, ganz hinten im Rachen. Vielleicht müssen Sie husten: Das ist normal und positiv. Je intensiver, desto höher ist der Gehalt an Oleocanthal.

Bewerten Sie auch:
- Die **Bitterkeit** (hauptsächlich am Zungengrund spürbar).
- Die **Harmonie** zwischen fruchtigen, bitteren und scharfen Noten.

### Minute 5 — Neutralisieren

Trinken Sie etwas Wasser und essen Sie ein Stück Brot. Nach einer Minute können Sie ein weiteres Öl im Vergleich probieren.

:::cta
Probieren Sie unsere Olivenöl-Verkostungsbox
Drei verschiedene Geschmacksprofile, inklusive Verkostungsanleitung. Ideal zum Einstieg.
[Verkostungsbox entdecken](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-proeven-in-5-minuten-praktische-gids",
      title: "Olijfolie proeven in 5 minuten: Praktische gids voor iedereen",
      excerpt: "Je hoeft geen professionele proever te zijn. Met een paar simpele stappen proef je olijfolie als een expert — in vijf minuten thuis.",
      category: "Onze Perserij",
      content: `## Wat je nodig hebt (en wat niet)

**Je hebt nodig:**
- Een klein glas (bij voorkeur donkerblauw of ondoorzichtig — zodat je de kleur niet ziet)
- Je lichaamswarmte (we verwarmen het glas met onze handen)
- Plat water op kamertemperatuur
- Neutrale crackers of zoutloos witbrood
- Nieuwsgierigheid

**Je hebt NIET nodig:**
- Professionele apparatuur
- Sommelier-opleiding
- Technisch jargon

## De 5-minuten procedure

### Minuut 1 — Voorbereiden

Giet ongeveer **10 ml** olijfolie in het kleine glas. Dek het af met één hand. Verwarm het met beide handen, terwijl je het glas voorzichtig ronddraait, gedurende **60 seconden**. De warmte brengt de olijfolie naar ongeveer 28°C — de optimale temperatuur voor het vrijkomen van vluchtige aroma's.

### Minuut 2 — Ruiken

Haal je hand snel weg en breng het glas direct naar je neus. Adem diep in.

*Waar op te letten:*
- **Positieve tonen**: groen gras, tomatenblad, verse amandel, artisjok, wilde bloemen.
- **Negatieve tonen**: oude boter (ranzig), azijn, vochtige kelder, schimmel.

Ruik twee of drie keer, zet het glas dan even weg en adem neutrale lucht in.

### Minuut 3 — Proeven

Neem een slokje (ongeveer 3-5 ml). *Niet meteen doorslikken*. Verdeel de olijfolie over de hele tong en **slobber vervolgens lucht door halfgesloten lippen** (strippaggio), alsof je zachtjes fluit. Dit vernevelt de olie en stuurt de aroma's naar de retro-nasale geurreceptoren.

Houd de olie **20-30 seconden** in de mond voordat je doorslikt.

### Minuut 4 — Wacht op de peper

Wacht na het doorslikken. De **pittigheid** (kriebel in de keel) is niet meteen voelbaar — deze komt *daarna*, achter in de keel. Het kan zijn dat je moet hoesten: dit is normaal en zeer positief. Hoe intenser het is, hoe hoger de concentratie oleocanthal.

Beoordeel ook:
- De **bitterheid** (vooral voelbaar achter op de tong).
- De **balans** tussen fruitige, bittere en pittige tonen.

### Minuut 5 — Neutraliseren en herhalen

Drink wat water op kamertemperatuur en eet een stukje neutraal brood. Wacht een minuut. Nu ben je klaar om een tweede olie te proeven ter vergelijking.

:::cta
Probeer onze Olijfolie Proefbox
Drie verschillende smaakprofielen, proefgids inbegrepen. Perfect voor beginners en groepen.
[Ontdek de proefbox](/shop)
:::`,
    },
    "da": {
      slug: "smagning-af-olivenolie-paa-5-minutter",
      title: "Smagning af olivenolie på 5 minutter: En praktisk guide",
      excerpt: "Du behøver ikke at være professionel smager. Med nogle enkle trin kan du smage olivenolie som en ekspert derhjemme på fem minutter.",
      category: "Vores Mølle",
      content: `## Det skal du bruge (og ikke bruge)

**Du skal bruge:**
- Et lille glas (helst mørkeblåt eller uigennemsigtigt – så du ikke påvirkes af farven)
- Din kropsvarme (vi opvarmer glasset med hænderne)
- Kildevand ved stuetemperatur
- Neutrale kiks eller usaltet brød
- Nysgerrighed

**Du skal IKKE bruge:**
- Professionelt udstyr
- Sommelier-uddannelse
- Svært fagjargon

## Fremgangsmåde på 5 minutter

### Minut 1 — Forberedelse

Hæld ca. **10 ml** olivenolie i det lille glas. Dæk det med håndfladen. Varm glasset mellem hænderne, mens du roterer det forsigtigt i **60 sekunder**. Varmen bringer oliens temperatur op mod 28 °C – den optimale temperatur for frigivelse af flygtige aromaer.

### Minut 2 — Duft

Fjern hånden hurtigt og før straks glasset op til næsen. Træk vejret dybt ind.

*Hvad skal du lede efter:*
- **Positive noter**: grønt græs, tomatblad, frisk mandel, artiskok, vilde blomster.
- **Negative noter**: gammelt smør (harsk), eddike, fugtig kælder, mug.

Duft to eller tre gange, tag derefter glasset væk og træk vejret frit i et par sekunder.

### Minut 3 — Smag

Tag en slurk (ca. 3-5 ml). *Synk ikke med det samme*. Fordel olien over hele tungen – også under og på siderne – og **sug derefter luft ind gennem tænderne** (strippaggio), som om du fløjtede blødt. Dette forstøver olien og sender aromaerne op bag i næsen.

Hold olien i munden i **20-30 sekunder**, før du synker.

### Minut 4 — Vent på skarpheden

Efter du har sunket, skal du vente. **Skarpheden** (prikken i halsen) mærkes ikke med det samme – den kommer *bagefter*, bagerst i halsen. Du vil måske hoste: Det er helt normalt og meget positivt. Jo mere intens den er, jo højere er indholdet af oleocanthal.

Vurder også:
- **Bitterheden** (mærkes primært bagerst på tungen).
- **Balancen** mellem frugtige, bitre og skarpe noter.

### Minut 5 — Rens ganen

Drik lidt stuetempereret vand og spise et stykke neutralt brød. Vent et minut. Nu er du klar til at sammenligne med en anden olie.

:::cta
Prøv vores Olivenoliesmagskasse
Tre forskellige smagsprofiler, smageguide medfølger. Perfekt til begyndere.
[Se smagekassen](/shop)
:::`,
    },
    "no": {
      slug: "smaking-av-olivenolje-paa-5-minutter",
      title: "Smaking av olivenolje på 5 minutter: En praktisk guide",
      excerpt: "Du trenger ikke å være profesjonell smaker. Med noen enkle trinn kan du smake olivenolje som en ekspert hjemme på fem minutter.",
      category: "Vår Mølle",
      content: `## Dette trenger du (og ikke trenger)

**Du trenger:**
- Et lite glass (helst mørkeblått eller ugjennomsiktig – så du ikke påvirkes av fargen)
- Din kroppsvarme (vi oppvarmer glasset med hendene)
- Kildevann ved romtemperatur
- Nøytrale kjeks eller usaltet brød
- Nysgjerrighet

**Du trenger IKKE:**
- Profesjonelt utstyr
- Sommelier-utdannelse
- Vanskelig fagspråk

## Fremgangsmåte på 5 minutter

### Minutt 1 — Forberedelse

Hell ca. **10 ml** olivenolje i det lille glasset. Dekk det med håndflaten. Varm glasset mellom hendene mens du roterer det forsiktig i **60 sekunder**. Varmen bringer oljens temperatur opp mot 28 °C – den optimale temperaturen for frigjøring av flyktige aromaer.

### Minutt 2 — Duft

Fjern hånden raskt og før glasset umiddelbart opp til nesen. Trekk pusten dypt inn.

*Hva skal du se etter:*
- **Positive noter**: grønt gress, tomatblad, frisk mandel, artisjokk, ville blomster.
- **Negative noter**: gammelt smør (harskt), eddik, fuktig kjeller, mugg.

Luktfinn to eller tre ganger, ta deretter glasset bort og pust fritt i noen sekunder.

### Minutt 3 — Smak

Ta en slurk (ca. 3-5 ml). *Ikke svelg med en gang*. Fordel oljen over hele tungen og **sug deretter luft inn gjennom tennene** (strippaggio), akkurat som om du plystret mykt. Dette forstøver oljen og sender aromaene opp bak i nesen.

Hold oljen i munnen i **20-30 sekunder** før du svelger.

### Minutt 4 — Vent på skarpheten

Etter at du har svelget, må du vente. **Skarpheten** (prikkingen i halsen) merkes ikke med en gang – den kommer *etterpå*, bakerst i halsen. Du vil kanskje hoste: Det er helt normalt og veldig positivt. Jo mer intens den er, jo høyere er innholdet av oleocanthal.

Vurder også:
- **Bitterheten** (merkes primært bakerst på tungen).
- **Balansen** mellom fruktige, bitre og skarpe noter.

### Minutt 5 — Rens ganen

Drikk litt romtemperert vann og spis et stykke nøytralt brød. Vent et minutt. Nå er du klar til å sammenligne med en annen olje.

:::cta
Prøv vår Olivenoljesmaksboks
Tre ulike smaksprofiler, smaksguide følger med. Perfekt til nybegynnere.
[Se smaksboksen](/shop)
:::`,
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
      title: "What Bitter and Pungent Are For in EVOO (It's Not a Defect)",
      excerpt: "The throat tickle and persistent bitterness scare many. Yet they are the best indicators of a quality olive oil. Discover why.",
      category: "Olive Oil Info",
      content: `## The most common misunderstanding about EVOO

Many consumers, especially those used to seed oils or flat, industrial olive oils, are thrown off when faced with an oil that *burns in the throat* or leaves a persistent *bitter* aftertaste. The spontaneous reaction is to think that something is wrong.

**It is exactly the opposite**: bitterness and pungency are the *quality markers* par excellence. Learning to recognize them changes everything.

## Oleocanthal explained simply

The **pungency** (technically the burning sensation in the throat, not in the mouth) is mainly due to **oleocanthal**, a dialdehydic polyphenol present almost exclusively in high-quality extra virgin olive oil.

Studies published in *Nature* since 2005 (Beauchamp et al.) have demonstrated that oleocanthal inhibits the same target molecules (COX-1 and COX-2) as ibuprofen — with the exact same anti-inflammatory mechanism, at comparable dosages. It is not a toxic molecule or a defect: it is a natural anti-inflammatory in our daily condiment.

> The throat tickle is the certificate of richness in oleocanthal. The more intense it is, the higher the concentration.

## Oleuropein and bitterness

The **bitterness** (perceived mainly on the tongue) is due to **oleuropein** and its derivatives. This is also a polyphenolic molecule with proven antioxidant, antimicrobial, and cardioprotective activity.

Olives harvested early (green-violet) have the highest concentration of oleuropein. As the olive ripens, this degrades — and the bitterness of the oil progressively mitigates.

## What the absence of bitterness and pungency means

A completely flat, sweet oil, without any aftertaste, is almost always:

- An *old* oil (polyphenols degrade over time)
- An oil obtained from *overripe* or *ground-harvested* olives
- A poorly stored oil (partially oxidized)
- An oil that is *not extra virgin* in chemical reality (regardless of the label)

:::cta
Appreciate the true sensory character of EVOO
Educate your palate to enjoy real quality: start with a light fruity oil and gradually explore robust profiles.
[Discover the oils in our shop](/shop)
:::`,
    },
    "de": {
      slug: "bitter-und-scharf-im-olivenoel-kein-fehler",
      title: "Bitter und Scharf im Olivenöl Extra Vergine: Kein Fehler",
      excerpt: "Das Kratzen im Hals und die anhaltende Bitterkeit schrecken viele ab. Doch sie sind die besten Qualitätsmerkmale. Erfahren Sie warum.",
      category: "Olivenöl-Infos",
      content: `## Das häufigste Missverständnis über Olivenöl Extra Vergine

Viele Verbraucher, insbesondere diejenigen, die an flache, industrielle Olivenöle gewöhnt sind, sind verunsichert, wenn sie mit einem Öl konfrontiert werden, das *im Rachen brennt* oder einen anhaltenden *bitteren* Nachgeschmack hinterlässt. Die spontane Reaktion ist oft der Gedanke, dass etwas nicht stimmt.

**Es ist genau das Gegenteil**: Bitterkeit und Schärfe sind die *Qualitätsmerkmale* par excellence. Zu lernen, sie zu erkennen, verändert alles.

## Oleocanthal einfach erklärt

Die **Schärfe** (technisch gesehen das brennende Gefühl im Rachen, nicht im Mund) ist hauptsächlich auf **Oleocanthal** zurückzuführen. Das ist ein Polyphenol, das fast ausschließlich in hochwertigem nativem Olivenöl Extra vorkommt.

In der Fachzeitschrift *Nature* veröffentlichte Studien (Beauchamp et al., 2005) haben gezeigt, dass Oleocanthal dieselben Zielmoleküle (COX-1 und COX-2) wie Ibuprofen hemmt – mit genau demselben entzündungshemmenden Mechanismus bei vergleichbarer Dosierung. Es ist kein Fehler: Es ist ein natürlicher Entzündungshemmer.

> Das Kitzeln im Hals ist der Nachweis für den Reichtum an Oleocanthal. Je intensiver es ist, desto höher ist die Konzentration.

## Oleuropein und die Bitterkeit

Die **Bitterkeit** (hauptsächlich auf der Zunge wahrgenommen) ist auf **Oleuropein** und seine Derivate zurückzuführen. Auch dies ist ein Polyphenol mit nachgewiesener antioxidativer und kardioprotektiver Wirkung.

Früh geerntete Oliven (grün-violett) weisen die höchste Konzentration an Oleuropein auf. Mit fortschreitender Reife der Olive baut sich dieses ab – und die Bitterkeit des Öls nimmt allmählich ab.

## Was das Fehlen von Bitterkeit und Schärfe bedeutet

Ein völlig flaches, süßes Öl ohne jeglichen Nachgeschmack ist fast immer:

- Ein *altes* Öl (Polyphenole bauen sich mit der Zeit ab)
- Ein Öl aus *überreifen* oder *vom Boden aufgelesenen* Oliven
- Ein schlecht gelagertes Öl (teilweise oxidiert)
- Ein Öl, das in der chemischen Realität *kein natives Olivenöl Extra* ist.

:::cta
Schulen Sie Ihren Gaumen
Lernen Sie echte Qualität schätzen: Beginnen Sie mit einem leicht fruchtigen Öl und tasten Sie sich an kräftige Öle heran.
[Entdecken Sie die Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "bitter-en-pittig-in-olijfolie-geen-defect",
      title: "Waar Bitter en Pittig voor Dienen in Extra Vierge Olijfolie",
      excerpt: "De kriebel in de keel en de aanhoudende bitterheid schrikken velen af. Toch zijn dit de beste kwaliteitsindicatoren. Ontdek waarom.",
      category: "Olijfolie-info",
      content: `## Het meest voorkomende misverstand over extra vierge olijfolie

Veel consumenten, vooral degenen die gewend zijn aan zaadoliën of vlakke, industriële olijfoliën, zijn verbaasd wanneer ze geconfronteerd worden met een olijfolie die *brandt in de keel* of een aanhoudende *bittere* nasmaak achterlaat. De spontane reactie is denken dat er iets mis is.

**Het is precies andersom**: bitterheid en pittigheid zijn de *kwaliteitskenmerken* bij uitstek. Leren om ze te herkennen verandert alles.

## Oleocanthal eenvoudig uitgelegd

De **pittigheid** (technisch gezien het branderige gevoel in de keel, niet in de mond) is voornamelijk te wijten aan **oleocanthal**, een polifenol dat vrijwel uitsluitend voorkomt in hoogwaardige extra vierge olijfolie.

Studies gepubliceerd in *Nature* (Beauchamp et al., 2005) hebben aangetoond dat oleocanthal dezelfde doelmolekylen (COX-1 en COX-2) remt als ibuprofen — met exact hetzelfde ontstekingsremmende mechanisme, bij vergelijkbare doseringen. Het is geen defect: het is een natuurlijke ontstekingsremmer in ons dagelijks condimento.

> De kriebel in de keel is het certificaat van rijkdom aan oleocanthal. Hoe intenser het is, hoe hoger de concentratie.

## Oleuropeïne en bitterheid

De **bitterheid** (vooral waargenomen achter op de tong) is te wijten aan **oleuropeïne** en derivaten daarvan. Dit is ook een polifenol met bewezen antioxidatieve en cardioprotectieve eigenschappen.

Olijven die vroeg worden geoogst (groen-paars) hebben de hoogste concentratie oleuropeïne. Naarmate de olijf rijpt, breekt dit af — en de bitterheid van de olijfolie neemt geleidelijk af.

## Wat het ontbreken van bitterheid en pittigheid betekent

Een volledig vlakke, zoete olie, zonder enige nasmaak, is bijna altijd:

- Een *oude* olijfolie (polifenolen breken na verloop van tijd af)
- Olie verkregen uit *overrijpe* of *van de grond geraapte* olijven
- Een slecht bewaarde olie (gedeeltelijk geoxideerd)
- Olie die in chemische realiteit *geen extra vierge olijfolie* is.

:::cta
Waardeer het ware karakter van olijfolie
Leer echte kwaliteit herkennen en waarderen: begin met een licht fruitige olie en ontdek geleidelijk robuuste profielen.
[Ontdek de oliën in onze shop](/shop)
:::`,
    },
    "da": {
      slug: "bitter-og-skarp-i-olivenolie-ikke-en-fejl",
      title: "Hvorfor bitterhed og skarphed i olivenolie er et sundhedstegn",
      excerpt: "Det kradsende prik i halsen og den bitre eftersmag skræmmer mange. Men de er de bedste indikatorer for kvalitet. Se hvorfor.",
      category: "Olivenolie-info",
      content: `## Den mest almindelige misforståelse om olivenolie

Mange forbrugere, især dem der er vant til flade, industrielle olier, bliver overraskede, når de møder en olie, der *brænder i halsen* eller efterlader en markant *bitter* eftersmag. Den umiddelbare reaktion er at tro, at olien er dårlig.

**Det er præcis modsat**: Bitterhed og skarphed er *kvalitetstegnene* over dem alle. At lære at genkende dem ændrer alt.

## Oleocanthal forklaret enkelt

**Skarpheden** (prikken i halsen, ikke på tungen) skyldes primært **oleocanthal**, et unikt polyfenol, som findes næsten udelukkende i koldpresset olivenolie af høj kvalitet.

Studier offentliggjort i *Nature* siden 2005 (Beauchamp et al.) har vist, at oleocanthal hæmmer de samme molekyler (COX-1 og COX-2) som ibuprofen – med den nøjagtig samme betændelseshæmmende virkning. Det er ikke en fejl: Det er et naturligt apotek i din hverdagsmad.

> Prikken i halsen viser, at olien er rig på oleocanthal. Jo kraftigere den er, jo højere er koncentrationen.

## Oleuropein og bitterhed

**Bitterheden** (der primært mærkes bagerst på tungen) skyldes **oleuropein** og derivater heraf. Dette er også et polyfenol med dokumenteret antioxidativ og hjertebeskyttende virkning.

Olivener høstet tidligt (grøn-violette) har den højeste koncentration af oleuropein. Efterhånden som frugten modnes, nedbrydes stoffet – og oliens bitterhed tones gradvist ned.

## Hvad manglen på bitterhed og skarphed betyder

En helt flad og sød olie uden nogen eftersmag er næsten altid:
- En *gammel* olie (polyfenoler nedbrydes over tid)
- Lavet af *overmodne* eller *nedfaldne* olivener
- Dårligt opbevaret (delvist oxideret)
- Slet ikke *ekstra jomfruolivenolie* i virkeligheden (uanset hvad etiketten siger)

:::cta
Træn din gane til den ægte vare
Start med en let frugtig olie, hvor bitterheden er mild, og bevæg dig gradvist mod mere intensive profiler.
[Se de rene olier i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "bitter-og-skarp-i-olivenolje-ikke-en-feil",
      title: "Hvorfor bitterhet og skarphet i olivenolje er et sunnhetstegn",
      excerpt: "Det kileende prikket i halsen og den bitre ettersmaken skremmer mange. Men de er de beste indikatorene for kvalitet. Se hvorfor.",
      category: "Olivenolje-info",
      content: `## Den mest vanlige misforståelsen om olivenolje

Mange forbrukere, spesielt de som er vant til flate, industrielle oljer, blir overrasket når de møter en olje som *brenner i halsen* or etterlater en markant *bitter* ettersmak. Den umiddelbare reaksjonen er å tro at oljen er dårlig.

**Det er akkurat motsatt**: Bitterhet og skarphet er *kvalitetstegnene* over alle andre. Å lære å kjenne dem igjen endrer alt.

## Oleocanthal forklart enkelt

**Skarpheten** (prikkingen i halsen, ikke på tungen) skyldes primært **oleocanthal**, et unikt polyfenol som finnes nesten utelukkende i kaldpresset olivenolje av høy kvalitet.

Studier offentliggjort i *Nature* siden 2005 (Beauchamp et al.) har vist at oleocanthal hemmer de samme molekylene (COX-1 og COX-2) som ibuprofen – med den nøyaktig samme betennelsesdempende virkningen. Det er ikke en feil: Det er et naturlig apotek i din hverdagsmat.

> Prikkingen i halsen viser at oljen er rik på oleocanthal. Jo kraftigere den er, jo høyere er konsentrasjonen.

## Oleuropein og bitterhet

**Bitterheten** (som primært merkes bakerst på tungen) skyldes **oleuropein** og derivater av dette. Dette er også et polyfenol med dokumentert antioksidativ og hjertebeskyttende virkning.

Oliven høstet tidlig (grønn-lilla) har den høyeste konsentrasjonen av oleuropein. Etter hvert som frukten modnes, nedbrytes stoffet – og oljens bitterhet tones gradvis ned.

## Hva mangelen på bitterhet og skarphet betyr

En helt flat og søt olje uten noen ettersmak er nesten alltid:
- En *gammel* olje (polyfenoler nedbrytes over tid)
- Laget av *overmodne* eller *nedfalne* oliven
- Dårlig oppbevart (delvis oksidert)
- Slett ikke *ekstra jomfruolivenolje* i virkeligheten (uansett hva etiketten sier)

:::cta
Tren ganen din til den ekte varen
Start med en lett fruktig olje der bitterheten er mild, og beveg deg gradvis mot mer intensive profiler.
[Se de rene oljene i butikken](/shop)
:::`,
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
      category: "Storage",
      content: `## Why olive oil degrades

EVOO is a *living* product — rich in chemical components that react to the environment. Two main processes cause it to deteriorate:

- **Oxidation**: unsaturated fats react with oxygen, forming hydroperoxides and then aldehydes — the molecules responsible for the classic rancid smell.
- **Photo-oxidation**: light, in the presence of chlorophyll (which gives the oil its green color), exponentially accelerates oxidation.

Both processes are irreversible: oxidized oil cannot be recovered.

## The three enemies: light, oxygen, heat

### 1. Light

It is the most silent enemy. A clear glass bottle exposed to direct sunlight (or strong artificial light) can degrade the oil in just a few days.

*What to do*: Store oil in opaque containers (tins or very dark glass). If using a glass bottle, keep it inside a closed cabinet.

### 2. Oxygen

Every time you open the bottle, air enters. The lower the oil level in the bottle, the more air there is above it — and oxidation accelerates.

*What to do*:
- Use small containers that you refill often, rather than one large, half-empty container.
- Always close the cap tightly after each use.
- Consider tins, which minimize headspace as you consume the oil.

### 3. Heat

Olive oil should not stand *near stoves*. Many families leave the oil cruet right next to the burners — a classic mistake. Heat accelerates all chemical degradation reactions.

*What to do*: The ideal storage temperature is between **12 and 18°C**. A cool pantry is perfect. Refrigeration is not necessary (oil solidifies but does not damage, though repeated thermal cycles are not ideal).

## The ideal setup for your kitchen

1. **A cool, dark space** (lower cupboard or pantry) for your stock.
2. **A small opaque ceramic cruet** (150–250ml) on the countertop for daily use, to be refilled every 1–2 weeks.
3. **Keep the large container sealed** in the dark until needed.

:::cta
Protect your investment in health
Proper storage preserves taste and anti-aging properties. Check your kitchen pantry today!
[Discover our tinned EVOO selections](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-richtig-lagern-licht-sauerstoff-temperatur",
      title: "Olivenöl richtig lagern: Licht, Sauerstoff, Temperatur",
      excerpt: "Die drei Feinde des Olivenöls sind Licht, Sauerstoff und Wärme. Einfache Fehler können ein hervorragendes Öl in Wochen ruinieren.",
      category: "Lagerung",
      content: `## Warum Olivenöl altert

Natives Olivenöl Extra ist ein *lebendiges* Produkt – reich an Inhaltsstoffen, die mit der Umwelt reagieren. Zwei Prozesse schädigen das Öl hauptsächlich:

- **Oxidation**: Ungesättigte Fette reagieren mit Sauerstoff und bilden Hydroperoxide und dann Aldehyde – die Moleküle, die für den ranzigen Geruch verantwortlich sind.
- **Fotooxidation**: Licht beschleunigt die Oxidation in Gegenwart von Chlorophyll (das dem Öl seine grüne Farbe verleiht) imens.

Beide Prozesse sind unumkehrbar.

## Die drei Feinde: Licht, Sauerstoff, Wärme

### 1. Das Licht

Licht ist der heimtückischste Feind. Eine klare Glasflasche, die direktem Sonnenlicht oder starkem künstlichen Licht ausgesetzt ist, kann das Öl in wenigen Tagen unbrauchbar machen.

*Was zu tun ist*: Lagern Sie das Öl in lichtundurchlässigen Behältern (Kanistern oder sehr dunklem Glas). Bewahren Sie Flaschen im geschlossenen Schrank auf.

### 2. Der Sauerstoff

Jedes Mal, wenn Sie die Flasche öffnen, strömt Luft hinein. Je leerer die Flasche wird, desto mehr Luft befindet sich über dem Öl – und die Oxidation beschleunigt sich.

*Was zu tun ist*:
- Verwenden Sie kleinere Flaschen, die Sie häufig nachfüllen, statt einer großen halbleeren Flasche.
- Verschließen Sie die Flasche nach jedem Gebrauch sofort fest.
- Verwenden Sie Kanister (diese reduzieren den Luftraum beim Entleeren).

### 3. Die Wärme

Olivenöl darf nicht *neben dem Herd* stehen. Viele lassen die Menage direkt neben den Kochplatten stehen – ein klassischer Fehler. Wärme beschleunigt alle chemischen Abbauprozesse.

*Was zu tun ist*: Die ideale Lagertemperatur liegt zwischen **12 und 18 °C**. Eine kühle Speisekammer ist perfekt. Eine Kühlung im Kühlschrank ist nicht nötig (das Öl flockt aus, nimmt aber keinen Schaden).

## Das ideale Setup für Ihre Küche

1. **Ein kühler, dunkler Ort** (unterer Schrank oder Speisekammer) für den Vorrat.
2. **Eine kleine, lichtundurchlässige Keramik-Karaffe** (150–250 ml) auf der Arbeitsplatte für den täglichen Gebrauch, die alle 1–2 Wochen frisch befüllt wird.
3. **Der große Kanister** bleibt verschlossen im Dunkeln stehen.

:::cta
Schützen Sie Ihr gesundes Olivenöl
Die richtige Lagerung schützt den Geschmack und die wertvollen Inhaltsstoffe.
[Entdecken Sie unsere Kanister im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-bewaren-licht-zuurstof-temperatuur",
      title: "Olijfolie Bewaren: Licht, Zuurstof, Temperatuur",
      excerpt: "De drie vijanden van extra vierge olijfolie zijn licht, zuurstof en warmte. Banale fouten kunnen een geweldige olijfolie in weken bederven.",
      category: "Lagring",
      content: `## Waarom olijfolie bederft

Extra vierge olijfolie is een *levend* product — rijk aan chemische componenten die reageren op de omgeving. Twee belangrijke processen veroorzaken achteruitgang:

- **Oxidatie**: onverzadigde vetten reageren met zuurstof, waardoor idroperoxiden en vervolgens aldehyden ontstaan — de moleculen die verantwoordelijk zijn voor de klassieke ranzige geur.
- **Foto-oxidatie**: licht versnelt de oxidatie in aanwezigheid van bladgroen (dat de olijfolie zijn groene kleur geeft) op exponentiële wijze.

Beide processen zijn onomkeerbaar: geoxideerde olijfolie kan niet worden hersteld.

## De drie vijanden: licht, zuurstof, warmte

### 1. Licht

Dit is de meest geruisloze vijand. Een heldere glazen fles die wordt blootgesteld aan direct zonlicht (of sterke kunstmatige verlichting) kan de kwaliteit in slechts enkele dagen ernstig schaden.

*Wat te doen*: Bewaar de olijfolie in ondoorzichtige flessen (blik of zeer donker glas). Als je een glazen fles gebruikt, bewaar deze dan in een gesloten kast.

### 2. Zuurstof

Elke keer dat je de fles opent, komt er lucht binnen. Hoe lager de olie in de fles staat, hoe meer lucht er boven zit — en de oxidatie versnelt.

*Wat te doen*:
- Gebruik kleine flessen die je vaak bijvult, in plaats van één grote, halflege fles.
- Sluit de dop altijd goed na elk gebruik.
- Overweeg blikken (deze minimaliseren de blootstelling aan lucht).

### 3. Warmte

Olijfolie mag niet *in de buurt van het fornuis* staan. Veel gezinnen laten de olijfoliefles direct naast de kookplaat staan — een klassieke fout. Warmte versnelt alle chemische afbraakreacties.

*Wat te doen*: De ideale bewaartemperatur ligt tussen **12 en 18°C**. Een koele voorraadkast is perfect. Koeling in de koelkast is niet nodig (de olie stolt maar raakt niet beschadigd).

## Het ideale setup voor de keuken

1. **Een koele, donkere ruimte** (lage kast of kelder) voor de voorraad.
2. **Een klein ondoorzichtig keramisch olijfoliekannetje** (150-250 ml) op het aanrecht voor dagelijks gebruik, om elke 1-2 weken bij te vullen.
3. **Houd de grote verpakking gesloten** in het donker tot je deze nodig hebt.

:::cta
Bescherm uw investering in gezondheid
Een goede opslag behoudt de smaak en de anti-aging eigenschappen. Controleer vandaag nog uw voorraadkast!
[Ontdek onze selectie olijfolie in blik](/shop)
:::`,
    },
    "da": {
      slug: "opbevaring-af-olivenolie-hjemme",
      title: "Opbevaring af olivenolie derhjemme: Lys, ilt, temperatur",
      excerpt: "De tre fjender for ekstra jomfruolivenolie er lys, ilt og varme. Undgå enkle fejl, der kan ødelægge en fantastisk olie på få uger.",
      category: "Lagring",
      content: `## Hvorfor olivenolie bliver dårlig

Ekstra jomfruolivenolie er et *levende* produkt – rigt på kemiske komponenter, der reagerer med omgivelserne. To primære processer forringer olien:

- **Oxidation**: Umættede fedtsyrer reagerer med ilt, hvorved der dannes hydroperoxider og derefter aldehyder – de molekyler, der giver den klassiske harske lugt.
- **Fotooxidation**: Lys fremskynder oxidationen eksplosivt i nærvær af klorofyl (som giver olien dens grønne farve).

Begge processer er irreversible: Oxideret olie kan ikke reddes.

## De tre fjender: Lys, ilt, varme

### 1. Lys

Det er den mest lydløse fjende. En klar glasflaske, der udsættes for direkte sollys eller stærkt kunstigt lys, kan ødelægge olien på få dage.

*Hvad skal du gøre*: Opbevar olien i lystætte beholdere (dunke eller meget mørkt glas). Hvis du bruger en glasflaske, skal du opbevare den inde i et lukket skab.

### 2. Ilt

Hver gang du åbner flasken, slipper der luft ind. Jo mindre olie der er tilbage i flasken, jo mere luft er der over den – og oxidationen accelererer.

*Hvad skal du gøre*:
- Brug mindre beholdere, som du fylder op ofte, frem for én stor, halvtom beholder.
- Luk altid låget tæt efter hver brug.
- Overvej dunke, som minimerer luftens kontakt med olien, efterhånden som du bruger af den.

### 3. Varme

Olivenolie må ikke stå *nær komfuret*. Mange lader oliefjederen stå lige ved siden af kogepladerne – en klassisk fejl. Varme fremskynder alle kemiske nedbrydningsreaktioner.

*Hvad skal du gøre*: Den ideelle opbevaringstemperatur er mellem **12 og 18 °C**. Et køligt viktualierum er perfekt. Køleskab er ikke nødvendigt (olien stivner, men tager ikke skade).

## Den ideelle indretning af dit køkken

1. **Et køligt, mørkt sted** (et lavt skab eller spisekammer) til dit lager.
2. **En lille lystæt keramikflaske** (150-250 ml) på køkkenbordet til daglig brug, som du fylder op hver eller hver anden uge.
3. **Hold den store beholder forseglet** i mørket, indtil du skal bruge den.

:::cta
Beskyt din sundhedsinvestering
Korrekt opbevaring bevarer smagen og de sunde egenskaber. Tjek dit spisekammer i dag!
[Se vores udvalg af olier på dunk](/shop)
:::`,
    },
    "no": {
      slug: "oppbevaring-af-olivenolje-hjemme",
      title: "Oppbevaring av olivenolje hjemme: Lys, oksygen, temperatur",
      excerpt: "De tre fiendene til ekstra jomfruolivenolje er lys, oksygen og varme. Unngå enkle feil som kan ødelegge en fantastisk olje på få uker.",
      category: "Lagring",
      content: `## Hvorfor olivenolje blir dårlig

Ekstra jomfruolivenolje er et *levende* produkt – rikt på kjemiske komponenter som reagerer med omgivelsene. To primære prosesser forringer oljen:

- **Oksidasjon**: Umettede fettsyrer reagerer med oksygen, noe som danner hydroperoksider og deretter aldehyder – de molekylene som gir den klassiske harske lukten.
- **Fotooksidasjon**: Lys fremskynder oksidasjonen eksplosivt i nærvær av klorofyll (som gir oljen den grønne fargen).

Begge prosessene er irreversible: Oksidert olje kan ikke reddes.

## De tre fiendene: Lys, oksygen, varme

### 1. Lys

Det er den mest lydløse fienden. En klar glassflaske som utsettes for direkte sollys eller sterkt kunstig lys, kan ødelegge oljen på få dager.

*Hva skal du gjøre*: Oppbevar oljen i lystette beholdere (bokser eller veldig mørkt glass). Hvis du bruker en glassflaske, må du oppbevare den inne i et lukket skap.

### 2. Oksygen

Hver gang du åpner flasken, slipper det luft inn. Jo mindre olje det er igjen i flasken, jo mer luft er det over den – og oksidasjonen akselererer.

*Hva skal du gjøre*:
- Bruk mindre beholdere som du fyller opp ofte, fremfor én stor, halvtom beholder.
- Lukk alltid korken tett etter hver bruk.
- Vurder bokser, som minimerer luftens kontakt med oljen etter hvert som du bruker av den.

### 3. Varme

Olivenolje må ikke stå *nær komfyren*. Mange lar oljeflasken stå rett ved siden av kokeplatene – en klassisk feil. Varme fremskynder alle kjemiske nedbrytningsreaksjoner.

*Hva skal du gjøre*: Den ideelle oppbevaringstemperaturen er mellom **12 og 18 °C**. Et kjølig spiskammer er perfekt. Kjøleskap er ikke nødvendig (oljen stivner, men tar ikke skade).

## Den ideelle innretningen av kjøkkenet ditt

1. **Et kjølig, mørkt sted** (et lavt skap eller spiskammer) til lageret ditt.
2. **En liten lystett keramikkflaske** (150-250 ml) på kjøkkenbenken til daglig bruk, som du fyller opp hver eller hver andre uke.
3. **Hold den store beholderen forseglet** i mørket til du skal bruke den.

:::cta
Beskytt helseinvesteringen din
Riktig oppbevaring bevarer smaken og de sunne egenskapene. Sjekk spiskammeret ditt i dag!
[Se vårt utvalg av oljer på boks](/shop)
:::`,
    },
  },"""

# Insert new translations into content
content = content[:target_idx] + new_translations + "\n" + content[target_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Translations successfully appended!")
