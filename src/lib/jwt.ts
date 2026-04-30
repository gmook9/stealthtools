/**
 * Pure JWT decoder. Decodes header + payload only; never validates the
 * signature.
 */

export type DecodedJwt = {
  header: unknown;
  payload: unknown;
  signature: string;
};

function base64UrlDecode(segment: string): string {
  const padded = segment + "=".repeat((4 - (segment.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");

  if (typeof atob === "function") {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  return Buffer.from(base64, "base64").toString("utf8");
}

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Token does not have three dot-separated segments.");
  }

  return {
    header: tryParse(base64UrlDecode(parts[0])),
    payload: tryParse(base64UrlDecode(parts[1])),
    signature: parts[2],
  };
}
