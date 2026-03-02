"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";
import DoubleConfirmDialog from "@/components/DoubleConfirmDialog";

/* =========================
   TYPES
========================= */

type SpecsRow = { _rid: string; k: string; v: string };

type PurchaseInfo = {
  caratteristiche?: string;
  imballaggio?: string;
  spedizione?: string;
  resi?: string;
};

type Variant = {
  /** Chiave UI stabile (NON viene salvata nel JSON). */
  _uid?: string;

  /** Editor UI per dettagli variante (NON salvato direttamente). */
  _specRows?: SpecsRow[];

  /** Input UI prezzo (NON salvato). */
  _priceText?: string;

  id: string;
  label?: string;
  priceCents?: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Record<string, string>;
  [k: string]: unknown;
};

type Product = {
  /** Chiave UI stabile (NON viene salvata nel JSON). */
  _uid?: string;

  /** Editor UI per dettagli prodotto (NON salvato direttamente). */
  _specRows?: SpecsRow[];

  id: string;
  slug?: string;
  title?: string;
  category?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;

  /** Dettagli prodotto (tabella key/value) */
  specs?: Record<string, string>;

  /** Testi box acquisto (Caratteristiche, Imballaggio, Spedizione, Resi) */
  purchaseInfo?: PurchaseInfo;

  variants: Variant[];
  [k: string]: unknown;
};

