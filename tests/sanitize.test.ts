import { describe, expect, it } from "vitest";
import { sanitizeFileName } from "@/lib/sanitize";

describe("sanitize", () => {
  it("removes path separators", () => {
    expect(sanitizeFileName("a/b/c.txt")).toBe("a-b-c");
  });

  it("falls back when input collapses to nothing", () => {
    expect(sanitizeFileName("///", "fallback")).toBe("fallback");
  });

  it("strips extensions", () => {
    expect(sanitizeFileName("photo.png")).toBe("photo");
  });

  it("clips length", () => {
    const long = "a".repeat(200);
    expect(sanitizeFileName(long).length).toBeLessThanOrEqual(80);
  });
});
