import { describe, expect, it } from "vitest";
import { runRegex } from "@/lib/regex-runner";

describe("regex-runner", () => {
  it("returns no matches for empty pattern", () => {
    const result = runRegex("", "g", "anything");
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.matches).toEqual([]);
  });

  it("rejects disallowed flags", () => {
    const result = runRegex(".", "z", "x");
    expect(result.ok).toBe(false);
  });

  it("rejects invalid pattern", () => {
    const result = runRegex("(", "g", "x");
    expect(result.ok).toBe(false);
  });

  it("returns matches with capture groups", () => {
    const result = runRegex("(\\w+)@(\\w+)", "g", "a@b c@d");
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.matches).toHaveLength(2);
      expect(result.matches[0].match).toBe("a@b");
      expect(result.matches[0].groups).toEqual(["a", "b"]);
    }
  });

  it("does not loop forever on zero-length matches", () => {
    const result = runRegex("a*", "g", "aaa");
    expect(result.ok).toBe(true);
  });

  it("rejects oversized input", () => {
    const huge = "a".repeat(50_001);
    const result = runRegex("a", "g", huge);
    expect(result.ok).toBe(false);
  });
});
