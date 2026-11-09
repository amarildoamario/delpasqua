# Analisi Traffico Pre-Lancio (08/11/2026)

Questo documento traccia la **baseline di traffico organico pre-lancio** di `delpasqua.com` (raccolta da Google Search Console il 08/11/2026) e formalizza il riferimento al **primo commit / push GitHub con dominio attaccato per il lancio ufficiale**.

---

## 1. Riferimenti Lancio Ufficiale e Commit GitHub

| Parametro | Dettaglio |
| :--- | :--- |
| **Data Analisi Pre-Lancio** | **08/11/2026** |
| **Data Lancio Ufficiale / Cutover DNS** | **08/11/2026** |
| **Dominio Attaccato** | `delpasqua.com` e `www.delpasqua.com` |
| **Configurazione DNS Aruba -> Vercel** | Apex A: `216.150.1.1`, `216.150.16.1`<br>CNAME www: `f1f4340baefc8370.vercel-dns-017.com.` |
| **Primo Commit Push GitHub Lancio Ufficiale** | [`de4e3b1601cfba42512c35a9cb948c2da1d7d78a`](https://github.com/amarildoamario/delpasqua/commit/de4e3b1601cfba42512c35a9cb948c2da1d7d78a) (`de4e3b1`) |
| **Data & Ora Push GitHub** | **08/11/2026 18:54:58 +01:00** |
| **Messaggio Commit Ufficiale** | `fix: ripristina metriche Prisma e aggiorna storefront` |
| **Autore** | Leonardo Mori <leonardomori23@gmail.com> |
| **Target Deployment Vercel** | Production: `dpl_whwcDUpJhzo9wKsNHV94NAYYccvw` (`https://delpasqua.com`) |
| **Commit Registrazione Switch DNS & Docs** | [`b02a3b467f1d3743df7d4a21cfebec89fb3df18b`](https://github.com/amarildoamario/delpasqua/commit/b02a3b467f1d3743df7d4a21cfebec89fb3df18b) (`b02a3b4`) del 08/11/2026 15:51:23 |
| **File Excel Aggiornato** | `delpasqua.com-Performance-on-Search-2026-11-09.xlsx` (in questa cartella) |

---

## 2. Sintesi Baseline di Traffico (Google Search Console)

- **Periodo di rilevazione**: 9 luglio 2025 – 7 novembre 2026 (chiusura periodo WordPress pre-lancio)
- **Tipo di ricerca**: Web (basato su testo)
- **Clic totali organici**: **722**
- **Impressioni totali**: **11.674**
- **CTR medio**: **6,18%**
- **Posizione media**: **8,8**

### 2.1 Ripartizione per Dispositivo

| Dispositivo | Clic | Impressioni | CTR | Posizione Media |
| :--- | :---: | :---: | :---: | :---: |
| **Mobile** | 512 (70,9%) | 8.602 | 5,95% | 3,83 |
| **Computer (Desktop)** | 206 (28,5%) | 2.971 | 6,93% | 13,63 |
| **Tablet** | 4 (0,6%) | 101 | 3,96% | 5,53 |

### 2.2 Principali Mercati Geografici

1. **Italia**: 644 clic (10.128 impressioni, CTR 6,36%, pos. 5,94)
2. **Germania**: 15 clic (131 impressioni, CTR 11,45%, pos. 5,15)
3. **Stati Uniti**: 14 clic (551 impressioni, CTR 2,54%, pos. 6,19)
4. **Regno Unito**: 6 clic (195 impressioni, CTR 3,08%, pos. 17,89)
5. **Svizzera**: 6 clic (49 impressioni, CTR 12,24%, pos. 5,08)
6. **Paesi Bassi**: 5 clic (40 impressioni, CTR 12,50%, pos. 4,90)
7. **Corea del Sud**: 4 clic (23 impressioni, CTR 17,39%, pos. 5,87)
8. **Francia**: 3 clic (60 impressioni, CTR 5,00%, pos. 6,92)

### 2.3 Top Query di Ricerca Organica

| Query | Clic | Impressioni | CTR | Posizione |
| :--- | :---: | :---: | :---: | :---: |
| `frantoio del pasqua` | 190 | 970 | 19,59% | 1,37 |
| `frantoio monte san savino` | 40 | 413 | 9,69% | 1,64 |
| `del pasqua frantoio` | 22 | 163 | 13,50% | 1,00 |
| `frantoio del pasqua monte san savino` | 17 | 112 | 15,18% | 1,00 |
| `frantoio arezzo` | 9 | 418 | 2,15% | 5,78 |
| `frantoio vicino a me` | 4 | 145 | 2,76% | 3,10 |
| `frantoi arezzo e provincia` | 4 | 81 | 4,94% | 5,46 |
| `olivenöl kaufen in der nähe` | 4 | 58 | 6,90% | 3,19 |
| `mulino del pasqua monte san savino` | 4 | 26 | 15,38% | 1,00 |

### 2.4 Top Pagine di Ingresso (Storico WordPress vs Nuove Route Next.js)

Tutte le vecchie URL WordPress che ricevevano traffico sono state mappate e protette con redirect 301 in `src/proxy.ts`:
- `https://delpasqua.com/` (292 clic) -> Nuova Home Page Next.js
- `http://www.delpasqua.com/` (266 clic) -> Redirect canonico 308 verso apex HTTPS `https://delpasqua.com/`
- `https://delpasqua.com/acquista/` (43 clic) -> Mappato su `/shop/`
- `https://delpasqua.com/contatti/` (39 clic) -> Mappato su `/contatti/`
- `https://delpasqua.com/il-nostro-olio/` (20 clic) -> Mappato su `/produzione/`
- `https://delpasqua.com/product-category/magnifico/` (12 clic) -> Mappato su `/shop/`

---

## 3. Struttura del File Excel Aggiornato

Il file `delpasqua.com-Performance-on-Search-2026-11-09.xlsx` contiene:
1. **`Lancio Ufficiale`** *(Nuovo foglio in testa)*: Tabella con metadati ufficiali del lancio, data 08/11/2026, commit GitHub (`de4e3b1` e `b02a3b4`), deployment Vercel e metriche chiave di baseline.
2. **`Grafico`**: Serie temporale giornaliera di clic, impressioni, CTR e posizione media.
3. **`Query`**: 384 query tracciate con volumi e ranking.
4. **`Pagine`**: 46 landing page del vecchio sito con metadati di traffico.
5. **`Paesi`**: 83 paesi con sessioni organiche.
6. **`Dispositivi`**: Mobile vs Desktop vs Tablet.
7. **`Aspetto nella ricerca`**: Snippet prodotto.
8. **`Filtri`**: Contiene sia i filtri originari GSC che le righe di riferimento aggiunte per la data di analisi pre-lancio e primo commit di lancio.

---

## 4. Note Operative Post-Lancio

- Monitorare settimanalmente le oscillazioni su Google Search Console confrontando i dati con questa baseline.
- Monitorare l'indice delle sitemap su `https://delpasqua.com/sitemap.xml` per verificare la corretta sostituzione delle URL WordPress con le nuove rotte multilingua Next.js.
