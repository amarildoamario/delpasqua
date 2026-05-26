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
      category: "Salute & Benessere",
      content: "## Più di un semplice ingrediente\n\nSpesso releghiamo l’olio a un ruolo di secondo piano: un filo sulla verdura, un giro veloce in padella per non far attaccare la carne. Ma per chi è attento al proprio benessere e ama condurre una vita dinamica e attiva, l’Olio Extra Vergine di Oliva spremuto a freddo dovrebbe essere il vero protagonista dell'alimentazione quotidiana.\n\nNon è un caso che le popolazioni mediterranee, storicamente grandi consumatrici di questo \"oro liquido\", registrino tassi di longevità e qualità della vita tra i più alti al mondo. L’olio non fa miracoli: fa scienza.\n\n## Carburante per il corpo in movimento\n\nOgni volta che ci alleniamo – che sia una corsa all’alba, una sessione di pilates o una lunga camminata in salita – il nostro corpo subisce uno stress. I muscoli affrontano piccole infiammazioni e produciamo radicali liberi. È il prezzo normale da pagare per restare in forma.\n\nQui entra in gioco l’olio EVO. Essendo la fonte naturale più ricca di **acido oleico** (un grasso monoinsaturo eccezionale per il sistema vascolare) e di potenti antiossidanti chiamati *polifenoli*, l’olio agisce come un pompiere naturale. L’oleocantale, in particolare, ha un’azione antinfiammatoria documentata che aiuta i tessuti a recuperare più in fretta dopo lo sforzo fisico.\n\nPensate all’olio non come a un grasso pesante, ma come a un \"olio motore\" purissimo che lubrifica e spegne le infiammazioni dall’interno, permettendovi di recuperare prima e meglio.\n\n## Una scelta d'amore per il cuore\n\nTornare a casa dopo una giornata intensa e preparare una cena sana è un rito. Consumare quotidianamente Olio EVO spremuto a freddo significa introdurre nel sangue uno scudo protettivo.\n\nMigliaia di nutrizionisti oggi consigliano di non risparmiare sull’olio buono: i suoi grassi buoni hanno dimostrato, in decenni di studi, di saper pulire le arterie, riducendo il colesterolo LDL (quello problematico) e alzando contemporaneamente l’HDL, il celebre colesterolo \"spazzino\". Insieme, questi fattori mantengono le pareti dei vasi elastiche e tengono sotto controllo la pressione, proteggendo il vostro cuore battito dopo battito.\n\n> Non abbiate paura di condire la vostra vita. Un cucchiaio di olio EVO a crudo su un piatto bilanciato non vi appesantisce: vi dà l’energia pulita e la protezione di cui il vostro corpo ha un disperato bisogno per funzionare al meglio.\n\n:::cta\nScopri i nostri oli spremuti a freddo\nColtivati con amore, franti in giornata per mantenere intatti tutti i polifenoli.\n[Vai allo shop](/shop)\n:::",
    },
    "en": {
      slug: "benefits-extra-virgin-olive-oil-health",
      title: "The Health Benefits of Extra Virgin Olive Oil in Daily Life",
      excerpt: "It's not just a condiment; it's clean fuel for an active life. Discover how EVOO supports your day, nourishes muscles, and protects the heart.",
      category: "Health & Wellbeing",
      content: "## More Than a Simple Ingredient\n\nWe often relegate olive oil to a supporting role: a drizzle over salad, a quick splash in the pan to stop meat from sticking. But for anyone mindful of their well-being who loves leading a vibrant, active life, true cold-pressed Extra Virgin Olive Oil should be seen as a cornerstone of daily nutrition.\n\nIt is no coincidence that Mediterranean populations, historically major consumers of this \"liquid gold,\" enjoy some of the highest life expectancies and quality of life in the world. Olive oil is not magic: its benefits are backed by science.\n\n## Fuel for the Active Body\n\nWhenever we exercise—whether it's an early morning run, a Pilates class, or a long uphill hike—our bodies undergo stress. Muscles experience mild inflammation, and we produce free radicals. This is the normal price to pay for staying in shape.\n\nThis is where EVOO comes in. As nature's richest source of **oleic acid** (an exceptional monounsaturated fat for the vascular system) and powerful antioxidants called *polyphenols*, the oil acts like a natural ally. Oleocanthal, in particular, has documented anti-inflammatory actions that help tissues recover faster after physical exertion.\n\nThink of olive oil not as a heavy condiment, but as a pure \"engine oil\" that lubricates and cools down the body from within, allowing you to recover sooner and better.\n\n## A Heart-Healthy Choice\n\nComing home after a busy day and preparing a healthy dinner is a ritual. Daily consumption of cold-pressed Extra Virgin Olive Oil means introducing a natural shield into your bloodstream.\n\nThousands of nutritionists today advise against skimping on healthy oil: its healthy fats have been shown over decades of research to help keep arteries healthy, lowering LDL cholesterol (the problematic one) while simultaneously raising HDL, the so-called \"good\" cholesterol. Together, these factors help keep blood pressure under control, protecting your heart beat after beat.\n\n> Don't be afraid to season your life. A tablespoon of uncooked EVOO on a balanced meal doesn't weigh you down: it gives you the clean energy and protection your body needs to function at its best.\n\n:::cta\nDiscover our cold-pressed olive oils\nGrown with love, pressed on the same day to keep all polyphenols intact.\n[Go to shop](/shop)\n:::",
    },
    "de": {
      slug: "vorteile-extra-vergine-olivenoel-gesundheit",
      title: "Die gesundheitlichen Vorteile von nativem Olivenöl Extra im Alltag",
      excerpt: "Es ist nicht nur ein Gewürz, sondern sauberer Kraftstoff für ein aktives Leben. Erfahren Sie, wie Olivenöl Extra Ihren Tag unterstützt, Muskeln nährt und das Herz schützt.",
      category: "Gesundheit & Wohlbefinden",
      content: "## Mehr als nur eine Zutat\n\nWir degradieren Olivenöl oft zu einer Nebenrolle: ein Spritzer auf den Salat, ein schnelles Einfetten der Pfanne. Doch für alle, die auf ihr Wohlbefinden achten und ein aktives, vitales Leben lieben, sollte echtes, kaltgepresstes natives Olivenöl Extra der wahre Protagonist der täglichen Ernährung sein.\n\nEs ist kein Zufall, dass die Völker des Mittelmeerraums, die historisch gesehen große Konsumenten dieses „flüssigen Goldes“ sind, eine der höchsten Lebenserwartungen und Lebensqualitäten weltweit verzeichnen. Doch Olivenöl bewirkt keine Wunder: Es ist reine Wissenschaft.\n\n## Der Kraftstoff für Bewegung\n\nWenn wir Sport treiben – sei es beim Laufen im Morgengrauen, einer Pilates-Stunde oder einer langen Bergwanderung –, ist unser Körper Stress ausgesetzt. Die Muskeln entzünden sich leicht und wir produzieren freie Radikale. Das ist der normale Preis für Fitness.\n\nHier kommt Olivenöl Extra ins Spiel. Als reichste natürliche Quelle für **Ölsäure** (ein hervorragendes einfach ungesättigtes Fett für das Gefäßsystem) und hochwirksame Antioxidantien namens *Polyphenole* wirkt das Öl wie eine natürliche Feuerwehr. Insbesondere Oleocanthal hat eine dokumentierte entzündungshemmende Wirkung, die dem Gewebe hilft, sich nach körperlicher Anstrengung schneller zu erholen.\n\nStellen Sie sich Olivenöl nicht als schweres Fett vor, sondern als reinstes „Motoröl“, das den Körper von innen heraus schmiert und Entzündungen hemmt, sodass Sie sich schneller und besser erholen.\n\n## Eine Liebeserklärung an das Herz\n\nNach einem anstrengenden Tag nach Hause zu kommen und ein gesundes Abendessen zuzubereiten, ist ein Ritual. Der tägliche Konsum von kaltgepresstem nativem Olivenöl Extra führt einen natürlichen Schutzschild in Ihre Blutbahn ein.\n\nTausende von Ernährungsberatern raten heute dazu, nicht am gesunden Öl zu sparen: Seine guten Fette haben in jahrzehntelangen Studien gezeigt, dass sie die Arterien reinigen können. Sie senken das LDL-Cholesterin (das problematische) und erhöhen gleichzeitig das HDL, das berühmte „Aufräumer“-Cholesterin. Zusammen tragen diese Faktoren dazu bei, den Blutdruck unter Kontrolle zu halten und das Herz Schlag für Schlag zu schützen.\n\n> Haben Sie keine Angst, Ihr Leben zu bereichern. Ein Esslöffel rohes Olivenöl Extra auf einer ausgewogenen Mahlzeit belastet Sie nicht: Er gibt Ihnen die saubere Energie und den Schutz, den Ihr Körper dringend benötigt, um optimal zu funktionieren.\n\n:::cta\nEntdecken Sie unsere kaltgepressten Olivenöle\nMit Liebe angebaut, noch am selben Tag gepresst, um alle Polyphenole zu erhalten.\n[Zum Shop](/shop)\n:::",
    },
    "nl": {
      slug: "voordelen-extra-vierge-olijfolie-gezondheid",
      title: "De gezondheidsvoordelen van extra vierge olijfolie in het dagelijks leven",
      excerpt: "Het is niet zomaar een smaakmaker, het is schone brandstof voor een actief leven. Ontdek hoe extra vierge olijfolie je dag ondersteunt, spieren voedt en het hart beschermt.",
      category: "Gezondheid & Welzijn",
      content: "## Meer dan alleen een ingrediënt\n\nWe degraderen olijfolie vaak tot een bijrol: een scheutje over de salade, een snelle veeg in de pan om te zorgen dat het vlees niet plakt. Maar voor iedereen die bewust met zijn welzijn bezig is en van een levendig en actief leven houdt, zou echte koudgeperste extra vierge olijfolie de ware hoofdrolspeler in de dagelijkse voeding moeten zijn.\n\nHet is geen toeval dat de volkeren rond de Middellandse Zee, historisch gezien grote consumenten van dit 'vloeibare goud', een van de hoogste levensverwachtingen en levenskwaliteit ter wereld registreren. Olijfolie doet echter geen wonderen: het is wetenschap.\n\n## Brandstof voor wie in beweging is\n\nAls we sporten – of het nu een hardloopsessie bij zonsopgang is, een pilatesles of een lange wandeling bergop – ondergaat ons lichaam stress. Spieren raken licht ontstoken en we produceren vrije radicalen. Dat is the normale prijs die we betalen om fit te blijven.\n\nDit is waar extra vierge olijfolie in het spel komt. Als de rijkste natuurlijke bron van **oliezuur** (een uitzonderlijk enkelvoudig onverzadigd vet voor het vaatstelsel) en krachtige antioxidanten genaamd *polifenolen*, werkt de olijfolie als een natuurlijke brandweer. Met name oleocanthal heeft een gedocumenteerde ontstekingsremmende werking die weefsels helpt sneller te herstellen na fysieke inspanning.\n\nZie olijfolie niet als een zware dressing, maar als een pure 'motorolie' die het lichaam van binnenuit smeert en ontstekingen remt, waardoor je sneller en beter herstelt.\n\n## Een keuze uit liefde voor het hart\n\nThuiskomen na een drukke dag en een gezonde maaltijd bereiden is een ritueel. Dagelijkse consumptie van koudgeperste extra vierge olijfolie betekent dat je een natuurlijk schild in je bloedbaan introduceert.\n\nDuizenden voedingsdeskundigen adviseren tegenwoordig om niet te bezuinigen op gezonde olie: de goede vetten hebben in decennia van onderzoek aangetoond dat ze de slagaders kunnen reinigen, waarbij het LDL-cholesterol (het problematische) wordt verlaagd en tegelijkertijd het HDL-cholesterol, de bekende 'opruimer', wordt verhoogd. Samen helpen deze factoren om de bloeddruk onder controle te houden, waardoor het hart slag na slag wordt beschermd.\n\n> Wees niet bang om je leven op smaak te brengen. Een eetlepel rauwe extra vierge olijfolie op een gebalanceerde maaltijd verzwaart je niet: het geeft je de schone energie en de bescherming die je lichaam hard nodig heeft om optimaal te functioneren.\n\n:::cta\nOntdek onze koudgeperste olijfolie\nMet liefde geteeld, op dezelfde dag geperst om alle polifenolen intact te houden.\n[Naar de shop](/shop)\n:::",
    },
    "da": {
      slug: "fordele-ekstra-jomfruolivenolie-sundhed",
      title: "Fordelene ved ekstra jomfruolivenolie for dit daglige helbred",
      excerpt: "Det er ikke bare en ingrediens, det er rent brændstof til et aktivt liv. Oplev, hvordan ekstra jomfruolivenolie støtter din dag, nærer musklerne og beskytter hjertet.",
      category: "Sundhed & Velvære",
      content: "## Mere end bare en ingrediens\n\nVi reducerer ofte olivenolie til en birolle: et stænk over salaten eller en hurtig vending på panden, så kødet ikke hænger fast. Men for alle, der går op i deres velvære og elsker at leve et aktivt og energisk liv, bør ægte, koldpresset ekstra jomfruolivenolie betragtes som den sande hovedperson i den daglige kost.\n\nDet er ikke tilfældigt, at befolkningerne i Middelhavsområdet, som historisk set er store forbrugere af dette \"flydende guld\", registrerer en af de højeste forventede levetider og livskvaliteter i verden. Men olivenolie laver ikke mirakler: den laver videnskab.\n\n## Brændstof til kroppen i bevægelse\n\nNår vi dyrker sport – uanset om det er en løbetur ved solopgang, en pilates-time eller en lang vandretur op ad bakke – udsættes vores krop for stress. Musklerne bliver en smule betændte, og vi producerer frie radikaler. Det er den normale pris for at holde sig i form.\n\nDet er her, ekstra jomfruolivenolie kommer ind i billedet. Som naturens rigeste kilde til **oliesyre** (et enestående enkeltumættet fedtstof for karsystemet) og kraftfulde antioxidanter kaldet *polyfenoler*, fungerer olien som en naturlig brandmand. Især oleocanthal har en dokumenteret antiinflammatorisk virkning, der hjælper vævene med at restituere hurtigere efter fysisk anstrengelse.\n\nTænk ikke på olivenolie som en tung dressing, men som en ren \"motorolie\", der smører og dæmper betændelse i kroppen indefra, så du restituerer hurtigere og bedre.\n\n## Et kærligt valg for hjertet\n\nAt komme hjem efter en travl dag og tilberede en sund middag er et ritual. At indtage koldpresset ekstra jomfruolivenolie dagligt betyder, at du introducerer et naturligt skjold i din blodstrøm.\n\nTusindvis af ernæringseksperter opfordrer i dag til ikke at spare på den sunde olie: dens gode fedtstoffer har gennem årtiers forskning vist sig at kunne rense arterierne ved at sænke LDL-kolesterolet (det problematiske) og samtidig hæve HDL-kolesterolet, det berømte \"skraldemands-kolesterol\". Tilsammen hjælper disse faktorer med at holde blodtrykket under kontrol og beskytter hjertet slag efter slag.\n\n> Vær ikke bange for at sætte smag på dit liv. En spiseskefuld rå ekstra jomfruolivenolie på et velafbalanceret måltid tynger dig ikke: den giver dig den rene energi og beskyttelse, som din krop har desperat brug for for at fungere optimalt.\n\n:::cta\nOplev vores koldpressede olivenolier\nDyrket med kærlighed, presset samme dag for at holde alle polyfenoler intakte.\n[Gå til shoppen](/shop)\n:::",
    },
    "no": {
      slug: "fordeler-ekstra-jomfruolivenolje-helse",
      title: "Fordelene med ekstra jomfruolivenolje for din daglige helse",
      excerpt: "Det er ikke bare et tilbehør, det er rent drivstoff for et aktivt liv. Oppdag hvordan ekstra jomfruolivenolje støtter hverdagen, nærer musklene og beskytter hjertet.",
      category: "Helse & Velvære",
      content: "## Mer enn bare en ingrediens\n\nVi reduserer ofte olivenolje to en birolle: en sprut over salaten, eller en rask sving i pannen for at kjøttet ikke skal feste seg. Men for alle som er opptatt av velvære og elsker å leve et aktivt og energisk liv, bør ekte, kaldpresset ekstra jomfruolivenolje betraktes som den sanne hovedpersonen i det daglige kostholdet.\n\nDet er ikke tilfeldig at befolkningen i Middelhavsområdet, som historisk sett er store forbrukere av dette «flytende gullet», registrerer en av de høyeste levealderne og livskvalitetene i verden. Men olivenolje gjør ikke magi: den gjør vitenskap.\n\n## Drivstoff for kroppen i bevegelse\n\nNår vi trener – enten det er en løpetur i soloppgangen, en pilatestime eller en lang gåtur i motbakke – utsettes kroppen vår for stress. Musklene blir litt betente, og vi produserer frie radikaler. Det er den normale prisen å betale for å holde seg i form.\n\nDet er her ekstra jomfruolivenolje kommer inn i bildet. Som naturens rikeste kilde til **oljesyre** (et enestående enumettet fett for karsystemet) og kraftige antioksidanter kalt *polyfenoler*, fungerer oljen som en naturlig brannmann. Spesielt oleocanthal har en dokumenteret antiinflammatorisk virkning som hjelper vevene med å restituere raskere etter fysisk anstrengelse.\n\nTenk på olivenolje ikke som en tung dressing, men som en ren «motorolje» som smører og demper betennelser i kroppen innenfra, slik at du restituerer raskere og bedre.\n\n## Et kjærlig valg for hjertet\n\nÅ komme hjem etter en travel dag og tilberede en sunn middag er et ritual. Å innta kaldpresset ekstra jomfruolje daglig betyr at du introduserer et naturlig skjold i blodomløpet ditt.\n\nTusenvis av ernæringsfysiologer oppfordrer i dag til ikke å spare på den sunne oljen: Dens gode fettstoffer har gjennom flere tiår med studier vist seg å kunne rense arteriene ved å senke LDL-kolesterolet (det problematiske) og samtidig heve HDL, det berømte «feie-kolesterolet». Sammen bidrar disse faktorene til å holde blodtrykket under kontrol og beskytter hjertet slag etter slag.\n\n> Ikke vær redd for å sette smak på livet ditt. En spiseskje rå ekstra jomfruolivenolje på et balansert måltid tynger deg ikke: den gir deg den rene energien og beskyttelsen som kroppen din desperat trenger for å fungere på sitt beste.\n\n:::cta\nOppdag våre kaldpressede olivenoljer\nDyrket med kjærlighet, presset samme dag for å holde alle polyfenolene intakte.\n[Gå til butikken](/shop)\n:::",
    },
  },
