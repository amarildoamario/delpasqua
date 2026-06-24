import { locales, type Locale } from "@/i18n/pathnames";
import { readPublicCatalog } from "@/lib/server/catalog";
import NuovoRaccoltoClient, { type LandingPageContent } from "./NuovoRaccoltoClient";
import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

const pageContent: Record<Exclude<Locale, "es" | "fr" | "us">, LandingPageContent> = {
  it: {
    kicker: "Stagionalità",
    title: "Olio Nuovo Raccolto",
    subtitle: "L'energia dell'olio appena franto: l'autentico olio novello toscano, estratto a freddo ed imbottigliato freschissimo.",
    heroImage: "/frantoio/brucatura.jpg",
    introTitle: "Il sapore intenso della nuova annata olivicola",
    introText: "L'olio extravergine 'Nuovo Raccolto' (o olio novello) è il prodotto più atteso dell'anno da appassionati ed intenditori. Ottenuto dalle primissime olive raccolte all'inizio dell'autunno in Toscana, si distingue per il suo colore verde smeraldo brillante, il profumo intenso di erba sfalciata e carciofo, ed un sapore marcatamente piccante ed amaro, indice dell'altissima presenza di polifenoli freschi.\n\nAl Frantoio Del Pasqua, imbottigliamo questo olio subito dopo la frangitura senza sottoporlo a filtrazione prolungata, per preservare tutta la densità, i profumi ed il gusto selvatico del frutto fresco. Perfetto da gustare a crudo su una fetta di pane caldo (la classica bruschetta toscana), su zuppe di fagioli, legumi o per arricchire piatti semplici, è un'esperienza sensoriale stagionale da non perdere.",
    features: [
      { icon: "leaf", title: "Olio Novello Non Filtrato", description: "Conserva le micro-particelle di polpa di oliva per una corposità unica." },
      { icon: "shield", title: "Altissimo in Antiossidanti", description: "Il picco massimo annuale di polifenoli e vitamine per la salute." },
      { icon: "sparkles", title: "Edizione Limitata", description: "Disponibile solo nei mesi del raccolto autunnale (da ottobre a dicembre)." }
    ],
    ctaTitle: "Ordina o Prenota il Nuovo Raccolto",
    ctaText: "Acquista direttamente dal nostro frantoio l'olio della nuova stagione.",
    ctaButton: "Vai allo Shop",
    seoTitleText: "Perché l'Olio Nuovo Raccolto è speciale?",
    seoBodyText: "Comprare l'olio extravergine di oliva nuovo raccolto online dal frantoio assicura di ricevere un olio vivo, imbottigliato da poche settimane, con caratteristiche organolettiche che svaniscono col tempo. È la celebrazione annuale del nostro lavoro ad Arezzo.",
    timeline: [
      { step: "Fase 1", title: "Raccolta Precoce", description: "A inizio autunno (ottobre), raccogliamo le olive ancora verdi o all'inizio dell'invaiatura per catturare il massimo dei profumi e delle proprietà antiossidanti." },
      { step: "Fase 2", title: "Trasporto Rapido al Frantoio", description: "Le olive vengono trasportate a Monte San Savino in cassette forate ed arieggiate per preservare l'integrità del frutto ed evitare fermentazioni." },
      { step: "Fase 3", title: "Frangitura a Freddo", description: "Entro 6 ore dalla raccolta, le olive vengono frante a temperatura controllata rigidamente sotto i 27°C, estraendo un succo purissimo e ricco di polifenoli." },
      { step: "Fase 4", title: "Imbottigliamento immediato", description: "L'olio novello viene confezionato freschissimo e senza filtrazione prolungata, per far giungere sulla tua tavola la densità e il gusto originale del frutto fresco." }
    ],
    pairings: [
      { name: "Bruschetta Toscana", description: "Pane toscano arrostito sulla brace, strofinato con aglio e irrorato abbondantemente di Olio Nuovo per assaporarne il pizzicore tipico." },
      { name: "Zuppa di Fagioli Cannellini", description: "Un abbinamento classico toscano: fagioli lessati conditi a freddo con pepe nero e un filo generoso di Olio Nuovo appena spremuto." },
      { name: "Carpaccio di Carne o Porcini", description: "Esalta le fettine di carne cruda o i funghi freschi tagliati sottili con la spinta aromatica ed erbacea dell'olio novello." }
    ]
  },
  en: {
    kicker: "Seasonality",
    title: "New Harvest Olive Oil",
    subtitle: "The energy of freshly pressed oil: authentic Tuscan new harvest oil, cold-extracted and bottled immediately.",
    heroImage: "/frantoio/brucatura.jpg",
    introTitle: "The intense flavor of the new olive season",
    introText: "The 'New Harvest' extra virgin olive oil (or new oil) is the most awaited product of the year by enthusiasts and connoisseurs. Obtained from the very first olives harvested in early autumn in Tuscany, it stands out for its brilliant emerald green color, intense aroma of mown grass and artichoke, and a markedly peppery and bitter taste, representing a very high presence of fresh polyphenols.\n\nAt Frantoio Del Pasqua, we bottle this oil immediately after pressing without long filtering, to preserve all the density, aromas, and wild taste of the fresh fruit. Perfect to enjoy raw on a slice of warm bread (the classic Tuscan bruschetta), on bean soups, legumes, or simple dishes, it is a seasonal sensory experience not to be missed.",
    features: [
      { icon: "leaf", title: "Unfiltered New Oil", description: "Preserves micro-particles of olive pulp for a unique body." },
      { icon: "shield", title: "High in Antioxidants", description: "The annual peak of polyphenols and vitamins for your health." },
      { icon: "sparkles", title: "Limited Edition", description: "Available only during the autumn harvest months (October to December)." }
    ],
    ctaTitle: "Order or Pre-order the New Harvest",
    ctaText: "Buy directly from our mill the oil of the new season.",
    ctaButton: "Go to Shop",
    seoTitleText: "Why is New Harvest Olive Oil special?",
    seoBodyText: "Buying new harvest extra virgin olive oil online from the mill ensures you receive a living oil, bottled just a few weeks prior, with organoleptic characteristics that fade over time. It is the annual celebration of our work in Arezzo.",
    timeline: [
      { step: "Step 1", title: "Early Harvest", description: "In early autumn (October), we harvest the olives while they are still green to capture the maximum aromas and antioxidant properties." },
      { step: "Step 2", title: "Fast Transport to the Mill", description: "Olives are transported to our mill in Monte San Savino in aerated crates to keep the fruit intact and avoid unwanted fermentation." },
      { step: "Step 3", title: "Cold Extraction", description: "Within 6 hours of harvest, olives are pressed at a strictly controlled temperature below 27°C, extracting a pure juice rich in polyphenols." },
      { step: "Step 4", title: "Immediate Bottling", description: "The new harvest oil is bottled fresh without filtering, delivering the original density and wild flavor of the fresh fruit straight to your table." }
    ],
    pairings: [
      { name: "Tuscan Bruschetta", description: "Tuscan bread toasted over embers, rubbed with garlic, and generously drizzled with New Oil to experience its signature peppery tickle." },
      { name: "Cannellini Bean Soup", description: "A classic Tuscan pairing: boiled beans seasoned cold with black pepper and a generous stream of freshly pressed New Oil." },
      { name: "Beef or Mushroom Carpaccio", description: "Enhances thin slices of raw beef or fresh porcini mushrooms with the aromatic and herbaceous punch of new harvest oil." }
    ]
  },
  de: {
    kicker: "Saisonalität",
    title: "Frische Olivenernte (Novello)",
    subtitle: "Die Energie des frisch gepressten Öls: Authentisches toskanisches Öl der neuen Ernte, kaltgepresst und sofort abgefüllt.",
    heroImage: "/frantoio/brucatura.jpg",
    introTitle: "Der intensive Geschmack der neuen Olivensaison",
    introText: "Das Olivenöl extra vergine 'Frische Ernte' (oder Novello-Öl) is das am sehnlichsten erwartete Produkt des Jahres. Gewonnen aus den ersten Oliven des Frühherbsts in der Toskana, zeichnet es sich durch seine leuchtend smaragdgrüne Farbe, das intensive Aroma von frisch gemähtem Gras und einen spürbar scharfen und bitteren Geschmack aus.\n\nIm Frantoio Del Pasqua füllen wir dieses Öl direkt nach dem Pressen ungefiltert ab, um die Dichte und den wilden Geschmack der frischen Frucht zu bewahren. Perfekt roh auf warmem Brot (Bruschetta) oder auf Suppen.",
    features: [
      { icon: "leaf", title: "Ungefiltertes Novello-Öl", description: "Erhält kleinste Fruchtfleischpartikel für einen einzigartigen Körper." },
      { icon: "shield", title: "Sehr Reich an Antioxidantien", description: "Der jährliche Höchstwert an Polyphenolen und Vitaminen für Ihre Gesundheit." },
      { icon: "sparkles", title: "Limitierte Auflage", description: "Nur während der Erntemonate im Herbst (Oktober bis Dezember) verfügbar." }
    ],
    ctaTitle: "Bestellen Sie die Frische Ernte",
    ctaText: "Kaufen Sie das Öl der neuen Saison direkt aus unserer Mühle.",
    ctaButton: "Zum Shop",
    seoTitleText: "Was macht das Öl der neuen Ernte so besonders?",
    seoBodyText: "Frisch geerntetes Olivenöl online direkt ab Mühle zu kaufen, garantiert ein lebendiges, erst vor wenigen Wochen abgefülltes Öl. Genießen Sie die toskanische Tradition zu Hause.",
    timeline: [
      { step: "Schritt 1", title: "Frühe Ernte", description: "Im Frühherbst (Oktober) ernten wir die Oliven, wenn sie noch grün sind, um maximale Aromen und Antioxidantien einzufangen." },
      { step: "Schritt 2", title: "Schneller Transport", description: "Oliven werden in luftigen Kisten nach Monte San Savino transportiert, um Druckstellen und Gärung zu vermeiden." },
      { step: "Schritt 3", title: "Kaltextraktion", description: "Innerhalb von 6 Stunden nach der Ernte werden die Oliven bei unter 27 °C schonend gepresst, um reinen, polyphenolreichen Saft zu gewinnen." },
      { step: "Schritt 4", title: "Sofortige Abfüllung", description: "Das Novello-Öl wird sofort ungefiltert abgefüllt, um den wilden Geschmack der frischen Frucht zu bewahren." }
    ],
    pairings: [
      { name: "Toskanische Bruschetta", description: "Über Holzkohle geröstetes toskanisches Brot, mit Knoblauch eingerieben und reichlich mit neuem Öl beträufelt." },
      { name: "Cannellini-Bohnensuppe", description: "Ein toskanischer Klassiker: Gekochte Bohnen, kalt mit schwarzem Pfeffer und reichlich frisch gepresstem Olivenöl Novello serviert." },
      { name: "Rinder- oder Pilz-Carpaccio", description: "Verleiht rohem Rindfleisch oder dünn geschnittenen frischen Steinpilzen eine kräftige Kräuternote." }
    ]
  },
  nl: {
    kicker: "Seizoensgebonden",
    title: "Nieuwe Oogst Olijfolie",
    subtitle: "De kracht van vers geperste olijfolie: authentieke Toscaanse nieuwe oogst, koud geëxtraheerd en direct gebotteld.",
    heroImage: "/frantoio/brucatura.jpg",
    introTitle: "De intense smaak van het nieuwe olijfseizoen",
    introText: "De 'Nieuwe Oogst' extra vierge olijfolie (of novello olie) is het meest verwachte product van het jaar voor liefhebbers. Verkregen uit de allereerste olijven geoogst in het vroege najaar in Toscane, valt hij op door zijn smaragdgroene kleur en aroma's van vers gras en artisjok.\n\nBij Frantoio Del Pasqua bottelen we deze olie direct na het persen zonder langdurige filtering, om alle dichtheid en aroma's te behouden. Perfect op warme bruschetta of in bonensoep.",
    features: [
      { icon: "leaf", title: "Ongefilterde Nieuwe Olie", description: "Behoudt microdeeltjes olijfvlees voor een unieke textuur." },
      { icon: "shield", title: "Rijk aan Antioxidanten", description: "De jaarlijkse piek van polyfenolen en vitaminen voor uw gezondheid." },
      { icon: "sparkles", title: "Gelimiteerde Oplage", description: "Alleen verkrijgbaar tijdens de oogstmaanden in het najaar (oktober t/m december)." }
    ],
    ctaTitle: "Bestel de Nieuwe Oogst Olijfolie",
    ctaText: "Koop de olie van het nieuwe seizoen rechtstreeks online.",
    ctaButton: "Naar de Winkel",
    seoTitleText: "Wat maakt Nieuwe Oogst Olijfolie zo speciaal?",
    seoBodyText: "Nieuwe oogst olijfolie online kopen bij de molen garandeert dat u een levendige olie ontvangt, die slechts enkele weken geleden is gebotteld. Proef de herfst in Arezzo.",
    timeline: [
      { step: "Stap 1", title: "Vroege Oogst", description: "In de vroege herfst (oktober) oogsten we de olijven als ze nog groen zijn voor maximale aroma's en antioxidanten." },
      { step: "Stap 2", title: "Snel Transport naar de Molen", description: "Olijven worden in geventileerde kratten vervoerd naar Monte San Savino om kneuzingen en ongewenste gisting te voorkomen." },
      { step: "Stap 3", title: "Koude Extractie", description: "Binnen 6 uur na de oogst worden de olijven mechanisch geperst onder de 27°C, wat een puur sap oplevert." },
      { step: "Stap 4", title: "Ongefilterde Botteling", description: "De nieuwe oogst olie wordt direct ongefilterd gebotteld om de oorspronkelijke textuur en smaak te behouden." }
    ],
    pairings: [
      { name: "Toscaanse Bruschetta", description: "Toscaans brood geroosterd op houtskool, ingewreven met knoflook en royaal overgoten met nieuwe oogst olijfolie." },
      { name: "Cannellinibonensoep", description: "Klassiek Toscaans: gekookte bonen koud gekruid met zwarte peper en een flinke scheut vers geperste olijfolie." },
      { name: "Runder- of Paddenstoelencarpaccio", description: "Verrijkt dunne plakjes rauw rundvlees of verse eekhoorntjesbrood met de aromatische en grassige tonen van novello olijfolie." }
    ]
  },
  da: {
    kicker: "Sæsonbestemt",
    title: "Ny Høst Olivenolie",
    subtitle: "Energien fra friskpresset olie: autentisk toscansk ny høst olie, koldpresset og flasket med det samme.",
    heroImage: "/frantoio/brucatura.jpg",
    introTitle: "Den intense smag af den nye olivensæson",
    introText: "Vores 'Ny Høst' ekstra jomfruolivenolie (eller novello-olie) er årets mest ventede produkt. Fremstillet af de allerførste oliven høstet i det tidlige efterår i Toscana, skiller den sig ud med sin klare grønne farve, intense duft af græs og artiskok samt en krydret og bitter eftersmag.",
    features: [
      { icon: "leaf", title: "Ufiltreret Ny Olie", description: "Bevarer små partikler af olivenkød for en unik fyldighed." },
      { icon: "shield", title: "Meget Høj på Antioxidanter", description: "Årets maksimale niveau af polyphenoler og vitaminer for dit helbred." },
      { icon: "sparkles", title: "Begrænset Oplag", description: "Kun tilgængelig i efterårets høstmåneder (oktober til december)." }
    ],
    ctaTitle: "Bestil eller Forudbestil den Nye Høst",
    ctaText: "Køb direkte fra vores mølle olien fra den nye sæson.",
    ctaButton: "Til Butik",
    seoTitleText: "Hvorfor er Ny Høst Olivenolie speciel?",
    seoBodyText: "Køb av ny høst olivenolie direkte online fra møllen sikrer, at du modtager en levende olie, flasket for kun få uger siden.",
    timeline: [
      { step: "Trin 1", title: "Tidlig Høst", description: "I det tidlige efterår (oktober) høster vi olivenerne, mens de stadig er grønne, for at bevare de maksimale aromaer." },
      { step: "Trin 2", title: "Hurtig transport til møllen", description: "Olivenerne transporteres hurtigt til Monte San Savino i ventilerede kasser for at undgå uønsket gæring." },
      { step: "Trin 3", title: "Koldpresning", description: "Inden for 6 timer efter høst presses olivenerne ved en temperatur under 27°C for at udvinde den reneste saft." },
      { step: "Trin 4", title: "Ufiltreret aftapning", description: "Olien aftappes frisk uden filtrering, så du modtager den oprindelige smag af de friske olivener." }
    ],
    pairings: [
      { name: "Toscansk Bruschetta", description: "Toscansk brød ristet over gløder, gnedet med hvidløg og rigeligt dryppet med Ny Olie for at opleve dens karakteristiske krydrede smag." },
      { name: "Cannellini Bønnesuppe", description: "Klassisk toscansk parring: kogte bønner krydret koldt med sort peber og et generøst dryp af friskpresset Ny Olie." },
      { name: "Oksekøds- eller svampecarpaccio", description: "Fremhæver tynde skiver af råt oksekød eller friske Karl Johan-svampe med den aromatiske smag af den nye olie." }
    ]
  },
  no: {
    kicker: "Sesong",
    title: "Ny Høst Olivenolje",
    subtitle: "Energien fra ferskpresset olje: autentisk toskansk ny høst olje, kaldpresset og tappet på flaske med en gang.",
    heroImage: "/frantoio/brucatura.jpg",
    introTitle: "Den intense smaken av den nye olivensesongen",
    introText: "Vår 'Ny Høst' ekstra virgin olivenolje (eller novello-olje) er årets mest ventede produkt. Utvunnet fra de allerførste olivene høstet i tidlig høst i Toscana, skiller den seg ut med sin klare grønne farge, intense duft av gress og artisjokk samt en krydret og bitter ettersmak.",
    features: [
      { icon: "leaf", title: "Ufiltrert Ny Olje", description: "Bevarer små partikler av olivenkjøtt for en unik fyldighet." },
      { icon: "shield", title: "Svært Høy på Antioksidanter", description: "Årets maksimale nivå av polyfenoler og vitaminer for helsen din." },
      { icon: "sparkles", title: "Begrenset Opplag", description: "Kun tilgjengelig i høstmånedene (oktober til desember)." }
    ],
    ctaTitle: "Bestill eller Forhåndsbestill den Nye Høsten",
    ctaText: "Kjøp direkte fra vår mølle oljen fra den nye sesongen.",
    ctaButton: "Til Butikk",
    seoTitleText: "Hvorfor er Ny Høst Olivenolje spesiell?",
    seoBodyText: "Kjøp av ny høst olivenolje direkte online fra møllen sikrer at du mottar en levende olje, flasket for bare få uker siden.",
    timeline: [
      { step: "Trinn 1", title: "Tidlig Høst", description: "Tidlig på høsten (oktober) høster vi olivene mens de fremdeles er grønne for å fange maksimalt med aromaer." },
      { step: "Trinn 2", title: "Rask transport til møllen", description: "Olivene transporteres raskt til Monte San Savino i ventilerte kasser for å unngå uønsket gjæring." },
      { step: "Trinn 3", title: "Kaldpressing", description: "Innen 6 timer etter høsting presses olivene ved en temperatur under 27°C for å utvinne den reneste saften." },
      { step: "Trinn 4", title: "Ufiltrert tapping", description: "Oljen tappes fersk uten filtrering, slik at du får den opprinnelige smaken av de friske olivene på bordet." }
    ],
    pairings: [
      { name: "Toskansk Bruschetta", description: "Toskansk brød ristet over glør, gnidd med hvitløk og rikelig dryppet med Ny Olje for å oppleve dens karakteristiske krydrede smak." },
      { name: "Cannellini Bønnesuppe", description: "Klassisk toskansk parring: kokte bønner krydret kaldt med sort pepper og et generøst drypp av ferskpresset Ny Olje." },
      { name: "Oksekjøtt- eller soppcarpaccio", description: "Fremhever tynne skiver av rått oksekjøtt eller ferske steinsopp med den aromatiske smaken av den nye oljen." }
    ]
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function NuovoRaccoltoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  const tp = await getTranslations({ locale: activeLocale, namespace: "Products" });
  const hasTranslation = (key: string) => typeof tp.has === "function" && tp.has(key);

  const rawCatalog = await readPublicCatalog();
  const targetIds = ["evo", "fruttato-intenso", "fruttato-medio"];
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

  return <NuovoRaccoltoClient locale={activeLocale} content={content} products={products} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  return pageMetadata({
    title: content.title,
    description: content.subtitle,
    path: "/nuovo-raccolto/",
    locale,
    hreflang: true,
  });
}
