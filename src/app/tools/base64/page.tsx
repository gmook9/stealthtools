"use client";

import { ChangeEvent, useState } from "react";

function toBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64Utf8(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Page() {
  const [input, setInput] = useState("Quarterly report data");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");

  const encode = () => {
    try {
      setOutput(toBase64Utf8(input));
      setStatus("Encoded locally.");
    } catch {
      setStatus("Unable to encode input.");
    }
  };

  const decode = () => {
    try {
      setOutput(fromBase64Utf8(input));
      setStatus("Decoded locally.");
    } catch {
      setStatus("Input is not valid Base64.");
    }
  };

  const encodeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setStatus("Please keep file size under 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setOutput(result);
        setStatus("File converted to Base64 Data URL locally.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Encoding Tool</p>
        <h1 className="hero-title">Base64 Utility</h1>
        <p className="hero-copy">
          Encode and decode text or files in-browser. Useful for integration payload troubleshooting.
        </p>
      </header>

      <div className="tool-panel">
        <label className="field-label" htmlFor="base64-input">
          Input
        </label>
        <textarea
          id="base64-input"
          rows={10}
          className="textarea"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        <div className="button-row">
          <button type="button" className="button-link" onClick={encode}>
            Encode
          </button>
          <button type="button" className="button-link button-ghost" onClick={decode}>
            Decode
          </button>
        </div>

        <label className="field-label" htmlFor="base64-file">
          Or convert a file to Base64 Data URL
        </label>
        <input id="base64-file" type="file" onChange={encodeFile} className="input" />

        <label className="field-label" htmlFor="base64-output">
          Output
        </label>
        <textarea id="base64-output" rows={10} value={output} readOnly className="textarea" />

        <p className="status-note">{status}</p>
      </div>
    </section>
  );
}
