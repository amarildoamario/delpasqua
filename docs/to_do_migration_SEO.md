DELPASQUA.COM — TO-DO LIST ROUTING PRINCIPALE WORDPRESS -> VERCEL

Obiettivo:
spuntare ogni voce prima di collegare definitivamente delpasqua.com al progetto Vercel.

────────────────────────────────────
1. ROUTING ITALIANO PRINCIPALE
────────────────────────────────────

[x] Creare route Vercel per /

[x] Verificare che / risponda 200

[x] Verificare che / sia in italiano

[x] Verificare che / abbia canonical:
https://delpasqua.com/

[x] Verificare che / sia presente in sitemap.xml

[x] Creare route Vercel per /storia/

[x] Verificare che /storia/ risponda 200

[x] Verificare che /storia/ abbia contenuto reale su storia, famiglia, frantoio, territorio

[x] Verificare che /storia/ non sia vuota o placeholder

[x] Verificare che /storia/ abbia canonical:
https://delpasqua.com/storia/

[x] Verificare che /storia/ sia presente in sitemap.xml

[x] Creare route Vercel per /produzione/

[x] Verificare che /produzione/ risponda 200

[x] Verificare che /produzione/ parli di raccolta, lavorazione, frangitura, gramolazione, estrazione, stoccaggio e imbottigliamento

[x] Verificare che /produzione/ non abbia testi placeholder
    (Nota: placeholder rimossi dalla pagina /produzione/)

[x] Verificare che /produzione/ abbia canonical:
https://delpasqua.com/produzione/

[x] Verificare che /produzione/ sia presente in sitemap.xml

[x] Creare route Vercel per /il-nostro-olio/

[x] Verificare che /il-nostro-olio/ risponda 200

[x] Verificare che /il-nostro-olio/ parli di olio EVO, qualità, fruttato medio, fruttato intenso, BIO, IGP e aromatici

[x] Verificare che /il-nostro-olio/ non sia una pagina generica debole

[x] Verificare che /il-nostro-olio/ abbia canonical:
https://delpasqua.com/il-nostro-olio/

[x] Verificare che /il-nostro-olio/ sia presente in sitemap.xml

[x] Creare route Vercel per /shop/

[x] Verificare che /shop/ risponda 200

[x] Verificare che /shop/ sia in italiano

[x] Verificare che /shop/ mostri prodotti visibili lato HTML

[x] Verificare che ogni prodotto in /shop/ abbia nome, prezzo, immagine, descrizione breve e link

[x] Verificare che /shop/ non mandi automaticamente a /en/shop/

[x] Verificare che /shop/ abbia canonical:
https://delpasqua.com/shop/

[x] Verificare che /shop/ sia presente in sitemap.xml

[x] Creare route Vercel per /acquista/

[x] Verificare che /acquista/ risponda 200

[x] Decidere se /acquista/ è pagina autonoma o pagina commerciale simile a /shop/
    (Nota: è una landing page di vendita autonoma che rimanda a /shop/)

[x] Se /acquista/ è autonoma, verificare canonical:
https://delpasqua.com/acquista/

[ ] Se /acquista/ è duplicata dello shop, impostare canonical:
https://delpasqua.com/shop/

[x] Se /acquista/ è autonoma e utile, inserirla in sitemap.xml

[ ] Se /acquista/ è duplicata, non inserirla in sitemap.xml

[x] Creare route Vercel per /contatti/

[x] Verificare che /contatti/ risponda 200

[x] Verificare che /contatti/ contenga indirizzo, telefono, email, form, mappa e dati aziendali

[x] Verificare che /contatti/ abbia canonical:
https://delpasqua.com/contatti/

[x] Verificare che /contatti/ sia presente in sitemap.xml

────────────────────────────────────
2. PAGINE LEGALI
────────────────────────────────────

[x] Creare route Vercel per /privacy-policy/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /privacy)

[x] Verificare che /privacy-policy/ risponda 200

[x] Verificare che /privacy-policy/ abbia contenuto reale e aggiornato
    (Nota: aggiornata con contenuto reale essenziale e dati aziendali gia presenti nel sito)

