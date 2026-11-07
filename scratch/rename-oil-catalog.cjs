const fs = require('node:fs/promises');
const archive = 'archivio/immagini-prodotti/2026-11-07-catalogo';
const brands = { 'fruttato-leggero': 'La Dama', 'fruttato-medio': 'Il Musico', 'fruttato-intenso': 'Il Cavaliere' };
const profiles = { 'fruttato-leggero': 'Fruttato Leggero', 'fruttato-medio': 'Fruttato Medio', 'fruttato-intenso': 'Fruttato Intenso' };
const canLabels = { it: 'Latta', en: 'Can', de: 'Kanister', nl: 'Blik', da: 'Dunk', no: 'Kanne', es: 'Lata', fr: 'Bidon' };

(async () => {
  await fs.mkdir(archive, { recursive: true });
  const raw = await fs.readFile('src/db/products.json', 'utf8');
  await fs.writeFile(`${archive}/catalogo-prima-rinomina.json`, raw);
  const products = JSON.parse(raw);
  for (const product of products) {
    const family = Object.keys(brands).find(id => product.id === id || product.id === `${id}-latta`);
    if (!family) continue;
    const name = brands[family];
    const can = product.id.endsWith('-latta');
    const title = name + (can ? ' Latta' : '');
    const replaceName = text => text?.replaceAll(`Il ${profiles[family]}`, name).replaceAll(profiles[family], name);
    product.title = title;
    product.imageAlt = title;
    product.description = replaceName(product.description);
    for (const variant of product.variants) {
      const size = { '500ml': '500 ml', '750ml': '750 ml', '1lt': '1 L', '3lt': '3 L', '5lt': '5 L' }[variant.id];
      variant.title = `${title} ${size}`;
      variant.imageAlt = `${title} ${size}`;
      variant.description = replaceName(variant.description);
    }
  }
  products.find(p => p.id === 'evo-latta').homeVariantId = '750ml';
  await fs.writeFile('src/db/products.json', JSON.stringify(products, null, 2) + '\n');
  for (const [locale, canLabel] of Object.entries(canLabels)) {
    const file = `messages/${locale}.json`;
    const original = await fs.readFile(file, 'utf8');
    await fs.writeFile(`${archive}/messages-${locale}-prima.json`, original);
    const messages = JSON.parse(original);
    for (const [id, name] of Object.entries(brands)) {
      messages.Products[id].title = name;
      messages.Products[`${id}-latta`].title = `${name} ${canLabel}`;
      if (locale === 'it') {
        for (const productId of [id, `${id}-latta`]) {
          const copy = messages.Products[productId];
          const replaceName = text => text.replaceAll(`Il ${profiles[id]}`, name).replaceAll(profiles[id], name);
          copy.description = replaceName(copy.description);
          for (const key of Object.keys(copy.variantDescriptions ?? {})) copy.variantDescriptions[key] = replaceName(copy.variantDescriptions[key]);
        }
      }
    }
    await fs.writeFile(file, JSON.stringify(messages, null, 4) + '\n');
  }
  console.log('Updated six oil products, their variant titles and all eight translation files. Operational IDs and SKUs preserved.');
})().catch(error => { console.error(error); process.exitCode = 1; });
