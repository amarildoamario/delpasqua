"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Truck,
  Trash2,
  CheckCircle2,
  Zap,
  Download,
  Building2,
  Ban,
  Car,
  Copy,
  Plus,
} from "lucide-react";

export type ShiftEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // Lunedì, Martedì...
  type: "WORK" | "OFF" | "VACATION" | "PERMIT";
  startTime: string; // e.g. "08:30"
  endTime: string; // e.g. "17:00"
  breakMinutes: number; // e.g. 30
  transportMinutes: number; // e.g. 45
  notes?: string;
};

// Preset shift templates
const SHIFT_PRESETS = [
  {
    id: "giornaliero",
    label: "Centrale (08:30 - 17:00)",
    startTime: "08:30",
    endTime: "17:00",
    breakMinutes: 30,
    transportMinutes: 45,
    icon: "🏢",
  },
  {
    id: "mattina",
    label: "Mattina (06:00 - 14:00)",
    startTime: "06:00",
    endTime: "14:00",
    breakMinutes: 30,
    transportMinutes: 45,
    icon: "🌅",
  },
  {
    id: "pomeriggio",
    label: "Pomeriggio (14:00 - 22:00)",
    startTime: "14:00",
    endTime: "22:00",
    breakMinutes: 30,
    transportMinutes: 45,
    icon: "🌆",
  },
  {
    id: "notte",
    label: "Notte (22:00 - 06:00)",
    startTime: "22:00",
    endTime: "06:00",
    breakMinutes: 30,
    transportMinutes: 45,
    icon: "🌙",
  },
];

