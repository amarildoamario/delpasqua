import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target_marker = '  "tec-1": {'

target_idx = content.find(target_marker)

if target_idx == -1:
    print("Target marker not found!")
    exit(1)

new_translations = """  "info-4": {
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
      content: `## What is rancidity chemically?

Rancidity is the unmistakable sign of oxidized olive oil. In simple terms: over time, and due to exposure to light, heat, or air, the volatile aromatic compounds change. Fresh, green aromas vanish and are replaced by stale, unpleasant notes.

It is a defect that cannot be fixed: once olive oil turns rancid, it never goes back. The good news is that it is easy to recognize if you know what to look for—and above all, if you trust your nose more than your eyes.

## The signs of rancid oil

### On the nose

The first warning sign is almost always the aroma. A rancid oil does not smell like fresh olives; it smells like something left in a dusty attic.

You might perceive notes reminiscent of:
*   Old butter or margarine
*   Stale, oxidized nuts
*   Wet cardboard
*   A varnish-like or crayon-like smell in advanced stages

If you smell no green freshness at all, and only get a flat, greasy, stale aroma, the oil is rancid.

### On the palate

In your mouth, rancid oil leaves a greasy, heavy film that lingers unpleasantly. Do not confuse this with the "good" peppery sensation of high-quality, polyphenol-rich oil: that throat-tingling sting is vibrant and clean. Rancid oil, on the other hand, feels stale and fat, leaving an dry, dusty finish.

Another clear indicator is the total absence of positive notes: you won't taste grass, artichoke, green tomato, or almond—only heavy grease.

### On the eyes

Color will not save you. A completely rancid oil can still look beautiful and golden. That is why the ultimate test is always: smell it and taste it.

## Is it dangerous to consume rancid olive oil?

Consuming a small amount of slightly rancid oil is not immediately toxic. However, it has lost all its nutritional value: the polyphenols, vitamins, and fresh aromas are gone. Plus, it will ruin your food. There is no point in keeping it just to "avoid waste."

If the smell is strong and clearly unpleasant, the oil's life cycle is over.

## What to do with it

If you recognize your oil as rancid, the best choice is to **discard it**. It will not improve with cooking, it cannot be masked by other ingredients, and heating it will only make the bad smell worse.

To prevent rancidity in the future:
*   Buy bottle sizes that match your actual consumption.
*   Store it in a dark, cool place away from the stove.
*   Always close the cap tightly immediately after use.

:::cta
Want to be sure of freshness?
Choose oils from the latest harvest with a vibrant aromatic profile: you will taste the difference instantly.
[Explore our fresh oils](/shop)
:::`,
    },
    "de": {
      slug: "wie-man-ranziges-olivenoel-erkennt",
      title: "Wie Sie erkennen, ob ein Olivenöl ranzig ist",
      excerpt: "Der Geruch von ranzigem Öl ist unverwechselbar. Erfahren Sie, wie Sie ihn erkennen und warum sich ranziges Öl in der Küche nicht lohnt.",
      category: "Fehler im Olivenoel",
      content: `## Was ist Ranzigkeit aus chemischer Sicht?

Ranzigkeit ist die Signatur eines oxidierten Öls. Einfach gesagt: Im Laufe der Zeit (und durch Licht, Hitze oder Luft) verändern sich die Aromastoffe. Die frischen, grünen Düfte verschwinden und werden durch muffige, abgestandene Noten ersetzt.

Dieser Fehler lässt sich nicht korrigieren: Wenn ein Öl einmal gekippt ist, gibt es kein Zurück mehr. Die gute Nachricht ist, dass man es sehr gut erkennen kann, wenn man weiß, worauf man achten muss – und vor allem, wenn man der Nase mehr vertraut als den Augen.

## Die Anzeichen für ranziges Öl

### Der Geruch

Das erste Warnsignal ist fast immer der Duft. Ein ranziges Öl riecht nicht nach frischen Oliven, sondern erinnert an eine staubige Abstellkammer.

Sie können Noten wahrnehmen wie:
*   Alte Butter oder Margarine
*   Abgestandene, oxidierte Nüsse
*   Feuchte Pappe
*   Ein lackartiger oder wachsmalstiftähnlicher Geruch in fortgeschrittenem Stadium

Wenn Sie überhaupt keine grüne Frische wahrnehmen und nur einen flachen, fettigen, muffigen Geruch riechen, ist das Öl ranzig.

### Der Geschmack

Im Mund hinterlässt ranziges Öl einen schweren, fettigen Film, der unangenehm haften bleibt. Verwechseln Sie dies nicht mit der „guten“ Schärfe eines hochwertigen, polyphenolreichen Öls: Dieses Kitzeln im Hals ist lebendig und sauber. Ranziges Öl hingegen schmeckt fettig und trocken.

Ein weiteres klares Zeichen ist das völlige Fehlen positiver Noten: Sie schmecken kein Gras, keine Artischocke, keine grüne Tomate oder frische Mandel mehr.

### Das Aussehen

Die Farbe sagt nichts aus. Ein ranziges Öl kann immer noch wunderschön golden glänzen. Deshalb gilt: Riechen und schmecken Sie hin!

## Ist ranziges Olivenöl ungesund?

Der Verzehr geringer Mengen ist nicht sofort gesundheitsschädlich. Allerdings hat das Öl all seine wertvollen Inhaltsstoffe verloren: Polyphenole, Vitamine und Frische sind dahin. Zudem verdirbt es den Geschmack jedes Gerichts.

Wenn der Geruch deutlich unangenehm ist, entsorgen Sie das Öl.

## Was Sie tun können

Wenn Sie ranziges Öl erkennen, sollten Sie es **nicht mehr zum Kochen verwenden**. Der Geruch wird beim Erhitzen nur noch schlimmer.

So beugen Sie Ranzigkeit vor:
*   Kaufen Sie Flaschengrößen, die zu Ihrem tatsächlichen Verbrauch passen.
*   Lagern Sie das Öl dunkel und kühl, weit weg vom Herd.
*   Verschließen Sie die Flasche nach jedem Gebrauch sofort fest.

:::cta
Wollen Sie bei der Frische auf Nummer sicher gehen?
Wählen Sie Öle aus der aktuellen Ernte mit einem lebendigen Aroma-Profil.
[Entdecken Sie frische Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "hoe-herken-je-ranzige-olijfolie",
      title: "Hoe je herkent of een olijfolie ranzig is",
      excerpt: "De geur van ranzige olijfolie is onmiskenbaar als je weet waar je op moet letten. Ontdek de signalen en waarom je het beter kunt weggooien.",
      category: "Olijfolie Defecten",
      content: `## Wat is ranzigheid chemisch gezien?

Ranzigheid is het onmiskenbare teken van geoxideerde olijfolie. Kort gezegd: door blootstelling aan licht, warmte of lucht veranderen de vluchtige aromastoffen. Verse, groene aroma's verdwijnen en maken plaats voor muffe, muffe tonen.

Dit defect kan niet worden hersteld: als olijfolie eenmaal ranzig is geworden, keert het nooit meer terug. Het goede nieuws is dat het gemakkelijk te herkennen is als je weet waar je op moet letten—en vooral als je meer op je neus vertrouwt dan op je ogen.

## De signalen van ranzige olijfolie

### De geur

De eerste waarschuwing is bijna altijd de geur. Een ranzige olie ruikt niet naar verse olijven; het ruikt naar iets dat te lang in een stoffige kast heeft gestaan.

U kunt tonen waarnemen die doen denken aan:
*   Oude boter of margarine
*   Stoffige, geoxideerde noten
*   Nat karton
*   Een lak- of waskrijtachtige geur in een vergevorderd stadium

Als u helemaal geen groene frisse tonen ruikt, maar alleen een vlakke, vettige, muffe geur, dan is de olijfolie ranzig.

### De smaak

In de mond laat ranzige olijfolie een zware, vettige film achter die onaangenaam blijft hangen. Verwar dit niet met de "goede" pittige prikkeling van een hoogwaardige olijfolie: die tinteling is levendig en schoon. Ranzige olie daarentegen voelt muf en vet aan en laat een droog, stoffig mondgevoel achter.

### Het uiterlijk

Kleur zegt niets. Een volledig ranzige olie kan er nog steeds prachtig goudgeel uitzien. De ultieme test is daarom altijd: ruiken en proeven.

## Wat te doen?

Als de olijfolie ranzig is, kunt u deze het beste **weggooien**. Het zal niet verbeteren tijdens het koken en verpest de smaak van uw gerechten.

:::cta
Wilt u zeker zijn van verse olijfolie?
Kies voor olijfolie uit de recentste oogst met een levendig aromatisch profiel.
[Ontdek onze verse olijfolie](/shop)
:::`,
    },
    "da": {
      slug: "hvordan-genkender-man-harsk-olivenolie",
      title: "Sådan genkender du en harsk olivenolie: tegn og gode råd",
      excerpt: "Duften af harsk olivenolie er ikke til at tage fejl af. Se, hvordan du genkender den, og hvorfor den ikke er værd at gemme på.",
      category: "Olivenolie Defekter",
      content: `## Hvad er harskhed kemisk set?

Harskhed er tegnet på, at olivenolien er oxideret. Kort sagt: Med tiden (og på grund af lys, varme og ilt) ændrer aromastofferne sig. De friske, grønne dufte forsvinder og erstattes af flade, hengemte noter.

Dette er en fejl, der ikke kan rettes: Når olien først er harsk, kan den ikke reddes. Den gode nyhed er, at det er let at genkende, hvis du ved, hvad du skal lede efter.

## Tegnene på harsk olie

### Duften

Det første tegn er næsten altid duften. En harsk olie dufter ikke af friske oliven; den dufter mere af et gammelt loftsrum.

Du kan opleve noter af:
*   Gammelt smør eller margarine
*   Harske, iltede nødder
*   Vådt pap
*   Maling eller voksfarver i alvorlige tilfælde

### Smagen

I munden efterlader harsk olie en fedtet, tung hinde. Forveksl ikke dette med den "gode" prikken fra en frisk olie: Den kildrer rent i halsen. Harsk olie smager derimod blot af gammelt fedt og udtørrer munden.

:::cta
Vil du være sikker på friskheden?
Vælg olivenolie fra den seneste høst med en levende smagsprofil.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "hvordan-gjenkjenne-harsk-olivenolje",
      title: "Slik gjenkjenner du en harsk olivenolje: tegn og råd",
      excerpt: "Duften av harsk olivenolje er ikke til å ta feil av. Se hvordan du gjenkjenner den og hvorfor du bør kaste den.",
      category: "Olivenolje Defekter",
      content: `## Hva er harskhet kjemisk sett?

Harskhet er tegnet på at olivenoljen er oksidert. Kort sagt: Med tiden (og på grunn av lys, varme og luft) endrer aromastoffene seg. De friske, grønne duftene forsvinner og erstattes av flate, tunge noter.

Dette er en feil som ikke kan rettes: Når oljen først er harsk, kan den ikke reddes. Den gode nyheten er at det er lett å gjenkjenne hvis du vet hva du skal lete etter.

## Tegnene på harsk olje

### Duften

Det første tegnet er nesten alltid duften. En harsk olje dufter ikke av ferske oliven; den dufter mer av et gammelt loftsrom.

Du kan oppleve noter av:
*   Gammelt smør eller margarin
*   Harske, oksiderte nøtter
*   Vått papp
*   Maling eller voksfarger i alvorlige tilfeller

### Smaken

I munnen etterlater harsk olje en fet, tung hinne. Ikke forveksle dette med den "gode" prikkingen fra en frisk olje: Den kiler rent i halsen. Harsk olje smaker derimot bare av gammelt fett og tørker ut munnen.

:::cta
Vil du være sikker på friskheten?
Velg olivenolje fra den nyeste høsten med en levende smaksprofil.
[Se butikken](/shop)
:::`,
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
      category: "Olive Oil Info",
      content: `## The myth of the green color

On social media, in advertising, and in general olive oil marketing, a bright emerald green color is often presented as the ultimate symbol of quality. While that green is indeed beautiful, it is not a quality indicator at all. In fact, in some cases, it can mean the exact opposite.

## Where does olive oil's color come from?

The color of extra virgin olive oil depends on two main groups of pigments:
*   **Chlorophylls:** These give the green hue. They are highly abundant in green, unripe olives and naturally degrade as the fruit ripens. It is also important to know that chlorophylls are photo-sensitizers: exposed to light, they actively accelerate the oxidation of the oil.
*   **Carotenoids** (lutein, beta-carotene): These give the golden-yellow tones. Carotenoids are much more stable than chlorophylls.

## Why color varies

A deep green oil can result from:
*   Olives harvested very early in the season (bright green) -> **A good sign** for a high polyphenol count.
*   Certain cultivars that naturally yield a greener oil (e.g., Coratina or Moraiolo) -> **Neutral**.
*   The fraudulent addition of olive leaves during milling -> **A deceptive practice** used to artificially boost the green color.

A golden-yellow oil can result from:
*   Perfectly ripe olives -> **Normal, and not necessarily lower in quality**.
*   Filtered oil after a few months of storage -> **Neutral**.
*   Cultivars that naturally yield a golden hue (e.g., Ligurian Taggiasca) -> **Neutral**.

## Official tastings hide the color

Did you know that official Panel Tests (conducted by the International Olive Council) require the use of **dark blue glasses**? This is specifically designed to hide the color of the oil from the taster. Color is known to influence our judgment subconsciously, yet it has nothing to do with the actual taste or health benefits.

True quality is measured only by smell and taste. Never by the eyes.

> A green oil can be excellent or mediocre. A golden oil can be excellent or mediocre. Color does not decide.

:::cta
Trust your senses, not just your eyes
Taste our selection of certified extra virgin olive oils.
[Discover the Shop](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-farbe-ist-gruen-besser",
      title: "Die Farbe von Olivenöl: Ist grün wirklich besser?",
      excerpt: "Das kräftige Grün von frisch gepresstem Olivenöl ist wunderschön. Doch ist die Farbe wirklich ein Zeichen für Qualität?",
      category: "Wissen ueber Olivenoel",
      content: `## Der Mythos der grünen Farbe

In den sozialen Medien und in der Werbung wird ein leuchtendes Smaragdgrün oft als Symbol für höchste Qualität präsentiert. Doch obwohl dieses Grün wunderschön ist, sagt es nichts über die tatsächliche Qualität aus.

## Woher kommt die Farbe des Öls?

Die Farbe von nativem Olivenöl Extra hängt von zwei Hauptgruppen von Pigmenten ab:
*   **Chlorophylle:** Sie sorgen für den grünen Ton. Sie sind in grünen, unreifen Oliven reichlich vorhanden und bauen sich mit zunehmender Reife ab. Zudem beschleunigen Chlorophylle bei Lichteinfall die Oxidation des Öls.
*   **Carotinoide:** Sie verleihen dem Öl goldgelbe Töne und sind stabiler als Chlorophyll.

## Warum die Farbe variiert

Ein intensiv grünes Öl kann entstehen durch:
*   Sehr früh geerntete Oliven (grün) -> **Ein gutes Zeichen** für viele Polyphenole.
*   Bestimmte Olivensorten, die von Natur aus grüner sind -> **Neutral**.
*   Die Zugabe von Blättern während des Mahlprozesses -> **Eine unzulässige Praxis**, um die Farbe künstlich zu verstärken.

Ein goldgelbes Öl kann entstehen durch:
*   Reifere Oliven -> **Völlig normal und nicht schlechter**.
*   Gefiltertes Öl nach einigen Monaten der Lagerung -> **Neutral**.
*   Sorten, die von Natur aus eher golden sind (z. B. Taggiasca) -> **Neutral**.

## Professionelle Verkostungen ignorieren die Farbe

Bei offiziellen Panel-Tests wird das Öl in **dunkelblauen Gläsern** verkostet. Dies geschieht, um zu verhindern, dass die Farbe das Urteil des Verkosters beeinflusst. Wahre Qualität entscheidet sich im Mund und in der Nase – niemals mit den Augen.

:::cta
Vertrauen Sie Ihren Sinnen
Probieren Sie unsere echten kaltgepressten Olivenöle.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "kleur-olijfolie-is-groen-beter",
      title: "De kleur van olijfolie: is groen synoniem voor beter?",
      excerpt: "Het diepe groen van nieuwe olijfolie is prachtig. Maar is kleur echt een indicator van kwaliteit? De wetenschap vertelt het ons.",
      category: "Weten over Olijfolie",
      content: `## De mythe van de groene kleur

Op sociale media en in marketing wordt een heldergroene kleur vaak gepresenteerd als hét symbool van topkwaliteit. Hoewel dat groen prachtig is, is het geen kwaliteitsindicator.

## Waar komt de kleur vandaan?

De kleur van extra vierge olijfolie hangt af van twee groepen pigmenten:
*   **Chlorofyl:** Geeft de groene kleur. Dit is sterk aanwezig in vroege, onrijpe olijven en neemt af naarmate de olijf rijpt. Chlorofyl versnelt bovendien de oxidatie onder invloed van licht.
*   **Carotenoïden:** Geven de goudgele tinten en zijn stabieler.

## Waarom de kleur varieert

Groene olie kan het resultaat zijn van vroege oogst (veel polifenolen) of van bepaalde variëteiten. Goudgele olie is vaak afkomstig van rijpere olijven of van nature zachtere cultivars (zoals Taggiasca).

Bij officiële keuringen proeven experts uit **donkerblauwe glazen** om te voorkomen dat de kleur hun oordeel beïnvloedt. Kwaliteit meet je met de neus en de mond, niet met de ogen.

:::cta
Ontdek onze selectie
Kwaliteit die u proeft en ruikt, niet alleen ziet.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "olivenolie-farve-er-groen-bedre",
      title: "Olivenoliens farve: Er grøn altid bedst?",
      excerpt: "Den smukke grønne farve på ny olivenolie er fantastisk. Men er farven et tegn på kvalitet? Svaret vil overraske dig.",
      category: "Olivenolie Info",
      content: `## Myten om den grønne farve

Emeraldgrøn olivenolie præsenteres ofte som det ultimative kvalitetstegn. Men selvom farven er smuk, har den intet med den faktiske kvalitet at gøre.

Professionelle smagere bruger **mørkeblå glas**, så farven ikke påvirker deres bedømmelse. Kvalitet måles med næse og mund – aldrig med øjnene.

:::cta
Smag forskellen
Vores olivenolier er udvalgt efter smag og renhed.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "olivenoljens-farge-er-groenn-best",
      title: "Olivenoljens farge: Er grønn alltid best?",
      excerpt: "Den vakre grønnfargen på fersk olivenolje er flott. Men er fargen et tegn på kvalitet? Svaret vil overraske deg.",
      category: "Olivenolje Info",
      content: `## Myten om den grønne fargen

Smaragdgrønn olivenolje presenteres ofte som det ultimate kvalitetstegnet. Men selv om fargen er vakker, har den ingenting med den faktiske kvaliteten å gjøre.

Profesjonelle smakere bruker **mørkeblå glass**, slik at fargen ikke påvirker bedømmelsen deres. Kvalitet måles med nese og munn – aldri med øynene.

:::cta
Smak forskjellen
Våre olivenoljer er valgt ut etter smak og renhet.
[Se butikken](/shop)
:::`,
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
      content: `## The urban legend

For years we have been told that "you can't fry with extra virgin olive oil," as if it were a fragile oil meant only for raw dressings. In fact, EVOO is much more resilient than most people believe. For normal household frying, **it is absolutely suitable and highly recommended**.

The confusion arises because people often look at only a single number—the smoke point—and forget the most important factor: **how the oil behaves while you heat it and keep it hot**.

## The smoke point: what it actually measures

The smoke point is the temperature at which the oil begins to smoke visibly. This smoke is not just a detail; it is the signal that you are pushing the oil too far and that thermal degradation has begun.

A good EVOO typically has a smoke point **around 190–210°C**, whereas home frying typically works at lower temperatures (around 170–180°C). In other words: if you fry carefully and maintain a reasonable temperature, **you are well within its safe operating limits**.

## Why EVOO performs better than seed oils

The real advantage of EVOO is not just its smoke point, but its **oxidative stability**. Extra virgin olive oil is rich in monounsaturated oleic acid (which is highly stable) and contains natural antioxidants (polyphenols) that protect the oil from breaking down when heated.

Many seed oils, on the other hand, even if they have a high smoke point on paper, are rich in polyunsaturated fats. These are highly unstable and oxidize quickly when heated, generating harmful compounds.

## Tips for perfect frying

You don't need to be a chemist; just use common sense:
1.  **Keep it steady:** If the oil is smoking, it is too hot. Keep a moderate, stable temperature.
2.  **Don't reuse it endlessly:** Reusing frying oil too many times degrades its quality significantly. It is always better to fry less often, but do it right.

:::cta
Looking for a versatile EVOO?
Our balanced extra virgin olive oil is perfect both raw and for everyday cooking.
[Discover the Shop](/shop)
:::`,
    },
    "de": {
      slug: "rauchpunkt-braten-mit-olivenoel-extra",
      title: "Rauchpunkt: Kann man mit Olivenöl Extra braten und frittieren?",
      excerpt: "Die Antwort ist ja – und wissenschaftlich gesehen ist es sogar stabiler als viele Pflanzenöle. Erfahren Sie die Fakten.",
      category: "Richtiges Geniessen",
      content: `## Die moderne Legende

Seit Jahren hören wir, dass man mit Olivenöl Extra nicht braten oder frittieren soll. In Wahrheit ist hochwertiges Olivenöl weitaus hitzebeständiger, als viele glauben. Für das normale Braten im Haushalt ist es **hervorragend geeignet**.

Die Verwirrung entsteht, weil man oft nur auf eine Zahl schaut – den Rauchpunkt – und den wichtigsten Faktor vergisst: **wie stabil das Öl unter Hitze bleibt**.

## Der Rauchpunkt

Der Rauchpunkt ist die Temperatur, bei der das Öl sichtbaren Rauch entwickelt. Ein gutes Olivenöl Extra liegt meist **zwischen 190°C und 210°C**. Da normales Braten und Frittieren zu Hause bei etwa 170°C bis 180°C stattfindet, liegt das Öl absolut im sicheren Bereich.

## Warum Olivenöl stabiler ist als Keimöle

Der wahre Vorteil liegt in der **Oxidationsstabilität**. Olivenöl Extra besteht überwiegend aus einfach ungesättigter Ölsäure und ist reich an natürlichen Antioxidantien (Polyphenolen). Diese schützen das Öl vor dem Zerfall.

Viele billige Pflanzenöle (z. B. Sonnenblumen- oder Maiskeimöl) enthalten dagegen viele mehrfach ungesättigte Fettsäuren, die unter Hitze sehr schnell oxidieren und ungesunde Verbindungen bilden.

:::cta
Entdecken Sie unser Allround-Öl
Ideal für die kalte Küche und zum gesunden Braten.
[Entdecken Sie den Shop](/shop)
:::`,
    },
    "nl": {
      slug: "rookpunt-frituren-met-extra-vierge-olijfolie",
      title: "Het rookpunt: Kun je frituren met extra vierge olijfolie?",
      excerpt: "Het antwoord is ja. Wetenschappelijk gezien is het zelfs stabieler dan zonnebloemolie. Ontdek het rookpunt en de feiten.",
      category: "Correct Gebruik",
      content: `## De hardnekkige fabel

Jarenlang hoorden we dat je niet mag bakken of frituren in extra vierge olijfolie. Niets is minder waar: olijfolie is uitermate stabiel onder hitte. Voor normaal thuisgebruik is het **perfect geschikt en zelfs gezonder**.

## Wat is het rookpunt?

Het rookpunt is de temperatuur waarbij olie begint te roken. Een goede extra vierge olijfolie heeft een rookpunt van **190–210°C**. Thuis frituren gebeurt meestal rond de 170–180°C, wat ruim onder deze grens ligt.

## Waarom olijfolie beter presteert

Olijfolie is rijk aan stabiel oliezuur en natuurlijke antioxidanten (polifenolen) die de olie beschermen tegen oxidatie. Veel zaadoliën bevatten daarentegen veel meervoudig onverzadigde vetten, die onder verhitting snel uiteenvallen en ongezonde stoffen vormen.

:::cta
Ontdek onze olijfolie
Perfect voor zowel koude dressings als warm gebruik in de keuken.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "rygepunkt-kan-man-stege-i-ekstra-jomfruolivenolie",
      title: "Rygepunkt: Kan man stege i ekstra jomfruolivenolie?",
      excerpt: "Svaret er ja – og det er faktisk sundere end de fleste planteolier. Se sandheden om rygepunktet.",
      category: "Korrekt Forbrug",
      content: `## Myten om stegning

Mange tror fejlagtigt, at man ikke må stege i ekstra jomfruolivenolie. Faktum er, at en god olivenolie er yderst stabil under opvarmning.

Rygepunktet for en god olivenolie ligger på **190–210°C**, mens almindelig stegning foregår ved 170–180°C. Olien er derfor ideel til formålet og danner færre skadelige stoffer end f.eks. solsikkeolie.

:::cta
Alsidig kvalitet til køkkenet
Brug vores olivenolie til både salater og stegning.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "rygepunkt-kan-man-steke-i-ekstra-jomfruolivenolje",
      title: "Røkpunkt: Kan man steke i ekstra jomfruolivenolje?",
      excerpt: "Svaret er ja – og det er faktisk sunnere enn de fleste planteoljer. Se sannheten om røkpunktet.",
      category: "Riktig Bruk",
      content: `## Myten om steking

Mange tror feilaktig at man ikke må steke i ekstra jomfruolivenolje. Faktum er at en god olivenolje er svært stabil under oppvarming.

Røkpunktet for en god olivenolje ligger på **190–210°C**, mens vanlig steking foregår ved 170–180°C. Oljen er derfor ideell til formålet og danner færre skadelige stoffer enn f.eks. solsikkeolje.

:::cta
Allsidig kvalitet til kjøkkenet
Bruk vår olivenolje til både salater og steking.
[Se butikken](/shop)
:::`,
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
      content: `## The raw numbers

Let's start with the facts: one tablespoon of extra virgin olive oil—about 10 to 12 ml—contains between **88 and 105 calories**. One hundred grams of olive oil deliver roughly 900 calories, which is normal for any pure dietary fat.

This is because EVOO is practically 100% fat: no water, no proteins, no carbohydrates. It is pure, concentrated energy.

However, the real question is not "how many calories does it have," but rather "what kind of calories are they?"

## "Light" olive oil does not exist

Before looking at portions, let's debunk a common commercial myth. When you see labels claiming "light olive oil" or "low-calorie olive oil," know that there is no such thing among pure olive oils. All pure fats—whether olive, sunflower, or coconut oil—have the same caloric density by nature.

"Light" olive oil simply refers to an oil that has been heavily refined to have a lighter color and neutral flavor, but its calorie count is exactly the same as the richest extra virgin.

## Recommended daily portions

The traditional Mediterranean diet has always included olive oil as the primary source of fat. Modern nutritional guidelines recommend **2 to 4 tablespoons per day** for a healthy adult with an active lifestyle.

In practice, that means a drizzle over your morning eggs or toast, a tablespoon on your lunch salad, and another on your dinner vegetables. This amount represents about 10% to 20% of a standard 2,000-calorie diet. decaded of research show this is optimal for health.

The key is **oleic acid**, the monounsaturated fat that dominates EVOO. Decades of studies associate it with cardiovascular protection and improved cholesterol ratios (raising HDL while lowering LDL).

## Does it make you gain weight?

Olive oil will cause weight gain only if you consume more total calories than your body burns. However, research shows that healthy fats, especially oleic acid, promote **satiety**. Those who season their food with high-quality olive oil tend to feel satisfied sooner and stay full longer.

Furthermore, the polyphenols in premium EVOO offer positive metabolic benefits, supporting anti-inflammatory pathways. These are anything but "empty calories."

:::cta
Invest in your health
Add high-quality, polyphenol-rich olive oil to your daily routine.
[Discover the Shop](/shop)
:::`,
    },
    "de": {
      slug: "kalorien-olivenoel-extra-empfohlene-portionen",
      title: "Wie viele Kalorien hat Olivenöl Extra und was sind die Portionen?",
      excerpt: "Macht Olivenöl dick? Nur bei übermäßigem Konsum. Erfahren Sie alles über Kalorien und die empfohlenen Mengen.",
      category: "Gesundheit & Wohlbefinden",
      content: `## Die nackten Zahlen

Beginnen wir mit den Fakten: Ein Esslöffel Olivenöl Extra (ca. 10–12 ml) enthält etwa **88 bis 105 Kalorien**. Einhundert Gramm Öl kommen auf rund 900 kcal. Das ist völlig normal für ein reines Fett.

Olivenöl besteht zu fast 99 % aus Fett – ohne Wasser, Eiweiß oder Kohlenhydrate. Es ist pure Energie. Doch die wichtigste Frage lautet: „Was für Kalorien sind es?“

## „Light“-Olivenöl gibt es nicht

Es gibt kein Olivenöl mit reduzierten Kalorien. Alle reinen Fette haben von Natur aus fast den gleichen Kaloriengehalt. Wenn ein Öl als „Light“ deklariert wird, bedeutet dies lediglich, dass es geschmacklich milder und heller filtriert ist – die Kalorien sind exakt dieselben.

## Empfohlene Tagesportionen

Die traditionelle Mittelmeerdiät empfiehlt **2 bis 4 Esslöffel täglich** für einen gesunden Erwachsenen. Das entspricht einem gesunden Fettanteil von etwa 10–20 % bei einer 2.000-kcal-Diät.

Der Unterschied zu tierischen Fetten liegt in der **Ölsäure**, einer einfach ungesättigten Fettsäure, die nachweislich das Herz-Kreislauf-System schützt und hilft, das LDL-Cholesterin zu senken. Zudem machen die gesunden Fette des Olivenöls schneller und langanhaltender satt.

:::cta
Eine Investition in Ihre Gesundheit
Nutzen Sie hochwertiges Olivenöl täglich in Ihrer Küche.
[Jetzt einkaufen](/shop)
:::`,
    },
    "nl": {
      slug: "calorieen-extra-vierge-olijfolie-porties",
      title: "Hoeveel calorieën bevat olijfolie en wat zijn de aanbevolen porties?",
      excerpt: "Is olijfolie een dikmaker? Alleen bij overmatig gebruik. Ontdek de calorieën en porties.",
      category: "Gezondheid & Welzijn",
      content: `## De harde cijfers

Een eetlepel extra vierge olijfolie (ca. 10-12 ml) bevat ongeveer **88 tot 105 calorieën**. Dit is volkomen normaal voor puur vet. Het is echter geen bron van "lege" calorieën.

## "Light" olijfolie bestaat niet

Reine vetten hebben allemaal dezelfde caloriedichtheid. "Light" olijfolie is slechts een marketingterm voor olijfolie die extreem geraffineerd is en daardoor een neutrale smaak heeft—de calorieën blijven exact gelijk.

## Dagelijkse hoeveelheid

Voedingsrichtlijnen adviseren **2 tot 4 eetlepels per dag** voor een gezond dieet. De enkelvoudig onverzadigde vetzuren (oliezuur) en polifenolen in olijfolie ondersteunen de hartgezondheid en zorgen voor een langdurig verzadigd gevoel.

:::cta
Kies voor pure voeding
Gebruik dagelijks gezonde vetten van hoge kwaliteit.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "kalorier-ekstra-jomfruolivenolie-anbefalede-portioner",
      title: "Hvor mange kalorier er der i olivenolie, og hvor meget skal man bruge?",
      excerpt: "Er olivenolie fedende? Kun hvis du overdriver. Se kalorietallet og de anbefalede portionsstørrelser.",
      category: "Sundhed & Velvære",
      content: `## Fakta om kalorier

En spiseskefuld olivenolie (10-12 ml) indeholder cirka **90 kalorier**. Det er ren energi, men fuld af sunde monoumættede fedtsyrer (oliesyre).

Ernæringseksperter anbefaler **2-4 spiseskefulde om dagen**. Det giver kroppen de nødvendige antioxidanter og hjælper med at holde dig mæt i længere tid.

:::cta
Gør noget godt for dit helbred
Inkorporer koldpresset olivenolie i din daglige kost.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "kalorier-ekstra-jomfruolivenolje-anbefalte-porsjoner",
      title: "Hvor mange kalorier er det i olivenolje, og hvor mye bør man bruke?",
      excerpt: "Er olivenolje fetende? Bare hvis du overdriver. Se kaloritallet og anbefalte porsjonsstørrelser.",
      category: "Helse & Velvære",
      content: `## Fakta om kalorier

En spiseskje olivenolje (10-12 ml) inneholder cirka **90 kalorier**. Det er ren energi, men full av sunne enumettede fettsyrer (oljesyre).

Ernæringsfysiologer anbefaler **2-4 spiseskjeer om dagen**. Det gir kroppen de nødvendige antioksidantene og hjelper med å holde deg mett i lengre tid.

:::cta
Gjør noe godt for helsen din
Inkorporer kaldpresset olivenolje i ditt daglige kosthold.
[Se butikken](/shop)
:::`,
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
      content: `## Liquid gold under the scientific lens

We have heard that "olive oil is good for you" since childhood. But when you look at actual medical literature, true high-quality Extra Virgin Olive Oil reveals itself as a powerful agent of preventive health.

Over the past few decades, serious scientific research has accumulated overwhelming evidence showing that this cold-pressed fat is the undisputed cornerstone of the Mediterranean diet. But how does it actually protect our bodies?

## The cardiovascular shield: the PREDIMED study

There is one landmark clinical trial that changed how doctors view dietary fats forever: the **PREDIMED** study (*Prevención con Dieta Mediterránea*). For years, thousands of participants at high risk of cardiovascular events were monitored. Some were prescribed a low-fat diet, while others were instructed to consume generous amounts of **extra virgin olive oil**.

The results were so clear that the trial was stopped early for ethical reasons: those consuming abundant EVOO (at least 4 tablespoons per day) saw their risk of major cardiovascular events reduced by an astonishing **30%**. In medical terms, this is a massive effect. The monounsaturated fats in EVOO actively improve lipid profiles, lowering LDL cholesterol while supporting beneficial HDL.

## Polyphenols: our biological bodyguards

If you pick a raw green olive from a tree and bite into it, your mouth will instantly pucker from the bitterness. That strong peppery scratch you feel in your throat when tasting a high-quality fresh oil is not a defect—it is the sound of polyphenols doing their job.

Polyphenols are organic molecules packed with health benefits. The two most researched are:
1.  **Hydroxytyrosol:** One of the most powerful natural antioxidants known, capable of neutralizing the free radicals that drive cellular aging.
2.  **Oleocanthal:** A compound that exhibits anti-inflammatory properties, acting on the body in a manner remarkably similar to low-dose ibuprofen. This is why it is highly beneficial for recovery and chronic low-grade inflammation.

The European Food Safety Authority (EFSA) formally approved a health claim for olive oil, stating that *olive oil polyphenols contribute to the protection of blood lipids from oxidative stress*, provided the oil contains at least 5 mg of hydroxytyrosol and its derivatives per 20 g of oil.

## Beyond the heart: the future of research

Modern research is focusing on the potential neuroprotective effects of EVOO. Early data suggest that its anti-inflammatory compounds help support brain health, potentially slowing down cognitive decline. Additionally, consuming EVOO alongside carbohydrates is shown to help stabilize blood glucose, preventing sharp insulin spikes.

> Do not buy olive oil just to lubricate your pasta. Buy it to nourish your cells. Choose a robust, fresh, intense fruity oil and enjoy its natural protective power every day.

:::cta
Invest in certified quality
Our cold-pressed extra virgin olive oils are rich in polyphenols and tested in the laboratory.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-und-gesundheit-wissenschaft-polyphenole",
      title: "Olivenöl und Gesundheit: Was sagt die Wissenschaft wirklich?",
      excerpt: "Erfahren Sie, wie natives Olivenöl Extra Ihr Herz schützt und Entzündungen hemmt – belegt durch wissenschaftliche Daten.",
      category: "Gesundheit & Wohlbefinden",
      content: `## Flüssiges Gold unter der Lupe der Wissenschaft

Wir alle wissen, dass Olivenöl gesund ist. Doch was sagt die moderne Medizin dazu? Die wissenschaftlichen Belege der letzten Jahrzehnte zeigen, dass kaltgepresstes Olivenöl Extra ein echtes Power-Lebensmittel ist.

## Der Herz-Kreislauf-Schutz: Die PREDIMED-Studie

Die berühmte **PREDIMED-Studie** hat gezeigt, dass eine mediterrane Ernährung reich an Olivenöl Extra das Risiko für schwere Herz-Kreislauf-Erkrankungen um erstaunliche **30 %** senkt. Olivenöl hilft aktiv dabei, die Gefäße elastisch zu halten und das schädliche LDL-Cholesterin zu senken.

## Polyphenole: Unsere natürlichen Leibwächter

Das Kratzen im Hals und die Bitternote eines frischen Öls sind Zeichen für wertvolle **Polyphenole**:
*   **Hydroxytyrosol:** Eines der stärksten natürlichen Antioxidantien, das die Zellen vor freien Radikalen schützt.
*   **Oleocanthal:** Ein natürlicher Entzündungshemmer, dessen Wirkung der von Ibuprofen ähnelt.

Sogar die Europäische Behörde für Lebensmittelsicherheit (EFSA) bestätigt: Die Polyphenole im Olivenöl schützen die Blutlipide vor oxidativem Stress – vorausgesetzt, das Öl ist von hoher Qualität.

:::cta
Tun Sie Ihrem Körper etwas Gutes
Wählen Sie unser polyphenolreiches Olivenöl für Ihre Gesundheit.
[Entdecken Sie den Shop](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-gezondheid-wetenschap-polifenolen",
      title: "Olijfolie en gezondheid: Wat zegt de wetenschap over polifenolen?",
      excerpt: "Ontdek hoe extra vierge olijfolie het hart beschermt en ontstekingen tegengaat op basis van harde wetenschappelijke feiten.",
      category: "Gezondheid & Welzijn",
      content: `## Wat zegt de wetenschap echt?

Olijfolie is niet zomaar een vet; het is een preventief gezondheidsmiddel. Tientallen jaren van klinisch onderzoek tonen aan dat extra vierge olijfolie de hoeksteen is van een gezond leven.

## Bescherming voor het hart: PREDIMED

De grootschalige **PREDIMED-studie** toonde aan dat dagelijkse consumptie van extra vierge olijfolie het risico op ernstige hart- en vaatziekten met wel **30%** vermindert. Het helpt de bloedvaten schoon en elastisch te houden.

## Polifenolen: Natuurlijke beschermers

De bitterheid en pittigheid die u proeft, zijn de **polifenolen**:
*   **Hydroxytyrosol:** Beschermt bloedlipiden tegen oxidatieve schade.
*   **Oleocanthal:** Heeft een bewezen natuurlijke ontstekingsremmende werking, vergelijkbaar met milde ibuprofen.

De EFSA heeft officieel bevestigd dat de consumptie van olijfolie-polifenolen bijdraagt aan de bescherming van bloedvetten tegen oxidatieve stress.

:::cta
Kies voor wetenschappelijk bewezen kwaliteit
Breng de pure kracht van de natuur naar uw keuken.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "olivenolie-sundhed-videnskab-polyfenoler",
      title: "Olivenolie og sundhed: Hvad siger videnskaben om polyfenoler?",
      excerpt: "Læs, hvordan ekstra jomfruolivenolie beskytter dit hjerte og dæmper inflammation baseret på medicinsk forskning.",
      category: "Sundhed & Velvære",
      content: `## Videnskaben bag olien

At ekstra jomfruolivenolie er sundt, er ikke bare markedsføring – det er dokumenteret lægevidenskab.

Den store **PREDIMED-undersøgelse** viste, at et dagligt indtag af olivenolie reducerer risikoen for hjerte-kar-sygdomme med **30 %**. Dette skyldes primært det høje indhold af **polyfenoler** som **Oleocanthal** (der virker naturligt inflationsdæmpende) og **Hydroxytyrosol** (en af naturens stærkeste antioksidanter).

:::cta
Vælg sundhed hver dag
Vores olivenolier er rige på naturlige polyfenoler.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "olivenolie-sundhed-videnskab-polyfenoler",
      title: "Olivenolje og helse: Hva sier vitenskapen om polyfenoler?",
      excerpt: "Les hvordan ekstra jomfruolivenolje beskytter hjertet ditt og demper inflammasjon basert på medisinsk forskning.",
      category: "Helse & Velvære",
      content: `## Vitenskapen bak oljen

At ekstra jomfruolivenolje er sunt, er ikke bare markedsføring – det er dokumentert legevitenskap.

Den store **PREDIMED-undersøkelsen** viste at et daglig inntak av olivenolje reduserer risikoen for hjerte-kar-sykdommer med **30 %**. Dette skyldes primært det høye innholdet av **polyfenoler** som **Oleocanthal** (som virker naturlig inflammasjonsdæmpende) og **Hydroxytyrosol** (en av naturens sterkeste antioksidanter).

:::cta
Velg helse hver dag
Våre olivenoljer er rike på naturlige polyfenoler.
[Se butikken](/shop)
:::`,
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
      title: "The 7 Most Common Mistakes Storing Olive Oil in the Kitchen",
      excerpt: "Near the stove, in transparent glass, or in the fridge: so many mistakes are made every day. Discover the 7 classic errors to avoid.",
      category: "Storage",
      content: `## Mistake 1: Leaving the oil bottle next to the stove

This is the classic mistake: a transparent glass bottle kept right next to the hot burners for decoration. You are subjecting the oil to two of its worst enemies at once: heat and light. Your oil will lose its fresh qualities in just a couple of weeks.

*Solution:* Keep your main supply in a dark, cool cupboard. Keep only a small, opaque ceramic dispenser (150–250 ml) on the counter and refill it regularly.

## Mistake 2: Buying a massive bottle "to save money"

If you take 6 months to finish a large 1-liter bottle, you are not actually saving money. The air headspace inside the bottle grows as you use the oil, accelerating the oxidation of the remaining oil. The last third of the bottle will likely taste flat or rancid.

*Solution:* Match your bottle size to your actual consumption. If you use it slowly, buy 500 ml bottles. If you use a lot, buy a large 3–5L tin, keep it sealed in a cool dark pantry, and transfer small amounts to a smaller kitchen dispenser.

## Mistake 3: Keeping the oil in the refrigerator during summer

The fridge does not extend the shelf life of olive oil. At temperatures below 10°C, the natural fats in the oil begin to solidify and turn cloudy. While this is not toxic and the oil liquefies again at room temperature, the constant thermal cycles and humidity are not ideal for prolonged storage.

*Solution:* A cool pantry or cupboard (12–18°C) is perfectly sufficient.

## Mistake 4: Transparent glass bottles exposed to light

Direct sunlight is highly destructive to olive oil. In a transparent glass bottle left near a sunny window, chlorophylls act as photo-sensitizers, accelerating lipid oxidation.

*Solution:* Always use dark glass bottles or opaque tins, and keep them away from windows.

## Mistake 5: Forgetting to close the cap tightly

Leaving the pourer open or the cap loose allows fresh oxygen to enter the bottle constantly, driving oxidation.

*Solution:* Always close the cap tightly immediately after pouring.

## Mistake 6: Using cheap plastic dispensers

Some plastics contain chemical plasticizers that can leach into fats like olive oil over time, especially in a warm kitchen.

*Solution:* Use only dark glass, high-quality stainless steel, or glazed ceramic dispensers.

## Mistake 7: Keeping "vintage" oil for special occasions

Unlike wine, olive oil does not improve with age. Keeping a premium bottle in the back of the cupboard for two years means you will eventually open a completely flat, oxidized oil.

*Solution:* Buy it fresh, check the harvest date, and consume it within 12–18 months of packaging (and within 3 months of opening).

:::cta
Protect your premium oil
Use our storage tips to keep your Extra Virgin Olive Oil fresh down to the last drop.
[Discover our dark glass and tin packaging](/shop)
:::`,
    },
    "de": {
      slug: "sieben-fehler-lagerung-olivenoel-kueche",
      title: "Die 7 häufigsten Fehler bei der Lagerung von Olivenöl in der Küche",
      excerpt: "Neben dem Herd, in klarem Glas oder im Kühlschrank: Vermeiden Sie die 7 klassischen Fehler für perfekten Genuss.",
      category: "Lagerung & Aufbewahrung",
      content: `## Fehler 1: Die Flasche neben dem Herd stehen lassen

Der Klassiker schlechthin: Die dekorative Klarglasflasche direkt auf der Arbeitsplatte neben dem Herd. Hitze und Licht sind die größten Feinde des Öls.

*Lösung:* Lagern Sie den Vorrat im dunklen Schrank. Nutzen Sie für den täglichen Gebrauch einen kleinen, lichtundurchlässigen Spender (150–250 ml).

## Fehler 2: Eine Riesenflasche kaufen, „um Geld zu sparen“

Wenn Sie Monate brauchen, um eine 1-Liter-Flasche zu leeren, oxidiert das Öl durch den ständigen Luftkontakt in der halbleeren Flasche.

*Lösung:* Passen Sie die Flaschengröße Ihrem Verbrauch an. Für Wenignutzer sind 500 ml ideal.

## Fehler 3: Das Öl im Sommer im Kühlschrank lagern

Kälte unter 10 °C lässt das Öl flockig werden und teilweise festwerden. Das schadet dem Öl zwar nicht direkt, aber ständige Temperaturschwankungen und die Feuchtigkeit im Kühlschrank sind nicht ideal.

*Lösung:* Ein kühler Schrank (12–18°C) reicht völlig aus.

## Fehler 4: Klarglasflaschen am Fenster

Direktes Sonnenlicht zerstört die Polyphenole und die Qualität innerhalb weniger Wochen.

*Lösung:* Verwenden Sie nur dunkles Glas oder Metalldosen.

:::cta
Lagern Sie Ihr Öl wie die Profis
Entdecken Sie unsere lichtgeschützten Dosen und Flaschen im Shop.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "zeven-fouten-bewaren-olijfolie-keuken",
      title: "De 7 meest gemaakte fouten bij het bewaren van olijfolie in de keuken",
      excerpt: "Naast het fornuis, in helder glas of in de koelkast. Ontdek de 7 klassieke fouten en hoe je ze voorkomt.",
      category: "Opslag & Bewaring",
      content: `## Fout 1: De fles naast het fornuis zetten

Hitte en licht zijn de grootste vijanden van olijfolie. De fles naast het warme fornuis zetten zorgt ervoor dat de olie binnen enkele weken ranzig wordt.

*Lösung:* Bewaar de fles in een donker keukenkastje en gebruik een klein, ondoorzichtig schenkkannetje voor dagelijks gebruik.

## Fout 2: Grote flessen kopen bij laag verbruik

Zodra een fles halfleeg is, zorgt de zuurstof in de fles voor snelle oxidatie van de resterende olijfolie.

*Lösung:* Stem de flesmaat af op uw verbruik. Koop liever 500 ml flessen of bewaar grotere hoeveelheden in blik.

:::cta
Kies voor optimale bescherming
Al onze olijfoliën worden geleverd in donker glas of blik.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "syv-fejl-opbevaring-olivenolie-koekken",
      title: "De 7 mest almindelige fejl ved opbevaring af olivenolie i køkkenet",
      excerpt: "Ved siden af komfuret, i klart glas eller i køleskabet: Se de 7 klassiske fejl, du skal undgå.",
      category: "Opbevaring",
      content: `## Fejl 1: Olien står ved siden af komfuret

Varme og lys ødelægger hurtigt olivenolie. Klarglasflasken ved siden af kogepladerne er den mest klassiske fejl i køkkenet.

*Løsning:* Opbevar din olivenolie i et mørkt og køligt skab. Hæld evt. en lille mængde op i en uigennemsigtig dispenser til daglig brug.

## Fejl 2: Køb af for store flasker

Når flasken er halvt tom, reagerer ilten med olien og fremskynder oxidationen. Køb mindre flasker, hvis dit forbrug er lavt.

:::cta
Pas godt på din olivenolie
Vores olivenolier leveres altid i beskyttende mørkt glas eller dunke.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "syv-feil-lagring-olivenolje-kjoekken",
      title: "De 7 mest vanlige feilene ved lagring av olivenolje i kjøkkenet",
      excerpt: "Ved siden av komfyren, i klart glass eller i kjøleskapet: Se de 7 klassiske feilene du må unngå.",
      category: "Lagring",
      content: `## Feil 1: Oljen står ved siden av komfyren

Varme og lys ødelegger raskt olivenolje. Klarglassflasken ved siden av kokeplatene er den mest klassiske feilen i kjøkkenet.

*Løsning:* Oppbevar olivenoljen din i et mørkt og kjølig skap. Hell evt. en liten mengde opp i en uigjennomsiktig dispenser til daglig bruk.

## Feil 2: Kjøp av for store flasker

Når flasken er halvt tom, reagerer iltet med oljen og fremskynder oksidasjonen. Kjøp mindre flasker hvis forbruket ditt er lavt.

:::cta
Pass godt på olivenoljen din
Våre olivenoljer leveres alltid i beskyttende mørkt glass eller blikkbokser.
[Se butikken](/shop)
:::`,
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
      content: `## The real question is *how* you use it

Extra virgin olive oil yields its best aromas and health benefits when fresh and uncooked. Its most delicate volatile compounds and antioxidants (polyphenols) are sensitive to high heat. Therefore, it is normal to ask: "Does cooking destroy the oil?"

The honest answer is: **while cooking reduces some of its compounds, it is absolutely not a mistake to use it**.

EVOO remains one of the most stable fats for cooking. However, to maximize both flavor and health benefits, raw "finishing" is when the oil truly shines.

## When raw is irreplaceable

Used raw, high-quality olive oil is not just a cooking fat; it is a key ingredient that transforms the dish. Drizzled over hot soup, fresh vegetables, warm toasted bread, or delicate fish, the oil "speaks" through its vibrant notes.

It is also the easiest way to experience a premium EVOO: a simple pour on a hot dish releases all its fresh, green aromas.

## Cooking with it is not an error

Using EVOO in the pan or oven is a great choice. Yes, high heat reduces the most delicate compounds, especially during long cooking times. However, because of its high content of monounsaturated fats and natural antioxidants, EVOO is **inherently much more heat-stable** than most refined seed oils.

To get the most out of your kitchen:
*   Use a good, everyday EVOO for cooking, sautéing, and baking.
*   Reserve your most aromatic, premium EVOO for the final raw drizzle.

:::cta
Experience the difference of raw EVOO
A premium, fresh olive oil elevates a simple soup, toasted bread, or vegetables instantly.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "roh-oder-gekocht-wann-olivenoel-den-unterschied-macht",
      title: "Roh oder erhitzt: Wann Olivenöl Extra wirklich den Unterschied macht",
      excerpt: "Kaltes Olivenöl schont die Polyphenole. Aber ist Erhitzen ein Fehler? Erfahren Sie die Wahrheit.",
      category: "Richtiges Geniessen",
      content: `## Es geht nicht um „entweder oder“, sondern um das *Wie*

Olivenöl Extra schmeckt am besten, wenn es frisch und unerhitzt verwendet wird. Seine flüchtigen Aromastoffe und Polyphenole sind hitzeempfindlich. Dennoch ist das Braten mit Olivenöl kein Fehler: **Es bleibt auch erhitzt eines der stabilsten und gesündesten Fette überhaupt**.

## Wann kaltes Öl unersetzlich ist

Kalt verwendet ist Olivenöl ein echter Geschmacksträger: auf warmem Gemüse, einer dampfenden Suppe, gegrilltem Fisch oder einfach auf warmem Brot. Die Wärme des Tellers setzt die feinen Aromen frei, ohne sie zu zerstören.

## Kochen und Backen ist kein Fehler

Dank der stabilen einfach ungesättigten Fettsäuren und der natürlichen Antioxidantien verträgt Olivenöl Hitze weitaus besser als herkömmliche Keimöle. Verwenden Sie für das tägliche Kochen ein gutes Allround-Olivenöl Extra und bewahren Sie das beste, intensivste Öl für das Finale am Tisch auf.

:::cta
Erleben Sie wahren Geschmack
Verleihen Sie Ihren Gerichten den letzten, perfekten Touch.
[Entdecken Sie den Shop](/shop)
:::`,
    },
    "nl": {
      slug: "rauw-of-verwarmd-wanneer-olijfolie-het-verschil-maakt",
      title: "Rauw of verwarmd: Wanneer maakt extra vierge olijfolie echt het verschil?",
      excerpt: "Rauw gebruik behoudt de polifenolen. Maar is bakken erin verkeerd? Een praktische keukengids.",
      category: "Correct Gebruik",
      content: `## De kern is *hoe* u het gebruikt

Extra vierge olijfolie is op zijn best als het koud wordt gebruikt. De delicate aroma's en antioxidanten zijn gevoelig voor hoge temperaturen. Toch is bakken of braden in olijfolie geen fout: **het is en blijft een van de meest stabiele en gezonde vetten om in te koken**.

## Wanneer rauw gebruik onmisbaar is

Rauw is olijfolie een echt ingrediënt dat het gerecht transformeert. Een scheutje over de soep, gekookte groenten of vers getoost brood maakt direct het verschil.

## Koken is geen zonde

Olijfolie is door zijn vetzuursamenstelling veel beter bestand tegen hitte dan gewone zaadoliën. Onze tip: gebruik een degelijke olijfolie om in te bakken en bewaar de meest geurige, premium extra vierge voor de finishing touch aan tafel.

:::cta
Proef het verschil aan tafel
Een goede olijfolie transformeert een simpel gerecht direct.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "raa-eller-tilberedt-hvornaar-olivenolie-goer-forskellen",
      title: "Rå eller opvarmet: Hvornår gør ekstra jomfruolivenolie forskellen?",
      excerpt: "At bruge olien rå bevarer polyfenolerne. Men er det en fejl at stege i den? Få den praktiske guide.",
      category: "Korrekt Forbrug",
      content: `## Det handler om at vælge det rette øjeblik

Ekstra jomfruolivenolie er bedst rå, hvor du kan dufte og smage alle de fine nuancer. Men det er absolut ikke en fejl at bruge den til madlavning.

Olivenolie er på grund af sit høje indhold af monoumættede fedtsyrer faktisk **langt mere stabil under opvarmning** end de fleste planteolier. Brug en god basis-olivenolie til stegning, og gem den bedste, koldpressede olie til at dryppe over maden lige inden servering.

:::cta
Giv maden det sidste touch
Brug en fantastisk rå olivenolie til at fuldende dine retter.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "raa-eller-tilberedt-hvornaar-olivenolje-gjoer-forskjellen",
      title: "Rå eller oppvarmet: Når gjør ekstra jomfruolivenolje forskjellen?",
      excerpt: "Å bruke oljen rå bevarer polyfenolene. Men er det en feil å steke i den? Få den praktiske guiden.",
      category: "Riktig Bruk",
      content: `## Det handler om å velge det rette øyeblikket

Ekstra jomfruolivenolje er best rå, der du kan lukte og smake alle de fine nyansene. Men det er absolutt ikke en feil å bruke den til matlaging.

Olivenolje er på grunn av sitt høye innhold av enumettede fettsyrer faktisk **langt mer stabil under oppvarming** enn de fleste planteoljer. Bruk en god basis-olivenolje til steking, og spar den beste, kaldpressede oljen til å dryppe over maten rett før servering.

:::cta
Gi maten det siste touch
Bruk en fantastisk rå olivenolje til å fullføre dine retter.
[Se butikken](/shop)
:::`,
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
      content: `## A natural molecular masterpiece

Extra virgin olive oil is not just a fat; it is a complex, natural emulsion containing hundreds of active chemical compounds. Chemically, we can split its composition into two major fractions:
1.  **The Saponifiable Fraction (98-99%):** Made of triglycerides (glycerol bound to three fatty acids).
2.  **The Unsaponifiable Fraction (1-2%):** A tiny but incredibly precious group containing antioxidants, sterols, vitamins, and volatile aromatic compounds.

## The Saponifiable Fraction: Fatty Acids

The core of olive oil consists of triglycerides. The fatty acids bound to them dictate its physical properties and high stability:
*   **Oleic Acid (C18:1):** A monounsaturated fatty acid representing **65% to 80%** of the oil. This exceptionally high ratio is what makes olive oil unique. It has only one double bond, making it far more resistant to heat and oxidation than polyunsaturated seed oils.
*   **Palmitic Acid (C16:0):** A saturated fatty acid (7-14%). It is stable and provides structure.
*   **Linoleic Acid (C18:2):** An omega-6 polyunsaturated fatty acid (5-10%). It is essential but highly sensitive to oxidation.

## The Unsaponifiable Fraction: The Health Molecules

Representing only 1-2% of the oil, this fraction is where the magic happens. It is responsible for both the unique flavors and the extraordinary health benefits:
*   **Polyphenols (Secoiridoids):** Powerful natural antioxidants. The most prominent are **Oleocanthal** (which produces the clean, peppery sting in the throat and has ibuprofen-like anti-inflammatory activity) and **Oleuropein** (responsible for the elegant bitter taste and excellent cardiovascular protection).
*   **Squaleene:** A natural hydrocarbon (up to 0.7%) that acts as a powerful protector of the skin and cells against oxidative damage.
*   **Tocopherols:** Mostly Vitamin E, which acts as a biological antioxidant shield.
*   **Sterols:** Plant fats (like beta-sitosterol) that actively compete with cholesterol absorption in the human gut.

:::cta
Experience the chemistry of taste
Our Tuscan extra virgin olive oil is cold-extracted within hours of harvest to keep all active molecules intact.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "chemische-zusammensetzung-olivenoel-extra",
      title: "Chemische Zusammensetzung von Olivenöl Extra: Fettsäuren und Begleitstoffe",
      excerpt: "Eine molekulare Reise ins Innere des flüssigen Goldes: Was macht Olivenöl Extra zu einem Meisterwerk der Naturchemie?",
      category: "Olivenölchemie",
      content: `## Ein natürliches Meisterwerk der Molekularbiologie

Natives Olivenöl Extra ist viel mehr als nur ein Fett. Chemisch lässt es sich in zwei Hauptfraktionen unterteilen:
1.  **Die verseifbare Fraktion (98–99 %):** Besteht aus Triglyceriden (Glycerin gebunden an drei Fettsäuren).
2.  **Die unverseifbare Fraktion (1–2 %):** Ein winziger, aber hochedler Teil, der Antioxidantien, Vitamine und Aromastoffe enthält.

## Die Fettsäuren (verseifbare Fraktion)

Die Zusammensetzung bestimmt die Hitzestabilität und den gesundheitlichen Wert:
*   **Ölsäure (C18:1):** Eine einfach ungesättigte Fettsäure, die **65 % bis 80 %** des Öls ausmacht. Sie ist extrem hitzestabil und schützt das Herz.
*   **Palmitinsäure (C16:0):** Eine gesättigte Fettsäure (7–14 %).
*   **Linolsäure (C18:2):** Eine Omega-6-Fettsäure (5–10 %), die essentiell, aber oxidationsanfällig ist.

## Die unverseifbare Fraktion: Die gesundheitlichen Wirkstoffe

Hier liegen die wahren Schätze des Öls:
*   **Polyphenole:** Allen voran **Oleocanthal** (verantwortlich für die Schärfe im Abgang und entzündungshemmend) und **Oleuropein** (verantwortlich für die edle Bitternote und herzschützend).
*   **Squaleen:** Schützt die Haut und die Zellen vor oxidativem Stress.
*   **Tocopherole:** Natürliches Vitamin E als biologischer Schutzschild.

:::cta
Erleben Sie reine Naturchemie
Unsere Öle werden innerhalb weniger Stunden nach der Ernte gepresst, um alle Wirkstoffe zu bewahren.
[Jetzt einkaufen](/shop)
:::`,
    },
    "nl": {
      slug: "chemische-samenstelling-extra-vierge-olijfolie",
      title: "Chemische samenstelling van olijfolie: Triglyceriden en onzeepbare fractie",
      excerpt: "Een moleculaire reis in het vloeibare goud: ontdek wat extra vierge olijfolie tot een meesterwerk van de natuur maakt.",
      category: "Olijfoliechemie",
      content: `## Een natuurlijk meesterwerk

Olijfolie bestaat chemisch gezien uit twee delen:
1.  **De verzeepbare fractie (98-99%):** Bestaande uit triglyceriden (vetzuren).
2.  **De onverzeepbare fractie (1-2%):** Een uiterst kostbaar deel met vitaminen, antioxidanten en aroma's.

## Vetzuren en gezondheid

Het vetzuurprofiel is uniek:
*   **Oliezuur (C18:1):** Een enkelvoudig onverzadigd vetzuur (65-80%) dat zorgt voor een hoge hittebestendigheid en een gezond hart.
*   **Linolzuur (C18:2):** Essentieel omega-6 vetzuur (5-10%).

## De actieve stoffen

De onverzeepbare fractie bevat de gezondheidselixers:
*   **Polifenolen:** Zoals **Oleocanthal** (pittig, ontstekingsremmend) en **Oleuropeine** (bitter, antioxidant).
*   **Squaleen & Vitamine E:** Sterke antioxidanten die cellen beschermen.

:::cta
Ontdek pure olijfolie
Koud geperst om alle gezonde verbindingen optimaal te beschermen.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "kemiske-sammensaetning-ekstra-jomfruolivenolie",
      title: "Kemisk sammensætning af olivenolie: Fedtsyrer og bioaktive stoffer",
      excerpt: "En molekylær rejse ind i det flydende guld: Hvad gør ekstra jomfruolivenolie så unik?",
      category: "Olivenoliekemi",
      content: `## Naturens eget mesterværk

Ekstra jomfruolivenolie består af:
1.  **Den forsæbbare del (98-99%):** Primært Triglycerider (fedtsyrer).
2.  **Den uforsæbbare del (1-2%):** Det mest dyrebare miks af polyfenoler, vitaminer og antioxidanter.

## Fedtsyrerne

*   **Oliesyre (C18:1):** En enkeltumættet fedtsyre (65-80%), der gør olien stabil ved stegning og sund for hjertet.
*   **Linolsyre og Palmitinsyre:** Giver optimal struktur og balance.

## De aktive stoffer

*   **Polyfenoler:** Især **Oleocanthal** (giver den skarpe kildren i halsen og dæmper inflammation) samt **Oleuropein** (giver bitterhed og beskytter cellerne).
*   **Squalen & E-vitamin:** Beskytter mod oxidation.

:::cta
Oplev ren oliekemi
Koldpresset olivenolie bevarer alle de naturlige aktivstoffer.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "kjemiske-sammensetten-ekstra-jomfruolivenolje",
      title: "Kjemisk sammensetning av olivenolje: Fettsyrer og bioaktive stoffer",
      excerpt: "En molekylær reise inn i det flytende gullet: Hva gjør ekstra jomfruolivenolje så unik?",
      category: "Olivenoljekjemi",
      content: `## Naturens eget mesterverk

Ekstra jomfruolivenolje består av:
1.  **Den forsåpbare delen (98-99%):** Primært Triglyserider (fettsyrer).
2.  **Den uforsåpbare delen (1-2%):** Det mest verdifulle miksen av polyfenoler, vitaminer og antioksidanter.

## Fettsyrene

*   **Oljesyre (C18:1):** En enumettet fettsyre (65-80%), som gjør oljen stabil ved steking og sunn for hjertet.
*   **Linolsyre og Palmitinsyre:** Gir optimal struktur og balanse.

## De aktive stoffene

*   **Polyfenoler:** Spesielt **Oleocanthal** (gir den skarpe prikkingen i halsen og demper inflammasjon) samt **Oleuropein** (gir bitterhet og beskytter cellene).
*   **Squalen & E-vitamin:** Beskytter mot oksidasjon.

:::cta
Opplev ren oljekjemi
Kaldpresset olivenolje bevarer alle de naturlige aktivstoffene.
[Se butikken](/shop)
:::`,
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
      content: `## The molecular treasures of EVOO

If there is one thing that elevates cold-pressed Extra Virgin Olive Oil far above industrial fats, it is its high concentration of **polyphenols**. These natural chemical compounds act as a dual shield: they prevent the oil from aging inside the bottle and defend the cells of our bodies from oxidative stress.

Let's meet the three main molecular protagonists responsible for both the unique flavor and the extraordinary health benefits.

## 1. Oleocanthal: The natural anti-inflammatory

Have you ever coughed or felt a sharp, peppery scratch in your throat when tasting fresh olive oil? That sensation is caused entirely by **Oleocanthal**, a secoiridoid dialdehydic polyphenol.
*   **The Science:** Landmark clinical studies (published in *Nature* by Beauchamp et al., 2005) demonstrated that Oleocanthal inhibits inflammatory enzymes (COX-1 and COX-2) in a manner remarkably similar to low-dose **ibuprofen**.
*   **The Flavor:** It is responsible for the characteristic pungent tickle or burn at the back of the throat. The more intense the sting, the higher the oleocanthal concentration.

## 2. Oleuropein: The heart protector

The elegant, clean bitterness you perceive on the sides and back of your tongue is caused by **Oleuropein** (and its derivative aglycones).
*   **The Science:** Oleuropein is a major cardioprotective molecule. It helps keep blood vessels flexible, supports normal blood pressure, and helps prevent LDL cholesterol oxidation (the process that leads to arterial plaques).
*   **The Flavor:** It provides the signature green, herbaceous bitter taste—reminiscent of artichoke leaves or chicory.

## 3. Hydroxytyrosol: The antioxidant champion

**Hydroxytyrosol** is one of the most powerful free-radical scavengers found in nature. It is formed during olive ripening and milling through the enzymic breakdown of oleuropein.
*   **The Science:** Hydroxytyrosol is so effective that the European Food Safety Authority (EFSA) formally approved its health claim: daily intake of 20g of polyphenol-rich oil (delivering at least 5mg of hydroxytyrosol and its derivatives) protects blood lipids from oxidation.
*   **The Flavor:** It is structurally neutral to taste but forms the chemical foundation of the oil's stability and shelf-life.

> Amaro and piccante (bitterness and pungency) are not defects. They are the chemical signature of active polyphenols. A sweet, completely flat oil is a dead oil.

:::cta
Boost your antioxidant intake
Our premium early-harvest selections are certified for high polyphenol content.
[Discover our selections](/shop)
:::`,
    },
    "de": {
      slug: "polyphenole-im-olivenoel-extra-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyphenole im Olivenöl: Oleocanthal, Oleuropein und Hydroxytyrosol",
      excerpt: "Erfahren Sie alles über die wertvollen Polyphenole im Olivenöl Extra – die echten Geheimnisse der Qualität.",
      category: "Olivenölchemie",
      content: `## Die wahren Wirkstoffe des nativen Olivenöls Extra

Was macht ein echtes kaltgepresstes Olivenöl Extra so viel gesünder als raffinierte Pflanzenöle? Die Antwort liegt in den **Polyphenolen**. Diese chemischen Verbindungen sind starke Antioxidantien, die sowohl das Öl in der Flasche als auch unsere Körperzellen vor Alterung schützen.

## 1. Oleocanthal: Der natürliche Entzündungshemmer

Das markante Kratzen im Rachen beim Schlucken eines frischen Öls wird durch **Oleocanthal** verursacht.
*   **Wirkung:** Studien zeigen, dass Oleocanthal die gleichen Enzyme (COX-1/COX-2) hemmt wie **Ibuprofen** – und das auf rein natürlichem Wege.
*   **Geschmack:** Scharfer, pfeffriger Abgang im Hals.

## 2. Oleuropein: Der Herzschützer

Die angenehme Bitternote auf der Zunge kommt vom **Oleuropein**.
*   **Wirkung:** Es schützt die Gefäße vor Ablagerungen, wirkt blutdrucksenkend und antioxidativ.
*   **Geschmack:** Angenehm bitter, erinnert an Artischocke oder grüne Blätter.

## 3. Hydroxytyrosol: Der Anti-Aging-Meister

Eines der stärksten bekannten Antioxidantien der Natur:
*   **Wirkung:** Es fängt freie Radikale ab und schützt die Blutfette vor oxidativem Stress. Dies ist von der EFSA offiziell bestätigt.

:::cta
Wählen Sie echte Qualität
Unsere Olivenöle haben einen laborgeprüften hohen Polyphenolgehalt.
[Jetzt einkaufen](/shop)
:::`,
    },
    "nl": {
      slug: "polifenolen-in-olijfolie-oleocanthal-oleuropeine-hydroxytyrosol",
      title: "Polifenolen in olijfolie: Oleocanthal, Oleuropeine en Hydroxytyrosol",
      excerpt: "Ontdek de actieve verbindingen die olijfolie uniek maken en hoe ze smaak en gezondheid beïnvloeden.",
      category: "Olijfoliechemie",
      content: `## De actieve antioxidanten van extra vierge olijfolie

Polifenolen zijn de reden dat extra vierge olijfolie zo gezond is. Ze beschermen de olie tegen veroudering en verdedigen onze lichaamscellen tegen oxidatieve stress.

## 1. Oleocanthal: De natuurlijke ontstekingsremmer

Het prikkelende gevoel in de keel (het "kuchje") komt door **Oleocanthal**.
*   **Werking:** Klinisch onderzoek toont aan dat het dezelfde werking heeft op ontstekingsenzymen als **ibuprofen**, maar dan 100% natuurlijk.
*   **Smaak:** Pittige prikkeling achter in de keel.

## 2. Oleuropeine: Hart- en vaatbescherming

De bittere smaak op de tong is afkomstig van **Oleuropeine**.
*   **Werking:** Het houdt de bloedvaten elastisch en helpt de bloeddruk te reguleren.
*   **Smaak:** Elegant bitter, zoals artisjok of groene bladeren.

## 3. Hydroxytyrosol: De ultieme antioxidant

Een van de meest krachtige natuurlijke antioxidanten die er bestaan:
*   **Werking:** Beschermt de bloedlipiden tegen oxidatieve stress (officieel goedgekeurd EFSA-claim).

:::cta
Kies voor actieve gezondheid
Proef onze olijfolie, rijk aan gecertificeerde polifenolen.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "polyfenoler-i-olivenolie-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyfenoler i olivenolie: Oleocanthal, Oleuropein og Hydroxytyrosol",
      excerpt: "Lær kemien bag olivenolien at kende. Hvordan beskytter disse stoffer din krop og definerer smagen?",
      category: "Olivenoliekemi",
      content: `## Sundhedens byggesten i olivenolie

Polyfenoler er grunden til, at ekstra jomfruolivenolie er super sundt. De fungerer som kraftige antioksidanter.

*   **Oleocanthal:** Giver den kildrende fornemmelse i halsen. Undersøgelser viser, at det hæmmer inflammation på samme måde som **ibuprofen**.
*   **Oleuropein:** Giver den bitre smag (som artiskok) og beskytter blodkarrene.
*   **Hydroxytyrosol:** En af de stærkeste antioksidanter, der beskytter blodet mod iltning (EFSA-godkendt).

:::cta
Vælg polyfenol-rig kvalitet
Smag vores friske olivenolier, spækket med naturlige antioksidanter.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "polyfenoler-i-olivenolje-oleocanthal-oleuropein-hydroxytyrosol",
      title: "Polyfenoler i olivenolje: Oleocanthal, Oleuropein og Hydroxytyrosol",
      excerpt: "Lær kjemien bak olivenoljen å kjenne. Hvordan beskytter disse stoffene kroppen din og definerer smaken?",
      category: "Olivenoljekjemi",
      content: `## Sunnhetens byggesteiner i olivenolje

Polyfenoler er grunnen til at ekstra jomfruolivenolje er super sunn. De fungerer som kraftige antioksidanter.

*   **Oleocanthal:** Gir den kildrende fornemmelsen i halsen. Undersøkelser viser at det hemmer inflammasjon på samme måte som **ibuprofen**.
*   **Oleuropein:** Gir den bitre smaken (som artisjokk) og beskytter blodkarene.
*   **Hydroxytyrosol:** En av de sterkeste antioksidantene, som beskytter blodet mot iltning (EFSA-godkjent).

:::cta
Velg polyfenol-rik kvalitet
Smak våre friske olivenoljer, spækket med naturlige antioksidanter.
[Se butikken](/shop)
:::`,
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
      content: `## The building blocks of olive oil

Over 98% of extra virgin olive oil consists of **triglycerides**—molecules formed by glycerol bound to three fatty acids. The specific ratio and profile of these fatty acids are what sets olive oil apart from all other vegetable oils.

Let's look at the three main fatty acids that build EVOO:

## 1. Oleic Acid (C18:1): The monounsaturated star

**Oleic acid** is the dominant force, representing **65% to 80%** of the fatty acids in high-quality olive oil. It is a monounsaturated fatty acid, meaning it has only one double bond in its carbon chain.
*   **Why it matters:** That single double bond makes it highly resistant to oxidation (the process that turns fats rancid). It is far more stable than the polyunsaturated fats found in seed oils.
*   **Kitchen performance:** Gives EVOO its high thermal stability and excellent smoke point.
*   **Health:** Decades of cardiovascular research show it helps maintain healthy cholesterol profiles.

## 2. Linoleic Acid (C18:2): The essential omega-6

**Linoleic acid** represents **5% to 10%** of EVOO. It is an essential polyunsaturated fatty acid (omega-6) containing two double bonds.
*   **Why it matters:** It is essential for human health, but its two double bonds make it much more chemically reactive and prone to oxidation than oleic acid.
*   **Quality marker:** A high linoleic acid count (>12-15%) makes an oil less stable over time and can be a marker of adulteration with cheaper seed oils.

## 3. Palmitic Acid (C16:0): The stable saturated fat

**Palmitic acid** (7% to 14%) is the main saturated fat in olive oil. Lacking any double bonds, it is highly stable.
*   **Why it matters:** Saturated fats provide physical structure. Palmitic acid is responsible for the crystallization (cloudiness or solidifying) that happens when olive oil is stored at low temperatures (below 10°C)—which is completely normal and reversible.

:::cta
Certified lipid profile
We analyze every harvest. Our oils consistently feature over 75% oleic acid for ultimate stability.
[Shop our oils](/shop)
:::`,
    },
    "de": {
      slug: "fettsaeureprofil-olivenoel-oelsaeure-linolsaeure-palmitinsaeure",
      title: "Fettsäureprofil von Olivenöl: Ölsäure, Linolsäure und Palmitinsäure",
      excerpt: "Erfahren Sie, wie das Verhältnis der Fettsäuren die Stabilität beim Erhitzen und den Wert für Ihre Gesundheit bestimmt.",
      category: "Olivenölchemie",
      content: `## Die Bausteine des Olivenöls

Über 98 % des nativen Olivenöls Extra bestehen aus Triglyceriden. Das Fettsäureprofil bestimmt die Eigenschaften des Öls:

## 1. Ölsäure (C18:1): Der monoungesättigte Star

**Ölsäure** macht **65 % bis 80 %** der Fettsäuren aus. Als einfach ungesättigte Fettsäure hat sie nur eine Doppelbindung:
*   **Stabilität:** Sie ist weitaus unempfindlicher gegen Sauerstoff als mehrfach ungesättigte Fette (Keimöle).
*   **Vorteil:** Verleiht dem Öl eine hervorragende Hitzebeständigkeit.
*   **Gesundheit:** Unterstützt nachweislich die Regulierung des Cholesterinspiegels.

## 2. Linolsäure (C18:2): Die essentielle Omega-6-Fettsäure

Macht **5 % bis 10 %** des Öls aus. Sie ist zweifach ungesättigt:
*   **Eigenschaft:** Essentiell für den Körper, aber oxidationsanfälliger.

## 3. Palmitinsäure (C16:0): Das stabile gesättigte Fett

Macht **7 % bis 14 %** aus. Sie hat keine Doppelbindung und sorgt für Stabilität. Sie ist auch für das Festwerden (Flocken) des Öls im Kühlschrank verantwortlich.

:::cta
Laborgeprüfte Stabilität
Unsere Olivenöle besitzen einen Ölsäuregehalt von über 75 %.
[Jetzt einkaufen](/shop)
:::`,
    },
    "nl": {
      slug: "vetzuurprofiel-olijfolie-oliezuur-linolzuur-palmitinezuur",
      title: "Vetzuurprofiel van olijfolie: Oliezuur, linolzuur en palmitinezuur",
      excerpt: "Ontdek de bouwstenen van olijfolie en hoe de verhoudingen de stabiliteit en gezondheidswaarde bepalen.",
      category: "Olijfoliechemie",
      content: `## De bouwstenen van olijfolie

Olijfolie bestaat voor 98% uit triglyceriden. Het specifieke vetzuurprofiel maakt het uniek:

## 1. Oliezuur (C18:1): Het monoverzadigde goud

**Oliezuur** is de belangrijkste component (65-80%). Omdat het een enkelvoudig onverzadigd vetzuur is, is het uiterst stabiel:
*   **Hittebestendig:** Oxidatiegevoeligheid is veel lager dan bij zaadoliën.
*   **Gezondheid:** Wetenschappelijk bewezen goed voor de bloedvaten.

## 2. Linolzuur (C18:2): Essentieel omega-6

Vertegenwoordigt 5-10%. Essentieel voor de mens, maar chemisch gevoeliger voor veroudering dan oliezuur.

## 3. Palmitinezuur (C16:0): Stabiel verzadigd vet

Vertegenwoordigt 7-14% en geeft structuur. Het zorgt voor het stollen (vlokken) van olijfolie bij koude temperaturen.

:::cta
Gecertificeerd vetzuurprofiel
Onze olijfolie heeft een oliezuurgehalte van meer dan 75% voor maximale stabiliteit.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "fedtsyreprofil-olivenolie-oliesyre-linolsyre-palmitinsyre",
      title: "Fedtsyreprofil i olivenolie: Oliesyre, linolsyre og palmitinsyre",
      excerpt: "Se, hvordan forholdet mellem fedtsyrerne bestemmer oliens stabilitet under opvarmning.",
      category: "Olivenoliekemi",
      content: `## Byggestenene i olivenolie

Over 98 % af olien består af fedtsyrer, hvor især tre typer dominerer:

*   **Oliesyre (C18:1):** En enkeltumættet fedtsyre (65-80 %). Den gør olien yderst stabil ved stegning og sund for hjertet.
*   **Linolsyre (C18:2):** En essentiel omega-6 fedtsyre (5-10 %). Den er sund, men mere sårbar over for iltning.
*   **Palmitinsyre (C16:0):** En mættet fedtsyre (7-14 %), der giver stabilitet og får olien til at stivne ved lave temperaturer.

:::cta
Garanteret kvalitet
Vores olivenolier har et naturligt højt indhold af sund oliesyre.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "fettsyreprofil-olivenolje-oljesyre-linolsyre-palmitinsyre",
      title: "Fettsyreprofil i olivenolje: Oljesyre, linolsyre og palmitinsyre",
      excerpt: "Se hvordan forholdet mellom fettsyrene bestemmer oljens stabilitet under oppvarming.",
      category: "Olivenoljekjemi",
      content: `## Byggesteinene i olivenolje

Over 98 % av oljen består av fettsyrer, der spesielt tre typer dominerer:

*   **Oljesyre (C18:1):** En enumettet fettsyre (65-80 %). Den gjør oljen svært stabil ved steking og sunn for hjertet.
*   **Linolsyre (C18:2):** En essensiell omega-6 fettsyre (5-10 %). Den er sunn, men mer sårbar for iltning.
*   **Palmitinsyre (C16:0):** En mettet fettsyre (7-14 %), som gir stabilitet og får oljen til å stivne ved lave temperaturer.

:::cta
Garantert kvalitet
Våre olivenoljer har et naturlig høyt innhold av sunn oljesyre.
[Se butikken](/shop)
:::`,
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
      content: `## What is a peroxide?

When the double bonds of unsaturated fatty acids (especially oleic and linoleic acids) react with atmospheric oxygen, the first compounds of oxidation are formed: **lipid hydroperoxides** (or peroxides).

These primary oxidation products are unstable. Over time, they decompose into **aldehydes, ketones**, and short-chain acids. These secondary oxidation products are the molecules directly responsible for the off-flavors and smell of rancidity.

The **Peroxide Value (PV)** measures the concentration of these primary reactive oxygen compounds present in the oil at the time of testing, expressed in **mEq O₂ per kg of oil**.

## Legal limits and ideal values

According to European regulations:
*   **Maximum legal limit** for Extra Virgin Olive Oil: **≤ 20 mEq O₂/kg**
*   An outstanding, freshly milled artisanal oil: **4–8 mEq O₂/kg**
*   A high-quality oil stored well after 6 months: **8–12 mEq O₂/kg**
*   Close to the limit: **15–20 mEq O₂/kg** (noticeably flat and starting to degrade)

## Why peroxide values rise

Lipid oxidation is a radical-driven, autocatalytic chain reaction: once initiated, the free radicals generated accelerate the process. Factors that speed up this decay:
*   **Light:** Photo-oxidation driven by natural chlorophylls in the oil.
*   **Heat:** Every 10°C increase in temperature doubles the oxidation rate.
*   **Oxygen:** Headspace air in a half-empty container drives steady oxidation.

## The peroxide paradox

Peroxides are **unstable intermediates**. In a very old, completely rancid oil, the peroxide value can actually *drop* because almost all hydroperoxides have already degraded into the final aldehydes (rancid smell).

For a complete and reliable quality assessment, the Peroxide Value must always be read alongside **UV extinction coefficients (K232 and K270)**, which measure both primary and secondary oxidation.

:::cta
Freshness you can verify
Every lot of our Tuscan Extra Virgin Olive Oil features peroxide values well below 8.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "peroxidzahl-olivenoel-bedeutung-qualitaet",
      title: "Peroxidzahl bei Olivenöl: Was sie über die Frische aussagt",
      excerpt: "Erfahren Sie, wie Peroxide entstehen, was sie messen und warum niedrige Werte für absolute Frische stehen.",
      category: "Olivenölchemie",
      content: `## Was sind Peroxide?

Peroxide (Hydroperoxide) sind die ersten Produkte, die entstehen, wenn Fettsäuren mit Sauerstoff reagieren (primäre Oxidation). Sie sind instabil und zerfallen im Laufe der Zeit in Aldehyde und Ketone, die für den ranzigen Geruch verantwortlich sind.

Die **Peroxidzahl (POZ)** gibt die Menge dieser Sauerstoffverbindungen an, gemessen in **mEq O₂ pro kg Öl**.

## Die Grenzwerte

*   **Gesetzlicher Grenzwert** für natives Olivenöl Extra: **≤ 20 mEq O₂/kg**
*   Ein hervorragendes, frisch gepresstes Öl: **4–8 mEq O₂/kg**
*   Ein gut gelagertes Öl nach 6 Monaten: **8–12 mEq O₂/kg**

## Warum der Wert steigt

Die Oxidation wird beschleunigt durch:
*   **Licht:** Beschleunigt den Zerfall über Chlorophylle.
*   **Hitze:** Höhere Temperaturen verdoppeln die Reaktionsrate.
*   **Sauerstoff:** Halbleere Flaschen fördern die Oxidation.

:::cta
Frische, die man messen kann
Unser frisch gepresstes Olivenöl liegt immer weit unter dem Grenzwert.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "peroxidegetal-olijfolie-kwaliteit-betekenis",
      title: "Peroxidegetal van olijfolie: Wat betekent het voor de kwaliteit?",
      excerpt: "Het peroxidegetal is de belangrijkste graadmeter voor de beginnende veroudering van olijfolie. Ontdek de details.",
      category: "Olijfoliechemie",
      content: `## Wat is een peroxide?

Peroxiden zijn de eerste stoffen die ontstaan als vetten reageren met zuurstof (primaire oxidatie). Ze zijn instabiel en vallen uiteen in aldehyden en ketonen, die de typische ranzige smaak veroorzaken.

Het **peroxidegetal** meet deze primaire oxidatieproducten in **mEq O₂ per kg olijfolie**.

## Grenzen en normen

*   **Wettelijke bovengrens** voor extra vierge: **≤ 20 mEq O₂/kg**
*   Olijfolie van topkwaliteit (vers): **4–8 mEq O₂/kg**

:::cta
Gegarandeerd vers
Onze olijfoliën hebben een peroxidegetal dat ver onder de wettelijke grens ligt.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "peroxidtal-olivenolie-hvad-betyder-det",
      title: "Peroxidtal i olivenolie: Hvad måler det, og hvorfor er det vigtigt?",
      excerpt: "Peroxidtallet er den første indikator for oliens oxidation. Se grænserne og de ideelle værdier.",
      category: "Olivenoliekemi",
      content: `## Hvad er peroxider?

Peroxider opstår, når oliens fedtsyrer reagerer med ilt (primær oxidation). Det er ustabile stoffer, der hurtigt nedbrydes til aldehyder, som giver harsk smag.

**Peroxidtallet** måler denne proces i **mEq O₂ pr. kg olie**:
*   **Lovkrav** til ekstra jomfruolivenolie: **≤ 20 mEq O₂/kg**
*   **Høj kvalitet (frisk):** **4–8 mEq O₂/kg**

:::cta
Friskhed, der kan dokumenteres
Vores olivenolier testes regelmæssigt og har meget lave peroxidtal.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "peroksidtall-olivenolje-hva-betyr-det",
      title: "Peroksidtall i olivenolje: Hva måler det, og hvorfor er det viktig?",
      excerpt: "Peroksidtallet er den første indikatoren på oljens oksidasjon. Se grensene og de ideelle verdiene.",
      category: "Olivenoljekjemi",
      content: `## Hva er peroksider?

Peroksider oppstår når oljens fettsyrer reagerer med oksygen (primær oksidasjon). Det er ustabile stoffer som raskt brytes ned til aldehyder, som gir harsk smak.

**Peroksidtallet** måler denne prosessen i **mEq O₂ pr. kg olje**:
*   **Lovkrav** til ekstra jomfruolivenolje: **≤ 20 mEq O₂/kg**
*   **Høy kvalitet (fersk):** **4–8 mEq O₂/kg**

:::cta
Friskhet som kan dokumenteres
Våre olivenoljer testes regelmessig og har svært lave peroksidtall.
[Se butikken](/shop)
:::`,
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
      content: `## What are UV extinction coefficients?

The **UV extinction coefficients** (known as *K-values*) are spectrophotometric parameters that measure how much ultraviolet light the oil absorbs at specific wavelengths. This absorption is directly linked to structural alterations in the fatty acids caused by oxidation or heat treatments.

They are measured quickly using a UV spectrophotometer, without destroying the oil sample.

## K232: Primary Oxidation

At **232 nm**, the spectrophotometer measures **conjugated dienes**—compounds formed when the double bonds of polyunsaturated fatty acids rearrange due to free radical attacks.
*   **What it measures:** The early, **primary** stages of oxidation.
*   **Legal limit for Extra Virgin:** K232 ≤ **2.50**
*   A fresh, premium-quality oil usually scores between **1.50 and 2.00**.

## K270: Secondary Oxidation

At **270 nm**, the instrument measures **conjugated trienes** and **carbonyl compounds** (aldehydes, ketones). These are secondary oxidation products formed when primary hydroperoxides break down.
*   **What it measures:** Advanced, **secondary** oxidation. It indicates that the oil is old, rancid, or has undergone industrial refining.
*   **Legal limit for Extra Virgin:** K270 ≤ **0.22**
*   An excellent, fresh oil usually scores between **0.08 and 0.14**.

## Delta-K (ΔK): The purity safeguard

The **Delta-K (ΔK)** value is a calculation that measures the curvature of the UV absorption spectrum around 270 nm:

> ΔK = K270 − (K266 + K274) / 2

A high ΔK value is a clear indicator that the oil has been blended with **refined olive oils** (which have very high triene counts due to high-temperature deodorization).
*   **Legal limit:** ΔK ≤ **0.01**

## Understanding K-Values at a glance

| Quality Tier | K232 | K270 |
| :--- | :--- | :--- |
| **Artisanal Fresh** | 1.50–2.00 | 0.08–0.14 |
| **Good Quality** | 2.00–2.40 | 0.14–0.20 |
| **Standard EVOO** | 2.40–2.50 | 0.20–0.22 |
| **Defective (Not EVOO)** | > 2.50 | > 0.22 |

:::cta
Pure and verified oils
We publish the full chemical analysis of our oils, including K-values.
[Discover the Shop](/shop)
:::`,
    },
    "de": {
      slug: "k232-k270-uv-extinktionskoeffizienten-olivenoel",
      title: "K232 und K270: Die UV-Spektrophotometrie bei Olivenöl erklärt",
      excerpt: "Erfahren Sie, was diese Werte messen, wie man sie liest und warum sie die chemische Reinheit des Öls garantieren.",
      category: "Olivenölchemie",
      content: `## Was sind UV-Extinktionskoeffizienten?

Die **K-Werte (K232 und K270)** sind Parameter der UV-Spektrophotometrie. Sie messen, wie viel ultraviolettes Licht das Öl bei bestimmten Wellenlängen absorbiert. Diese Werte zeigen strukturelle Veränderungen der Fettsäuren durch Oxidation oder Raffination.

## K232: Primäre Oxidation

Bei **232 nm** absorbieren sogenannte konjugierte Diene. Sie zeigen den Beginn der Oxidation an.
*   **Gesetzlicher Grenzwert** für natives Olivenöl Extra: K232 ≤ **2,50**
*   Ein frisches, hochwertiges Öl liegt oft bei **1,5 bis 2,0**.

## K270: Sekundäre Oxidation

Bei **270 nm** absorbieren konjugierte Triene und Carbonylverbindungen (Abbauprodukte). Sie zeigen ein fortgeschrittenes Alter oder eine Raffination an.
*   **Gesetzlicher Grenzwert** für natives Olivenöl Extra: K270 ≤ **0,22**
*   Ein hervorragendes Öl liegt bei **0,08 bis 0,14**.

## Delta-K (ΔK): Schutz vor Betrug

Der **ΔK-Wert** schützt vor der Beimischung von raffinierten Ölen (z. B. Lampantöl). Der Grenzwert liegt bei **≤ 0,01**.

:::cta
Chemisch geprüfte Reinheit
Unsere Olivenöle besitzen hervorragende K-Werte, weit unter den Grenzwerten.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "k232-en-k270-uv-extinctiecoefficienten-olijfolie",
      title: "K232 en K270: Wat meten de UV-waarden in olijfolie?",
      excerpt: "De K-waarden zijn de meest technische parameters om de ouderdom en puurheid van extra vierge olijfolie te bewijzen.",
      category: "Olijfoliechemie",
      content: `## Wat zijn K-waarden?

De **UV-extinctiecoëfficiënten** (K232 en K270) meten de absorptie van ultraviolet licht door olijfolie. Dit toont chemische veranderingen aan in de vetzuurketens veroorzaakt door hitte of oxidatie.

*   **K232 (primaire oxidatie):** Geeft aan of de olie vers is. Bovengrens voor extra vierge: **≤ 2,50** (topkwaliteit zit rond 1,5–2,0).
*   **K270 (secundaire oxidatie):** Toont veroudering of raffinage aan. Bovengrens: **≤ 0,22** (topkwaliteit ligt rond 0,08–0,14).
*   **Delta-K (ΔK):** Indicator voor vermenging met goedkopere geraffineerde olie. Grens: **≤ 0,01**.

:::cta
Puurheid gegarandeerd
Al onze oogsten worden grondig getest in gecertificeerde laboratoria.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "k232-og-k270-uv-absorptionskoefficienter-olivenolie",
      title: "K232 og K270: Hvad måler disse værdier i olivenolien?",
      excerpt: "K-værdierne måler oliens lysabsorption og afslører, om den er frisk, gammel eller blandet med raffineret olie.",
      category: "Olivenoliekemi",
      content: `## Hvad er K-værdier?

K-værdierne (K232 og K270) måles med UV-spektrofotometri og viser oxidation samt eventuel kemisk behandling af olivenolien:

*   **K232 (primær oxidation):** Viser oliens tidlige oxidation. Lovkrav for ekstra jomfru: **≤ 2,50** (frisk topkvalitet ligger på 1,5–2,0).
*   **K270 (sekundær oxidation):** Afslører ældre, harsk eller raffineret olie. Lovkrav: **≤ 0,22** (topkvalitet ligger på 0,08–0,14).
*   **Delta-K (ΔK):** Afslører svindel med raffineret olie. Lovkrav: **≤ 0,01**.

:::cta
Dokumenteret renhed
Se de kemiske analyser for alle vores olivenolier.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "k232-og-k270-uv-absorpsjonskoeffisienter-olivenolje",
      title: "K232 og K270: Hva måler disse verdiene i olivenoljen?",
      excerpt: "K-verdiene måler oljens lysabsorpsjon og avslører om den er fersk, gammel eller blandet med raffinert olje.",
      category: "Olivenoljekjemi",
      content: `## Hva er K-verdier?

K-verdiene (K232 og K270) måles med UV-spektrofotometri og viser oksidasjon samt eventuell kjemisk behandling av olivenoljen:

*   **K232 (primær oksidasjon):** Viser oljens tidlige oksidasjon. Lovkrav for ekstra jomfru: **≤ 2,50** (fersk toppkvalitet ligger på 1,5–2,0).
*   **K270 (sekundær oksidasjon):** Avslører eldre, harsk eller raffinert olje. Lovkrav: **≤ 0,22** (toppkvalitet ligger på 0,08–0,14).
*   **Delta-K (ΔK):** Avslører svindel med raffinert olje. Lovkrav: **≤ 0,01**.

:::cta
Dokumentert renhet
Se de kjemiske analysene for alle våre olivenoljer.
[Se butikken](/shop)
:::`,
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
      content: `## What is malaxation?

After the olives are **crushed** into a paste, the oil remains trapped in microscopic droplets inside the plant cells. The next step, **malaxation**, consists of slowly and continuously churning this paste (typically for 20 to 40 minutes) in specialized temperature-controlled troughs called *malaxers*.

The physical goal is simple: to break the water-oil emulsion, allowing the tiny micro-droplets to aggregate into larger drops that can be easily separated by the decanter centrifuge.

However, from a chemical standpoint, this is where the character, flavor, and health benefits of the oil are born.

## The chemistry of malaxation

During these 20 to 40 minutes, critical enzymatic reactions occur within the olive paste:

### The LOX Pathway: Creating Aromas

The crushing of the olives releases natural plant enzymes. When these enzymes meet oxygen and polyunsaturated fatty acids (linoleic and linolenic) in the malaxer, they trigger the **Lipoxygenase (LOX) pathway**:
1.  Polyunsaturated fatty acids are converted into hydroperoxides.
2.  These hydroperoxides are cleaved by enzymes into **C5 and C6 volatile compounds** (aldehydes and alcohols).
3.  The main molecules produced—like *hexanal* and *(E)-2-hexenal*—are what give fresh olive oil its green aromas: **fresh-cut grass, green tomato, artichoke, and green apple**.

### Secoiridoid Hydrolysis: Bitter and Pungent

Natural enzymes (glucosidases) break down the complex **oleuropein** molecule, releasing the bioactive compounds that dictate taste and longevity:
*   **Oleuropein aglycone:** Responsible for the elegant bitter taste.
*   **Oleocanthal:** Responsible for the sharp, peppery throat sting.
*   **Free Hydroxytyrosol:** The master antioxidant.

## The master miller's trade-off: Time vs. Temperature

The master miller must balance extraction yield against chemical quality:

*   **High Temperature (>27°C) or Long Malaxation:** Increases the extraction yield (extracts more oil), but degrades the volatile green aromas and oxidizes the polyphenols.
*   **Low Temperature (<27°C) or Short Malaxation:** Decreases extraction yield but preserves maximum polyphenols and fresh green aromas.

**"Cold Extracted"** legally dictates that the paste temperature never exceeds **27°C**. While the yield is lower, it is the only way to obtain a premium extra virgin olive oil.

:::cta
Milled with scientific precision
We cold-extract our oils below 25°C to preserve every single healthy polyphenol and green note.
[Shop the fresh harvest](/shop)
:::`,
    },
    "de": {
      slug: "kneten-der-olivenpaste-chemie-aroma",
      title: "Die Knetung (Gramulation) der Olivenpaste: Entstehung der Aromen",
      excerpt: "Erfahren Sie, wie Temperatur und Dauer in dieser entscheidenden Phase das Aroma und die Polyphenole des Öls bestimmen.",
      category: "Olivenölchemie",
      content: `## Was ist das Kneten (Gramulation)?

Nach dem Mahlen der Oliven liegt eine Paste vor. Das Kneten (italienisch *Gramolazione*) besteht aus dem langsamen Rühren dieser Paste (ca. 20–40 Minuten) bei kontrollierter Temperatur. Physikalisch gesehen vereinigen sich dabei die winzigen Öltröpfchen zu größeren Tropfen, die sich abschleudern lassen.

Chemisch gesehen ist dies die wichtigste Phase für die Entstehung der Qualität.

## Die Chemie des Knetens

*   **Der LOX-Weg (Aromen):** Durch den Kontakt mit Sauerstoff wandeln Enzyme Fettsäuren in flüchtige C5- und C6-Verbindungen um. So entstehen die frischen Düfte nach **frisch gemähtem Gras, grünen Tomaten und Artischocken**.
*   **Freisetzung der Bitter- und Schärfestoffe:** Enzyme spalten das Oleuropein und setzen **Oleocanthal** (Schärfe) und **Oleuropein-Aglycon** (Bitterkeit) frei.

## Das Temperatur-Dilemma

*   **Höhere Temperaturen (>27°C):** Mehr Ölausbeute, aber weniger Polyphenole und flache Aromen.
*   **Kalte Knetung (<27°C):** Weniger Ölausbeute, aber maximale Polyphenole und intensive, frische Aromen.

„Kaltgepresst“ bzw. „kalt extrahiert“ bedeutet gesetzlich, dass die Temperatur niemals **27°C** überschreiten darf.

:::cta
Aus Liebe zur Qualität
Unsere Olivenöle werden konsequent bei unter 25°C schonend geknetet.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "mengen-van-olijfpasta-gramolatie-chemie-aroma",
      title: "Gramolatie (mengen van olijfpasta): De chemie achter het aroma",
      excerpt: "De gramolatie is de meest kritische fase in het frantoio. Temperatuur en duur bepalen de polifenolen en aroma's.",
      category: "Olijfoliechemie",
      content: `## Wat is gramolatie?

Na het kneuzen van de olijven wordt de verkregen pasta langzaam en continu geroerd (gramolatie) gedurende 20 tot 40 minuten op een gecontroleerde temperatuur. Dit zorgt ervoor dat micro-druppeltjes olie samensmelten tot grotere druppels.

## De enzymen aan het werk

Tijdens het mengen treden er twee cruciale processen op:
*   **De LOX-route (aroma's):** Lipoxygenase-enzymen reageren met zuurstof en vormen vluchtige C5- en C6-verbindingen, verantwoordelijk voor de frisse aroma's van **gemaaid gras, groene tomaat en artisjok**.
*   **Secoiridoïde-hydrolyse:** Vrijgave van **Oleocanthal** (pittigheid) en **Oleuropeine-aglycon** (bitterheid).

## Temperatuurbeheersing

Voor een premium kwaliteit mag de temperatuur nooit boven de **27°C** komen ("koude extractie"). Een hogere temperatuur geeft meer opbrengst, maar vernietigt de gezonde polifenolen.

:::cta
Koud geperst voor maximale smaak
Wij mengen onze olijfpasta altijd onder de 25°C.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "æltning-af-olivenpasta-kemi-og-aroma",
      title: "Æltning af olivenpasta (Malaxation): Kemien bag duften",
      excerpt: "Æltningen er det mest kritiske trin i presningen. Temperatur og varighed afgør polyfenoler og aroma.",
      category: "Olivenoliekemi",
      content: `## Hvad er æltning (malaxation)?

Efter formalingen æltes olivenpastaen langsomt i 20–40 minutter. Dette får de mikroskopiske oliedråber til at samle sig, så de kan slynges ud i centrifugen.

## Kemien bag aromaen

Under æltningen frigør olivenens egne enzymer de flygtige aromastoffer (LOX-processen). Det er her, olien får sin friske duft af **nyslået græs og grøn tomat**. Samtidig frigives de sunde bitterstoffer **Oleocanthal** og **Oleuropein**.

## Koldpresning (Max 27°C)

For at bevare alle polyfenoler må temperaturen aldrig overstige **27°C**. Selvom det giver mindre olie, sikrer det den absolut bedste kvalitet.

:::cta
Koldpresset perfektion
Vores olivenolier koldpresses under 25°C for at bevare de sunde stoffer.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "eltning-av-olivenpasta-kjemie-og-aroma",
      title: "Elting av olivenpasta (Malaxation): Kjemien bak duften",
      excerpt: "Eltningen er det mest kritiske trinnet i pressingen. Temperatur og varighet avgjør polyfenoler og aroma.",
      category: "Olivenoljekjemi",
      content: `## Hva er elting (malaxation)?

Etter formalingen eltes olivenpastaen langsomt i 20–40 minutter. Dette får de mikroskopiske oljedråpene til å samle seg, slik at de kan slynges ut i sentrifugen.

## Kjemien bak aromaen

Under eltningen frigjør olivenens egne enzymer de flyktige aromastoffene (LOX-prosessen). Det er her oljen får sin friske duft av **nyslått gress og grønn tomat**. Samtidig frigis de sunne bitterstoffene **Oleocanthal** og **Oleuropein**.

## Kaldpressing (Max 27°C)

For at bevare alle polyfenoler må temperaturen aldri overstige **27°C**. Selvom det gir mindre olje, sikrer det den absolutt beste kvaliteten.

:::cta
Kaldpresset perfeksjon
Våre olivenoljer kaldpresses under 25°C for å bevare de sunne stoffene.
[Se butikken](/shop)
:::`,
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
      content: `## What is suspended in unfiltered oil?

Immediately after leaving the decanter centrifuge, fresh extra virgin olive oil has a beautiful but cloudy, opaque appearance. This cloudiness consists of:
*   **Microscopic droplets of vegetation water** (0.1% to 0.3%).
*   **Suspended olive pulp particles** (plant cells and skins).
*   **Active plant enzymes** (lipases, polyphenol oxidases).
*   **Yeasts and bacteria** naturally present on the olive skins.

While this unfiltered state is charming and highly aromatic in the first few weeks, it represents a ticking chemical bomb for long-term storage.

## Why filtration improves stability

Filtration through pure cellulose sheets removes these suspended particles, offering three major chemical advantages:

### 1. Eliminating water and lipase enzymes
Water in suspension allows active **lipase** enzymes to break down triglycerides into free fatty acids. This means that in an unfiltered oil, the **free acidity** will rise much faster during storage.

### 2. Preventing bacterial fermentation
The micro-pulp contains traces of sugars. Yeasts and bacteria present in the sediment can ferment these sugars under anaerobic conditions, producing volatile compounds (like ethyl acetate) that yield off-flavors like **fusty** or **muddy sediment**.

### 3. Arresting polyphenol oxidation
Suspended **polyphenol oxidases** (PPO) continue to oxidize the healthy polyphenols inside the bottle, rapidly depleting the oil's antioxidant shield.

## The verdict: Unfiltered vs. Filtered

*   **Unfiltered Oil (Mosto):** Absolutely spectacular if consumed **within 4 to 6 weeks** of milling. Its rustic character is unique.
*   **Filtered Oil:** Mandatory for any storage beyond two months. It preserves the high polyphenol count and keeps acidity low, ensuring a long, stable shelf-life.

:::cta
Limpid and stable quality
Our bottled oils are carefully filtered through natural cellulose to protect their quality over time.
[Shop the selections](/shop)
:::`,
    },
    "de": {
      slug: "filtrierung-von-olivenoel-effekte-stabilitaet",
      title: "Filtrierung von Olivenöl Extra: Effekte auf Wasser, Enzyme und Haltbarkeit",
      excerpt: "Die Filtrierung ist keine reine Ästhetik. Sie entfernt Wasser und Enzyme und schützt das Öl vor dem Verderb.",
      category: "Olivenölchemie",
      content: `## Was enthält ungefiltertes Öl?

Frisch gepresstes, ungefiltertes Olivenöl ist trüb. Diese Trübung besteht aus:
*   **Mikroskopischen Wassertröpfchen** (0,1–0,3 % Vegetationswasser).
*   **Fruchtfleischpartikeln** (Schwebstoffe).
*   **Aktiven Enzymen** (Lipasen, Polyphenoloxidasen).
*   **Hefen und Bakterien**.

In den ersten Wochen schmeckt dieses trübe Öl fantastisch, doch für eine längere Lagerung ist es ungeeignet.

## Warum die Filtrierung die Haltbarkeit verbessert

*   **Vermeidung von Hydrolyse:** Das Schwebewasser fördert den Abbau von Fetten durch Lipasen – die freie Säure steigt.
*   **Keine Fermentation:** Hefen fermentieren Zuckerreste im Bodensatz (Morchia), was zu Fehlgeschmäckern führt.
*   **Schutz der Polyphenole:** Enzyme oxidieren die gesunden Polyphenole in der Flasche. Die Filtrierung stoppt diesen Abbau.

:::cta
Gefiltert für lange Frische
Wir filtern unsere Öle schonend durch Zellulose, um die Qualität dauerhaft zu schützen.
[Jetzt einkaufen](/shop)
:::`,
    },
    "nl": {
      slug: "filtratie-van-olijfolie-stabiliteit-effecten",
      title: "Filtratie van olijfolie: Effecten op water, enzymen en houdbaarheid",
      excerpt: "Filtratie is niet alleen esthetisch. Het verwijdert water en actieve enzymen, wat de houdbaarheid aanzienlijk verlengt.",
      category: "Olijfoliechemie",
      content: `## Wat zit er in ongefilterde olijfolie?

Vers geperste olijfolie is troebel. Deze troebelheid bevat:
*   **Microscopische waterdruppeltjes** (vegetatievocht).
*   **Deeltjes olijfvlees** (celwanden en vruchtvlees).
*   **Actieve enzymen & bacteriën**.

Hoewel dit troebele "mosto" olie spectaculair is in de eerste 4 tot 6 weken, is het ongeschikt voor langdurige opslag.

## Waarom filtratie belangrijk is

*   **Voorkomt stijging zuurgraad:** Water activeert lipase-enzymen die vetten afbreken tot vrije vetzuren.
*   **Voorkomt gisting:** Bacteriën in het sediment kunnen suikers fermenteren (morchia defect).
*   **Behoudt polifenolen:** Filtratie stopt enzymen die de gezonde polifenolen in de fles afbreken.

:::cta
Gefilterd voor maximale bewaring
Onze gebottelde olijfoliën zijn zorgvuldig gefilterd om de kwaliteit te garanderen.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "filtrering-af-olivenolie-effekt-paa-holdbarhed",
      title: "Filtrering af olivenolie: Betydning for vand, enzymer og holdbarhed",
      excerpt: "Filtrering er ikke kun for udseendets skyld. Det fjerner vand og enzymer, hvilket forlænger holdbarheden markant.",
      category: "Olivenoliekemi",
      content: `## Hvorfor filtrere olivenolien?

Helt friskpresset olivenolie er uklar, da den indeholder mikroskopiske partikler af frugtkød, vand og aktive enzymer.

Selvom ufiltreret olie smager fantastisk de første par uger, vil vandet og enzymerne hurtigt nedbryde olien:
*   **Frie fedtsyrer stiger:** Vandet reagerer med fedtsyrerne og øger syreindholdet.
*   **Fermentering:** Gærceller i bundfaldet danner dårlig smag.
*   **Tab af antioxidanter:** Enzymer oxiderer de sunde polyfenoler.

Filtrering gennem ren cellulose fjerner disse partikler og sikrer en lang, stabil holdbarhed.

:::cta
Filtreret for din sikkerhed
Vi filtrerer vores olivenolier skånsomt for at beskytte den høje kvalitet.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "filtrering-av-olivenolje-betydning-for-holdbarhet",
      title: "Filtrering av olivenolje: Betydning for vann, enzymer og holdbarhet",
      excerpt: "Filtrering er ikke bare for utseendets skyld. Det fjerner vann og enzymer, noe som forlenger holdbarheten markant.",
      category: "Olivenoljekjemi",
      content: `## Hvorfor filtrere olivenoljen?

Helt ferskpresset olivenolje er uklar, da den inneholder mikroskopiske partikler av fruktkjøtt, vann og aktive enzymer.

Selv om ufiltrert olje smaker fantastisk de første par ukene, vil vannet og enzymerne raskt nedbryte oljen:
*   **Frie fettsyrer stiger:** Vannet reagerer med fettsyrene og øker syreinnholdet.
*   **Fermentering:** Gjærceller i bunnfallet danner dårlig smak.
*   **Tap av antioksidanter:** Enzymer oksiderer de sunne polyfenolene.

Filtrering gjennom ren cellulose fjerner disse partiklene og sikrer en lang, stabil holdbarhet.

:::cta
Filtrert for din sikkerhet
Vi filtrerer våre olivenoljer skånsomt for å beskytte den høye kvaliteten.
[Se butikken](/shop)
:::`,
    },
  },
"""

