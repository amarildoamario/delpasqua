import { makeInventorySku } from "@/lib/inventorySku";
import { convertStorefrontCents, storefrontCurrency } from "@/lib/money";
import { getProductAlternateUrls, SITE_NAME, SITE_URL } from "@/lib/seo";
import { filterSeoCatalog, readCatalogWithMerch } from "@/lib/server/catalog";
import { getAvailabilityBySkus } from "@/lib/server/inventoryRead";

const CURRENCY = storefrontCurrency("it");
const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => XML_ENTITIES[character]);
}

export async function readGoogleMerchantFeed() {
  const products = filterSeoCatalog(await readCatalogWithMerch());
  const skus = products.flatMap((product) =>
    product.variants.map((variant) => makeInventorySku(product.id, variant.id, variant.sku)),
  );
  const availability = await getAvailabilityBySkus(skus);

  const items = products.flatMap((product) => {
    const productUrl = getProductAlternateUrls(product).it;
    const productTitle = product.title?.trim();
    const isWine = product.category?.trim().toLowerCase() === "vino";

    return product.variants.flatMap((variant) => {
      const { priceCents } = variant;
      const label = variant.label?.trim();
      const title = variant.title?.trim() || [productTitle, label].filter(Boolean).join(" ");
      const description = variant.description?.trim() || product.description?.trim();
      const imageSrc = variant.imageSrc?.trim() || product.imageSrc?.trim();
      if (!title || !description || !imageSrc || !priceCents || !Number.isSafeInteger(priceCents) || priceCents < 0) {
        return [];
      }

      const sku = makeInventorySku(product.id, variant.id, variant.sku);
      const link = new URL(productUrl);
      link.searchParams.set("v", variant.id);
      const fields: Record<string, string> = {
        id: sku,
        title: title.slice(0, 150),
        description: description.slice(0, 5000),
        link: link.href,
        image_link: new URL(imageSrc, SITE_URL).href,
        price: `${(convertStorefrontCents(priceCents, "it") / 100).toFixed(2)} ${CURRENCY}`,
        availability: availability[sku] > 0 ? "in_stock" : "out_of_stock",
        condition: "new",
        brand: SITE_NAME,
      };

      const volume = label?.match(/\b(\d+(?:[.,]\d+)?)\s*(ml|cl|lt|l)\b/i)
        ?? variant.id.match(/^(\d+(?:[.,]\d+)?)(ml|cl|lt|l)$/i);
      if (volume && Number(volume[1].replace(",", ".")) > 0) {
        const unit = volume[2].toLowerCase();
        fields.unit_pricing_measure = `${volume[1].replace(",", ".")}${unit === "lt" ? "l" : unit}`;
        fields.unit_pricing_base_measure = "1l";
      }

      if (isWine) fields.google_product_category = "499676";
      if (product.variants.length > 1 && productTitle && label) {
        fields.item_group_id = product.id;
        fields.item_group_title = productTitle;
        fields.size = label;
      }

      const attributes = Object.entries(fields)
        .map(([name, value]) => `      <g:${name}>${escapeXml(value)}</g:${name}>`)
        .join("\n");
      return [`    <item>\n${attributes}\n    </item>`];
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>Catalogo prodotti per l’Italia</description>
${items.join("\n")}
  </channel>
</rss>
`;
}
