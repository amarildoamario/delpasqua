"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/client/adminFetch";
import DoubleConfirmDialog from "@/components/DoubleConfirmDialog";

type Variant = {
  id: string;
  label?: string;
  priceCents?: number;
  sku?: string;
  imageSrc?: string;
  imageAlt?: string;
  [k: string]: unknown;
};

type Product = {
  id: string;
  slug?: string;
  title?: string;
  category?: string;
  subtitle?: string;
  badge?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  specs?: Record<string, unknown>;
  variants: Variant[];
  [k: string]: unknown;
};

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function makeNewProductTemplate(): Product {
  const id = `nuovo-prodotto-${Date.now()}`;
  return {
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
    variants: [
      {
        id: "var-1",
        label: "Variante 1",
        priceCents: 0,
        sku: "",
        imageSrc: "",
        imageAlt: "",
      },
    ],
  };
}

function makeNewVariantTemplate(existingIds: Set<string>): Variant {
  let id = `var-${Date.now()}`;
  let i = 1;
  while (existingIds.has(id)) {
    id = `var-${Date.now()}-${i++}`;
  }
  return {
    id,
    label: "Nuova variante",
    priceCents: 0,
    sku: "",
    imageSrc: "",
    imageAlt: "",
  };
}

function centsToEuroString(cents?: number) {
  const v = typeof cents === "number" ? cents : 0;
  return (v / 100).toFixed(2).replace(".", ",");
}