[x] Verificare canonical:
https://delpasqua.com/privacy-policy/

[x] Verificare che /privacy-policy/ sia presente in sitemap.xml

[x] Creare route Vercel per /cookie-policy/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /cookie)

[x] Verificare che /cookie-policy/ risponda 200

[x] Verificare che /cookie-policy/ abbia contenuto reale e aggiornato
    (Nota: aggiornata con cookie e identificativi tecnici realmente usati dal sito)

[x] Verificare canonical:
https://delpasqua.com/cookie-policy/

[x] Verificare che /cookie-policy/ sia presente in sitemap.xml

[x] Creare route Vercel per /condizioni-generali-di-vendita/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /termini)

[x] Verificare che /condizioni-generali-di-vendita/ risponda 200

[x] Verificare che contenga condizioni vendita, spedizione, pagamenti, resi, diritto di recesso e dati aziendali
    (Nota: aggiornata con contenuto reale essenziale, spedizioni e resi collegati)

[x] Verificare canonical:
https://delpasqua.com/condizioni-generali-di-vendita/

[x] Verificare che /condizioni-generali-di-vendita/ sia presente in sitemap.xml

────────────────────────────────────
3. PAGINE ECOMMERCE UTILITY — NOINDEX
────────────────────────────────────

[x] Creare route Vercel per /carrello/
    (Nota: servita dinamicamente tramite alias next-intl su cartella /cart)

[x] Verificare che /carrello/ risponda 200

[x] Impostare noindex su /carrello/

[x] Verificare che /carrello/ NON sia in sitemap.xml

[x] Creare route Vercel per /checkout/

[x] Verificare che /checkout/ risponda 200

[x] Impostare noindex su /checkout/

[x] Verificare che /checkout/ NON sia in sitemap.xml

[x] Creare route Vercel per /my-account/

[x] Verificare che /my-account/ risponda 200

[x] Impostare noindex su /my-account/

[x] Verificare che /my-account/ NON sia in sitemap.xml

────────────────────────────────────
4. ROUTING INGLESE PRINCIPALE
────────────────────────────────────

[x] Creare route Vercel per /en/

[x] Verificare che /en/ risponda 200

[x] Verificare che /en/ sia davvero in inglese

[x] Verificare canonical:
https://delpasqua.com/en/

[x] Verificare che /en/ sia presente in sitemap.xml

[x] Creare route Vercel per /en/shop/

[x] Verificare che /en/shop/ risponda 200

[x] Verificare che /en/shop/ sia davvero in inglese

[x] Verificare che /en/shop/ non contenga testi italiani

[x] Verificare canonical:
https://delpasqua.com/en/shop/

[x] Verificare che /en/shop/ sia presente in sitemap.xml

[x] Creare route Vercel per /en/il-nostro-olio/

[x] Verificare che /en/il-nostro-olio/ risponda 200

[x] Verificare che /en/il-nostro-olio/ sia davvero in inglese

[x] Verificare canonical:
https://delpasqua.com/en/il-nostro-olio/

[x] Verificare che /en/il-nostro-olio/ sia presente in sitemap.xml

[x] Creare route Vercel per /en/produzione/

[x] Verificare che /en/produzione/ risponda 200

[x] Verificare che /en/produzione/ sia davvero in inglese

[x] Verificare canonical:
https://delpasqua.com/en/produzione/

[x] Verificare che /en/produzione/ sia presente in sitemap.xml

[x] Creare route Vercel per /en/contatti/

[x] Verificare che /en/contatti/ risponda 200

[x] Verificare che /en/contatti/ sia davvero in inglese

[x] Verificare canonical:
https://delpasqua.com/en/contatti/

[x] Verificare che /en/contatti/ sia presente in sitemap.xml

────────────────────────────────────
5. GESTIONE /it
────────────────────────────────────

[x] Verificare se nel progetto esistono route /it/...

[x] Decidere che /it non è la struttura italiana principale finale

[x] Verificare che /it non sia presente nella sitemap finale

