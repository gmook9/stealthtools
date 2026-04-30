"use client";

import { ChangeEvent, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import { decodeBase64Utf8, encodeBase64Utf8 } from "@/lib/base64";

type Mode = "encode" | "decode";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

export default function Base64Page() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("Hello workplace!");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const setMessage = (text: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const run = () => {
    try {
      if (mode === "encode") {
        setOutput(encodeBase64Utf8(input));
        setMessage("Encoded locally.", "success");
      } else {
        setOutput(decodeBase64Utf8(input));
        setMessage("Decoded locally.", "success");
      }
    } catch {
      setMessage("Operation failed. Check your input.", "error");
    }
  };

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setMessage("Please keep files under 2 MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const base64 = result.split(",")[1] ?? "";
        setMode("encode");
        setInput(`(file: ${file.name})`);
        setOutput(base64);
        setMessage("File encoded to Base64.", "success");
      }
    };
    reader.onerror = () => setMessage("Unable to read file.", "error");
    reader.readAsDataURL(file);
  };

  return (
    <ToolShell
      eyebrow="Encoding Tool"
      title="Base64 Utility"
      description="Encode and decode text or small files to Base64 entirely in your browser."
    >
      <label className="field-label" htmlFor="b64-mode">
        Mode
      </label>
      <select
        id="b64-mode"
        className="input"
        value={mode}
        onChange={(ev) => setMode(ev.target.value as Mode)}
      >
        <option value="encode">Encode (text -&gt; Base64)</option>
        <option value="decode">Decode (Base64 -&gt; text)</option>
      </select>

      <label className="field-label" htmlFor="b64-input">
        Input
      </label>
      <textarea
        id="b64-input"
        rows={6}
        className="textarea"
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={run}>
          {mode === "encode" ? "Encode" : "Decode"}
        </button>
      </div>

      <label className="field-label" htmlFor="b64-file">
        Or encode a file
      </label>
      <input id="b64-file" type="file" onChange={onFile} className="input" />

      <label className="field-label" htmlFor="b64-output">
        Output
      </label>
      <textarea id="b64-output" rows={6} value={output} readOnly className="textarea" />

      <div className="button-row">
        <CopyButton value={output} label="Copy Output" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
