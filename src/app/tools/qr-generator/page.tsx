"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
  FiCalendar,
  FiCheck,
  FiCode,
  FiCopy,
  FiDownload,
  FiKey,
  FiLink,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiType,
  FiUser,
  FiWifi,
} from "react-icons/fi";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import {
  encodeCrypto,
  encodeEmail,
  encodeEvent,
  encodeLocation,
  encodePhone,
  encodeSms,
  encodeVCard,
  encodeWifi,
  sanitizeQrFileName,
} from "@/lib/qr-encoders";
import { downloadBlob } from "@/lib/download";

type QrType =
  | "url"
  | "text"
  | "wifi"
  | "contact"
  | "email"
  | "phone"
  | "sms"
  | "location"
  | "event"
  | "crypto";

type DownloadFormat = "png" | "jpeg" | "svg";

const TYPE_OPTIONS: { id: QrType; label: string; Icon: typeof FiLink }[] = [
  { id: "url", label: "URL", Icon: FiLink },
  { id: "text", label: "Text", Icon: FiType },
  { id: "wifi", label: "WiFi", Icon: FiWifi },
  { id: "contact", label: "Contact", Icon: FiUser },
  { id: "email", label: "Email", Icon: FiMail },
  { id: "phone", label: "Phone", Icon: FiPhone },
  { id: "sms", label: "SMS", Icon: FiMessageSquare },
  { id: "location", label: "Location", Icon: FiMapPin },
  { id: "event", label: "Event", Icon: FiCalendar },
  { id: "crypto", label: "Crypto", Icon: FiKey },
];

const RESOLUTIONS = [256, 512, 1024, 2048];
const MAX_PAYLOAD_LENGTH = 2000;

