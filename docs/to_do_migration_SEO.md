DELPASQUA.COM — TO-DO LIST ROUTING PRINCIPALE WORDPRESS -> VERCEL

Obiettivo:
spuntare ogni voce prima di collegare definitivamente delpasqua.com al progetto Vercel.

Aggiornamento Search Console del 2026-05-29:
- Dalla lista "Ultima scansione" condivisa il 2026-05-29 risulta che Google ha ancora scansionato di recente:
  - URL core corrette: `/`, `/il-nostro-olio/`, `/shop/`, `/contatti/`, `/produzione/`, `/storia/`, `/acquista/`
  - URL inglesi legacy/di transizione: `/en/storia/`, `/en/il-nostro-olio/`, `/en/produzione/`, `/en/contatti/`, `/en/acquista/`, `/en/privacy-policy/`, `/en/condizioni-generali-di-vendita/`
  - URL WordPress legacy prodotto: `/product/...`, `/en/product/...`
  - URL WordPress legacy portfolio/tag/category: `/portfolio-item/...`, `/en/portfolio-item/...`, `/portfolio-tag/...`, `/product-category/...`, `/en/portfolio-category/...`
  - URL parametrica legacy: `/shop/?add-to-cart=12018`
  - Asset PDF pubblico: `/wp-content/uploads/2025/03/Politica-Parita-di-Genere-Frantoio-Del-Pasqua-gen-20251.pdf`
