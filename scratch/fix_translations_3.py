import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

start_marker = '  "ric-7": {'
end_marker = '  "tec-1": {'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

print(f"Replacing block of length {end_idx - start_idx} characters.")

new_block = """  "ric-7": {
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
      content: `## Raw fish does not forgive

When serving a swordfish carpaccio, a tuna tartare, or a raw red shrimp platter, every single ingredient is in the foreground — there are no thick sauces or cooking processes to compensate. The oil is the protagonist alongside the fish.

The golden rule: **the oil must not compete with the fish, it must expand it**.

## The ideal profile

For raw fish, the optimal profile is **light-medium fruity**, with:
- Notes of *fresh almond* or *fruity notes* (peach, apple)
- Almost absent or very mild bitterness
- Limited spiciness (it must not overpower the delicacy of the fish)

An intense fruity oil with decisive bitterness and spiciness will cover the iodized flavors of the sea — a classic beginner mistake.

## Specific pairings

- **Swordfish or tuna carpaccio**: light fruity, Maldon salt, a few drops of lemon. *Nothing else*.
- **Red shrimp tartare**: a drizzle of light fruity oil and grated lemon zest
- **Amberjack crudo**: delicate medium fruity + salt flakes + a few mint leaves
- **Opened oyster** (an unusual but magnificent pairing): a drop of light fruity oil enhances the marine sapidity

## The technique

1. Pour the oil **at the moment of serving** — not before, or the pH of the fish will start to "cook" the protein (ceviche effect)
2. Use a squeeze bottle or a spoon to dose precisely — do not be stingy, but do not drown it either
3. A pinch of **flaky salt** (Maldon, Fleur de sel) amplifies everything
4. Serve on a cold plate

:::cta
Our light fruity olive oil — ideal for raw seafood
[Shop now](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-fuer-rohen-fisch-und-carpaccio",
      title: "Olivenöl für rohen Fisch und Carpaccio: Welches passt und warum",
      excerpt: "Roher Fisch ist empfindlich – das Olivenöl muss ihn veredeln, ohne ihn zu dominieren. Hier ist das richtige Profil und die Technik für Carpaccio und Tatar.",
      category: "Rezepte & Kombinationen",
      content: `## Roher Fisch verzeiht nichts

Wenn Sie ein Schwertfisch-Carpaccio, ein Thunfisch-Tatar oder eine rohe rote Garnele servieren, steht jede einzelne Zutat im Vordergrund – es gibt keine dicken Saucen oder Garprozesse, die Fehler verzeihen. Das Öl ist zusammen mit dem Fisch der Hauptdarsteller.

Die goldene Regel: **Das Öl darf nicht mit dem Fisch konkurrieren, es muss ihn bereichern**.

## Das ideale Profil

Für rohen Fisch ist das optimale Profil ein **leicht- bis mittelfruchtiges Öl** mit:
- Noten von *frischen Mandeln* oder *fruchtigen Noten* (Pfirsich, Apfel)
- Fast fehlender oder sehr milder Bitterkeit
- Geringer Schärfe (sie darf die Zartheit des Fisches nicht übertönen)

Ein intensiv fruchtiges Öl mit kräftiger Bitterkeit und Schärfe übertönt die jodhaltigen Aromen des Meeres – ein klassischer Anfängerfehler.

## Spezifische Kombinationen

- **Schwertfisch- oder Thunfisch-Carpaccio**: Leicht fruchtig, Maldon-Salz, ein paar Tropfen Zitrone. *Sonst nichts*.
- **Rote Garnelen-Tatar**: Ein Faden leicht fruchtiges Öl und geriebene Zitronenschale
- **Bernsteinmakrele (Ricciola) roh**: Mild-mittelfruchtig + Salzflocken + ein paar Minzblätter
- **Geöffnete Auster** (eine ungewöhnliche, aber großartige Kombination): Ein Tropfen leicht fruchtiges Öl unterstreicht die maritime Salzigkeit

## Die Technik

1. Gießen Sie das Öl **erst beim Servieren** darüber – nicht vorher, da der pH-Wert des Fisches sonst beginnt, das Eiweiß zu „garen“ (Ceviche-Effekt)
2. Verwenden Sie ein Fläschchen oder einen Löffel, um präzise zu dosieren – sparen Sie nicht, aber ertränken Sie den Fisch auch nicht
3. Eine Prise **Salzflocken** (Maldon, Fleur de Sel) verstärkt alle Aromen
4. Auf einem kalten Teller servieren

:::cta
Unser leicht fruchtiges Olivenöl – ideal für rohe Meeresfrüchte
[Jetzt kaufen](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-voor-rauwe-vis-en-carpaccio",
      title: "Olijfolie voor rauwe vis en carpaccio: welke te kiezen en waarom",
      excerpt: "Rauwe vis is delicaat — de olijfolie moet het versterken zonder het te overheersen. Dit is het juiste profiel en de techniek voor carpaccio, tartaar en zeevruchten.",
      category: "Recepten & Combinaties",
      content: `## Rauwe vis vergeeft niets

Wanneer je een zwaardviscarpaccio, een tonijntartaar of rauwe rode garnalen serveert, staat elk ingrediënt op de voorgrond — er zijn geen dikke sauzen of kookprocessen die fouten kunnen verhullen. De olijfolie is samen met de vis de hoofdrolspeler.

De gouden regel: **de olijfolie moet niet concurreren met de vis, maar deze versterken**.

## Het ideale profiel

Voor rauwe vis is het optimale profiel **licht-medium fruitig**, met:
- Tonen van *verse amandel* of *fruitige tonen* (perzik, appel)
- Vrijwel afwezige of zeer milde bitterheid
- Beperkte pittigheid (het mag de delicatesse van de vis niet overheersen)

Een intens fruitige olijfolie met krachtige bittere en scherpe tonen overheerst de zilte smaken van de zee — een klassieke beginnersfout.

## Specifieke combinaties

- **Zwaardvis- of tonijncarpaccio**: licht fruitig, Maldon-zout, een paar druppels citroen. *Niets anders*.
- **Rode garnalentartaar**: een scheutje licht fruitige olijfolie en geraspte citroenschil
- **Rauwe makreel/amberjack**: delicaat medium fruitig + zoutvlokken + een paar muntblaadjes
- **Geopende oester** (een ongewone maar magnifieke combinatie): een drupje licht fruitige olijfolie versterkt de zilte zachtheid

## De techniek

1. Giet de olie **pas op het moment van serveren** — niet eerder, anders begint de zuurgraad van de vis het eiwit te "garen" (ceviche-effect)
2. Gebruik een doseerflesje of een lepel om nauwkeurig te doseren — wees niet te zuinig, maar verdrink de vis ook niet
3. Een snufje **zoutvlokken** (Maldon, Fleur de sel) versterkt alle smaken
4. Serveer op een koud bord

:::cta
Onze licht fruitige olijfolie — ideaal voor rauwe vis en zeevruchten
[Nu kopen](/shop)
:::`,
    },
    "da": {
      slug: "olivenolie-til-raa-fisk-og-carpaccio",
      title: "Olivenolie til rå fisk og carpaccio: Hvilken skal du vælge og hvorfor",
      excerpt: "Rå fisk er sart — olien skal fremhæve den uden at overdøve den. Her er den rigtige profil og teknik til perfekte carpaccioer, tartarer og rå skaldyr.",
      category: "Opskrifter & Parringer",
      content: `## Rå fisk tilgiver intet

Når du serverer en sværdfisk-carpaccio, en tunsalat eller en rå røde rejeanretning, er hver enkelt ingrediens i forgrunden — der er ingen tykke saucer eller tilberedning, der kompenserer. Olien er hovedpersonen sammen med fisken.

Den gyldne regel: **Olien må ikke konkurrere med fisken, den skal fremhæve den**.

## Den ideelle profil

Til rå fisk er den optimale profil **let-medium frugtig** med:
- Noter af *frisk mandel* eller *frugtagtige noter* (fersken, æble)
- Næsten fraværende eller meget mild bitterhed
- Begrænset skarphed (den må ikke overdøve fiskens delikatesse)

En intens frugtig olie med markant bitterhed og skarphed dækker over havets jodsmag — en klassisk begynderfejl.

## Specifikke sammensætninger

- **Sværdfisk- eller tuncarpaccio**: Let frugtig, Maldon-salt, et par dråber citron. *Intet andet*.
- **Rød rejetartar**: En lund ring af let frugtig olie og revet citronskal
- **Rå ravfisk (ricciola)**: Delikat medium frugtig + saltflager + et par mynteblade
- **Åbnet østers** (en usædvanlig men fantastisk kombination): En dråbe let frugtig olie fremhæver den saltede havsmag

## Teknikken

1. Hæld olien på **lige inden servering** — ikke før, da fiskens pH ellers begynder at "tilberede" proteinet (ceviche-effekt)
2. Brug en doseringsflaske eller en ske for at dosere præcist — vær ikke nærig, men drukkn den heller ikke
3. En knivspids **saltflager** (Maldon, Fleur de sel) fremhæver det hele
4. Server på en kold tallerken

:::cta
Vores let frugtige olivenolie – ideel til rå fisk og skaldyr
[Køb nu](/shop)
:::`,
    },
    "no": {
      slug: "olivenolje-til-raa-fisk-og-carpaccio",
      title: "Olivenolje til rå fisk og carpaccio: Hvilken bør du velge og hvorfor",
      excerpt: "Rå fisk er sart — oljen må fremheve den uten å overdøve den. Her er den riktige profilen og teknikken for perfekte carpaccioer, tartarer og rå skalldyr.",
      category: "Oppskrifter & Parringer",
      content: `## Rå fisk tilgir ingenting

Når du serverer en sverdvisk-carpaccio, en tuntartar eller et rått røde reker-fat, er hver enkelt ingrediens i forgrunnen — det er ingen tykke sauser eller varmebehandling som kompenserer. Oljen er hovedpersonen sammen med fisken.

Den gylne regelen: **Oljen må ikke konkurrere med fisken, den må utvide den**.

## Den ideelle profilen

Til rå fisk er den optimale profilen **lett-medium fruktig** med:
- Toner av *fersk mandel* eller *fruktige toner* (fersken, eple)
- Nesten fraværende eller veldig mild bitterhet
- Begrenset skarphet (den må ikke overdøve fiskens delikatesse)

En intens fruktig olje med markant bitterhet og skarphet dekker over havets jodsmak — en klassisk nybegynnerfeil.

## Spesifikke sammensetninger

- **Sverdfisk- eller tuntartar**: Lett fruktig, Maldon-salt, et par dråper sitron. *Ingenting annet*.
- **Rød reketartar**: En stripe lett fruktig olje og revet sitronskall
- **Rå ravfisk**: Delikat medium fruktig + saltflak + et par mynteblader
- **Åpnet østers** (en uvanlig men fantastisk kombinasjon): En dråpe lett fruktig olje fremhever den saltede havsmaken

## Teknikken

1. Hell oljen på **rett før servering** — ikke før, da fiskens pH ellers begynner å "tilberede" proteinet (ceviche-effekt)
2. Bruk en doseringsflaske eller en skje for å dosere presist — ikke vær gjerrig, men ikke drukn den heller
3. En klype **saltflak** (Maldon, Fleur de sel) fremhever alt
4. Server på en kald tallerken

:::cta
Vår lett fruktige olivenolje – ideell til rå fisk og skalldyr
[Kjøp nå](/shop)
:::`,
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
      content: `## The contrast that works

Grilled meat, especially red meat (Florentine T-bone steak, sliced beef tagliata, ribeye), has strong sensory characteristics: **fatness, sapidity, char/smoky notes, and intense umami**. A delicate oil would get completely lost.

You need an oil with character — and **intense fruity** is the perfect choice.

## Why intense fruity works on meat

The contrast between the **meat's fat** and the **bitterness/spiciness of the intense fruity oil** creates one of the most balanced combinations ever:

- The bitterness of the polyphenols "cleanses" the palate of the meat's fat
- The spiciness of the oleocanthal creates a pleasant contrast with the sapidity
- The green and herbaceous notes of the oil integrate with the smoky char notes

It is the principle of contrast: opposing flavors that amplify each other.

## How to use it

Olive oil on meat is **always used raw, after cooking**:

1. Grill the meat to the desired level of doneness (for the Florentine steak: rare!)
2. Remove from heat and let it rest for 2 minutes on the cutting board
3. Slice (for large cuts of meat)
4. **Pour a generous drizzle of intense fruity oil** onto the warm slices
5. Top with coarse salt or Maldon salt
6. Serve immediately

The residual warmth of the meat opens up the aromas of the oil without cooking it — the perfect moment.

## Other meat pairings

- **Grilled lamb**: intense fruity oil with herbal notes (rosemary, thyme in the oil)
- **Veal liver**: the oil's bitterness balances the iron-rich flavor of the liver
- **Spit-roasted chicken**: medium fruity — white meat cannot handle robust intense oil

:::cta
Our robust fruity olive oil — the choice of the grill
[Order now](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-fuer-gegrilltes-fleisch-intensiv-fruchtig",
      title: "Olivenöl für gegrilltes Fleisch: Intensiv fruchtig und der Grund für den Kontrast",
      excerpt: "Gegrilltes Steak mit einem Faden intensiv fruchtigem Olivenöl ist ein kraftvolles Erlebnis. Der Kontrast zwischen tierischem Fett und pflanzlicher Bitterkeit ist genial.",
      category: "Rezepte & Kombinationen",
      content: `## Der Kontrast, der funktioniert

Gegrilltes Fleisch, insbesondere rotes Fleisch (Florentiner T-Bone-Steak, Tagliata vom Rind, Entrecôte), hat starke sensorische Eigenschaften: **Fettgehalt, Salzigkeit, Rauchnoten der Glut und intensives Umami**. Ein mildes Öl würde komplett untergehen.

Hier wird ein Öl mit Charakter benötigt – und **intensiv fruchtig** ist die perfekte Wahl.

## Warum intensiv fruchtiges Öl auf Fleisch funktioniert

Der Kontrast zwischen dem **Fett des Fleisches** und der **Bitterkeit/Schärfe des intensiv fruchtigen Öls** schafft eine der ausgewogensten Kombinationen überhaupt:

- Die Bitterkeit der Polyphenole „reinigt“ den Gaumen vom Fett des Fleisches
- Die Schärfe des Oleocanthals bildet einen angenehmen Kontrast zur Salzigkeit
- Die grünen und kräuterigen Noten des Öls verbinden sich harmonisch mit den Rauchnoten der Glut

Das ist das Prinzip des Kontrasts: Gegensätzliche Geschmäcker, die sich gegenseitig verstärken.

## Wie man es verwendet

Olivenöl auf Fleisch wird **immer erst nach dem Garen und roh verwendet**:

1. Grillen Sie das Fleisch auf den gewünschten Garpunkt (beim Florentiner Steak: blutig!)
2. Vom Herd nehmen und 2 Minuten auf dem Schneidebrett ruhen lassen
3. In Scheiben schneiden (bei großen Fleischstücken)
4. **Einen großzügigen Faden intensiv fruchtiges Öl** auf die noch warmen Scheiben gießen
5. Grobes Salz oder Maldon-Salz darüber geben
6. Sofort servieren

Die Restwärme des Fleisches entfaltet die Aromen des Öls, ohne es zu kochen – der perfekte Moment.

## Weitere Kombinationen mit Fleisch

- **Gegrilltes Lamm**: Intensiv fruchtiges Öl mit Kräuternoten (Rosmarin, Thymian)
- **Kalbsleber**: Die Bitterkeit des Öls gleicht den eisernen Geschmack der Leber aus
- **Hähnchen am Spieß**: Mittelfruchtig – weißes Fleisch verträgt kein intensiv fruchtiges Öl

:::cta
Unser intensiv fruchtiges Olivenöl – die Wahl für den Grill
[Jetzt bestellen](/shop)
:::`,
    },
    "nl": {
      slug: "olijfolie-voor-gegrild-vlees-intensief-fruitig",
      title: "Olijfolie voor gegrild vlees: intensief fruitig en het geheim van het contrast",
      excerpt: "Gegrilde biefstuk met een scheutje intensief fruitige extra vierge olijfolie is een krachtige zintuiglijke ervaring. Het contrast tussen dierlijk vet en plantaardige bitterheid is magistraal.",
      category: "Recepten & Combinaties",
      content: `## Het contrast dat werkt

Gegrild vlees, vooral rood vlees (Bistecca alla Fiorentina, tagliata van rundvlees, entrecote), heeft sterke smaakeigenschappen: **vet, zout, tonen van de barbecue en intens umami**. Een subtiele olijfolie zou hier volledig in wegvallen.

Je hebt een olijfolie met karakter nodig — en **intens fruitig** is de perfecte keuze.

## Waarom intens fruitig werkt op vlees

Het contrast tussen het **vet van het vlees** en de **bitterheid/pittigheid van de intens fruitige olie** creëert een van de meest gebalanceerde combinaties ooit:

- De bitterheid van de polifenolen "reinigt" het palet van het vet van het vlees
- De scherpe tonen van het oleocanthal zorgen voor een aangenaam contrast met het zout
- De groene en kruidachtige tonen van de olie gaan prachtig samen met de barbecuesmaak

Dit is het principe van contrast: tegenovergestelde smaken die elkaar versterken.

## Hoe te gebruiken

Olijfolie op vlees wordt **altijd rauw gebruikt, na de bereiding**:

1. Gril het vlees tot de gewenste gaarheid (voor een Florentijnse steak: rare!)
2. Haal van het vuur en laat 2 minuten rusten op de snijplank
3. Snijd in plakken (voor grote stukken vlees)
4. **Giet een gulle scheut intens fruitige olijfolie** over de nog warme plakken
5. Strooi er grof zout of Maldon-zout overheen
6. Serveer direct

De restwarmte van het vlees opent de aroma's van de olijfolie zonder deze te verhitten — het perfecte moment.

## Andere combinaties met vlees

- **Gegrild lamsvlees**: intens fruitige olijfolie met kruidachtige tonen (rozemarijn, tijm in de olie)
- **Kalflever**: de bitterheid van de olijfolie balanceert de ijzersmaak van lever
- **Kip aan het spit**: medium fruitig — wit vlees kan een intens fruitige olie niet verdragen

:::cta
Onze intens fruitige olijfolie — dé keuze voor de barbecue
[Bestel nu](/shop)
:::`,
    },
    "da": {
      slug: "olivenolie-til-grillet-koed-intens-frugtighed",
      title: "Olivenolie til grillet kød: Intens frugtighed og hemmeligheden bag kontrasten",
      excerpt: "Grillet steak med et stænk af intens frugtig ekstra jomfruolivenolie is en kraftfuld oplevelse. Kontrasten mellem animalsk fedt og vegetabilsk bitterhed er genial.",
      category: "Opskrifter & Parringer",
      content: `## Kontrasten, der virker

Grillet kød, især rødt kød (bistecca fiorentina, oksetagliata, entrecôte), har stærke smagsnuancer: **fedme, salt, smag af grill og intens umami**. En delikat olie ville forsvinde fuldstændig.

Der er brug for en olie med karakter — og **intensiv frugtig** er det perfekte valg.

## Hvorfor intensiv frugtig olie virker på kød

Kontrasten mellem **kødets fedt** og **bitterheden/skarpheden i den intensive frugtige olie** skaber en af de mest balancerede kombinationer nogensinde:

- Oliens bitterhed (polyfenoler) "renser" ganen for kødets fedme
- Skarpheden fra oleocanthal skaber en behagelig kontrast til saltet
- De grønne og urtede noter i olien smelter sammen med grillsmagen

Det er kontrastens princip: Modstridende smage, der fremhæver hinanden.

## Sådan gør du

Olivenolie på kød skal **altid bruges råt, efter tilberedning**:

1. Grill kødet til den ønskede tilberedningsgrad (for en bistecca fiorentina: rød!)
2. Tag kødet af varmen, og lad det hvile i 2 minutter på et skærebræt
3. Skær det i skiver (ved store udskæringer)
4. **Hæld en generøs ring af intensiv frugtig olie** over de lune skiver
5. Drys med groft salt eller Maldon-salt
6. Server straks

Kødets restvarme åbner op for oliens aromaer uden at varmebehandle den — det perfekte øjeblik.

## Andre parringer med kød

- **Grillet lam**: Intensiv frugtig olie med noter af krydderurter (rosmarin, timian)
- **Kalvelever**: Oliens bitterhed balancerer leverens jernagtige smag
- **Kylling på spyd**: Medium frugtig — lyst kød kan ikke klare den intense olie

:::cta
Vores intense frugtige olivenolie – det perfekte valg til grillen
[Bestil nu](/shop)
:::`,
    },
    "no": {
      slug: "olivenolje-til-grillet-kjoett-intens-fruktighet",
      title: "Olivenolje til grillet kjøtt: Intens fruktighet og hemmeligheten bak kontrasten",
      excerpt: "Grillet biff med en stråle intens fruktig ekstra jomfruolivenolje er en kraftfull opplevelse. Kontrasten mellom animalsk fett og vegetabilsk bitterhet er mesterlig.",
      category: "Oppskrifter & Parringer",
      content: `## Kontrasten som fungerer

Grillet kjøtt, spesielt rødt kjøtt (Bistecca alla Fiorentina, tagliata av storfekjøtt, entrecôte), har sterke smaksnyanser: **fedme, salt, smak av grill og intens umami**. En delikat olje ville forsvinne fullstendig.

Du trenger en olje med karakter — og **intens fruktig** er det perfekte valget.

## Hvorfor intens fruktig olje fungerer på kjøtt

Kontrasten mellom **kjøttets fett** og **bitterheten/skarpheten i den intense fruktige oljen** skaper en av de mest balanserte kombinasjonene noensinne:

- Oljens bitterhet (polyfenoler) "renser" ganen for kjøttets fedme
- Skarpheten fra oleocanthal skaper en behagelig kontrast til saltet
- De grønne og urteaktige notene i oljen smelter sammen med grillsmaken

Det er kontrastens prinsipp: Motsetninger som fremhever hverandre.

## Slik gjør du

Olivenolje på kjøtt skal **alltid brukes rått, etter tilberedning**:

1. Grill kjøttet til ønsket stegrad (for en bistecca fiorentina: rå/blodig!)
2. Ta kjøttet av varmen, og la det hvile i 2 minutter på et skjærebrett
3. Skjær det i skiver (ved store utskjæringer)
4. **Hell en generøs stripe av intens fruktig olje** over de lune skivene
5. Dryss med grovt salt eller Maldon-salt
6. Server straks

Kjøttets restvarme åpner opp for oljens aromaer uten å varmebehandle den — det perfekte øyeblikket.

## Andre parringer med kjøtt

- **Grillet lam**: Intens fruktig olje med noter av krydderurter (rosmarin, timian)
- **Kalvelever**: Oljens bitterhet balanserer leverens jernaktige smak
- **Kylling på spidd**: Medium fruktig — lyst kjøtt tåler ikke den intense oljen

:::cta
Vår intense fruktige olivenolje – det perfekte valget til grillen
[Bestill nå](/shop)
:::`,
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
      content: `## Olive oil in pizza: two different moments

There are two ways in which olive oil interacts with pizza, and they have completely different effects:

1. **The oil in the dough**: a tablespoon of EVOO in the dough is used for structure — it makes the crumb softer and helps the crust crisp up. Here, quality is less critical.

2. **The oil as a raw finisher** (after exiting the oven): here, quality is essential — this is the oil you actually taste.

## At what temperature does your oil end up?

A pizza exits a wood-fired or stone deck oven at **300–450°C** in the center. If you add the oil before baking, you are cooking it at extremely high temperatures — destroying all polyphenols and delicate aromas. It is a waste.

The correct technique: **always apply olive oil out of the oven, on the finished and still-hot pizza**.

## Which profile for which pizza

- **Classic Margherita**: *medium fruity* — the balance between tomato and mozzarella cannot handle extremes
- **White pizza with mushrooms**: *medium-intense fruity* — mushrooms have an earthy flavor that stands up to a bolder oil
- **Marinara** (garlic, tomato, oregano, no cheese): *intense fruity* — the robust ingredients want an oil with character
- **Vegetarian/grilled veggie pizza**: *medium fruity*
- **Stuffed Calzone**: a generous drizzle of *medium fruity* right out of the oven

## The quantity

Do not be afraid to use it: **one generous swirl** on the crust and across the surface while the pizza is still hot. The oil integrates with the residual warmth — it is at that exact moment that the pizza goes from good to memorable.`,
    },
    "de": {
      slug: "olivenoel-fuer-pizza-roh-oder-nach-dem-backen",
      title: "Olivenöl für Pizza: Roh oder erst nach dem Backen? Welches Profil und wann",
      excerpt: "Olivenöl auf der Pizza ist fast schon ein Reflex. Aber welches Öl passt, wann kommt es drauf und warum? Ein kleiner Leitfaden für Hobby-Pizzabäcker.",
      category: "Rezepte & Kombinationen",
      content: `## Olivenöl bei der Pizza: Zwei völlig verschiedene Momente

Olivenöl interagiert auf zwei Arten mit der Pizza, und beide haben völlig unterschiedliche Auswirkungen:

1. **Das Öl im Teig**: Ein Esslöffel Olivenöl Extra Vergine im Teig dient der Struktur – es macht die Krume weicher und sorgt dafür, dass der Rand knuspriger wird. Hier ist die absolute Spitzenqualität nicht entscheidend.

2. **Das Öl als rohes Finish** (nach dem Backen): Hier ist die Qualität entscheidend – das ist das Öl, das Sie wirklich schmecken.

## Welcher Temperatur wird Ihr Öl ausgesetzt?

Eine Pizza verlässt einen Holz- oder Steinofen mit **300–450 °C** in der Mitte. Wenn Sie das Öl vor dem Backen hinzufügen, kochen Sie es bei extrem hohen Temperaturen – und zerstören alle Polyphenole und feinen Aromen. Das ist reine Verschwendung.

Die richtige Technik: **Das Olivenöl immer erst nach dem Backen auf die fertige und noch heiße Pizza geben**.

## Welches Profil für welche Pizza

- **Klassische Margherita**: *mittelfruchtig* – die Balance zwischen Tomate und Mozzarella verträgt keine Extreme
- **Weiße Pizza mit Pilzen**: *mittelfruchtig bis intensiv* – Pilze haben einen erdigen Geschmack, der ein kräftigeres Öl verlangt
- **Marinara** (Knoblauch, Tomate, Oregano, ohne Käse): *intensiv fruchtig* – die kräftigen Zutaten verlangen nach einem Öl mit Charakter
- **Pizza mit Grillgemüse**: *mittelfruchtig*
- **Gefüllte Calzone**: Ein großzügiger Faden *mittelfruchtiges* Öl direkt nach dem Backen

## Die Menge

Sparen Sie nicht am falschen Ende: **Ein großzügiger Kreis** auf den Rand und die Oberfläche, während die Pizza noch dampft. Das Öl verbindet sich mit der Restwärme – genau in diesem Moment wird eine gute Pizza zu einem unvergesslichen Genuss.`,
    },
    "nl": {
      slug: "olijfolie-voor-pizza-rauw-of-na-het-bakken",
      title: "Olijfolie voor pizza: rauw of na het bakken? Welk profiel en wanneer toe te voegen",
      excerpt: "Olijfolie over de pizza is bijna een automatisme — maar wie vraagt zich af welke olie te gebruiken, wanneer toe te voegen en waarom? Korte gids voor thuisbakkers.",
      category: "Recepten & Combinaties",
      content: `## Olijfolie in pizza: twee verschillende momenten

Er zijn twee manieren waarop olijfolie met pizza reageert, en ze hebben een totaal verschillend effect:

1. **De olie in het deeg**: een eetlepel extra vierge olijfolie in het deeg is bedoeld voor de structuur — het maakt het deeg zachter en helpt de korst knapperig te worden. Hier is de kwaliteit minder kritisch.

2. **De olie als rauwe finishing touch** (na het bakken): hier is de kwaliteit essentieel — dit is de olijfolie die je echt proeft.

## Aan welke temperatuur wordt je olijfolie blootgesteld?

Een pizza komt uit een houtoven of steenoven met een temperatuur van **300–450°C** in het midden. Als je de olie vóór het bakken toevoegt, kook je deze op extreem hoge temperaturen — waardoor alle polifenolen en delicate aroma's verloren gaan. Dat is zonde.

De juiste techniek: **olijfolie altijd toevoegen nádat de pizza uit de oven komt, op het warme product**.

## Welk profiel voor welke pizza

- **Klassieke Margherita**: *medium fruitig* — de balans tussen tomaat en mozzarella verdraagt geen extreme smaken
- **Pizza Bianca met paddenstoelen**: *medium-intens fruitig* — de paddenstoel heeft een aardse smaak die bestand is tegen een krachtigere olie
- **Marinara** (knoflook, tomaat, oregano, geen kaas): *intens fruitig* — de robuuste ingrediënten vragen om een olijfolie met karakter
- **Pizza met gegrilde groenten**: *medium fruitig*
- **Gevulde Calzone**: een gulle scheut *medium fruitige* olie direct na het bakken

## De hoeveelheid

Wees niet te zuinig: **een gulle draai** over de korst en het oppervlak terwijl de pizza nog heet is. De olijfolie integreert met de restwarmte — op dat exacte moment verandert de pizza van goed in gedenkwaardig.`,
    },
    "da": {
      slug: "olivenolie-til-pizza-raa-eller-efter-bagning",
      title: "Olivenolie til pizza: Rå eller efter bagning? Hvilken profil og hvornår",
      excerpt: "Olivenolie på pizza er næsten automatisk — men hvor mange tænker over, hvilken olie man skal bruge, hvornår den skal på og hvorfor? Mini-guide til hjemmebagere.",
      category: "Opskrifter & Parringer",
      content: `## Olivenolie på pizzaen: To helt forskellige øjeblikke

Der er to måder, hvorpå olivenolie interagerer med pizza, og de har vidt forskellige virkninger:

1. **Olien i dejen**: En spiseskefuld ekstra jomfruolivenolie i dejen tjener til strukturen — den gør krummen blødere og hjælper kanten (cornicione) med at blive dejlig sprød. Her er den absolutte topkvalitet ikke afgørende.

2. **Olien som rå finisher** (lige efter bagningen): Her er kvaliteten yderst vigtig — det er den olie, du rent faktisk kan smage.

## Hvilken temperatur udsættes din olie for?

En pizza forlader en træfyret ovn eller stenovn ved **300–450 °C** i midten. Hvis du tilføjer olien før bagningen, koger du den ved ekstremt høje temperaturer — og ødelægger alle polyfenoler og fine aromaer. Det er spild.

Den rigtige teknik: **Olivenolien skal altid hældes over efter bagningen på den færdige og rygende varme pizza**.

## Hvilken profil til hvilken pizza

- **Klassisk Margherita**: *medium frugtig* — balancen mellem tomat og mozzarella tåler ikke ekstremer
- **Hvid pizza med svampe**: *medium-intensiv frugtig* — svampe har en jordagtig smag, der matcher en mere markant olie
- **Marinara** (hvidløg, tomat, oregano, uden ost): *intensiv frugtig* — de kraftige ingredienser kræver en olie med masser af karakter
- **Pizza med grillede grøntsager**: *medium frugtig*
- **Indbagt Calzone**: En generøs ring af *medium frugtig* olie umiddelbart efter bagning

## Mængden

Vær ikke bange for at bruge den: **En generøs ring** over kanten og overfladen, mens pizzaen stadig er rygende varm. Olien smelter sammen med restvarmen — det er lige netop i dette øjeblik, pizzaen går fra at være god til at være uforglemmelig.`,
    },
    "no": {
      slug: "olivenolje-til-pizza-raa-eller-etter-steking",
      title: "Olivenolje til pizza: Rå eller etter steking? Hvilken profil og når",
      excerpt: "Olivenolje på pizza er nesten automatisk – men hvor mange tenker over hvilken olje man skal bruke, når den skal på og hvorfor? En liten guide for hjemmebaking.",
      category: "Oppskrifter & Parringer",
      content: `## Olivenolje på pizzaen: To helt forskjellige øyeblikk

Det er to måter som olivenolje interagerer med pizza på, og de har vidt forskjellige virkninger:

1. **Oljen i deigen**: En spiseskje ekstra jomfruolivenolje i deigen er for strukturen — den gjør krummen mykere og hjelper kanten med å bli sprø. Her er den absolutte toppkvaliteten ikke avgjørende.

2. **Oljen som rå finisher** (rett etter steking): Her er kvaliteten utrolig viktig — det er denne oljen du faktisk smaker.

## Hvilken temperatur utsettes oljen din for?

En pizza forlater en vedfyrt ovn eller steinplate på **300–450 °C** i midten. Hvis du tilsetter oljen før steking, koker du den på ekstremt høye temperaturer — og ødelegger alle polyfenoler og fine aromaer. Det er sløseri.

Den riktige teknikken: **Olivenoljen skal alltid helles over etter steking, på den ferdige og rykende varme pizzaen**.

## Hvilken profil til hvilken pizza

- **Klassisk Margherita**: *medium fruktig* — balansen mellom tomat og mozzarella tåler ikke ekstremer
- **Hvit pizza med sopp**: *medium-intens fruktig* — sopp har en jordaktig smak som matcher en mer markert olje
- **Marinara** (hvitløk, tomat, oregano, uten ost): *intens fruktig* — de kraftige ingrediensene krever en olje med masse karakter
- **Pizza med grillede grønnsaker**: *medium fruktig*
- **Innbakt Calzone**: En generøs stripe med *medium fruktig* olje umiddelbart etter steking

## Mengden

Ikke vær redd for å bruke den: **En generøs stripe** over kanten og overflaten mens pizzaen fortsatt er rykende varm. Oljen smelter sammen med restvarmen — det er akkurat i dette øyeblikket pizzaen går fra å være god til å være uforglemmelig.`,
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
      content: `## What is the winey-vinegary defect?

If an olive oil reminds you of "spoiled" wine or vinegar, it is not a curious nuance: it is almost always a defect. The **winey-vinegary** note arises when olives, before being milled, enter a **fermentation** phase. At that moment, the fruit loses its cleanliness and the oil stops smelling green and fresh, turning in a "winey-acidic" direction that should never appear in an extra virgin olive oil.

It is a frustrating defect because it covers everything: it dulls the fruitiness and leaves a sharp, unharmonious sensation that is felt even on a simple dish.

## Why does it happen?

Usually, it occurs due to a very specific combination of factors: **time** and **olive management**. The olives are harvested but then left sitting for too long before milling. If they are kept in a warm environment, if they are piled up, if they cannot "breathe," or if the batch is already stressed (damaged, insect-bitten, or overripe olives), microorganisms find the perfect environment to multiply.

It is one of those situations where very little is needed to change the result: you might not notice it by eye, but the oil tells you immediately on the nose.

## The chemical mechanism

When fermentations start, specific volatile compounds typical of that environment increase: "alcoholic" and "acetic" components (such as ethanol and acetic acid) and, often, **ethyl acetate**, which is responsible for that sharp, slightly "fermented" sensation that recalls wine or vinegar.

You do not need to remember the names: the important thing is that these compounds shift the aroma to a register foreign to EVOO. It is as if the oil stopped speaking of fresh olives and started speaking of uncontrolled transformations.

## How to recognize it

### By smell

Here, it is usually quite clear: you get notes of **wine vinegar**, **oxidized wine**, or fruit that has started to ferment. Sometimes it can also have a "cellar" impression, but the difference is that the winey defect is more **acidic and sharp**, less "damp."

A healthy oil, even an intense one, tends to give you green signals (grass, artichoke, tomato, fresh almond). The winey defect, on the other hand, seems to "go off track" and lead you to aromas you do not expect from an extra virgin.

### In the mouth

In the mouth, the winey defect is not the elegant spiciness of polyphenols. The **good spiciness** is clean, lively, felt in the throat, and accompanies a present fruitiness. The winey defect, on the other hand, gives a more "unbalanced" sensation: sharp, winey, sometimes almost slightly solvent-like, and above all, it lacks that vegetable freshness.

### A simple test at home

If you have a doubt, try pouring a drizzle of oil into a small glass and warm it for a few seconds in your hands. Then smell it with small breaths: if the vinegar/wine note emerges clearly and "takes the stage," it is highly likely the winey defect.

## Prevention in the supply chain

This defect is almost always the result of the phase preceding the mill: **long waiting times**, olives kept in poorly ventilated conditions, compact piles that heat up internally, wrong containers (like closed plastic bags), or batches that are not perfectly healthy processed as if they were. Hygiene also matters: residues and dirt facilitate fermentation and amplify the problem.

In short, it is the classic defect that tells you: "the work here was not done fast enough and clean enough."

:::cta
Want a clean EVOO, free of fermentation notes?
Quality comes from healthy olives and rapid processing: that is where everything is decided.
[Discover the oils in our shop](/shop)
:::`,
    },
    "de": {
      slug: "stichig-essigartiger-fehler-olivenoel-ursachen",
      title: "Stichig-essigartiger Fehler in Olivenöl: Ursachen, Erkennung und Vermeidung",
      excerpt: "Öl, das nach Essig schmeckt, ist kein gutes Öl – es handelt sich um einen Gärungsfehler. Erfahren Sie, woher er kommt und wie er vermieden wird.",
      category: "Olivenölfehler",
      content: `## Was ist der stichig-essigartige Fehler?

Wenn ein Olivenöl Sie an „umgekippten“ Wein oder Essig erinnert, ist das keine interessante Nuance, sondern fast immer ein Fehler. Die **stichig-essigartige** Note entsteht, wenn die Oliven vor dem Pressen in eine **Gärungsphase** übergehen. In diesem Moment verliert die Frucht ihre Reinheit und das Öl riecht nicht mehr grün und frisch, sondern nimmt eine „weinartig-saure“ Richtung an, die in einem nativen Olivenöl Extra niemals vorkommen sollte.

Es ist ein störender Fehler, da er alles überdeckt: Er dämpft die Fruchtigkeit und hinterlässt ein scharfes, unharmonisches Gefühl, das man selbst auf einem einfachen Gericht herausschmeckt.

## Warum passiert das?

Normalerweise geschieht dies durch eine sehr konkrete Kombination von Faktoren: **Zeit** und **Handhabung der Oliven**. Die Oliven werden geerntet, bleiben dann aber vor dem Pressen zu lange liegen. Wenn sie in einer warmen Umgebung gelagert werden, wenn sie aufgehäuft werden, wenn sie nicht „atmen“ können oder wenn die Charge bereits beschädigt ist (angestochene, überreife Oliven), finden Mikroorganismen die perfekte Umgebung, um sich zu vermehren.

Das ist eine jener Situationen, in denen wenig ausreicht, um das Ergebnis zu verändern: Man sieht es vielleicht mit bloßem Auge nicht, aber das Öl verrät es einem sofort in der Nase.

## Der chemische Mechanismus

Wenn die Gärung einsetzt, steigen bestimmte flüchtige Verbindungen an: „alkoholische“ und „essigsaure“ Komponenten (wie Ethanol und Essigsäure) und häufig **Ethylacetat**, das für dieses scharfe, leicht „vergorene“ Gefühl verantwortlich ist, das an Wein oder Essig erinnert.

Sie müssen sich die Namen nicht merken: Wichtig ist, dass diese Verbindungen das Aroma in einen Bereich verschieben, der dem Olivenöl Extra Vergine völlig fremd ist. Es ist, als ob das Öl aufhören würde, von frischen Oliven zu sprechen, und anfängt, von unkontrollierten Umwandlungen zu erzählen.

## Wie man es erkennt

### Am Geruch

Hier ist es meist recht eindeutig: Man nimmt Noten von **Weinessig**, **oxidiertem Wein** oder angegorenem Obst wahr. Manchmal kann es auch einen „Kellergeruch“ haben, aber der Unterschied ist, dass der stichige Fehler **saurer und stechender** ist, weniger „feucht“.

Ein gesundes Öl, selbst ein intensives, neigt dazu, Ihnen grüne Signale zu geben (Gras, Artischocke, Tomate, frische Mandel). Der stichige Fehler hingegen scheint „aus der Bahn zu geraten“ und führt zu Aromen, die man von einem Extra Vergine nicht erwartet.

### Im Mund

Im Mund äußert sich der stichige Fehler nicht durch die elegante Schärfe von Polyphenolen. Die **gute Schärfe** ist sauber, lebendig, im Rachen spürbar und begleitet eine vorhandene Fruchtigkeit. Der stichige Fehler hingegen hinterlässt ein eher „unharmonisches“ Gefühl: stechend, weinartig, manchmal fast leicht lösungsmittelartig, und vor allem fehlt ihm die pflanzliche Frische.

## Vermeidung in der Erzeugerkette

Dieser Fehler ist fast immer das Ergebnis der Phase vor der Ölmühle: **zu lange Wartezeiten**, unzureichend belüftete Lagerung der Oliven, kompakte Haufen, die sich im Inneren erwärmen, falsche Behälter (wie geschlossene Plastiksäcke) oder nicht perfekt gesunde Partien, die unvorsichtig verarbeitet werden. Auch die Hygiene spielt eine Rolle: Rückstände und Schmutz begünstigen Gärungsprozesse.

Kurz gesagt, es ist der klassische Fehler, der besagt: „Hier wurde nicht schnell und sauber genug gearbeitet.“

:::cta
Möchten Sie ein sauberes Olivenöl Extra Vergine ohne Gärungsnoten?
Qualität entsteht durch gesunde Oliven und schnelle Verarbeitung.
[Entdecken Sie die Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "wijnachtig-azijnachtig-defect-olijfolie-oorzaken",
      title: "Wijnachtig-azijnachtig defect in olijfolie: oorzaken, herkenning en preventie",
      excerpt: "Olijfolie die naar azijn smaakt is geen goede olie — het is een olie met een gistingsdefect. Ontdek waar het vandaan komt en hoe je het voorkomt in de productie.",
      category: "Olijfolie-defecten",
      content: `## Wat is het wijnachtig-azijnachtige defect?

Als een olijfolie je doet denken aan "bedorven" wijn of azijn, is dat geen interessante nuance: het is bijna altijd een defect. De **wijnachtige-azijnachtige** noot ontstaat wanneer olijven, voordat ze worden geperst, in een **gistingsfase** terechtkomen. Op dat moment verliest de vrucht zijn zuiverheid en ruikt de olie niet meer groen en vers, maar neemt een "wijnachtig-zure" richting aan die nooit in een extra vierge olijfolie mag voorkomen.

Het is een storend defect omdat het alles overheerst: het vlakt de fruitigheid af en laat een scherpe, onharmonische sensatie achter die zelfs op een eenvoudig gerecht te proeven is.

## Waarom gebeurt dit?

Meestal gebeurt dit door een zeer specifieke combinatie van factoren: **tijd** en **omgang met de olijven**. De olijven worden geoogst maar blijven vervolgens te lang liggen voor het persen. Als ze in een warme omgeving worden bewaard, als ze worden opgestapeld, als ze niet kunnen "ademen" of als de partij al beschadigd is (aangetaste, overrijpe olijven), vinden micro-organismen de perfecte omgeving om zich te vermenigvuldigen.

Het is een van die situaties waarin er maar weinig nodig is om het resultaat te veranderen: je ziet het misschien niet met het blote oog, maar de olijfolie vertelt het je meteen in de neus.

## Het chemische mechanisme

Wanneer de gisting begint, nemen specifieke vluchtige verbindingen die typisch zijn voor die omgeving toe: "alcoholische" en "azijnachtige" componenten (zoals ethanol en azijnzuur) en vaak **ethylacetaat**, dat verantwoordelijk is voor die scherpe, licht "gegiste" sensatie die doet denken aan wijn of azijn.

Je hoeft de namen niet te onthouden: het belangrijkste is dat deze verbindingen het aroma verschuiven naar een register dat vreemd is aan extra vierge olijfolie. Het is alsof de olie stopt met spreken over verse olijven en begint te spreken over ongecontroleerde processen.

## Hoe herken je het?

### Via de neus

Hier is het meestal vrij duidelijk: je ruikt tonen van **wijnazijn**, **geoxideerde wijn** of fruit dat is gaan gisten. Soms kan het ook een "kelderlucht" hebben, maar het verschil is dat het wijnachtige defect **zuurder en scherper** is, minder "vochtig".

Een gezonde olie, zelfs een intense, neigt ertoe groene signalen te geven (gras, artisjok, tomaat, verse amandel). Het wijnachtige defect daarentegen wijkt af van het juiste pad en leidt naar aroma's die je niet verwacht van een extra vierge olijfolie.

### In de mond

In de mond uit het wijnachtige defect zich niet als de elegante pittigheid van polifenolen. De **goede pittigheid** is zuiver, levendig, voelbaar achter in de keel en begeleidt een aanwezige fruitigheid. Het wijnachtige defect daarentegen geeft een meer "ongebalanceerd" gevoel: scherp, wijnachtig, soms bijna licht oplosmiddelachtig, en bovenal mist het die plantaardige frisheid.

## Preventie in de keten

Dit defect is bijna altijd het resultaat van de fase voorafgaand aan de persing: **te lange wachttijden**, olijven bewaard in slecht geventileerde omstandigheden, compacte hopen die van binnen opwarmen, verkeerde containers (zoals gesloten plastic zakken) of partijen die niet perfect gezond zijn en onvoorzichtig worden verwerkt. Hygiëne speelt ook een rol: residuen en vuil bevorderen gistingsprocessen.

Kortom, het is het klassieke defect dat zegt: "er is hier niet snel en schoon genoeg gewerkt."

:::cta
Wilt u een zuivere extra vierge olijfolie, vrij van gistingsnoten?
Kwaliteit ontstaat door gezonde olijven en een snelle verwerking.
[Ontdek de oliën in de shop](/shop)
:::`,
    },
    "da": {
      slug: "vinedikkesmag-fejl-i-olivenolie-aarsager-og-forebyggelse",
      title: "Vinedikkesmag-fejl i olivenolie: Årsager, genkendelse og forebyggelse",
      excerpt: "Olie, der smager af eddike, er ikke en god olie — det er en olie med en gæringsfejl. Se, hvor den kommer fra, og hvordan den forebygges i produktionen.",
      category: "Olivenoliefejl",
      content: `## Hvad er vinedikkesmag-fejlen?

Hvis en olivenolie minder dig om "fordærvet" vin eller eddike, er det ikke en spændende nuance: Det er næsten altid en fejl. Den **vinedikke-agtige** note opstår, når olivenerne, inden de presses, går i en **gæringsfase**. I det øjeblik mister frugten sin renhed, og olien holder op med at dufte grønt og friskt, og drejer i stedet i en "vinedikke-sur" retning, som aldrig bør forekomme i en ekstra jomfruolivenolie.

Det er en generende fejl, fordi den dækker over alt: Den dæmper frugtigheden og efterlader en skarp, ubalanceret fornemmelse, som kan smages selv på en enkel ret.

## Hvorfor sker det?

Normalt sker det på grund af en meget specifik kombination af faktorer: **tid** og **håndtering af olivenerne**. Olivenerne høstes, men bliver derefter liggende for længe inden presning. Hvis de opbevares i et varmt miljø, hvis de stables i store dynger, hvis de ikke kan "ånde", eller hvis partiet allerede er beskadiget (stukkede, overmodne olivener), finder mikroorganismer det perfekte miljø til at formere sig.

Det er en af de situationer, hvor der skal meget lidt til at ændre resultatet: Man ser det måske ikke med det blote øje, men olien fortæller dig det med det samme i næsen.

## Den kemiske mekanisme

Når gæringen starter, stiger bestemte flygtige forbindelser: "alkoholiske" og "eddikesure" komponenter (såsom ethanol og eddikesyre) og ofte **ethylacetat**, som er ansvarlig for den skarpe, let "gærede" fornemmelse, der minder om vin eller eddike.

Du behøver ikke at huske navnene: Det vigtige er, at disse forbindelser flytter aromaen til et område, der er helt fremmed for ekstra jomfruolivenolie. Det er, som om olien holder op med at tale om friske olivener og begynder at tale om ukontrollerede processer.

## Hvordan genkender du det?

### På duften

Her er det normalt ret tydeligt: Du dufter noter af **vineddike**, **oxideret vin** oder frugt, der er begyndt at gære. Nogle gange kan det også have en "kælderagtig" duft, men forskellen er, at vinedikkefejlen er mere **sur og skarp**, mindre "fugtig".

En sund olie, selv en intens en, har tendens til at give dig grønne signaler (græs, artiskok, tomat, frisk mandel). Vinedikkefejlen derimod afviger fra sporet og leder dig til aromaer, du ikke forventer af en ekstra jomfruolivenolie.

### I munden

I munden viser vinedikkefejlen sig ikke som polyfenolernes elegante skarphed. Den **gode skarphed** er ren, livlig, mærkes bagest i halsen og ledsages af en tilstedeværende frugtighed. Vinedikkefejlen derimod giver en mere "ubalanceret" fornemmelse: skarp, vineddike-agtig, nogle gange næsten som opløsningsmiddel, og frem for alt mangler den den grønne friskhed.

## Forebyggelse i produktionskæden

Denne fejl er næsten altid resultatet af fasen forud for presningen: **for lange ventetider**, olivener opbevaret under dårligt ventilerede forhold, kompakte dynger, der varmer op indvendigt, forkerte beholdere (som lukkede plastposer) eller partier, der ikke er helt sunde, som forarbejdes uforsigtigt. Hygiejne spiller også en rolle: Rester og snavs fremmer gæringsprocesser.

Kort sagt er det den klassiske fejl, der fortæller dig: "der blev ikke arbejdet hurtigt nok og rent nok her."

:::cta
Vil du have en ren ekstra jomfruolivenolie uden gæringsnoter?
Kvalitet opstår gennem sunde olivener og hurtig forarbejdning.
[Se olierne i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "vinedikksmak-feil-i-olivenolje-aarsaker-og-forebygging",
      title: "Vinedikksmak-feil i olivenolje: Årsaker, genkjenning og forebygging",
      excerpt: "Olje som smaker eddik er ikke en god olje — det er en olje med en gjæringsfeil. Se hvor den kommer fra, og hvordan den forebygges i produksjonen.",
      category: "Olivenoljefeil",
      content: `## Hva er vinedikksmak-feilen?

Hvis en olivenolje minner deg om "skjemt" vin eller eddik, er det ikke en spennende nyanse: Det er nesten alltid en feil. Den **vinedikk-aktige** noten oppstår når olivene, før de presses, går inn i en **gjæringsfase**. I det øyeblikket mister frukten sin renhet, og oljen slutter å dufte grønt og friskt, og dreier i stedet i en "vinedikk-sur" retning som aldri bør forekomme i en ekstra jomfruolivenolje.

Det er en sjenerende feil fordi den dekker over alt: Den demper fruktigheten og etterlater en skarp, ubalansert fornemmelse som kan smakes selv på en enkel rett.

## Hvorfor skjer det?

Normalt skjer det på grunn av en veldig spesifikk kombinasjon av faktorer: **tid** og **håndtering av olivene**. Olivene høstes, men blir deretter liggende for lenge før pressing. Hvis de oppbevares i et varmt miljø, hvis de stables i store hauger, hvis de ikke kan "puste", eller hvis partiet allerede er skadet (stukkede, overmodne oliven), finner mikroorganismer det perfekte miljøet til å formere seg.

Det er en av de situasjonene der det skal veldig lite til for å endre resultatet: Man ser det kanskje ikke med det blotte øye, men oljen forteller deg det med en gang i nesen.

## Den kjemiske mekanismen

Når gjæringen starter, stiger bestemte flyktige forbindelser: "alkoholiske" og "eddiksure" komponenter (som etanool og eddiksyre) og ofte **etylacetat**, som er ansvarlig for den skarpe, litt "gjærede" fornemmelsen som minner om vin eller eddik.

Du trenger ikke å huske navnene: Det viktige er at disse forbindelsene flytter aromaen til et område som er helt fremmed for ekstra jomfruolivenolje. Det er som om oljen slutter å snakke om friske oliven og begynner å snakke om ukontrollerte prosesser.

## Hvordan genkjenner du det?

### På duften

Her er det vanligvis ganske tydelig: Du lukter noter av **vineddik**, **oksidert vin** eller frukt som har begynt å gjære. Noen ganger kan det også ha en "kjelleraktig" duft, men forskjellen er at vinedikkfeilen er mer **sur og skarp**, mindre "fuktig".

En sunn olje, selv en intens en, har en tendens til å gi deg grønne signaler (gress, artisjokk, tomat, frisk mandel). Vinedikkfeilen derimot avviker fra sporet og leder deg til aromaer du ikke forventer av en ekstra jomfruolivenolje.

### I munnen

I munnen viser vinedikkfeilen seg ikke som polyfenolenes elegante skarphet. Den **gode skarpheten** er ren, livlig, merkes bakerst i halsen og ledsages av en tilstedeværende fruktighet. Vinedikkfeilen derimot gir en mer "ubalansert" fornemmelse: skarp, vineddikk-aktig, noen ganger nesten som løsemiddel, og fremfor alt mangler den den grønne friskheten.

## Forebygging i produksjonskjeden

Denne feilen er nesten alltid resultatet av fasen før pressing: **for lange ventetider**, oliven oppbevart under dårlig ventilerte forhold, kompakte hauger som varmes opp innvendig, feil beholdere (som lukkede plastposer) eller partier som ikke er helt sunne, som foredles uforsiktig. Hygiene spiller også en rolle: Rester og smuss fremmer gjæringsprosesser.

Kort sagt er det den klassiske feilen som forteller deg: "det ble ikke arbeidet raskt nok og rent nok her."

:::cta
Vil du ha en ren ekstra jomfruolivenolje uten gjæringsnoter?
Kvalitet oppstår gjennom sunne oliven og rask forarbeidning.
[Se oljene i butikken](/shop)
:::`,
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
      content: `## The musty-humidity defect

### Origin

The *musty-humidity* defect almost always originates before the oil even exists. It happens when olives remain in conditions where moisture and microorganisms thrive: fruits harvested already damaged, batches left in closed and humid environments, or olives fallen to the ground and collected late.

During milling, everything on the skin and in the pulp enters the process, and the metabolites produced by molds and yeasts carry over to the oil. The result is a profile that "shuts down" every positive note.

### Sensory notes

On the nose, it immediately recalls a damp cellar: mold, wet paper, earth, sometimes mushroom.

In the mouth, the sensation is consistent: an earthy, dirty finish with an aftertaste that completely covers the fruitiness.

### How to prevent it

Here the rule is tough but simple: good oil is born from healthy olives. Therefore, selection, speed, and environment matter more than anything.

Avoiding uncontrolled ground harvesting, reducing waiting times before milling, and using aerated containers makes a huge difference. And if a batch is visibly compromised, it must be separated: "mixing to salvage" often means ruining everything.

## Muddy sediment: a different defect

### What is muddy sediment (morchia)?

**Muddy sediment** (morchia in Italian) is the natural deposit that forms especially in unfiltered oils: micro-drops of water, pulp particles, vegetable fragments, still-active enzymes, and residual microflora.

By itself, it is not "the ultimate evil." The problem arises when the oil remains in contact with this deposit for too long: down there, in low-oxygen conditions, anaerobic fermentations and degradations can start, changing the oil.

### The muddy sediment defect

When contact is prolonged, the oil can develop heavier, dirty notes, often confused with other families of fermentation defects. The fruitiness goes out and leaves room for "bottom" sensations, as if the profile had dropped in tone and become flat or dull.

### How to prevent it

Prevention here is post-production management: racking, cleaning, and (if necessary) filtration.

Suitable tanks, periodic racking to separate clear oil from sediment, and correct sanitization prevent the sediment from becoming a problem. If, on the other hand, you want an unfiltered "new season" oil, there is only one key: consume it fresh, without leaving it to sit for months on its sediment.

:::cta
Want a clean EVOO that remains stable over time?
A curated supply chain and correct storage make all the difference: clearer aroma, cleaner taste.
[Discover the oils in our shop](/shop)
:::`,
    },
    "de": {
      slug: "schimmel-und-schlammiger-bodensatz-olivenoelfehler",
      title: "Schimmel und schlammiger Bodensatz: Zwei kapitale Fehler in Olivenöl",
      excerpt: "Zwei unterschiedliche Fehler, die oft verwechselt werden. Schimmel kommt von den Oliven, Bodensatz (Morchia) von schmutzigen Tanks.",
      category: "Olivenölfehler",
      content: `## Der Schimmel-Feuchtigkeits-Fehler

### Ursprung

Der *Schimmel-Feuchtigkeits-Fehler* entsteht fast immer, bevor das Öl überhaupt existiert. Dies geschieht, wenn Oliven unter Bedingungen gelagert werden, in denen Feuchtigkeit und Mikroorganismen gedeihen: bereits beschädigt geerntete Früchte, Lagerung in geschlossenen und feuchten Umgebungen oder vom Boden aufgelesene Oliven.

Beim Pressen gelangt alles, was sich auf der Schale und im Fruchtfleisch befand, in das Öl. Der Schimmel überdeckt jede positive, frische Note.

### Sensorische Noten

Im Geruch erinnert es sofort an einen feuchten Keller: Schimmel, nasses Papier, Erde, manchmal Pilze.

Im Mund ist das Gefühl ähnlich: Ein erdiger, unreiner Nachgeschmack, der die Fruchtigkeit komplett überdeckt.

### Vermeidung

Hier ist die Regel hart, aber einfach: Gutes Öl entsteht nur aus gesunden Oliven. Selektion, Schnelligkeit und Belüftung sind entscheidend.

Die Vermeidung von unkontrollierter Ernte vom Boden, kurze Wartezeiten vor dem Pressen und luftdurchlässige Kisten machen den Unterschied. Wenn eine Charge sichtlich beschädigt ist, muss sie separat verarbeitet werden.

## Schlammiger Bodensatz (Morchia): Ein anderer Fehler

### Was ist Morchia?

**Morchia** ist der natürliche Bodensatz, der sich insbesondere in ungefilterten Ölen bildet: Mikro-Wassertröpfchen, Fruchtfleischpartikel, Pflanzenreste und aktive Enzyme.

An sich ist das kein „absolutes Übel“. Das Problem entsteht, wenn das Öl zu lange mit diesem Bodensatz in Kontakt bleibt: Dort unten, unter sauerstoffarmen Bedingungen, können anaerobe Gärungs- und Abbauprozesse einsetzen, die das Öl verderben.

### Der Bodensatz-Fehler

Bei längerem Kontakt entwickelt das Öl schwere, unsaubere Noten. Die Fruchtigkeit erlischt und weicht dumpfen Aromen, als ob das Öl matt und flach geworden wäre.

### Vermeidung

Die Vermeidung liegt in der Pflege nach der Pressung: Dekantieren, Reinigung der Tanks und Filtrierung.

Geeignete Tanks, regelmäßiges Umfüllen (Racking), um das klare Öl vom Bodensatz zu trennen, und eine gründliche Reinigung verhindern das Problem. Wer ein ungefiltertes „neues“ Öl genießen möchte, sollte es jung trinken, bevor sich der Bodensatz zersetzt.

:::cta
Möchten Sie ein sauberes Olivenöl Extra Vergine, das stabil bleibt?
Sorgfältige Pflege und korrekte Lagerung garantieren klaren Duft und reinen Geschmack.
[Entdecken Sie die Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "schimmel-en-bezinksel-defecten-olijfolie",
      title: "Schimmel en bezinksel (morchia) in olijfolie: oorzaken en preventie",
      excerpt: "Twee verschillende defecten die vaak worden verward. Schimmel komt van de olijven, bezinksel door vuile tanks of gebrek aan filtering.",
      category: "Olijfolie-defecten",
      content: `## Het schimmel-vochtigheidsdefect

### Oorsprong

Het *schimmel-vochtigheidsdefect* ontstaat bijna altijd voordat de olie überhaupt bestaat. Het gebeurt wanneer olijven onder omstandigheden blijven waarin vocht en micro-organismen vrij spel hebben: al beschadigd geoogste vruchten, olijven die in gesloten en vochtige ruimtes worden achtergelaten, of olijven die van de grond zijn geraapt en te laat zijn verzameld.

Tijdens het persen komt alles wat op de schil en in het vruchtvlees zat in het proces terecht. Het resultaat is een olie waarin elke positieve, frisse noot is verdwenen.

### Sensorische tonen

In de neus doet het meteen denken aan een vochtige kelder: schimmel, nat papier, aarde en soms paddenstoelen.

In de mond is de sensatie identiek: een aardse, vuile afdronk die de fruitigheid volledig maskeert.

### Hoe te voorkomen

Hier is de regel streng maar simpel: goede olijfolie wordt geboren uit gezonde olijven. Selectie, snelheid en een droge omgeving zijn essentieel.

Het vermijden van olijven die van de grond zijn geraapt, het verkorten van de wachttijd voor het persen en het gebruik van geventileerde kisten maken een enorm verschil.

## Bezinksel (morchia): een ander defect

### Wat is bezinksel (morchia)?

**Bezinksel** (morchia in het Italiaans) is het natuurlijke depot dat zich vooral in ongefilterde olijfolie vormt: micro-druppeltjes water, restjes vruchtvlees, plantenresten en actieve enzymen.

Op zichzelf is dit bezinksel niet direct schadelijk. Het probleem ontstaat wanneer de olie te lang met dit depot in contact blijft: onderin de tank, in zuurstofarme omstandigheden, kunnen anaerobe gistingen en afbraakprocessen starten die de olie verpesten.

### Het bezinkseldefect

Wanneer het contact langdurig is, ontwikkelt de olie zware, onzuivere tonen. De fruitigheid verdwijnt en maakt plaats voor doffe smaken, alsof het smaakprofiel mat en vlak is geworden.

### Hoe te voorkomen

De preventie ligt in het beheer na de productie: regelmatig overhevelen (decanteren), reinigen en, indien gewenst, filteren.

Geschikte tanks, periodiek overhevelen om de heldere olijfolie te scheiden van het bezinksel, en een correcte hygiëne voorkomen dat het depot een probleem wordt. Wil je toch genieten van ongefilterde olie, consumeer deze dan zo vers mogelijk.

:::cta
Wilt u een zuivere extra vierge olijfolie die stabiel blijft?
Een verzorgde keten en correcte opslag maken het verschil: helder aroma, zuivere smaak.
[Ontdek de oliën in de shop](/shop)
:::`,
    },
    "da": {
      slug: "mug-og-bundfald-defekter-i-olivenolie-aarsager-og-forebyggelse",
      title: "Mug og bundfald (morchia) i olivenolie: Årsager, genkendelse og forebyggelse",
      excerpt: "To forskellige fejl, der ofte forveksles. Mug kommer fra olivenerne, mens bundfald skyldes snavsede tanke eller manglende dekantering.",
      category: "Olivenoliefejl",
      content: `## Mug- og fugtfejlen

### Oprindelse

*Mug- og fugtfejlen* opstår næsten altid, før olien overhovedet presses. Det sker, når olivener opbevares under forhold, hvor fugt og mikroorganismer trives: Frugter, der høstes beskadigede, partier efterladt i lukkede og fugtige rum, eller olivener, der samles op fra jorden for sent.

Under presningen kommer alt, hvad der var på skallen og i frugtkødet, med i olien. Resultatet er en smagsprofil, der slukker for enhver positiv note.

### Sensoriske noter

I næsen minder det straks om en fugtig kælder: Mug, vådt papir, jord, nogle gange svampe.

I munden er oplevelsen den samme: En jordagtig, uren eftersmag, der helt dækker over frugtigheden.

### Forebyggelse

Her er reglen hård, men enkel: God olie fødes af sunde olivener. Derfor betyder sortering, hurtighed og ventilation alt.

At undgå opsamling fra jorden, forkorte ventetiden inden presning og bruge ventilerede kasser gør en enorm forskel.

## Bundfald (morchia): En anden fejl

### Hvad er bundfald (morchia)?

**Bundfald** (morchia på italiensk) er det naturlige sediment, der især dannes i ufiltrerede olier: Mikroskopiske vanddråber, rester af frugtkød, planterester og aktive enzymer.

I sig selv er det ikke "det rene onde". Problemet opstår, når olien forbliver i kontakt med dette sediment for længe: Helt nede i bunden af tanken, under iltfattige forhold, kan der starte gæring og nedbrydning, som ødelægger olien.

### Bundfalds-fejlen

Når kontakten er langvarig, kan olien udvikle tunge, urene noter. Frugtigheden forsvinder og giver plads til flade, matte smagsindtryk.

### Forebyggelse

Forebyggelsen sker efter produktionen: Dekantering (omstikning), rengøring og eventuel filtrering.

Egnede tanke, jævnlig omstikning for at adskille den klare olie fra sedimentet, og grundig rengøring forhindrer problemet. Hvis du vil have ufiltreret olie, er nøglen enkel: Drik den helt frisk.

:::cta
Vil du have en ren ekstra jomfruolivenolie, der holder sig stabil?
Sorgfuld håndtering og korrekt lagring gør hele forskellen: Renere duft, renere smag.
[Se olierne i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "mugg-og-bunndfall-defekter-i-olivenolje-aarsaker-og-forebygging",
      title: "Mugg og bunndfall (morchia) i olivenolje: Årsaker, genkjenning og forebygging",
      excerpt: "To forskjellige feil som ofte forveksles. Mugg kommer fra olivene, mens bunndfall skyldes skitne tanker eller manglende dekantering.",
      category: "Olivenoljefeil",
      content: `## Mugg- og fuktfeilen

### Opprinnelse

*Mugg- og fuktfeilen* oppstår nesten alltid før oljen i det hele tatt presses. Det skjer når oliven oppbevares under forhold der fuktighet og mikroorganismer trives: Frukt som høstes skadet, partier etterlatt i lukkede og fuktige rom, eller oliven som plukkes opp fra bakken for sent.

Under pressingen kommer alt som var på skallet og i fruktkjøttet med i oljen. Resultatet er en smaksprofil som slukker enhver positiv tone.

### Sensoriske noter

I nesen minner det straks om en fuktig kjeller: Mugg, vått papir, jord, noen ganger sopp.

I munnen er opplevelsen den samme: En jordaktig, uren ettersmak som helt dekker over fruktigheten.

### Forebygging

Her er regelen hard, men enkel: God olje fødes av sunne oliven. Derfor betyr sortering, hurtighet og ventilasjon alt.

Å unngå oppsamling fra bakken, forkorte ventetiden før pressing og bruke ventilerte kasser gjør en enorm forskjell.

## Bunndfall (morchia): En annen feil

### Hva er bunndfall (morchia)?

**Bunndfall** (morchia på italiensk) er det naturlige sedimentet som spesielt dannes i ufiltrerte oljer: Mikroskopiske vanndråper, rester av fruktkjøtt, planterester og aktive enzymer.

I seg selv er det ikke "det rene onde". Problemet oppstår når oljen blir liggende i kontakt med dette sedimentet for lenge: Helt nede i bunnen av tanken, under oksygenfattige forhold, kan det starte gjæring og nedbrytning som ødelegger oljen.

### Bunndfalls-feilen

Når kontakten er langvarig, kan oljen utvikle tunge, urene noter. Fruktigheten forsvinner og gir plass til flate, matte smaksintrykk.

### Forebygging

Forebyggingen skjer etter produksjonen: Dekantering (omstikking), rengjøring og eventuell filtrering.

Egnede tanker, jevnlig omstikking for å skille den klare oljen fra sedimentet, og grundig rengjøring forhindrer problemet. Hvis du vil ha ufiltrert olje, er nøkkelen enkel: Drikk den helt fersk.

:::cta
Vil du ha en ren ekstra jomfruolivenolje som holder seg stabil?
Sorgfull håndtering og korrekt lagring gjør hele forskjellen: Renere duft, renere smak.
[Se oljene i butikken](/shop)
:::`,
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
      category: "Our Olive Mill",
      content: `## Traceability is not an option

In the food sector, traceability throughout the supply chain is regulated by strict standards (such as **EU Reg. 178/2002**): every operator must be able to identify suppliers and customers (traceability "one step back, one step forward"). For extra virgin olive oil, the rules are particularly detailed.

But mandatory traceability is just the minimum. We go much further.

## How our system works

### The batch number

Every bottling run is identified by a specific **batch number** printed on the bottom of every bottle or tin. This number links directly to:

- Specific **bottling date**
- Reference **crop season** (e.g., 2025/2026)
- **Olive grove of origin** (GPS coordinates of the specific plots)
- **Milling date** (showing how many hours from harvest to milling)

### Laboratory analysis per batch

Before every bottling, the batch is analyzed by an **accredited laboratory** (UNI CEI EN ISO/IEC 17025) for:

- *Free acidity* (titration)
- *Peroxide value* (iodometry)
- *K232 & K270* (UV spectrophotometry)
- *Total polyphenols* (Folin-Ciocalteu)
- *Sensory Panel Test* (certified professional tasters)

The complete analysis certificate is always available on request for every batch.

### Verifiable origin

The olives come exclusively from our own groves in Tuscany. We do not purchase olives from third parties or mixed cooperatives. This allows us to guarantee:

- Complete control of agronomic practices
- No mixing with olives of unknown origin
- Varietal traceability (specific cultivars per batch, where possible)

## How to verify it yourself

1. Find the **batch number** on your bottle or tin
2. Contact us indicating the batch number
3. We will send you the complete laboratory analysis certificate

> Transparency is not declared — it is demonstrated with data.`,
    },
    "de": {
      slug: "rueckverfolgbarkeit-charge-laboranalyse-herkunft",
      title: "Rückverfolgbarkeit: Charge, Analyse, Herkunft – Wie wir Qualität garantieren",
      excerpt: "Das Wort 'Qualität' wird oft missbraucht. Wir dokumentieren sie: Jede Charge hat eine rückverfolgbare Nummer, Laboranalysen und eine nachprüfbare Herkunft.",
      category: "Unsere Ölmühle",
      content: `## Rückverfolgbarkeit ist keine Option

Im Lebensmittelsektor ist die Rückverfolgbarkeit in der gesamten Lieferkette durch strenge Normen geregelt (**EU-Verordnung 178/2002**): Jeder Betreiber muss Lieferanten und Kunden identifizieren können (Rückverfolgbarkeit „einen Schritt zurück, einen Schritt vorwärts“). Für Olivenöl Extra Vergine sind die Regeln besonders detailliert.

Doch die gesetzlich vorgeschriebene Rückverfolgbarkeit ist nur das Minimum. Wir gehen viel weiter.

## Wie unser System funktioniert

### Die Chargennummer

Jede Abfüllung ist durch eine spezifische **Chargennummer** (Lot-Nummer) gekennzeichnet, die auf den Flaschen- oder Dosenboden gedruckt ist. Diese Nummer führt direkt zu:

- Dem genauen **Abfülldatum**
- Der entsprechenden **Erntezeit** (z. B. 2025/2026)
- Dem **Herkunftshain** (GPS-Koordinaten der Haine)
- Dem **Pressdatum** (zeigt, wie viele Stunden zwischen Ernte und Pressung vergingen)

### Laboranalyse pro Charge

Vor jeder Abfüllung wird die Charge von einem **akkreditierten Labor** (nach UNI CEI EN ISO/IEC 17025) analysiert auf:

- *Freie Säure* (Titration)
- *Peroxidzahl* (Iodometrie)
- *K232 & K270* (UV-Spektrophotometrie)
- *Gesamtpolyphenole* (Folin-Ciocalteu)
- *Sensorischer Panel-Test* (zertifizierte professionelle Verkoster)

Das vollständige Analysenzertifikat ist auf Anfrage für jede Charge erhältlich.

### Nachprüfbare Herkunft

Die Oliven stammen ausschließlich aus unseren eigenen Hainen in der Toskana. Wir kaufen keine Oliven von Dritten oder Genossenschaften hinzu. Dies ermöglicht uns:

- Vollständige Kontrolle über die landwirtschaftlichen Praktiken
- Keine Vermischung mit Oliven unbekannter Herkunft
- Sortenreine Rückverfolgbarkeit (spezifische Olivensorten pro Charge, wo möglich)

## Wie Sie es selbst überprüfen können

1. Suchen Sie die **Chargennummer** auf Ihrer Flasche oder Dose
2. Kontaktieren Sie uns unter Angabe der Chargennummer
3. Wir senden Ihnen das vollständige Laboranalysenzertifikat zu

> Transparenz wird nicht deklariert – sie wird durch Daten bewiesen.`,
    },
    "nl": {
      slug: "olijfolie-traceerbaarheid-lotnummer-analyse-herkomst",
      title: "Traceerbaarheid: Lotnummer, Analyse, Herkomst — Hoe we kwaliteit garanderen",
      excerpt: "Het woord 'kwaliteit' wordt te vaak misbruikt. Wij documenteren het: elk lotnummer heeft laboratoriumanalyses en een verifieerbare herkomst.",
      category: "Onze Olijfmolen",
      content: `## Traceerbaarheid is geen optie

In de voedingsmiddelensector is de traceerbaarheid van de keten gereguleerd door strenge normen (zoals **EU-verordening 178/2002**): elke exploitant moet leveranciers en afnemers kunnen identificeren (traceerbaarheid "één stap terug, één stap vooruit"). Voor extra vierge olijfolie zijn de regels bijzonder gedetailleerd.

Maar de verplichte traceerbaarheid is slechts het minimum. Wij gaan veel verder.

## Hoe ons systeem werkt

### Het lotnummer

Elke botteling wordt geïdentificeerd door een specifiek **lotnummer** dat op de fles of het blik is gedrukt. Dit nummer linkt direct naar:

- De specifieke **botteldatum**
- De referentie **oogstcampagne** (bijv. 2025/2026)
- De **olijfgaard van herkomst** (GPS-coördinaten van de percelen)
- De **persdatum** (laat zien hoeveel uur er zat tussen oogst en persing)

### Laboratoriumanalyse per lot

Vóór elke botteling wordt het lot geanalyseerd door een **geaccrediteerd laboratorium** (UNI CEI EN ISO/IEC 17025) op:

- *Vrije zuurgraad* (titratie)
- *Peroxidegetal* (iodometrie)
- *K232 & K270* (UV-spectrofotometrie)
- *Totaal polifenolen* (Folin-Ciocalteu)
- *Sensoriële Panel Test* (gecertificeerde professionele proevers)

Het volledige analysecertificaat is altijd op aanvraag beschikbaar voor elk lot.

### Verifieerbare herkomst

De olijven zijn uitsluitend afkomstig uit onze eigen gaarden in Toscane. Wij kopen geen olijven van derden of gemengde coöperaties. Hierdoor kunnen wij garanderen:

- Volledige controle over landbouwpraktijken
- Geen vermenging met olijven van onbekende herkomst
- Raszuivere traceerbaarheid (specifieke cultivars per lot, waar mogelijk)

## Hoe u dit zelf kunt controleren

1. Zoek het **lotnummer** op uw fles of blik
2. Neem contact met ons op onder vermelding van het lotnummer
3. Wij sturen u het volledige laboratoriumanalysecertificaat toe

> Transparantie wordt niet beweerd — het wordt aangetoond met gegevens.`,
    },
    "da": {
      slug: "olivenolie-sporbarhed-batch-analyse-oprindelse",
      title: "Sporbarhed: Batch, Analyse, Oprindelse — Sådan garanterer vi kvaliteten",
      excerpt: "Ordet 'kvalitet' er misbrugt. Vi dokumenterer det: Hver batch har et sporbart nummer, laboratorieanalyse og verificerbar oprindelse.",
      category: "Vores Oliemølle",
      content: `## Sporbarhed er ikke et valg

I fødevaresektoren er sporbarhed i hele forsyningskæden reguleret af strenge standarder (såsom **EU-forordning 178/2002**): Enhver operatør skal kunne identificere leverandører og kunder (sporbarhed "et skridt tilbage, et skridt fremad"). For ekstra jomfruolivenolie er reglerne særligt detaljerede.

Men lovpligtig sporbarhed er kun minimummet. Vi går meget længere.

## Sådan fungerer vores system

### Batchnummeret

Enhver aftapning identificeres af et specifikt **batchnummer** (lottnummer) trykt på bunden af hver flaske eller dunk. Dette nummer linker direkte til:

- Det specifikke **aftapningstidspunkt**
- Reference **høstkampagne** (f.eks. 2025/2026)
- **Herkunfts-olivenlund** (GPS-koordinater for de specifikke parceller)
- **Pressedato** (viser hvor mange timer der gik fra høst til presning)

### Laboratorieanalyse pr. batch

Før hver aftapning analyseres batchen af et **akkrediteret laboratorium** (UNI CEI EN ISO/IEC 17025) for:

- *Fri syre* (titrering)
- *Peroxidtal* (iodometri)
- *K232 & K270* (UV-spektrofotometri)
- *Total polyfenoler* (Folin-Ciocalteu)
- *Sensorisk Panel Test* (certificerede professionelle smagere)

Det fulde analysecertifikat er altid tilgængeligt på anmodning for hver batch.

### Verificerbar oprindelse

Olivenerne kommer udelukkende fra vores egne lunde i Toscana. Vi køber ikke olivener fra tredjeparter eller blandede kooperativer. Dette giver os mulighed for at garantere:

- Fuld kontrol over landbrugspraksis
- Ingen blanding med olivener af ukendt oprindelse
- Sorts-sporbarhed (specifikke olivensorter pr. batch, hvor det er muligt)

## Sådan tjekker du det selv

1. Find **batchnummeret** på din flaske eller dunk
2. Kontakt os og oplys batchnummeret
3. Vi sender dig det fulde laboratorieanalysecertifikat

> Gennemsigtighed erklæres ikke — den bevises med data.`,
    },
    "no": {
      slug: "olivenolje-sporbarhet-batch-analyse-opprinnelse",
      title: "Sporbarhet: Batch, Analyse, Opprinnelse — Slik garanterer vi kvaliteten",
      excerpt: "Ordet 'kvalitet' er misbrukt. Vi dokumenterer det: Hver batch har et sporbart nummer, laboratorieanalyse og verifiserbar opprinnelse.",
      category: "Vores Oliemølle",
      content: `## Sporbarhet er ikke et valg

I matvaresektoren er sporbarhet i hele forsyningskjeden regulert av strenge standarder (som **EU-forordning 178/2002**): Enhver operatør må kunne identifisere leverandører og kunder (sporbarhet "ett skritt tilbake, ett skritt frem"). For ekstra jomfruolivenolje er reglene særlig detaljerte.

Men lovpålagt sporbarhet er bare minimum. Vi går mye lenger.

## Slik fungerer systemet vårt

### Batchnummeret

Enhver tapping identifiseres av et spesifikt **batchnummer** (lottnummer) trykt på bunnen av hver flaske eller boks. Dette nummeret linker direkte til:

- Den spesifikke **tappedatoen**
- Referanse **høstkampanje** (f.eks. 2025/2026)
- **Herkunfts-olivenlund** (GPS-koordinater for de spesifikke parsellene)
- **Pressedato** (viser hvor mange timer som gikk fra høsting til pressing)

### Laboratorieanalyse per batch

Før hver tapping analyseres batchen av et **akkreditert laboratorium** (UNI CEI EN ISO/IEC 17025) for:

- *Fri syre* (titrering)
- *Peroksidtall* (jodometri)
- *K232 & K270* (UV-spektrofotometri)
- *Totalt polyfenoler* (Folin-Ciocalteu)
- *Sensorisk Panel Test* (sertifiserte profesjonelle smakere)

Sertifikatet for analysen er alltid tilgjengelig på forespørsel for hver batch.

### Verifiserbar opprinnelse

Olivene kommer utelukkende fra våre egne lunder i Toscana. Vi kjøper ikke oliven fra tredjeparter eller blandede kooperativer. Dette gir oss mulighet til å garantere:

- Full kontroll over landbrukspraksis
- Ingen blanding med oliven av ukjent opprinnelse
- Sorts-sporbarhet (spesifikke olivensorter per batch, der det er mulig)

## Slik sjekker du det selv

1. Finn **batchnummeret** på flasken eller boksen din
2. Kontakt oss og oppgi batchnummeret
3. Vi sender deg det fulle laboratorieanalysesertifikatet

> Åpenhet erklæres ikke — den bevises med data.`,
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
      category: "Our Olive Mill",
      content: `## Olive oil is an agricultural product, not an industrial one

Those who buy the same supermarket olive oil year after year always receive the exact same product — because it is a standardized blend of oils from various origins, mixed to achieve a constant flavor profile. It is not necessarily bad, but it lacks the richness and soul of an artisanal oil.

An artisanal extra virgin olive oil *changes every year*. And that is exactly what makes it so fascinating.

## The variables that determine the vintage

### Spring and summer climate

Spring rains determine the **size of the fruit**. A hot and dry summer favors the concentration of polyphenols (plants under water stress produce more defense compounds). A rainy summer produces larger but less concentrated olives.

**Hot and dry seasons** → smaller olives, lower yield in oil, but oil richer in polyphenols and highly aromatic.

**Cool and rainy seasons** → larger olives, higher yield, more delicate and light oil.

### Flowering and fruit set

The percentage of flowers that successfully become fruits (fruit set) depends on the temperatures and rainfall in May. A cold or very rainy May can drastically reduce production.

### Pests and diseases

The **olive fruit fly** (*Bactrocera oleae*) hits differently every year, depending on summer temperatures:
- Very hot summers (>35°C) → the fly cannot reproduce well → limited damage
- Cool and humid summers → intense proliferation → potentially severe damage

### Harvest timing

Even with the exact same olives, harvesting in October or November changes everything: November olives contain more oil but fewer polyphenols. Choosing the harvest time is one of the producer's most critical decisions.

## What this means for the consumer

- The color of the oil varies: greener in early harvest years, more golden in late ones
- Aromatic intensity varies: dry years produce more concentrated, peppery, and polyphenolic oils
- Yield varies: in certain years, the price is inevitably higher due to scarce production

> Buying artisanal olive oil is like buying wine from a small independent winemaker: every vintage is a different interpretation of the same land.`,
    },
    "de": {
      slug: "warum-olivenoel-jedes-jahr-anders-schmeckt",
      title: "Warum Olivenöl jedes Jahr anders schmeckt: Klima, Ertrag, Reife",
      excerpt: "Genau wie Wein verändert sich Olivenöl Extra Vergine jedes Jahr. Farbe, Intensität, Aromen – alles hängt vom Jahrgang ab. Das ist normal und wunderbar.",
      category: "Unsere Ölmühle",
      content: `## Olivenöl ist ein landwirtschaftliches Produkt, kein industrielles

Wer Jahr für Jahr dasselbe Supermarkt-Olivenöl kauft, erhält immer das exakt gleiche Produkt – weil es sich um eine standardisierte Mischung von Ölen verschiedener Herkunft handelt, die so gemischt wird, dass ein konstantes Profil entsteht. Das ist nicht zwingend schlecht, aber es fehlt ihm der Reichtum und die Seele eines handwerklichen Öls.

Ein handwerkliches Olivenöl Extra Vergine *verändert sich jedes Jahr*. Und genau das macht es so faszinierend.

## Die Variablen, die den Jahrgang bestimmen

### Das Frühlings- und Sommerklima

Frühlingsregen bestimmen die **Größe der Frucht**. Ein heißer und trockener Sommer begünstigt die Konzentration von Polyphenolen (Pflanzen unter Trockenstress produzieren mehr Abwehrstoffe). Ein regnerischer Sommer führt zu größeren, aber weniger konzentrierten Oliven.

**Heiße und trockene Jahre** → kleinere Oliven, geringere Ölausbeute, aber das Öl ist reicher an Polyphenolen und hochgradig aromatisch.

**Kühle und regnerische Jahre** → größere Oliven, höhere Ausbeute, milderes und leichteres Öl.

### Blüte und Fruchtansatz

Der Prozentsatz der Blüten, die sich erfolgreich zu Früchten entwickeln (Fruchtansatz), hängt von den Temperaturen und den Niederschlägen im Mai ab. Ein kalter oder sehr regnerischer Mai kann die Produktion drastisch reduzieren.

### Schädlinge (Die Olivenfliege)

Die **Olivenfliege** (*Bactrocera oleae*) schlägt jedes Jahr anders zu, je nach den Sommertemperaturen:
- Sehr heiße Sommer (>35 °C) → die Fliege kann sich nicht gut vermehren → geringer Schaden
- Kühle und feuchte Sommer → intensive Vermehrung → potenziell schwerer Schaden

### Erntezeitpunkt

Selbst bei exakt denselben Oliven ändert eine Ernte im Oktober oder November alles: November-Oliven enthalten mehr Öl, aber weniger Polyphenole. Die Wahl des Erntezeitpunkts ist eine der kritischsten Entscheidungen des Produzenten.

## Was das für den Verbraucher bedeutet

- Die Farbe des Öls variiert: grüner in Jahren mit früher Ernte, goldener in späten Jahren.
- Die aromatische Intensität variiert: Trockene Jahre erzeugen konzentriertere, schärfere und polyphenolfreie Öle.
- Der Ertrag variiert: In bestimmten Jahren ist der Preis aufgrund der knappen Produktion unweigerlich höher.

> Der Kauf von handwerklichem Olivenöl ist wie der Kauf von Wein bei einem kleinen unabhängigen Winzer: Jeder Jahrgang ist eine andere Interpretation desselben Bodens.`,
    },
    "nl": {
      slug: "waarom-olijfolie-elk-jaar-verandert-klimaat-oogst",
      title: "Waarom olijfolie elk jaar verandert: Klimaat, Opbrengst en Rijping",
      excerpt: "Net als wijn verandert extra vierge olijfolie elk jaar. Kleur, intensiteit, aromatische tonen — alles hangt af van het jaar. Dit is normaal en mooi.",
      category: "Onze Olijfmolen",
      content: `## Olijfolie is een landbouwproduct, geen industrieel product

Wie jaar na jaar dezelfde olijfolie uit de supermarkt koopt, krijgt altijd exact hetzelfde product — omdat het een gestandaardiseerde blend is van oliën uit verschillende landen, gemengd om een constant smaakprofiel te krijgen. Dit is niet per definitie verkeerd, maar het mist de rijkdom en de ziel van een ambachtelijke olie.

Een ambachtelijke extra vierge olijfolie *verandert elk jaar*. En dat is precies wat het zo fascinerend maakt.

## De variabelen die het oogstjaar bepalen

### Het klimaat in de lente en zomer

Lenteregens bepalen de **grootte van de vrucht**. Een hete en droge zomer bevordert de concentratie van polifenolen (planten onder droogtestress produceren meer afweerstoffen). Een regenachtige zomer levert grotere maar minder geconcentreerde olijven op.

**Hete en droge seizoenen** → kleinere olijven, lagere olieopbrengst, maar de olie is rijker aan polifenolen en zeer aromatisch.

**Koele en regenachtige seizoenen** → grotere olijven, hogere opbrengst, mildere en lichtere olijfolie.

### Bloei en vruchtzetting

Het percentage bloemen dat daadwerkelijk vrucht wordt (vruchtzetting) hangt af van de temperatuur en regenval in mei. Een koude of zeer regenachtige mei kan de productie drastisch verminderen.

### Ziekten en plagen (De olijfvlieg)

De **olijfvlieg** (*Bactrocera oleae*) slaat elk jaar anders toe, afhankelijk van de zomertemperaturen:
- Zeer hete zomers (>35°C) → de vlieg kan zich niet goed voortplanten → beperkte schade
- Koele en vochtige zomers → intense verspreiding → potentieel ernstige schade

### Oogstmoment

Zelfs met exact dezelfde olijven verandert een oogst in oktober of november alles: olijven in november bevatten meer olie maar minder polifenolen. Het kiezen van het oogstmoment is een van de meest kritische beslissingen van de producent.

## Wat dit betekent voor de consument

- De kleur van de olijfolie varieert: groener in jaren met een vroege oogst, goudkleuriger bij een late oogst
- De aromatische intensiteit varieert: droge jaren leveren meer geconcentreerde, scherpe en polifenolrijke olijfolie op
- De opbrengst varieert: in bepaalde jaren ligt de prijs onvermijdelijk hoger door schaarse productie

> Ambachtelijke olijfolie kopen is als wijn kopen bij een kleine, onafhankelijke wijnboer: elk oogstjaar is een andere interpretatie van hetzelfde land.`,
    },
    "da": {
      slug: "hvorfor-olivenolie-aendrer-sig-hvert-aar-klima-hoest",
      title: "Hvorfor olivenolie ændrer sig hvert år: Klima, Udbytte og Modning",
      excerpt: "Ligesom vin ændrer ekstra jomfruolivenolie sig hvert år. Farve, intensitet, aromaer — alt afhænger af årgangen. Det er helt normalt og smukt.",
      category: "Vores Oliemølle",
      content: `## Olivenolie er et landbrugsprodukt, ikke et industrielt

De, der køber den samme supermarkedsolie år efter år, får altid nøjagtig det samme produkt — fordi det er en standardiseret blanding af olier fra forskellige oprindelser, blandet for at opnå en konstant smagsprofil. Det er ikke nødvendigvis dårligt, men det mangler den rigdom og sjæl, som findes i en håndværksolie.

En håndlavet ekstra jomfruolivenolie *ændrer sig hvert år*. Og det er netop det, der gør den så fascinerende.

## Variablerne, der bestemmer årgangen

### Klimaet om foråret og sommeren

Forårsregn bestemmer **frugtens størrelse**. En varm og tør sommer fremmer koncentrationen af polyfenoler (planter under tørkestress producerer flere forsvarsstoffer). En regnfuld sommer giver større, men mindre koncentrerede olivener.

**Varme og tørre sæsoner** → Mindre olivener, lavere udbytte i olie, men olien er rigere på polyfenoler og yderst aromatisk.

**Kølige og regnfulde sæsoner** → Større olivener, højere udbytte, mere delikat og let olie.

### Blomstring og frugtsætning

Procentdelen af blomster, der bliver til frugt (frugtsætning), afhænger af temperaturerne og regnen i maj. En kold eller meget regnfuld maj kan reducere produktionen drastisk.

### Skadedyr (Olivenfluen)

**Olivenfluen** (*Bactrocera oleae*) angriber forskelligt hvert år afhængigt af sommertemperaturerne:
- Meget varme somre (>35°C) → Fluen kan ikke formere sig godt → Begrænset skade
- Kølige og fugtige somre → Intens spredning → Potentielt alvorlig skade

### Høsttidspunkt

Selv med nøjagtig de samme olivener ændrer en høst i oktober eller november alt: November-olivener indeholder mere olie, men færre polyfenoler. Valget af høsttidspunkt er en af producentens mest kritiske beslutninger.

## Hvad det betyder for forbrugeren

- Oliens farve varierer: Grønnere i år med tidlig høst, mere gylden i sene år
- Den aromatiske intensitet varierer: Tørre år giver mere koncentrerede, pebrede og polyfenolrige olier
- Udbyttet varierer: I visse år er prisen uundgåeligt højere på grund af mangel på frugt

> At købe håndværksolivenolie er ligesom at købe vin fra en lille uafhængig vinbonde: Hver årgang er en ny fortolkning af den samme jord.`,
    },
    "no": {
      slug: "hvorfor-olivenolje-endrer-seg-hvert-aar-klima-hoest",
      title: "Hvorfor olivenolje endrer seg hvert år: Klima, Utbytte og Modning",
      excerpt: "Akkurat som vin endrer ekstra jomfruolivenolje seg hvert år. Farge, intensitet, aromaer — alt avhenger av årgangen. Det er helt normalt og vakkert.",
      category: "Vores Oliemølle",
      content: `## Olivenolje er et landbruksprodukt, ikke et industrielt

De som kjøper den samme supermarkedsoljen år etter år, får alltid nøyaktig det samme produktet — fordi det er en standardisert blanding av oljer fra ulike opprinnelser, blandet for å oppnå en konstant smaksprofil. Det er ikke nødvendigvis dårlig, men det mangler rikdommen og sjelen til en håndverksolje.

En håndlaget ekstra jomfruolivenolje *endrer seg hvert år*. Og det er nettopp det som gjør den så fascinerende.

## Variablene som bestemmer årgangen

### Klimaet om våren og sommeren

Vårregn bestemmer **fruktens størrelse**. En varm og tørr sommer fremmer konsentrasjonen av polyfenoler (planter under tørkestress produserer flere forsvarsstoffer). En regnfull sommer gir større, men mindre konsentrerte oliven.

**Varme og tørre sesonger** → Mindre oliven, lavere utbytte i olje, men oljen er rikere på polyfenoler og svært aromatisk.

**Kjølige og regnfulle sesonger** → Større oliven, høyere utbytte, mer delikat og lett olje.

### Blomstring og fruktsetting

Prosentandelen blomster som blir til frukt (fruktsetting), avhenger av temperaturene og regnet i mai. En kald eller veldig regnfull mai kan redusere produksjonen drastisk.

### Skadedyr (Olivenfluen)

**Olivenfluen** (*Bactrocera oleae*) angriper forskjellig hvert år avhengig av sommertemperaturene:
- Svært varme somre (>35°C) → Fluen kan ikke formere seg godt → Begrenset skade
- Kjølige og fuktige somre → Intens spredning → Potensielt alvorlig skade

### Høsttidspunkt

Selv med nøyaktig de samme olivene endrer en høsting i oktober eller november alt: November-oliven inneholder mer olje, men færre polyfenoler. Valget av høsttidspunkt er en av produsentens mest kritiske beslutninger.

## Hva det betyr for forbrukeren

- Oljens farge varierer: Grønnere i år med tidlig høsting, mer gyllen i sene år
- Den aromatiske intensiteten varierer: Tørre år gir mer konsentrerte, peprede og polyfenolrike oljer
- Utbyttet varierer: I visse år er prisen uunngåelig høyere på grunn av mangel på frukt

> Å kjøpe håndverksolivenolje er som å kjøpe vin fra en liten uavhengig vinbonde: Hver årgang er en ny tolkning av den samme jorden.`,
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
      category: "Our Olive Mill",
      content: `## What is oleotourism?

**Oleotourism** is the form of food and wine tourism linked to the world of olive oil. In Italy, it has been officially recognized by specific laws (such as **Italian Law no. 158/2019**), which grant olive oil producers the same status as wine tourism operators in their ability to open facilities for tours, tastings, catering, and hospitality.

It is a response to the growing demand for authentic experiences, tied to the territory and direct contact with producers.

## What do you do at an olive mill during a visit?

### During the milling season (October–December)

Visiting an olive mill *during the olive harvest and milling campaign* is the most complete and immersive experience:

1. **Walk in the olive grove**: observe hand harvesting or the use of olive shakers, understand the ripening index, and speak with the harvesters
2. **Tour of the active mill**: watch the crushing, the malaxation (gramolazione), and the centrifuge — the scent of a mill in operation is unique and unforgettable
3. **Tasting raw freshly-extracted oil** (olive oil must/novello): turbid, bright green, and intensely peppery — an experience you will never forget
4. **Guided tasting** of several olive oils with different flavor profiles

### Outside of the harvest season

Even outside the harvest season, visiting a well-structured olive mill offers:

- An educational tour of the milling plant with an explanation of the extraction process
- Structured tasting paired with local food products
- Opportunity for direct purchase with a personal connection to the producer

## Why it is worth it

Whoever visits an olive mill returns home with:

- A completely different understanding of what they put on their plate every single day
- The lifelong ability to distinguish a high-quality extra virgin olive oil from a mediocre one
- A direct relationship of trust with the producer
- Sensory memories that are impossible to obtain in any other way

> You cannot explain in words the taste of fresh olive oil must just coming out of the separator. It must be experienced.

:::cta
Book your tour or tasting at Frantoio del Pasqua
Available year-round — with harvesting experience in October/November.
[Book now](/degustazioni)
:::`,
    },
    "de": {
      slug: "oleotourismus-oelmuehle-besichtigen-erlebnis",
      title: "Oleotourismus und Ölmühlenbesuche: Was man macht und warum es sich lohnt",
      excerpt: "Oleotourismus ist eine der authentischsten kulinarischen Erfahrungen in Italien. Der Besuch einer Ölmühle während der Pressung verändert Ihre Sicht auf das Öl.",
      category: "Unsere Ölmühle",
      content: `## Was ist Oleotourismus?

**Oleotourismus** (Öl-Tourismus) ist die Form des kulinarischen Tourismus, die mit der Welt des Olivenöls verbunden ist. In Italien wurde er gesetzlich offiziell anerkannt (**italienisches Gesetz Nr. 158/2019**). Dieses Gesetz stellt Olivenölproduzenten den Winzern im Weintourismus gleich und ermöglicht es ihnen, ihre Betriebe für Führungen, Verkostungen und Gastfreundschaft zu öffnen.

Es ist eine Antwort auf die wachsende Nachfrage nach authentischen Erlebnissen, die mit der Region und dem direkten Kontakt zu den Erzeugern verbunden sind.

## Was macht man bei einem Ölmühlenbesuch?

### Während der Presssaison (Oktober–Dezember)

Der Besuch einer Ölmühle *während der Ernte- und Presssaison* ist das umfassendste Erlebnis:

1. **Spaziergang im Olivenhain**: Beobachten Sie die manuelle Ernte oder den Einsatz von Rüttlern, verstehen Sie den Reifegrad und sprechen Sie mit den Erntehelfern.
2. **Besichtigung der laufenden Mühle**: Sehen Sie das Mahlen, das Kneten (Malaxation) und die Zentrifuge – der Duft einer arbeitenden Ölmühle ist einzigartig.
3. **Verkostung des frisch gepressten Öls** (Mosto d'olio): Naturtrüb, leuchtend grün und intensiv scharf – ein unvergessliches Erlebnis.
4. **Geführte Verkostung** verschiedener Olivenöle mit unterschiedlichen Profilen.

### Außerhalb der Erntesaison

Auch außerhalb der Erntezeit bietet der Besuch einer gut geführten Ölmühle:

- Eine lehrreiche Führung durch die Ölmühle mit Erklärung des Extraktionsprozesses.
- Eine strukturierte Verkostung in Kombination mit typischen Produkten der Region.
- Die Möglichkeit des Direkteinkaufs mit persönlichem Kontakt zum Erzeuger.

## Warum es sich lohnt

Wer eine Ölmühle besucht, kehrt nach Hause zurück mit:

- Einem völlig anderen Verständnis für das, was er jeden Tag auf den Teller bringt.
- Der lebenslangen Fähigkeit, ein hochwertiges Olivenöl Extra Vergine von einem minderwertigen zu unterscheiden.
- Einer direkten Vertrauensbeziehung zum Erzeuger.
- Sensorischen Erinnerungen, die man anders nicht erlangen kann.

*Man kann den Geschmack von frischem Olivenölmost direkt aus dem Separator nicht in Worte fassen. Man muss ihn erleben.*

:::cta
Buchen Sie Ihre Führung oder Verkostung im Frantoio del Pasqua
Ganzjährig verfügbar – mit Ernteerlebnis im Oktober/November.
[Jetzt buchen](/degustazioni)
:::`,
    },
    "nl": {
      slug: "oleotoerisme-olijfmolen-bezoeken-ervaring",
      title: "Oleotoerisme en Olijfmolenbezoeken: Wat het is, Wat we doen en Waarom het de moeite waard is",
      excerpt: "Oleotoerisme is een van de meest authentieke culinaire ervaringen in Italië. Een bezoek aan een olijfmolen tijdens de persing verandert voorgoed hoe je olijfolie beleeft.",
      category: "Onze Olijfmolen",
      content: `## Wat is oleotoerisme?

**Oleotoerisme** (olijfolietoerisme) is de vorm van culinair toerisme die gekoppeld is aan de wereld van olijfolie. In Italië is het officieel erkend bij wet (**Italiaanse wet nr. 158/2019**). Deze wet stelt olijfolieproducenten gelijk aan wijnproducenten wat betreft de mogelijkheid om hun bedrijven te openen voor rondleidingen, proeverijen, catering en gastvrijheid.

Het is een antwoord op de groeiende vraag naar authentieke ervaringen, verbonden met het land en direct contact met de producenten.

## Wat doe je bij een olijfmolen tijdens een bezoek?

### Tijdens de persperiode (oktober–december)

Een bezoek aan een olijfmolen *tijdens de oogst- en persperiode* is de meest complete en meeslepende ervaring:

1. **Wandeling door de olijfgaard**: observeer de handmatige oogst, begrijp de rijpingsindex en spreek met de oogsters
2. **Rondleiding door de actieve molen**: bekijk het kneuzen, het mengen (gramolazione) en de centrifuge — de geur van een actieve molen is uniek en onvergetelijk
3. **Proeven van vers geperste olijfolie** (mosto d'olio): troebel, felgroen en intens scherp — een ervaring die je nooit vergeet
4. **Begeleide proeverij** van verschillende olijfoliën met verschillende smaakprofielen

### Buiten het oogstseizoen

Ook buiten het oogstseizoen biedt een bezoek aan een goed gestructureerde olijfmolen:

- Een educatieve rondleiding door de molen met uitleg over het extractieproces
- Gestructureerde proeverij in combinatie met lokale specialiteiten
- Mogelijkheid tot directe aankoop met een persoonlijk contact met de producent

## Waarom het de moeite waard is

Wie een olijfmolen bezoekt, keert naar huis terug met:

- Een compleet ander begrip van wat hij elke dag op zijn bord schenkt
- Het levenslange vermogen om een hoogwaardige extra vierge olijfolie te onderscheiden van een matige olie
- Een directe vertrouwensrelatie met de producent
- Zintuiglijke herinneringen die op geen enkele andere manier te verkrijgen zijn

> Je kunt de smaak van verse olijfoliemost die net uit de separator komt niet in woorden uitdrukken. Je moet het ervaren.

:::cta
Boek uw rondleiding of proeverij bij Frantoio del Pasqua
Het hele jaar door beschikbaar — met oogstervaring in oktober/november.
[Nu boeken](/degustazioni)
:::`,
    },
    "da": {
      slug: "olivenolieturisme-besoeg-oliemoelle-oplevelse",
      title: "Olivenolieturisme og besøg på oliemølle: Hvad man gør, og hvorfor det er det hele værd",
      excerpt: "Olivenolieturisme (oleoturisme) er en af Italiens mest autentiske mad- og vinoplevelser. Besøg oliemøllen under presningen.",
      category: "Vores Oliemølle",
      content: `## Hvad er olivenolieturisme?

**Olivenolieturisme** (oleoturisme) er den form for mad- og vinturisme, der er knyttet til olivenoliens verden. I Italien er det officielt anerkendt ved lov (**italiensk lov nr. 158/2019**). Denne lov sidestiller olivenolieproducenter med vinbønder i muligheden for at åbne deres ejendomme for rundvisninger, smagninger, forplejning og overnatning.

Det er et svar på den stigende efterspørgsel efter autentiske oplevelser, tæt på jorden og med personlig kontakt til producenterne.

## Hvad laver man på en oliemølle under besøget?

### Under høstsæsonen (oktober–december)

At besøge en oliemølle *under høst- og pressetiden* er den mest komplette og fascinerende oplevelse:

1. **Gåtur i olivenlunden**: Se den manuelle høst eller brugen af olivenrystere, lær om modningsindekset, og tal med høstarbejderne.
2. **Rundvisning i den aktive mølle**: Se presning, æltning og centrifugering — duften af en oliemølle i drift er helt uforlignelig.
3. **Smagning af helt nypresset olie** (mosto d'olio): Ufiltreret, grøn, pebret og intens — en oplevelse, du aldrig glemmer.
4. **Guidet smagning** af flere olivenolier med forskellige profiler.

### Uden for høstsæsonen

Også uden for høstsæsonen byder et besøg på en velorganiseret oliemølle på:

- Rundvisning på møllen med forklaring af ekstraktionsprocessen.
- Struktureret smagning kombineret med lokale specialiteter.
- Mulighed for direkte køb og hyggelig snak med producenten.

## Hvorfor det er det hele værd

De, der besøger en oliemølle, vender hjem med:

- En helt anden forståelse af, hvad de hælder over maden hver eneste dag.
- Evnen til altid at kunne kende forskel på en god ekstra jomfruolivenolie og en middelmådig olie.
- Et personligt tillidsforhold til producenten.
- Sensoriske minder, som er umulige at få på andre måder.

*Man kan ikke forklare smagen af frisk olivenoliemost direkte fra separatoren med ord. Det skal opleves.*

:::cta
Book din rundvisning eller smagning hos Frantoio del Pasqua
Tilgængelig hele året – med høstoplevelse i oktober/november.
[Book nu](/degustazioni)
:::`,
    },
    "no": {
      slug: "olivenoljeturisme-besoek-oliemoelle-opplevelse",
      title: "Olivenoljeturisme og besøk på oliemølle: Hva man gjør, og hvorfor det er verdt det",
      excerpt: "Olivenoljeturisme (oleoturisme) er en av Italias mest autentiske mat- og vinopplevelser. Besøk oliemøllen under pressingen.",
      category: "Vores Oliemølle",
      content: `## Hva er olivenoljeturisme?

**Olivenoljeturisme** (oleoturisme) er den formen for mat- og vinturisme som er knyttet til olivenoljens verden. I Italia er det offisielt anerkjent ved lov (**italiensk lov nr. 158/2019**). Denne loven likestiller olivenoljeprodusenter med vinbønder i muligheten til å åpne eiendommene sine for omvisninger, smakinger, bevertning og overnatting.

Det er et svar på den økende etterspørselen etter autentiske opplevelser, nær jorden og med personlig kontakt med produsentene.

## Hva gjør man på en oliemølle under besøket?

### Under høstsesongen (oktober–desember)

Å besøke en oliemølle *under høst- og pressetiden* er den mest komplette og fascinerende opplevelsen:

1. **Gåtur i olivenlunden**: Se den manuelle høsten eller bruken av olivenhøstere, lær om modningsindeksen, og snakk med høstarbeiderne.
2. **Omvisning i den aktive møllen**: Se pressing, elting og sentrifugering — duften av en oliemølle i drift er helt uforlignelig.
3. **Smaking av helt nypresset olje** (mosto d'olio): Ufiltrert, grønn, pepret og intens — en opplevelse du aldri glemmer.
4. **Guidet smaking** av flere olivenoljer med forskjellige profiler.

### Utenfor høstsesongen

Også utenfor høstsesongen byr et besøk på en velorganisert oliemølle på:

- Omvisning på møllen med forklaring av ekstraksjonsprosessen.
- Strukturert smaking kombinert med lokale spesialiteter.
- Mulighet for direkte kjøp og en hyggelig prat med produsenten.

## Hvorfor det er verdt det

De som besøker en oliemølle, vender hjem med:

- En helt annen forståelse av hva de heller over maten hver eneste dag.
- Evnen til alltid å kunne kjenne forskjell på en god ekstra jomfruolivenolje og en middelmådig olje.
- Et personlig tillitsforhold til produsenten.
- Sensoriske minner som er umulige å få på andre måter.

*Man kan ikke forklare smaken av fersk olivenoljemost direkte fra separatoren med ord. Det må oppleves.*

:::cta
Bestill din omvisning eller smaking hos Frantoio del Pasqua
Tilgjengelig hele året – med høstopplevelse i oktober/november.
[Bestill nå](/degustazioni)
:::`,
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
      content: `## On Taste

### Why does the oil sting in the throat?

The stinging sensation is caused by **oleocanthal**, a polyphenol present almost exclusively in high-quality extra virgin olive oil. It is not a defect — it is one of the best indicators of freshness and quality. The more it stings, the more oleocanthal is present, and the healthier your oil is.

### Why is the oil bitter?

Bitterness is caused primarily by **oleuropein** and its derivatives. Like the stinging sensation, it is a *positive* attribute: it indicates a high content of polyphenols. A flat, sweet oil is almost always of lower quality.

### My oil no longer stings — has it gone bad?

Not necessarily gone bad, but it has lost a large part of its polyphenols. These degrade over time, especially if the oil has been exposed to light, heat, or oxygen. The flat taste means the health benefits are reduced, but the oil might still be perfectly fine for cooking if it does not smell or taste rancid.

## On Appearance

### Why has my oil become cloudy?

If it is an unfiltered new season oil (novello), cloudiness is completely normal — these are suspended micro-particles of olive pulp. They will settle at the bottom over time.

If it is a filtered oil that has become cloudy or solidified, it has likely undergone partial crystallization of waxes and saturated fats due to low temperatures (< 10°C). Bringing it back to room temperature will melt the crystals and return it to a clear state — without any damage to quality.

### Can the color of the oil indicate quality?

*No*. The color varies from deep green to golden yellow depending on the cultivar, the ripening stage of the olives, and the filtration method. A green oil is not necessarily better than a golden one.

## On Storage

### Where should I keep the oil in the kitchen?

**Away from heat sources (like the stovetop), in the dark, and closed tightly**. Keeping the oil bottle on the counter next to the stove is the most common mistake. Instead: use a small opaque ceramic cruet for daily use and store the main supply in a dark, cool pantry or cellar.

### How long can I keep the oil open?

**Ideally 60–90 days from opening** to enjoy its best qualities. After 3 months in normal kitchen conditions, the oil remains edible but will have lost its aromatic intensity and a significant part of its anti-oxidants.

## On Price

### Why does artisanal EVOO cost so much?

Because producing it genuinely costs a lot. For each liter of oil, 5 to 10 kg of olives are needed, harvested by hand or with mechanical shakers (never from the ground). Add to this: labor, milling costs, bottling, logistics, and taxes. Under 10–12€ per liter, it is mathematically impossible to produce true quality Italian EVOO.

:::cta
Have other questions? We are here
For any doubts about olive oil, the extraction process, or our products — write to us.
[Contact us](/shop)
:::`,
    },
    "de": {
      slug: "olivenoel-extra-faq-haeufige-fragen",
      title: "FAQ zu Olivenöl Extra: Warum es kratzt, warum es trüb ist, Haltbarkeit",
      excerpt: "Die häufigsten Fragen zu nativem Olivenöl Extra mit direkten Antworten ohne unnötiges Fachchinesisch. Von der Lagerung bis zum Preis.",
      category: "Olivenöl-Informationen",
      content: `## Zum Geschmack

### Warum kratzt das Öl im Hals?

Das Kratzen im Hals wird durch **Oleocanthal** verursacht, ein Polyphenol, das fast ausschließlich in hochwertigem Olivenöl Extra Vergine vorkommt. Es ist kein Fehler – sondern einer der besten Indikatoren für Frische und Qualität. Je mehr es kratzt, desto mehr Oleocanthal ist enthalten und desto gesünder ist Ihr Öl.

### Warum schmeckt das Öl bitter?

Bitterkeit wird in erster Linie durch **Oleuropein** und seine Derivate verursacht. Wie das Kratzen im Hals ist dies ein *positives* Merkmal: Es deutet auf einen hohen Polyphenolgehalt hin. Ein flaches, süßes Öl ist fast immer von minderer Qualität.

### Mein Öl kratzt nicht mehr – ist es abgelaufen?

Nicht unbedingt abgelaufen, aber es hat einen Großteil seiner Polyphenole verloren. Diese bauen sich im Laufe der Zeit ab, insbesondere wenn das Öl Licht, Hitze oder Luft ausgesetzt war. Der flache Geschmack bedeutet, dass die gesundheitlichen Vorteile verringert sind, aber das Öl kann zum Kochen verwendet werden, solange es nicht ranzig riecht.

## Zum Aussehen

### Warum ist mein Öl trüb geworden?

Wenn es sich um ein ungefiltertes neues Öl handelt, ist die Trübung völlig normal – es handelt sich um schwebende Fruchtfleischpartikel. Sie setzen sich mit der Zeit am Boden ab.

Wenn es sich um ein gefiltertes Öl handelt, das trüb geworden oder fest geworden ist: Es hat wahrscheinlich eine teilweise Kristallisation der Wachse bei niedrigen Temperaturen (< 10 °C) stattgefunden. Wenn man es wieder auf Raumtemperatur bringt, wird es wieder flüssig und klar – ohne Qualitätsverlust.

### Zeigt die Farbe des Öls die Qualität an?

*Nein*. Die Farbe variiert je nach Olivensorte, Reifegrad und Filtrationsmethode von tiefgrün bis goldgelb. Ein grünes Öl ist nicht unbedingt besser als ein goldenes.

## Zur Lagerung

### Wo bewahre ich das Öl in der Küche auf?

**Fern von Hitzequellen (wie dem Herd), im Dunkeln und fest verschlossen**. Die Flasche auf der Arbeitsplatte neben dem Herd stehen zu lassen, ist der häufigste Fehler. Besser: Verwenden Sie eine kleine, lichtundurchlässige Karaffe für den täglichen Gebrauch und lagern Sie den Vorrat in einer dunklen, kühlen Speisekammer.

### Wie lange kann ich das Öl geöffnet aufbewahren?

**Idealerweise 60–90 Tage nach dem Öffnen**, um die besten Eigenschaften zu genießen. Nach 3 Monaten unter normalen Küchenbedingungen verliert das Öl an Intensität und Antioxidantien, bleibt aber essbar.

## Zum Preis

### Warum kostet handwerkliches Olivenöl Extra Vergine so viel?

Weil die Herstellung tatsächlich so viel kostet. Für jeden Liter Öl werden 5 bis 10 kg Oliven benötigt, die von Hand oder mit Rüttlern (niemals vom Boden) geerntet werden. Hinzu kommen: Arbeit, Mahlkosten, Abfüllung, Logistik und Steuern. Unter 10–12 € pro Liter ist es mathematisch unmöglich, echte Qualität zu erzeugen.

:::cta
Haben Sie weitere Fragen? Wir sind für Sie da
Bei Fragen zum Öl, zum Prozess oder zu unseren Produkten – schreiben Sie uns.
[Kontakt aufnehmen](/shop)
:::`,
    },
    "nl": {
      slug: "extra-vierge-olijfolie-veelgestelde-vragen-faq",
      title: "FAQ over Extra Vierge Olijfolie: Waarom het prikkelt, houdbaarheid en prijs",
      excerpt: "De meest gestelde vragen over extra vierge olijfolie, met directe antwoorden zonder onnodig jargon. Van bewaring tot prijs.",
      category: "Olijfolie-informatie",
      content: `## Over de Smaak

### Waarom prikkelt olijfolie achter in de keel?

Het prikkelende gevoel wordt veroorzaakt door **oleocanthal**, een polifenol dat vrijwel uitsluitend in kwalitatieve extra vierge olijfolie voorkomt. Het is geen defect — het is een van de beste indicatoren van versheid en kwaliteit. Hoe meer het prikkelt, hoe meer oleocanthal er aanwezig is, en hoe gezonder uw olijfolie is.

### Waarom is de olijfolie bitter?

Bitterheid wordt voornamelijk veroorzaakt door **oleuropeine** en de derivaten daarvan. Net als het prikkelende gevoel is dit een *positieve* eigenschap: het duidt op een hoog gehalte aan polifenolen. Een vlakke, zoete olijfolie is bijna altijd van mindere kwaliteit.

### Mijn olie prikkelt niet meer — is hij over de datum?

Niet per se bedorven, maar hij heeft een groot deel van de polifenolen verloren. Deze breken in de loop van de tijd af, vooral als de olie is blootgesteld aan licht, warmte of lucht. De vlakke smaak betekent dat de gezondheidsvoordelen zijn verminderd, maar de olie is nog prima bruikbaar als hij niet ranzig ruikt.

## Over het Uiterlijk

### Waarom is mijn olijfolie troebel geworden?

Als het een ongefilterde nieuwe olijfolie (novello) is, is de troebelheid volkomen normaal — dit zijn microscopisch kleine deeltjes olijfvruchtvlees in suspensie. Deze bezinken na verloop van tijd vanzelf op de bodem.

Als het een gefilterde olie is die troebel of gestold is: waarschijnlijk is de olie gedeeltelijk gekristalliseerd door lage temperaturen (< 10°C). Wanneer de olijfolie weer op kamertemperatuur wordt gebracht, smelt deze weer en wordt hij weer helder — zonder enig kwaliteitsverlies.

### Geeft de kleur van de olijfolie de kwaliteit aan?

*Nee*. De kleur varieert van diepgroen tot goudgeel, afhankelijk van de cultivar, de rijpheid van de olijven en de filtratiemethode. Een groene olie is niet noodzakelijkerwijs beter dan een gouden.

## Over het Bewaren

### Waar bewaar ik de olijfolie in de keuken?

**Uit de buurt van warmtebronnen (zoals het fornuis), in het donker en goed afgesloten**. De olijfoliefles op het aanrecht naast het fornuis laten staan is de meest gemaakte fout. Beter: gebruik een klein, ondoorzichtig keramisch olijfoliekanetje voor dagelijks gebruik en bewaar de voorraad in een donkere, koele kast of kelder.

### Hoe lang kan ik de olijfolie geopend bewaren?

**Ideaal 60–90 dagen na opening** om van de beste kwaliteiten te genieten. Na 3 maanden in normale keukenomstandigheden blijft de olijfolie eetbaar, maar heeft deze zijn aromatische intensiteit en een groot deel van zijn antioxidanten verloren.

## Over de Prijs

### Waarom kost ambachtelijke extra vierge olijfolie zoveel?

Omdat de productie ervan daadwerkelijk erg duur is. Voor elke liter olie is 5 tot 10 kg olijven nodig, met de hand geoogst of met schudders (nooit van de grond geraapt). Tel daarbij op: arbeid, perskosten, bottelen, logistiek en btw. Onder de 10–12€ per liter is het wiskundig onmogelijk om echte Italiaanse kwaliteit te leveren.

:::cta
Heeft u andere vragen? Wij staan voor u klaar
Voor al uw vragen over olijfolie, ons proces of onze producten — stuur ons een bericht.
[Neem contact op](/shop)
:::`,
    },
    "da": {
      slug: "olivenolie-information/extra-virgin-olive-oil-faq-questions",
      title: "FAQ om olivenolie: Hvorfor kradser den, holdbarhed og pris",
      excerpt: "De mest almindelige spørgsmål om ekstra jomfruolivenolie med direkte svar uden svære fagord. Fra opbevaring til pris.",
      category: "Olivenolie-information",
      content: `## Om smagen

### Hvorfor kradser olien i halsen?

Den kradsende fornemmelse skyldes **oleocanthal**, en polyfenol, der findes næsten udelukkende i ekstra jomfruolivenolie af høj kvalitet. Det er ikke en fejl – det er tværtimod en af de bedste indikatorer for friskhed og kvalitet. Jo mere den kradser, jo mere oleocanthal er der i, og jo sundere er din olie.

### Hvorfor er olien bitter?

Bitterhed skyldes primært **oleuropein** og dets derivater. Ligesom den kradsende fornemmelse er dette en *positiv* egenskab: Det indikerer et højt indhold af polyfenoler. En flad og sød olie er næsten altid af ringere kvalitet.

### Min olie kradser ikke længere – er den for gammel?

Ikke nødvendigvis for gammel, men den har mistet en stor del af sine polyfenoler. Disse nedbrydes over tid, især hvis olien har været udsat for lys, varme eller luft. Den flade smag betyder, at de sundhedsmæssige fordele er reduceret, men olien kan stadig bruges, hvis den ikke dufter harsk.

## Om udseendet

### Hvorfor er min olie blevet uklar?

Hvis det er en ufiltreret friskpresset olie, er uklarheden helt normal – det er blot små svævende frugtkødspartikler. De vil lægge sig på bunden over tid.

Hvis det er en filtreret olie, der er blevet uklar eller fast: Olien har sandsynligvis gennemgået en delvis krystallisering under lave temperaturer (< 10 °C). Når den bringes tilbage til stuetemperatur, smelter krystallerne, og den bliver klar igen – uden kvalitetsforringelse.

### Indikerer oliens farve dens kvalitet?

*Nej*. Farven varierer fra dyb grøn til gylden gul afhængigt af olivensort, modningsgrad og filtreringsmetode. En grøn olie er ikke nødvendigvis bedre end en gylden.

## Om opbevaring

### Hvor skal jeg opbevare olien i køkkenet?

**Væk fra varmekilder (f.eks. komfuret), mørkt og tæt lukket**. At lade olieflasken stå på køkkenbordet ved siden af komfuret er den mest almindelige fejl. Bedre: Brug en lille, uigennemsigtig karaffel til daglig brug, og opbevar resten i et mørkt, køligt spisekammer.

### Hvor længe kan jeg have olien åben?

**Ideelt set 60–90 dage efter åbning** for at nyde de bedste smagsnuancer. Efter 3 måneder under normale køkkenforhold forbliver olien spiselig, men har mistet meget af sin aroma og en stor del af sine antioxidanter.

## Om prisen

### Hvorfor koster håndværksolivenolie så meget?

Fordi det er dyrt at producere. Til hver liter olie skal der bruges 5–10 kg olivener, høstet i hånden eller med rystere (aldrig fra jorden). Læg dertil: Arbejdskraft, presning, aftapning, logistik og moms. Under 10–12 € pr. liter er det matematisk umuligt at producere ægte italiensk kvalitet.

:::cta
Har du andre spørgsmål? Vi er her for dig
Skriv til os, hvis du har spørgsmål om olien, processen eller vores produkter.
[Kontakt os](/shop)
:::`,
    },
    "no": {
      slug: "olivenoljefeil/hva-betyr-det",
      title: "FAQ om olivenolje: Hvorfor kiler den i halsen, holdbarhet og pris",
      excerpt: "De mest vanlige spørsmålene om ekstra jomfruolivenolje med direkte svar uten vanskelige fagord. Fra lagring til pris.",
      category: "Olivenolje-informasjon",
      content: `## Om smaken

### Hvorfor kiler oljen i halsen?

Den kiler eller brenner i halsen på grunn av **oleocanthal**, en polyfenol som finnes nesten utelukkende i ekstra jomfruolivenolje av høy kvalitet. Det er ikke en feil – det er tvert imot en av de beste indikatorene på friskhet og kvalitet. Jo mer den kiler, jo mer oleocanthal er det i den, og jo sunnere er oljen din.

### Hvorfor er oljen bitter?

Bitterhet skyldes primært **oleuropein** og dets derivater. Akkurat som den kileende fornemmelsen er dette en *positiv* egenskap: Det indikerer et høyt innhold av polyfenoler. En flat og søt olje er nesten alltid av dårligere kvalitet.

### Oljen min kiler ikke lenger – er den utgått på dato?

Ikke nødvendigvis utgått på dato, men den har mistet en stor del av polyfenolene sine. Disse brytes ned over tid, spesielt hvis oljen har vært utsatt for lys, varme eller luft. Den flate smaken betyr at de helsemessige fordelene er redusert, men oljen kan fortsatt brukes hvis den ikke lukter harskt.

## Om utseendet

### Hvorfor er oljen min blitt uklar?

Hvis det er en ufiltrert ferskpresset olje, er uklarheten helt normal – det er bare små svevende partikler fra fruktkjøttet. De vil legge seg på bunnen over tid.

Hvis det er en filtrert olje som er blitt uklar eller fast: Oljen har sannsynligvis gjennomgått en delvis krystallisering under lave temperaturer (< 10 °C). Når den bringes tilbake til romtemperatur, smelter krystallene og den blir klar igjen – uten kvalitetstap.

### Indikerer oljens farge kvaliteten?

*Nei*. Fargen varierer fra dyp grønn til gyllengul avhengig av olivensort, modningsgrad og filtreringsmetode. En grønn olje er ikke nødvendigvis bedre enn en gyllen.

## Om lagring

### Hvor skal jeg oppbevare oljen på kjøkkenet?

**Unna varmekilder (f.eks. komfyren), mørkt og tett lukket**. Å la oljeflasken stå på kjøkkenbenken ved siden av komfyren er den vanligste feilen. Bedre: Bruk en liten, ugjennomsiktig karaffel til daglig bruk, og oppbevar resten i et mørkt, kjølig spiskammer.

### Hvor lenge kan jeg ha oljen åpen?

**Ideelt sett 60–90 dager etter åpning** for å nyte de beste smaksnyansene. Etter 3 måneder under normale kjøkkenforhold forblir oljen spiselig, men har mistet mye av aromaen og en stor del av antioksidantene.

## Om prisen

### Hvorfor koster håndverksolivenolje så mye?

Fordi det genuint koster mye å produsere den. Til hver liter olje trengs det 5–10 kg oliven, høstet for hånd eller med rystere (aldri fra bakken). Legg til: Arbeidskraft, pressing, tapping, logistikk og moms. Under 10–12 € per liter er det matematisk umulig å produsere ekte italiensk kvalitet.

:::cta
Har du andre spørsmål? Vi er her for deg
Skriv til oss hvis du har spørsmål om oljen, prosessen eller produktene våre.
[Kontakt oss](/shop)
:::`,
    },
  },
"""

content = content[:start_idx] + new_block + content[end_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement 3 successful!")
