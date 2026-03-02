"use client";

import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/client/adminFetch";

export default function AdminLogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await adminFetch("/api/auth/logout", { method: "POST" }).catch(() => null);
        router.push("/");
        router.refresh();
      }}
      className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
    >
      Logout
    </button>
  );
}
