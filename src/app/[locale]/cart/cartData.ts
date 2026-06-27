export const cartStatusTemplates = {
  it: {
    lineReduced: "{title} aggiornato a {qty} per disponibilita limitata.",
    lineRemoved: "{title} rimosso dal carrello per esaurimento stock.",
    lineMigrated: "{title} aggiornato nel carrello dopo una modifica al catalogo.",
    invalidRemoved: "Un prodotto non piu disponibile e stato rimosso dal carrello.",
    addAdjusted: "{title}: disponibili solo {availableQty} pezzi. Aggiunti {addedQty}.",
    addRejected: "{title} non disponibile.",
  },
  en: {
    lineReduced: "{title} updated to {qty} because of limited stock.",
    lineRemoved: "{title} was removed from the cart because it is sold out.",
    lineMigrated: "{title} was updated in the cart after a catalog change.",
    invalidRemoved: "A product that is no longer available was removed from the cart.",
    addAdjusted: "{title}: only {availableQty} available. Added {addedQty}.",
    addRejected: "{title} is unavailable.",
  },
  de: {
    lineReduced: "{title} wurde wegen begrenztem Bestand auf {qty} angepasst.",
    lineRemoved: "{title} wurde aus dem Warenkorb entfernt, da es ausverkauft ist.",
    lineMigrated: "{title} wurde nach einer Katalogaenderung im Warenkorb aktualisiert.",
    invalidRemoved: "Ein nicht mehr verfuegbares Produkt wurde aus dem Warenkorb entfernt.",
    addAdjusted: "{title}: nur {availableQty} verfuegbar. {addedQty} hinzugefuegt.",
    addRejected: "{title} ist nicht verfuegbar.",
  },
  nl: {
    lineReduced: "{title} aangepast naar {qty} vanwege beperkte voorraad.",
    lineRemoved: "{title} is uit de winkelwagen verwijderd omdat het is uitverkocht.",
    lineMigrated: "{title} is na een cataloguswijziging bijgewerkt in de winkelwagen.",
    invalidRemoved: "Een product dat niet meer beschikbaar is, is uit de winkelwagen verwijderd.",
    addAdjusted: "{title}: nog maar {availableQty} beschikbaar. {addedQty} toegevoegd.",
    addRejected: "{title} is niet beschikbaar.",
  },
  da: {
    lineReduced: "{title} blev justeret til {qty} pga. begraenset lager.",
    lineRemoved: "{title} blev fjernet fra kurven, fordi varen er udsolgt.",
    lineMigrated: "{title} blev opdateret i kurven efter en katalogaendring.",
    invalidRemoved: "Et produkt, der ikke laengere er tilgaengeligt, blev fjernet fra kurven.",
    addAdjusted: "{title}: kun {availableQty} tilbage. {addedQty} tilfoejet.",
    addRejected: "{title} er ikke tilgaengelig.",
  },
  no: {
    lineReduced: "{title} ble justert til {qty} paa grunn av begrenset lager.",
    lineRemoved: "{title} ble fjernet fra handlekurven fordi varen er utsolgt.",
    lineMigrated: "{title} ble oppdatert i handlekurven etter en katalogendring.",
    invalidRemoved: "Et produkt som ikke lenger er tilgjengelig, ble fjernet fra handlekurven.",
    addAdjusted: "{title}: bare {availableQty} tilgjengelig. {addedQty} lagt til.",
    addRejected: "{title} er ikke tilgjengelig.",
  },
};

