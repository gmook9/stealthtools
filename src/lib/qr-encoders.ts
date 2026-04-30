/**
 * Pure encoders that turn structured form input into the canonical text
 * payload that gets embedded in a QR code. No DOM, no IO, no QR rendering.
 */

const escapeWifi = (value: string): string =>
  value.replace(/[\\;,:"]/g, (match) => `\\${match}`);

const escapeVCard = (value: string): string =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

export const formatIcsDate = (value: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
};

export type WifiInput = {
  ssid: string;
  security: "wpa" | "wep" | "nopass";
  password: string;
  hidden: boolean;
};

export const encodeWifi = (input: WifiInput): string => {
  if (!input.ssid.trim()) return "";
  const type = input.security === "nopass" ? "nopass" : input.security.toUpperCase();
  const parts = [
    `T:${type}`,
    `S:${escapeWifi(input.ssid.trim())}`,
    input.security !== "nopass" ? `P:${escapeWifi(input.password)}` : "",
    input.hidden ? "H:true" : "",
  ].filter(Boolean);
  return `WIFI:${parts.join(";")};`;
};

export type ContactInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
  website: string;
  address: string;
};

export const encodeVCard = (input: ContactInput): string => {
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0"];
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  if (first || last) {
    lines.push(`N:${escapeVCard(last)};${escapeVCard(first)};;;`);
    lines.push(`FN:${escapeVCard(`${first} ${last}`.trim())}`);
  }
  if (input.phone.trim()) lines.push(`TEL:${escapeVCard(input.phone.trim())}`);
  if (input.email.trim()) lines.push(`EMAIL:${escapeVCard(input.email.trim())}`);
  if (input.company.trim()) lines.push(`ORG:${escapeVCard(input.company.trim())}`);
  if (input.title.trim()) lines.push(`TITLE:${escapeVCard(input.title.trim())}`);
  if (input.website.trim()) lines.push(`URL:${escapeVCard(input.website.trim())}`);
  if (input.address.trim()) lines.push(`ADR:;;${escapeVCard(input.address.trim())};;;;`);
  lines.push("END:VCARD");
  return lines.length > 3 ? lines.join("\n") : "";
};

export type EmailInput = {
  address: string;
  subject: string;
  body: string;
};

export const encodeEmail = (input: EmailInput): string => {
  if (!input.address.trim()) return "";
  const params = new URLSearchParams();
  if (input.subject.trim()) params.set("subject", input.subject.trim());
  if (input.body.trim()) params.set("body", input.body.trim());
  const suffix = params.toString();
  return `mailto:${input.address.trim()}${suffix ? `?${suffix}` : ""}`;
};

export const encodePhone = (phone: string): string =>
  phone.trim() ? `tel:${phone.trim()}` : "";

export type SmsInput = { phone: string; message: string };
export const encodeSms = (input: SmsInput): string =>
  input.phone.trim() ? `SMSTO:${input.phone.trim()}:${input.message.trim()}` : "";

export type LocationInput = { latitude: string; longitude: string };
export const encodeLocation = (input: LocationInput): string => {
  const lat = input.latitude.trim();
  const lon = input.longitude.trim();
  if (!lat || !lon) return "";
  if (Number.isNaN(Number(lat)) || Number.isNaN(Number(lon))) return "";
  return `geo:${lat},${lon}`;
};

export type EventInput = {
  title: string;
  location: string;
  start: string;
  end: string;
  description: string;
};

export const encodeEvent = (input: EventInput): string => {
  const start = formatIcsDate(input.start);
  const end = formatIcsDate(input.end);
  if (!input.title.trim() && !start && !end) return "";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    input.title.trim() ? `SUMMARY:${escapeVCard(input.title.trim())}` : "",
    input.location.trim() ? `LOCATION:${escapeVCard(input.location.trim())}` : "",
    start ? `DTSTART:${start}` : "",
    end ? `DTEND:${end}` : "",
    input.description.trim() ? `DESCRIPTION:${escapeVCard(input.description.trim())}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\n");
};

export type CryptoInput = {
  network: "bitcoin" | "ethereum";
  address: string;
  amount: string;
};

export const encodeCrypto = (input: CryptoInput): string => {
  const address = input.address.trim();
  if (!address) return "";
  const amount = input.amount.trim();
  const param = amount
    ? `?${input.network === "bitcoin" ? "amount" : "value"}=${encodeURIComponent(amount)}`
    : "";
  return `${input.network}:${address}${param}`;
};

export const sanitizeQrFileName = (value: string): string => {
  const slug = value
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "qrcode";
};
