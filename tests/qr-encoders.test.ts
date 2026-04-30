import { describe, expect, it } from "vitest";
import {
  encodeCrypto,
  encodeEmail,
  encodeEvent,
  encodeLocation,
  encodePhone,
  encodeSms,
  encodeVCard,
  encodeWifi,
  formatIcsDate,
  sanitizeQrFileName,
} from "@/lib/qr-encoders";

describe("qr-encoders", () => {
  it("returns empty WiFi payload when SSID is missing", () => {
    expect(encodeWifi({ ssid: "  ", security: "wpa", password: "x", hidden: false })).toBe("");
  });

  it("encodes WPA WiFi correctly", () => {
    expect(
      encodeWifi({ ssid: "Office;Net", security: "wpa", password: "Pa,ss", hidden: true }),
    ).toBe("WIFI:T:WPA;S:Office\\;Net;P:Pa\\,ss;H:true;");
  });

  it("omits password for nopass WiFi", () => {
    const out = encodeWifi({ ssid: "Guest", security: "nopass", password: "ignored", hidden: false });
    expect(out).toContain("T:nopass");
    expect(out).not.toContain("P:");
  });

  it("returns empty vCard when no fields are filled", () => {
    expect(
      encodeVCard({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: "",
        title: "",
        website: "",
        address: "",
      }),
    ).toBe("");
  });

  it("builds a vCard with FN and TEL", () => {
    const vcard = encodeVCard({
      firstName: "Ada",
      lastName: "Lovelace",
      phone: "+15551234",
      email: "",
      company: "",
      title: "",
      website: "",
      address: "",
    });
    expect(vcard).toContain("BEGIN:VCARD");
    expect(vcard).toContain("FN:Ada Lovelace");
    expect(vcard).toContain("TEL:+15551234");
    expect(vcard).toContain("END:VCARD");
  });

  it("escapes commas and semicolons in vCard fields", () => {
    const vcard = encodeVCard({
      firstName: "Grace",
      lastName: "",
      phone: "",
      email: "",
      company: "Acme, Inc.",
      title: "",
      website: "",
      address: "",
    });
    expect(vcard).toContain("ORG:Acme\\, Inc.");
  });

  it("builds mailto with subject and body", () => {
    const result = encodeEmail({ address: "a@b.com", subject: "Hi there", body: "Body text" });
    expect(result.startsWith("mailto:a@b.com?")).toBe(true);
    expect(result).toContain("subject=Hi+there");
    expect(result).toContain("body=Body+text");
  });

  it("returns empty mailto when address is blank", () => {
    expect(encodeEmail({ address: "", subject: "x", body: "y" })).toBe("");
  });

  it("encodes phone, sms, and location", () => {
    expect(encodePhone("555-1234")).toBe("tel:555-1234");
    expect(encodeSms({ phone: "555", message: "hi" })).toBe("SMSTO:555:hi");
    expect(encodeLocation({ latitude: "37.77", longitude: "-122.41" })).toBe("geo:37.77,-122.41");
  });

  it("rejects invalid latitude/longitude", () => {
    expect(encodeLocation({ latitude: "abc", longitude: "1" })).toBe("");
  });

  it("formats ICS date strings", () => {
    expect(formatIcsDate("2026-04-30T12:34:56Z")).toBe("20260430T123456Z");
    expect(formatIcsDate("not-a-date")).toBe("");
  });

  it("encodes events with summary and dtstart", () => {
    const event = encodeEvent({
      title: "Standup",
      location: "Zoom",
      start: "2026-04-30T09:00:00Z",
      end: "2026-04-30T09:30:00Z",
      description: "",
    });
    expect(event).toContain("BEGIN:VCALENDAR");
    expect(event).toContain("SUMMARY:Standup");
    expect(event).toContain("DTSTART:20260430T090000Z");
  });

  it("encodes crypto addresses", () => {
    expect(encodeCrypto({ network: "bitcoin", address: "bc1xyz", amount: "" })).toBe(
      "bitcoin:bc1xyz",
    );
    expect(encodeCrypto({ network: "ethereum", address: "0xabc", amount: "1.5" })).toBe(
      "ethereum:0xabc?value=1.5",
    );
  });

  it("sanitizes file names", () => {
    expect(sanitizeQrFileName("https://example.com/path?x=1")).toBe("https-example-com-path-x-1");
    expect(sanitizeQrFileName("!!!")).toBe("qrcode");
  });
});
