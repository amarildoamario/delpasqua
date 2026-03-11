"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarCheck,
  Minus,
  Plus,
  Users,
} from "lucide-react";
import type { TastingType } from "@/lib/tasting/slots";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Slot = { start: string; end: string };
type Booking = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED";
  slotStart: string;
  slotEnd: string;
  tastingType: string;
  people: number;
};

type MailOk = {
  ok: true;
  status: "sent" | "skipped";
  messageId?: string | null;
  reason?: string;
};

type MailFail = {
  ok: false;
  status: "failed";
  error?: string;
};

type MailResult = MailOk | MailFail;



function toYmd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function normalizeWeekStart(d: Date) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const dow = x.getDay();
  const diff = (dow + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function getFirstAvailableTime(d: Date, isMorning: boolean, durMins: number, bookings: Booking[]) {
  const dayYmd = toYmd(d);
  const dayBookings = bookings.filter(b => b.status !== "CANCELED" && toYmd(new Date(b.slotStart)) === dayYmd && (new Date(b.slotStart).getHours() < 14) === isMorning);

  const now = new Date();
  const startH = isMorning ? 9 : 14;
  const endH = isMorning ? 13 : 19;

  for (let h = startH; h <= endH; h++) {
    for (const m of [0, 30]) {
      const candidateStart = new Date(d);
      candidateStart.setHours(h, m, 0, 0);
      if (candidateStart < now) continue;

      const candidateEnd = new Date(candidateStart.getTime() + durMins * 60000);
      let overlap = false;
      for (const b of dayBookings) {
        const bStart = new Date(b.slotStart);
        const bEnd = new Date(b.slotEnd);
        if (candidateStart < bEnd && candidateEnd > bStart) {
          overlap = true;
          break;
        }
      }
      if (!overlap) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
  }
  return "";
}

export default function TastingsCalendar(props: {
  tastingTypes: TastingType[];
  initialWeekStartIso: string;
  initialSlots: Slot[];
  initialBookings: Booking[];
}) {
  const t = useTranslations("TastingsCalendar");
  const locale = useLocale();

  function fmtTime(iso: string) {
    const h = new Date(iso).getHours();
    return h < 14 ? t("shifts.morning") : t("shifts.evening");
  }

  function fmtDayFull(d: Date) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(d);
  }

  const [weekStart, setWeekStart] = useState(() =>
    normalizeWeekStart(new Date(props.initialWeekStartIso))
  );
  const [slots, setSlots] = useState<Slot[]>(props.initialSlots);
  const [bookings, setBookings] = useState<Booking[]>(props.initialBookings);
  const [loadingWeek, setLoadingWeek] = useState(false);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const [typeId, setTypeId] = useState(props.tastingTypes[0]?.id || "classica");
  const [people, setPeople] = useState(2);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timeReq, setTimeReq] = useState("");
  const [notes, setNotes] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<null | {
    bookingId: string;
    mail?: MailResult;
  }>(null);

  const isMorningShift = selected ? new Date(selected.start).getHours() < 14 : false;
  const activeType = useMemo(() => props.tastingTypes.find((t) => t.id === typeId) || props.tastingTypes[0], [typeId, props.tastingTypes]);

  const suggestedTime = useMemo(() => {
    if (!selectedDay) return "";
    return getFirstAvailableTime(selectedDay, isMorningShift, activeType.durationMinutes, bookings);
  }, [selectedDay, isMorningShift, activeType.durationMinutes, bookings]);

  const timeReqConflict = useMemo(() => {
    if (!timeReq || !selectedDay || !selected) return false;
    const [hh, mm] = timeReq.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return false;

    if (isMorningShift && hh >= 14) return t("modal.errors.morning_only");
    if (!isMorningShift && hh < 14) return t("modal.errors.afternoon_only");

    const candidateStart = new Date(selectedDay);
    candidateStart.setHours(hh, mm, 0, 0);
    const candidateEnd = new Date(candidateStart.getTime() + activeType.durationMinutes * 60000);

    const dayYmd = toYmd(selectedDay);
    const dayBookings = bookings.filter(b => b.status !== "CANCELED" && toYmd(new Date(b.slotStart)) === dayYmd && (new Date(b.slotStart).getHours() < 14) === isMorningShift);

    for (const b of dayBookings) {
      const bStart = new Date(b.slotStart);
      const bEnd = new Date(b.slotEnd);
      // aggiungiamo 5 minuti di buffer
      if (candidateStart < new Date(bEnd.getTime() + 300000) && candidateEnd > new Date(bStart.getTime() - 300000)) {
        return t("modal.errors.conflict");
      }
    }
    return false;
  }, [timeReq, selectedDay, selected, activeType.durationMinutes, bookings, isMorningShift, t]);

  const weekDays = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const key = toYmd(new Date(s.start));
      const arr = map.get(key) || [];
      arr.push(s);
      map.set(key, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }
    return map;
  }, [slots]);

  async function loadWeek(nextWeekStart: Date) {
    setLoadingWeek(true);
    try {
      const weekStartYmd = toYmd(nextWeekStart);
      const r = await fetch(
        `/api/tasting/availability?weekStart=${encodeURIComponent(weekStartYmd)}`,
        { cache: "no-store" }
      );
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data: { weekStart: string; slots: Slot[]; bookings: Booking[] } = await r.json();

      setSlots(data.slots || []);
      setBookings(data.bookings || []);
      setWeekStart(normalizeWeekStart(new Date(data.weekStart)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingWeek(false);
    }
  }

  function openBooking(s: Slot, day: Date) {
    setSelected(s);
    setSelectedDay(day);
    setOpen(true);
    setSubmitError(null);
    setSuccess(null);

    // Auto-compila col primo slot libero
    const isMorn = new Date(s.start).getHours() < 14;
    const durMins = props.tastingTypes[0]?.durationMinutes || 60;
    const avail = getFirstAvailableTime(day, isMorn, durMins, bookings);
    setTimeReq(avail);
  }

  function closeModal() {
    setOpen(false);
    setSelected(null);
    setSelectedDay(null);
    setSubmitError(null);
    setSuccess(null);
    setTimeReq("");
  }

  async function submit() {
    if (!selected || submitLoading) return;

    setSubmitError(null);
    setSubmitLoading(true);

    try {
      const r = await fetch("/api/tasting/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          slotStartIso: selected.start,
          slotEndIso: selected.end,
          tastingTypeId: typeId,
          people,
          fullName,
          email,
          phone,
          notes,
          timeReq,
        }),
      });

      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        const msg =
          r.status === 409
            ? t("modal.errors.just_booked")
            : (j?.error as string) || t("modal.errors.generic");
        setSubmitError(msg);
        return;
      }

      const j: { bookingId: string; mail?: MailResult } = await r.json();
      setSuccess({ bookingId: j.bookingId, mail: j.mail });

      await loadWeek(weekStart);
    } catch (e: unknown) {
      setSubmitError((e as Error)?.message || "Errore durante la prenotazione.");
    } finally {
      setSubmitLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const weekLabel = useMemo(() => {
    const a = weekDays[0];
    const b = weekDays[6];
    const fmt = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
    });
    return `${fmt.format(a)} – ${fmt.format(b)}`;
  }, [weekDays, locale]);

  return (
    <div className="w-full">
      {/* Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => loadWeek(addDays(weekStart, -7))}
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-[#E7E5E4] bg-white text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:text-[#1C1917] hover:shadow-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="px-5 py-3 bg-[#F5F5F4] rounded-2xl">
            <span className="text-sm font-medium text-[#1C1917]">{weekLabel}</span>
          </div>

          <button
            type="button"
            onClick={() => loadWeek(addDays(weekStart, 7))}
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl border border-[#E7E5E4] bg-white text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:text-[#1C1917] hover:shadow-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {loadingWeek && (
          <span className="text-sm text-[#8B7355] animate-pulse">{t("loading")}</span>
        )}
      </div>

      {/* Desktop: 7 Columns Grid */}
      <div className="hidden lg:block overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((d) => {
              const daySlots = slotsByDay.get(toYmd(d)) || [];
              const isToday = toYmd(d) === toYmd(new Date());

              return (
                <div
                  key={toYmd(d)}
                  className={`rounded-2xl border min-h-[380px] flex flex-col ${isToday ? "border-[#3D5A3D]/40 bg-[#3D5A3D]/[0.03]" : "border-[#E7E5E4] bg-white"
                    }`}
                >
                  {/* Day Header */}
                  <div
                    className={`px-4 py-4 border-b ${isToday ? "border-[#3D5A3D]/20" : "border-[#E7E5E4]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[11px] font-semibold tracking-[0.12em] uppercase ${isToday ? "text-[#3D5A3D]" : "text-[#8B7355]"
                          }`}
                      >
                        {new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d)}
                      </span>
                      {isToday && (
                        <span className="text-[10px] font-bold text-[#3D5A3D] bg-[#3D5A3D]/10 px-2 py-0.5 rounded-full">
                          {t("today")}
                        </span>
                      )}
                    </div>
                    <div
                      className={`mt-2 font-serif text-3xl font-light ${isToday ? "text-[#3D5A3D]" : "text-[#1C1917]"
                        }`}
                    >
                      {d.getDate()}
                    </div>
                  </div>

                  {/* Slots */}
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto">
                    {daySlots.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl mb-1">🌿</div>
                          <div className="text-xs text-[#78716C]">{t("no_slots")}</div>
                        </div>
                      </div>
                    ) : (
                      daySlots.map((s) => {
                        const isMorn = new Date(s.start).getHours() < 14;
                        // dur 60 as base minimal
                        const avail = getFirstAvailableTime(d, isMorn, 60, bookings);
                        const taken = avail === "";

                        return (
                          <button
                            key={s.start}
                            type="button"
                            onClick={() => (!taken ? openBooking(s, d) : undefined)}
                            disabled={taken}
                            className={[
                              "group w-full rounded-xl border-2 px-3 py-3.5 text-left transition-all duration-200",
                              taken
                                ? "cursor-not-allowed border-[#F0EEED] bg-[#FAFAF9]"
                                : "border-[#E7E5E4] bg-white hover:border-[#3D5A3D] hover:shadow-md hover:-translate-y-0.5",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock
                                  className={`h-4 w-4 ${taken ? "text-[#D6D3D1]" : "text-[#8B7355]"
                                    }`}
                                />
                                <span
                                  className={`text-sm font-bold ${taken ? "text-[#A8A29E]" : "text-[#1C1917]"
                                    }`}
                                >
                                  {fmtTime(s.start)}
                                </span>
                              </div>
                            </div>

                            <div
                              className={`mt-2 text-[10px] font-semibold uppercase tracking-wide ${taken ? "text-[#D6D3D1]" : "text-[#3D5A3D]"
                                }`}
                            >
                              {taken ? t("booked") : t("free")}
                            </div>

                            {taken && (
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-px w-10 bg-[#E7E5E4] rotate-[-15deg]" />
                              </div>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Premium List View */}
      <div className="lg:hidden space-y-3">
        {weekDays.map((d) => {
          const daySlots = slotsByDay.get(toYmd(d)) || [];
          const isToday = toYmd(d) === toYmd(new Date());

          if (daySlots.length === 0) return null;

          return (
            <div
              key={toYmd(d)}
              className={`rounded-2xl border overflow-hidden ${isToday ? "border-[#3D5A3D]/30 bg-[#3D5A3D]/[0.02]" : "border-[#E7E5E4] bg-white"
                }`}
            >
              {/* Mobile Day Header */}
              <div
                className={`px-4 py-3 border-b flex items-center justify-between ${isToday ? "border-[#3D5A3D]/20 bg-[#3D5A3D]/5" : "border-[#E7E5E4]"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-serif text-2xl font-light ${isToday ? "text-[#3D5A3D]" : "text-[#1C1917]"
                      }`}
                  >
                    {d.getDate()}
                  </span>
                  <div>
                    <span
                      className={`block text-xs font-semibold tracking-wide uppercase ${isToday ? "text-[#3D5A3D]" : "text-[#8B7355]"
                        }`}
                    >
                      {new Intl.DateTimeFormat(locale, { weekday: "long" }).format(d)}
                    </span>
                    <span className="text-[10px] text-[#A8A29E]">
                      {new Intl.DateTimeFormat(locale, { month: "long" }).format(d)}
                    </span>
                  </div>
                </div>
                {isToday && (
                  <span className="text-[10px] font-bold text-[#3D5A3D] bg-white px-2.5 py-1 rounded-full border border-[#3D5A3D]/20">
                    {t("today")}
                  </span>
                )}
              </div>

              {/* Mobile Slots */}
              <div className="p-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {daySlots.map((s) => {
                    const isMorn = new Date(s.start).getHours() < 14;
                    const avail = getFirstAvailableTime(d, isMorn, 60, bookings);
                    const taken = avail === "";

                    return (
                      <button
                        key={s.start}
                        type="button"
                        onClick={() => (!taken ? openBooking(s, d) : undefined)}
                        disabled={taken}
                        className={[
                          "relative rounded-xl border-2 px-2 py-3 text-center transition-all duration-200",
                          taken
                            ? "cursor-not-allowed border-[#F0EEED] bg-[#FAFAF9]"
                            : "border-[#E7E5E4] bg-white hover:border-[#3D5A3D] active:scale-[0.98] shadow-sm",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <Clock
                            className={`h-3 w-3 ${taken ? "text-[#D6D3D1]" : "text-[#8B7355]"
                              }`}
                          />
                          <span
                            className={`text-sm font-bold ${taken ? "text-[#A8A29E]" : "text-[#1C1917]"
                              }`}
                          >
                            {fmtTime(s.start)}
                          </span>
                        </div>

                        <div
                          className={`mt-1.5 text-[9px] font-semibold uppercase tracking-wide ${taken ? "text-[#D6D3D1]" : "text-[#3D5A3D]"
                            }`}
                        >
                          {taken ? t("booked") : t("free")}
                        </div>

                        {taken && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="h-px w-8 bg-[#E7E5E4] rotate-[-15deg]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {weekDays.every((d) => (slotsByDay.get(toYmd(d)) || []).length === 0) && (
        <div className="mt-16 text-center py-16 bg-[#F5F5F4] rounded-3xl">
          <div className="text-4xl mb-3">🌿</div>
          <div className="font-serif text-xl text-[#1C1917] mb-1">
            {t("empty_state.title")}
          </div>
          <div className="text-[#57534E]">{t("empty_state.desc")}</div>
        </div>
      )}

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1917]/60 px-3 pb-24 pt-3 backdrop-blur-sm sm:p-6 sm:pb-12">
          <div className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-[#FDFCF8] shadow-2xl sm:max-h-[75vh]">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between border-b border-[#E7E5E4] bg-white/80 px-4 py-3.5 backdrop-blur sm:px-6 sm:py-5">
            <div>
              <div className="font-serif text-lg sm:text-xl font-light tracking-tight text-[#1C1917]">
                {t("modal.title")}
              </div>
              {selected && selectedDay && (
                <div className="mt-0.5 text-[11px] sm:text-sm text-[#8B7355]">
                  {fmtDayFull(selectedDay)} • {fmtTime(selected.start)}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={closeModal}
              className="rounded-2xl border-[#E7E5E4] bg-white text-[#57534E] shadow-none hover:border-[#3D5A3D]/30 hover:bg-white hover:text-[#1C1917]"
              aria-label="Chiudi"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Content - Scrollable */}
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-6">
            {success ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#3D5A3D]/20 bg-[#3D5A3D]/5 px-5 py-6 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-[#3D5A3D]/10 flex items-center justify-center mb-3">
                    <svg
                      className="h-6 w-6 text-[#3D5A3D]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="font-serif text-xl font-light text-[#3D5A3D]">
                    {t("modal.success.title")}
                  </div>
                  <div className="mt-2 text-sm text-[#57534E]">
                    {t("modal.success.desc")}
                  </div>
                  <div className="mt-3 text-xs text-[#8B7355]">
                    ID:{" "}
                    <span className="font-mono font-semibold text-[#1C1917]">
                      {success.bookingId}
                    </span>
                  </div>
                </div>

                <div
                  className={[
                    "rounded-xl border px-4 py-3 text-xs text-center",
                    success.mail?.ok && success.mail.status === "sent"
                      ? "border-[#3D5A3D]/20 bg-[#3D5A3D]/5 text-[#3D5A3D]"
                      : success.mail?.ok && success.mail.status === "skipped"
                        ? "border-[#B8860B]/20 bg-[#B8860B]/5 text-[#B8860B]"
                        : success.mail && !success.mail.ok
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-[#E7E5E4] bg-[#F5F5F4] text-[#78716C]",
                  ].join(" ")}
                >
                  {(() => {
                    const m = success.mail;
                    if (!m) return t("modal.success.title"); // Fallback
                    if (m.ok && m.status === "sent") return t("modal.success.mail_sent");
                    if (m.ok && m.status === "skipped") return t("modal.success.mail_skipped");
                    return t("modal.success.mail_error");
                  })()}
                </div>

                <Button
                  type="button"
                  onClick={closeModal}
                  className="h-11 w-full rounded-xl bg-[#3D5A3D] text-sm font-medium text-white hover:bg-[#2D4A2D]"
                >
                  {t("modal.close")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {selected && selectedDay && (
                  <Card className="overflow-hidden rounded-[22px] border-[#d8e3d4] bg-[linear-gradient(180deg,rgba(245,249,243,0.96)_0%,rgba(239,246,236,0.94)_100%)] shadow-none">
                    <CardContent className="flex items-center gap-3 p-3.5 sm:p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#3D5A3D]/10 text-[#3D5A3D]">
                        <CalendarCheck className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6f7f61]">
                          {t("modal.form.selected_date")}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-[#1C1917] sm:text-[15px]">
                          {fmtDayFull(selectedDay)} • {fmtTime(selected.start)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2.5">
                  <Label>{t("modal.form.type_label")}</Label>
                  <div role="radiogroup" aria-label={t("modal.form.type_label")} className="grid gap-2">
                    {props.tastingTypes.map((tastingType, idx) => {
                      const accents = ["olive", "gold", "terracotta"] as const;
                      const accent = accents[idx % 3];
                      const accentClass =
                        accent === "olive"
                          ? "border-[#d8e3d4] bg-[#f5f9f3] text-[#3D5A3D]"
                          : accent === "gold"
                            ? "border-[#ecdcb4] bg-[#fcf7eb] text-[#b17a10]"
                            : "border-[#e5d7cc] bg-[#faf4ef] text-[#8B7355]";
                      const isSelected = typeId === tastingType.id;

                      return (
                        <Button
                          key={tastingType.id}
                          type="button"
                          variant="outline"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setTypeId(tastingType.id)}
                          className={[
                            "h-auto w-full justify-start rounded-[22px] border px-3.5 py-3 text-left shadow-none sm:px-4",
                            isSelected
                              ? "border-[#3D5A3D]/35 bg-white ring-2 ring-[#3D5A3D]/8"
                              : "border-[#E7E5E4] bg-white hover:border-[#d9d4cc] hover:bg-[#fffdf9]",
                          ].join(" ")}
                        >
                          <span className="flex min-w-0 flex-1 items-start gap-3">
                            <span
                              className={[
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
                                isSelected ? "border-[#3D5A3D] bg-[#3D5A3D]" : "border-[#d6d3d1] bg-white",
                              ].join(" ")}
                              aria-hidden="true"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-white" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-serif text-[15px] font-light text-[#1C1917] sm:text-base">
                                {tastingType.title}
                              </span>
                              <span className="mt-1 block whitespace-normal text-[11px] leading-snug text-[#57534E] sm:text-xs">
                                {tastingType.subtitle}
                              </span>
                            </span>
                          </span>
                          <Badge
                            className={[
                              "ml-3 shrink-0 rounded-xl border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] shadow-none",
                              accentClass,
                            ].join(" ")}
                          >
                            {tastingType.durationMinutes} min
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Card className="rounded-[22px] border-[#E7E5E4] bg-[linear-gradient(180deg,#fffdf9_0%,#faf7f2_100%)] shadow-none">
                  <CardContent className="space-y-4 p-3.5 sm:p-4">
                    <div className="space-y-2.5">
                      <Label>{t("modal.form.people_label")}</Label>
                      <div className="flex items-center gap-2.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setPeople(Math.max(1, people - 1))}
                          disabled={people <= 1}
                          className="h-11 w-11 rounded-xl border-[#E7E5E4] bg-white text-[#57534E] shadow-none hover:border-[#3D5A3D]/30 hover:bg-white hover:text-[#1C1917]"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-[#E7E5E4] bg-white px-4">
                          <Users className="h-4 w-4 text-[#8B7355]" />
                          <span className="text-lg font-semibold text-[#1C1917]">{people}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setPeople(Math.min(20, people + 1))}
                          disabled={people >= 20}
                          className="h-11 w-11 rounded-xl border-[#E7E5E4] bg-white text-[#57534E] shadow-none hover:border-[#3D5A3D]/30 hover:bg-white hover:text-[#1C1917]"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                      <div className="min-w-0 space-y-2 overflow-hidden sm:col-span-2">
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <Label htmlFor="tasting-time">{t("modal.form.time_label")}</Label>
                          {timeReqConflict && suggestedTime ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setTimeReq(suggestedTime)}
                              className="h-auto min-w-0 justify-start whitespace-normal px-0 py-0 text-left text-[11px] font-semibold leading-tight text-[#3D5A3D] hover:bg-transparent hover:text-[#2D4A2D] sm:text-xs"
                            >
                              {t("modal.form.use_suggestion", { time: suggestedTime })}
                            </Button>
                          ) : null}
                        </div>
                        <Input
                          id="tasting-time"
                          type="time"
                          value={timeReq}
                          onChange={(e) => setTimeReq(e.target.value)}
                          aria-invalid={!!timeReqConflict}
                          className={timeReqConflict ? "max-w-full border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/15" : "max-w-full"}
                        />
                        {timeReqConflict && (
                          <div className="text-[11px] font-semibold leading-snug text-red-600">
                            {typeof timeReqConflict === "string" ? timeReqConflict : "Attenzione: sovrapposizione."}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="tasting-name">{t("modal.form.name_label")}</Label>
                        <Input
                          id="tasting-name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t("modal.form.name_placeholder")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tasting-email">{t("modal.form.email_label")}</Label>
                        <Input
                          id="tasting-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("modal.form.email_placeholder")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tasting-phone">{t("modal.form.phone_label")}</Label>
                        <Input
                          id="tasting-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t("modal.form.phone_placeholder")}
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="tasting-notes">{t("modal.form.notes_label")}</Label>
                        <Textarea
                          id="tasting-notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder={t("modal.form.notes_placeholder")}
                          rows={3}
                          className="resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {submitError ? (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800">
                    {submitError}
                  </div>
                ) : null}

                <div className="sticky bottom-0 -mx-4 mt-1 flex flex-col-reverse gap-3 border-t border-[#E7E5E4] bg-[#FDFCF8]/95 px-4 pb-1 pt-3 backdrop-blur sm:static sm:mx-0 sm:border-t-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="rounded-2xl border-[#E7E5E4] bg-white px-5 text-sm font-medium text-[#57534E] shadow-none hover:border-[#3D5A3D]/30 hover:bg-white hover:text-[#1C1917]"
                  >
                    {t("modal.close")}
                  </Button>
                  <Button
                    type="button"
                    onClick={submit}
                    disabled={
                      submitLoading ||
                      !selected ||
                      !fullName.trim() ||
                      !email.trim() ||
                      !phone.trim() ||
                      !timeReq ||
                      !!timeReqConflict
                    }
                    className={[
                      "rounded-2xl bg-[#3D5A3D] px-5 text-sm font-medium text-white",
                      submitLoading ||
                        !selected ||
                        !fullName.trim() ||
                        !email.trim() ||
                        !phone.trim() ||
                        !timeReq ||
                        !!timeReqConflict
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-[#2D4A2D]",
                    ].join(" ")}
                  >
                    {submitLoading ? t("modal.form.submitting") : t("modal.form.submit")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      ) : null}
    </div>
  );
}
