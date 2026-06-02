import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Let's define the replacement string for tec-2
tec2_original = """  "tec-2": {
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
  },"""

tec2_replaced = """  "tec-2": {
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
*   **Hydroxytyrosol** *(HT, MW 154.06):* Deprotonates easily to yield `[M-H]⁻ = 153.05` m/z, fragmenting into 123 m/z (loss of formaldehyde) and 107 m/z.
*   **Oleuropein** *(MW 540.16):* Deprotonates to `[M-H]⁻ = 539.17` m/z. The diagnostic transition **539 → 377** (loss of the glucose moiety) is a certified signature of quality.
*   **Oleocanthal** *(MW 304.13):* Deprotonates to `[M-H]⁻ = 303.12` m/z, representing the potent anti-inflammatory compound.

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
  },"""

# Let's replace tec-2
if tec2_original in content:
    content = content.replace(tec2_original, tec2_replaced)
else:
    print("WARNING: Exact match for tec-2 not found!")

# Let's define the replacement string for tec-3
tec3_original = """  "tec-3": {
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
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: de officiële methoden voor olijfolie-analyse in detail uitgelegd, inclusief chemicaliën, procedures en wettelijke limieten.",
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
  },"""

tec3_replaced = """  "tec-3": {
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
*   **Legal Limit for EVOO:** **≤ 20 mEq O₂/kg** (artisanal fresh oils score **below 8**).

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
Garantierte Qualität nach ISO-Standards
Wir lassen jede Charge im akkreditierten Labor nach offiziellen ISO-Vorgaben analysieren.
[Zum Shop](/shop)
:::`,
    },
    "nl": {
      slug: "iso-methoden-olijfolie-analyse-gids",
      title: "ISO-methoden voor olijfolie-analyse: van ISO 660 tot ISO 27107—een complete gids",
      excerpt: "ISO 660, 3960, 3961, 5509, 27107: de officiële methoden voor olijfolie-analyse in detail uitgelegd, inclusief chemicaliën, procedures en wettelijke limieten.",
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

Den lovmessige klassifiseringen av ekstra jomfruolivenolje i EU er basert på internasjonale standarder fastlagt av **ISO**:

*   **ISO 660 (Syreinnhold):** Måler andelen frie fettsyrer (max **0,8 %** for ekstra jomfru).
*   **ISO 3960 (Peroksidtall):** Måler oljens primære oksidasjon og friskhet (max **20 mEq O₂/kg**).
*   **ISO 27107 (Sterolprofil):** Den gass-kromatografiske analysen av steroler, som avslører enhver form for forfalskning med andre planteoljer.

:::cta
Garantert renhet
Våre olivenoljer oppfyller og overgår alle offisielle ISO-standarder.
[Se butikken](/shop)
:::`,
    },
  },"""

# Let's replace tec-3
if tec3_original in content:
    content = content.replace(tec3_original, tec3_replaced)
else:
    print("WARNING: Exact match for tec-3 not found!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Translations batch 6 successfully inserted!")
