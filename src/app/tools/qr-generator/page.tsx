"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";

const MAX_INPUT_LENGTH = 2000;

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://example.org");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState(280);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const trimmed = text.trim();

      if (!trimmed) {
        setQrDataUrl("");
        setStatus("Enter text or URL to generate.");
        setStatusKind("info");
        return;
      }

      if (trimmed.length > MAX_INPUT_LENGTH) {
        setQrDataUrl("");
        setStatus(`Input too long. Maximum ${MAX_INPUT_LENGTH} characters.`);
        setStatusKind("error");
        return;
      }

      try {
        const output = await QRCode.toDataURL(trimmed, {
          errorCorrectionLevel: level,
          margin: 1,
          width: size,
          color: { dark: "#0d322f", light: "#ffffff" },
        });

        if (!cancelled) {
          setQrDataUrl(output);
          setStatus("Generated locally.");
          setStatusKind("success");
        }
      } catch {
        if (!cancelled) {
          setQrDataUrl("");
          setStatus("Unable to generate QR code.");
          setStatusKind("error");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [text, level, size]);

  return (
    <ToolShell
      eyebrow="Sharing Tool"
      title="QR Code Generator"
      description="Build a downloadable QR code from any message or URL. Generation is entirely client-side."
    >
      <label className="field-label" htmlFor="qr-value">
        Text Or URL
      </label>
      <textarea
        id="qr-value"
        className="textarea"
        rows={4}
        maxLength={MAX_INPUT_LENGTH}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="https://company.example/help"
      />

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Error Correction</span>
          <select
            className="input"
            value={level}
            onChange={(event) => setLevel(event.target.value as "L" | "M" | "Q" | "H")}
          >
            <option value="L">L (smallest)</option>
            <option value="M">M</option>
            <option value="Q">Q</option>
            <option value="H">H (strongest)</option>
          </select>
        </label>

        <label className="field-block">
          <span className="field-label">Image Size ({size}px)</span>
          <input
            type="range"
            min={128}
            max={512}
            step={8}
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
        </label>
      </div>

      <StatusNote status={status} kind={statusKind} />

      {qrDataUrl ? (
        <div className="preview-shell">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="Generated QR code" width={size} height={size} />
          <a href={qrDataUrl} download="qr-code.png" className="button-link">
            Download PNG
          </a>
        </div>
      ) : null}
    </ToolShell>
  );
}
