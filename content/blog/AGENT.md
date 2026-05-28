# 📖 Blog Architecture & Content Guide (For AI Agents & Developers)

Benvenuto! Questo file serve a orientare te (agente IA o sviluppatore umano) nella gestione, scrittura e traduzione degli articoli del blog del **Frantoio del Pasqua**.

La nostra architettura separa rigidamente i **metadati leggeri** (usati lato client per rotte e SEO) dal **contenuto markdown pesante** (caricato solo sul server a runtime).

---

## 📂 Struttura delle Cartelle

Il blog si trova nella directory `content/blog/` alla radice del progetto:

```text
content/
  blog/
    AGENT.md                     # Questo file di guida
    [slug-italiano-dell-articolo]/
      it.md                      # Articolo originale in Italiano
      en.md                      # Traduzione in Inglese
      de.md                      # Traduzione in Tedesco
      nl.md                      # Traduzione in Olandese
      da.md                      # Traduzione in Danese
      no.md                      # Traduzione in Norvegese
      cover.jpg                  # Immagine di copertina (consigliato metterla qui)
```

> [!NOTE]
> Il nome della cartella rappresenta lo **slug italiano canonico** dell'articolo (es. `benefici-olio-evo-salute`). Questo nome di cartella viene utilizzato internamente come chiave di associazione del post.

---

## ✍️ Struttura di un File `.md` (Frontmatter & Content)

Ogni file di lingua (es. `it.md`, `en.md`) deve contenere un'intestazione **Frontmatter YAML** racchiusa tra `---`, seguita dal corpo in Markdown.

### Esempio Completo di File Markdown:

```markdown
---
id: "post-1"
title: "I benefici dell'Olio Extra Vergine di Oliva per la salute quotidiana"
excerpt: "Non è solo un condimento, è il carburante pulito per chi ama vivere una vita attiva."
category: "Salute & Benessere"
date: "2026-03-01"
updateDate: "2026-03-02"
readingTime: "4 min"
author: "Frantoio del Pasqua"
imageUrl: "/blog/benefici-olio-evo-salute.jpg"
references:
  - label: "Covas M.I. et al. (2006) — Annals of Internal Medicine"
    url: "https://www.acpjournals.org/doi/..."
    note: "Studio clinico che dimostra l'impatto dei polifenoli."
---

## Più di un semplice ingrediente

Spesso releghiamo l'olio d'oliva al ruolo di semplice comparsa...

:::cta
Scopri i nostri oli estratti a freddo
Coltivati con amore, franti in giornata per mantenere intatti tutti i polifenoli.
[Vai allo shop](/shop)
:::
```

### 📋 Campi del Frontmatter

| Campo | Tipo | Descrizione |
| :--- | :--- | :--- |
| `id` | `string` | ID univoco del post (es. `post-1`, `post-chem-1`, `ric-1`). Deve essere lo stesso in tutte le lingue. |
| `title` | `string` | Il titolo dell'articolo tradotto nella lingua corrente. |
| `excerpt` | `string` | Un breve riassunto dell'articolo (usato nelle schede del blog). |
| `category` | `string` | La categoria del post tradotta (es. `Health & Wellbeing`, `Salute & Benessere`). |
| `date` | `string` | Data di pubblicazione in formato `YYYY-MM-DD`. |
| `updateDate`| `string` | Data dell'ultimo aggiornamento in formato `YYYY-MM-DD`. |
| `readingTime`| `string` | Tempo stimato di lettura tradotto (es. `4 min`, `4 Min.`). |
| `author` | `string` | Nome dell'autore (es. `Frantoio del Pasqua`, `Chef del Frantoio`). |
| `imageUrl` | `string` | Percorso dell'immagine di copertina (es. `/blog/benefici.jpg`). |
| `references` | `array` | *(Opzionale)* Elenco di fonti scientifiche o riferimenti (vedi schema sopra). |

---

## 🎨 Elementi di Styling Speciali Supportati

Il nostro parser customizzato in `page.tsx` supporta degli elementi markdown speciali che puoi utilizzare nei testi:

1. **Blocchi CTA (Call To Action)**:
   Per creare un banner nero con link pulsante verso lo shop o le degustazioni:
   ```markdown
   :::cta
   Titolo del Banner
   Descrizione o testo del banner di invito all'azione.
   [Testo Pulsante](/percorso-link)
   :::
   ```

2. **Citazioni evidenziate (Blockquotes)**:
   ```markdown
   > Questo è una citazione in evidenza che apparirà con uno stile verde elegante.
   ```

3. **Formattazione Inline**:
   * Grassetto: `**testo**`
   * Corsivo: `*testo*` o `_testo_`
   * Link: `[testo del link](/percorso)`

---

## 🤖 Regole per gli Agenti IA (AI Agents Instructions)

Quando scrivi, modifichi o traduci un articolo:

1. **Mantieni coerenza tra gli ID**: Se stai aggiungendo una lingua per un articolo esistente, assicurati che il campo `id` nel Frontmatter sia lo stesso del file `it.md`.
2. **Localizza tutto**: Traduci accuratamente il titolo, l'estratto (`excerpt`), la categoria (`category`), il tempo di lettura (`readingTime`) e i testi del blocco `:::cta`.
3. **Ottimizza i metadati leggeri**: Quando crei un nuovo articolo o modifichi gli slug, notifica lo sviluppatore che è necessario aggiornare i metadati leggeri in `src/lib/blogTranslationsData.ts` per il corretto funzionamento del cambio lingua del menu di navigazione.
4. **Link relativi**: Tutti i link interni (es. `/shop`, `/degustazioni`) non devono includere il prefisso della lingua (es. NON `/en/shop`), ci penserà il router internazionale a gestirli!