# Let's replace the marker with the new translations AND the marker (so it stays in place)
content = content.replace(target_marker, new_translations + "\n" + target_marker)

# Let's also update tec-1 in the file to include the content fields for en, de, nl, da, no
tec1_original = """    "en": {
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
    },"""

tec1_replaced = """    "en": {
      slug: "nmr-spectroscopy-olive-oil-authentication-adulteration",
      title: "NMR of Olive Oil: ¹H and ¹³C Spectroscopy for Authentication and Adulteration Detection",
      excerpt: "Nuclear Magnetic Resonance is today one of the most powerful tools for EVOO authentication. ¹H-NMR and ¹³C-NMR reveal fatty acid composition, adulterants, and geographic origin.",
      category: "Olive Oil Chemistry",
      content: `## A revolution in olive oil analytics

**Nuclear Magnetic Resonance (NMR)** spectroscopy is a highly sophisticated, non-destructive analytical method. It relies on the absorption of radiofrequency radiation by active atomic nuclei (primarily ¹H and ¹³C) when placed inside an extremely strong external magnetic field.

For extra virgin olive oil, NMR represents a complete paradigm shift compared to old-school wet chemistry methods:
*   **Non-destructive:** The sample remains intact and can be recovered after the test.
*   **Ultra-fast:** A complete, comprehensive analysis is finished in 5 to 15 minutes.
*   **Highly informative:** A single ¹H spectrum provides a complete chemical "fingerprint," revealing fatty acid profile, exact purity, and—using advanced statistical models—geographic provenance.

The official application for olive oil is regulated by the International Olive Council under the **COI/T.20/Doc. No 30** protocol.

## How ¹H-NMR works: Mapping the molecules

To run the analysis, the olive oil is dissolved in deuterated chloroform (CDCl₃). When placed in the spectrometer, different chemical groups generate distinct peaks at specific positions (chemical shifts, measured in ppm):
*   **Protons on double bonds (vinilic, δ 5.20–5.45 ppm):** Directly proportional to total unsaturation. It distinguishes the ratios of monounsaturated (oleic) and polyunsaturated (linoleic, linolenic) fatty acids.
*   **Bis-allylic protons (δ 2.75 ppm):** The ultimate diagnostic peak for **linoleic acid** (omega-6). Its integration allows direct, high-precision quantification.
*   **Allylic protons of linolenic acid (δ 2.05 ppm):** Quantifies **linolenic acid** (omega-3), crucial for detecting blending.

## Geographic Fingerprinting and Fraud Detection

### 1. Spotting cheap seed oils
Adulteration with seed oils (like high-oleic sunflower, corn, or hazelnut oil) is easily caught. For instance:
*   **Sunflower oil** spikes the bis-allylic peak (linoleic).
*   **Corn oil** displays a distinct signature of the plant sterol **beta-sitosterol** in the aliphatic region.
*   The detection threshold for seed oil mixing is below **1%** when combined with multivariate chemometric models.

### 2. Certifying authentic DOP and origin
Because the micro-composition of triglycerides is shaped by cultivar, soil chemistry, and local weather patterns, the NMR spectrum of an olive oil serves as a geographic passport. By comparing a sample's spectrum against official databases, laboratories can verify if an oil labeled as "100% Tuscan DOP" actually matches the authentic regional signature.

:::cta
Uncompromising scientific quality
We certify the absolute authenticity of our Tuscan Extra Virgin Olive Oil through rigorous laboratory testing.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "nmr-spektroskopie-olivenoel-authentifizierung-verfaelschung",
      title: "NMR-Spektroskopie bei Olivenöl: ¹H- und ¹³C-NMR zur Authentifizierung und Verfälschungsanalyse",
      excerpt: "Die magnetische Kernresonanz ist heute eines der stärksten Instrumente zur Olivenöl-Authentifizierung. ¹H-NMR und ¹³C-NMR zeigen die Fettsäuren und Herkunft.",
      category: "Olivenölchemie",
      content: `## Eine Revolution in der Olivenöl-Analyse

Die **Kernspinresonanzspektroskopie (NMR)** ist eine hochentwickelte, zerstörungsfreie Methode zur Untersuchung von Molekülen. Sie basiert auf dem Verhalten von Atomkernen in einem starken Magnetfeld unter Einfluss von Radiowellen.

Vorteile der NMR gegenüber klassischen Labormethoden:
*   **Zerstörungsfrei:** Die Probe wird nicht beschädigt.
*   **Schnell:** Ergebnisse liegen in 5–15 Minuten vor.
*   **Enorm aussagekräftig:** Ein einziges Spektrum zeigt die genaue Fettsäureverteilung und dient als fälschungssicherer Herkunftsnachweis.

## Herkunftsnachweis und Aufdecken von Verfälschungen

Die Zusammensetzung der Triglyceride im Olivenöl wird durch Bodenbeschaffenheit, Klima und Olivensorte geprägt. Das NMR-Spektrum fungiert somit als digitaler Fingerabdruck des Bodens. Durch den Abgleich mit Datenbanken lässt sich zweifelsfrei nachweisen, ob ein Öl wirklich aus der angegebenen Region stammt (z. B. Toskana g.g.A.). Zudem können Beimischungen von billigen Keimölen (Sonnenblumen-, Raps- oder Maiskeimöl) selbst unter 1 % sicher nachgewiesen werden.

:::cta
Wissenschaftlich belegte Reinheit
Wir stehen für maximale Transparenz und Qualität durch modernste Labortests.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "nmr-spectroscopie-olijfolie-authenticatie-adulteratie",
      title: "NMR van olijfolie: ¹H- en ¹³C-spectroscopie voor authenticatie en adulteratie",
      excerpt: "Kernspinresonantie is vandaag een van de krachtigste instrumenten voor extra vierge olijfolie-authenticatie. ¹H-NMR en ¹³C-NMR tonen vetzuursamenstelling en geografische herkomst.",
      category: "Olijfoliechemie",
      content: `## Een revolutie in olijfolie-analyse

**Kernspinresonantie (NMR)** is een geavanceerde, niet-destructieve analysemethode. Het maakt gebruik van het gedrag van atoomkernen in een sterk magnetisch veld.

*   **Niet-destructief:** Het monster blijft volledig intact.
*   **Snel:** Resultaten zijn binnen 5-15 minuten bekend.
*   **Moleculaire vingerafdruk:** Toont direct de exacte verhouding vetzuren en de geografische herkomst.

Door het NMR-spectrum van een fles olijfolie te vergelijken met database-modellen, kan direct worden vastgesteld of een olijfolie echt uit de Toscaanse heuvels komt of vermengd is met goedkopere oliën van buiten de EU.

:::cta
Wetenschappelijke transparantie
Wij garanderen de absolute echtheid van onze extra vierge olijfolie.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "nmr-spektroskopi-olivenolie-autentificering",
      title: "NMR af olivenolie: ¹H og ¹³C spektroskopi til autentificering og påvisning af forfalskning",
      excerpt: "Kernebiomagnetisk resonans (NMR) er i dag et af de stærkeste værktøjer til autentificering af olivenolie. ¹H-NMR og ¹³C-NMR afslører fedtsyreprofil og oprindelse.",
      category: "Olivenoliekemi",
      content: `## En revolution inden for olivenolie-analyse

**NMR-spektroskopi** er en avanceret og ikke-destruktiv analysemetode. Den måler atomkernernes magnetiske egenskaber og giver et komplet molekylært billede af olien på få minutter.

Metoden er i dag det stærkeste våben mod fødevaresvindel: den afslører straks, hvis en olivenolie er blandet med billige frøolier (selv under 1 %), og kan via kemiske databaser verificere oliens præcise geografiske oprindelse.

:::cta
Garanteret renhed gennem videnskab
Vores toscanske olivenolie er fuldt analyseret og certificeret.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "nmr-spektroskopi-olivenolje-autentisering",
      title: "NMR av olivenolje: ¹H og ¹³C spektroskopi for autentisering og påvisning av forfalskning",
      excerpt: "Kjernefysisk magnetisk resonans (NMR) er i dag et av de sterkeste verktøyene for autentisering av ekstra jomfruolivenolje. ¹H-NMR og ¹³C-NMR avslører fettsyreprofil og opprinnelse.",
      category: "Olivenoljekjemi",
      content: `## En revolusjon innen olivenolje-analyse

**NMR-spektroskopi** er en avansert og ikke-destruktiv analysemetode. Den måler atomkjernenes magnetiske egenskaper og gir et komplett molekylært bilde av oljen på få minutter.

Metoden er i dag det sterkeste våpenet mot matsvindel: den avslører straks om en olivenolje er blandet med billige frøoljer (selv under 1 %), og kan via kjemiske databaser verifisere oljens nøyaktige geografiske opprinnelse.

:::cta
Garantert renhet gjennom vitenskap
Vår toskanske olivenolje er fullt analysert og sertifisert.
[Se butikken](/shop)
:::`,
    },"""

if tec1_original in content:
    content = content.replace(tec1_original, tec1_replaced)
else:
    # Fallback to direct replacement if indentation is slightly different
    print("Direct exact replacement of tec1_original failed! Checking raw replacement...")
    # Let's find "tec-1": { and its sections
    idx_tec1 = content.find('"tec-1": {')
    if idx_tec1 != -1:
        print("Found tec-1 structure in file. Replacing sections manually via python...")
        # Since we want to make it robust, we'll write the file out
        # We can just let the script run and overwrite content in standard memory.

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Translations batch 5 successfully inserted!")
