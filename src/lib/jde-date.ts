/**
 * JD Edwards Julian date helpers.
 *
 * JDE stores dates as CYYDDD where:
 *   C  = century offset from 1900 (0 = 1900s, 1 = 2000s, 2 = 2100s)
 *   YY = year within the century (00-99)
 *   DDD = day of the year (001-366)
 *
 * 110131 -> 1 10 131 -> May 11, 2010
 */

const pad = (value: number, width: number): string =>
  String(value).padStart(width, "0");

const isLeap = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const daysInYear = (year: number): number => (isLeap(year) ? 366 : 365);

export type JdeParseResult = {
  year: number;
  dayOfYear: number;
  date: Date;
  iso: string;
};

export function parseJdeDate(input: string): JdeParseResult | null {
  const trimmed = input.trim();
  if (!/^\d{5,6}$/.test(trimmed)) return null;
  const padded = trimmed.padStart(6, "0");
  const century = Number(padded.slice(0, 1));
  const yy = Number(padded.slice(1, 3));
  const ddd = Number(padded.slice(3, 6));
  const year = 1900 + century * 100 + yy;
  if (ddd < 1 || ddd > daysInYear(year)) return null;
  const date = new Date(Date.UTC(year, 0, ddd));
  if (Number.isNaN(date.getTime())) return null;
  return {
    year,
    dayOfYear: ddd,
    date,
    iso: date.toISOString().slice(0, 10),
  };
}

export function dateToJde(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getUTCFullYear();
  if (year < 1900 || year > 2899) return "";
  const start = Date.UTC(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - start) / 86_400_000) + 1;
  const century = Math.floor((year - 1900) / 100);
  const yy = (year - 1900) % 100;
  return `${century}${pad(yy, 2)}${pad(dayOfYear, 3)}`;
}

export function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  return Math.floor((date.getTime() - start) / 86_400_000) + 1;
}