"post-chem-1": {
    "it": {
      slug: "acidita-olio-evo",
      title: "L'acidità dell'Olio EVO: sfatiamo i miti comuni",
      excerpt: "Spesso si confonde il sentore di 'piccante' in gola con l'acidità. Scopriamo cos'è veramente e come si misura.",
      category: "Chimica dell'olio di oliva",
      content: `## Cosa intendiamo per Acidità?

C'è un equivoco diffusissimo: molti credono che l'olio *"che pizzica"* in gola sia acido. Niente di più falso! Il pizzicore è dovuto all'**oleocantale**, un polifenolo potentissimo e benefico. L'acidità di un olio, al contrario, **non è percepibile al palato**.

### Come si misura

L'acidità si esprime in grammi di acido oleico libero per 100 grammi di olio e si misura esclusivamente tramite analisi di laboratorio. Affinché un olio possa classificarsi come "Extra Vergine", per legge la sua acidità non deve superare lo **0,8%**.

L'acidità misura lo stato di degradazione del frutto: un'oliva sana, staccata dall'albero e molita rapidamente produrrà un olio con acidità minima (es. 0.1% o 0.2%). Un'oliva caduta a terra o lavorata in ritardo avrà acidità molto più alta.

> Il piccante in gola non è acidità — l'acidità si misura solo in laboratorio, non si sente in bocca.`
    },
    "en": {
      slug: "acidity-extra-virgin-olive-oil-myths",
      title: "Acidity in Extra Virgin Olive Oil: Debunking Common Myths",
      excerpt: "People often confuse the burning sensation in the throat with acidity. Let's discover what acidity really is and how it is measured.",
      category: "Olive Oil Chemistry",
      content: `## What do we mean by Acidity?

There is a widespread misconception: many believe that olive oil that *"stings"* in the throat is acidic. Nothing could be further from the truth! The peppery sting is due to **oleocanthal**, a powerful and highly beneficial polyphenol. A high-quality oil's acidity, on the other hand, **cannot be tasted on the palate**.

### How it is measured

Acidity is expressed in grams of free oleic acid per 100 grams of oil and is measured exclusively through laboratory analysis. For an oil to be classified as "Extra Virgin," by law its acidity must not exceed **0.8%**.

Acidity measures the state of degradation of the fruit: a healthy olive, picked from the tree and milled quickly, will produce an oil with minimal acidity (e.g., 0.1% or 0.2%). An olive that has fallen to the ground or was processed late will have much higher acidity.

> The spiciness in the throat is not acidity — acidity is measured only in the lab, you cannot taste it in the mouth.`
    },
    "de": {
      slug: "saeuregehalt-olivenoel-extra-mythen",
      title: "Der Säuregehalt von Olivenöl Extra: Häufige Mythen entkräftet",
      excerpt: "Oft wird das Kratzen im Hals mit dem Säuregehalt verwechselt. Wir erklären, was Säuregehalt wirklich bedeutet und wie er gemessen wird.",
      category: "Olivenölchemie",
      content: `## Was verstehen wir unter Säuregehalt?

Es gibt ein weit bevorzugtes Missverständnis: Viele glauben, dass Olivenöl, das im Hals *"kratzt"*, säurehaltig ist. Nichts könnte falscher sein! Das Kratzen wird durch **Oleocanthal** verursacht, ein hochwirksames und äußerst gesundes Polyphenol. Der Säuregehalt eines Öls hingegen ist **am Gaumen überhaupt nicht wahrnehmbar**.

### Wie er gemessen wird

Der Säuregehalt wird in Gramm freier Ölsäure pro 100 Gramm Öl ausgedrückt und ausschließlich im Labor gemessen. Damit ein Öl als „Natives Olivenöl Extra“ eingestuft werden kann, darf sein Säuregehalt gesetzlich **0,8 %** nicht überschreiten.

Der Säuregehalt misst den Zustand der Olive: Eine gesunde Olive, die vom Baum gepflückt und schnell gepresst wird, liefert ein Öl mit minimalem Säuregehalt (z. B. 0,1 % oder 0,2 %). Eine Olive, die zu Boden gefallen ist oder zu spät verarbeitet wurde, weist einen viel höheren Säuregehalt auf.

> Das Kratzen im Hals ist keine Säure — Säure wird nur im Labor gemessen und ist im Mund nicht schmeckbar.`
    },
    "nl": {
      slug: "zuurgraad-extra-vierge-olijfolie-mythen",
      title: "De zuurgraad van extra vierge olijfolie: veelvoorkomende mythen ontkracht",
      excerpt: "Men verwisselt de prikkelende smaak in de keel vaak met de zuurgraad. Ontdek wat het werkelijk is en hoe het wordt gemeten.",
      category: "Olijfoliechemie",
      content: `## Wat bedoelen we met Zuurgraad?

Er is een wijdverbreid misverstand: velen geloven dat olijfolie die *"prikt"* in de keel zuur is. Niets is minder waar! De prikkelende smaak is te danken aan **oleocanthal**, een krachtige en zeer heilzame polyfenol. De zuurgraad van een olie daarentegen is **niet waarneembaar op het palet**.

### Hoe het wordt gemeten

De zuurgraad wordt uitgedrukt in grammen vrij oliezuur per 100 gram olie en wordt uitsluitend gemeten via laboratoriumanalyse. Om als "Extra Vierge" te worden geclassificeerd, mag de zuurgraad wettelijk niet hoger zijn dan **0,8%**.

De zuurgraad meet de staat van degradatie van de vrucht: een gezonde olijf, geplukt van de boom en snel geperst, levert olie op met een minimale zuurgraad (bijv. 0,1% of 0.2%). Een olijf die op de grond is gevallen of te laat is verwerkt, zal een veel hogere zuurgraad hebben.

> De prikkeling in de keel is geen zuurgraad — de zuurgraad wordt alleen in het lab gemeten en proef je niet in de mond.`
    },
    "da": {
      slug: "syreindhold-ekstra-jomfruolivenolie-myter",
      title: "Syreindholdet i ekstra jomfruolivenolie: Vi afliver de almindelige myter",
      excerpt: "Man forveksler ofte den kildrende fornemmelse i halsen med syreindholdet. Lad os se, hvad det egentlig er, og hvordan det måles.",
      category: "Olivenoliekemi",
      content: `## Hvad mener vi med Syreindhold?

Der er en udbredt misforståelse: Mange tror, at olivenolie, der *"kradser"* i halsen, er sur. Intet kunne være mere forkert! Kradsningen skyldes **oleocanthal**, en yderst kraftfuld og gavnlig polyfenol. Olies syreindhold er derimod **overhovedet ikke mærkbart på ganen**.

### Hvordan det måles

Syreindholdet udtrykkes i gram fri oliesyre pr. 100 gram olie og måles udelukkende via laboratorieanalyse. For at en olie kan klassificeres som "Ekstra Jomfru", må dens syreindhold ifølge loven ikke overstige **0,8%**.

Syreindholdet måler frugtens sundhedstilstand: En sund oliven, plukket fra træet og presset hurtigt, vil producere en olie med minimalt syreindhold (f.eks. 0,1% eller 0,2%). En oliven, der er faldet til jorden eller forarbejdet for sent, vil have et meget højere syreindhold.

> Kradsningen i halsen er ikke syreindhold — syreindholdet måles kun i laboratoriet og kan ikke smages i munden.`
    },
    "no": {
      slug: "syreinnhold-ekstra-jomfruolivenolje-myter",
      title: "Syreinnholdet i ekstra jomfruolivenolje: Vi avliver vanlige myter",
      excerpt: "Mante forveksler den kildrende følelsen i halsen med syreinnholdet. La oss oppdage hva det egentlig er og hvordan det måles.",
      category: "Olivenoljekjemi",
      content: `## Hva mener vi med Syreinnhold?

Det er en utbredt misforståelse: Mange tror at olivenolje som *"klør"* i halsen, er sur. Ingenting kunne være mer feil! Kløen skyldes **oleocanthal**, en kraftig og svært sunn polyfenol. Oljens syreinnhold er derimot **overhodet ikke merkbart på ganen**.

### Hvordan det måles

Syreinnholdet uttrykkes i gram fri oljesyre per 100 gram olje og måles utelukkende via laboratorieanalyse. For at en olje skal kunne klassifiseres som "Ekstra Jomfru", må syreinnholdet ifølge loven ikke overstige **0,8%**.

Syreinnholdet måler fruktens tilstand: En sunn oliven, plukket fra treet og presset raskt, vil produsere en olje med minimalt syreinnhold (f.eks. 0,1% eller 0,2%). En oliven som har falt på bakken eller blitt behandlet for sent, vil ha mye høyere syreinnhold.

> Spissheten i halsen er ikke syre — syreinnholdet måles kun i laboratoriet og kan ikke smakes i munnen.`
    },
  },
"post-chem-2": {
    "it": {
      slug: "polifenoli-e-perossidi",
      title: "Polifenoli e Perossidi: come decifrare le analisi dell'olio",
      excerpt: "Impariamo a leggere insieme il referto chimico di un Olio Extravergine: cosa indicano i valori di perossidi e polifenoli.",
      category: "Chimica dell'olio di oliva",
    },
    "en": {
      slug: "polyphenols-peroxides-deciphering-olive-oil-analyses",
      title: "Polyphenols and Peroxides: How to Decipher Olive Oil Analyses",
      excerpt: "Let's learn how to read the lab report for extra virgin olive oil and what peroxide and polyphenol values really mean.",
      category: "Olive Oil Chemistry",
      content: `## Beyond the Commercial Label

When we come across the chemical analysis report for an olive oil, we find several terms that can seem cryptic. Besides acidity, **peroxides** and **polyphenols** stand out.

### Peroxides: Oxidation in Progress

The peroxide value (expressed in mEq O₂/kg) indicates oxidative alteration. The law sets the limit at **20 mEq O₂/kg** for extra virgin olive oil. An excellent oil is often between **4 and 8**.

### Polyphenols: The Natural Defense

They are the real treasure of EVOO: they counter oxidation and keep the peroxide level low over time. A high polyphenol value (> 300–400 mg/kg) indicates an oil with a strong sensory character — bitter and spicy — and an extremely long shelf life.

- *< 100 mg/kg*: poor oil (industrial, aged)
- *100–300 mg/kg*: commercial standard
- *300–500 mg/kg*: good quality
- *> 500 mg/kg*: absolute excellence

> Always ask your producer for the lab results — a good olive mill will be happy to provide them.`
    },
    "de": {
      slug: "polyphenole-peroxide-olivenoel-analysen-verstehen",
      title: "Polyphenole und Peroxide: Wie man Olivenöl-Analysen entziffert",
      excerpt: "Wir lernen gemeinsam, den chemischen Bericht eines Olivenöls Extra zu lesen: Was sagen Peroxid- und Polyphenolwerte aus?",
      category: "Olivenölchemie",
      content: `## Jenseits des kommerziellen Etiketts

Wenn wir den chemischen Analysebericht eines Olivenöls in Händen halten, stoßen wir auf Begriffe, die kryptisch erscheinen können. Neben dem Säuregehalt stechen besonders **Peroxide** und **Polyphenole** hervor.

### Peroxide: Die fortschreitende Oxidation

Die Peroxidzahl (ausgedrückt in mEq O₂/kg) gibt den Grad der oxidativen Veränderung an. Das Gesetz legt den Grenzwert für natives Olivenöl extra bei **20 mEq O₂/kg** fest. Ein hervorragendes Öl liegt oft zwischen **4 und 8**.

### Polyphenole: Der natürliche Schutz

Sie sind der wahre Schatz des Olivenöls Extra: Sie wirken der Oxidation entgegen und halten die Peroxidzahl im Laufe der Zeit niedrig. Ein hoher Polyphenolwert (> 300–400 mg/kg) weist auf ein Öl mit ausgeprägtem sensorischen Profil hin – bitter und scharf – und ist extrem langlebig.

- *< 100 mg/kg*: armes Öl (industriell, gealtert)
- *100–300 mg/kg*: kommerzieller Standard
- *300–500 mg/kg*: gute Qualität
- *> 500 mg/kg*: absolute Spitzenklasse

> Fordern Sie von Ihrem Erzeuger immer die Analysen an — eine gute Ölmühle stellt diese gerne zur Verfügung.`
    },
    "nl": {
      slug: "polifenolen-peroxiden-olijfolie-analyse-lezen",
      title: "Polifenolen en peroxiden: hoe je olijfolie-analyses ontcijfert",
      excerpt: "Leer samen met ons het chemische rapport van een extra vierge olijfolie te lezen: wat betekenen de waarden voor peroxiden en polifenolen?",
      category: "Olijfoliechemie",
      content: `## Voorbij het commerciële etiket

Wanneer we het chemische analyserapport van een olijfolie onder ogen krijgen, vinden we verschillende termen die cryptisch kunnen overkomen. Naast de zuurgraad vallen vooral **Peroxiden** en **Polifenolen** op.

### Peroxiden: Lopende oxidatie

Het aantal peroxiden (uitgedrukt in mEq O₂/kg) geeft de oxidatieve verandering aan. De wet stelt de grens voor extra vierge olijfolie op **20 mEq O₂/kg**. Een uitstekende olie ligt vaak tussen **4 en 8**.

### Polifenolen: De natuurlijke bescherming

Ze zijn de echte schat van extra vierge olijfolie: ze gaan oxidatie tegen en houden de peroxidenwaarden in de loop van de tijd laag. Een hoge waarde aan polifenolen (> 300–400 mg/kg) duidt op een olie met een sterk sensorisch karakter — bitter en pittig — en een extreem lange levensduur.

- *< 100 mg/kg*: arme olie (industrieel, verouderd)
- *100–300 mg/kg*: commerciële standaard
- *300–500 mg/kg*: goede kwaliteit
- *> 500 mg/kg*: absolute uitmuntendheid

> Vraag uw producent altijd om de analyses — een goede olijfmolen verstrekt deze graag.`
    },
    "da": {
      slug: "polyfenoler-peroxider-forstaa-olivenolieanalyser",
      title: "Polyfenoler og peroxider: Sådan tyder du olivenolieanalyser",
      excerpt: "Lad os lære at læse den kemiske rapport for en ekstra jomfruolivenolie: Hvad betyder værdierne for peroxider og polyfenoler.",
      category: "Olivenoliekemi",
      content: `## Mere end den kommercielle etiket

Når vi står med den kemiske analyserapport for en olivenolie, finder vi flere udtryk, der kan virke kryptiske. Ud over syreindholdet er det især **Peroxider** og **Polyfenoler**, der skiller sig ud.

### Peroxider: Igangværende oxidation

Peroxidtallet (udtrykt i mEq O₂/kg) angiver den oxidative ændring. Loven fastsætter grænsen til **20 mEq O₂/kg** for ekstra jomfruolivenolie. En fremragende olie ligger ofte mellem **4 og 8**.

### Polyfenoler: Det naturlige forsvar

De er den virkelige skat i ekstra jomfruolivenolie: de modvirker iltning og holder peroxidtallet lavt over tid. En høj polyfenolværdi (> 300–400 mg/kg) indikerer en olie med en stærk sensorisk karakter — bitter og kradsende — og en ekstrem lang holdbarhed.

- *< 100 mg/kg*: fattig olie (industriel, forældet)
- *100–300 mg/kg*: kommerciel standard
- *300–500 mg/kg*: god kvalitet
- *> 500 mg/kg*: absolut særklasse

> Spørg altid din producent efter analyserne — en god oliemølle leverer dem med glæde.`
    },
    "no": {
      slug: "polyfenoler-peroksider-forstaa-olivenoljeanalyser",
      title: "Polyfenoler og peroksider: Slik tyder du olivenoljeanalyser",
      excerpt: "La oss lære å lese den kjemiske rapporten for en ekstra jomfruolivenolje: Hva betyr verdiene for peroksider og polyfenoler.",
      category: "Olivenoljekjemi",
      content: `## Utover den kommersielle etiketten

Når vi får den kjemiske analyserapporten for en olivenolje i hendene, finner vi flere begreper som kan virke kryptiske. I tillegg til syreinnholdet skiller spesielt **Peroksider** og **Polyfenoler** seg ut.

### Peroksider: Pågående oksidasjon

Peroksidtallet (uttrykt i mEq O₂/kg) indikerer den oksidative endringen. Loven setter grensen til **20 mEq O₂/kg** for ekstra jomfruolivenolje. En utmerket olje ligger ofte mellom **4 og 8**.

### Polyfenoler: Det naturlige forsvaret

De er den virkelige skatten i ekstra jomfruolivenolje: de motvirker oksidasjon og holder peroksidtallet lavt over tid. En høy polyfenolverdi (> 300–400 mg/kg) indikerer en olje med en sterk sensorisk karakter — bitter og kløende — og en ekstremt lang holdbarhet.

- *< 100 mg/kg*: fattig olje (industriell, gammel)
- *100–300 mg/kg*: kommersiell standard
- *300–500 mg/kg*: god kvalitet
- *> 500 mg/kg*: absolutt særklasse

> Spørg alltid produsenten din etter analysene — en god oljemølle leverer dem med glede.`
    },
  },
