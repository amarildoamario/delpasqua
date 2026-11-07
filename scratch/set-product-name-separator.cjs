const fs = require('node:fs');
const files = ['src/db/products.json', ...fs.readdirSync('messages').filter(name => name.endsWith('.json')).map(name => 'messages/' + name), 'docs/immagini-prodotti.md', 'scratch/verify-shop-ux.cjs'];
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = before.replace(/(La Dama|Il Musico|Il Cavaliere)\s*(?:[-\u00b7]\s*)+/g, (_, name) => `${name} - `);
  if (after !== before) fs.writeFileSync(file, after);
  if (file.endsWith('.json')) JSON.parse(after);
}
const catalog = JSON.parse(fs.readFileSync('src/db/products.json', 'utf8'));
for (const product of catalog.filter(p => p.id.startsWith('fruttato'))) {
  for (const item of [product, ...product.variants]) {
    if (!item.title.includes(' - ') || item.title.includes('\u00b7')) throw Error('Separator mismatch');
  }
}
(async () => {
  const products = await (await fetch('http://localhost:3000/api/products/')).json();
  const oils = products.filter(p => p.id.startsWith('fruttato'));
  if (oils.some(p => p.title.includes('\u00b7') || !p.title.includes(' - '))) throw Error('API separator mismatch');
  console.log(oils.map(p => p.title).join('\n'));
})();
