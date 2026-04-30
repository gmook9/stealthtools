"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QrGeneratorPage() {
  const [text, setText] = useState("https://example.org");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [size, setSize] = useState(280);
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!text.trim()) {
        setQrDataUrl("");
        setStatus("Enter text or URL to generate.");
        return;
      }

      try {
        const output = await QRCode.toDataURL(text, {
          errorCorrectionLevel: level,
          margin: 1,
          width: size,
          color: {
            dark: "#0d322f",
            light: "#ffffff",
          },
        });

        if (!cancelled) {
          setQrDataUrl(output);
          setStatus("Generated locally.");
        }
      } catch {
        if (!cancelled) {
          setQrDataUrl("");
          setStatus("Unable to generate QR code.");
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [text, level, size]);

  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Sharing Tool</p>
        <h1 className="hero-title">QR Code Generator</h1>
        <p className="hero-copy">
          Build a downloadable QR code from any message or URL. Generation is entirely client-side.
        </p>
      </header>

      <div className="tool-panel">
        <label className="field-label" htmlFor="qr-value">
          Text Or URL
        </label>
        <textarea
          id="qr-value"
          className="textarea"
          rows={4}
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

        <p className="status-note">{status}</p>

        {qrDataUrl ? (
          <div className="preview-shell">
            <img src={qrDataUrl} alt="Generated QR code" width={size} height={size} />
            <a href={qrDataUrl} download="qr-code.png" className="button-link">
              Download PNG
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