"post-buy-2": {
    "it": {
      slug: "supermercato-vs-frantoio",
      title: "Supermercato o filiera corta? La verità sul prezzo dell'Olio Artigianale",
      excerpt: "Perché sugli scaffali troviamo olio EVO a 5€ quando al frantoio ne costa più del doppio? Facciamo i conti senza filtri e scopriamo cosa beviamo davvero.",
      category: "Consigli di acquisto",
    },
    "en": {
      slug: "supermarket-vs-olive-mill-price-artisanal-olive-oil",
      title: "Supermarket vs. Olive Mill: The Truth Behind Artisanal Olive Oil Prices",
      excerpt: "Why do we find EVOO for €5 on shelves when it costs more than double at the mill? Let's look at the real numbers and find out what we are really buying.",
      category: "Buying Guide",
      content: `## The Low Price Trick

It is now a familiar sight: long supermarket aisles filled with shiny golden bottles with "Extra Virgin Olive Oil" in large letters, and right next to them, a price tag showing unbelievable numbers like €4.99 or €5.99 per liter. It is enough to make anyone skeptical and wonder whether artisanal producers charging more than €12 are simply overpricing their oil.

But mathematics and agriculture never lie, and looking closely at the economics of the olive oil supply chain reveals a surprising and sometimes shocking truth.

## How Much a Liter of Oil Really Costs

To understand the true value of EVOO, we must start in the olive groves. Depending on the cultivar, the degree of ripeness, and the harvest year, it takes between **5 and 10 kg of fresh, completely healthy olives** to extract and produce a single liter of perfect oil.

Just add up the primary costs: manual labor to harvest gently without damaging the fruit; annual pruning and grove maintenance; rapid transport to the mill; the technological process of strictly cold mechanical extraction; and finally, dark glass packaging costs, customs duties, and VAT. Once you total these unavoidable fixed costs, producing a single liter of genuinely high-quality Italian EVOO for less than **€10-12** is simply impossible for any company.

## What We Buy with the Discount

So how do industrial producers achieve such bargain prices? The answer lies in origin and timing. Market giants buy bulk extra virgin oil from abroad – often Spanish or North African basins – where harvesting is highly mechanized and olives may even be gathered from the ground. Large bottlers then blend these oils, store them for long periods, and bottle them on an industrial scale.

The legal chemical parameters required to sell the product as "Extra Virgin" may still be met, but the organoleptic profile of the oil – the true vitality of the product – is often compromised.

> Buying directly from the olive mill is not gastronomic snobbery. It is the best guarantee that you are bringing home a real, fresh, and uncompromised food. A spoonful of genuine EVOO is worth a hundred cheap industrial bottles.

:::cta
From our mill to your table, with no intermediaries
Skip large-scale distribution and treat yourself to pure Tuscan olive juice.
[Order Del Pasqua Oil](/shop)
:::`
    },
    "de": {
      slug: "supermarkt-vs-oelmuehle-preis-handwerkliches-olivenoel",
      title: "Supermarkt oder Ölmühle? Die Wahrheit über den Preis von handwerklichem Olivenöl",
      excerpt: "Warum gibt es Olivenöl im Supermarkt für 5 €, während es in der Ölmühle das Doppelt kostet? Rechnen wir schonungslos ab und entdecken, was wir wirklich konsumieren.",
      category: "Einkaufsführer",
      content: `## Der Trick mit dem niedrigen Preis

Es ist mittlerweile ein vertrauter Anblick: lange Supermarktregale voller glänzender, goldener Flaschen mit der Aufschrift „Natives Olivenöl Extra“ in großen Buchstaben, und direkt daneben ein Preisschild mit unglaublichen Preisen wie 4,99 € oder 5,99 € pro Liter. Man wird skeptisch und fragt sich, ob diejenigen, die ihr Öl handwerklich für mehr als 12 € herstellen, einfach überhöhte Preise verlangen.

Doch Mathematik und Landwirtschaft lügen nie, und ein genauer Blick auf die Ökonomie der Olivenöl-Lieferkette offenbart eine überraschende und manchmal schockierende Wahrheit.

## Was ein Liter Öl wirklich kostet

Um den wahren Wert von nativem Olivenöl extra (EVOO) zu verstehen, müssen wir in den Olivenhainen beginnen. Je nach Sorte, Reifegrad und Erntejahr werden zwischen **5 und 10 kg frische, absolut gesunde Oliven** benötigt, um einen einzigen Liter perfekten Öls zu pressen.

Rechnen Sie nur die Primärkosten zusammen: manuelle Arbeit für eine schonende Ernte, ohne die Früchte zu beschädigen; jährlicher Rebschnitt und Pflege; schneller Transport zur Mühle; das technische Verfahren der streng kalten mechanischen Extraktion; und schließlich die Kosten für die Verpackung in dunklem Glas, Zölle und Mehrwertsteuer. Rechnet man diese unumgänglichen Fixkosten zusammen, ist die Herstellung eines einzigen Liters italienischen Olivenöls Extra von echter handwerklicher Spitzenqualität für weniger als **10-12 €** für jedes Unternehmen schlichtweg unmöglich.

## Was wir mit dem Rabatt kaufen

Wie schaffen es Industrieerzeuger also, solche Schleuderpreise anzubieten? Die Antwort liegt in der Herkunft und im Timing. Die Riesen des Marktes kaufen Chargen von nativem Olivenöl extra aus dem Ausland – oft aus spanischen oder nordafrikanischen Anbaugebieten –, wo Oliven hochgradig mechanisiert geerntet oder vom Boden aufgelesen werden. Riesige Abfüller sammeln diese Mischungen (sogenannte „EU-Blends“), mischen sie, lagern sie über lange Zeiträume und füllen sie in Massen ab.

Die chemisch-gesetzlichen Parameter für den Verkauf als „Natives Olivenöl Extra“ werden haarscharf eingehalten, aber das sensorische Profil dieses Öls – die wahre Vitalität des Produkts – ist stark beeinträchtigt und zerstört.

> Der Kauf direkt in der Ölmühle ist kein gastronomischer Snobismus, sondern die einzige chirurgische Garantie dafür, dass Sie Ihren Körper mit einem echten, frischen und unbelasteten Lebensmittel ernähren. Ein Löffel echtes Olivenöl Extra ist mehr wert als hundert billige Industrieflaschen.

:::cta
Von unserer Mühle auf Ihren Tisch, ohne Zwischenhändler
Umgehen Sie den Großhandel und gönnen Sie sich reinen toskanischen Olivensaft.
[Del Pasqua Öl bestellen](/shop)
:::`
    },
    "nl": {
      slug: "supermarkt-vs-olijfmolen-prijs-ambachtelijke-olijfolie",
      title: "Supermarkt of rechtstreeks van de molen? De waarheid over de prijs van ambachtelijke olijfolie",
      excerpt: "Waarom vinden we extra vierge olijfolie voor €5 in de schappen als het bij de molen meer dan het dubbele kost? We rekenen het zonder filters uit.",
      category: "Koopgids",
      content: `## De truc van de lage prijs

Het is inmiddels een vertrouwd gezicht: lange gangpaden in de supermarkt vol glanzende gouden flessen met in grote letters "Extra Vierge Olijfolie" en daarnaast een prijskaartje dat ongelooflijke bedragen toont zoals € 4,99 of € 5,99 per lager. We worden sceptisch en vragen ons af of degenen die ambachtelijk produceren voor meer dan € 12 simpelweg te veel rekenen.

Maar wiskunde en landbouw liegen nooit, en een blik achter de schermen van de olijfolieketen onthelt een verrassende en soms schokkende waarheid.

## Wat een liter olie echt kost

Om de werkelijke waarde van extra vierge olijfolie te begrijpen, moeten we in de olijfgaarden beginnen. Afhankelijk van de cultivar, de rijpheid en het oogstjaar is er tussen de **5 en 10 kg verse, kerngezonde olijven** nodig om één liter perfecte olijfolie te persen.

Tel alleen de primaire kosten bij elkaar op: handmatige arbeid om voorzichtig te oogsten zonder de vrucht te beschadigen; de jaarlijkse snoei- en reinigingswerkzaamheden; snel transport naar de molen; het technologische proces van strikt koude mechanische extractie; en tot slot de verpakkingskosten van donker glas, douanerechten en btw. Als we deze vaste kosten bij elkaar optellen, is het voor elk bedrijf simpelweg onmogelijk om één liter Italiaanse extra vierge olijfolie van echte ambachtelijke topkwaliteit te produceren voor minder dan **€ 10-12**.

## Wat we met de korting kopen

Maar hoe kunnen industriële producenten dan zulke spotprijzen hanteren? Het antwoord ligt in de herkomst en de timing. De reuzen van de markt kopen partijen extra vierge olijfolie uit het buitenland – vaak uit Spaanse of Noord-Afrikaanse regio's – waar de olijvenoogst zwaar gemechaniseerd is of waar olijven van de grond worden opgeraapt. Gigantische bottelaars verzamelen deze mengsels (de zogenaamde "EU-blends"), mengen ze, slaan ze langdurig op en bottelen ze in massale hoeveelheden.

De chemisch-wettelijke parameters om als "Extra Vierge" verkocht te worden, worden op het nippertje gehaald, maar het smaakprofiel van die olie – de werkelijke vitaliteit van het product – is aangetast en tenietgedaan.

> Rechtstreeks bij de olijfmolen kopen is geen culinair snobisme, maar de enige harde garantie dat u uw lichaam voedt met een echt, vers en onbesmet product. Eén lepel echte extra vierge is meer waard dan honderd goedkope industriële flessen.

:::cta
Van onze molen naar uw tafel, zonder tussenpersonen
Sla de supermarktketens over en schenk uzelf puur Toscaans olijvensap.
[Bestel Del Pasqua Olijfolie](/shop)
:::`
    },
    "da": {
      slug: "supermarked-vs-oliemoelle-prisen-paa-haandvaerksolivenolie",
      title: "Supermarked eller direkte fra møllen? Sandheden om prisen på håndværksolivenolie",
      excerpt: "Hvorfor finder vi ekstra jomfruolivenolie til 5 € på hylderne, når det koster mere end det dobbelte på møllen? Lad os regne det ud uden filtre.",
      category: "Købsguide",
      content: `## Tricket med den lave pris

Det er nu et velkendt syn: lange supermarkedshylder fyldt med skinnende gyldne flasker med "Ekstra Jomfruolivenolie" med store bogstaver, og lige ved siden af et prisskilt med utrolige tal som 4,99 € eller 5,99 € pr. liter. Vi bliver skeptiske og tænker på, om de, der producerer håndværksmæssigt til over 12 €, bare tager overpris.

Men matematik og landbrug lyver aldrig, og et nærmere kig på økonomien bag olivenoliens værdikæde afslører en overraskende og til tider chokerende sandhed.

## Hvad en liter olie egentlig koster

For at forstå den sande værdi af ekstra jomfruolivenolie (EVOO) skal vi starte i olivenlundene. Afhængigt af sorten, modenhedsgraden og høståret kræves der mellem **5 og 10 kg friske, helt sunde oliven** for at udvinde og producere en enkelt liter perfekt olie.

Prøv blot at lægge de primære omkostninger sammen: manuelt arbejde til at høste skånsomt uden at beskadige frugten; årlig beskæring og pleje; hurtig transport til møllen; den teknologiske proces med strengt koldmekaniske ekstraktion; og endelig omkostninger til emballering i mørkt glas, told og moms. Når man lægger disse uundgåelige faste udgifter sammen, især i lyset af råvaremangel, er det simpelthen umuligt for enhver virksomhed at producere en enkelt liter italiensk EVOO af sand håndværksmæssig høj kvalitet for under **10-12 €**.

## Hvad vi køber med rabatten

Men hvordan kan industriproducenterne så sælge til spotpriser? Svaret ligger i oprindelsen og timingen. Markedets giganter køber partier af ekstra jomfruolie fra udlandet – ofte spanske eller nordafrikanske områder – hvor oliven høstes maskinelt i stor skala eller samles op fra jorden. Gigantiske aftappere indsamler disse blandinger (såkaldte "EU-blends"), blander dem, opbevarer dem i lange perioder og aftapper dem i massive mængder.

De kemisk-juridiske parametre for at blive solgt som "Ekstra Jomfru" overholdes lige på grænsen, men oliens smagsprofil – produktets sande vitalitet – er kompromitteret og ødelagt.

> At købe direkte fra oliemøllen er ikke gastronomisk snobberi, men den eneste skudsikre garanti for, at du nærer din krop med en ægte, frisk og uforurenet fødevare. En skefuld ægte EVOO er mere værd end hundrede billige industriflasker.

:::cta
Fra vores mølle til dit bord, uden mellemled
Spring supermarkederne over, og forkæl dig selv med ren toskansk olivensaft.
[Bestil Del Pasqua Olivenolie](/shop)
:::`
    },
    "no": {
      slug: "supermarked-vs-oljemolle-prisen-paa-haandverksolivenolje",
      title: "Supermarked eller direkte fra møllen? Sannheten om prisen på håndverksolivenolje",
      excerpt: "Hvorfor finner vi ekstra jomfruolivenolje til 5 € i hyllene når det koster mer enn det dobbelte hos møllen? La oss regne det ut uten filtre.",
      category: "Kjøpsguide",
      content: `## Trikset med den lave prisen

Det er nå et velkjent syn: lange supermarkedshyller fylt med skinnende gyldne flasker med «Ekstra Jomfruolivenolje» med store bokstaver, og rett ved siden av en prislapp med utrolige tall som 4,99 € eller 5,99 € per liter. Vi blir skeptiske og lurer på om de som produserer håndverksmessig til over 12 €, bare tar overpris.

Men matematikk og landbruk lyver aldri, og en nærmere titt på økonomien bak olivenoljens verdikjede avslører en overraskende og til tider sjokkerende sannhet.

## Hva en liter olje faktisk koster

For å forstå den sanne verdien av ekstra jomfruolivenolje (EVOO) må vi starte i olivenlundene. Avhengig av sorten, modningsgraden og høståret, kreves det mellom **5 og 10 kg friske, helt sunne oliven** for å utvinne og produsere en enkelt liter perfekt olje.

Prøv bare å legge sammen de primære kostnadene: manuelt arbeid for å høste skånsomt uten å skade frukten; årlig beskjæring og pleie; rask transport til møllen; den teknologiske prosessen med strengt kaldmekanisk ekstraksjon; og til slutt kostnader til emballering i mørkt glass, toll og moms. Når man legger sammen disse uunngåelige faste utgiftene, er det rett og slett umulig for enhver bedrift å produsere en enkelt liter italiensk EVOO av sann håndverksmessig høy kvalitet for under **10-12 €**.

## Hva vi kjøper med rabatten

Men hvordan kan industriprodusentene da selge til spottpriser? Svaret ligger i opprinnelsen og timingen. Markedets giganter kjøper partier med ekstra jomfruolje fra utlandet – ofte spanske eller nordafrikanske områder – der oliven høstes maskinelt i stor skala eller samles opp fra bakken. Gigantiske avtappere samler inn disse blandingene (såkalte «EU-blends»), blander dem, lagrer dem i lange perioder og tapper dem i massive mengder.

De kjemisk-juridiske parameterne for å bli solgt som «Ekstra Jomfru» overholdes akkurat på grensen, men oljens smaksprofil – produktets sanneste vitalitet – er kompromittert og ødelagt.

> Å kjøpe direkte fra oljemøllen er ikke gastronomisk snobberi, men den eneste skuddsikre garantien for at du nærer kroppen din med en ekte, frisk og uforurenset matvare. En skje med ekte EVOO er mer verdt enn hundre billige industriflasker.

:::cta
Fra vår mølle til ditt bord, uten mellomledd
Hopp over supermarkedene og unn deg ren toskansk olivensaft.
[Bestill Del Pasqua Olivenolje](/shop)
:::`
    },
  },
