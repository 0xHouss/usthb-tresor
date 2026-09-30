// Pure helpers for the admin dashboard.

const DAY_MS = 24 * 60 * 60 * 1000;

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Africa/Algiers",
});

/** Calendar day of an instant in Algiers time, as "YYYY-MM-DD". */
export const dayKey = (date: Date) => dayKeyFormat.format(date);

/** The last `days` calendar days (Algiers time) up to and including `now`'s, oldest first. */
export function lastDays(days: number, now = new Date()): string[] {
  // Algiers is UTC+1 all year (no DST), so stepping back 24h always lands on the previous day.
  return Array.from({ length: days }, (_, i) => dayKey(new Date(now.getTime() - (days - 1 - i) * DAY_MS)));
}

/** The instant a "YYYY-MM-DD" day starts in Algiers time. */
export const startOfDay = (key: string) => new Date(`${key}T00:00:00+01:00`);

export type DailyCount = { day: string; count: number };

/** One entry per day in `days`, taking counts from `rows` and zero elsewhere. */
export function fillDays(days: string[], rows: DailyCount[]): DailyCount[] {
  const counts = new Map(rows.map(row => [row.day, row.count]));
  return days.map(day => ({ day, count: counts.get(day) ?? 0 }));
}

/** Smallest "nice" axis maximum (1, 2 or 5 × 10^k) at or above `value`; 1 for empty data. */
export function niceCeil(value: number): number {
  if (value <= 1) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find(m => m * magnitude >= value)!;
  return step * magnitude;
}


/** Compact figure for stat tiles, e.g. 1284 → "1,3 k" in French or "1.3K" in English. */
export const formatCompact = (value: number, locale: string) =>
  new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);

/** Short label of a "YYYY-MM-DD" day, e.g. "30 sept." in French or "Sep 30" in English. */
export const formatDay = (key: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${key}T00:00:00Z`));
