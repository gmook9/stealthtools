import { describe, expect, it } from "vitest";
import { decodeJwt } from "@/lib/jwt";

// Sample non-secret JWT (from jwt.io docs).
const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
  "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
  "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

describe("jwt", () => {
  it("decodes header and payload", () => {
    const result = decodeJwt(SAMPLE);
    expect((result.header as { alg: string }).alg).toBe("HS256");
    expect((result.payload as { name: string }).name).toBe("John Doe");
    expect(result.signature.length).toBeGreaterThan(0);
  });

  it("throws on malformed token", () => {
    expect(() => decodeJwt("not.a.jwt.token")).toThrow();
    expect(() => decodeJwt("invalid")).toThrow();
  });
});
