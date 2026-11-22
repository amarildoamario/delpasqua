import { readGoogleMerchantFeed } from "@/lib/server/googleMerchantFeed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return new Response(await readGoogleMerchantFeed(), {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Impossibile generare il feed Google Merchant", error);
    return new Response("Feed temporaneamente non disponibile.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
