const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const archive = 'archivio/immagini-prodotti/2026-11-07-evo';
const generated = 'C:/Users/Utente/.codex/generated_images/01a1b746-7e5f-7600-be9c-ca9127b6c891';

async function prepare(name, formats) {
  const source = path.join(generated, name);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, top = info.height, right = 0, bottom = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 8) {
        left = Math.min(left, x); top = Math.min(top, y);
        right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
    }
  }
  const product = await sharp(source)
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .resize({ width: 1160, height: 1560, fit: 'inside' }).png().toBuffer();
  const meta = await sharp(product).metadata();
  const output = await sharp({ create: { width: 1200, height: 1800, channels: 4, background: '#00000000' } })
    .composite([{ input: product, left: Math.round((1200 - meta.width) / 2), top: 1680 - meta.height }])
    .webp({ quality: 95, alphaQuality: 100 }).toBuffer();
  for (const format of formats) {
    const oldName = `EVO-latta-${format}.webp`;
    await fs.copyFile(path.join('public/products', oldName), path.join(archive, oldName));
    await fs.writeFile(`public/products/EVO-latta-${format}-v2.webp`, output);
  }
  await fs.copyFile(source, path.join(archive, name));
  console.log({ formats, bounds: [Math.round((1200 - meta.width) / 2), 1680 - meta.height, meta.width, meta.height], bytes: output.length });
}

(async () => {
  await fs.mkdir(archive, { recursive: true });
  await fs.copyFile('src/db/products.json', path.join(archive, 'products-prima.json'));
  await prepare('exec-f66a641c-b6b2-4949-9403-d0c3f3b94b83.png', ['750ml']);
  await prepare('exec-35f685cc-8f67-497b-8236-0397b3313f3c.png', ['1lt', '3lt', '5lt']);
})().catch(error => { console.error(error); process.exitCode = 1; });
