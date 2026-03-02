import { readCatalog } from "@/lib/server/catalog";

export async function GET() {
  const products = await readCatalog();
  return Response.json(products, { headers: { "Cache-Control": "no-store" } });
}