"post-store-1": {
    "it": {
      slug: "quanto-dura-olio-evo",
      title: "Quanto dura un Olio EVO e come conservarlo al meglio",
      excerpt: "L'olio extravergine non scade nel senso classico, ma invecchia. Impariamo a leggere la data di scadenza e a difenderlo da luce e calore.",
      category: "Conservazione",
    },
    "en": {
      slug: "how-long-does-extra-virgin-olive-oil-last-storage",
      title: "How Long Does Extra Virgin Olive Oil Last, and How to Store It",
      excerpt: "Olive oil doesn't spoil like milk, but it does age. Learn to read best-by dates, why heat and light are the real enemies, and tips for proper home storage.",
      category: "Storage & Preservation",
      content: `## The misunderstanding about "expiration"

Let's start with the most common question: does olive oil have a real expiration date? The short answer is no. Olive oil does not suddenly become dangerous from one day to the next, like milk or fresh meat can.

What you usually see on the label is the **best-by** date. For Extra Virgin Olive Oil, many producers set this to about **18 months from bottling**.

After that date, the oil is still perfectly edible and safe. It has simply lost some of its fresh aroma and a portion of its antioxidant strength.

## When does the oil's clock start ticking?

Unlike wine, which can sometimes develop positively in the bottle, olive oil is at its absolute peak the day it leaves the mill. From that moment, a slow and natural decline begins.

The goal at home is therefore not to stop the clock, because that is chemically impossible. The goal is to slow it down as much as possible.

## The three big enemies in the kitchen

The factors that speed up aging, technically oxidation, are three. And usually, they are standing right in front of us.

- **Light**: light triggers destructive chain reactions. A clear bottle near a sunny window can degrade an excellent oil surprisingly quickly. *What to do: store the oil in the dark, in a closed cabinet, a tin, or a dark bottle.*
- **Oxygen**: the emptier the bottle gets, the more air remains above the oil. Oxygen works silently, driving the oil towards rancidity. *What to do: do not let almost-empty bottles sit for months; choose smaller formats if your usage is low, and always close the cap tightly.*
- **Heat**: the classic mistake is leaving the bottle right next to the stove. Every heat shock weakens the aromas and reduces the polyphenol content. *What to do: store the oil ideally between **12C and 18C**, far from burners and oven.*

## How long does it last in practice?

If you have bought a good oil and protected it from these three enemies, here is a realistic expectation:

- **Large unopened tin in a cool cellar**: can go up to 24 months without a major drop in quality.
- **Closed dark bottle in the pantry**: about **12 to 18 months** in very good condition.
- **Bottle or cruet in daily use in the kitchen**: ideally to be consumed within **2 to 3 months**.

> The real test is your nose: does the oil still smell fresh, olive-like, grassy, or green? Use it with pleasure. If it smells like old nuts, stale butter, or paint, its best moment is behind it.`,
    },
    "de": {
      slug: "wie-lange-ist-olivenoel-extra-haltbar-lagerung",
      title: "Wie lange ist Olivenöl Extra haltbar, und wie lagert man es richtig",
      excerpt: "Olivenöl verdirbt nicht, aber es altert. Lernen Sie, das Mindesthaltbarkeitsdatum zu lesen, warum Licht und Hitze die wahren Feinde sind, und Tipps zur Lagerung.",
      category: "Lagerung & Aufbewahrung",
      content: `## Das Missverständnis über den "Ablauf"

Beginnen wir mit der häufigsten Frage: Hat Olivenöl ein echtes Ablaufdatum? Die kurze Antwort lautet: Nein. Olivenöl wird nicht von einem Tag auf den anderen gefährlich, wie es bei Milch oder frischem Fleisch der Fall sein kann.

Was Sie normalerweise auf dem Etikett sehen, ist das **Mindesthaltbarkeitsdatum**. Für natives Olivenöl Extra setzen viele Hersteller dieses auf etwa **18 Monate ab Abfüllung** fest.

Nach diesem Datum ist das Öl immer noch genießbar und sicher. Es hat lediglich einen Teil seines frischen Aromas und seiner antioxidativen Kraft verloren.

## Wann beginnt die Uhr des Öls zu ticken?

Im Gegensatz zu Wein, der sich in der Flasche manchmal positiv entwickeln kann, ist Olivenöl an dem Tag, an dem es die Mühle verlässt, auf seinem absoluten Höhepunkt. Von diesem Moment an beginnt ein langsamer und natürlicher Abbau.

Das Ziel zu Hause ist daher nicht, die Uhr anzuhalten, da dies chemisch unmöglich ist. Das Ziel ist es, den Abbau so weit wie möglich zu verlangsamen.

## Die drei großen Feinde in der Küche

Es gibt drei Faktoren, die die Alterung – technisch gesehen die Oxidation – beschleunigen. Und meistens stehen sie direkt vor uns.

- **Licht**: Licht setzt zerstörerische Kettenreaktionen in Gang. Eine klare Flasche in der Nähe eines sonnigen Fensters kann ein hervorragendes Öl überraschend schnell beeinträchtigen. *Was zu tun ist: Lagern Sie das Öl im Dunkeln, in einem geschlossenen Schrank, einer Blechdose oder einer dunklen Flasche.*
- **Sauerstoff**: Je leerer die Flasche wird, desto mehr Luft verbleibt über dem Öl. Sauerstoff arbeitet geräuschlos und treibt das Öl in Richtung Ranzigkeit. *Was zu tun ist: Lassen Sie fast leere Flaschen nicht monatelang stehen; wählen Sie bei geringem Verbrauch kleinere Formate und schließen Sie den Deckel immer fest.*
- **Hitze**: Der klassische Fehler besteht darin, die Flasche direkt neben dem Herd stehenzulassen. Jeder Hitzeschock schwächt die Aromen und verringert den Polyphenolgehalt. *Was zu tun ist: Lagern Sie das Öl idealerweise zwischen **12 °C und 18 °C**, weit weg von Herdplatten und Backofen.*

## Wie lange hält es in der Praxis?

Wenn Sie ein gutes Öl gekauft und es vor diesen drei Feinden geschützt haben, ist dies eine realistische Erwartung:

- **Große ungeöffnete Blechdose im kühlen Keller**: Kann ohne größeren Qualitätsverlust bis zu 24 Monate gelagert werden.
- **Geschlossene dunkle Flasche in der Speisekammer**: Etwa **12 bis 18 Monate** in sehr gutem Zustand.
- **Flasche oder Karaffe im täglichen Gebrauch in der Küche**: Idealerweise innerhalb von **2 bis 3 Monaten** verbrauchen.

> Der echte Test ist Ihre Nase: Riecht das Öl noch frisch, nach Olive, grasig oder grün? Verwenden Sie es mit Freude. Wenn es nach alten Nüssen, ranziger Butter oder Farbe riecht, liegt sein bester Moment hinter ihm.`,
    },
    "nl": {
      slug: "hoe-lang-is-extra-vierge-olijfolie-houdbaar-bewaren",
      title: "Hoe lang is extra vierge olijfolie houdbaar, en hoe bewaar je het",
      excerpt: "Olijfolie bederft niet, maar veroudert wel. Leer de houdbaarheidsdatum te lezen, waarom licht en warmte de echte vijanden zijn, en tips voor het bewaren.",
      category: "Opslag & Bewaring",
      content: `## Het misverstand over "bedeven"

Laten we beginnen met de meest gestelde vraag: heeft olijfolie een echte vervaldatum? Het korte antwoord is nee. Olijfolie wordt niet plotseling gevaarlijk van de ene op de andere dag, zoals melk of vers vlees dat kan worden.

Wat u meestal op het etiket ziet, is de **ten minste houdbaar tot**-datum. Voor extra vierge olijfolie stellen veel producenten deze in op ongeveer **18 maanden vanaf het bottelen**.

Na die datum is de olie nog steeds perfect eetbaar en veilig. Hij heeft simpelweg wat van zijn frisse aroma en een deel van zijn antioxidante kracht verloren.

## Wanneer begint de klok van de olijfolie te tikken?

In tegenstelling tot wijn, die zich in de fles soms positief kan ontwikkelen, is olijfolie op zijn absolute hoogtepunt op de dag dat hij de pers verlaat. Vanaf dat moment begint een langzame en natuurlijke achteruitgang.

Het doel thuis is daarom niet om de klok stil te zetten, want dat is chemisch onmogelijk. Het doel is om het proces zo veel mogelijk te vertragen.

## De drie grote vijanden in de keuken

De factoren die veroudering, technisch gezien oxidatie, versnellen zijn er drie. En meestal staan ze gewoon in huis.

- **Licht**: licht veroorzaakt schadelijke kettingreacties. Een transparante fles bij een zonnig raam kan een uitstekende olie verrassend snel aantasten. *Wat doen: bewaar de olie donker, in een gesloten kast, blik of donkere fles.*
- **Zuurstof**: hoe leger de fles, hoe meer lucht boven de olie zit. Zuurstof werkt stilletjes door en versnelt de ontwikkeling van ranzigheid. *Wat doen: laat bijna lege flessen niet maanden staan; kies bij laag verbruik kleinere formaten en sluit altijd goed af.*
- **Warmte**: de klassieke fout is de oliefles naast het fornuis laten staan. Elke temperatuurschok schaadt de aroma's en verlaagt het gehalte aan polyfenolen. *Wat doen: bewaar de olie idealiter tussen **12C en 18C**, ver weg van fornuis en oven.*

## Hoe lang gaat ze in de praktijk mee?

Als je een goede olie hebt gekocht en haar tegen deze drie vijanden hebt beschermd, is dit een realistische verwachting:

- **Groot ongeopend blik in een koele kelder**: kan zonder grote kwaliteitsval richting 24 maanden gaan.
- **Gesloten donkere fles in de voorraadkast**: ongeveer **12 tot 18 maanden** in zeer goede conditie.
- **Fles of oliekan die dagelijks in de keuken wordt gebruikt**: idealiter binnen **2 tot 3 maanden** opgebruiken.

> De echte test is je neus: ruikt de olie nog fris, naar olijf, gras of groen? Gebruik haar met plezier. Ruikt ze naar oude noten, muffe boter of verf, dan ligt haar beste moment achter haar.`,
    },
    "da": {
      slug: "hvor-laenge-holder-ekstra-jomfruolivenolie-opbevaring",
      title: "Hvor laenge holder ekstra jomfruolivenolie, og hvordan opbevares den bedst",
      excerpt: "Olivenolie bliver ikke for gammel, men den aeldes. Laer at laese mindste holdbarhedsdato, hvorfor varme og lys er de virkelige fjender, og tricks til opbevaring.",
      category: "Opbevaring",
      content: `## Misforstaaelsen om "udloeb"

Lad os begynde med det mest almindelige spoergsmaal: har olivenolie en rigtig udloebsdato? Det korte svar er nej. Olivenolie bliver ikke pludselig farlig fra den ene dag til den anden, som maelk eller frisk koed kan goere.

Det, du normalt ser paa etiketten, er **bedst foer** eller mindste holdbarhed. For ekstra jomfruolivenolie saetter mange producenter den til cirka **18 maaneder fra tapning**.

Efter den dato er olien stadig spiselig og sikker. Den har bare mistet noget af sin friske aroma og en del af sin antioxidante styrke.

## Hvornar starter oliens ur?

I modsaetning til vin, som nogle gange kan udvikle seg positivt i flasken, er olivenolie paa sit absolutte hoeydepunkt den dag, den forlader moellen. Fra det oeyeblik begynder en langsom og naturlig tilbagegang.

Maalet i koekkenet er derfor ikke at stoppe uret, for det er kemisk umulig. Maalet er at saenke tempoet saa meget som muligt.

## De tre store fjender i koekkenet

Der er tre faktorer, som fremskynder aldring, altsaa oxidation. Og de staar ofte lige foran os i hverdagen.

- **Lys**: lys saetter oedelæggende kaedereaktioner i gang. En klar flaske i naerheden af et solrigt vindu kan hurtigt skade en ellers fremragende olie. *Hvad skal man goere: opbevar den moerkt, i et lukket skab, en dunk eller en moerk flaske.*
- **Ilt**: jo mere flasken toemmes, desto mere luft er der over olien. Ilten arbejder stille og skubber olien mod harskning. *Hvad skal man goere: lad ikke naesten tomme flasker staa i maanedsvis; vaelg mindre formater, hvis du bruger lidt olie, og luk altid godt til.*
- **Varme**: den klassiske fejl er at lade olien staa ved siden af komfuret. Hvert temperaturchok svaekker aromaerne og reducerer polyfenolerne. *Hvad skal man goere: den ideelle temperatur er **12C til 18C**, langt fra blus og ovn.*

## Hvor laenge holder den i praksis?

If queue har koebt en god olie og beskyttet den mod disse tre fjender, er dette realistisk:

- **Stor uaaebnet dunk i en koel kaelder**: kan uden stoerre problemer naerme seg 24 maaneder.
- **Lukket moerk flaske i spisekammeret**: omkring **12 til 18 maaneder** i meget god stand.
- **Flaske eller oliekrukke i daglig brug i koekkenet**: boer helst bruges inden for **2 til 3 maaneder**.

> Den virkelige test er din naese: hvis olien stadig dufter frisk, groent og olivenagtigt, er den god. Minder den dig om gamle noedder, harsk smoer eller maling, har den passeret sit bedste tidspunkt.`,
    },
    "no": {
      slug: "hvor-lenge-holder-ekstra-jomfruolivenolje-lagring",
      title: "Hvor lenge holder ekstra jomfruolivenolje, og hvordan lagres den best",
      excerpt: "Olivenolje gaar ikke ut paa dato, men den eldes. Laer aa lese best-foer-datoen, hvorfor varme og lys er de virkelige fiendene, og tips til lagring.",
      category: "Lagring",
      content: `## Misforstaaelsen rundt "utloepsdato"

La oss starte med det vanligste spoersmaalet: har olivenolje egentlig en utloepsdato? Det korte svaret er nei. Olivenolje blir ikke plutselig farlig fra en dag til den neste, slik melk eller ferskt kjoett kan bli.

Det du vanligvis ser paa etiketten er **best foer** eller minste holdbarhet. For ekstra jomfruolivenolje settes dette ofte til rundt **18 maaneder fra tapping**.

Etter den datoen er oljen fortsatt spiselig og trygg. Den har bare begynt aa miste noe av sin aromatiske friskhet og en del av sin antioksidative styrke.

## Naar begynner oljens klokke aa gaa?

I motsetning til vin, som noen ganger kan utvikle seg positivt i flasken, er olivenolje paa ditt absolutte hoeydepunkt den dagen den forlater moellen. Fra det oeyeblikket starter en langsom og naturlig nedgang.

Maalet hjemme er derfor ikke aa stoppe klokken, for det er kjemisk umulig. Maalet er aa bremse den saa mye som mulig.

## De tre store fiendene paa kjoekkenet

Det er tre faktorer som fremskynder aldring, altsaa oksidasjon. Og de staar ofte rett foran oss.

- **Lys**: lys setter i gang oedeleggende kjedereaksjoner. En klar flaske ved et solfylt vindu kan raskt svekke en ellers utmerket olje. *Hva boer du gjoere: oppbevar den moerkt, i et lukket skap, en blikkboks eller en moerk flaske.*
- **Oksygen**: jo tommere flasken blir, desto mer luft ligger over oljen. Oksygen arbeider stille og driver oljen mot harskning. *Hva boer du gjoere: ikke la nesten tomme flasker staa i maanedsvis; velg mindre formater hvis du bruker lite olje, og skru alltid korken godt igjen.*
- **Varme**: den klassiske feilen er aa la oljen staa ved siden av komfyren. Hvert temperaturstoet svekker aromaene og reduserer polyfenolene. *Hva boer du gjoere: den ideelle lagringstemperaturen er **12C to 18C**, langt fra kokeplater og ovn.*

## Hvor lenge holder den i praksis?

If you have bought a good oil and protected it from these three enemies, this is a realistic expectation:

- **Stor uaaapnet kanne i en kjoelig kjeller**: kan uten store problemer naerme seg 24 maaneder.
- **Lukket moerk flaske i et skap**: omtrent **12 til 18 maaneder** i svaert god stand.
- **Flaske eller oljekanne i daglig bruk paa kjoekkenet**: boer helst brukes opp innen **2 to 3 maaneder**.

> Den virkelige testen er nesen din: lukter oljen fortsatt friskt, groent og olivenaktig, er den i god form. Lukter den gamle noetter, harskt smoer eller maling, er toppunktet passert.`,
    },
  },