function getMondayOfCurrentWeek(d = new Date()) {
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function getDayItalianName(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("it-IT", { weekday: "long" }).format(d);
}

function calculateWorkHours(startTime: string, endTime: string, breakMinutes: number) {
  if (!startTime || !endTime) return 0;
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const startTotal = sh * 60 + sm;
  let endTotal = eh * 60 + em;

  if (endTotal < startTotal) {
    endTotal += 24 * 60; // night shift
  }

  const diffMins = Math.max(0, endTotal - startTotal - breakMinutes);
  return Math.round((diffMins / 60) * 10) / 10;
}

function formatMinutesToHours(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function generateDefaultWeekShifts(mondayDate: string, startTime = "08:30", endTime = "17:00", breakMins = 30, transportMins = 45): ShiftEntry[] {
  const week: ShiftEntry[] = [];
  for (let i = 0; i < 5; i++) {
    const dateStr = addDays(mondayDate, i);
    const dayName = getDayItalianName(dateStr);
    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    week.push({
      id: `shift_${dateStr}`,
      date: dateStr,
      dayName: capitalizedDayName,
      type: "WORK",
      startTime,
      endTime,
      breakMinutes: breakMins,
      transportMinutes: transportMins,
      notes: "Turno Aurobindo",
    });
  }
  return week;
}

function loadSavedShifts(mondayDate: string): ShiftEntry[] {
  if (typeof window === "undefined") return generateDefaultWeekShifts(mondayDate);
  try {
    const storageKey = `delpasqua_aurobindo_shifts_${mondayDate}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    // Default auto-fill on first load for week
    return generateDefaultWeekShifts(mondayDate);
  } catch {
    return generateDefaultWeekShifts(mondayDate);
  }
}

export default function TurniAurobindoManager() {
  // Monday of target week
  const [selectedMonday, setSelectedMonday] = useState<string>(() => getMondayOfCurrentWeek());

  // Shift entries list (defaults to auto-filled 5 days!)
  const [shifts, setShifts] = useState<ShiftEntry[]>(() => loadSavedShifts(getMondayOfCurrentWeek()));

  // Manual single day form state
  const [manualDate, setManualDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [manualType, setManualType] = useState<"WORK" | "OFF" | "VACATION" | "PERMIT">("WORK");
  const [manualStart, setManualStart] = useState("08:30");
  const [manualEnd, setManualEnd] = useState("17:00");
  const [manualBreak, setManualBreak] = useState(30);
  const [manualTransport, setManualTransport] = useState(45);
  const [manualNotes, setManualNotes] = useState("");

  const [notification, setNotification] = useState<string | null>(null);

  const handleMondayChange = (newMonday: string) => {
    setSelectedMonday(newMonday);
    setShifts(loadSavedShifts(newMonday));
  };

  // Persist shifts to localStorage
  const saveShifts = (newShifts: ShiftEntry[]) => {
    setShifts(newShifts);
    try {
      const storageKey = `delpasqua_aurobindo_shifts_${selectedMonday}`;
      localStorage.setItem(storageKey, JSON.stringify(newShifts));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // ========================================================
  // PROPAGATE MONDAY (OR FIRST DAY) TO TUESDAY -> FRIDAY
  // ========================================================
  const handlePropagateFirstDay = () => {
    if (shifts.length === 0) return;
    const firstShift = shifts[0]; // Lunedì (1° giorno)

    const updated = shifts.map((shift) => ({
      ...shift,
      type: firstShift.type,
      startTime: firstShift.startTime,
      endTime: firstShift.endTime,
      breakMinutes: firstShift.breakMinutes,
      transportMinutes: firstShift.transportMinutes, // Always copy Monday's transport time directly!
      notes: firstShift.notes,
    }));

    saveShifts(updated);
    showToast(
      `⚡ Orario (${firstShift.startTime}-${firstShift.endTime}) e Viaggio (${firstShift.transportMinutes}m) applicati a tutta la settimana!`
    );
  };

  // ========================================================
  // AUTO FILL ENTIRE WEEK FROM PRESET
  // ========================================================
  const handleAutoFillFromPreset = (presetId: string) => {
    const p = SHIFT_PRESETS.find((x) => x.id === presetId);
    if (!p) return;

    const newShifts = generateDefaultWeekShifts(selectedMonday, p.startTime, p.endTime, p.breakMinutes, p.transportMinutes);
    saveShifts(newShifts);
    showToast(`⚡ Settimana compilata con ${p.label}!`);
  };

  // ========================================================
  // INLINE SHIFT FIELD UPDATER (Direct editing in table row)
  // ========================================================
  const handleUpdateShiftField = (
    id: string,
    field: keyof ShiftEntry,
    value: string | number
  ) => {
    const updated = shifts.map((s) => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    });
    saveShifts(updated);
  };

  // ========================================================
  // TOGGLE/REMOVE VIAGGI PER L'INTERA SETTIMANA
  // ========================================================
  const handleRemoveAllTravel = () => {
    const updated = shifts.map((s) => ({ ...s, transportMinutes: 0 }));
    saveShifts(updated);
    showToast("🚫 Viaggi/tempo di trasporto rimossi da tutti i giorni!");
  };

  const handleRestoreAllTravel = () => {
    const defaultVal = shifts[0]?.transportMinutes || 45;
    const updated = shifts.map((s) => ({
      ...s,
      transportMinutes: s.type === "WORK" ? defaultVal : 0,
    }));
    saveShifts(updated);
    showToast(`🚗 Tempo di trasporto (${defaultVal}m) ripristinato per tutta la settimana!`);
  };

  const handleToggleSingleTravel = (id: string) => {
    const firstTravelVal = shifts[0]?.transportMinutes || 45;
    const updated = shifts.map((s) => {
      if (s.id === id) {
        const nextTransport = s.transportMinutes > 0 ? 0 : firstTravelVal;
        return { ...s, transportMinutes: nextTransport };
      }
      return s;
    });
    saveShifts(updated);
  };

  // ========================================================
  // MANUAL SINGLE DAY ENTRY / EDIT FORM
  // ========================================================
  const handleAddManualShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDate) return;

    const dayName = getDayItalianName(manualDate);
    const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

    const newEntry: ShiftEntry = {
      id: `manual_${manualDate}_${Date.now()}`,
      date: manualDate,
      dayName: capitalizedDayName,
      type: manualType,
      startTime: manualType === "WORK" ? manualStart : "00:00",
      endTime: manualType === "WORK" ? manualEnd : "00:00",
      breakMinutes: manualType === "WORK" ? manualBreak : 0,
      transportMinutes: manualType === "WORK" ? manualTransport : 0,
      notes: manualNotes.trim() || undefined,
    };

    const existingIndex = shifts.findIndex((s) => s.date === manualDate);
    let updated: ShiftEntry[];
    if (existingIndex >= 0) {
      updated = [...shifts];
      updated[existingIndex] = newEntry;
    } else {
      updated = [...shifts, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    }

    saveShifts(updated);
    showToast(`Giorno ${manualDate} salvato!`);
    setManualNotes("");
  };

  const handleDeleteShift = (id: string) => {
    const updated = shifts.filter((s) => s.id !== id);
    saveShifts(updated);
  };

  const handleClearWeek = () => {
    saveShifts([]);
    showToast("Settimana svuotata.");
  };

  // Computations
  const totalWorkHours = useMemo(() => {
    return shifts
      .filter((s) => s.type === "WORK")
      .reduce((acc, s) => acc + calculateWorkHours(s.startTime, s.endTime, s.breakMinutes), 0);
  }, [shifts]);

  const totalTransportMinutes = useMemo(() => {
    return shifts
      .filter((s) => s.type === "WORK")
      .reduce((acc, s) => acc + (s.transportMinutes || 0), 0);
  }, [shifts]);

  const workDaysCount = useMemo(() => shifts.filter((s) => s.type === "WORK").length, [shifts]);

  // Export CSV
  const handleExportCSV = () => {
    if (shifts.length === 0) return;
    const headers = "Data,Giorno,Stato,Inizio,Fine,Pausa (min),Trasporto (min),Ore Lavoro,Note\n";
    const rows = shifts
      .map((s) => {
        const hours = s.type === "WORK" ? calculateWorkHours(s.startTime, s.endTime, s.breakMinutes) : 0;
        return `"${s.date}","${s.dayName}","${s.type}","${s.startTime}","${s.endTime}","${s.breakMinutes}","${s.transportMinutes}","${hours}","${s.notes || ""}"`;
      })
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Turni_Aurobindo_Settimana_${selectedMonday}.csv`;
    a.click();
  };

  const firstShift = shifts[0] ?? {
    startTime: "08:30",
    endTime: "17:00",
    breakMinutes: 30,
    transportMinutes: 45,
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-xs font-bold text-white shadow-xl transition animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-white shadow-md">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Sezione Turni Aurobindo</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900">
                Auto-Fill ⚡
              </span>
            </h1>
            <p className="text-xs text-neutral-500">
              Imposta orario e viaggio del 1° giorno (Lunedì) per espanderlo a tutta la settimana in 1 click.
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-xl border border-neutral-200">
          <Calendar className="h-4 w-4 text-neutral-500" />
          <label className="text-xs font-bold text-neutral-700">Lunedì Settimana:</label>
          <input
            type="date"
            value={selectedMonday}
            onChange={(e) => handleMondayChange(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 🚀 PRIMARY DYNAMIC AUTO-FILL & PROPAGATE CONTROL BOX     */}
      {/* ======================================================== */}
      <section className="rounded-2xl border-2 border-amber-300 bg-amber-50/40 p-5 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Zap className="h-5 w-5 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 uppercase tracking-wide">
                Auto-Fill 1° Giorno (Lunedì) ➔ Espandi a Tutta la Settimana
              </h2>
              <p className="text-xs text-neutral-600">
                Imposta l&apos;orario di lavoro e i minuti di viaggio di Lunedì: verrà replicato istantaneamente fino a Venerdì.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {SHIFT_PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleAutoFillFromPreset(p.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-bold text-neutral-800 hover:bg-neutral-50 shadow-2xs"
              >
                <span>{p.icon}</span>
                <span>{p.label.split(" (")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Inputs for First Day / General Shift */}
        <div className="grid gap-3 sm:grid-cols-4 bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
              Inizio Turno (1° Giorno)
            </label>
            <input
              type="time"
              value={firstShift.startTime}
              onChange={(e) => {
                const val = e.target.value;
                if (shifts.length > 0) {
                  handleUpdateShiftField(shifts[0].id, "startTime", val);
                }
              }}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
              Fine Turno (1° Giorno)
            </label>
            <input
              type="time"
              value={firstShift.endTime}
              onChange={(e) => {
                const val = e.target.value;
                if (shifts.length > 0) {
                  handleUpdateShiftField(shifts[0].id, "endTime", val);
                }
              }}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1">
              Pausa (minuti)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={firstShift.breakMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                if (shifts.length > 0) {
                  handleUpdateShiftField(shifts[0].id, "breakMinutes", val);
                }
              }}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-700 mb-1 flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-amber-600" />
              Tempo Viaggio / Trasporto (minuti)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              value={firstShift.transportMinutes}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                if (shifts.length > 0) {
                  handleUpdateShiftField(shifts[0].id, "transportMinutes", val);
                }
              }}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2 text-xs font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        {/* GIANT ACTION BUTTON */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="text-xs font-medium text-neutral-700">
            Copierà <strong>Orario ({firstShift.startTime} - {firstShift.endTime})</strong> e <strong>Viaggio ({firstShift.transportMinutes} min)</strong> a tutti i giorni della settimana corrente.
          </div>

          <button
            type="button"
            onClick={handlePropagateFirstDay}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-black text-white shadow-xl hover:bg-neutral-800 transition active:scale-[0.98]"
          >
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span>⚡ ESPANDI ORARIO E VIAGGIO A TUTTA LA SETTIMANA (Lunedì ➔ Venerdì)</span>
          </button>
        </div>
      </section>

      {/* Top Stats Cards & Quick Travel Controls */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Giorni Compilati</span>
            <Calendar className="h-4 w-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">{workDaysCount} / 5</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">Lunedì ➔ Venerdì</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Totale Ore Lavoro</span>
            <Clock className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">{totalWorkHours}h</div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">Netto pause</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Tempo Trasporto (Viaggi)</span>
            <Truck className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-neutral-900">
            {formatMinutesToHours(totalTransportMinutes)}
          </div>
          <div className="mt-1 text-xs text-neutral-500 font-medium">{totalTransportMinutes} min totali</div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-bold uppercase tracking-wider">
            <span>Gestione Viaggi</span>
            <Car className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {totalTransportMinutes > 0 ? (
              <button
                type="button"
                onClick={handleRemoveAllTravel}
                disabled={shifts.length === 0}
                className="inline-flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition disabled:opacity-40"
                title="Azzera tempo di trasporto da tutti i giorni della settimana"
              >
                <Ban className="h-3.5 w-3.5 text-amber-700" />
                <span>Azzera Viaggi</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRestoreAllTravel}
                disabled={shifts.length === 0}
                className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-900 hover:bg-emerald-100 transition disabled:opacity-40"
                title="Ripristina tempo di trasporto per tutti i giorni"
              >
                <Truck className="h-3.5 w-3.5 text-emerald-700" />
                <span>Aggiungi Viaggi</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={shifts.length === 0}
              className="inline-flex items-center gap-1 rounded-xl bg-neutral-900 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-neutral-800 transition disabled:opacity-40"
            >
              <Download className="h-3.5 w-3.5" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={handleClearWeek}
              disabled={shifts.length === 0}
              className="rounded-xl border border-neutral-200 bg-white px-2 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition disabled:opacity-40"
              title="Svuota la settimana corrente"
            >
              Svuota
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: WEEKLY TABLE WITH INLINE EDIT & PROPAGATE     */}
      {/* ======================================================== */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
              <Calendar className="h-3.5 w-3.5" />
            </div>
            <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
              Turni Settimanali (Lunedì ➔ Venerdì)
            </h2>
          </div>

          {shifts.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePropagateFirstDay}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-3.5 py-1.5 text-xs font-black text-white shadow-xs hover:bg-amber-600 transition"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Propaga 1° Giorno (Orario + Viaggio) a Tutta la Settimana</span>
              </button>
            </div>
          )}
        </div>

        {shifts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white py-10 text-center shadow-xs">
            <Clock className="h-8 w-8 text-neutral-400" />
            <h3 className="mt-2 text-sm font-bold text-neutral-900">Nessun turno in questa settimana</h3>
            <button
              type="button"
              onClick={() => setShifts(generateDefaultWeekShifts(selectedMonday))}
              className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span>Compila Settimana Standard</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {shifts.map((shift, idx) => {
              const isFirstDay = idx === 0;
              const hours = calculateWorkHours(shift.startTime, shift.endTime, shift.breakMinutes);
              const isWork = shift.type === "WORK";
              const hasTravel = shift.transportMinutes > 0;

              return (
                <div
                  key={shift.id}
                  className={`rounded-2xl border p-4 shadow-xs flex flex-wrap items-center justify-between gap-4 transition ${
                    isFirstDay
                      ? "border-amber-300 bg-amber-50/40 ring-2 ring-amber-400/50"
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Day Badge */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-900 font-black text-xs text-white shadow-xs">
                      {shift.dayName.slice(0, 3)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-neutral-900">{shift.dayName}</span>
                        <span className="text-xs text-neutral-500 font-mono">({shift.date})</span>

                        {isFirstDay && (
                          <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-black text-amber-950 border border-amber-300">
                            1° GIORNO BASE
                          </span>
                        )}
                      </div>

                      {/* Direct Inline Controls for Hours & Transport */}
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        {/* Status Select */}
                        <select
                          value={shift.type}
                          onChange={(e) =>
                            handleUpdateShiftField(shift.id, "type", e.target.value as ShiftEntry["type"])
                          }
                          className="rounded-lg border border-neutral-300 bg-white px-2 py-1 font-bold text-neutral-900 focus:outline-none"
                        >
                          <option value="WORK">🏢 In Turno</option>
                          <option value="OFF">🏖️ Riposo</option>
                          <option value="VACATION">🌴 Ferie</option>
                          <option value="PERMIT">⏱️ Permesso</option>
                        </select>

                        {isWork && (
                          <>
                            {/* Start time */}
                            <div className="flex items-center gap-1">
                              <span className="text-neutral-500 text-[11px]">Inizio:</span>
                              <input
                                type="time"
                                value={shift.startTime}
                                onChange={(e) =>
                                  handleUpdateShiftField(shift.id, "startTime", e.target.value)
                                }
                                className="rounded-lg border border-neutral-300 bg-white px-2 py-1 font-bold text-neutral-900 focus:outline-none"
                              />
                            </div>

                            {/* End time */}
                            <div className="flex items-center gap-1">
                              <span className="text-neutral-500 text-[11px]">Fine:</span>
                              <input
                                type="time"
                                value={shift.endTime}
                                onChange={(e) =>
                                  handleUpdateShiftField(shift.id, "endTime", e.target.value)
                                }
                                className="rounded-lg border border-neutral-300 bg-white px-2 py-1 font-bold text-neutral-900 focus:outline-none"
                              />
                            </div>

                            {/* Transport Minutes */}
                            <div className="flex items-center gap-1">
                              <Truck className="h-3.5 w-3.5 text-amber-600" />
                              <span className="text-neutral-500 text-[11px]">Trasporto:</span>
                              <input
                                type="number"
                                min="0"
                                step="5"
                                value={shift.transportMinutes}
                                onChange={(e) =>
                                  handleUpdateShiftField(
                                    shift.id,
                                    "transportMinutes",
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                className="w-16 rounded-lg border border-neutral-300 bg-white px-2 py-1 font-bold text-neutral-900 text-center focus:outline-none"
                              />
                              <span className="text-neutral-500 text-[11px]">min</span>
                            </div>

                            <span className="font-extrabold text-neutral-900 bg-neutral-100 px-2 py-1 rounded-lg">
                              {hours}h nette
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions for Row */}
                  <div className="flex items-center gap-2">
                    {/* PROPAGATE BUTTON ON THE FIRST DAY ROW */}
                    {isFirstDay && (
                      <button
                        type="button"
                        onClick={handlePropagateFirstDay}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-black text-white shadow-md hover:bg-amber-600 transition active:scale-[0.98]"
                        title="Copia l'orario e il tempo di trasporto del 1° giorno a tutti i giorni successivi fino a venerdì"
                      >
                        <Zap className="h-4 w-4 text-white fill-white" />
                        <span>⚡ ESPANDI ORARIO E VIAGGIO A TUTTA LA SETTIMANA</span>
                      </button>
                    )}

                    {isWork && (
                      <button
                        type="button"
                        onClick={() => handleToggleSingleTravel(shift.id)}
                        className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition border ${
                          hasTravel
                            ? "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"
                            : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                        }`}
                        title={hasTravel ? "Azzera viaggio per questo giorno" : "Aggiungi 45m di viaggio"}
                      >
                        {hasTravel ? (
                          <>
                            <Ban className="h-3.5 w-3.5 text-amber-700" />
                            <span>Azzera Viaggio</span>
                          </>
                        ) : (
                          <>
                            <Truck className="h-3.5 w-3.5 text-emerald-600" />
                            <span>+ Viaggio (45m)</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteShift(shift.id)}
                      className="rounded-xl border border-neutral-200 bg-white p-2 text-neutral-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition"
                      title="Elimina questo giorno"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: MANUAL ADD SINGLE EXTRA DAY                   */}
      {/* ======================================================== */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-neutral-900 text-white">
            <Plus className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
              Aggiungi un Giorno Extra a Mano
            </h2>
            <p className="text-xs text-neutral-500">
              Se hai lavorato un giorno straordinario (es. Sabato o Domenica), aggiungilo qui a mano.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddManualShift} className="grid gap-3 sm:grid-cols-4 lg:grid-cols-7 items-end">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Data Giorno
            </label>
            <input
              type="date"
              value={manualDate}
              onChange={(e) => setManualDate(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Tipo
            </label>
            <select
              value={manualType}
              onChange={(e) => setManualType(e.target.value as ShiftEntry["type"])}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900"
            >
              <option value="WORK">🏢 Turno Lavoro</option>
              <option value="OFF">🏖️ Riposo</option>
              <option value="VACATION">🌴 Ferie</option>
              <option value="PERMIT">⏱️ Permesso</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Inizio
            </label>
            <input
              type="time"
              disabled={manualType !== "WORK"}
              value={manualStart}
              onChange={(e) => setManualStart(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Fine
            </label>
            <input
              type="time"
              disabled={manualType !== "WORK"}
              value={manualEnd}
              onChange={(e) => setManualEnd(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Pausa (min)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              disabled={manualType !== "WORK"}
              value={manualBreak}
              onChange={(e) => setManualBreak(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Trasporto/Viaggio (min)
            </label>
            <input
              type="number"
              min="0"
              step="5"
              disabled={manualType !== "WORK"}
              value={manualTransport}
              onChange={(e) => setManualTransport(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 disabled:opacity-50"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Aggiungi Giorno</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
