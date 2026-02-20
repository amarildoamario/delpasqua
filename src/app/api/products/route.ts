import products from "@/db/products.json";

export async function GET() {
  return Response.json(products, { headers: { "Cache-Control": "no-store" } });
}

