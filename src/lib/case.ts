/**
 * Pure helpers for case conversion. Splits a string into words at case
 * boundaries and common separators, then reassembles in the requested style.
 */

export function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/[_\-./\\]+/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export const toCamel = (words: string[]): string =>
  words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");

export const toPascal = (words: string[]): string =>
  words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");

export const toSnake = (words: string[]): string =>
  words.map((word) => word.toLowerCase()).join("_");

export const toKebab = (words: string[]): string =>
  words.map((word) => word.toLowerCase()).join("-");

export const toConstant = (words: string[]): string =>
  words.map((word) => word.toUpperCase()).join("_");

export const toTitle = (words: string[]): string =>
  words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");

export const toSentence = (words: string[]): string => {
  if (words.length === 0) return "";
  const lower = words.map((word) => word.toLowerCase());
  lower[0] = lower[0].charAt(0).toUpperCase() + lower[0].slice(1);
  return lower.join(" ");
};
