import { describe, expect, it } from "vitest";
import { parseDateString, parseEpochInput } from "@/lib/timestamp";

describe("timestamp", () => {
  it("parses epoch seconds", () => {
    const result = parseEpochInput("1761000000");
    expect(result).not.toBeNull();
    expect(result!.epochSeconds).toBe(1761000000);
    expect(result!.epochMillis).toBe(1761000000000);
    expect(result!.iso).toBe(new Date(1761000000000).toISOString());
  });

  it("parses epoch milliseconds (13 digits)", () => {
    const result = parseEpochInput("1761000000000");
    expect(result).not.toBeNull();
    expect(result!.epochSeconds).toBe(1761000000);
  });

  it("returns null for blank or non-numeric epoch", () => {
    expect(parseEpochInput("")).toBeNull();
    expect(parseEpochInput("abc")).toBeNull();
  });

  it("parses ISO 8601 date strings", () => {
    const result = parseDateString("2025-10-21T00:00:00Z");
    expect(result).not.toBeNull();
    expect(result!.epochSeconds).toBe(Math.floor(Date.parse("2025-10-21T00:00:00Z") / 1000));
  });

  it("returns null for unparseable date string", () => {
    expect(parseDateString("not-a-date")).toBeNull();
  });
});
