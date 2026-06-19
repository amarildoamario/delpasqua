"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/client/adminFetch";
import ProductCard, { type ProductCardVariantImage } from "@/components/ProductCard";

type MerchState = {
  showInHome: boolean;
  homeRank: number;
  isBestSeller: boolean;
  badge: string;
  promoLabel: string;
  discountPercent: number;
  discountCents: number;
  startsAt: string | null;
  endsAt: string | null;
};

type Row = {
  productKey: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  imageSrc: string;
  imageAlt: string;
  variantsCount: number;
  defaultVariantId: string;
  variantImages: ProductCardVariantImage[] | undefined;
  basePriceCents: number;
  merch: MerchState | null;
};

const BADGES = [
  { value: "", label: "— Nessun Badge" },
  { value: "PIU_VENDUTO", label: "Più venduto" },
  { value: "IN_OFFERTA", label: "In offerta" },
  { value: "NOVITA", label: "Novità" },
  { value: "HOT", label: "Hot" },
  { value: "IN_HOME", label: "In home" },
];

function euroFromCents(c: number) {
  return (c / 100).toFixed(2).replace(".", ",") + " €";
}

function toLocal(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

function fromLocal(v: string) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function effectivePrice(priceCents: number, s: MerchState) {
  let p = priceCents;
  const pct = Number(s.discountPercent || 0);
  const fixed = Number(s.discountCents || 0);

  if (pct > 0) p = Math.round((p * (100 - pct)) / 100);
  if (fixed > 0) p = Math.max(0, p - fixed);
  return p;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
      {children}
    </div>
  );
}

function Input({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 outline-none transition-all duration-200",
        "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/5 placeholder:text-neutral-300",
        className,
      ].join(" ")}
    />
  );
}

function Select({
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800 outline-none transition-all duration-200 cursor-pointer",
        "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-900/5",
        className,
      ].join(" ")}
    />
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 bg-white px-3.5 py-2.5 cursor-pointer hover:bg-neutral-50/50 transition-colors shadow-sm">
      <span className="text-xs font-semibold text-neutral-700">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/5 cursor-pointer"
      />
    </label>
  );
}

