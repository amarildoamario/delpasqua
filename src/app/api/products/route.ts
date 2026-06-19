import { readPublicCatalogWithMerch } from "@/lib/server/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await readPublicCatalogWithMerch();
  return Response.json(products, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
