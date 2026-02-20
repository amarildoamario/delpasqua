import { redirect } from "next/navigation";

// La pagina /checkout non è usata: dal carrello si va direttamente a Stripe.
// Manteniamo questa route solo per evitare 404 su eventuali link vecchi.
export default function CheckoutRedirectPage() {
  redirect("/cart");
}