export default function SalesTable({ rows }: { rows: Row[] }) {
  const router = useRouter();

  const initial = useMemo(() => {
    // 1. Mappa lo stato dei prodotti basandoti sul database
    const mapped = rows.map((r) => ({
      productKey: r.productKey,
      slug: r.slug,
      showInHome: r.merch ? r.merch.showInHome : null,
      homeRank: r.merch?.homeRank ?? 0,
    }));

    // 2. Calcola quali prodotti sono visibili in Home (stessa logica di ShopHighlights)
    const homeProducts = mapped
      .filter((p) => p.showInHome === true)
      .sort((a, b) => {
        const rA = a.homeRank === 0 ? 99999 : a.homeRank;
        const rB = b.homeRank === 0 ? 99999 : b.homeRank;
        return rA - rB;
      });

    const picked = [...homeProducts];
    const FEATURED_SLUGS = ["fruttato-medio", "fruttato-intenso", "evo", "tartufo"];

    if (picked.length < 4) {
      const already = new Set(picked.map((p) => p.slug));
      for (const slug of FEATURED_SLUGS) {
        if (picked.length >= 4) break;
        const p = mapped.find((x) => x.slug === slug);
        if (p && !already.has(p.slug) && p.showInHome !== false) {
          picked.push(p);
          already.add(p.slug);
        }
      }

      for (const p of mapped) {
        if (picked.length >= 4) break;
        if (already.has(p.slug)) continue;
        if (p.showInHome === false) continue;
        picked.push(p);
        already.add(p.slug);
      }
    }

    const top4Keys = picked.slice(0, 4).map((p) => p.productKey);

    // 3. Costruisci lo stato iniziale per la tabella
    const m: Record<string, MerchState> = {};
    for (const r of rows) {
      const top4Index = top4Keys.indexOf(r.productKey);
      const isActiveInHome = top4Index !== -1;
      const calculatedRank = isActiveInHome ? top4Index + 1 : 0;

      const finalShowInHome = r.merch ? r.merch.showInHome : isActiveInHome;
      const finalHomeRank = finalShowInHome
        ? (r.merch && r.merch.homeRank > 0 ? r.merch.homeRank : calculatedRank)
        : 0;

      m[r.productKey] = {
        showInHome: finalShowInHome,
        homeRank: finalHomeRank,
        isBestSeller: r.merch?.isBestSeller ?? false,
        badge: r.merch?.badge ?? "",
        promoLabel: r.merch?.promoLabel ?? "",
        discountPercent: r.merch?.discountPercent ?? 0,
        discountCents: r.merch?.discountCents ?? 0,
        startsAt: r.merch?.startsAt ?? null,
        endsAt: r.merch?.endsAt ?? null,
      };
    }
    return m;
  }, [rows]);

  const [state, setState] = useState<Record<string, MerchState>>(initial);
  const [dbState, setDbState] = useState<Record<string, MerchState>>(initial);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  const isDirty = useCallback((key: string) => {
    const s = state[key];
    const db = dbState[key];
    if (!s || !db) return false;
    return (
      s.showInHome !== db.showInHome ||
      s.homeRank !== db.homeRank ||
      s.isBestSeller !== db.isBestSeller ||
      s.badge !== db.badge ||
      s.promoLabel !== db.promoLabel ||
      s.discountPercent !== db.discountPercent ||
      s.discountCents !== db.discountCents ||
      s.startsAt !== db.startsAt ||
      s.endsAt !== db.endsAt
    );
  }, [dbState, state]);

  useEffect(() => {
    const dirtyKeys = Object.keys(state).filter(isDirty);
    if (dirtyKeys.length === 0) {
      setState(initial);
      setDbState(initial);
    }
  }, [initial, isDirty, state]);

  const previewProducts = useMemo(() => {
    const isExplicitlyDisabled = (key: string) => {
      const s = state[key];
      if (!s) return false;
      const hasDbRecord = rows.find(r => r.productKey === key)?.merch !== null;
      return s.showInHome === false && (hasDbRecord || isDirty(key));
    };

    const mapped = rows.map((r) => {
      const s = state[r.productKey] || {
        showInHome: false,
        homeRank: 0,
        isBestSeller: false,
        badge: "",
        promoLabel: "",
        discountPercent: 0,
        discountCents: 0,
        startsAt: null,
        endsAt: null,
      };

      const promoPrice = effectivePrice(r.basePriceCents, s);
      const fmt = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "EUR",
      }).format(promoPrice / 100);

      return {
        id: r.productKey,
        slug: r.slug,
        title: r.title,
        subtitle: r.subtitle,
        imageSrc: r.imageSrc,
        imageAlt: r.imageAlt,
        priceLabel: fmt,
        priceCaption: r.variantsCount > 1 ? "A partire da" : "Prezzo",
        priceCents: promoPrice,
        defaultVariantId: r.defaultVariantId,
        variantsCount: r.variantsCount,
        variantImages: r.variantImages,
        badge: r.badge,
        merchBadge: s.badge || undefined,
        isBestSeller: s.isBestSeller,
        showInHome: s.showInHome,
        homeRank: s.homeRank,
      };
    });

    const homeProducts = mapped
      .filter((p) => p.showInHome)
      .sort((a, b) => {
        const rA = a.homeRank === 0 ? 99999 : a.homeRank;
        const rB = b.homeRank === 0 ? 99999 : b.homeRank;
        return rA - rB;
      });

    const picked = [...homeProducts];

    const FEATURED_SLUGS = ["fruttato-medio", "fruttato-intenso", "evo", "tartufo"];
    if (picked.length < 4) {
      const already = new Set(picked.map((p) => p.slug));
      for (const slug of FEATURED_SLUGS) {
        if (picked.length >= 4) break;
        const p = mapped.find((x) => x.slug === slug);
        if (p && !already.has(p.slug) && !isExplicitlyDisabled(p.id)) {
          picked.push(p);
          already.add(p.slug);
        }
      }

      for (const p of mapped) {
        if (picked.length >= 4) break;
        if (already.has(p.slug)) continue;
        if (isExplicitlyDisabled(p.id)) continue;
        picked.push(p);
        already.add(p.slug);
      }
    }

    return picked.slice(0, 4);
  }, [isDirty, rows, state]);

  function setField<K extends keyof MerchState>(key: string, field: K, value: MerchState[K]) {
    setState((s) => ({ ...s, [key]: { ...s[key], [field]: value } }));
  }

  const getFirstAvailableRank = (currentState: Record<string, MerchState>, excludeKey?: string) => {
    const occupied = new Set<number>();
    for (const key in currentState) {
      if (key === excludeKey) continue;
      const rank = currentState[key]?.homeRank;
      if (rank && rank >= 1 && rank <= 4) {
        occupied.add(rank);
      }
    }
    for (let r = 1; r <= 4; r++) {
      if (!occupied.has(r)) return r;
    }
    return 0;
  };

  const handleHomeRankChange = (targetProductKey: string, newRank: number) => {
    setState((prev) => {
      const next = { ...prev };
      const oldRank = prev[targetProductKey]?.homeRank ?? 0;

      if (newRank === 0) {
        next[targetProductKey] = {
          ...next[targetProductKey],
          homeRank: 0,
          showInHome: false,
        };
        return next;
      }

      // Trova se un altro prodotto occupa già questa posizione
      let swappedKey: string | null = null;
      for (const key in prev) {
        if (key !== targetProductKey && prev[key]?.homeRank === newRank) {
          swappedKey = key;
          break;
        }
      }

      // Imposta il prodotto target
      next[targetProductKey] = {
        ...next[targetProductKey],
        homeRank: newRank,
        showInHome: true,
      };

      // Effettua lo scambio se necessario
      if (swappedKey) {
        // Se il prodotto target era a 0 (non in home) ed è stato impostato su un rank,
        // controlliamo se c'è un'altra posizione libera tra 1 e 4.
        // Se c'è, assegniamo quella posizione libera al prodotto scalzato invece di mandarlo a 0!
        let targetSwappedRank = oldRank;
        if (oldRank === 0) {
          const freeRank = getFirstAvailableRank(prev, targetProductKey);
          if (freeRank > 0) {
            targetSwappedRank = freeRank;
          }
        }

        next[swappedKey] = {
          ...next[swappedKey],
          homeRank: targetSwappedRank,
          showInHome: targetSwappedRank > 0,
        };
      }

      return next;
    });
  };

  const handleShowInHomeChange = (productKey: string, show: boolean) => {
    setState((prev) => {
      const next = { ...prev };
      if (!show) {
        next[productKey] = {
          ...next[productKey],
          showInHome: false,
          homeRank: 0,
        };
      } else {
        const freeRank = getFirstAvailableRank(prev);
        if (freeRank > 0) {
          next[productKey] = {
            ...next[productKey],
            showInHome: true,
            homeRank: freeRank,
          };
        } else {
          // Se tutte le 4 posizioni sono occupate, rimpiazza automaticamente la posizione 4
          let rank4Key: string | null = null;
          for (const key in prev) {
            if (prev[key]?.homeRank === 4) {
              rank4Key = key;
              break;
            }
          }
          if (rank4Key) {
            next[rank4Key] = {
              ...next[rank4Key],
              homeRank: 0,
              showInHome: false,
            };
          }
          next[productKey] = {
            ...next[productKey],
            showInHome: true,
            homeRank: 4,
          };
        }
      }
      return next;
    });
  };

  async function save(productKey: string) {
    // Raccoglie tutti i prodotti modificati nella sessione
    const dirtyKeys = Object.keys(state).filter(isDirty);
    if (!dirtyKeys.includes(productKey)) {
      dirtyKeys.push(productKey);
    }

    // Validazione preventiva
    for (const key of dirtyKeys) {
      const s = state[key];
      const pct = Number(s.discountPercent || 0);
      const fixed = Number(s.discountCents || 0);
      if (pct < 0 || pct > 100) {
        const prodName = rows.find(r => r.productKey === key)?.title || key;
        return alert(`Lo sconto % per il prodotto "${prodName}" deve essere compreso tra 0 e 100.`);
      }
      if (fixed < 0) {
        const prodName = rows.find(r => r.productKey === key)?.title || key;
        return alert(`Lo sconto fisso per il prodotto "${prodName}" non è valido.`);
      }
      const startsAt = s.startsAt ? new Date(s.startsAt) : null;
      const endsAt = s.endsAt ? new Date(s.endsAt) : null;
      if (startsAt && endsAt && startsAt.getTime() > endsAt.getTime()) {
        const prodName = rows.find(r => r.productKey === key)?.title || key;
        return alert(`La data di inizio deve precedere la data di fine per il prodotto "${prodName}".`);
      }
    }

    setSavingKey(productKey);
    setSavedKey(null);

    try {
      // Salva tutti i record modificati in parallelo
      const savePromises = dirtyKeys.map(async (key) => {
        const s = state[key];
        const res = await adminFetch("/api/admin/sales", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productKey: key,
            showInHome: Boolean(s.showInHome),
            homeRank: Number(s.homeRank || 0),
            isBestSeller: Boolean(s.isBestSeller),
            badge: s.badge ? String(s.badge) : null,
            promoLabel: s.promoLabel ? String(s.promoLabel) : null,
            discountPercent: s.discountPercent > 0 ? s.discountPercent : null,
            discountCents: s.discountCents > 0 ? s.discountCents : null,
            startsAt: s.startsAt ?? null,
            endsAt: s.endsAt ?? null,
          }),
        });

        const data: unknown = await res.json().catch(() => ({}));
        const msg =
          typeof data === "object" && data && "error" in data && typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Errore salvataggio";

        if (!res.ok) throw new Error(msg);
      });

      await Promise.all(savePromises);

      // Sincronizza lo stato dbState
      setDbState((prev) => {
        const next = { ...prev };
        for (const key of dirtyKeys) {
          next[key] = { ...state[key] };
        }
        return next;
      });

      // Forza il refresh dei Server Components per allineare i dati
      router.refresh();

      setSavedKey(productKey);
      setTimeout(() => setSavedKey((k) => (k === productKey ? null : k)), 1200);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Errore";
      alert(msg);
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Preview Container */}
      <div className="rounded-3xl border border-neutral-200 bg-neutral-50/50 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
            <span>Anteprima Home in Tempo Reale</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800 animate-pulse">
              Live
            </span>
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {
              "Queste schede mostrano in tempo reale come appariranno i prodotti nella sezione \"I piu acquistati\" della Homepage. Vengono ordinate per priorita tra quelle con \"Mostra in home\" attivo. Cambiando i campi qui sotto, l'anteprima si aggiorna all'istante."
            }
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr">
          {previewProducts.map((p) => (
            <div key={p.id} className="flex h-full w-full">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {rows.map((r) => {
        const s = state[r.productKey];
        const promoPrice = effectivePrice(r.basePriceCents, s);
        const isSaving = savingKey === r.productKey;
        const isSaved = savedKey === r.productKey;
        const dirty = isDirty(r.productKey);

        return (
          <div
            key={r.productKey}
            className={`rounded-3xl border p-5 shadow-sm transition-all duration-200 ${
              dirty
                ? "border-amber-200 bg-amber-50/10 shadow-md ring-1 ring-amber-500/5"
                : "border-neutral-200 bg-white"
            }`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-neutral-100">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="truncate text-base font-extrabold text-neutral-900">{r.title}</h3>
                  {s.badge ? (
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-800">
                      {BADGES.find((b) => b.value === s.badge)?.label ?? s.badge}
                    </span>
                  ) : null}
                  {s.isBestSeller ? (
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-extrabold text-sky-700">
                      Best seller
                    </span>
                  ) : null}
                  {s.showInHome ? (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                      Posizione {s.homeRank > 0 ? `${s.homeRank}°` : "Non assegnata"}
                    </span>
                  ) : null}
                  {dirty ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-extrabold text-amber-800 animate-pulse">
                      Modifiche non salvate
                    </span>
                  ) : null}
                </div>

                <div className="mt-1 text-xs text-neutral-400">/shop/{r.slug}</div>

                <div className="mt-3 flex flex-wrap items-end gap-5">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Prezzo Base</div>
                    <div className="text-sm font-extrabold text-neutral-800">
                      {euroFromCents(r.basePriceCents)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase font-bold text-neutral-400">Prezzo Calcolato</div>
                    <div className="text-sm font-extrabold text-neutral-900">
                      {euroFromCents(promoPrice)}
                    </div>
                  </div>

                  {s.promoLabel ? (
                    <div>
                      <div className="text-[10px] uppercase font-bold text-neutral-400">Etichetta Promo</div>
                      <div className="text-sm font-bold text-neutral-800">
                        {s.promoLabel}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isSaved ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">
                    Salvato ✅
                  </div>
                ) : null}

                <button
                  onClick={() => save(r.productKey)}
                  disabled={isSaving}
                  className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:opacity-90 disabled:opacity-60 ${
                    dirty
                      ? "bg-amber-600 hover:bg-amber-700 ring-4 ring-amber-500/10 shadow-md"
                      : "bg-neutral-900 hover:bg-neutral-800"
                  }`}
                >
                  {isSaving ? "Salvo..." : "Salva Modifiche"}
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {/* 1. POSIZIONAMENTO IN HOME */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 mb-3">
                    <span className="text-xs font-bold text-neutral-800">1. Posizionamento Home</span>
                  </div>

                  <div className="space-y-4">
                    <CheckRow
                      label="Mostra in Vetrina Home"
                      checked={Boolean(s.showInHome)}
                      onChange={(v) => handleShowInHomeChange(r.productKey, v)}
                    />

                    <div>
                      <FieldLabel>Posizione in Evidenza</FieldLabel>
                      <Select
                        value={s.homeRank}
                        onChange={(e) => handleHomeRankChange(r.productKey, Number(e.target.value))}
                      >
                        <option value={0}>— Nessuna posizione</option>
                        <option value={1}>1° Posizione (Home)</option>
                        <option value={2}>2° Posizione (Home)</option>
                        <option value={3}>3° Posizione (Home)</option>
                        <option value={4}>4° Posizione (Home)</option>
                      </Select>
                      <p className="mt-1.5 text-[10px] leading-relaxed text-neutral-400">
                        La selezione scambierà automaticamente la posizione con il prodotto precedentemente assegnato.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. BADGE & PROMOZIONI */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 mb-3">
                    <span className="text-xs font-bold text-neutral-800">2. Badge & Etichette</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Badge Principale (Alto a Sinistra)</FieldLabel>
                      <Select value={s.badge} onChange={(e) => setField(r.productKey, "badge", e.target.value)}>
                        {BADGES.map((b) => (
                          <option key={b.value} value={b.value}>
                            {b.label}
                          </option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <FieldLabel>Etichetta Dettaglio Promo</FieldLabel>
                      <Input
                        value={s.promoLabel}
                        onChange={(e) => setField(r.productKey, "promoLabel", e.target.value)}
                        placeholder="Es: Promo limitata"
                      />
                    </div>

                    <CheckRow
                      label="Contrassegna come Best Seller"
                      checked={Boolean(s.isBestSeller)}
                      onChange={(v) => setField(r.productKey, "isBestSeller", v)}
                    />
                  </div>
                </div>
              </div>

              {/* 3. OFFERTE & SCONTI */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 mb-3">
                    <span className="text-xs font-bold text-neutral-800">3. Offerte & Sconti</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Sconto Percentuale (%)</FieldLabel>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={s.discountPercent || ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Number(e.target.value);
                          setField(r.productKey, "discountPercent", val);
                        }}
                        placeholder="Nessuno sconto %"
                      />
                    </div>

                    <div>
                      <FieldLabel>Sconto Fisso (€)</FieldLabel>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        value={s.discountCents ? (s.discountCents / 100).toString() : ""}
                        onChange={(e) => {
                          const val = e.target.value === "" ? 0 : Math.round(parseFloat(e.target.value) * 100);
                          setField(r.productKey, "discountCents", val);
                        }}
                        placeholder="Nessuno sconto fisso"
                      />
                    </div>

                    <div className="rounded-xl border border-neutral-200/70 bg-white px-3.5 py-3 text-xs font-semibold text-neutral-700 shadow-sm">
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Prezzo Finale Promo</div>
                      <div className="text-sm font-extrabold text-neutral-950">
                        {euroFromCents(promoPrice)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. PROGRAMMAZIONE */}
              <div className="flex flex-col justify-between rounded-2xl border border-neutral-100 bg-neutral-50/50 p-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-200/60 mb-3">
                    <span className="text-xs font-bold text-neutral-800">4. Programmazione Temporale</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Data Inizio Offerta</FieldLabel>
                      <Input
                        type="datetime-local"
                        value={toLocal(s.startsAt)}
                        onChange={(e) => setField(r.productKey, "startsAt", fromLocal(e.target.value))}
                      />
                    </div>

                    <div>
                      <FieldLabel>Data Fine Offerta</FieldLabel>
                      <Input
                        type="datetime-local"
                        value={toLocal(s.endsAt)}
                        onChange={(e) => setField(r.productKey, "endsAt", fromLocal(e.target.value))}
                      />
                    </div>

                    <div className="text-[10px] leading-relaxed text-neutral-400">
                      <strong>Nota:</strong> se impostate, le promozioni saranno attivate e disattivate automaticamente nel periodo indicato.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