export const labels = {
  it: {
    shippingTitle: "Calcolo Spedizione Internazionale",
    shippingDesc: "Per spedizioni al di fuori dell'Italia, seleziona il paese e inserisci il CAP per calcolare i costi e sbloccare la cassa.",
    country: "Nazione di Destinazione",
    zipCode: "CAP / Codice Postale",
    zipPlaceholder: "Inserisci il CAP...",
    blockMessage: "Inserisci nazione e CAP per calcolare la spedizione e sbloccare il checkout.",
    zipError: "Inserisci un CAP valido.",
  },
  en: {
    shippingTitle: "Calculate International Shipping",
    shippingDesc: "For shipping outside Italy, please select your country and enter your ZIP code.",
    country: "Destination Country",
    zipCode: "ZIP / Postal Code",
    zipPlaceholder: "Enter ZIP code...",
    blockMessage: "Enter country and ZIP code to calculate shipping and unlock checkout.",
    zipError: "Please enter a valid ZIP code.",
  },
  de: {
    shippingTitle: "Internationalen Versand berechnen",
    shippingDesc: "Für den Versand außerhalb Italiens wählen Sie bitte Ihr Land aus und geben Sie Ihre Postleitzahl ein.",
    country: "Bestimmungsland",
    zipCode: "PLZ / Postleitzahl",
    zipPlaceholder: "PLZ eingeben...",
    blockMessage: "Geben Sie Land und PLZ ein, um den Versand zu berechnen und die Kasse freizugeben.",
    zipError: "Bitte geben Sie eine gültige PLZ ein.",
  },
  nl: {
    shippingTitle: "Internationale verzending berekenen",
    shippingDesc: "Selecteer uw land en voer uw postcode in voor verzending buiten Italië.",
    country: "Land van bestemming",
    zipCode: "Postcode",
    zipPlaceholder: "Postcode invoeren...",
    blockMessage: "Voer land en postcode in om de verzending te berekenen en het afrekenen te ontgrendelen.",
    zipError: "Voer een geldige postcode in.",
  },
  da: {
    shippingTitle: "Beregn international forsendelse",
    shippingDesc: "For forsendelse uden for Italien skal du vælge dit land og indtaste dit postnummer.",
    country: "Modtagerland",
    zipCode: "Postnummer",
    zipPlaceholder: "Indtast postnummer...",
    blockMessage: "Indtast land og postnummer for at beregne forsendelse og låse op for kassen.",
    zipError: "Indtast venligst et gyldigt postnummer.",
  },
  no: {
    shippingTitle: "Beregn internasjonal frakt",
    shippingDesc: "For frakt utenfor Italia, velg land og skriv inn postnummer.",
    country: "Destinasjonsland",
    zipCode: "Postnummer",
    zipPlaceholder: "Skriv inn postnummer...",
    blockMessage: "Skriv inn land og postnummer for å beregne frakt og låse opp kassen.",
    zipError: "Vennligst skriv inn et gyldig postnummer.",
  },
};

export const countries = [
  { code: "DE", flag: "de", name: { it: "Germania", en: "Germany", de: "Deutschland", nl: "Duitsland", da: "Tyskland", no: "Tyskland" } },
  { code: "NL", flag: "nl", name: { it: "Paesi Bassi", en: "Netherlands", de: "Niederlande", nl: "Nederland", da: "Nederlandene", no: "Nederland" } },
  { code: "DK", flag: "da", name: { it: "Danimarca", en: "Denmark", de: "Dänemark", nl: "Denemarken", da: "Danmark", no: "Danmark" } },
  { code: "NO", flag: "no", name: { it: "Norvegia", en: "Norway", de: "Norwegen", nl: "Noorwegen", da: "Norge", no: "Norge" } },
  { code: "US", flag: "us", name: { it: "Stati Uniti", en: "United States", de: "Vereinigte Staaten", nl: "Verenigde Staten", da: "USA", no: "USA" } },
  { code: "GB", flag: "en", name: { it: "Regno Unito (Inghilterra)", en: "United Kingdom", de: "Vereinigtes Königreich", nl: "Verenigd Koninkrijk", da: "Storbritannien", no: "Storbritannia" } },
  { code: "IT", flag: "it", name: { it: "Italia", en: "Italy", de: "Italien", nl: "Italië", da: "Italien", no: "Italia" } },
];

export type CartStatusTemplates = typeof cartStatusTemplates.it;
export type CartLabels = typeof labels.it;
export type CountryItem = { code: string; flag: string; name: string };