/* =========================
   UTILS
========================= */

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `uid-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeId(input: string) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-_]+|[-_]+$/g, "");
}

/* =========================
   SPECS helpers
========================= */

function normalizeSpecs(specs: unknown): Record<string, string> {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    const kk = String(k || "").trim();
    const vv = v == null ? "" : String(v).trim();
    if (!kk) continue;
    if (!vv) continue;
    out[kk] = vv;
  }
  return out;
}

function specsToRows(specs: unknown): SpecsRow[] {
  const obj = normalizeSpecs(specs);
  return Object.entries(obj).map(([k, v]) => ({ _rid: uid(), k, v }));
}

function rowsToSpecs(rows: SpecsRow[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const r of rows || []) {
    const k = String(r.k || "").trim();
    const v = String(r.v || "").trim();
    if (!k || !v) continue;
    out[k] = v;
  }
  return out;
}

/* =========================
   PRICE helpers (free typing)
========================= */

function parseEuroTextToCents(text: string): number | null {
  const t = String(text ?? "").trim();
  if (!t) return null;

  if (!/^[0-9.,]+$/.test(t)) return null;

  const lastDot = t.lastIndexOf(".");
  const lastComma = t.lastIndexOf(",");
  const decPos = Math.max(lastDot, lastComma);

  let normalized: string;
  if (decPos >= 0) {
    const intPart = t.slice(0, decPos).replace(/[.,]/g, "");
    const decPart = t.slice(decPos + 1).replace(/[.,]/g, "");
    normalized = intPart + "." + decPart;
  } else {
    normalized = t.replace(/[.,]/g, "");
  }

  if (!normalized || normalized === ".") return null;

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;

  return Math.round(n * 100);
}

function centsToEuroText(cents?: number) {
  const v = typeof cents === "number" ? cents : 0;
  return (v / 100).toFixed(2);
}

/* =========================
   UI components
========================= */

function TextField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block min-w-0">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400 disabled:opacity-60"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block min-w-0">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
      />
    </label>
  );
}

function SmallBtn({
  children,
  onClick,
  disabled,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "primary" | "danger";
}) {
  const base = "rounded-xl px-3 py-2 text-xs font-bold disabled:opacity-50 transition border";
  const styles =
    variant === "primary"
      ? "bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800"
      : variant === "danger"
        ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
        : "bg-white text-neutral-900 border-neutral-200 hover:bg-neutral-50";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

function SpecsEditor({
  title,
  rows,
  onChange,
  addLabel = "+ Riga",
}: {
  title: string;
  rows: SpecsRow[];
  onChange: (rows: SpecsRow[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-neutral-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          <div className="mt-1 text-xs text-neutral-500">
            Compila righe chiave/valore. Le righe vuote non vengono salvate.
          </div>
        </div>
        <SmallBtn
          onClick={() => onChange([...(rows || []), { _rid: uid(), k: "", v: "" }])}
        >
          {addLabel}
        </SmallBtn>
      </div>

      <div className="mt-3 space-y-2">
        {(rows || []).map((r, idx) => (
          <div key={r._rid} className="grid min-w-0 gap-2 sm:grid-cols-[1fr,1fr,auto]">
            <input
              value={r.k}
              onChange={(e) => {
                const next = clone(rows);
                next[idx].k = e.target.value;
                onChange(next);
              }}
              placeholder="Chiave"
              className="min-w-0 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <input
              value={r.v}
              onChange={(e) => {
                const next = clone(rows);
                next[idx].v = e.target.value;
                onChange(next);
              }}
              placeholder="Valore"
              className="min-w-0 rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            />
            <SmallBtn
              variant="danger"
              onClick={() => {
                const next = (rows || []).filter((x) => x._rid !== r._rid);
                onChange(next);
              }}
            >
              Rimuovi
            </SmallBtn>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   Catalog helpers (UI-only fields)
========================= */

function withUids(catalog: Record<string, unknown>[]): Product[] {
  return (catalog || []).map((p) => {
    const next: Record<string, unknown> = { ...p };
    next._uid = next._uid || uid();
    next._specRows = specsToRows(next.specs);

    next.variants = ((next.variants as Record<string, unknown>[]) || []).map((v) => ({
      ...v,
      _uid: v._uid || uid(),
      _specRows: specsToRows(v.specs),
      _priceText: typeof v._priceText === "string" ? v._priceText : centsToEuroText(v.priceCents as number | undefined),
    }));

    return next as unknown as Product;
  });
}

function stripUis(p: Product): Product {
  const next = clone(p);

  delete (next as { _uid?: string })._uid;
  delete (next as { _specRows?: SpecsRow[] })._specRows;

  next.variants = (next.variants || []).map((v) => {
    const vv = { ...v };
    delete (vv as { _uid?: string })._uid;
    delete (vv as { _specRows?: SpecsRow[] })._specRows;
    delete (vv as { _priceText?: string })._priceText;
    return vv;
  });

  return next;
}

function makeNewProductTemplate(forcedId?: string): Product {
  const id = forcedId ? normalizeId(forcedId) : `nuovo-prodotto-${Date.now()}`;

  const prod: Product = {
    _uid: uid(),
    id,
    slug: id,
    category: "",
    title: "Nuovo prodotto",
    subtitle: "",
    badge: "",
    imageSrc: "",
    imageAlt: "",
    description: "",
    specs: {},
    _specRows: [],
    purchaseInfo: {
      caratteristiche:
        "Olio extravergine di oliva ottenuto direttamente dalle olive e unicamente mediante processi meccanici. Acidità <0,3%. Estratto a freddo per preservare tutte le proprietà organolettiche.",
      imballaggio:
        "Bottiglia in vetro scuro per proteggere dall'ossidazione. Confezione riciclabile e protettiva.",
      spedizione:
        "Consegna in 2-3 giorni lavorativi. Tracking in tempo reale. Spedizione gratuita per ordini sopra i 50€.",
      resi: "Reso gratuito entro 14 giorni. Rimborso completo senza domande.",
    },
    variants: [
      {
        _uid: uid(),
        id: "var-1",
        label: "Variante 1",
        priceCents: 0,
        _priceText: "0.00",
        sku: "",
        imageSrc: "",
        imageAlt: "",
        specs: {},
        _specRows: [],
      },
    ],
  };

  (prod as { _specRows?: SpecsRow[] })._specRows = specsToRows(prod.specs);
  prod.variants = prod.variants.map((v) => ({
    ...v,
    _specRows: specsToRows(v.specs),
    _priceText: centsToEuroText(v.priceCents),
  }));

  return prod;
}

function makeNewVariantTemplate(existingIds: Set<string>): Variant {
  let id = `var-${Date.now()}`;
  let i = 1;
  while (existingIds.has(id)) id = `var-${Date.now()}-${i++}`;

  const v: Variant = {
    _uid: uid(),
    id,
    label: "Nuova variante",
    priceCents: 0,
    _priceText: "0.00",
    sku: "",
    imageSrc: "",
    imageAlt: "",
    specs: {},
    _specRows: [],
  };

  v._specRows = specsToRows(v.specs);
  v._priceText = centsToEuroText(v.priceCents);

  return v;
}

/* =========================
   MAIN COMPONENT
========================= */

export default function ProductsManagerForm({ initialCatalog }: { initialCatalog: Product[] }) {
  const [catalog, setCatalog] = useState<Product[]>(() => withUids(initialCatalog || []));
  const [selectedId, setSelectedId] = useState<string>(() => String(withUids(initialCatalog || [])[0]?.id || ""));
  const [draft, setDraft] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const [productSpecsRows, setProductSpecsRows] = useState<SpecsRow[]>([]);
  const [deleteProductStep, setDeleteProductStep] = useState<0 | 1 | 2>(0);
  const [deleteVariantStep, setDeleteVariantStep] = useState<0 | 1 | 2>(0);
  const [pendingDeleteVariantId, setPendingDeleteVariantId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return catalog;
    return catalog.filter((p) => {
      const t = String(p?.title || "").toLowerCase();
      const id = String(p?.id || "").toLowerCase();
      const slug = String(p?.slug || "").toLowerCase();
      return t.includes(qq) || id.includes(qq) || slug.includes(qq);
    });
  }, [catalog, q]);

  const selected = useMemo(() => {
    return catalog.find((p) => String(p?.id) === String(selectedId)) || null;
  }, [catalog, selectedId]);

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      setProductSpecsRows([]);
      return;
    }
    const d = clone(selected);
    setDraft(d);
    setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || specsToRows(d.specs));
  }, [selected, selectedId]); // re-open when selection changes

  // ✅ FIX: la modifica delle specs del prodotto deve attivare il "dirty" (e quindi abilitare Salva)
  useEffect(() => {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      (next as { _specRows?: SpecsRow[] })._specRows = productSpecsRows;
      next.specs = rowsToSpecs(productSpecsRows);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(productSpecsRows)]);

  function patchDraft(patch: Partial<Product>) {
    setDraft((prev) => (prev ? ({ ...prev, ...patch } as Product) : prev));
  }

  function patchVariant(variantId: string, patch: Partial<Variant>) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.variants = (next.variants || []).map((v) =>
        String(v.id) === String(variantId) ? ({ ...v, ...patch } as Variant) : v
      );
      return next;
    });
  }

  async function persistCatalog(nextCatalog: Product[]) {
    const payloadCatalog = (nextCatalog || []).map((p) => stripUis(p));
    const res = await adminFetch("/api/admin/catalog", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "saveCatalog", catalog: payloadCatalog }),
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return { catalog: withUids(json.catalog || []), backupName: json.backupName as string | undefined };
  }

  async function moveProduct(productId: string, dir: -1 | 1) {
    if (busy) return;
    // Evita confusione: se stai filtrando, blocca il riordino.
    if (q.trim()) return;

    const from = catalog.findIndex((p) => String(p.id) === String(productId));
    if (from < 0) return;
    const to = from + dir;
    if (to < 0 || to >= catalog.length) return;

    const prev = catalog;
    const next = clone(catalog);
    const tmp = next[from];
    next[from] = next[to];
    next[to] = tmp;

    setCatalog(next);
    setMsg(null);
    setBusy(true);
    try {
      const saved = await persistCatalog(next);
      setCatalog(saved.catalog);
      setMsg(saved.backupName ? `Ordine salvato. Backup: ${saved.backupName}` : "Ordine salvato.");
    } catch (e: unknown) {
      setCatalog(prev);
      setMsg((e as Error)?.message || "Errore salvataggio ordine");
    } finally {
      setBusy(false);
    }
  }

  function moveVariant(variantId: string, dir: -1 | 1) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const idx = (next.variants || []).findIndex((v) => String(v.id) === String(variantId));
      if (idx < 0) return prev;
      const j = idx + dir;
      if (j < 0 || j >= (next.variants || []).length) return prev;
      const arr = [...(next.variants || [])];
      const t = arr[idx];
      arr[idx] = arr[j];
      arr[j] = t;
      next.variants = arr;
      return next;
    });
  }

  function addVariantLocal() {
    if (!draft) return;
    const ids = new Set((draft.variants || []).map((v) => String(v.id)));
    const v = makeNewVariantTemplate(ids);
    setDraft((prev) => (prev ? { ...prev, variants: [...(prev.variants || []), v] } : prev));
  }

  function askDeleteVariant(variantId: string) {
    setPendingDeleteVariantId(variantId);
    setDeleteVariantStep(1);
  }

  function deleteVariantLocal(variantId: string) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.variants = (next.variants || []).filter((v) => String(v.id) !== String(variantId));
      return next;
    });
    setPendingDeleteVariantId(null);
    setDeleteVariantStep(0);
  }

  async function saveProduct() {
    if (!draft || !selected) return;

    if (!draft.id || !draft.id.trim()) {
      setMsg("Errore: id prodotto mancante.");
      return;
    }
    if (!draft.variants || draft.variants.length === 0) {
      setMsg("Errore: il prodotto deve avere almeno 1 variante.");
      return;
    }

    const ids = new Set<string>();
    for (const v of draft.variants) {
      if (!v.id || !String(v.id).trim()) {
        setMsg("Errore: ogni variante deve avere un id.");
        return;
      }
      const key = String(v.id);
      if (ids.has(key)) {
        setMsg(`Errore: id variante duplicato: ${key}`);
        return;
      }
      ids.add(key);
    }

    setBusy(true);
    setMsg(null);

    try {
      // IMPORTANT: sync specs rows back into object
      const d2 = clone(draft);
      d2.specs = rowsToSpecs(productSpecsRows);

      // price text -> cents
      d2.variants = (d2.variants || []).map((v) => {
        const vv = { ...v };
        if (typeof vv._priceText === "string") {
          const cents = parseEuroTextToCents(vv._priceText);
          if (typeof cents === "number") vv.priceCents = cents;
        }
        // specs rows -> specs object
        if (Array.isArray(vv._specRows)) vv.specs = rowsToSpecs(vv._specRows);
        return vv;
      });

      const payload = stripUis(d2);

      // ✅ FIX CRITICO:
      // productId deve essere l'ID "vecchio" (selected.id), NON payload.id.
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "updateProduct", productId: selected.id, patch: payload }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const next = withUids(json.catalog || []);
      setCatalog(next);

      // se hai cambiato ID, aggiornalo in selezione
      const newId = String(payload.id);
      setSelectedId(newId);

      const updated = next.find((p: Product) => String(p?.id) === newId) || null;
      if (updated) {
        const d = clone(updated);
        setDraft(d);
        setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || []);
      }

      setMsg(json.backupName ? `Salvato. Backup: ${json.backupName}` : "Salvato.");
    } catch (e: unknown) {
      setMsg((e as Error)?.message || "Errore salvataggio");
    } finally {
      setBusy(false);
    }
  }

  async function createProduct() {
    setBusy(true);
    setMsg(null);

    try {
      const desired = window.prompt(
        "ID nuovo prodotto (es: fruttato-intenso-750ml). Se lasci vuoto genero io.",
        ""
      );
      const forced = desired ? normalizeId(desired) : undefined;
      const product = makeNewProductTemplate(forced);

      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "createProduct", product: stripUis(product) }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const next = withUids(json.catalog || []);
      setCatalog(next);

      // ✅ robust: apri il prodotto realmente presente nel catalogo del server
      const created = next.find((p) => String(p.id) === String(product.id)) || next[0] || null;
      if (created) {
        setSelectedId(String(created.id));
        const d = clone(created);
        setDraft(d);
        setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || []);
      }

      setMsg(json.backupName ? `Creato. Backup: ${json.backupName}` : "Creato.");
    } catch (e: unknown) {
      setMsg((e as Error)?.message || "Errore creazione prodotto");
    } finally {
      setBusy(false);
    }
  }

  async function deleteSelectedProduct() {
    if (!selected) return;
    setBusy(true);
    setMsg(null);

    try {
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "deleteProduct", productId: selected.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();

      const next = withUids(json.catalog || []);
      setCatalog(next);

      const nextId = next[0]?.id || "";
      setSelectedId(nextId);

      const nextSelected = next.find((p) => String(p?.id) === String(nextId)) || null;
      if (nextSelected) {
        const d = clone(nextSelected);
        setDraft(d);
        setProductSpecsRows((d as { _specRows?: SpecsRow[] })._specRows || []);
      } else {
        setDraft(null);
        setProductSpecsRows([]);
      }

      setMsg(json.backupName ? `Eliminato. Backup: ${json.backupName}` : "Eliminato.");
    } catch (e: unknown) {
      setMsg((e as Error)?.message || "Errore eliminazione prodotto");
    } finally {
      setBusy(false);
      setDeleteProductStep(0);
    }
  }

  const dirty = useMemo(() => {
    if (!selected && !draft) return false;
    if (!selected || !draft) return true;
    return JSON.stringify(stripUis(selected)) !== JSON.stringify(stripUis(draft));
  }, [selected, draft]);

  return (
    <div className="min-w-0 space-y-3">
      <div className="grid min-w-0 gap-4 lg:grid-cols-[320px,minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold text-neutral-900">Prodotti</div>
            <SmallBtn variant="primary" onClick={createProduct} disabled={busy}>
              + Prodotto
            </SmallBtn>
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cerca…"
            className="mt-3 w-full min-w-0 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />

          <div className="mt-3 max-h-[520px] overflow-y-auto no-scrollbar pr-1">
            {filtered.map((p) => {
              const active = String(p?.id) === String(selectedId);
              const idx = catalog.findIndex((x) => String(x?.id) === String(p?.id));
              const canReorder = !busy && !q.trim();
              const canUp = canReorder && idx > 0;
              const canDown = canReorder && idx >= 0 && idx < catalog.length - 1;
              return (
                <div key={String(p?.id)} className="mb-2 flex items-stretch gap-2">
                  <button
                    onClick={() => setSelectedId(String(p?.id))}
                    className={`w-full min-w-0 flex-1 rounded-2xl border px-3 py-2 text-left transition ${active
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                      }`}
                  >
                    <div className="min-w-0 truncate text-sm font-extrabold tracking-tight">
                      {String(p?.title || p?.id)}
                    </div>
                    <div
                      className={`mt-1 min-w-0 truncate text-xs ${active ? "text-white/80" : "text-neutral-500"
                        }`}
                    >
                      {String(p?.id)} • {String(p?.slug || "—")}
                    </div>
                  </button>

                  {/* Ordine prodotti (sidebar): ▲▼ salva subito */}
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      title={q.trim() ? "Disattiva filtro per riordinare" : "Sposta su"}
                      disabled={!canUp}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveProduct(String(p?.id), -1);
                      }}
                      className="h-8 w-9 rounded-xl border border-neutral-200 bg-white text-sm font-extrabold text-neutral-700 disabled:opacity-40"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      title={q.trim() ? "Disattiva filtro per riordinare" : "Sposta giù"}
                      disabled={!canDown}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        moveProduct(String(p?.id), 1);
                      }}
                      className="h-8 w-9 rounded-xl border border-neutral-200 bg-white text-sm font-extrabold text-neutral-700 disabled:opacity-40"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 ? <div className="mt-4 text-sm text-neutral-500">Nessun prodotto.</div> : null}
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 space-y-3">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <SmallBtn variant="primary" onClick={saveProduct} disabled={busy || !dirty || !draft}>
              Salva modifiche
            </SmallBtn>

            <SmallBtn
              variant="danger"
              onClick={() => setDeleteProductStep(1)}
              disabled={busy || !selected}
            >
              Elimina prodotto
            </SmallBtn>

            {msg ? (
              <div className="ml-auto rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700">
                {msg}
              </div>
            ) : (
              <div className="ml-auto text-xs text-neutral-500">
                {dirty ? "Modifiche non salvate" : "Tutto salvato"}
              </div>
            )}
          </div>

          {/* Editor */}
          {!draft ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              Seleziona un prodotto…
            </div>
          ) : (
            <div className="min-w-0 space-y-3">
              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                <TextField
                  label="ID"
                  value={String(draft.id || "")}
                  onChange={(v) => patchDraft({ id: normalizeId(v), slug: draft.slug || normalizeId(v) })}
                />
                <TextField
                  label="Slug"
                  value={String(draft.slug || "")}
                  onChange={(v) => patchDraft({ slug: normalizeId(v) })}
                />
                <TextField
                  label="Titolo"
                  value={String(draft.title || "")}
                  onChange={(v) => patchDraft({ title: v })}
                />
                <TextField
                  label="Categoria"
                  value={String(draft.category || "")}
                  onChange={(v) => patchDraft({ category: v })}
                />
                <TextField
                  label="Sottotitolo"
                  value={String(draft.subtitle || "")}
                  onChange={(v) => patchDraft({ subtitle: v })}
                />
                <TextField
                  label="Badge"
                  value={String(draft.badge || "")}
                  onChange={(v) => patchDraft({ badge: v })}
                />
                <TextField
                  label="Image src"
                  value={String(draft.imageSrc || "")}
                  onChange={(v) => patchDraft({ imageSrc: v })}
                />
                <TextField
                  label="Image alt"
                  value={String(draft.imageAlt || "")}
                  onChange={(v) => patchDraft({ imageAlt: v })}
                />
              </div>

              <TextArea
                label="Descrizione"
                value={String(draft.description || "")}
                onChange={(v) => patchDraft({ description: v })}
                rows={6}
              />

              <SpecsEditor
                title="Dettagli prodotto (specs)"
                rows={productSpecsRows}
                onChange={(rows) => setProductSpecsRows(rows)}
              />

              {/* Variants */}
              <div className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-neutral-900">Varianti</div>
                  <SmallBtn onClick={addVariantLocal} disabled={busy}>
                    + Variante
                  </SmallBtn>
                </div>

                <div className="mt-3 space-y-3">
                  {(draft.variants || []).map((v, vi) => (
                    <div key={String(v._uid || v.id)} className="rounded-2xl border border-neutral-200 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-bold text-neutral-900">{v.label || v.id}</div>
                        <div className="flex flex-wrap items-center gap-2">
                          <SmallBtn
                            onClick={() => moveVariant(String(v.id), -1)}
                            disabled={busy || vi === 0}
                          >
                            ▲
                          </SmallBtn>
                          <SmallBtn
                            onClick={() => moveVariant(String(v.id), 1)}
                            disabled={busy || vi === (draft.variants || []).length - 1}
                          >
                            ▼
                          </SmallBtn>
                          <SmallBtn variant="danger" onClick={() => askDeleteVariant(String(v.id))} disabled={busy}>
                            Elimina variante
                          </SmallBtn>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <TextField
                          label="Variant ID"
                          value={String(v.id || "")}
                          onChange={(val) => patchVariant(String(v.id), { id: normalizeId(val) })}
                        />
                        <TextField
                          label="Label"
                          value={String(v.label || "")}
                          onChange={(val) => patchVariant(String(v.id), { label: val })}
                        />
                        <TextField
                          label="Prezzo (EUR)"
                          value={String(v._priceText ?? centsToEuroText(v.priceCents))}
                          onChange={(val) => patchVariant(String(v.id), { _priceText: val })}
                        />
                        <TextField
                          label="SKU"
                          value={String(v.sku || "")}
                          onChange={(val) => patchVariant(String(v.id), { sku: val })}
                        />
                        <TextField
                          label="Image src"
                          value={String(v.imageSrc || "")}
                          onChange={(val) => patchVariant(String(v.id), { imageSrc: val })}
                        />
                        <TextField
                          label="Image alt"
                          value={String(v.imageAlt || "")}
                          onChange={(val) => patchVariant(String(v.id), { imageAlt: val })}
                        />
                      </div>

                      <div className="mt-3">
                        <SpecsEditor
                          title="Dettagli variante (specs)"
                          rows={Array.isArray(v._specRows) ? v._specRows : specsToRows(v.specs)}
                          onChange={(rows) => patchVariant(String(v.id), { _specRows: rows })}
                          addLabel="+ Riga variante"
                        />
                      </div>
                    </div>
                  ))}

                  {(draft.variants || []).length === 0 ? (
                    <div className="text-sm text-neutral-500">Aggiungi almeno 1 variante.</div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Double confirm dialogs */}
      <DoubleConfirmDialog
        open={deleteProductStep !== 0}
        title="Eliminare prodotto?"
        step={(deleteProductStep === 2 ? 2 : 1) as 1 | 2}
        step1Text="Conferma"
        step2Text="ELIMINA"
        confirmLabel={deleteProductStep === 2 ? "ELIMINA" : "Conferma"}
        cancelLabel="Annulla"
        onCancel={() => setDeleteProductStep(0)}
        onBack={() => setDeleteProductStep(1)}
        onConfirm={() => {
          if (deleteProductStep === 1) setDeleteProductStep(2);
          else deleteSelectedProduct();
        }}
      />

      <DoubleConfirmDialog
        open={deleteVariantStep !== 0}
        title="Eliminare variante?"
        step={(deleteVariantStep === 2 ? 2 : 1) as 1 | 2}
        step1Text="Conferma"
        step2Text="ELIMINA"
        confirmLabel={deleteVariantStep === 2 ? "ELIMINA" : "Conferma"}
        cancelLabel="Annulla"
        onCancel={() => {
          setDeleteVariantStep(0);
          setPendingDeleteVariantId(null);
        }}
        onBack={() => setDeleteVariantStep(1)}
        onConfirm={() => {
          if (deleteVariantStep === 1) setDeleteVariantStep(2);
          else if (pendingDeleteVariantId) deleteVariantLocal(pendingDeleteVariantId);
        }}
      />
    </div>
  );
}