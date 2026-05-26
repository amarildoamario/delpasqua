import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Exact match for tec-3 currently in the file
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
  },"""

if tec3_original in content:
    content = content.replace(tec3_original, tec3_replaced)
    print("Exact matched and replaced tec-3!")
else:
    print("Exact match for tec-3 STILL not found! Let's check whitespace or fields...")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