[x] Verificare che /it/shop non sia presente nella sitemap finale

[x] Verificare che /it/produzione non sia presente nella sitemap finale

[x] Verificare che /it/il-nostro-olio non sia presente nella sitemap finale

[x] Verificare che /it/contatti non sia presente nella sitemap finale

[x] Verificare che /it/degustazioni non sia presente nella sitemap finale

[x] Se /it resta accessibile, impostare redirect o canonical verso le root italiane

[x] /it -> /

[x] /it/shop -> /shop/

[x] /it/produzione -> /produzione/

[x] /it/il-nostro-olio -> /il-nostro-olio/

[x] /it/contatti -> /contatti/

[x] /it/degustazioni -> /degustazioni/

────────────────────────────────────
6. SITEMAP FINALE
────────────────────────────────────

[x] Creare sitemap.xml finale

[x] Inserire in sitemap.xml solo le pagine index

[x] Inserire /

[x] Inserire /storia/

[x] Inserire /produzione/

[x] Inserire /il-nostro-olio/

[x] Inserire /shop/

[x] Inserire /acquista/ solo se autonoma e non duplicata

[x] Inserire /contatti/

[x] Inserire /privacy-policy/

[x] Inserire /cookie-policy/

[x] Inserire /condizioni-generali-di-vendita/

[x] Inserire /en/

[x] Inserire /en/shop/

[x] Inserire /en/il-nostro-olio/

[x] Inserire /en/produzione/

[x] Inserire /en/contatti/

[x] Non inserire /carrello/

[x] Non inserire /checkout/

[x] Non inserire /my-account/

[x] Non inserire /it/...

[x] Non inserire /blog/

