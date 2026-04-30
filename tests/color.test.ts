import { describe, expect, it } from "vitest";
import {
  hslToRgb,
  parseHex,
  parseHslString,
  parseRgbString,
  rgbToHex,
  rgbToHsl,
} from "@/lib/color";

describe("color", () => {
  it("parses 6-digit hex", () => {
    expect(parseHex("#ff8040")).toEqual({ r: 255, g: 128, b: 64 });
  });

  it("parses 3-digit hex", () => {
    expect(parseHex("#fff")).toEqual({ r: 255, g: 255, b: 255 });
  });

  it("rejects invalid hex", () => {
    expect(parseHex("#zz0000")).toBeNull();
    expect(parseHex("notacolor")).toBeNull();
  });

  it("converts rgb -> hex", () => {
    expect(rgbToHex({ r: 255, g: 128, b: 64 })).toBe("#ff8040");
  });

  it("round-trips rgb -> hsl -> rgb", () => {
    const start = { r: 200, g: 100, b: 50 };
    const back = hslToRgb(rgbToHsl(start));
    expect(back.r).toBeGreaterThanOrEqual(199);
    expect(back.r).toBeLessThanOrEqual(201);
    expect(back.g).toBeGreaterThanOrEqual(99);
    expect(back.g).toBeLessThanOrEqual(101);
    expect(back.b).toBeGreaterThanOrEqual(49);
    expect(back.b).toBeLessThanOrEqual(51);
  });

  it("parses rgb() and hsl() strings", () => {
    expect(parseRgbString("rgb(10, 20, 30)")).toEqual({ r: 10, g: 20, b: 30 });
    expect(parseHslString("hsl(180, 50%, 50%)")).toEqual({ h: 180, s: 50, l: 50 });
  });

  it("handles black and white in HSL", () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 });
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 });
  });
});
