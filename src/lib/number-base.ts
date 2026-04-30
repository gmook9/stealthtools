/**
 * Pure number-base conversion helpers. Uses BigInt so we can handle
 * arbitrarily large integers without loss of precision.
 */

const VALID_RADIX_PATTERNS: Record<number, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^\d+$/,
  16: /^[0-9a-fA-F]+$/,
};

export type Radix = 2 | 8 | 10 | 16;

function stripPrefix(input: string, radix: Radix): string {
  const trimmed = input.trim().replace(/_/g, "");
  if (radix === 16 && /^0x/i.test(trimmed)) return trimmed.slice(2);
  if (radix === 2 && /^0b/i.test(trimmed)) return trimmed.slice(2);
  if (radix === 8 && /^0o/i.test(trimmed)) return trimmed.slice(2);
  return trimmed;
}

export function parseInRadix(input: string, radix: Radix): bigint | null {
  const stripped = stripPrefix(input, radix);
  if (!stripped) return null;
  const negative = stripped.startsWith("-");
  const digits = negative ? stripped.slice(1) : stripped;
  if (!VALID_RADIX_PATTERNS[radix].test(digits)) return null;
  // BigInt only accepts 0x/0o/0b prefixes for radices 16/8/2.
  let value: bigint;
  try {
    if (radix === 10) value = BigInt(digits);
    else if (radix === 16) value = BigInt(`0x${digits}`);
    else if (radix === 2) value = BigInt(`0b${digits}`);
    else value = BigInt(`0o${digits}`);
  } catch {
    return null;
  }
  return negative ? -value : value;
}

export function toRadix(value: bigint, radix: Radix): string {
  if (value < 0n) return `-${(-value).toString(radix)}`;
  return value.toString(radix);
}

export function convertNumber(
  input: string,
  fromRadix: Radix,
  toRadices: Radix[] = [2, 8, 10, 16],
): Record<Radix, string> | null {
  const value = parseInRadix(input, fromRadix);
  if (value === null) return null;
  const result = {} as Record<Radix, string>;
  for (const radix of toRadices) {
    result[radix] = toRadix(value, radix);
  }
  return result;
}
