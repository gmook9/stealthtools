/**
 * UTF-8 safe Base64 encode/decode without DOM dependencies (uses
 * TextEncoder / TextDecoder which are global in modern Node and browsers).
 */

function bytesToBase64(bytes: Uint8Array): string {
  if (typeof btoa === "function") {
    let binary = "";
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }
  return Buffer.from(bytes).toString("base64");
}

function base64ToBytes(value: string): Uint8Array {
  if (typeof atob === "function") {
    const binary = atob(value);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
  }
  return Uint8Array.from(Buffer.from(value, "base64"));
}

export function encodeBase64Utf8(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

export function decodeBase64Utf8(value: string): string {
  const cleaned = value.replace(/\s+/g, "");
  return new TextDecoder().decode(base64ToBytes(cleaned));
}
