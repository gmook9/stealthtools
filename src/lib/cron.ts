/**
 * Cron expression explainer. Supports the standard 5-field format:
 *   minute hour day-of-month month day-of-week
 *
 * Returns a human-readable summary of each field. Does NOT compute next-run
 * times — keep that to dedicated scheduling libraries.
 */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

type FieldSpec = {
  name: string;
  min: number;
  max: number;
  names?: string[];
};

const FIELDS: FieldSpec[] = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "day-of-month", min: 1, max: 31 },
  { name: "month", min: 1, max: 12, names: MONTHS },
  { name: "day-of-week", min: 0, max: 6, names: WEEKDAYS },
];

export type CronExplanation = {
  ok: true;
  fields: { name: string; raw: string; description: string }[];
  summary: string;
} | {
  ok: false;
  error: string;
};

function describePart(part: string, spec: FieldSpec): string {
  if (part === "*") return `every ${spec.name}`;
  if (/^\*\/\d+$/.test(part)) {
    const step = Number(part.slice(2));
    return `every ${step} ${spec.name}(s)`;
  }
  if (/^\d+(-\d+)?(\/\d+)?$/.test(part)) {
    const [range, step] = part.split("/");
    const [start, end] = range.split("-").map(Number);
    const startName = spec.names?.[start - spec.min] ?? String(start);
    if (end !== undefined) {
      const endName = spec.names?.[end - spec.min] ?? String(end);
      const stepText = step ? ` step ${step}` : "";
      return `${spec.name} ${startName} through ${endName}${stepText}`;
    }
    return `${spec.name} ${startName}`;
  }
  if (/^\d+(,\d+)+$/.test(part)) {
    const values = part.split(",").map(Number);
    const named = values.map((v) => spec.names?.[v - spec.min] ?? String(v));
    return `${spec.name} ${named.join(", ")}`;
  }
  return `unrecognized expression "${part}"`;
}

function validatePart(part: string, spec: FieldSpec): string | null {
  if (part === "*") return null;
  const numbers = part.match(/\d+/g)?.map(Number) ?? [];
  for (const n of numbers) {
    if (n < spec.min || n > spec.max) {
      return `${spec.name} value ${n} out of range (${spec.min}-${spec.max})`;
    }
  }
  return null;
}

export function explainCron(expression: string): CronExplanation {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { ok: false, error: "Cron expression must have exactly 5 fields." };
  }
  const fields = parts.map((raw, index) => ({
    name: FIELDS[index].name,
    raw,
    description: describePart(raw, FIELDS[index]),
  }));
  for (let i = 0; i < parts.length; i += 1) {
    const error = validatePart(parts[i], FIELDS[i]);
    if (error) return { ok: false, error };
  }
  const summary = `Runs ${fields[0].description}, ${fields[1].description}, on ${fields[2].description}, ${fields[3].description}, ${fields[4].description}.`;
  return { ok: true, fields, summary };
}
