import { describe, expect, it } from "vitest";
import { generateLorem } from "@/lib/lorem";

describe("lorem", () => {
  it("generates the requested number of words", () => {
    const out = generateLorem({ count: 7, unit: "words", startWithLorem: false });
    expect(out.split(/\s+/).filter(Boolean)).toHaveLength(7);
  });

  it("starts with Lorem ipsum when requested", () => {
    const out = generateLorem({ count: 10, unit: "words" });
    expect(out.toLowerCase().startsWith("lorem ipsum")).toBe(true);
  });

  it("returns the requested number of paragraphs separated by blank lines", () => {
    const out = generateLorem({ count: 3, unit: "paragraphs" });
    expect(out.split(/\n\n/)).toHaveLength(3);
  });

  it("returns empty string for count 0", () => {
    expect(generateLorem({ count: 0, unit: "words" })).toBe("");
  });

  it("is deterministic given the same seed", () => {
    const a = generateLorem({ count: 4, unit: "sentences" }, 1234);
    const b = generateLorem({ count: 4, unit: "sentences" }, 1234);
    expect(a).toBe(b);
  });
});
