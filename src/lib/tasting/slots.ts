export type TastingType = {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  priceFrom?: string;
  includes: string[];
};

export type WeeklySlotRule = {
  dow: number; // 0=Sun ... 6=Sat
  time: string; // "HH:MM"
  durationMinutes: number;
};

const defaultTypes: TastingType[] = [
  {
    id: "classica",
    title: "Degustazione Classica",
    subtitle: "Introduzione agli oli Delpasqua con assaggio guidato.",
    durationMinutes: 60,
    priceFrom: "da €20/persona",
    includes: ["Assaggio di 3 oli", "Pane & acqua", "Cultivar e frangitura"],
  },
  {
    id: "premium",
    title: "Degustazione Premium",
    subtitle: "Percorso completo con abbinamenti e note sensoriali.",
    durationMinutes: 90,
    priceFrom: "da €35/persona",
    includes: [
      "Assaggio di 5 oli",
      "Abbinamenti (pane / pomodoro / formaggi)",
      "Mini tour del frantoio (se disponibile)",
    ],
  },
  {
    id: "privata",
    title: "Degustazione Privata",
    subtitle: "Esperienza su misura per gruppi e occasioni speciali.",
    durationMinutes: 90,
    priceFrom: "su richiesta",
    includes: ["Percorso personalizzato", "Opzione aperitivo", "Opzione regalo / evento"],
  },
];

const defaultWeeklyRules: WeeklySlotRule[] = [
  { dow: 2, time: "10:30", durationMinutes: 90 },
  { dow: 2, time: "16:00", durationMinutes: 90 },
  { dow: 3, time: "10:30", durationMinutes: 90 },
  { dow: 3, time: "16:00", durationMinutes: 90 },
  { dow: 4, time: "10:30", durationMinutes: 90 },
  { dow: 4, time: "16:00", durationMinutes: 90 },
  { dow: 5, time: "10:30", durationMinutes: 90 },
  { dow: 5, time: "16:00", durationMinutes: 90 },
  { dow: 6, time: "10:30", durationMinutes: 90 },
];

function safeParseJson<T>(raw: string | undefined | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function getTastingTypes(): TastingType[] {
  const fromEnv = safeParseJson<TastingType[]>(process.env.TASTINGS_TYPES_JSON);
  return Array.isArray(fromEnv) && fromEnv.length ? fromEnv : defaultTypes;
}

export function getWeeklySlotRules(): WeeklySlotRule[] {
  const fromEnv = safeParseJson<WeeklySlotRule[]>(process.env.TASTINGS_SLOTS_JSON);
  return Array.isArray(fromEnv) && fromEnv.length ? fromEnv : defaultWeeklyRules;
}

export function getWeekStartMonday(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const dow = x.getDay();
  const diff = (dow + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function buildWeekSlots(weekStartMonday: Date): { start: Date; end: Date }[] {
  const rules = getWeeklySlotRules();
  const slots: { start: Date; end: Date }[] = [];

  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStartMonday, i);
    const dow = day.getDay();

    for (const r of rules) {
      if (r.dow !== dow) continue;
      const [hh, mm] = r.time.split(":").map((n) => parseInt(n, 10));
      const start = new Date(day);
      start.setHours(hh || 0, mm || 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + (r.durationMinutes || 90));
      slots.push({ start, end });
    }
  }

  slots.sort((a, b) => a.start.getTime() - b.start.getTime());
  return slots;
}