"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();

  const nextUrl = useMemo(() => sp.get("next") || "/admin/orders", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => null);
        setErr(j?.error || "Login fallito");
        setLoading(false);
        return;
      }

      router.push(nextUrl);
      router.refresh();
    } catch {
      setErr("Errore di rete");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-neutral-800">
          Email admin
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="username"
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/20"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-800">
          Password
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-neutral-900/20"
          required
        />
      </div>

      {err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Accesso..." : "Accedi"}
      </button>

      <div className="text-xs text-neutral-500">
        Accesso riservato all’amministratore.
      </div>
    </form>
  );
}
