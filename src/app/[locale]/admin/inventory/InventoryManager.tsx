"use client";

import { useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";




type InventoryMap = Record<
  string,
  {
    stock: number;
    updatedAt: string;
  }
>;

type Variant = {
  id: string;
  label?: string;
  priceCents?: number;
  sku?: string; // SKU “commerciale” (se presente nel JSON)
};

type Product = {
  id: string;
  title?: string;
  category?: string;
  variants: Variant[];
};

function makeSku(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function isNumberLike(s: string) {
  return /^-?\d+$/.test(s.trim());
}

export default function InventoryManager({
  initialCatalog,
  initialInventory,
}: {
  initialCatalog: Product[];
  initialInventory: InventoryMap;
}) {
  const [q, setQ] = useState("");
  const [inv, setInv] = useState<InventoryMap>(initialInventory);
  const [busySku, setBusySku] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const rows = useMemo(() => {
    const out: Array<{
      productId: string;
      productTitle: string;
      category?: string;
      variantId: string;
      variantLabel: string;
      sku: string;
      vendorSku?: string;
    }> = [];

    for (const p of initialCatalog || []) {
      for (const v of p.variants || []) {
        const sku = makeSku(p.id, v.id);
        out.push({
          productId: p.id,
          productTitle: p.title || p.id,
          category: p.category,
          variantId: v.id,
          variantLabel: v.label || v.id,
          sku,
          vendorSku: v.sku,
        });
      }
    }

    const needle = q.trim().toLowerCase();
    if (!needle) return out;

    return out.filter((r) => {
      return (
        r.productTitle.toLowerCase().includes(needle) ||
        r.productId.toLowerCase().includes(needle) ||
        r.variantLabel.toLowerCase().includes(needle) ||
        r.variantId.toLowerCase().includes(needle) ||
        r.sku.toLowerCase().includes(needle) ||
        (r.vendorSku || "").toLowerCase().includes(needle)
      );
    });
  }, [initialCatalog, q]);

  async function refreshSome(skus: string[]) {
    const res = await adminFetch(`/api/admin/inventory?skus=${encodeURIComponent(skus.join(","))}`);
    if (!res.ok) throw new Error("Fetch failed");
    const json = await res.json();
    const map = (json?.items || {}) as Record<string, { stock: number; updatedAt: string }>;
    setInv((prev) => ({ ...prev, ...map }));
  }

  async function setStock(sku: string, stock: number) {
    setBusySku(sku);
    setMsg(null);
    try {
      const res = await adminFetch("/api/admin/inventory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "set", sku, stock }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      if (json?.item) {
        setInv((prev) => ({
          ...prev,
          [sku]: {
            stock: json.item.stock,
            updatedAt: json.item.updatedAt,
          },
        }));
      } else {
        await refreshSome([sku]);
      }
    } catch (e: unknown) {
      setMsg((e as Error)?.message || "Errore");
    } finally {
      setBusySku(null);
    }
  }

  async function adjustStock(sku: string, delta: number) {
    setBusySku(sku);
    setMsg(null);
    try {
      const res = await adminFetch("/api/admin/inventory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "adjust", sku, delta }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      if (json?.item) {
        setInv((prev) => ({
          ...prev,
          [sku]: {
            stock: json.item.stock,
            updatedAt: json.item.updatedAt,
          },
        }));
      } else {
        await refreshSome([sku]);
      }
    } catch (e: unknown) {
      setMsg((e as Error)?.message || "Errore");
    } finally {
      setBusySku(null);
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-900">Gestione scorte</div>
          <div className="mt-1 text-xs text-neutral-500">
            Cerca per nome prodotto/variante, SKU interno (<code>product:variant</code>) o SKU commerciale.
          </div>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca…"
          className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </div>

      {msg ? (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {msg}
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[960px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wide text-neutral-500">
              <th className="border-b border-neutral-200 px-3 py-3">Prodotto</th>
              <th className="border-b border-neutral-200 px-3 py-3">Variante</th>
              <th className="border-b border-neutral-200 px-3 py-3">SKU</th>
              <th className="border-b border-neutral-200 px-3 py-3 text-center">Giacenza Reale</th>
              <th className="border-b border-neutral-200 px-3 py-3">Azioni</th>
              <th className="border-b border-neutral-200 px-3 py-3 text-right">Set Manuale</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const it = inv[r.sku];
              const stock = it?.stock ?? 0;
              const busy = busySku === r.sku;

              return (
                <Row
                  key={r.sku}
                  r={r}
                  stock={stock}
                  busy={busy}
                  onAdjust={adjustStock}
                  onSet={setStock}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({
  r,
  stock,
  busy,
  onAdjust,
  onSet,
}: {
  r: {
    productId: string;
    productTitle: string;
    category?: string;
    variantId: string;
    variantLabel: string;
    sku: string;
    vendorSku?: string;
  };
  stock: number;
  busy: boolean;
  onAdjust: (sku: string, delta: number) => Promise<void>;
  onSet: (sku: string, stock: number) => Promise<void>;
}) {
  const [manual, setManual] = useState<string>(String(stock));

  const sub = r.category ? ` • ${r.category}` : "";
  const disabled = busy;

  return (
    <tr className="text-sm text-neutral-900">
      <td className="border-b border-neutral-100 px-3 py-3">
        <div className="font-semibold">{r.productTitle}</div>
        <div className="text-xs text-neutral-500">
          {r.productId}
          {sub}
        </div>
      </td>

      <td className="border-b border-neutral-100 px-3 py-3">
        <div className="font-semibold">{r.variantLabel}</div>
        <div className="text-xs text-neutral-500">{r.variantId}</div>
      </td>

      <td className="border-b border-neutral-100 px-3 py-3">
        <div className="font-mono text-xs text-neutral-800">{r.sku}</div>
        {r.vendorSku ? <div className="mt-1 text-xs text-neutral-500">SKU: {r.vendorSku}</div> : null}
      </td>

      <td className="border-b border-neutral-100 px-3 py-4 text-center">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${stock <= 0
            ? "bg-red-50 text-red-700 ring-1 ring-red-200"
            : stock <= 5
              ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
              : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
            }`}
        >
          {stock} pz
        </span>
      </td>

      <td className="border-b border-neutral-100 px-3 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-sm">
            <button
              disabled={disabled}
              onClick={() => onAdjust(r.sku, -1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
              title="Rimuovi 1"
            >
              -1
            </button>
            <div className="h-4 w-px bg-neutral-200" />
            <button
              disabled={disabled}
              onClick={() => onAdjust(r.sku, +1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
              title="Aggiungi 1"
            >
              +1
            </button>
          </div>

          <button
            disabled={disabled}
            onClick={() => onSet(r.sku, 50)}
            className="h-9 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 disabled:opacity-50"
            title="Imposta rapidamente a 50"
          >
            A 50
          </button>
        </div>
      </td>

      <td className="border-b border-neutral-100 px-3 py-4 text-right">
        <div className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-1 shadow-sm focus-within:ring-2 focus-within:ring-neutral-900/20">
          <input
            value={manual}
            onChange={(e) => setManual(e.target.value)}
            className="w-16 bg-transparent px-2 text-center text-sm font-medium text-neutral-900 outline-none"
            inputMode="numeric"
          />
          <button
            disabled={disabled || !isNumberLike(manual)}
            onClick={() => onSet(r.sku, parseInt(manual, 10))}
            className="flex h-8 items-center justify-center rounded-lg bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Salva
          </button>
        </div>
      </td>
    </tr>
  );
}