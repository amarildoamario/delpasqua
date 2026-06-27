import { locales, type Locale } from "@/i18n/pathnames";
import { readPublicCatalog } from "@/lib/server/catalog";
import Olio5LitriClient, { type LandingPageContent } from "./Olio5LitriClient";
import { pageMetadata } from "@/lib/seo";
import { getTranslations } from "next-intl/server";
import { translateVariantTitle } from "@/lib/productSlugs";

const pageContent: Record<Exclude<Locale, "es" | "fr" | "us">, LandingPageContent> = {
  it: {
    kicker: "Convenienza",
    title: "Olio Extravergine 5 Litri",
    subtitle: "La scorta perfetta per la famiglia: il nostro olio di frantoio nel formato convenienza in latta, protetto dalla luce per preservarne freschezza e aromi.",
    heroImage: "/frantoio/confezionamento.jpg",
    introTitle: "Il formato in latta da 5 litri: qualità ed economia in cucina",
    introText: "Comprare l'olio extravergine in formato da 5 litri è la scelta più intelligente per chi consuma regolarmente olio in cucina e cerca il miglior rapporto qualità-prezzo senza scendere a compromessi con l'eccellenza.\n\nPresso il Frantoio Del Pasqua ad Arezzo, confezioniamo il nostro olio extravergine in latte metalliche appositamente progettate. Questo materiale garantisce una protezione al 100% dai raggi UV, il nemico principale degli antiossidanti e dei profumi dell'olio. La latta da 5 litri permette inoltre di ridurre i costi di confezionamento rispetto alle bottiglie in vetro, offrendo un prezzo al litro estremamente vantaggioso per un olio di qualità superiore, franto a freddo e ideale sia per cucinare sia per l'uso a crudo.",
    features: [
      { icon: "leaf", title: "Protezione Totale", description: "La latta scherma completamente la luce solare, preservando intatte le proprietà nutrizionali." },
      { icon: "shield", title: "Convenienza Famiglia", description: "Miglior rapporto qualità-prezzo grazie al risparmio sul confezionamento in vetro." },
      { icon: "droplet", title: "Dosaggio Facile", description: "Progettate con beccuccio salvagoccia estensibile per un travaso comodo e pulito." }
    ],
    ctaTitle: "Scegli il Tuo Formato Convenienza",
    ctaText: "Acquista le nostre latte da 5 litri direttamente dal frantoio toscano.",
    ctaButton: "Vai allo Shop",
    seoTitleText: "La corretta conservazione dell'Olio Extravergine in Latta",
    seoBodyText: "Comprare olio extravergine 5 litri online direttamente dal produttore ti permette di ricevere a casa un olio freschissimo. Per conservarlo al meglio, si raccomanda di tenere la latta lontana da fonti di calore (come fornelli o termosifoni) e ad una temperatura costante tra i 12°C e i 18°C. Per l'uso quotidiano, è consigliabile travasare l'olio in una bottiglia o oliera di vetro scuro pulita, limitando così l'esposizione all'aria della scorta principale.",
    comparisonTable: {
      title: "Confronto: Latta da 5 Litri vs Bottiglie in Vetro",
      headers: ["Parametro", "Latta da 5 Litri", "Bottiglie in Vetro (750ml)"],
      rows: [
        { name: "Protezione dai Raggi UV e Luce", values: ["✓ 100% Impenetrabile", "Parziale (filtra nel tempo)"] },
        { name: "Risparmio sul prezzo al Litro", values: ["✓ Fino al 15% - 20%", "Standard (costi di confezionamento elevati)"] },
        { name: "Rischio di rottura o danni", values: ["Praticamente nullo (acciaio resistente)", "Moderato (vetro fragile durante il trasporto)"] },
        { name: "Sostenibilità del confezionamento", values: ["Acciaio riciclabile all'infinito", "Vetro riciclabile ma molto pesante"], highlight: true }
      ]
    },
    pairings: [
      { name: "Ristorazione Quotidiana", description: "Il formato in latta da 5 litri garantisce una scorta generosa per l'uso quotidiano in cucina: ideale per preparare basi, soffritti e condimenti per tutta la famiglia." },
      { name: "Sughi e Ragù a lenta cottura", description: "Un extravergine versatile che supporta egregiamente le lunghe cotture a fuoco lento, arricchendo ragù tradizionali, sughi di pomodoro e zuppe calde." },
      { name: "Fritture e Cottura al Forno", description: "Grazie al suo punto di fumo stabile, è perfetto anche per cotture al forno di patate, arrosti o fritture leggere e saporite." }
    ]
  },
  en: {
    kicker: "Format",
    title: "5-Liter Extra Virgin Olive Oil",
    subtitle: "The perfect family reserve: our mill olive oil in the convenience tin format, protected from light to preserve its freshness and aromas.",
    heroImage: "/frantoio/confezionamento.jpg",
    introTitle: "The 5-liter tin format: quality and economy in the kitchen",
    introText: "Buying extra virgin olive oil in a 5-liter format is the smartest choice for those who regularly use olive oil in the kitchen and seek the best value without compromising on excellence.\n\nAt Frantoio Del Pasqua in Arezzo, we pack our extra virgin olive oil in specially designed metal tins. This material ensures 100% protection against UV rays, the main enemy of the oil's antioxidants and aromas. The 5-liter tin also allows us to reduce packaging costs compared to glass bottles, offering an extremely advantageous price per liter for a superior quality oil, cold-extracted and ideal both for cooking and raw seasoning.",
    features: [
      { icon: "leaf", title: "Total Protection", description: "The tin completely blocks sunlight, preserving the nutritional properties intact." },
      { icon: "shield", title: "Family Value", description: "Best price-to-quality ratio due to savings on glass packaging." },
      { icon: "droplet", title: "Easy Pouring", description: "Designed with an extendable drip-free spout for clean and easy pouring." }
    ],
    ctaTitle: "Choose Your Value Format",
    ctaText: "Buy our 5-liter tins directly from the Tuscan mill.",
    ctaButton: "Go to Shop",
    seoTitleText: "Proper storage of Extra Virgin Olive Oil in Tins",
    seoBodyText: "Buying 5-liter extra virgin olive oil online directly from the producer allows you to receive fresh oil at home. To store it at its best, we recommend keeping the tin away from heat sources (like stoves or heaters) and at a constant temperature between 12°C and 18°C. For daily use, it is best to decant the oil into a clean dark glass bottle or oil cruet, thus limiting the exposure of the main supply to air.",
    comparisonTable: {
      title: "Comparison: 5-Liter Tin vs Glass Bottles",
      headers: ["Feature", "5-Liter Tin", "Glass Bottles (750ml)"],
      rows: [
        { name: "Protection from UV & Light", values: ["✓ 100% Impenetrable", "Partial (filters through over time)"] },
        { name: "Savings per Litre", values: ["✓ Up to 15% - 20%", "Standard (higher packaging costs)"] },
        { name: "Risk of Breakage/Damage", values: ["Practically zero (sturdy steel)", "Moderate (fragile glass during shipping)"] },
        { name: "Packaging Sustainability", values: ["Infinitely recyclable steel", "Glass is recyclable but much heavier"], highlight: true }
      ]
    },
    pairings: [
      { name: "Everyday Cooking", description: "The 5-liter tin format provides a generous reserve for daily kitchen use: ideal for bases, sautés, and dressings for the whole family." },
      { name: "Slow-Cooked Sauces & Ragù", description: "A versatile extra virgin oil that stands up to long, slow cooking, enriching traditional ragù, tomato sauces, and warm soups." },
      { name: "Baking & Light Frying", description: "Thanks to its stable smoke point, it is perfect for baking potatoes, roasting meats, or creating light, flavorful fries." }
    ]
  },
  de: {
    kicker: "Format",
    title: "5-Liter Olivenöl Extra Vergine",
    subtitle: "Der perfekte Familienvorrat: Unser Mühlenolivenöl im praktischen Blechkanister, lichtgeschützt, um Frische und Aromen optimal zu bewahren.",
    heroImage: "/frantoio/confezionamento.jpg",
    introTitle: "Der 5-Liter-Kanister: Qualität und Wirtschaftlichkeit in der Küche",
    introText: "Der Kauf von Olivenöl extra vergine im 5-Liter-Format ist die klügste Wahl für alle, die regelmäßig Olivenöl in der Küche verwenden und das beste Preis-Leistungs-Verhältnis suchen, ohne Kompromisse bei der Qualität einzugehen.\n\nIn der Ölmühle Frantoio Del Pasqua in Arezzo verpacken wir unser Olivenöl extra vergine in speziell entwickelten Blechkanistern. Dieses Material schützt zu 100 % vor UV-Strahlen, dem Hauptfeind der Antioxidantien und Aromen des Öls. Der 5-Liter-Kanister spart zudem Verpackungskosten im Vergleich zu Glasflaschen, was zu einem sehr attraktiven Literpreis führt.",
    features: [
      { icon: "leaf", title: "Vollständiger Schutz", description: "Der Kanister schützt das Öl zu 100% vor Licht und bewahrt die Nährstoffe." },
      { icon: "shield", title: "Familien-Vorteil", description: "Bestes Preis-Leistungs-Verhältnis durch Einsparungen bei Glasflaschen." },
      { icon: "droplet", title: "Einfaches Ausgießen", description: "Mit ausziehbarem, tropffreiem Ausgießer für sauberes Dosieren." }
    ],
    ctaTitle: "Wählen Sie Ihr Vorteilsformat",
    ctaText: "Kaufen Sie unsere 5-Liter-Kanister direkt ab der toskanischen Ölmühle.",
    ctaButton: "Zum Shop",
    seoTitleText: "Die richtige Lagerung von Olivenöl extra vergine im Kanister",
    seoBodyText: "Der Kauf von 5-Liter-Olivenöl extra vergine online direkt vom Erzeuger ermöglicht es Ihnen, frisches Öl direkt nach Hause geliefert zu bekommen. Um es optimal zu lagern, empfehlen wir, den Kanister von Wärmequellen fernzuhalten und bei einer konstanten Temperatur zwischen 12 °C und 18 °C aufzubewahren. Für den täglichen Gebrauch empfiehlt es sich, das Öl in eine saubere, dunkle Glasflasche umzufüllen.",
    comparisonTable: {
      title: "Vergleich: 5-Liter-Kanister vs. Glasflaschen",
      headers: ["Parameter", "5-Liter-Kanister", "Glasflaschen (750ml)"],
      rows: [
        { name: "Schutz vor UV und Licht", values: ["✓ 100 % undurchlässig", "Teilweise (lichtdurchlässig mit der Zeit)"] },
        { name: "Ersparnis pro Liter", values: ["✓ Bis zu 15 % - 20 %", "Standard (höhere Verpackungskosten)"] },
        { name: "Bruchrisiko beim Transport", values: ["Praktisch null (robuster Stahl)", "Moderat (zerbrechliches Glas)"] },
        { name: "Nachhaltigkeit der Verpackung", values: ["Unendlich recycelbarer Stahl", "Glas ist recycelbar, aber sehr schwer"], highlight: true }
      ]
    },
    pairings: [
      { name: "Tägliche Küche", description: "Das 5-liter-Format bietet einen großzügigen Vorrat für den täglichen Gebrauch: Ideal für Suppengrün, Saucen und Dressings für die ganze Familie." },
      { name: "Langsam gekochte Saucen & Ragouts", description: "Ein vielseitiges Öl, das langen Kochzeiten standhält und traditionelle Ragouts sowie Gemüsesuppen verfeinert." },
      { name: "Backen & Leichtes Frittieren", description: "Dank seines stabilen Rauchpunkts ideal zum Braten von Kartoffeln, Fleisch oder für leichtes Frittieren." }
    ]
  },
  nl: {
    kicker: "Formaat",
    title: "5 Liter Extra Vierge Olijfolie",
    subtitle: "De perfecte reserve voor het gezin: onze olijfolie in het voordelige blikformaat, beschermd tegen licht om versheid en aroma's te behouden.",
    heroImage: "/frantoio/confezionamento.jpg",
    introTitle: "Het blik van 5 liter: kwaliteit en voordeel in de keuken",
    introText: "Het kopen van extra vierge olijfolie in een formaat van 5 liter is de slimste keuze voor wie regelmatig olijfolie in de keuken gebruikt en op zoek is naar de beste prijs-kwaliteitverhouding zonder concessies te doen aan de kwaliteit.\n\nBij Frantoio Del Pasqua in Arezzo verpakken we onze extra vierge olijfolie in speciaal ontworpen metalen blikken. Dit materiaal garandeert een 100% bescherming tegen UV-straling, de grootste vijand van de antioxidanten en aroma's van de olijfolie. Het blik van 5 liter verlaagt de verpakkingskosten ten opzichte van glazen flessen, wat resulteert in een zeer gunstige prijs per liter.",
    features: [
      { icon: "leaf", title: "Totale Bescherming", description: "Het blik weert zonlicht volledig, waardoor de voedingswaarden intact blijven." },
      { icon: "shield", title: "Gezinsvoordeel", description: "Beste prijs-kwaliteitverhouding dankzij besparingen op glazen verpakkingen." },
      { icon: "droplet", title: "Eenvoudig Schenken", description: "Ontworpen met een uittrekbare schenktuit voor schoon en handig gebruik." }
    ],
    ctaTitle: "Kies uw Voordeelformaat",
    ctaText: "Koop onze blikken van 5 liter rechtstreeks van de Toscaanse perserij.",
    ctaButton: "Naar de Winkel",
    seoTitleText: "De juiste opslag van Extra Vierge Olijfolie in Blik",
    seoBodyText: "5 liter extra vierge olijfolie online kopen rechtstreeks van de producent zorgt ervoor dat u vers geproduceerde olijfolie thuis ontvangt. Om de olie optimaal te bewaren, raden we aan het blik weg te houden van warmtebronnen e te bewaren bij een constante temperature tussen 12°C en 18°C. Decanteer voor dagelijks gebruik de olijfolie in een schone fles van donker glas.",
    comparisonTable: {
      title: "Vergelijking: 5 Liter Blik vs Glazen Flessen",
      headers: ["Kenmerk", "5 Liter Blik", "Glazen Flessen (750ml)"],
      rows: [
        { name: "Bescherming tegen UV-straling & Licht", values: ["✓ 100% Ondoordringbaar", "Gedeeltelijk (licht dringt door op termijn)"] },
        { name: "Besparing per Liter", values: ["✓ Tot 15% - 20%", "Standaard (hogere verpakkingskosten)"] },
        { name: "Risico op breuk", values: ["Vrijwel nihil (stevig blik)", "Matig (breekbaar glas tijdens transport)"] },
        { name: "Duurzaamheid van verpakking", values: ["Oneindig recyclebaar staal", "Glas is recyclebaar maar erg zwaar"], highlight: true }
      ]
    },
    pairings: [
      { name: "Dagelijks Koken", description: "Het blik van 5 liter zorgt voor een royale voorraad voor dagelijks gebruik in de keuken: ideaal voor basissen, sautés en dressings voor het hele gezin." },
      { name: "Slowcooked Sauzen & Ragù", description: "Een veelzijdige extra vierge olijfolie die uitstekend bestand is tegen langdurig sudderen en traditionele ragù of soepen verrijkt." },
      { name: "Bakken & Licht Frituren", description: "Dankzij het stabiele rookpunt is deze olie ook perfect voor het bakken van aardappelen, vleesgerechten of licht frituren." }
    ]
  },
  da: {
    kicker: "Format",
    title: "5 Liters Ekstra Jomfruolivenolie",
    subtitle: "Den perfekte familiebeholdning: vores mølleolivenolie i det praktiske dunkformat, beskyttet mod lys for at bevare friskhed og aromaer.",
    heroImage: "/frantoio/confezionamento.jpg",
    introTitle: "5-liters dunken: kvalitet og økonomi i køkkenet",
    introText: "At købe ekstra jomfruolivenolie i et 5-liters format er det smarteste valg for dem, der regelmæssigt bruger olivenolie i køkkenet og søger den bedste værdi uden at gå på kompromis med kvaliteten.\n\nHos Frantoio Del Pasqua i Arezzo pakker vi vores ekstra jomfruolivenolie i specialdesignede metaldunke. Dette materiale sikrer 100 % beskyttelse mod UV-stråler, som er olivenoliens største fjende. 5-liters dunken reducerer også emballageomkostningerne sammenlignet med glasflasker, hvilket giver en yderst fordelagtig pris pr. liter.",
    features: [
      { icon: "leaf", title: "Total Beskyttelse", description: "Dunken blokerer fuldstændigt sollys, hvilket bevarer de ernæringsmæssige egenskaber intakte." },
      { icon: "shield", title: "Familieøkonomi", description: "Bedste pris-kvalitetsforhold takket være besparelser på glasemballage." },
      { icon: "droplet", title: "Nem Hældning", description: "Designet med en udtrækkelig hældetud for ren og nem hældning." }
    ],
    ctaTitle: "Vælg dit Fordelsformat",
    ctaText: "Køb vores 5-liters dunke direkte fra den toscanske mølle.",
    ctaButton: "Til Butik",
    seoTitleText: "Korrekt opbevaring af ekstra jomfruolivenolie i dunke",
    seoBodyText: "At købe 5-liters ekstra jomfruolivenolie online direkte fra producenten gør det muligt at modtage helt frisk olie derhjemme. For at opbevare den bedst muligt anbefales det at holde dunken væk fra varmekilder og ved en konstant temperatur mellem 12°C og 18°C. Til daglig brug anbefales det at hælde olien over i en ren mørk glasflaske.",
    comparisonTable: {
      title: "Sammenligning: 5-Liters Dunk vs Glasflasker",
      headers: ["Parameter", "5-Liters Dunk", "Glasflasker (750ml)"],
      rows: [
        { name: "Beskyttelse mod UV & Lys", values: ["✓ 100% Uigennemtrængelig", "Delvis (slipper igennem over tid)"] },
        { name: "Besvarelse pr. Liter", values: ["✓ Op til 15% - 20%", "Standard (højere emballageomkostninger)"] },
        { name: "Risiko for brud under transport", values: ["Praktisk talt nul (robust stål)", "Moderat (skrøbeligt glas)"] },
        { name: "Bæredygtig emballage", values: ["Uendeligt genanvendeligt stål", "Glas kan genanvendes, men er meget tungt"], highlight: true }
      ]
    },
    pairings: [
      { name: "Hverdagsmadlavning", description: "5-liters dunken giver en rigelig forsyning til daglig brug i køkkenet: ideel til baser, sautering og dressinger til hele familien." },
      { name: "Langtidskogte saucer & Ragout", description: "En alsidig ekstra jomfruolivenolie, der tåler lange kogetider og beriger traditionel ragout og varme supper." },
      { name: "Bagning & Let Friturestegning", description: "Takket være et stabilt røgpunkt er den perfekt til ovnbagte kartofler, stege eller sprøde stegninger." }
    ]
  },
  no: {
    kicker: "Format",
    title: "5 Liters Ekstra Virgin Olivenolje",
    subtitle: "Den perfekte familiereserven: vår mølleolivenolje i det praktiske kanneformatet, beskyttet mot lys for å bevare friskhet og aromaer.",
    heroImage: "/frantoio/confezionamento.jpg",
    introTitle: "5-liters kannen: kvalitet og økonomi på kjøkkenet",
    introText: "Å kjøpe ekstra virgin olivenolje i et 5-liters format er det smarteste valget for de som regelmessig bruker olivenolje på kjøkkenet og ønsker best mulig verdi uten å gå på kompromiss med kvaliteten.\n\nHos Frantoio Del Pasqua i Arezzo pakker vi vår ekstra virgin olivenolje i spesialdesignede metallkanner. Dette materialet sikrer 100 % beskyttelse mot UV-stråler, som er olivenoljens største fiende. 5-liters kannen reduserer også emballasjekostnadene sammenlignet med glassflasker, noe som gir en svært fordelaktig literpris.",
    features: [
      { icon: "leaf", title: "Total Beskyttelse", description: "Kannen blokkerer sollys fullstendig, noe som bevarer næringsegenskapene intakt." },
      { icon: "shield", title: "Familieøkonomi", description: "Beste pris-kvalitetsforhold takket være besparelser på glassemballasje." },
      { icon: "droplet", title: "Enkel Helling", description: "Designet med en uttrekkbar helletut for ren og enkel helling." }
    ],
    ctaTitle: "Velg ditt Fordelsformat",
    ctaText: "Kjøp våre 5-liters kanner direkte fra den toscanske møllen.",
    ctaButton: "Til Butikk",
    seoTitleText: "Riktig oppbevaring av ekstra virgin olivenolje på kanner",
    seoBodyText: "Å kjøpe 5-liters ekstra virgin olivenolje online direkte fra produsenten gjør det muligt å motta helt fersk olje hjemme. For å oppbevare den best mulig anbefales det å holde kannen unna varmekilder og ved en konstant temperatur mellom 12°C og 18°C. Til daglig brug anbefales det å dekantere oljen over på en ren, mørk glassflaske.",
    comparisonTable: {
      title: "Sammenligning: 5-Liters Kanne vs Glassflasker",
      headers: ["Parameter", "5-Liters Kanne", "Glassflasker (750ml)"],
      rows: [
        { name: "Beskyttelse mot UV & Lys", values: ["✓ 100% Ugjennomtrengelig", "Delvis (slipper gjennom over tid)"] },
        { name: "Besparelse per Liter", values: ["✓ Opptil 15% - 20%", "Standard (høyere emballasjekostnader)"] },
        { name: "Risiko for knusing", values: ["Nærmest null (solid stål)", "Moderat (skjørt glass under transport)"] },
        { name: "Bærekraftig emballasje", values: ["Uendelig resirkulerbart stål", "Glass kan resirkuleres, men er tungt"], highlight: true }
      ]
    },
    pairings: [
      { name: "Hverdagsmatlaging", description: "5-liters kannen gir en rikelig forsyning til daglig bruk på kjøkkenet: ideell til baser, sautering og dressinger til hele familien." },
      { name: "Langtidskokte sauser & Ragò", description: "En allsidig ekstra virgin olivenolje som tåler lange koketider og beriker tradisjonell ragò og varme supper." },
      { name: "Baking & Lett Fritering", description: "Takket være et stabilt røykpunkt er den perfekt til ovnsbakte poteter, steker eller sprø friteringer." }
    ]
  }
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Olio5LitriPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  const tp = await getTranslations({ locale: activeLocale, namespace: "Products" });
  const hasTranslation = (key: string) => typeof tp.has === "function" && tp.has(key);

  const rawCatalog = await readPublicCatalog();
  const targetIds = ["evo-latta", "fruttato-medio-latta", "fruttato-intenso-latta"];
  const products = rawCatalog
    .filter((p) => targetIds.includes(p.id))
    .map((product) => {
      // Find the 5lt variant specifically
      const targetVariant = product.variants?.find((v) => v.id === "5lt") ?? product.variants?.[0];
      const priceCents = targetVariant?.priceCents ?? 0;
      const priceLabel = new Intl.NumberFormat(activeLocale === "it" ? "it-IT" : "en-US", {
        style: "currency",
        currency: "EUR",
      }).format(priceCents / 100);

      const translatedProductTitle = activeLocale === "it"
        ? (product.title ?? product.id)
        : (hasTranslation(`${product.id}.title`) ? tp(`${product.id}.title`) : product.title || product.id);

      const title = activeLocale === "it"
        ? (targetVariant?.title ?? product.title ?? product.id)
        : (hasTranslation(`${product.id}.variants.5lt`)
            ? tp(`${product.id}.variants.5lt`)
            : translateVariantTitle("5lt", targetVariant?.title || "", translatedProductTitle, activeLocale));

      return {
        id: product.id,
        title,
        priceLabel,
        imageSrc: targetVariant?.imageSrc ?? product.imageSrc ?? "",
        slug: product.slug ?? product.id,
      };
    });

  return <Olio5LitriClient locale={activeLocale} content={content} products={products} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const activeLocale = locales.includes(locale as Locale) ? (locale as Locale) : "it";
  const displayLocale = (activeLocale === "es" || activeLocale === "fr" || activeLocale === "us" ? "en" : activeLocale) as Exclude<Locale, "es" | "fr" | "us">;
  const content = pageContent[displayLocale];

  return pageMetadata({
    title: content.title,
    description: content.subtitle,
    path: "/olio-5-litri/",
    locale,
    hreflang: true,
  });
}