[x] Non inserire /blog/*

[x] Non inserire /category/*

[x] Non inserire /tag/*

[x] Non inserire /author/*

[x] Non inserire URL con parametri

[x] Non inserire filtri shop

[x] Non inserire pagine vuote

[x] Non inserire pagine placeholder

────────────────────────────────────
7. CONFRONTO AUTOMATICO WORDPRESS -> VERCEL
────────────────────────────────────

Vecchie URL WordPress core da verificare una per una:

[x] / deve esistere su Vercel finale e rispondere 200

[x] /storia/ deve esistere su Vercel finale e rispondere 200

[x] /produzione/ deve esistere su Vercel finale e rispondere 200

[x] /il-nostro-olio/ deve esistere su Vercel finale e rispondere 200

[x] /shop/ deve esistere su Vercel finale e rispondere 200

[x] /acquista/ deve esistere su Vercel finale e rispondere 200

[x] /contatti/ deve esistere su Vercel finale e rispondere 200

[x] /privacy-policy/ deve esistere su Vercel finale e rispondere 200

[x] /cookie-policy/ deve esistere su Vercel finale e rispondere 200

[x] /condizioni-generali-di-vendita/ deve esistere su Vercel finale e rispondere 200

[x] /en/ deve esistere su Vercel finale e rispondere 200

[x] /en/shop/ deve esistere su Vercel finale e rispondere 200

[x] /en/il-nostro-olio/ deve esistere su Vercel finale e rispondere 200

[x] /en/produzione/ deve esistere su Vercel finale e rispondere 200

[x] /en/contatti/ deve esistere su Vercel finale e rispondere 200

Utility da verificare:

[x] /carrello/ deve esistere se serve alla UX

[x] /carrello/ deve avere noindex

[x] /carrello/ non deve essere in sitemap

[x] /checkout/ deve esistere se serve alla UX

[x] /checkout/ deve avere noindex

[x] /checkout/ non deve essere in sitemap

[x] /my-account/ deve esistere se serve alla UX

[x] /my-account/ deve avere noindex

[x] /my-account/ non deve essere in sitemap

────────────────────────────────────
8. CANONICAL
────────────────────────────────────

[x] / canonical corretto verso https://delpasqua.com/

[x] /storia/ canonical corretto verso https://delpasqua.com/storia/

[x] /produzione/ canonical corretto verso https://delpasqua.com/produzione/

[x] /il-nostro-olio/ canonical corretto verso https://delpasqua.com/il-nostro-olio/

[x] /shop/ canonical corretto verso https://delpasqua.com/shop/

[x] /contatti/ canonical corretto verso https://delpasqua.com/contatti/

[x] /privacy-policy/ canonical corretto verso https://delpasqua.com/privacy-policy/

[x] /cookie-policy/ canonical corretto verso https://delpasqua.com/cookie-policy/

[x] /condizioni-generali-di-vendita/ canonical corretto verso https://delpasqua.com/condizioni-generali-di-vendita/

[x] /en/ canonical corretto verso https://delpasqua.com/en/

[x] /en/shop/ canonical corretto verso https://delpasqua.com/en/shop/

[x] /en/il-nostro-olio/ canonical corretto verso https://delpasqua.com/en/il-nostro-olio/

[x] /en/produzione/ canonical corretto verso https://delpasqua.com/en/produzione/

[x] /en/contatti/ canonical corretto verso https://delpasqua.com/en/contatti/

[x] Nessuna pagina italiana principale deve avere canonical verso /it/...

[x] Nessuna pagina inglese deve avere canonical verso pagine italiane

────────────────────────────────────
9. HREFLANG
────────────────────────────────────

[x] Aggiungere hreflang tra / e /en/ se entrambe complete

[x] Aggiungere hreflang tra /shop/ e /en/shop/ se entrambe complete

[x] Aggiungere hreflang tra /produzione/ e /en/produzione/ se entrambe complete

[x] Aggiungere hreflang tra /il-nostro-olio/ e /en/il-nostro-olio/ se entrambe complete

[x] Aggiungere hreflang tra /contatti/ e /en/contatti/ se entrambe complete

[x] Non aggiungere hreflang a pagine inglesi incomplete

[x] Non aggiungere hreflang a pagine con lingua mista

[x] Verificare che ogni hreflang sia reciproco

[x] Inserire hreflang x-default dove sensato

────────────────────────────────────
10. ROBOTS.TXT
────────────────────────────────────

[x] Creare o aggiornare robots.txt

[x] Verificare che robots.txt non blocchi le pagine principali

[x] Verificare che robots.txt punti alla sitemap:
https://delpasqua.com/sitemap.xml

[x] Bloccare o gestire aree inutili se necessario

[x] Non bloccare CSS, JS o immagini necessarie al rendering

────────────────────────────────────
11. DOMINIO VERCEL.APP
────────────────────────────────────

[x] Verificare che delpasqua.vercel.app non venga indicizzato come duplicato
    (Nota: configurato l'invio dell'header X-Robots-Tag: noindex nel proxy middleware)

[x] Impostare canonical verso https://delpasqua.com sulle pagine pubbliche

[x] Valutare noindex sul dominio preview

[ ] Valutare protezione ambiente preview

[ ] Verificare che Google non indicizzi la versione .vercel.app dopo il go-live

────────────────────────────────────
12. CONTENUTO E PLACEHOLDER
────────────────────────────────────

[ ] Rimuovere ogni testo placeholder
    (Nota: restano placeholder pubblici in /parita-di-genere/ e nella pagina /degustazioni/)

[x] Rimuovere “Spazio per raccontare…”
    (Nota: placeholder rimossi dalle sezioni descrittive di /produzione/)

[x] Rimuovere “Spazio per descrivere…”

[x] Rimuovere “Powered by Modern Tech”
    (Nota: rimosso dal Footer)

[x] Rimuovere riferimenti pubblici inutili a Next.js

[x] Rimuovere riferimenti pubblici inutili a React

[x] Rimuovere riferimenti pubblici inutili a TypeScript

[x] Rimuovere riferimenti pubblici inutili a Stripe
    (Nota: rimossi i riferimenti visibili lato utente nel carrello/checkout)

[x] Rimuovere riferimenti pubblici inutili a Vercel

[ ] Verificare che tutte le recensioni mostrate siano vere

[ ] Rimuovere recensioni finte o placeholder
    (Nota: HomeTrustAndReviews.tsx e' ancora popolato con recensioni hardcoded non definitive; da chiudere prima del go-live)

────────────────────────────────────
13. TITLE, META, H1
────────────────────────────────────

[x] / ha title unico

[x] / ha meta description unica

[x] / ha un solo H1

[x] /storia/ ha title unico

[x] /storia/ ha meta description unica

[x] /storia/ ha un solo H1

[x] /produzione/ ha title unico

[x] /produzione/ ha meta description unica

[x] /produzione/ ha un solo H1

[x] /il-nostro-olio/ ha title unico

[x] /il-nostro-olio/ ha meta description unica

[x] /il-nostro-olio/ ha un solo H1

[x] /shop/ ha title unico

[x] /shop/ ha meta description unica

[x] /shop/ ha un solo H1

[x] /acquista/ ha title unico se indicizzabile

[x] /acquista/ ha meta description unica se indicizzabile

[x] /contatti/ ha title unico

[x] /contatti/ ha meta description unica

[x] /contatti/ ha un solo H1

────────────────────────────────────
14. TEST FINALE PRE-GO-LIVE
────────────────────────────────────

[x] Eseguire crawl locale o staging delle route principali
    (Nota: 24/05/2026 - crawl locale eseguito su 15 route core, tutte 200)

[x] Verificare che nessuna route core risponda 404

[x] Verificare che nessuna route core risponda 500
    (Nota: 24/05/2026 - nessun 500 rilevato sul crawl locale)

[x] Verificare che nessuna route core abbia noindex per errore

[x] Verificare che nessuna route core manchi dalla sitemap

[x] Verificare che nessuna utility sia presente in sitemap

[x] Verificare che i link del menu puntino alle URL root italiane

[x] Verificare che i link italiani non vadano a /en/

[x] Verificare che i link inglesi restino sotto /en/

[x] Verificare che /shop/ non redirecti a /en/shop/

[x] Verificare che /en/shop/ non mostri testi italiani

[x] Verificare che tutte le immagini principali abbiano alt

[ ] Verificare che il sito sia navigabile da mobile

[ ] Verificare che il checkout funzioni

[ ] Verificare che il form contatti funzioni

[x] Verificare che i pulsanti telefono/email funzionino

────────────────────────────────────
15. DOPO IL GO-LIVE
────────────────────────────────────

[ ] Collegare dominio delpasqua.com a Vercel

[ ] Verificare HTTPS attivo

[ ] Verificare redirect www/non-www

[ ] Scegliere una versione canonica:
https://delpasqua.com

[ ] Verificare che http redirecti a https

[ ] Verificare che www redirecti o canonicalizzi correttamente

[ ] Inviare sitemap in Google Search Console

[ ] Controllare copertura Search Console

[ ] Controllare pagine 404

[ ] Controllare pagine escluse

[ ] Controllare canonical scelti da Google

[ ] Controllare indicizzazione pagine principali

[ ] Controllare query perse

[ ] Controllare query nuove

[ ] Non modificare continuamente le URL nelle prime settimane

────────────────────────────────────
16. DEFINIZIONE DI COMPLETATO
────────────────────────────────────

La fase routing principale è completata quando:

[ ] Tutte le vecchie URL WordPress core rispondono 200 sul nuovo Vercel

[x] Le URL finali combaciano con quelle WordPress
    (Nota: URL core allineate a delpasqua.com; title e H1 non sono una copia letterale del WordPress attuale)

[x] La sitemap finale contiene solo le pagine core index

[x] Le utility ecommerce sono noindex

[x] Le pagine /it non competono con le root italiane

[x] Le pagine inglesi sono sotto /en

[ ] Non ci sono testi placeholder

[x] Non ci sono link italiani che portano all’inglese

[x] Non ci sono canonical sbagliati verso /it

[x] Non ci sono 404 sulle pagine principali

[x] delpasqua.vercel.app non compete con delpasqua.com

[ ] Google Search Console riceve correttamente la nuova sitemap