- Interpretazione:
  - le scansioni tra il 5 aprile 2026 e il 21 maggio 2026 confermano che Google sta ancora seguendo parecchi segnali legacy WordPress
  - per molte di queste URL e` normale vedere nuove scansioni se i redirect 301 sono presenti
  - dove la URL legacy non e` desiderata, il focus non e` bloccare la scansione ma garantire `301`, canonical coerente, assenza dalla sitemap e nessuna linkatura interna

────────────────────────────────────
1. ROUTING ITALIANO PRINCIPALE
────────────────────────────────────

[✅ RISOLTO] Creare route Vercel per /

[✅ RISOLTO] Verificare che / risponda 200

[✅ RISOLTO] Verificare che / sia in italiano

[✅ RISOLTO] Verificare che / abbia canonical:
https://delpasqua.com/

[✅ RISOLTO] Verificare che / sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /storia/

[✅ RISOLTO] Verificare che /storia/ risponda 200

[✅ RISOLTO] Verificare che /storia/ abbia contenuto reale su storia, famiglia, frantoio, territorio

[✅ RISOLTO] Verificare che /storia/ non sia vuota o placeholder

[✅ RISOLTO] Verificare che /storia/ abbia canonical:
https://delpasqua.com/storia/

[✅ RISOLTO] Verificare che /storia/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /produzione/

[✅ RISOLTO] Verificare che /produzione/ risponda 200

[✅ RISOLTO] Verificare che /produzione/ parli di raccolta, lavorazione, frangitura, gramolazione, estrazione, stoccaggio e imbottigliamento

[✅ RISOLTO] Verificare che /produzione/ non abbia testi placeholder
    (Nota: placeholder rimossi dalla pagina /produzione/)

[✅ RISOLTO] Verificare che /produzione/ abbia canonical:
https://delpasqua.com/produzione/

[✅ RISOLTO] Verificare che /produzione/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /il-nostro-olio/

[✅ RISOLTO] Verificare che /il-nostro-olio/ risponda 200

[✅ RISOLTO] Verificare che /il-nostro-olio/ parli di olio EVO, qualità, fruttato medio, fruttato intenso, BIO, IGP e aromatici

[✅ RISOLTO] Verificare che /il-nostro-olio/ non sia una pagina generica debole

[✅ RISOLTO] Verificare che /il-nostro-olio/ abbia canonical:
https://delpasqua.com/il-nostro-olio/

[✅ RISOLTO] Verificare che /il-nostro-olio/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /shop/

[✅ RISOLTO] Verificare che /shop/ risponda 200

[✅ RISOLTO] Verificare che /shop/ sia in italiano

[✅ RISOLTO] Verificare che /shop/ mostri prodotti visibili lato HTML

[✅ RISOLTO] Verificare che ogni prodotto in /shop/ abbia nome, prezzo, immagine, descrizione breve e link

[✅ RISOLTO] Verificare che /shop/ non mandi automaticamente a /en/shop/

[✅ RISOLTO] Verificare che /shop/ abbia canonical:
https://delpasqua.com/shop/

[✅ RISOLTO] Verificare che /shop/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /acquista/

[✅ RISOLTO] Verificare che /acquista/ risponda 200

[✅ RISOLTO] Decidere se /acquista/ è pagina autonoma o pagina commerciale simile a /shop/
    (Nota: è una landing page di vendita autonoma che rimanda a /shop/)

[✅ RISOLTO] Se /acquista/ è autonoma, verificare canonical:
https://delpasqua.com/acquista/

[✅ RISOLTO] Se /acquista/ è duplicata dello shop, impostare canonical: (Saltato - autonoma)
https://delpasqua.com/shop/

[✅ RISOLTO] Se /acquista/ è autonoma e utile, inserirla in sitemap.xml

[✅ RISOLTO] Se /acquista/ è duplicata, non inserirla in sitemap.xml (Saltato - autonoma)

[✅ RISOLTO] Creare route Vercel per /contatti/

[✅ RISOLTO] Verificare che /contatti/ risponda 200

[✅ RISOLTO] Verificare che /contatti/ contenga indirizzo, telefono, email, form, mappa e dati aziendali

[✅ RISOLTO] Verificare che /contatti/ abbia canonical:
https://delpasqua.com/contatti/

[✅ RISOLTO] Verificare che /contatti/ sia presente in sitemap.xml

────────────────────────────────────
2. PAGINE LEGALI
────────────────────────────────────

[✅ RISOLTO] Creare route Vercel per /privacy-policy/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /privacy)

[✅ RISOLTO] Verificare che /privacy-policy/ risponda 200

[✅ RISOLTO] Verificare che /privacy-policy/ abbia contenuto reale e aggiornato
    (Nota: aggiornata con contenuto reale essenziale e dati aziendali gia presenti nel sito)

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/privacy-policy/

[✅ RISOLTO] Verificare che /privacy-policy/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /cookie-policy/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /cookie)

[✅ RISOLTO] Verificare che /cookie-policy/ risponda 200

[✅ RISOLTO] Verificare che /cookie-policy/ abbia contenuto reale e aggiornato
    (Nota: aggiornata con cookie e identificativi tecnici realmente usati dal sito)

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/cookie-policy/

[✅ RISOLTO] Verificare che /cookie-policy/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /condizioni-generali-di-vendita/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /termini)

[✅ RISOLTO] Verificare che /condizioni-generali-di-vendita/ risponda 200

[✅ RISOLTO] Verificare che contenga condizioni vendita, spedizione, pagamenti, resi, diritto di recesso e dati aziendali
    (Nota: aggiornata con contenuto reale essenziale, spedizioni e resi collegati)

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/condizioni-generali-di-vendita/

[✅ RISOLTO] Verificare che /condizioni-generali-di-vendita/ sia presente in sitemap.xml

────────────────────────────────────
3. PAGINE ECOMMERCE UTILITY — NOINDEX
────────────────────────────────────

[✅ RISOLTO] Creare route Vercel per /carrello/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /cart)

[✅ RISOLTO] Verificare che /carrello/ risponda 200

[✅ RISOLTO] Impostare noindex su /carrello/

[✅ RISOLTO] Verificare che /carrello/ NON sia in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /checkout/

[✅ RISOLTO] Verificare che /checkout/ risponda 200

[✅ RISOLTO] Impostare noindex su /checkout/

[✅ RISOLTO] Verificare che /checkout/ NON sia in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /my-account/

[✅ RISOLTO] Verificare che /my-account/ risponda 200

[✅ RISOLTO] Impostare noindex su /my-account/

[✅ RISOLTO] Verificare che /my-account/ NON sia in sitemap.xml

────────────────────────────────────
4. ROUTING INGLESE PRINCIPALE
────────────────────────────────────

[✅ RISOLTO] Creare route Vercel per /en/

[✅ RISOLTO] Verificare che /en/ risponda 200

[✅ RISOLTO] Verificare che /en/ sia davvero in inglese

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/en/

[✅ RISOLTO] Verificare che /en/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /en/shop/

[✅ RISOLTO] Verificare che /en/shop/ risponda 200

[✅ RISOLTO] Verificare che /en/shop/ sia davvero in inglese

[✅ RISOLTO] Verificare che /en/shop/ non contenga testi italiani

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/en/shop/

[✅ RISOLTO] Verificare che /en/shop/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /en/il-nostro-olio/

[✅ RISOLTO] Verificare che /en/il-nostro-olio/ risponda 200

[✅ RISOLTO] Verificare che /en/il-nostro-olio/ sia davvero in inglese

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/en/il-nostro-olio/

[✅ RISOLTO] Verificare che /en/il-nostro-olio/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /en/produzione/

[✅ RISOLTO] Verificare che /en/produzione/ risponda 200

[✅ RISOLTO] Verificare che /en/produzione/ sia davvero in inglese

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/en/produzione/

[✅ RISOLTO] Verificare che /en/produzione/ sia presente in sitemap.xml

[✅ RISOLTO] Creare route Vercel per /en/contatti/

[✅ RISOLTO] Verificare che /en/contatti/ risponda 200

[✅ RISOLTO] Verificare che /en/contatti/ sia davvero in inglese

[✅ RISOLTO] Verificare canonical:
https://delpasqua.com/en/contatti/

[✅ RISOLTO] Verificare che /en/contatti/ sia presente in sitemap.xml

────────────────────────────────────
5. GESTIONE /it
────────────────────────────────────

[✅ RISOLTO] Verificare se nel progetto esistono route /it/...

[✅ RISOLTO] Decidere che /it non è la struttura italiana principale finale

[✅ RISOLTO] Verificare che /it non sia presente nella sitemap finale

[✅ RISOLTO] Verificare che /it/shop non sia presente nella sitemap finale

[✅ RISOLTO] Verificare che /it/produzione non sia presente nella sitemap finale

[✅ RISOLTO] Verificare che /it/il-nostro-olio non sia presente nella sitemap finale

[✅ RISOLTO] Verificare che /it/contatti non sia presente nella sitemap finale

[✅ RISOLTO] Verificare che /it/degustazioni non sia presente nella sitemap finale

[✅ RISOLTO] Se /it resta accessibile, impostare redirect o canonical verso le root italiane

[✅ RISOLTO] /it -> /

[✅ RISOLTO] /it/shop -> /shop/

[✅ RISOLTO] /it/produzione -> /produzione/

[✅ RISOLTO] /it/il-nostro-olio -> /il-nostro-olio/

[✅ RISOLTO] /it/contatti -> /contatti/

[✅ RISOLTO] /it/degustazioni -> /degustazioni/

────────────────────────────────────
6. SITEMAP FINALE
────────────────────────────────────

[✅ RISOLTO] Creare sitemap.xml finale

[✅ RISOLTO] Inserire in sitemap.xml solo le pagine index

[✅ RISOLTO] Inserire /

[✅ RISOLTO] Inserire /storia/

[✅ RISOLTO] Inserire /produzione/

[✅ RISOLTO] Inserire /il-nostro-olio/

[✅ RISOLTO] Inserire /shop/

[✅ RISOLTO] Inserire /acquista/ solo se autonoma e non duplicata

[✅ RISOLTO] Inserire /contatti/

[✅ RISOLTO] Inserire /privacy-policy/

[✅ RISOLTO] Inserire /cookie-policy/

[✅ RISOLTO] Inserire /condizioni-generali-di-vendita/

[✅ RISOLTO] Inserire /en/

[✅ RISOLTO] Inserire /en/shop/

[✅ RISOLTO] Inserire /en/il-nostro-olio/

[✅ RISOLTO] Inserire /en/produzione/

[✅ RISOLTO] Inserire /en/contatti/

[✅ RISOLTO] Non inserire /carrello/

[✅ RISOLTO] Non inserire /checkout/

[✅ RISOLTO] Non inserire /my-account/

[✅ RISOLTO] Non inserire /it/...

[✅ RISOLTO] Non inserire /blog/

[✅ RISOLTO] Non inserire /blog/*

[✅ RISOLTO] Non inserire /category/*

[✅ RISOLTO] Non inserire /tag/*

[✅ RISOLTO] Non inserire /author/*

[✅ RISOLTO] Non inserire URL con parametri

[✅ RISOLTO] Non inserire filtri shop

[✅ RISOLTO] Non inserire pagine vuote

[✅ RISOLTO] Non inserire pagine placeholder

────────────────────────────────────
7. CONFRONTO AUTOMATICO WORDPRESS -> VERCEL
────────────────────────────────────

Vecchie URL WordPress core da verificare una per una:

[✅ RISOLTO] / deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /storia/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /produzione/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /il-nostro-olio/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /shop/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /acquista/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /contatti/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /privacy-policy/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /cookie-policy/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /condizioni-generali-di-vendita/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /en/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /en/shop/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /en/il-nostro-olio/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /en/produzione/ deve esistere su Vercel finale e rispondere 200

[✅ RISOLTO] /en/contatti/ deve esistere su Vercel finale e rispondere 200

Utility da verificare:

[✅ RISOLTO] /carrello/ deve esistere se serve alla UX

[✅ RISOLTO] /carrello/ deve avere noindex

[✅ RISOLTO] /carrello/ non deve essere in sitemap

[✅ RISOLTO] /checkout/ deve esistere se serve alla UX

[✅ RISOLTO] /checkout/ deve avere noindex

[✅ RISOLTO] /checkout/ non deve essere in sitemap

[✅ RISOLTO] /my-account/ deve esistere se serve alla UX

[✅ RISOLTO] /my-account/ deve avere noindex

[✅ RISOLTO] /my-account/ non deve essere in sitemap

────────────────────────────────────
8. CANONICAL
────────────────────────────────────

[✅ RISOLTO] / canonical corretto verso https://delpasqua.com/

[✅ RISOLTO] /storia/ canonical corretto verso https://delpasqua.com/storia/

[✅ RISOLTO] /produzione/ canonical corretto verso https://delpasqua.com/produzione/

[✅ RISOLTO] /il-nostro-olio/ canonical corretto verso https://delpasqua.com/il-nostro-olio/

[✅ RISOLTO] /shop/ canonical corretto verso https://delpasqua.com/shop/

[✅ RISOLTO] /contatti/ canonical corretto verso https://delpasqua.com/contatti/

[✅ RISOLTO] /privacy-policy/ canonical corretto verso https://delpasqua.com/privacy-policy/

[✅ RISOLTO] /cookie-policy/ canonical corretto verso https://delpasqua.com/cookie-policy/

[✅ RISOLTO] /condizioni-generali-di-vendita/ canonical corretto verso https://delpasqua.com/condizioni-generali-di-vendita/

[✅ RISOLTO] /en/ canonical corretto verso https://delpasqua.com/en/

[✅ RISOLTO] /en/shop/ canonical corretto verso https://delpasqua.com/en/shop/

[✅ RISOLTO] /en/il-nostro-olio/ canonical corretto verso https://delpasqua.com/en/il-nostro-olio/

[✅ RISOLTO] /en/produzione/ canonical corretto verso https://delpasqua.com/en/produzione/

[✅ RISOLTO] /en/contatti/ canonical corretto verso https://delpasqua.com/en/contatti/

[✅ RISOLTO] Nessuna pagina italiana principale deve avere canonical verso /it/...

[✅ RISOLTO] Nessuna pagina inglese deve avere canonical verso pagine italiane

────────────────────────────────────
9. HREFLANG
────────────────────────────────────

[✅ RISOLTO] Aggiungere hreflang tra / e /en/ se entrambe complete

[✅ RISOLTO] Aggiungere hreflang tra /shop/ e /en/shop/ se entrambe complete

[✅ RISOLTO] Aggiungere hreflang tra /produzione/ e /en/produzione/ se entrambe complete

[✅ RISOLTO] Aggiungere hreflang tra /il-nostro-olio/ e /en/il-nostro-olio/ se entrambe complete

[✅ RISOLTO] Aggiungere hreflang tra /contatti/ e /en/contatti/ se entrambe complete

[✅ RISOLTO] Non aggiungere hreflang a pagine inglesi incomplete

[✅ RISOLTO] Non aggiungere hreflang a pagine con lingua mista

[✅ RISOLTO] Verificare che ogni hreflang sia reciproco

[✅ RISOLTO] Inserire hreflang x-default dove sensato

────────────────────────────────────
10. ROBOTS.TXT
────────────────────────────────────

[✅ RISOLTO] Creare o aggiornare robots.txt

[✅ RISOLTO] Verificare che robots.txt non blocchi le pagine principali

[✅ RISOLTO] Verificare che robots.txt punti alla sitemap:
https://delpasqua.com/sitemap.xml

[✅ RISOLTO] Bloccare o gestire aree inutili se necessario

[✅ RISOLTO] Non bloccare CSS, JS o immagini necessarie al rendering

────────────────────────────────────
11. DOMINIO VERCEL.APP
────────────────────────────────────

[✅ RISOLTO] Verificare che delpasqua.vercel.app non venga indicizzato come duplicato
    (Nota: configurato l'invio dell'header X-Robots-Tag: noindex nel proxy middleware)

[✅ RISOLTO] Impostare canonical verso https://delpasqua.com sulle pagine pubbliche

[✅ RISOLTO] Valutare noindex sul dominio preview

[⏳ TODO] Valutare protezione ambiente preview

[⏳ TODO] Verificare che Google non indicizzi la versione .vercel.app dopo il go-live

────────────────────────────────────
12. CONTENUTO E PLACEHOLDER
────────────────────────────────────

[⏳ TODO] Rimuovere ogni testo placeholder
    (Nota: restano placeholder pubblici in /parita-di-genere/ e nella pagina /degustazioni/)

[✅ RISOLTO] Rimuovere “Spazio per raccontare…”
    (Nota: placeholder rimossi dalle sezioni descrittive di /produzione/)

[✅ RISOLTO] Rimuovere “Spazio per descrivere…”

[✅ RISOLTO] Rimuovere “Powered by Modern Tech”
    (Nota: rimosso dal Footer)

[✅ RISOLTO] Rimuovere riferimenti pubblici inutili a Next.js

[✅ RISOLTO] Rimuovere riferimenti pubblici inutili a React

[✅ RISOLTO] Rimuovere riferimenti pubblici inutili a TypeScript

[✅ RISOLTO] Rimuovere riferimenti pubblici inutili a Stripe
    (Nota: rimossi i riferimenti visibili lato utente nel carrello/checkout)

[✅ RISOLTO] Rimuovere riferimenti pubblici inutili a Vercel

[⏳ TODO] Verificare che tutte le recensioni mostrate siano vere

[⏳ TODO] Rimuovere recensioni finte o placeholder
    (Nota: HomeTrustAndReviews.tsx e' ancora popolato con recensioni hardcoded non definitive; da chiudere prima del go-live)

────────────────────────────────────
13. TITLE, META, H1
────────────────────────────────────

[✅ RISOLTO] / ha title unico

[✅ RISOLTO] / ha meta description unica

[✅ RISOLTO] / ha un solo H1

[✅ RISOLTO] /storia/ ha title unico

[✅ RISOLTO] /storia/ ha meta description unica

[✅ RISOLTO] /storia/ ha un solo H1

[✅ RISOLTO] /produzione/ ha title unico

[✅ RISOLTO] /produzione/ ha meta description unica

[✅ RISOLTO] /produzione/ ha un solo H1

[✅ RISOLTO] /il-nostro-olio/ ha title unico

[✅ RISOLTO] /il-nostro-olio/ ha meta description unica

[✅ RISOLTO] /il-nostro-olio/ ha un solo H1

[✅ RISOLTO] /shop/ ha title unico

[✅ RISOLTO] /shop/ ha meta description unica

[✅ RISOLTO] /shop/ ha un solo H1

[✅ RISOLTO] /acquista/ ha title unico se indicizzabile

[✅ RISOLTO] /acquista/ ha meta description unica se indicizzabile

[✅ RISOLTO] /contatti/ ha title unico

[✅ RISOLTO] /contatti/ ha meta description unica

[✅ RISOLTO] /contatti/ ha un solo H1

────────────────────────────────────
14. TEST FINALE PRE-GO-LIVE
────────────────────────────────────

[✅ RISOLTO] Eseguire crawl locale o staging delle route principali
    (Nota: 24/05/2026 - crawl locale eseguito su 15 route core, tutte 200)

[✅ RISOLTO] Verificare che nessuna route core risponda 404

[✅ RISOLTO] Verificare che nessuna route core risponda 500
    (Nota: 24/05/2026 - nessun 500 rilevato sul crawl locale)

[✅ RISOLTO] Verificare che nessuna route core abbia noindex per errore

[✅ RISOLTO] Verificare che nessuna route core manchi dalla sitemap

[✅ RISOLTO] Verificare che nessuna utility sia presente in sitemap

[✅ RISOLTO] Verificare che i link del menu puntino alle URL root italiane

[✅ RISOLTO] Verificare che i link italiani non vadano a /en/

[✅ RISOLTO] Verificare che i link inglesi restino sotto /en/

[✅ RISOLTO] Verificare che /shop/ non redirecti a /en/shop/

[✅ RISOLTO] Verificare che /en/shop/ non mostri testi italiani

[✅ RISOLTO] Verificare che tutte le immagini principali abbiano alt

[⏳ TODO] Verificare che il sito sia navigabile da mobile

[⏳ TODO] Verificare che il checkout funzioni

[⏳ TODO] Verificare che il form contatti funzioni

[✅ RISOLTO] Verificare che i pulsanti telefono/email funzionino

────────────────────────────────────
15. DOPO IL GO-LIVE
────────────────────────────────────

[⏳ TODO] Collegare dominio delpasqua.com a Vercel

[⏳ TODO] Verificare HTTPS attivo

[⏳ TODO] Verificare redirect www/non-www

[⏳ TODO] Scegliere una versione canonica:
https://delpasqua.com

[⏳ TODO] Verificare che http redirecti a https

[⏳ TODO] Verificare che www redirecti o canonicalizzi correttamente

[⏳ TODO] Inviare sitemap in Google Search Console

[⏳ TODO] Controllare copertura Search Console

[⏳ TODO] Controllare pagine 404

[⏳ TODO] Controllare pagine escluse

[⏳ TODO] Controllare canonical scelti da Google

[⏳ TODO] Controllare indicizzazione pagine principali

[⏳ TODO] Controllare query perse

[⏳ TODO] Controllare query nuove

[⏳ TODO] Non modificare continuamente le URL nelle prime settimane

────────────────────────────────────
16. DEFINIZIONE DI COMPLETATO
────────────────────────────────────

La fase routing principale è completata quando:

[✅ RISOLTO] Tutte le vecchie URL WordPress core rispondono 200 sul nuovo Vercel (Verificato con successo tramite SEO Suite Report)

[✅ RISOLTO] Le URL finali combaciano con quelle WordPress
    (Nota: URL core allineate a delpasqua.com; title e H1 non sono una copia letterale del WordPress attuale)

[✅ RISOLTO] La sitemap finale contiene solo le pagine core index

[✅ RISOLTO] Le utility ecommerce sono noindex

[✅ RISOLTO] Le pagine /it non competono con le root italiane

[✅ RISOLTO] Le pagine inglesi sono sotto /en

[⏳ TODO] Non ci sono testi placeholder

[✅ RISOLTO] Non ci sono link italiani che portano all’inglese

[✅ RISOLTO] Non ci sono canonical sbagliati verso /it

[✅ RISOLTO] Non ci sono 404 sulle pagine principali

[✅ RISOLTO] delpasqua.vercel.app non compete con delpasqua.com

[⏳ TODO] Google Search Console riceve correttamente la nuova sitemap
