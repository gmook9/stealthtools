import { describe, expect, it } from "vitest";
import { webcrypto } from "node:crypto";
import {
  buildAlphabet,
  estimateEntropyBits,
  generatePassword,
  PASSWORD_SETS,
} from "@/lib/password";

const cryptoSource = webcrypto as unknown as Crypto;

describe("password", () => {
  it("builds an alphabet from selected character sets", () => {
    const alphabet = buildAlphabet({
      lower: true,
      upper: false,
      digits: true,
      symbols: false,
      excludeAmbiguous: false,
    });
    expect(alphabet).toBe(PASSWORD_SETS.lower + PASSWORD_SETS.digits);
  });

  it("removes ambiguous characters when requested", () => {
    const alphabet = buildAlphabet({
      lower: true,
      upper: true,
      digits: true,
      symbols: false,
      excludeAmbiguous: true,
    });
    expect(alphabet).not.toMatch(/[O0Il1|`'"]/);
  });

  it("generates a password of the requested length using only the alphabet", () => {
    const options = {
      length: 24,
      lower: true,
      upper: true,
      digits: true,
      symbols: false,
      excludeAmbiguous: false,
    };
    const password = generatePassword(options, cryptoSource);
    expect(password).toHaveLength(24);
    const alphabet = buildAlphabet(options);
    for (const char of password) {
      expect(alphabet.includes(char)).toBe(true);
    }
  });

  it("returns empty string when no character set is selected", () => {
    const password = generatePassword(
      { length: 10, lower: false, upper: false, digits: false, symbols: false, excludeAmbiguous: false },
      cryptoSource,
    );
    expect(password).toBe("");
  });

  it("estimates entropy using log2", () => {
    expect(estimateEntropyBits(20, 64)).toBe(120);
    expect(estimateEntropyBits(0, 64)).toBe(0);
    expect(estimateEntropyBits(20, 1)).toBe(0);
  });
});
