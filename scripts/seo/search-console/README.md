# Google Search Console

Tool locale in sola lettura per la proprietà `sc-domain:delpasqua.com`. Restituisce JSON e si può usare indipendentemente dal sito e dal database.

## Collegamento

1. Abilita la **Search Console API** nel progetto Google Cloud che userai per l’autenticazione. [Prerequisiti Google](https://developers.google.com/webmaster-tools/v1/prereqs)
2. Configura [Application Default Credentials](https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment) con lo scope `https://www.googleapis.com/auth/webmasters.readonly`, usando un’identità che ha accesso alla proprietà. Se usi un account di servizio, aggiungi il suo indirizzo in **Search Console → Impostazioni → Utenti e autorizzazioni** e indica il file delle credenziali con `GOOGLE_APPLICATION_CREDENTIALS`. Conserva il file fuori dal repository.
3. Per usare anche `vitals`, abilita **Chrome UX Report API** e configura una chiave limitata a quell’API. [Documentazione CrUX](https://developer.chrome.com/docs/crux/api)

Il file opzionale `.env.search-console.local` si trova nella radice del progetto ed è escluso da Git. Imposta solo le variabili necessarie alla tua configurazione.

```dotenv
SEARCH_CONSOLE_PROPERTY=sc-domain:delpasqua.com
# GOOGLE_APPLICATION_CREDENTIALS=C:/percorso/privato/credenziali-google.json
# CRUX_API_KEY=
```

Se usi una proprietà con prefisso URL, imposta il valore esatto riportato da `sites`, per esempio `https://delpasqua.com/`.

### Accesso senza chiave di servizio

Se l’organizzazione blocca le chiavi JSON permanenti, usa la [delegazione dell’account di servizio](https://docs.cloud.google.com/docs/authentication/use-service-account-impersonation). L’identità che avvia l’audit deve avere il ruolo **Service Account Token Creator** sul solo account di servizio e la **IAM Service Account Credentials API** deve essere abilitata. Per l’uso ricorrente puoi creare le credenziali locali con `gcloud auth application-default login --impersonate-service-account EMAIL_ACCOUNT_SERVIZIO`.

Per un audit singolo, imposta `SEARCH_CONSOLE_TOKEN_FILE` nella sessione corrente sul percorso del JSON restituito da [generateAccessToken](https://docs.cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/generateAccessToken). Richiedi lo scope `https://www.googleapis.com/auth/webmasters.readonly` e conserva il file fuori dal repository. Il comando usa il token fino alla scadenza indicata nel file.

## Comandi

```powershell
npm run seo:search-console -- sites
npm run seo:search-console -- sitemaps
npm run seo:search-console -- indexing
npm run seo:search-console -- inspect https://delpasqua.com/shop/evo/
npm run seo:search-console -- performance --from 2026-11-08 --to 2026-11-15 --by page --device mobile
npm run seo:search-console -- vitals
npm run seo:search-console -- vitals https://delpasqua.com/shop/evo/
```

`performance` restituisce clic, impressioni, CTR e posizione media dei risultati web, raggruppati secondo `--by`. Google usa date inclusive nel fuso del Pacifico e restituisce le righe principali, fino al limite indicato con `--limit`. `inspect` legge lo stato della versione già esaminata da Google, compreso il motivo di copertura e il canonical quando disponibili. [Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query) · [Controllo URL](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)

### Audit di indicizzazione del sito

`indexing` parte da `/sitemap.xml` sul sito pubblico, segue le sitemap secondarie e deduplica gli URL della proprietà. Per ogni URL chiede a Google lo stato di indicizzazione, il motivo, l’ultima scansione e i canonical, quando disponibili. Il JSON riporta anche l’esito complessivo per motivazione. Il perimetro sono gli URL pubblicati nelle sitemap, comprese le lingue. Alias storici e altri URL scoperti da Google restano nel report **Indicizzazione → Pagine**. [Report Indicizzazione delle pagine](https://support.google.com/webmasters/answer/7440203?hl=it)

```powershell
npm run --silent seo:search-console -- indexing > .\scratch\search-console-indexing.json
npm run seo:search-console -- indexing --limit 10
```

L’audit invia una richiesta per URL, fino a 2.000 per esecuzione, nel rispetto della quota disponibile per la proprietà. Se l’audit si ferma per un errore di accesso o di quota, conserva i risultati già ottenuti e indica `nextOffset` da passare con `--offset` alla ripresa. Usa lo stesso inventario della sitemap per riprendere per posizione. Gli errori sono indicati per URL e fanno terminare il comando con codice di uscita 1. [Quote della Search Console API](https://developers.google.com/webmaster-tools/limits)

### Core Web Vitals

`vitals` legge LCP, INP e CLS dal Chrome UX Report. Usa il traffico mobile per impostazione predefinita e restituisce la finestra di raccolta e il 75° percentile di ciascuna metrica disponibile. Senza argomenti legge l’origine; con un URL legge solo quell’indirizzo. `no_data` indica che CrUX non pubblica una misura per quella combinazione di indirizzo e dispositivo. [CrUX API](https://developer.chrome.com/docs/crux/api)

Per salvare solo il JSON usa `npm run --silent` e reindirizza l’output. I messaggi di stato vanno su stderr.

## Report LCP dei 151 URL

L’API pubblica di Search Console espone performance di ricerca, proprietà, sitemap e ispezione URL. La lista **Esempi** e i gruppi del report Core Web Vitals sono disponibili nella relativa schermata di Search Console. CrUX consente di misurare URL già noti o l’origine e può avere dati insufficienti per una singola pagina. Per incrociare i 151 URL con i template del sito, esporta gli esempi dal dettaglio del problema LCP. [Metodi della Search Console API](https://developers.google.com/webmaster-tools/v1/api_reference_index) · [Report Core Web Vitals](https://support.google.com/webmasters/answer/9205520)