export default function QrGeneratorPage() {
  const [activeType, setActiveType] = useState<QrType>("url");

  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({
    ssid: "",
    security: "wpa" as "wpa" | "wep" | "nopass",
    password: "",
    hidden: false,
  });
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    website: "",
    address: "",
  });
  const [email, setEmail] = useState({ address: "", subject: "", body: "" });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sms, setSms] = useState({ phone: "", message: "" });
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [event, setEvent] = useState({
    title: "",
    location: "",
    start: "",
    end: "",
    description: "",
  });
  const [crypto, setCrypto] = useState({
    network: "bitcoin" as "bitcoin" | "ethereum",
    address: "",
    amount: "",
  });

  const [foreground, setForeground] = useState("#102927");
  const [background, setBackground] = useState("#ffffff");
  const [resolution, setResolution] = useState(1024);
  const [format, setFormat] = useState<DownloadFormat>("png");

  const [generatedValue, setGeneratedValue] = useState("");
  const [previewDataUrl, setPreviewDataUrl] = useState("");
  const [status, setStatus] = useState("Choose a type and fill in the details below.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");
  const [copied, setCopied] = useState(false);

  const draftValue = useMemo(() => {
    switch (activeType) {
      case "url":
        return url.trim();
      case "text":
        return text;
      case "wifi":
        return encodeWifi(wifi);
      case "contact":
        return encodeVCard(contact);
      case "email":
        return encodeEmail(email);
      case "phone":
        return encodePhone(phoneNumber);
      case "sms":
        return encodeSms(sms);
      case "location":
        return encodeLocation(location);
      case "event":
        return encodeEvent(event);
      case "crypto":
        return encodeCrypto(crypto);
      default:
        return "";
    }
  }, [activeType, url, text, wifi, contact, email, phoneNumber, sms, location, event, crypto]);

  const setMessage = (msg: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(msg);
    setStatusKind(kind);
  };

  useEffect(() => {
    if (!generatedValue) {
      setPreviewDataUrl("");
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(generatedValue, {
      margin: 1,
      width: resolution,
      errorCorrectionLevel: "M",
      color: { dark: foreground, light: background },
    })
      .then((url) => {
        if (!cancelled) setPreviewDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) {
          setPreviewDataUrl("");
          setMessage("Unable to render QR code. Try shortening the input.", "error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [generatedValue, foreground, background, resolution]);

  const handleGenerate = () => {
    if (!draftValue) {
      setMessage("Add some content before generating.", "error");
      return;
    }
    if (draftValue.length > MAX_PAYLOAD_LENGTH) {
      setMessage(`Payload exceeds ${MAX_PAYLOAD_LENGTH} characters.`, "error");
      return;
    }
    setGeneratedValue(draftValue);
    setMessage("QR code generated locally.", "success");
  };

  const downloadAs = async (chosen: DownloadFormat) => {
    if (!generatedValue) {
      setMessage("Generate a QR code first.", "error");
      return;
    }
    try {
      setFormat(chosen);
      const fileBase = sanitizeQrFileName(generatedValue);
      if (chosen === "svg") {
        const svg = await QRCode.toString(generatedValue, {
          margin: 1,
          width: resolution,
          errorCorrectionLevel: "M",
          color: { dark: foreground, light: background },
          type: "svg",
        });
        downloadBlob(new Blob([svg], { type: "image/svg+xml" }), `${fileBase}.svg`);
      } else {
        const mime = chosen === "jpeg" ? "image/jpeg" : "image/png";
        const ext = chosen === "jpeg" ? "jpg" : "png";
        const dataUrl = await QRCode.toDataURL(generatedValue, {
          margin: 1,
          width: resolution,
          errorCorrectionLevel: "M",
          color: { dark: foreground, light: background },
          type: mime,
        });
        const blob = await (await fetch(dataUrl)).blob();
        downloadBlob(blob, `${fileBase}.${ext}`);
      }
      setMessage(`Downloaded ${chosen.toUpperCase()}.`, "success");
    } catch {
      setMessage("Download failed.", "error");
    }
  };

  const copyImage = async () => {
    if (!previewDataUrl) return;
    try {
      const blob = await (await fetch(previewDataUrl)).blob();
      if ("ClipboardItem" in window && navigator.clipboard?.write) {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
        setMessage("Image copied to clipboard.", "success");
      } else {
        await navigator.clipboard.writeText(previewDataUrl);
        setMessage("Data URL copied to clipboard.", "success");
      }
    } catch {
      setMessage("Clipboard copy failed.", "error");
    }
  };

  const resetColors = () => {
    setForeground("#102927");
    setBackground("#ffffff");
  };

  return (
    <ToolShell
      eyebrow="Generator"
      title="QR Code Generator"
      description="Create QR codes for URLs, contact cards, WiFi networks, events, and more — rendered locally."
    >
      <div className="qr-grid">
        <div className="field-block">
          <p className="field-label">Type</p>
          <div className="qr-type-grid">
            {TYPE_OPTIONS.map((option) => {
              const Icon = option.Icon;
              const active = option.id === activeType;
              return (
                <button
                  key={option.id}
                  type="button"
                  className="qr-type-button"
                  aria-pressed={active}
                  onClick={() => setActiveType(option.id)}
                >
                  <Icon aria-hidden />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="field-block" style={{ marginTop: "1rem" }}>
            {activeType === "url" ? (
              <label className="field-block">
                <span className="field-label">URL</span>
                <input
                  className="input"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(ev) => setUrl(ev.target.value)}
                  inputMode="url"
                />
              </label>
            ) : null}

            {activeType === "text" ? (
              <label className="field-block">
                <span className="field-label">Text</span>
                <textarea
                  className="textarea"
                  rows={5}
                  value={text}
                  onChange={(ev) => setText(ev.target.value)}
                  maxLength={MAX_PAYLOAD_LENGTH}
                />
              </label>
            ) : null}

            {activeType === "wifi" ? (
              <div className="field-block" style={{ gap: "0.6rem" }}>
                <label className="field-block">
                  <span className="field-label">Network Name (SSID)</span>
                  <input
                    className="input"
                    value={wifi.ssid}
                    onChange={(ev) => setWifi({ ...wifi, ssid: ev.target.value })}
                  />
                </label>
                <div className="grid-two">
                  <label className="field-block">
                    <span className="field-label">Security</span>
                    <select
                      className="input"
                      value={wifi.security}
                      onChange={(ev) =>
                        setWifi({ ...wifi, security: ev.target.value as typeof wifi.security })
                      }
                    >
                      <option value="wpa">WPA / WPA2</option>
                      <option value="wep">WEP</option>
                      <option value="nopass">No password</option>
                    </select>
                  </label>
                  <label className="field-block">
                    <span className="field-label">Password</span>
                    <input
                      className="input"
                      type="text"
                      value={wifi.password}
                      onChange={(ev) => setWifi({ ...wifi, password: ev.target.value })}
                      disabled={wifi.security === "nopass"}
                    />
                  </label>
                </div>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={wifi.hidden}
                    onChange={(ev) => setWifi({ ...wifi, hidden: ev.target.checked })}
                  />
                  <span>Hidden network</span>
                </label>
              </div>
            ) : null}

            {activeType === "contact" ? (
              <div className="grid-two">
                {(
                  [
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["phone", "Phone"],
                    ["email", "Email"],
                    ["company", "Company"],
                    ["title", "Title"],
                    ["website", "Website"],
                    ["address", "Address"],
                  ] as const
                ).map(([field, label]) => (
                  <label key={field} className="field-block">
                    <span className="field-label">{label}</span>
                    <input
                      className="input"
                      value={contact[field]}
                      onChange={(ev) => setContact({ ...contact, [field]: ev.target.value })}
                    />
                  </label>
                ))}
              </div>
            ) : null}

            {activeType === "email" ? (
              <div className="field-block" style={{ gap: "0.6rem" }}>
                <label className="field-block">
                  <span className="field-label">Address</span>
                  <input
                    className="input"
                    type="email"
                    value={email.address}
                    onChange={(ev) => setEmail({ ...email, address: ev.target.value })}
                  />
                </label>
                <label className="field-block">
                  <span className="field-label">Subject</span>
                  <input
                    className="input"
                    value={email.subject}
                    onChange={(ev) => setEmail({ ...email, subject: ev.target.value })}
                  />
                </label>
                <label className="field-block">
                  <span className="field-label">Body</span>
                  <textarea
                    className="textarea"
                    rows={4}
                    value={email.body}
                    onChange={(ev) => setEmail({ ...email, body: ev.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {activeType === "phone" ? (
              <label className="field-block">
                <span className="field-label">Phone Number</span>
                <input
                  className="input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(ev) => setPhoneNumber(ev.target.value)}
                />
              </label>
            ) : null}

            {activeType === "sms" ? (
              <div className="field-block" style={{ gap: "0.6rem" }}>
                <label className="field-block">
                  <span className="field-label">Phone Number</span>
                  <input
                    className="input"
                    type="tel"
                    value={sms.phone}
                    onChange={(ev) => setSms({ ...sms, phone: ev.target.value })}
                  />
                </label>
                <label className="field-block">
                  <span className="field-label">Message</span>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={sms.message}
                    onChange={(ev) => setSms({ ...sms, message: ev.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {activeType === "location" ? (
              <div className="grid-two">
                <label className="field-block">
                  <span className="field-label">Latitude</span>
                  <input
                    className="input"
                    inputMode="decimal"
                    value={location.latitude}
                    onChange={(ev) => setLocation({ ...location, latitude: ev.target.value })}
                  />
                </label>
                <label className="field-block">
                  <span className="field-label">Longitude</span>
                  <input
                    className="input"
                    inputMode="decimal"
                    value={location.longitude}
                    onChange={(ev) => setLocation({ ...location, longitude: ev.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {activeType === "event" ? (
              <div className="field-block" style={{ gap: "0.6rem" }}>
                <label className="field-block">
                  <span className="field-label">Title</span>
                  <input
                    className="input"
                    value={event.title}
                    onChange={(ev) => setEvent({ ...event, title: ev.target.value })}
                  />
                </label>
                <label className="field-block">
                  <span className="field-label">Location</span>
                  <input
                    className="input"
                    value={event.location}
                    onChange={(ev) => setEvent({ ...event, location: ev.target.value })}
                  />
                </label>
                <div className="grid-two">
                  <label className="field-block">
                    <span className="field-label">Start</span>
                    <input
                      className="input"
                      type="datetime-local"
                      value={event.start}
                      onChange={(ev) => setEvent({ ...event, start: ev.target.value })}
                    />
                  </label>
                  <label className="field-block">
                    <span className="field-label">End</span>
                    <input
                      className="input"
                      type="datetime-local"
                      value={event.end}
                      onChange={(ev) => setEvent({ ...event, end: ev.target.value })}
                    />
                  </label>
                </div>
                <label className="field-block">
                  <span className="field-label">Description</span>
                  <textarea
                    className="textarea"
                    rows={3}
                    value={event.description}
                    onChange={(ev) => setEvent({ ...event, description: ev.target.value })}
                  />
                </label>
              </div>
            ) : null}

            {activeType === "crypto" ? (
              <div className="field-block" style={{ gap: "0.6rem" }}>
                <label className="field-block">
                  <span className="field-label">Network</span>
                  <select
                    className="input"
                    value={crypto.network}
                    onChange={(ev) =>
                      setCrypto({ ...crypto, network: ev.target.value as typeof crypto.network })
                    }
                  >
                    <option value="bitcoin">Bitcoin</option>
                    <option value="ethereum">Ethereum</option>
                  </select>
                </label>
                <label className="field-block">
                  <span className="field-label">Address</span>
                  <input
                    className="input"
                    value={crypto.address}
                    onChange={(ev) => setCrypto({ ...crypto, address: ev.target.value })}
                  />
                </label>
                <label className="field-block">
                  <span className="field-label">Amount (optional)</span>
                  <input
                    className="input"
                    inputMode="decimal"
                    value={crypto.amount}
                    onChange={(ev) => setCrypto({ ...crypto, amount: ev.target.value })}
                  />
                </label>
              </div>
            ) : null}
          </div>

          <div className="button-row">
            <button
              type="button"
              className="button-link"
              onClick={handleGenerate}
              disabled={!draftValue}
            >
              Generate
            </button>
          </div>
        </div>

        <div className="field-block" style={{ gap: "1rem" }}>
          <div>
            <p className="field-label">Preview</p>
            <div className="qr-preview-frame">
              {previewDataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewDataUrl}
                  alt="Generated QR code"
                  width={240}
                  height={240}
                  style={{ width: "240px", height: "240px" }}
                />
              ) : (
                <p className="meta-note" style={{ textAlign: "center" }}>
                  Enter content then click Generate to view your QR code.
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="field-label">Customize Appearance</p>
            <div className="grid-two">
              <div className="color-row">
                <input
                  type="color"
                  value={foreground}
                  onChange={(ev) => setForeground(ev.target.value)}
                  aria-label="Foreground color"
                />
                <span>Foreground {foreground.toUpperCase()}</span>
              </div>
              <div className="color-row">
                <input
                  type="color"
                  value={background}
                  onChange={(ev) => setBackground(ev.target.value)}
                  aria-label="Background color"
                />
                <span>Background {background.toUpperCase()}</span>
              </div>
            </div>
            <div className="button-row">
              <button type="button" className="button-link button-ghost" onClick={resetColors}>
                Reset Colors
              </button>
            </div>
          </div>

          <div>
            <p className="field-label">Download</p>
            <div className="grid-two">
              <label className="field-block">
                <span className="field-label">Resolution</span>
                <select
                  className="input"
                  value={resolution}
                  onChange={(ev) => setResolution(Number(ev.target.value))}
                >
                  {RESOLUTIONS.map((value) => (
                    <option key={value} value={value}>
                      {value} x {value}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-block">
                <span className="field-label">Default Format</span>
                <select
                  className="input"
                  value={format}
                  onChange={(ev) => setFormat(ev.target.value as DownloadFormat)}
                >
                  <option value="png">PNG</option>
                  <option value="jpeg">JPEG</option>
                  <option value="svg">SVG</option>
                </select>
              </label>
            </div>
            <div className="button-row">
              <button type="button" className="button-link" onClick={() => downloadAs("png")}>
                <FiDownload aria-hidden /> <span style={{ marginLeft: "0.4rem" }}>PNG</span>
              </button>
              <button
                type="button"
                className="button-link button-ghost"
                onClick={() => downloadAs("jpeg")}
              >
                <FiDownload aria-hidden /> <span style={{ marginLeft: "0.4rem" }}>JPEG</span>
              </button>
              <button
                type="button"
                className="button-link button-ghost"
                onClick={() => downloadAs("svg")}
              >
                <FiCode aria-hidden /> <span style={{ marginLeft: "0.4rem" }}>SVG</span>
              </button>
              <button type="button" className="button-link button-ghost" onClick={copyImage}>
                {copied ? <FiCheck aria-hidden /> : <FiCopy aria-hidden />}
                <span style={{ marginLeft: "0.4rem" }}>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <p className="meta-note">
              PNG &amp; JPEG use the selected resolution. SVG is vector-based.
            </p>
          </div>
        </div>
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
