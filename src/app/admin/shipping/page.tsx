import { redirect } from "next/navigation";

export default function AdminShippingRedirect() {
  redirect("/admin"); // o "/admin/ops" ecc.
}