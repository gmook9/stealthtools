/**
 * Pure helpers around date / epoch conversion. No DOM or React dependencies.
 */

export type ParsedTimestamp = {
  date: Date;
  epochSeconds: number;
  epochMillis: number;
  iso: string;
};

export function parseEpochInput(raw: string): ParsedTimestamp | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const numeric = Number(trimmed);
  if (!Number.isFinite(numeric)) return null;

  // 13+ digit numeric inputs are treated as milliseconds, otherwise seconds.
  const ms = Math.abs(numeric) > 1e12 || trimmed.replace(/^-/, "").length > 10
    ? numeric
    : numeric * 1000;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return null;
  return formatTimestamp(date);
}

export function parseDateString(raw: string): ParsedTimestamp | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return null;
  return formatTimestamp(date);
}

export function formatTimestamp(date: Date): ParsedTimestamp {
  return {
    date,
    epochSeconds: Math.floor(date.getTime() / 1000),
    epochMillis: date.getTime(),
    iso: date.toISOString(),
  };
}