function euroStringToCents(s: string) {
  const norm = s.trim().replace(/\./g, "").replace(",", ".");
  const n = Number(norm);
  if (Number.isNaN(n)) return null;
  return Math.round(n * 100);
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
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
    <label className="block">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
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
  const base =
    "rounded-xl px-3 py-2 text-xs font-bold disabled:opacity-50 transition border";
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

export default function ProductsManager({ initialCatalog }: { initialCatalog: Product[] }) {
  const [catalog, setCatalog] = useState<Product[]>(initialCatalog || []);
  const [selectedId, setSelectedId] = useState<string>(initialCatalog?.[0]?.id || "");
  const [draft, setDraft] = useState<Product | null>(
    initialCatalog?.[0] ? clone(initialCatalog[0]) : null
  );

  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [deleteProductStep, setDeleteProductStep] = useState<0 | 1 | 2>(0);
  const [deleteVariantStep, setDeleteVariantStep] = useState<0 | 1 | 2>(0);
  const [pendingDeleteVariantId, setPendingDeleteVariantId] = useState<string | null>(null);

  const selected = useMemo(
    () => catalog.find((p) => String(p?.id) === String(selectedId)) || null,
    [catalog, selectedId]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return catalog;
    return catalog.filter((p) => {
      const title = String(p?.title || "").toLowerCase();
      const id = String(p?.id || "").toLowerCase();
      const slug = String(p?.slug || "").toLowerCase();
      return title.includes(needle) || id.includes(needle) || slug.includes(needle);
    });
  }, [catalog, q]);

  async function reloadCatalog({ keepSelection = true }: { keepSelection?: boolean } = {}) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await adminFetch("/api/admin/catalog");
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      const next = (json.catalog || []) as Product[];
      setCatalog(next);

      const nextSelectedId = keepSelection ? selectedId : (next[0]?.id || "");
      const nextSelected = next.find((p) => String(p?.id) === String(nextSelectedId)) || null;

      setSelectedId(nextSelectedId);
      setDraft(nextSelected ? clone(nextSelected) : null);

      if (json.backupName) setMsg(`Aggiornato. Backup: ${json.backupName}`);
    } catch (e: unknown) {
      setMsg((e as Error)?.message || "Errore caricamento catalogo");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // carica sempre il catalogo “vero”
    reloadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selected) {
      setDraft(null);
      return;
    }
    setDraft(clone(selected));
  }, [selectedId, selected]); // when changing selection

  function setDraftField<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  }

  function setVariantField(variantId: string, key: keyof Variant, value: unknown) {
    setDraft((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      next.variants = (next.variants || []).map((v) =>
        String(v.id) === String(variantId) ? { ...v, [key]: value } : v
      );
      return next;
    });
  }

  function addVariantLocal() {
    if (!draft) return;
    const ids = new Set((draft.variants || []).map((v) => String(v.id)));
    const v = makeNewVariantTemplate(ids);
    setDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, variants: [...(prev.variants || []), v] };
    });
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
    if (!draft) return;
    // blocco di sicurezza minimo
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
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "updateProduct", productId: draft.id, patch: draft }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setCatalog(json.catalog || []);
      setMsg(json.backupName ? `Salvato. Backup: ${json.backupName}` : "Salvato.");
      // riallineo la bozza col catalogo appena salvato
      const updated = (json.catalog || []).find((p: Product) => String(p?.id) === String(draft.id));
      if (updated) setDraft(clone(updated));
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
      const product = makeNewProductTemplate();
      const res = await adminFetch("/api/admin/catalog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "createProduct", product }),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setCatalog(json.catalog || []);
      setSelectedId(product.id);
      setDraft(clone(product));
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
      setCatalog(json.catalog || []);
      const nextId = (json.catalog || [])[0]?.id || "";
      setSelectedId(nextId);
      const nextSelected = (json.catalog || []).find((p: Product) => String(p?.id) === String(nextId)) || null;
      setDraft(nextSelected ? clone(nextSelected) : null);
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
    return JSON.stringify(selected) !== JSON.stringify(draft);
  }, [selected, draft]);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
      {/* Sidebar elenco prodotti */}
      <aside className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-neutral-900">Prodotti</div>
          <SmallBtn variant="primary" onClick={createProduct} disabled={busy}>
            + Prodotto
          </SmallBtn>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cerca…"
          className="mt-3 w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />

        <div className="mt-3 max-h-[560px] overflow-y-auto no-scrollbar pr-1">
          {filtered.map((p) => {
            const active = String(p?.id) === String(selectedId);
            return (
              <button
                key={String(p?.id)}
                onClick={() => setSelectedId(String(p?.id))}
                className={`mb-2 w-full rounded-2xl border px-3 py-2 text-left transition ${active
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50"
                  }`}
              >
                <div className="text-sm font-extrabold tracking-tight">{String(p?.title || p?.id)}</div>
                <div className={`mt-1 text-xs ${active ? "text-white/80" : "text-neutral-500"}`}>
                  {String(p?.id)} • {String(p?.slug || "—")}
                </div>
              </button>
            );
          })}
          {filtered.length === 0 ? <div className="mt-4 text-sm text-neutral-500">Nessun prodotto.</div> : null}
        </div>
      </aside>

      {/* Editor */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-sm font-semibold text-neutral-900">
              {draft ? String(draft?.title || draft?.id) : "Seleziona un prodotto"}
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              Modifica campi e varianti senza toccare JSON. {dirty ? <b className="text-neutral-900">Modifiche non salvate</b> : " "}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SmallBtn onClick={() => reloadCatalog()} disabled={busy}>
              Ricarica
            </SmallBtn>
            <SmallBtn variant="primary" onClick={saveProduct} disabled={busy || !draft || !dirty}>
              Salva
            </SmallBtn>
            <SmallBtn variant="danger" onClick={() => setDeleteProductStep(1)} disabled={busy || !selected}>
              Elimina prodotto
            </SmallBtn>
          </div>
        </div>

        {msg ? (
          <div className="mt-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800">
            {msg}
          </div>
        ) : null}

        {!draft ? (
          <div className="mt-6 text-sm text-neutral-500">Seleziona un prodotto a sinistra.</div>
        ) : (
          <div className="mt-4 space-y-6">
            {/* Campi prodotto */}
            <div className="grid gap-3 md:grid-cols-2">
              <TextField label="ID (non cambiare)" value={draft.id || ""} onChange={(v) => setDraftField("id", v)} />
              <TextField label="Slug" value={draft.slug || ""} onChange={(v) => setDraftField("slug", v)} />

              <TextField label="Titolo" value={draft.title || ""} onChange={(v) => setDraftField("title", v)} />
              <TextField label="Categoria" value={draft.category || ""} onChange={(v) => setDraftField("category", v)} />

              <TextField label="Sottotitolo" value={draft.subtitle || ""} onChange={(v) => setDraftField("subtitle", v)} />
              <TextField label="Badge" value={draft.badge || ""} onChange={(v) => setDraftField("badge", v)} />

              <TextField label="Immagine (URL)" value={draft.imageSrc || ""} onChange={(v) => setDraftField("imageSrc", v)} />
              <TextField label="Alt immagine" value={draft.imageAlt || ""} onChange={(v) => setDraftField("imageAlt", v)} />
            </div>

            <TextArea
              label="Descrizione"
              value={draft.description || ""}
              onChange={(v) => setDraftField("description", v)}
              rows={6}
            />

            {/* Varianti */}
            <div className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">Varianti</div>
                  <div className="mt-1 text-xs text-neutral-500">
                    Aggiungi, modifica o elimina varianti. (Consiglio: tieni gli ID stabili.)
                  </div>
                </div>
                <SmallBtn onClick={addVariantLocal} disabled={busy}>
                  + Variante
                </SmallBtn>
              </div>

              <div className="mt-4 space-y-3">
                {(draft.variants || []).map((v) => {
                  const priceStr = centsToEuroString(v.priceCents);

                  return (
                    <div key={String(v.id)} className="rounded-2xl border border-neutral-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-extrabold text-neutral-900">
                            {v.label || v.id}
                          </div>
                          <div className="mt-1 text-xs text-neutral-500">id: {String(v.id)}</div>
                        </div>

                        <SmallBtn
                          variant="danger"
                          onClick={() => askDeleteVariant(String(v.id))}
                          disabled={busy}
                        >
                          Elimina variante
                        </SmallBtn>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <TextField
                          label="ID variante"
                          value={String(v.id || "")}
                          onChange={(val) => setVariantField(String(v.id), "id", val)}
                        />
                        <TextField
                          label="Label"
                          value={String(v.label || "")}
                          onChange={(val) => setVariantField(String(v.id), "label", val)}
                        />

                        <label className="block">
                          <div className="mb-1 text-xs font-bold uppercase tracking-wide text-neutral-500">
                            Prezzo (€)
                          </div>
                          <input
                            value={priceStr}
                            onChange={(e) => {
                              const cents = euroStringToCents(e.target.value);
                              // se non valido, non aggiorno (evito NaN)
                              if (cents === null) return;
                              setVariantField(String(v.id), "priceCents", cents);
                            }}
                            className="w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-400"
                            inputMode="decimal"
                          />
                          <div className="mt-1 text-xs text-neutral-400">
                            (salvato come cents: {typeof v.priceCents === "number" ? v.priceCents : 0})
                          </div>
                        </label>

                        <TextField
                          label="SKU (commerciale)"
                          value={String(v.sku || "")}
                          onChange={(val) => setVariantField(String(v.id), "sku", val)}
                        />

                        <TextField
                          label="Immagine variante (URL)"
                          value={String(v.imageSrc || "")}
                          onChange={(val) => setVariantField(String(v.id), "imageSrc", val)}
                        />
                        <TextField
                          label="Alt immagine variante"
                          value={String(v.imageAlt || "")}
                          onChange={(val) => setVariantField(String(v.id), "imageAlt", val)}
                        />
                      </div>
                    </div>
                  );
                })}

                {(draft.variants || []).length === 0 ? (
                  <div className="text-sm text-neutral-500">Nessuna variante. Aggiungine una.</div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Modali conferma */}
        {selected ? (
          <DoubleConfirmDialog
            open={deleteProductStep !== 0}
            title="Eliminare il prodotto?"
            step={deleteProductStep === 0 ? 1 : (deleteProductStep as 1 | 2)}
            loading={busy}
            step1Text={`Stai per eliminare "${String(selected?.title || selected?.id)}" (${String(selected?.id)}). Premi "ELIMINA" per continuare.`}
            step2Text={`CONFERMA FINALE: elimino davvero il prodotto "${String(selected?.title || selected?.id)}"?`}
            confirmLabel="ELIMINA"
            cancelLabel="Chiudi"
            onCancel={() => setDeleteProductStep(0)}
            onBack={() => setDeleteProductStep(1)}
            onConfirm={() => {
              if (deleteProductStep === 1) setDeleteProductStep(2);
              else deleteSelectedProduct();
            }}
          />
        ) : null}

        {draft && pendingDeleteVariantId ? (
          <DoubleConfirmDialog
            open={deleteVariantStep !== 0}
            title="Eliminare la variante?"
            step={deleteVariantStep === 0 ? 1 : (deleteVariantStep as 1 | 2)}
            loading={busy}
            step1Text={`Prodotto: ${String(draft?.title || draft?.id)}. Variante: ${pendingDeleteVariantId}. Premi "ELIMINA" per continuare.`}
            step2Text={`CONFERMA FINALE: elimino davvero la variante ${pendingDeleteVariantId}?`}
            confirmLabel="ELIMINA"
            cancelLabel="Chiudi"
            onCancel={() => {
              setDeleteVariantStep(0);
              setPendingDeleteVariantId(null);
            }}
            onBack={() => setDeleteVariantStep(1)}
            onConfirm={() => {
              if (deleteVariantStep === 1) setDeleteVariantStep(2);
              else deleteVariantLocal(pendingDeleteVariantId);
            }}
          />
        ) : null}
      </section>
    </div>
  );
}