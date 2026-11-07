const sharp = require('sharp');
const fs = require('fs');
(async () => {
  const names = [...new Set(JSON.parse(fs.readFileSync('src/db/products.json', 'utf8')).filter(p => p.isPublished !== false).flatMap(p => [p.imageSrc, ...p.variants.map(v => v.imageSrc)]))];
  for (const name of names) {
    const { data, info } = await sharp(`public${name}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let left = info.width, top = info.height, right = 0, bottom = 0;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      if (data[i + 3] > 100 && Math.min(data[i], data[i+1], data[i+2]) < 205) {
        left = Math.min(left,x); right = Math.max(right,x); top = Math.min(top,y); bottom = Math.max(bottom,y);
      }
    }
    console.log(JSON.stringify({ name, width: info.width, height: info.height, bounds: [left, top, right+1, bottom+1] }));
  }
})();
