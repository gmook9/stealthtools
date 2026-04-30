/**
 * Pure helpers for the regex tester. Bounded execution so a runaway
 * pattern can't lock the browser tab.
 */

export const ALLOWED_FLAGS = /^[gimsuy]{0,6}$/;
export const MAX_INPUT_LENGTH = 50_000;
export const MAX_MATCHES = 500;

export type RegexMatch = {
  match: string;
  index: number;
  groups: string[];
};

export type RegexResult =
  | { ok: true; matches: RegexMatch[]; truncated: boolean }
  | { ok: false; error: string };

export function runRegex(pattern: string, flags: string, input: string): RegexResult {
  if (!pattern) return { ok: true, matches: [], truncated: false };
  if (input.length > MAX_INPUT_LENGTH) {
    return { ok: false, error: `Input exceeds ${MAX_INPUT_LENGTH.toLocaleString()} characters.` };
  }
  if (!ALLOWED_FLAGS.test(flags)) {
    return { ok: false, error: "Flags may only contain: g, i, m, s, u, y" };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid regex" };
  }

  const matches: RegexMatch[] = [];
  let truncated = false;
  let safety = 0;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    safety += 1;
    if (safety > MAX_MATCHES) {
      truncated = true;
      break;
    }

    matches.push({
      match: match[0],
      index: match.index,
      groups: match.slice(1).map((group) => (group === undefined ? "" : group)),
    });

    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  return { ok: true, matches, truncated };
}
