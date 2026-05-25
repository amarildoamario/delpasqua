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
    title: "Visita e degustazione",
    subtitle: "Vieni a trovarci direttamente in Frantoio a Monte San savino e scopri tutto quello che c'è da sapere su l'olio extravergine di oliva e sulle olive.",
    durationMinutes: 60,
    priceFrom: "da €20/persona",
    includes: [
      "Coltivazione dell'olivo e le diverse varietà tipiche della zona",
      "Metodi di coltivazione, raccolta, produzione e conservazione",
      "Assaggio guidato per riconoscere qualità sensoriali ed eventuali difetti",
      "Degustazione dei nostri oli abbinati a bruschetta con pane macinato a pietra, verdure fresche in pinzimonio e calice di Rosso di Sangiovese",
    ],
  },
  {
    id: "premium",
    title: "Esperienza in campo",
    subtitle: "Un'esperienza unica nell'oliveto a Pozzo della Chiana con pic-nic BBQ e molitura in frantoio.",
    durationMinutes: 240,
    priceFrom: "su richiesta",
    includes: [
      "Accoglienza di Marta nell'oliveto con vista sul Tempio di Santo Stefano della Vittoria",
      "Raccolta manuale tradizionale delle olive con pettinino e teli",
      "Pranzo pic-nic con barbecue direttamente nell'oliveto tra gli ulivi",
      "Visita al frantoio con molitura delle olive appena raccolte ed estrazione a freddo",
      "Degustazione finale di olio extravergine e aromatizzati con bruschetta",
    ],
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