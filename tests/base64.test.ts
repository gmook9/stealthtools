import { describe, expect, it } from "vitest";
import { decodeBase64Utf8, encodeBase64Utf8 } from "@/lib/base64";

describe("base64", () => {
  it("round-trips ASCII", () => {
    const text = "Hello workplace!";
    expect(decodeBase64Utf8(encodeBase64Utf8(text))).toBe(text);
  });

  it("round-trips UTF-8", () => {
    const text = "héllo · 世界 · 🌍";
    const encoded = encodeBase64Utf8(text);
    expect(decodeBase64Utf8(encoded)).toBe(text);
  });

  it("ignores whitespace when decoding", () => {
    const encoded = encodeBase64Utf8("hello");
    const padded = encoded.split("").join(" ");
    expect(decodeBase64Utf8(padded)).toBe("hello");
  });
});
