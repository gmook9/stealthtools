/**
 * Pure password generation helpers.
 *
 * Randomness MUST come from a Web Crypto compatible source so the same
 * code is testable in Node 20+ (which provides global `crypto`).
 */

export const PASSWORD_SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

export const AMBIGUOUS = /[O0Il1|`'"]/g;

export type PasswordOptions = {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

export function buildAlphabet(options: Omit<PasswordOptions, "length">): string {
  let alphabet = "";
  if (options.lower) alphabet += PASSWORD_SETS.lower;
  if (options.upper) alphabet += PASSWORD_SETS.upper;
  if (options.digits) alphabet += PASSWORD_SETS.digits;
  if (options.symbols) alphabet += PASSWORD_SETS.symbols;
  if (options.excludeAmbiguous) alphabet = alphabet.replace(AMBIGUOUS, "");
  return alphabet;
}

export function generatePassword(
  options: PasswordOptions,
  randomSource: Crypto = globalThis.crypto,
): string {
  const alphabet = buildAlphabet(options);
  if (!alphabet || options.length <= 0) return "";

  const bytes = new Uint32Array(options.length);
  randomSource.getRandomValues(bytes);

  let result = "";
  for (let index = 0; index < options.length; index += 1) {
    result += alphabet[bytes[index] % alphabet.length];
  }
  return result;
}

export function estimateEntropyBits(length: number, alphabetSize: number): number {
  if (alphabetSize <= 1 || length <= 0) return 0;
  return Math.round(length * Math.log2(alphabetSize));
}
