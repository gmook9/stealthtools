"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

type JsonTreeData = Record<string, unknown> | unknown[];

const MAX_FILE_BYTES = 3 * 1024 * 1024;

function normalizeJsonTree(value: unknown): JsonTreeData {
  if (Array.isArray(value)) return value;
  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return { value };
}

export default function JsonViewerPage() {
  const [input, setInput] = useState('{\n  "team": ["ops", "engineering"],\n  "enabled": true\n}');
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");
  const [parsed, setParsed] = useState<JsonTreeData>({
    team: ["ops", "engineering"],
    enabled: true,
  });

  const byteSize = useMemo(() => {
    return `${new TextEncoder().encode(input).length.toLocaleString()} bytes`;
  }, [input]);

  const setMessage = (text: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const validate = () => {
    try {
      const next = JSON.parse(input);
      setParsed(normalizeJsonTree(next));
      setMessage("Valid JSON. Viewer updated.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setMessage(`JSON error: ${message}`, "error");
    }
  };

  const prettify = () => {
    try {
      const next = JSON.parse(input);
      setInput(JSON.stringify(next, null, 2));
      setParsed(normalizeJsonTree(next));
      setMessage("JSON formatted.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setMessage(`JSON error: ${message}`, "error");
    }
  };

  const minify = () => {
    try {
      const next = JSON.parse(input);
      setInput(JSON.stringify(next));
      setParsed(normalizeJsonTree(next));
      setMessage("JSON minified.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setMessage(`JSON error: ${message}`, "error");
    }
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setMessage("Please keep JSON files under 3 MB for browser responsiveness.", "error");
      return;
    }

    const text = await file.text();
    setInput(text);
    setMessage("File loaded. Validate to inspect.", "info");
  };

  return (
    <ToolShell
      eyebrow="Inspection Tool"
      title="JSON Viewer"
      description="Validate and inspect JSON in a readable tree. Parsing happens entirely in your browser."
    >
      <label className="field-label" htmlFor="json-file">
        Load JSON File
      </label>
      <input
        id="json-file"
        type="file"
        accept="application/json,.json,text/plain"
        onChange={uploadFile}
        className="input"
      />

      <label className="field-label" htmlFor="json-input">
        JSON Input ({byteSize})
      </label>
      <textarea
        id="json-input"
        rows={14}
        value={input}
        onChange={(event) => setInput(event.target.value)}
        className="textarea"
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={validate}>
          Validate
        </button>
        <button type="button" className="button-link button-ghost" onClick={prettify}>
          Prettify
        </button>
        <button type="button" className="button-link button-ghost" onClick={minify}>
          Minify
        </button>
        <CopyButton value={input} label="Copy" />
      </div>

      <StatusNote status={status} kind={statusKind} />

      <div className="json-tree-shell">
        <JsonView data={parsed} style={defaultStyles} shouldExpandNode={allExpanded} />
      </div>
    </ToolShell>
  );
}
