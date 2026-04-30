"use client";

import { ChangeEvent, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";
type StatusKind = "info" | "success" | "error";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (const byte of bytes) {
    hex += byte.toString(16).padStart(2, "0");
  }
  return hex;
}

export default function HashPage() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [text, setText] = useState("Confidential payload");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");
  const [busy, setBusy] = useState(false);

  const setMessage = (msg: string, kind: StatusKind = "info") => {
    setStatus(msg);
    setStatusKind(kind);
  };

  const hashText = async () => {
    setBusy(true);
    try {
      const data = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest(algorithm, data);
      setOutput(bufferToHex(digest));
      setMessage(`Hashed text using ${algorithm} via SubtleCrypto.`, "success");
    } catch {
      setMessage("Hashing failed.", "error");
    } finally {
      setBusy(false);
    }
  };

  const hashFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setMessage("Please keep files under 25 MB.", "error");
      return;
    }

    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      const digest = await crypto.subtle.digest(algorithm, buffer);
      setOutput(bufferToHex(digest));
      setMessage(`Hashed file ${file.name} (${(file.size / 1024).toFixed(1)} KB).`, "success");
    } catch {
      setMessage("Hashing failed.", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      eyebrow="Cryptography"
      title="Hash Generator"
      description="Compute cryptographic hashes locally using the browser SubtleCrypto API. Nothing is uploaded."
    >
      <label className="field-label" htmlFor="hash-algo">
        Algorithm
      </label>
      <select
        id="hash-algo"
        className="input"
        value={algorithm}
        onChange={(event) => setAlgorithm(event.target.value as Algorithm)}
      >
        <option value="SHA-1">SHA-1 (legacy)</option>
        <option value="SHA-256">SHA-256</option>
        <option value="SHA-384">SHA-384</option>
        <option value="SHA-512">SHA-512</option>
      </select>

      <label className="field-label" htmlFor="hash-text">
        Text Input
      </label>
      <textarea
        id="hash-text"
        rows={6}
        className="textarea"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={hashText} disabled={busy}>
          Hash Text
        </button>
      </div>

      <label className="field-label" htmlFor="hash-file">
        Or hash a file
      </label>
      <input id="hash-file" type="file" onChange={hashFile} className="input" disabled={busy} />

      <label className="field-label" htmlFor="hash-output">
        Hash (hex)
      </label>
      <textarea id="hash-output" rows={4} value={output} readOnly className="textarea" />

      <div className="button-row">
        <CopyButton value={output} label="Copy Hash" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
