"use client";

import { ChangeEvent, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

const MAX_FILE_BYTES = 2 * 1024 * 1024;

function toBase64Utf8(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function fromBase64Utf8(value: string): string {
  const cleaned = value.replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Page() {
  const [input, setInput] = useState("Quarterly report data");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const setMessage = (text: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const encode = () => {
    try {
      setOutput(toBase64Utf8(input));
      setMessage("Encoded locally.", "success");
    } catch {
      setMessage("Unable to encode input.", "error");
    }
  };

  const decode = () => {
    try {
      setOutput(fromBase64Utf8(input));
      setMessage("Decoded locally.", "success");
    } catch {
      setMessage("Input is not valid Base64.", "error");
    }
  };

  const encodeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setMessage("Please keep file size under 2 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setOutput(result);
        setMessage("File converted to Base64 Data URL locally.", "success");
      }
    };
    reader.onerror = () => setMessage("Unable to read file.", "error");
    reader.readAsDataURL(file);
  };

  return (
    <ToolShell
      eyebrow="Encoding Tool"
      title="Base64 Utility"
      description="Encode and decode text or files in-browser. Useful for integration payload troubleshooting."
    >
      <label className="field-label" htmlFor="base64-input">
        Input
      </label>
      <textarea
        id="base64-input"
        rows={8}
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
        Or convert a small file to a Base64 data URL
      </label>
      <input id="base64-file" type="file" onChange={encodeFile} className="input" />

      <label className="field-label" htmlFor="base64-output">
        Output
      </label>
      <textarea id="base64-output" rows={8} value={output} readOnly className="textarea" />

      <div className="button-row">
        <CopyButton value={output} label="Copy Output" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
