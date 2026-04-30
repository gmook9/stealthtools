"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

type Mode = "encode" | "decode";
type Variant = "component" | "uri";

export default function UrlEncoderPage() {
  const [mode, setMode] = useState<Mode>("encode");
  const [variant, setVariant] = useState<Variant>("component");
  const [input, setInput] = useState("hello world & friends");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const run = () => {
    try {
      if (mode === "encode") {
        const result =
          variant === "component" ? encodeURIComponent(input) : encodeURI(input);
        setOutput(result);
        setStatus("Encoded locally.");
        setStatusKind("success");
      } else {
        const result =
          variant === "component" ? decodeURIComponent(input) : decodeURI(input);
        setOutput(result);
        setStatus("Decoded locally.");
        setStatusKind("success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Operation failed.";
      setStatus(message);
      setStatusKind("error");
    }
  };

  return (
    <ToolShell
      eyebrow="Encoding Tool"
      title="URL Encoder / Decoder"
      description="Safely encode and decode URI components and full URLs using browser primitives."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Mode</span>
          <select className="input" value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
        </label>
        <label className="field-block">
          <span className="field-label">Variant</span>
          <select
            className="input"
            value={variant}
            onChange={(event) => setVariant(event.target.value as Variant)}
          >
            <option value="component">URI Component (strict)</option>
            <option value="uri">Full URI (preserves :/?#)</option>
          </select>
        </label>
      </div>

      <label className="field-label" htmlFor="url-input">
        Input
      </label>
      <textarea
        id="url-input"
        rows={6}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="textarea"
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={run}>
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
      </div>

      <label className="field-label" htmlFor="url-output">
        Output
      </label>
      <textarea id="url-output" rows={6} value={output} readOnly className="textarea" />

      <div className="button-row">
        <CopyButton value={output} label="Copy Output" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
