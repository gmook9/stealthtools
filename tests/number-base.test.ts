import { describe, expect, it } from "vitest";
import { convertNumber, parseInRadix, toRadix } from "@/lib/number-base";

describe("number-base", () => {
  it("converts 255 across all bases", () => {
    const out = convertNumber("255", 10);
    expect(out).toEqual({
      2: "11111111",
      8: "377",
      10: "255",
      16: "ff",
    });
  });

  it("strips known prefixes", () => {
    expect(parseInRadix("0xff", 16)).toBe(255n);
    expect(parseInRadix("0b1010", 2)).toBe(10n);
  });

  it("rejects out-of-radix digits", () => {
    expect(parseInRadix("abc", 10)).toBeNull();
    expect(parseInRadix("2", 2)).toBeNull();
  });

  it("handles BigInt-scale values", () => {
    const huge = "ffffffffffffffffffff";
    const value = parseInRadix(huge, 16);
    expect(value).not.toBeNull();
    expect(toRadix(value!, 10)).toBe("1208925819614629174706175");
  });

  it("handles negative numbers", () => {
    expect(parseInRadix("-42", 10)).toBe(-42n);
    expect(toRadix(-42n, 16)).toBe("-2a");
  });
});
