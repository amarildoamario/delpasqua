const fs = require('node:fs/promises');
const names = ['La Dama', 'Il Musico', 'Il Cavaliere'];
const ids = ['fruttato-leggero', 'fruttato-medio', 'fruttato-intenso'];
const profiles = {
  it: ['Fruttato Leggero', 'Fruttato Medio', 'Fruttato Intenso', 'Latta'],
  en: ['Light Fruity', 'Medium Fruity', 'Intense Fruity', 'Can'],
  de: ['Leichtfruchtig', 'Mittelfruchtig', 'Intensivfruchtig', 'Kanister'],
  nl: ['Licht Fruitig', 'Gemiddeld Fruitig', 'Intens Fruitig', 'Blik'],
  da: ['Let Frugtig', 'Medium Frugtig', 'Intens Frugtig', 'Dunk'],
  no: ['Lett Fruktig', 'Medium Fruktig', 'Intens Fruktig', 'Kanne'],
  es: ['Frutado Ligero', 'Frutado Medio', 'Frutado Intenso', 'Lata'],
  fr: ['Fruité Léger', 'Fruité Moyen', 'Fruité Intense', 'Bidon'],
};

(async () => {
  const catalog = JSON.parse(await fs.readFile('src/db/products.json', 'utf8'));
  for (const [locale, profile] of Object.entries(profiles)) {
    const file = `messages/${locale}.json`;
    const messages = JSON.parse(await fs.readFile(file, 'utf8'));
    ids.forEach((id, index) => {
      for (const key of [id, `${id}-latta`]) {
        const title = `${names[index]} - ${profile[index]}${key.endsWith('-latta') ? ` ${profile[3]}` : ''}`;
        messages.Products[key].title = title;
        if (locale === 'it') {
          const product = catalog.find(p => p.id === key);
          product.title = title;
          product.imageAlt = title;
          for (const variant of product.variants) {
            const size = { '500ml': '500 ml', '750ml': '750 ml', '1lt': '1 L', '3lt': '3 L', '5lt': '5 L' }[variant.id];
            variant.title = `${title} ${size}`;
            variant.imageAlt = variant.title;
          }
        }
      }
    });
    await fs.writeFile(file, JSON.stringify(messages, null, 4) + '\n');
  }
  await fs.writeFile('src/db/products.json', JSON.stringify(catalog, null, 2) + '\n');
})().catch(error => { console.error(error); process.exitCode = 1; });
