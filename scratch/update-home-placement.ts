import { readFile, writeFile, utimes } from 'node:fs/promises';
import { prisma } from '../src/lib/server/prisma';

async function main() {
  const catalog = JSON.parse(await readFile('src/db/products.json', 'utf8'));
  const evoTin = catalog.find((p: { id: string }) => p.id === 'evo-latta');
  if (!evoTin?.variants.some((v: { id: string; sku: string }) => v.id === '750ml' && v.sku === 'EVO-L-750ML')) throw new Error('Missing EVO 750 ml can');
  console.log('Updating only home placement: EVO can → 3, Il Musico → 4.');
  await prisma.$transaction(async tx => {
    await tx.productMerch.upsert({
      where: { productKey: 'evo-latta' },
      create: { productKey: 'evo-latta', showInHome: true, homeRank: 3 },
      update: { showInHome: true, homeRank: 3 },
    });
    await tx.productMerch.update({ where: { productKey: 'fruttato-medio' }, data: { showInHome: true, homeRank: 4 } });
  });
  const placement = await prisma.productMerch.findMany({ where: { showInHome: true }, orderBy: { homeRank: 'asc' }, select: { productKey: true, homeRank: true, showInHome: true } });
  await writeFile('archivio/immagini-prodotti/2026-11-07-catalogo/home-database-dopo.json', JSON.stringify(placement, null, 2));
  // A direct maintenance write has no Next.js request context for revalidateTag.
  // Advance the catalog revision consumed by the existing server caches.
  const now = new Date();
  await utimes('src/db/products.json', now, now);
  console.log(placement);
}

main().finally(() => prisma.$disconnect());