"post-store-2": {
    "it": {
      slug: "bottiglia-scura-o-latta",
      title: "Lattina o bottiglia scura? Quale conserva meglio l'olio EVO",
      excerpt: "Sembrano solo contenitori, ma la scelta tra lattina e bottiglia di vetro incide concretamente su quanto a lungo il vostro olio mantiene qualità e polifenoli. Vediamo perché.",
      category: "Conservazione",
    },
    "en": {
      slug: "dark-glass-bottle-vs-tin-can-olive-oil-storage",
      title: "Dark Glass Bottle or Tin Can? Which Stores Extra Virgin Olive Oil Better",
      excerpt: "They might seem like just containers, but the choice between a tin can and a glass bottle directly affects how long your oil retains quality and polyphenols. Let's see why.",
      category: "Storage & Preservation",
      content: `## The question we never ask ourselves

When buying olive oil, we check the cultivar, the acidity, and the harvest year. We rarely look at the container with the same attention. Yet, that is where the oil will spend the next 12 to 18 months—and the surrounding material determines how quickly it will degrade.

It is not an aesthetic choice. It is chemistry.

## The problem of light: photo-oxidation

The number one enemy of EVOO is light. When light—whether solar or artificial—hits the oil, it excites the chlorophyll molecules in the extra virgin olive oil (the ones that give it its green color). This excited chlorophyll transfers energy to dissolved oxygen, creating **singlet oxygen**: a highly reactive form that attacks the double bonds of unsaturated fatty acids and kicks off the lipid oxidation chain.

This process is called **photo-oxidation**, and it is much faster than normal thermal oxidation. A clear glass bottle exposed to direct sunlight can seriously compromise the oil within just 2 to 3 weeks.

## The dark glass bottle: good, but not perfect

Dark glass—deep green or amber with a UV filter—is a decent solution. It blocks a good part of the light spectrum responsible for photo-oxidation and offers absolute chemical inertness: glass does not leach anything into the oil, even in the long run.

The issue is that "dark" does not mean "opaque." Many dark green bottles still let some light through, especially if kept near windows or under strong fluorescent lights. And there is a second limitation: glass is heavy, it breaks, and every time we open and close the bottle, the oil comes into contact with air.

As the oil level goes down, more air remains inside—and that air continues to slowly oxidize the contents.

## The tin can: why connoisseurs prefer it

**Tinplate**—steel with a neutral internal coating—is the preferred container for serious millers and professional tasters. The reasons are practical:

- **Absolute opacity**: zero light passes through the metal. The photo-oxidation problem is eliminated at the source.
- **Almost total oxygen barrier**: a sealed tin can limits gas exchange better than glass.
- **No chemical migration**: the internal linings of modern tinplates are certified for prolonged food contact with fats—no release of plasticizers or unwanted compounds.
- **Robustness**: it does not break, it is easy to transport, and it is more practical to store in the cellar.

The only real disadvantage is that once a large tin can is opened, if you consume it slowly, the air inside gradually increases. The workaround is simple.

## The practical method: large tin + small cruet

The setup that professionals use in the kitchen is this: you buy a **3 or 5-liter tin** (the format offering the best value for money), keep the tin closed in the pantry in the dark, and every few days refill a small, **opaque ceramic oil cruet** of 150-250ml to keep on the countertop.

The tin remains closed almost all the time with very little oxygen inside. The cruet is emptied quickly—fast enough to give oxidation no time to cause serious damage.

This approach beats both the transparent bottle on the kitchen counter and the large dark glass bottle opened weeks ago.

## And the transparent bottle?

It is great for photography. For storing olive oil, it is useless.

> If your oil is in a clear bottle exposed to light, you are losing polyphenols and quality every passing day. This is not alarmism—it is oxidation.

:::cta
Our 3 and 5-liter tins
EVOO from Frantoio del Pasqua, harvest campaign indicated, optimal preservation guaranteed.
[Go to shop](/shop)
:::`,
    },
    "de": {
      slug: "dunkle-glasflasche-oder-blechdose-olivenoel-aufbewahrung",
      title: "Dunkle Glasflasche oder Blechdose? Was lagert Olivenöl Extra besser",
      excerpt: "Es scheinen nur Behälter zu sein, aber die Wahl zwischen Blechdose und Glasflasche beeinflusst konkret, wie lange Ihr Öl Qualität und Polyphenole behält. Erfahren Sie warum.",
      category: "Lagerung & Aufbewahrung",
      content: `## Die Frage, die wir uns nie stellen

Wenn wir Olivenöl kaufen, achten wir auf die Olivensorte, den Säuregehalt, das Erntejahr. Selten betrachten wir den Behälter mit derselben Aufmerksamkeit. Doch genau dort wird das Öl die nächsten 12 bis 18 Monate verbringen – und das umgebende Material bestimmt, wie schnell es an Qualität verliert.

Es ist keine Frage der Ästhetik. Es ist Chemie.

## Das Problem des Lichts: Fotooxidation

Der größte Feind von nativem Olivenöl Extra ist das Licht. Wenn Licht – ob Sonnenlicht oder künstliches Licht – auf das Öl trifft, regt es die im Öl enthaltenen Chlorophyllmoleküle an (die für die grüne Farbe verantwortlich sind). Dieses angeregte Chlorophyll überträgt Energie auf den gelösten Sauerstoff und erzeugt **Singulett-Sauerstoff**: eine hochreaktive Form, die die Doppelbindungen ungesättigter Fettsäuren angreift und die Lipidoxidationskette in Gang setzt.

Dieser Prozess wird **Fotooxidation** genannt und verläuft weitaus schneller als die normale thermische Oxidation. Eine transparente Glasflasche, die direktem Sonnenlicht ausgesetzt ist, kann die Qualität des Öls bereits in 2 bis 3 Wochen ernsthaft beeinträchtigen.

## Die dunkle Glasflasche: gut, aber nicht perfekt

Dunkles Glas – tiefgrün oder bernsteinfarben mit UV-Filter – ist eine solide Lösung. Es blockiert einen Großteil des für die Fotooxidation verantwortlichen Lichtspektrums und bietet absolute chemische Trägheit: Glas gibt auch langfristig keinerlei Stoffe an das Öl ab.

Das Problem ist jedoch, dass „dunkel“ nicht gleichbedeutend mit „lichtundurchlässig“ ist. Viele dunkelgrüne Flaschen lassen immer noch etwas Licht durch, insbesondere wenn sie in der Nähe von Fenstern oder unter hellem Leuchtstoffröhrenlicht stehen. Zudem gibt es einen zweiten Nachteil: Glas ist schwer, zerbrechlich, und jedes Mal, wenn wir die Flasche öffnen und schließen, kommt das Öl mit Luft in Kontakt.

Je weiter der Ölstand sinkt, desto mehr Luft verbleibt im Inneren – und diese Luft oxidiert den Inhalt langsam weiter.

## Die Blechdose: Warum Kenner sie bevorzugen

**Weißblech** – Stahl mit einer neutralen Innenbeschichtung – ist der bevorzugte Behälter von seriösen Ölmüllern und professionellen Verkostern. Die Gründe dafür sind rein praktischer Natur:

- **Absolute Lichtundurchlässigkeit**: Es gelangt keinerlei Licht durch das Metall. Das Problem der Fotooxidation wird an der Wurzel gepackt.
- **Nahezu vollständige Sauerstoffbarriere**: Die versiegelte Dose schränkt den Gasaustausch besser ein als Glas.
- **Keine chemische Migration**: Die Innenbeschichtungen moderner Blechdosen sind für den längeren Lebensmittelkontakt mit Fetten zertifiziert – keine Freisetzung von Weichmachern oder unerwünschten Verbindungen.
- **Robustheit**: Sie bricht nicht, lässt sich leicht transportieren und im Keller praktischer lagern.

Der einzige echte Nachteil besteht darin, dass sich bei einer großen Blechdose, wenn man das Öl nur langsam verbraucht, der Luftanteil im Inneren allmählich erhöht. Die Lösung ist denkbar einfach.

## Die praktische Methode: große Blechdose + kleine Karaffe

Das System, das Profis in der Küche nutzen, sieht so aus: Man kauft eine **3- oder 5-Liter-Blechdose** (das Format mit dem besten Preis-Leistungs-Verhältnis), lagert die Dose geschlossen im Dunkeln in der Speisekammer und füllt alle paar Tage eine kleine, **lichtundurchlässige Keramik-Ölkaraffe** von 150–250 ml für die Arbeitsplatte nach.

Die Blechdose bleibt fast immer geschlossen, mit sehr wenig Sauerstoff im Inneren. Die kleine Karaffe leert sich schnell – schnell genug, damit die Oxidation keine Zeit hat, ernsthafte Schäden anzurichten.

Dieser Ansatz schlägt sowohl die transparente Flasche auf der Arbeitsplatte als auch die große, seit Wochen geöffnete dunkle Glasflasche.

## Und die transparente Flasche?

Sie ist gut für Fotos. Zur Aufbewahrung von Olivenöl ist sie völlig nutzlos.

> Wenn Ihr Öl in einer transparenten Flasche dem Licht ausgesetzt ist, verlieren Sie mit jedem Tag Polyphenole und Qualität. Das ist keine Panikmache – das ist Oxidation.

:::cta
Unsere 3- und 5-Liter-Dosen
Natives Olivenöl Extra von Frantoio del Pasqua, Erntejahr angegeben, optimale Haltbarkeit garantiert.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "donkere-glasfles-of-blik-extra-vierge-olijfolie-bewaren",
      title: "Donkere glasfles of blik? Welke verpakking bewaart extra vierge olijfolie beter",
      excerpt: "Het lijken slechts verpakkingen, maar de keuze tussen blik en glas heeft directe invloed op hoe lang je olijfolie kwaliteit en polifenolen behoudt. Ontdek waarom.",
      category: "Opslag & Bewaring",
      content: `## De vraag die we ons nooit stellen

Wanneer we olijfolie kopen, kijken we naar de olijfsoort, de zuurgraad en het oogstjaar. We kijken zelden met dezelfde aandacht naar de verpakking. Toch zal de olijfolie daar de komende 12 tot 18 maanden in doorbrengen — en het materiaal dat de olie omringt bepaalt hoe snel de kwaliteit achteruitgaat.

Dit is geen esthetische keuze. Dit is chemie.

## Het probleem van licht: foto-oxidatie

De grootste vijand van extra vierge olijfolie is licht. Wanneer licht — zonlicht of kunstlicht — de olie raakt, activeert het de bladgroenmoleculen (chlorofyl) in de olijfolie (die zorgen voor de groene kleur). Dit geactiveerde chlorofyl draagt energie over aan de opgeloste zuurstof, waardoor **singletzuurstof** ontstaat: een zeer reactieve vorm die de dubbele bindingen van onverzadigde vetzuren aanvalt en de keten van vetoxidatie start.

Dit proces heet **foto-oxidatie** en verloopt veel sneller dan normale thermische oxidatie. Een transparante glasfles die direct aan zonlicht wordt blootgesteld, kan de olijfolie al binnen 2 tot 3 weken ernstig aantasten.

## De donkere glasfles: goed, maar niet perfect

Donker glas — diepgroen of amberkleurig met een UV-filter — is een prima oplossing. Het blokkeert een groot deel van het lichtspectrum dat verantwoordelijk is voor foto-oxidatie en is chemisch volledig neutraal: glas geeft geen stoffen af aan de olie, ook niet op de lange termijn.

Het probleem is echter dat "donker" niet hetzelfde is als "ondoorzichtig". Veel donkergroene flessen laten nog steeds wat licht door, vooral als ze dicht bij een raam of onder fel kunstlicht staan. Daarnaast is er een tweede nadeel: glas is zwaar, breekbaar en telkens als we de fles openen en sluiten, komt de olie in contact met lucht.

Hoe leger de fles raakt, hoe meer lucht er in de fles achterblijft — en die lucht zorgt voor een langzame, voortdurende oxidatie van de olijfolie.

## Het blik: waarom kenners er de voorkeur aan geven

**Vertind blik** — staal met een neutrale interne coating — is de favoriete verpakking van serieuze olijfoliemakers en professionele proevers. De redenen hiervoor zijn heel praktisch:

- **Absolute ondoorzichtigheid**: er komt geen straaltje licht door het metaal. Het probleem van foto-oxidatie wordt direct bij de bron opgelost.
- **Bijna totale zuurstofbarrière**: een verzegeld blik beperkt de gasuitwisseling beter dan glas.
- **Geen chemische migratie**: de interne coatings van moderne blikken zijn gecertificeerd voor langdurig contact met vetten — er komen geen weekmakers of ongewenste stoffen vrij.
- **Stevigheid**: het breekt niet, is gemakkelijk te transporteren en is praktischer op te slaan in de kelder.

Het enige echte nadeel is dat wanneer een groot blik eenmaal is geopend en je de olijfolie langzaam consumeert, de hoeveelheid lucht binnenin geleidelijk toeneemt. De oplossing hiervoor is eenvoudig.

## De praktische methode: groot blik + klein olieflesje

De methode die professionals in de keuken gebruiken is deze: je koopt een **blik van 3 of 5 liter** (het formaat met de beste prijs-kwaliteitverhouding), bewaart het blik gesloten op een donkere plaats in de voorraadkast, en vult om de paar dagen een klein, **ondoorzichtig keramisch olieflesje** van 150-250 ml voor op het aanrecht.

Het grote blik blijft bijna altijd gesloten, met heel weinig zuurstof erin. Het kleine keramische flesje is snel leeg — snel genoeg om oxidatie geen kans te geven de kwaliteit aan te tasten.

Deze aanpak is vele malen beter dan zowel een transparante fles op het aanrecht als een grote fles donker glas die al weken openstaat.

## En de transparante fles?

Die is leuk voor de foto. Voor het bewaren van olijfolie is het volkomen nutteloos.

> Als je olijfolie in een transparante fles aan licht wordt blootgesteld, verlies je elke dag polifenolen en kwaliteit. Dit is geen bangmakerij — dit is oxidatie.

:::cta
Onze blikken van 3 en 5 liter
Extra vierge olijfolie van Frantoio del Pasqua, oogstjaar vermeld, gegarandeerd optimale bewaring.
[Naar de shop](/shop)
:::`,
    },
    "da": {
      slug: "moerk-glasflaske-eller-dunk-hvad-bevarer-olivenolien-bedst",
      title: "Mørk glasflaske eller dunk? Hvad bevarer ekstra jomfruolivenolie bedst",
      excerpt: "Det virker måske bare som beholdere, men valget mellem dunk og glasflaske påvirker direkte, hvor længe din olie bevarer kvalitet og polyfenoler. Lad os se hvorfor.",
      category: "Opbevaring",
      content: `## Spørgsmålet, vi aldrig stiller os selv

Når vi køber olivenolie, kigger vi på olivensorten, syreindholdet og høståret. Vi kigger sjældent på beholderen med samme opmærksomhed. Men det er trods alt der, olien skal tilbringe de næste 12-18 måneder — og materialet omkring olien bestemmer, hvor hurtigt den nedbrydes.

Det er ikke et spørgsmål om æstetik. Det er kemi.

## Problemet med lys: fotooxidation

Den absolut største fjende for ekstra jomfruolivenolie er lys. Når lys — uanset om det er sollys eller kunstigt lys — rammer olien, aktiverer det klorofylmolekylerne i olien (dem, der giver den grønne farve). Dette aktiverede klorofyl overfører energi til den opløste ilt, hvilket danner **singlet-ilt**: en meget reaktiv form, som angriber de dobbelte bindinger i de umættede fedtsyrer og starter lipidoxidationskæden.

Processen kaldes **fotooxidation**, og den forløber langt hurtigere end normal termisk oxidation. En gennemsigtig glasflaske, der udsættes for direkte sollys, kan ødelægge oliens kvalitet på blot 2-3 uger.

## Den mørke glasflaske: god, men ikke perfekt

Mørkt glas — dybgrønt eller ravgult med UV-filter — er en fornuftig løsning. Det blokerer en stor del af det lysspektrum, der er ansvarlig for fotooxidation, og er kemisk fuldstændig neutralt: Glas afgiver intet til olien, selv på lang sigt.

Problemet er blot, at "mørkt" ikke betyder "lystæt". Mange mørkegrønne flasker lukker stadig en del lys ind, især hvis de står tæt på et vindue eller under skarpt lysstofrør. Og så er der en anden begrænsning: Glas er tungt, det kan gå i stykker, og hver gang vi åbner og lukker flasken, kommer olien i kontakt med luft.

Jo mere olie vi bruger, jo mere luft er der tilbage i flasken — og den luft fortsætter med langsomt at oxidere indholdet.

## Dunken (blikdåsen): Hvorfor kenderne foretrer den

**Hvidblik** — stål med en neutral indvendig belægning — er den foretrukne beholder blandt seriøse olieproducenter og professionelle smagere. Det er der helt konkrete grunde til:

- **100 % lystæt**: Intet lys trænger igennem metallet. Problemet med fotooxidation elimineres fuldstændigt.
- **Næsten total iltbarriere**: En forseglet dunk begrænser gasudveksling bedre end glas.
- **Ingen kemisk afgivelse**: Den indvendige belægning på moderne dunke er godkendt til langvarig kontakt med fødevarer og fedtstoffer — ingen frigivelse af blødgørere eller uønskede stoffer.
- **Robusthed**: Den går ikke i stykker, er nem at transportere og er mere praktisk at opbevare i kælderen.

Den eneste reelle ulempe er, at når dunken først er åbnet, og hvis du har et lille forbrug, vil mængden af luft indeni gradvist øges. Løsningen er enkel.

## Den praktiske metode: Stor dunk + lille oliekande

Det setup, som de professionelle bruger i køkkenet, er dette: Man køber en **3- eller 5-liters dunk** (det format, der giver mest kvalitet for pengene), opbevarer dunken lukket i et mørkt køkkenskab eller spisekammer og fylder løbende op i en lille, **lystæt keramik-oliekande** på 150-250 ml til at have stående på køkkenbordet.

Dunken forbliver næsten altid lukket med meget lidt ilt indeni. Oliekanden tømmes hurtigt — hurtigt nok til, at oxidationen ikke når at gøre skade.

Denne metode slår både den gennemsigtige flaske på køkkenbordet og den store mørke glasflaske, der har stået åben i ugevis.

## Og den gennemsigtige flaske?

Den er fin til billeder. Til at opbevare olivenolie er den fuldstændig ubrugelig.

> Hvis din olie står i en gennemsigtig flaske udsat for lys, mister du polyfenoler og kvalitet for hver dag, der går. Det er ikke skræmmekampagner — det er oxidation.

:::cta
Vores 3- og 5-liters dunke
Ekstra jomfruolivenolie fra Frantoio del Pasqua, høstår angivet, garanteret optimal holdbarhed.
[Gå til shoppen](/shop)
:::`,
    },
    "no": {
      slug: "moerk-glassflaske-eller-blikkboks-hva-bevarer-olivenoljen-best",
      title: "Mørk glassflaske eller blikkboks? Hva bevarer ekstra jomfruolivenolje best",
      excerpt: "Det virker kanskje bare som beholdere, men valget mellom blikkboks og glassflaske påvirker direkte hvor lenge oljen din bevarer kvalitet og polyfenoler. La oss se hvorfor.",
      category: "Lagring",
      content: `## Spørsmålet vi aldri stiller oss selv

Når vi kjøper olivenolje, ser vi på oliventype, syreinnhold og høsteår. Vi ser sjelden på beholderen med samme oppmerksomhet. Men det er tross alt der oljen skal tilbringe de neste 12–18 månedene — og materialet som omgir den bestemmer hvor raskt den vil forringes.

Det handler ikke om estetikk. Det er kjemi.

## Problemet med lys: fotooksidasjon

Den absolutt største fienden til ekstra jomfruolivenolje er lys. Når lys — enten sollys eller kunstig lys — treffer oljen, aktiverer det klorofyllmolekylene i oljen (de som gir den grønne fargen). Dette aktiverte klorofyllet overfører energi til det oppløste oksygenet, og danner **singlet-oksygen**: en svært reaktiv form som angriper dobbeltbindingene i de umette fettsyrene og starter lipidoksidasjonskjeden.

Prosessen kalles **fotooksidasjon**, og den skjer langt raskere enn vanlig termisk oksidasjon. En klar glassflaske som utsettes for direkte sollys, kan ødelegge oljens kvalitet på bare 2–3 uker.

## Den mørke glassflasken: god, men ikke perfekt

Mørkt glass — dypgrønt eller ravgult med UV-filter — er en grei løsning. Det blokkerer en stor del av lysspekteret som er ansvarlig for fotooksidasjon, og er kjemisk fullstendig nøytralt: Glass avgir ingenting til oljen, selv på lang sikt.

Problemet er bare at "mørkt" ikke betyr "lystett". Mange mørkegrønne flasker slipper fortsatt inn en del lys, spesielt hvis de står nær vinduer eller under sterkt lysstoffrør. I tillegg er det en annen begrensning: Glass er tungt, det kan knuse, og hver gang vi åpner og lukker flasken, kommer oljen i kontakt med luft.

Jo mer olje vi bruker, desto mer luft blir det igjen i flasken — og den luften fortsetter å oksidere innholdet langsomt.

## Blikkboksen: Hvorfor kjennerne foretrekker den

**Hvitblikk** — stål med et nøytralt innvendig belegg — er den foretrukne beholderen for seriøse oljeprodusenter og profesjonelle smakere. Det er det helt konkrete grunner til:

- **100 % lystett**: Ingen lys slipper gjennom metallet. Problemet med fotooksidasjon elimineres fullstendig.
- **Nesten total oksygenbarriere**: En forseglet blikkboks begrenser gassutveksling bedre enn glass.
- **Ingen kjemisk avgiving**: Det innvendige belegget på moderne blikkbokser er godkjent for langvarig kontakt med matvarer og fett — ingen frigjøring av plastmyknere of uønskede stoffer.
- **Robusthet**: Den knuser ikke, er lett å transportere og er mer praktisk å lagre i kjelleren.

Den eneste reelle ulepen er at når blikkboksen først er åpnet, og hvis du har et lite forbruk, vil mængden luft inni gradvis øke. Men løsningen er enkel.

## Den praktiske metode: Stor blikkboks + liten oljekanne

Oppsettet som de profesjonelle bruker på kjøkkenet er dette: Man kjøper en **3- eller 5-liters blikkboks** (formatet som gir mest kvalitet for pengene), oppbevarer blikkboksen lukket i et mørkt kjøkkenskap eller spiskammer, og fyller løpende opp en liten, **lystett keramikk-oljekanne** på 150–250 ml til å ha stående på kjøkkenbenken.

Blikkboksen forblir nesten alltid lukket med svært lite oksygen inni. Oljekannen tømmes raskt — raskt nok til at oksidasjonen ikke rekker å gjøre skade.

Denne metoden slår både den gjennomsiktige flasken på kjøkkenbenken og den store mørke glassflasken som har stått åpen i ukesvis.

## Og den gjennomsiktige flasken?

Den er fin til bilder. Til å lagre olivenolje er den fullstendig ubrukelig.

> Hvis oljen din står i en gjennomsiktig flaske utsatt for lys, mister du polyfenoler og kvalitet for hver dag som går. Det er ikke skremselspropaganda — det er oksidasjon.

:::cta
Våre 3- og 5-liters blikkbokser
Ekstra jomfruolivenolje fra Frantoio del Pasqua, høsteår angitt, garantert optimal holdbarhet.
[Gå til butikken](/shop)
:::`,
    },
  },
"post-use-1": {
    "it": {
      slug: "friggere-con-olio-evo",
      title: "Friggere con l'olio extravergine: falso mito o realtà culinaria?",
      excerpt: "Risolleviamo l'onore del fritto con olio EVO smontando alcune false credenze radicate sui punti di fumo.",
      category: "Consumo corretto",
    },
    "en": {
      slug: "frying-with-extra-virgin-olive-oil-myth-or-reality",
      title: "Frying with Extra Virgin Olive Oil: Myth or Culinary Reality?",
      excerpt: "Let's restore the honor of frying with EVOO by debunking deeply rooted myths about smoke points.",
      category: "Proper Usage",
      content: `## Does Extra Virgin Olive Oil fry well?

Yes, it fries beautifully. And it is not just "doable": it is often a much more sensible choice than we realize. The problem is that for years we have associated extra virgin olive oil with something delicate and "only to be used raw," while we imagine frying as a world apart, made of neutral and anonymous oils.

In reality, a good olive oil is stable, holds up to heat as long as you do not push it too far, and gives you a more aromatic and cleaner fry. The best frying does not come from extreme temperatures: it comes from a proper, constant temperature that cooks well without burning.

## The smoke point, without anxiety

The smoke point is useful, but it should not be turned into a fear. If the oil smokes, it means you have gone too high. If instead you fry calmly and do not let it smoke, you are working the right way.

And above all: do not chase the idea that "the hotter, the better." Fried food turns out best when the heat is controlled, not when the oil is at its absolute limit.

## Two tips that change everything

The first is simple: if you are going to fry, use enough oil. Frying with too little oil makes it hard to heat evenly, creates temperature fluctuations, and worsens the quality of the result.

The second is even more important: do not give the oil an infinite life. If you reuse it too many times, it loses its cleanliness, changes smell, and deteriorates. It is better to fry less often, but do it well.

> Frying done calmly and with a stable oil is a pleasure, not a "sin."

:::cta
Want an EVOO suitable for everyday cooking too?
Balanced, clean, stable: perfect both raw and for cooking.
[Discover the oils in our shop](/shop)
:::`,
    },
    "de": {
      slug: "frittieren-mit-olivenoel-extra-mythos-oder-realitaet",
      title: "Frittieren mit nativem Olivenöl Extra: Mythos oder kulinarische Realität?",
      excerpt: "Wir stellen die Ehre des Frittierens mit Olivenöl Extra wieder her, indem wir gegen hartnäckige Mythen über den Rauchpunkt vorgehen.",
      category: "Richtiges Genießen",
      content: `## Frittiert man mit nativem Olivenöl Extra gut?

Ja, man frittiert hervorragend damit. Und es ist nicht nur „möglich“: Es ist oft eine viel vernünftigere Wahl, als wir denken. Das Problem ist, dass wir natives Olivenöl Extra seit Jahren mit etwas Feinem assoziieren, das „nur roh“ verwendet werden sollte, während wir uns das Frittieren als eine Welt für sich vorstellen, die aus neutralen und anonymen Ölen besteht.

In Wirklichkeit ist ein gutes Olivenöl stabil, hält der Hitze stand, solange man es nicht übertreibt, und liefert ein aromatischeres und saubereres Frittierergebnis. Das beste Frittieren gelingt nicht durch extreme Temperaturen, sondern durch eine angemessene und konstante Temperatur, die gut gart, ohne zu verbrennen.

## Der Rauchpunkt, ganz ohne Sorge

Der Rauchpunkt ist nützlich, aber man sollte keine Angst davor haben. Wenn das Öl raucht, bedeutet das, dass die Temperatur zu hoch ist. Wenn Sie dagegen ruhig frittieren und es nicht rauchen lassen, arbeiten Sie genau richtig.

Und vor allem: Verabschieden Sie sich von dem Gedanken „je heißer, desto besser“. Frittiertes gelingt am besten, wenn die Hitze kontrolliert wird, und nicht, wenn das Öl an seine absolute Grenze stößt.

## Zwei Tipps, die alles verändern

Der erste ist einfach: Wenn Sie frittieren, verwenden Sie ausreichend Öl. Mit zu wenig Öl erhitzt es sich ungleichmäßig, es kommt zu Temperaturschwankungen und die Qualität des Ergebnisses leidet.

Der zweite ist noch wichtiger: Verwenden Sie das Öl nicht unendlich oft wieder. Wenn Sie es zu oft wiederverwenden, verliert es seine Reinheit, verändet seinen Geruch und verschlechtert sich. Es ist besser, seltener zu frittieren, es dann aber richtig zu machen.

> Frittieren mit Ruhe und einem stabilen Öl ist ein Genuss, keine „Sünde“.

:::cta
Suchen Sie ein Olivenöl Extra, das sich auch für die tägliche Küche eignet?
Ausgewogen, rein, stabil: perfekt sowohl roh als auch zum Kochen.
[Entdecken Sie die Öle im Shop](/shop)
:::`,
    },
    "nl": {
      slug: "frituren-met-extra-vierge-olijfolie-mythe-of-realiteit",
      title: "Frituren met extra vierge olijfolie: mythe of culinaire realiteit?",
      excerpt: "We herstellen de eer van gefrituurd eten met extra vierge olijfolie door hardnekkige mythen over het rookpunt te ontkrachten.",
      category: "Correct Gebruik",
      content: `## Friturt extra vierge olijfolie goed?

Ja, het frituurt fantastisch. En het is niet alleen "mogelijk": het is vaak een veel verstandigere keuze dan we denken. Het probleem is dat we extra vierge olijfolie al jaren associëren met iets delicaats dat "alleen koud" gebruikt mag worden, terwijl we ons frituren voorstellen als een wereld apart, met neutrale en anonieme oliën.

In werkelijkheid is een goede olijfolie stabiel, bestand tegen hitte zolang je het niet te ver doorvoert, en geeft het een aromatischer en schoner frituurresultaat. De beste frituur komt niet voort uit extreme temperaturen, maar uit een juiste en constante temperatuur die goed gaart zonder te verbranden.

## Het rookpunt, zonder stress

Het rookpunt is nuttig, maar moet geen bron van angst worden. Als de olijfolie rookt, betekent dit dat de temperatuur te hoog is. Als je daarentegen rustig frituurt en de olie niet laat roken, werk je op de juiste manier.

En vooral: streef niet naar het idee "hoe heter, hoe beter". Gefrituurd eten wordt het lekkerst als de warmte gecontroleerd is, niet wanneer de olie tot de absolute grens wordt gepusht.

## Twee tips die alles veranderen

De eerste is eenvoudig: als je gaat frituren, gebruik dan voldoende olie. Met te weinig olie warmt het slecht op, ontstaan er temperatuurschommelingen en verslechtert de kwaliteit van het resultaat.

De tweede is nog belangrijker: hergebruik de olie niet eindeloos. Als je de olie te vaak opnieuw gebruikt, verliest hij zijn zuiverheid, verandert van geur en gaat de kwaliteit hard achteruit. Het is beter om minder vaak te frituren, maar het dan wel goed te doen.

> Rustig frituren met een stabiele olijfolie is een genot, geen "zonde".

:::cta
Wilt u een extra vierge olijfolie die ook geschikt is voor de dagelijkse keuken?
Gebalanceerd, zuiver en stabiel: perfect zowel rauw als voor warme bereidingen.
[Ontdek de olijfoliën in de shop](/shop)
:::`,
    },
    "da": {
      slug: "friturestegning-med-ekstra-jomfruolivenolie-myte-eller-hverdag",
      title: "Friturestegning med ekstra jomfruolivenolie: Myte eller kulinarisk virkelighed?",
      excerpt: "Vi genopretter æren for friturestegt mad med ekstra jomfruolivenolie by aflive nogle dybt forankrede myter om røgpunkter.",
      category: "Korrekt Forbrug",
      content: `## Fungerer ekstra jomfruolivenolie godt til friturestegning?

Ja, det gør det fantastisk. Og det er ikke bare "noget man kan gøre": Det er ofte et langt mere fornuftigt valg, end vi går og tror. Problemet er, at vi i årevis har associeret ekstra jomfruolivenolie med noget delikat, der "kun skal bruges råt," mens vi forestiller os friturestegning som en verden for sig, domineret af smagsneutrale og anonyme olier.

I virkeligheden er en god olivenolie stabil, tåler varme rigtig godt, så længe du ikke presser den for langt, og giver dig en langt mere automatisk og renere stegning. Den bedste friturestegning opnås ikke ved ekstreme temperaturer: Den opnås ved en korrekt og konstant temperatur, der tilbereder maden godt uden at brænde på.

## Røgpunktet uden unødig bekymring

Røgpunktet er nyttigt, men det skal ikke gøres til en kilde til frygt. Hvis olien ryger, betyder det, at du er gået for højt op i temperatur. Hvis du derimod steger roligt og undgår røg, arbejder du på den helt rigtige måde.

Und frem for alt: Jagt ikke idéen om, at "jo varmere, jo bedre." Friturestegt mad bliver bedst, når varmen er kontrolleret, ikke når olien er presset til det yderste.

## To råd, der ændrer alt

Det første er enkelt: Hvis du skal friturestege, så brug rigeligt med olie. Med for lidt olie opvarmes maden ujævnt, der opstår temperaturudsving, og det forringer kvaliteten af resultatet.

Det andet er endnu vigtigere: Genbrug ikke olien i det uendelige. Hvis du genbruger den for mange gange, mister den sin renhed, ændrer duft og forringes hurtigt. Det er bedre at friturestege sjældnere, men så gøre det ordentligt.

> Friturestegning udført med tålmodighed og en stabil olie is en nydelse, ikke en "synd".

:::cta
Vil du have en ekstra jomfruolivenolie, der også egner sig til hverdagsmadlavning?
Balanceret, ren og stabil: perfekt både rå og til stegning.
[Se olierne i shoppen](/shop)
:::`,
    },
    "no": {
      slug: "fritering-med-ekstra-jomfruolivenolje-myte-eller-virkelighet",
      title: "Fritering med ekstra jomfruolivenolje: Myte eller kulinarisk virkelighet?",
      excerpt: "Vi gjenreiser æren for fritert mat med ekstra jomfruolivenolje ved av avlive noen dypt forankrede myter om røykpunkter.",
      category: "Riktig Bruk",
      content: `## Fungerer ekstra jomfruolivenolje bra til fritering?

Ja, det fungerer fantastisk bra. Og det er ikke bare "noe man kan gjøre": Det er ofte et langt mer fornuftig valg enn vi tror. Problemet er at vi i årevis har assosiert ekstra jomfruolivenolje med noe delikat som "kun skal brukes rått," mens vi forestiller oss fritering som en verden for seg selv, dominert av nøytrale og anonyme oljer.

I virkeligheten er en god olivenolje stabil, tåler varme svært godt så lenge du ikke presser den for langt, og gir deg en langt mer aromatisk og renere steking. Den beste friteringen oppnås ikke ved ekstreme temperaturer: Den oppnås ved en riktig og konstant temperatur som tilbereder maten godt uten at den svir seg.

## Røykpunktet, helt uten bekymring

Røykpunktet er nyttig, men det skal ikke gjøres til en kilde til frykt. Hvis oljen ryker, betyr det at du har gått for høyt opp i temperatur. Hvis du derimot friterer rolig og unngår røyk, jobber du på den helt riktige måten.

Og fremfor alt: Ikke jag etter idéen om at "jo varmere, jo bedre." Fritert mat blir best når varmen er kontrollert, ikke når oljen er presset til det ytterste.

## To tips som endrer alt

Det første er enkelt: Hvis du skal fritere, må du bruke nok olje. Med for lite olje varmes maten ujevnt opp, det oppstår temperatursvingninger, og det forringer kvaliteten på resultatet.

Det andre er enda viktigere: Ikke gjenbruk oljen i det uendelige. Hvis du bruker den på nytt for mange ganger, mister den renheten sin, endrer lukt og forringes raskt. Det er bedre å fritere sjeldnere, men gjøre det ordentlig når du først gjør det.

> Fritering utført med tålmodighet og en stabil olje er en nytelse, ikke en "synd".

:::cta
Vil du ha en ekstra jomfruolivenolje som også egner seg til hverdagsmatlaging?
Balansert, ren og stabil: perfekt både rå og til matlaging.
[Oppdag oljene i butikken](/shop)
:::`,
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
      excerpt: "Making a good dressing with EVOO is not trivial. From choosing the profile to emulsifying with vinegar or lemon: a short but complete guide.",
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

We denken vaak dat een extra vierge olijfolie, om echt "puur" en gezond te zijn, in onze keel moet krassen als schuurpapier. We denken dat als het de mond niet erg bitter achterlaat, het misschien geen ambachtelijk product is.

> Olijfolie met een "lichte fruitigheid" is het overtuigende bewijs dat je van de hoogste kwaliteit kunt zijn maar ook... heel beleefd aan tafel.

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

Als er één olijfolie is die niet onopgemerkt blijft, dan is het wel de **intensief fruitige**. Je ruikt het al zodra je het inschenkt: een "groen", levendig aroma, bijna zoals een moestuin. En als je het proeft, merk je meteen twee dingen die het uniek maken: een **aangename bittere noot** en een **duidelijke prikkeling achter in de keel**. Als je er niet aan gewend bent, kan het verrassen, maar het is geen defect: het is juist zijn karakter.

Het punt is dit: intensief fruitig is geen "moeilijke" olie, het is een olie die **op de juiste plek** moet worden gebruikt. Als je het goed combineert, doet het iets magisch: het gerecht lijkt geuriger, voller, "echter".

## Welke smaak kun je verwachten

Stel je aroma's voor die doen denken aan gemaaid gras, artisjok en groene tomaten. Dan komt in de mond de krachtigere kant naar voren: een bitterheid die schoon blijft en een pittigheid die een paar seconden aanhoudt.

Wat handig is om te weten: een intensief fruitige olijfolie is energieker omdat deze vaak wordt gemaakt van olijven die vroeg zijn geoogst, toen ze nog groen waren. Vertaald naar de keuken? Dit is een olie die niet op de achtergrond wil blijven: hij wil **persoonlijkheid geven**.

## Wanneer te gebruiken (en waarom het werkt)

Intensief fruitig komt het best tot zijn recht bij gerechten die al een hartige of gestructureerde basis hebben. Het is als een specerij: het maskeert niet, het **haalt op**.

Bijvoorbeeld op een **bonensoep**: als je het aan het einde toevoegt, wanneer het gerecht klaar is, verandert het aroma direct. De kikkererwten worden "warmer", de bonen lijken romiger en alles krijgt een rijkere dimensie zonder dat je iets anders hoeft toe te voegen.

Het werkt ook prachtig met **groenten met een sterke smaak**. Denk aan witlof, boerenkool, radicchio: dit zijn groenten die al een eigen persoonlijkheid hebben, en de bitterheid van de intensief fruitige olie sluit hier perfect op aan.

En ja, het is altijd de moeite waard om te zeggen: als je echt wilt begrijpen wat een intensief fruitige olie is, dan is de eenvoudigste test **warm brood**. Niets anders is nodig. Een scheutje goede olie, een snufje zout en klaar.

## Wanneer voorzichtig te gebruiken

Er zijn gevallen waarin de intensief fruitige olie het risico loopt te veel de hoofdrol op te eisen. Niet omdat het "niet goed" is, maar omdat sommige gerechten om subtiliteit vragen.

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

Wanneer we het hebben over "nieuwe olijfolie" (in Italië *Olio Nuovo* of *Novello* genoemd), bedoelen we geen officiële bureaucratische categorie, maar simpelweg extra vierge olijfolie die net uit de pers komt. Het is olijfolie op zijn allerschoonst, direct gebotteld zonder te rusten of gefilterd te worden.

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

Laten we direct duidelijkheid scheppen, beginnend bij de certificering die wordt beschouwd als het "onschendbare schild" van kwaliteit:

## Het absolute keurmerk: BOB (DOP)

Het keurmerk van uitmuntendheid bij uitstek is de **Beschermde Oorsprungsbenaming (BOB, of DOP in het Italiaans)**. Een product met het rood-gouden keurmerk garandeert dat:

1.  **De olijengaard is geolokaliseerd:** De olijven zijn afkomstig uit strikt omschreven en in kaart gebrachte gebieden (bijv. Sabina, Riviera Ligure, Chianti Classico).
2.  **Onschendbare productiecyclus:** Niet alleen de oogst, maar ook het persen, de opslag en de fysieke botteling moeten *binnen* die grenzen plaatsvinden.
3.  **Goedkeuring door paneltest:** Voordat het wordt verkocht, moet de olie strenge laboratorium- en proeftesten ondergaan om te controleren of het de specifieke kenmerken van het gebied respecteert.

> Kortom: BOB (DOP) verbindt het terroire en het vakmanschap onlosmakelijk met elkaar. Met dit keurmerk zit je gegarandeerd goed.

## De tussenstap: BGP (IGP) certificering

Als we een stapje lager gaan en de regels iets versoepelen, vinden we de **Beschermde Geografische Aanduiding (BGP, of IGP in het Italiaans)** (geel-blauw keurmerk). In dit geval vinden we uitstekende regionale oliën (bijv. IGP Toscana, IGP Sicilia).

In tegenstelling tot de BOB, staat een BGP toe dat **slechts één** van de fasen van teelt, verwerking of transformatie in het herkomstgebied plaatsvindt. Dit is nog steeds een uitstekend en streng gereguleerd product, maar met iets ruimere grenzen.

## "100% Italiaans": Het absolute minimum

En dan is er de meest voorkomende aanduiding in de supermarkten: "100% Italiano" of "Italiaanse olijven". De tekst is helder:
* Het behoedt je voor de aankoop van de gevreesde "mengeling van olijfolie uit de EU".
* Het garandeert dat de olie is geperst uit olijven die in het land zijn geoogst en verwerkt.

> Helaas garandeert de aanduiding "100% Italiaans" wel de herkomst, maar zegt het niets over de oogstmethode, de snelheid van verwerking of de opslagomstandigheden. Je bent geografisch veilig, maar zonder garantie op de beste smaak.

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

De **Panel Test** (IOC/EU-methode) is de officiële zintuiglijke analyse voor de classificatie van olijfolie. Een groep gecertificeerde proevers beoordeelt zowel positieve eigenschappen (fruitigheid, bitterheid, pittigheid) als defecten — altijd gemeten als de "mediaan van defecten".

Een *extra vierge* olijfolie moet een **mediaan van defecten = 0** hebben en een mediaan van fruitigheid > 0. Als zelfs maar één defect deze drempel overschrijdt, verliest de olijfolie zijn categorie: het mag dan wettelijk niet meer "extra vierge" worden genoemd.

## De belangrijkste defecten

### Ranzig

Het bekendste defect onder het grote publiek. Het is het resultaat van **lipidoxidatie** — de reactie van onverzadigde vetten met zuurstof. Het ontwikkelt zich in de loop van de tijd en wordt versneld door licht, warmte en lucht.

*In de neus*: geur van oud vet, vergelijkbaar met oude boter of geoxideerde noten.
*In de mond*: een aanhoudende nasmaak van "oud vet", die een droog gevoel achterlaat.

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

*Ranzigheid* komt niet als een verontreiniging van "buitenaf": het ontstaat **in de olijfolie zelf**, wanneer de vetten langzaam reageren met zuurstof. Extra vierge olijfolie is rijk aan onverzadigde vetzuren (die met dubbele verbindingen): deze zijn kostbaar, maar ook zeer gevoelig voor oxidatie.

Simpel gezegd: in het begin is de olie beschermd en geurig. Na verloop van tijd en onder de verkeerde omstandigheden vormen zich moleculen die het aroma volledig veranderen. En wanneer die transformatie eenmaal echt op gang komt, heeft ze de neiging te versnellen.

Het proces kan in drie stappen worden voorgesteld:

1.  **Initiatie**: iets "triggert" de reactie (licht, warmte, metalen, tijd) en de eerste radicalen worden gevormd.
2.  **Propagatie**: zuurstof komt in het spel en de reactie houdt zichzelf in stand.
3.  **Terminatie**: verbindingen die verantwoordelijk zijn voor de muffe geur hopen zich op (die je doen denken aan oude boter, geoxideerde noten of oud vet).

Dit is de reden waarom een olie die "net begint" te veranderen, heel snel achteruit kan gaan als je hem in dezelfde omstandigheden laat staan.

## Factoren die oxidatie versnellen

Ranzigheid is geen pech: het ligt vrijwel altijd aan de **omgeving**.

Licht is een van de ergste versnellers (vooral als de olie in helder glas zit). Warmte doet de rest: in de buurt van het fornuis of in een zeer warme keuken veroudert de olie veel sneller. Dan is er lucht: hoe meer zuurstof in contact blijft met de olie (fles vaak geopend, grotendeels "leeg", slechte dop), hoe meer brandstof de reactie heeft.

## Hoe polifenolen het voorkomen

Nu het mooie deel: extra vierge olijfolie heeft een natuurlijke afweer, de **polifenolen**. Zij zijn degenen die zich als eerste "opofferen" door de oxidatieve keten te blokkeren en de aromatische veroudering te vertragen.

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
      title: "How Our Oil Is Made: Harvest -> Mill -> Storage",
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

The raw oil passes through a **vertical separator** to remove the last traces of water. The product is now fresh EVOO — ready for chemical parameter verification.

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
      title: "Why EVOO Is Bitter and Pungent (It's Not a Defect)",
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
      title: "The 7 Most Common Mistakes When Storing Olive Oil in the Kitchen",
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
Experience the taste of fresh EVOO
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
| **Fresh Artisanal Oil** | 1.50–2.00 | 0.08–0.14 |
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
      content: `## A Molecular Portrait of Extra Virgin Olive Oil

**Mass Spectrometry (MS)** is an advanced analytical technique that separates and detects molecules based on their **mass-to-charge ratio (m/z)**. When coupled with powerful separation techniques like **Gas Chromatography (GC)** for volatile compounds and **Liquid Chromatography (LC)** for non-volatile ones, it yields a complete molecular map of premium EVOO.

## GC-MS: Mapping Volatile Aromas

Extra virgin olive oil contains more than 200 volatile compounds. **GC-MS** is the reference technique to isolate and quantify the ones that truly define its fragrance.

### 1. Key Aromatic Molecules and Ions
*   ***(E)-2-Hexenal*** *(C6H10O, M⁺ = 98 m/z):* The master compound responsible for the "bright green" herbaceous aroma. Its base fragment ion is **41 m/z**.
*   **Hexanal** *(C6H12O, M⁺ = 100 m/z):* Produced via the LOX pathway from linoleic acid, providing notes of fresh grass.
*   ***(Z)-3-Hexenol*** *(C6H12O, base ion 41):* Known as "leaf alcohol," yielding a green leaf scent.
*   **Nonanal** and **Decanal:** Volatile aldehydes representing oleic acid decay—highly useful as markers of early storage oxidation.

## LC-MS/MS: The Polyphenolic Profile

While classic HPLC-DAD separates compounds well, it struggles to identify complex secoiridoids without pure reference standards. **LC-MS/MS** (Tandem Mass Spectrometry) solves this by fragmenting ions inside the instrument to reveal their exact chemical structures.

### 2. Analytical Markers (ESI Negative Mode)
*   **Hydroxytyrosol** *(HT, MW 154.06):* Deprotonates easily to yield '[M-H]⁻ = 153.05' m/z, fragmenting into 123 m/z (loss of formaldehyde) and 107 m/z.
*   **Oleuropein** *(MW 540.16):* Deprotonates to '[M-H]⁻ = 539.17' m/z. The diagnostic transition **539 → 377** (loss of the glucose moiety) is a well-known diagnostic marker.
*   **Oleocanthal** *(MW 304.13):* Deprotonates to '[M-H]⁻ = 303.12' m/z, representing the potent anti-inflammatory compound.

:::cta
Scientifically certified excellence
We use GC-MS and LC-MS analyses to guarantee that every bottle of our olive oil has a premium volatile and antioxidant profile.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "massenspektrometrie-olivenoel-gcms-lcms",
      title: "Massenspektrometrie von Olivenöl: GC-MS für Aromastoffe, LC-MS für Polyphenole",
      excerpt: "GC-MS für flüchtige Verbindungen und LC-MS/MS für das Polyphenolprofil: Zwei Techniken, die zusammen ein vollständiges molekulares Porträt zeichnen.",
      category: "Olivenölchemie",
      content: `## Ein molekulares Porträt des Olivenöls Extra

Die **Massenspektrometrie (MS)** trennt Moleküle nach ihrem **Masse-Ladungs-Verhältnis (m/z)**. In Kombination mit der **Gaschromatographie (GC)** für flüchtige Verbindungen und der **Flüssigchromatographie (LC)** für Polyphenole liefert sie das präziseste chemische Profil von nativem Olivenöl Extra.

## GC-MS: Analyse der Aromen

Olivenöl enthält über 200 flüchtige Verbindungen. Die GC-MS isoliert diejenigen, die das sensorische Erlebnis prägen:
*   ***(E)-2-Hexenal*** (grüner, frischer Duft).
*   **Hexanal** (frisch gemähtes Gras).
*   **Nonanal** und **Decanale** (Aldehyde, die als frühe Marker für Oxidation und Alterung dienen).

## LC-MS/MS: Das Polyphenol-Profil

Die Flüssigchromatographie gekoppelt mit Tandem-Massenspektrometrie (LC-MS/MS) fragmentiert die Moleküle, um ihre Struktur zweifelsfrei zu bestimmen:
*   **Hydroxytyrosol (HT):** Starkes Antioxidans.
*   **Oleuropein:** Bietet den herzkreislaufschützenden Wert und die feine Bitternote.
*   **Oleocanthal:** Natürlicher Entzündungshemmer (Schärfe im Hals).

:::cta
Wissenschaftlich geprüfte Exzellenz
Wir analysieren unsere Ernten mit GC-MS und LC-MS, um Ihnen höchste Reinheit zu garantieren.
[Entdecken Sie den Shop](/shop)
:::`,
    },
    "nl": {
      slug: "massaspectrometrie-olijfolie-gcms-lcms",
      title: "Massaspectrometrie van olijfolie: GC-MS voor aromastoffen, LC-MS voor polifenolen",
      excerpt: "GC-MS voor vluchtige verbindingen en LC-MS/MS voor het polifenolenprofiel: twee technieken die samen een compleet moleculair portret schetsen.",
      category: "Olijfoliechemie",
      content: `## Het moleculaire profiel van olijfolie

**Massaspectrometrie (MS)** scheidt en identificeert moleculen op basis van hun **massa-ladingverhouding (m/z)**. In combinatie met **Gaschromatografie (GC)** voor aroma's en **Vloeistofchromatografie (LC)** voor antioxidanten schetst het een compleet beeld van extra vierge olijfolie.

## GC-MS: Geurprofiel analyseren
*   ***(E)-2-Hexenal:*** Verantwoordelijk voor het kenmerkende "frisgroene" aroma.
*   **Hexanal:** Aroma van gemaaid gras.
*   **Nonanal:** Vroegtijdige marker voor veroudering en oxidatie.

## LC-MS/MS: Polifenolen in detail
Tandem-massaspectrometrie brengt de antioxidanten in kaart:
*   **Hydroxytyrosol & Oleuropeine:** Krachtige beschermers van het vaatstelsel.
*   **Oleocanthal:** De actieve natuurlijke ontstekingsremmer.

:::cta
Transparantie tot in het molecuul
Onze olijfoliën worden geanalyseerd met de modernste MS-technieken.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "massespektrometri-olivenolie-gc-ms-lc-ms",
      title: "Massespektrometri af olivenolie: GC-MS til flygtige stoffer, LC-MS til polyfenoler",
      excerpt: "GC-MS til flygtige forbindelser og LC-MS/MS til polyfenolprofilen: To teknikker, der tilsammen tegner et komplet molekylært portræt af ekstra jomfruolivenolie.",
      category: "Olivenoliekemi",
      content: `## Et molekylært portræt af olivenolien

**Massespektrometri (MS)** er en avanceret teknik, der sorterer og identificerer molekyler baseret på deres **masse-til-ladnings-forhold (m/z)**.

*   **GC-MS (Gaskromatografi):** Bruges til at kortlægge de over 200 flygtige aromastoffer, herunder *(E)-2-Hexenal* (frisk grøn duft).
*   **LC-MS/MS (Væskekromatografi):** Den ultimative metode til at analysere oliens sundhedsfremmende polyfenoler (såsom *Oleocanthal* og *Oleuropein*).

:::cta
Videnskabeligt dokumenteret topkvalitet
Vi bruger MS-analyser til at sikre, at vores olivenolie altid har det højeste indhold af sunde stoffer.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "massespektrometri-olivenolje-gc-ms-lc-ms",
      title: "Massespektrometri av olivenolje: GC-MS for flyktige forbindelser, LC-MS for polyfenoler",
      excerpt: "GC-MS for flyktige forbindelser og LC-MS/MS for polyfenolprofilen: to teknikker som til sammen gir et komplett molekylært portrett av ekstra jomfruolivenolje.",
      category: "Olivenoljekjemi",
      content: `## Et molekylært portrett av olivenoljen

**Massespektrometri (MS)** er en avansert teknikk som sorterer og identifiserer molekyler basert på deres **masse-til-ladnings-forhold (m/z)**.

*   **GC-MS (Gasskromatografi):** Brukes til å kartlegge de over 200 flyktige aromastoffene, herunder *(E)-2-Hexenal* (frisk grønn duft).
*   **LC-MS/MS (Væskekromatografi):** Den ultimate metoden for å analysere oljens helsefremmende polyfenoler (slik som *Oleocanthal* og *Oleuropein*).

:::cta
Vitenskapelig dokumentert toppkvalitet
Vi bruker MS-analyser for å sikre at vår olivenolje alltid har det høyeste innholdet av sunne stoffer.
[Se butikken](/shop)
:::`,
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
      content: `## The Official Analytical Standards

The official classification of extra virgin olive oil in the European Union (under **Regulation EEC 2568/91**) is backed by international chemical protocols developed by the **ISO** (*International Organization for Standardization*).

Here is a detailed guide to the primary ISO methods used in certified laboratories:

## ISO 660 — Free Acidity (Titrimetric Method)

Free acidity measures the percentage of **free fatty acids** (expressed as grams of oleic acid per 100g). It is an indicator of olive health: healthy olives pressed immediately yield low acidity.
*   **The Principle:** An acid-base neutralization titration using potassium hydroxide (KOH) and phenolphthalein.
*   **Legal Limit for EVOO:** **≤ 0.8%** (high-quality oils consistently score below **0.2%**).

## ISO 3960 — Peroxide Value (Iodometric Method)

This method quantifies **hydroperoxides**, which represent the primary products of lipid oxidation.
*   **The Principle:** Reactive peroxides oxidize potassium iodide (KI) to free iodine (I₂), which is then titrated with sodium thiosulfate (Na₂S₂O₃) using starch as an indicator.
*   **Legal Limit for EVOO:** **≤ 20 mEq O₂/kg** (fresh artisanal oils typically score **below 8**).

## ISO 12228 / ISO 27107 — Sterol Profile (GC-FID)

Every vegetable species has a unique "sterol fingerprint." This gas chromatographic test is the ultimate check against fraud.
*   **The Principle:** Saponification of the oil, extraction of the unsaponifiable fraction, thin-layer chromatography, silylation of sterols, and gas chromatography.
*   **Markers:** A campesterol value **> 4.0%** indicates contamination with canola oil, while **delta-7-stigmastenol > 0.5%** reveals adulteration with sunflower oil.

:::cta
Unmatched transparency
We analyze every lot of our Tuscan Extra Virgin Olive Oil in compliance with the highest ISO standards.
[Explore the Shop](/shop)
:::`,
    },
    "de": {
      slug: "iso-methoden-olivenoel-analyse-leitfaden",
      title: "ISO-Methoden zur Olivenölanalyse: Von ISO 660 bis ISO 27107—Ein kompletter Leitfaden",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: Die offiziellen Methoden zur Analyse von Olivenöl im Detail erklärt, inklusive chemischer Prinzipien und Grenzwerte.",
      category: "Olivenölchemie",
      content: `## Die offiziellen Prüfstandards

Die gesetzliche Einstufung eines Olivenöls als „Natives Olivenöl Extra“ basiert auf den internationalen Standards der **ISO** (*International Organization for Standardization*).

Ein Überblick über die wichtigsten Labormethoden zur Qualitätsprüfung:

## ISO 660: Freie Fettsäuren (Säuregehalt)
*   **Prinzip:** Neutralisations-Titration der freien Fettsäuren mit Kaliumhydroxid (KOH).
*   **Bedeutung:** Zeigt den Zustand der Oliven vor der Pressung.
*   **Grenzwert für Extra:** **≤ 0,8 %** (Spitzenöle liegen meist unter **0,2 %**).

## ISO 3960: Peroxidzahl
*   **Prinzip:** Messung der primären Oxidationsprodukte.
*   **Grenzwert:** **≤ 20 mEq O₂/kg** (sehr frische Öle liegen unter **8**).

## ISO 27107: Sterinzusammensetzung (GC-FID)
*   **Bedeutung:** Der „Fingerabdruck“ der Olivensorte. Schützt zuverlässig vor der Beimischung von Fremdölen (z. B. Sonnenblumen- oder Rapsöl).

:::cta
Garantierte Quality nach ISO-Standards
Wir lassen jede Charge im akkreditierten Labor nach offiziellen ISO-Vorgaben analysieren.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "iso-methoden-olijfolie-analyse-gids",
      title: "ISO-methoden voor olijfolie-analyse: van ISO 660 tot ISO 27107—een complete gids",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: de officiële methoden voor olijfolie-analyse in detail uitgelegd, inclusief chemische principes, procedures en wettelijke limieten.",
      category: "Olijfoliechemie",
      content: `## De officiële analysemethoden

De indeling van olijfolie in kwaliteitsklassen (volgens **EG-verordening 2568/91**) berust op internationale chemische parameters gestandaardiseerd door de **ISO**.

## Belangrijkste ISO-normen in de olijfoliechemie:

*   **ISO 660 (Zuurgraad):** Meet vrije vetzuren. Maximaal **0,8%** voor extra vierge (topkwaliteit zit onder de **0,2%**).
*   **ISO 3960 (Peroxidegetal):** Meet primaire oxidatie. Maximaal **20 mEq O₂/kg** (vers zit onder de **8**).
*   **ISO 27107 (Sterolenprofiel):** De moleculaire vingerafdruk die vermenging met zaadoliën onomstotelijk aantoont.

:::cta
Wetenschappelijk bewezen kwaliteit
Elke batch olijfolie van Frantoio del Pasqua is gecertificeerd volgens de strengste ISO-normen.
[Bekijk de Shop](/shop)
:::`,
    },
    "da": {
      slug: "iso-metoder-til-olivenolieanalyse-guide",
      title: "ISO-metoder til olivenolieanalyse: Fra ISO 660 til ISO 27107—En komplet guide",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: De officielle metoder til olivenolieanalyse forklaret i detaljer, herunder kemiske principper, procedurer og lovmæssige grænser.",
      category: "Olivenoliekemi",
      content: `## De officielle laboratoriestandarder

Den lovmæssige klassificering af ekstra jomfruolivenolie i EU er baseret på internationale standarder fastlagt af **ISO**:

*   **ISO 660 (Syreindhold):** Måler andelen af frie fedtsyrer (max **0,8 %** for ekstra jomfru).
*   **ISO 3960 (Peroxidtal):** Måler oliens primære iltning og friskhed (max **20 mEq O₂/kg**).
*   **ISO 27107 (Sterolprofil):** Den gas-kromatografiske analyse af steroler, der afslører enhver form for forfalskning med andre planteolier.

:::cta
Garanteret renhed
Vores olivenolier opfylder og overgår alle officielle ISO-standarder.
[Se shoppen](/shop)
:::`,
    },
    "no": {
      slug: "iso-metoder-for-olivenoljeanalyse-guide",
      title: "ISO-metoder for olivenoljeanalyse: Fra ISO 660 til ISO 27107—En komplett guide",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: De offisielle metodene for olivenoljeanalyse forklart i detalj, inkludert kjemiske prinsipper, prosedyrer og lovbestemte grenser.",
      category: "Olivenoljekjemi",
      content: `## De offisielle laboratoriestandardene

Den lovmessige klassifiseringen av ekstra jomfruolivenolje i EU er baseret på internasjonale standarder fastlagt av **ISO**:

*   **ISO 660 (Syreinnhold):** Måler andelen frie fettsyrer (max **0,8 %** for ekstra jomfru).
*   **ISO 3960 (Peroksidtall):** Måler oljens primære oksidasjon og friskhet (max **20 mEq O₂/kg**).
*   **ISO 27107 (Sterolprofil):** Den gass-kromatografiske analysen av steroler, som avslører enhver form for forfalskning med andre planteoljer.

:::cta
Garantert renhet
Våre olivenoljer oppfyller og overgår alle offisielle ISO-standarder.
[Se butikken](/shop)
:::`,
    },
  },
};
