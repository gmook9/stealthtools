import { describe, expect, it } from "vitest";
import { dateToJde, parseJdeDate } from "@/lib/jde-date";

describe("jde-date", () => {
  it("parses 110131 as May 11, 2010", () => {
    const result = parseJdeDate("110131");
    expect(result).not.toBeNull();
    expect(result!.year).toBe(2010);
    expect(result!.dayOfYear).toBe(131);
    expect(result!.iso).toBe("2010-05-11");
  });

  it("parses leap-year day 366", () => {
    const result = parseJdeDate("124366");
    expect(result).not.toBeNull();
    expect(result!.iso).toBe("2024-12-31");
  });

  it("rejects malformed input", () => {
    expect(parseJdeDate("abc")).toBeNull();
    expect(parseJdeDate("1234")).toBeNull();
    expect(parseJdeDate("110400")).toBeNull(); // day-of-year out of range
  });

  it("converts a Date back to JDE", () => {
    expect(dateToJde(new Date(Date.UTC(2024, 0, 1)))).toBe("124001");
    expect(dateToJde(new Date(Date.UTC(2010, 4, 11)))).toBe("110131");
    expect(dateToJde(new Date(Date.UTC(1999, 11, 31)))).toBe("099365");
  });

  it("round-trips a Gregorian -> JDE -> Gregorian", () => {
    const date = new Date(Date.UTC(2026, 3, 30));
    const jde = dateToJde(date);
    const result = parseJdeDate(jde);
    expect(result!.iso).toBe("2026-04-30");
  });
});
