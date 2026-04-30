"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { JsonView, allExpanded, defaultStyles } from "react-json-view-lite";

type JsonTreeData = Record<string, unknown> | unknown[];

function normalizeJsonTree(value: unknown): JsonTreeData {
  if (Array.isArray(value)) {
    return value;
  }

  if (value !== null && typeof value === "object") {
    return value as Record<string, unknown>;
  }

  return { value };
}

export default function JsonViewerPage() {
  const [input, setInput] = useState('{\n  "team": ["ops", "engineering"],\n  "enabled": true\n}');
  const [status, setStatus] = useState("Ready");
  const [parsed, setParsed] = useState<JsonTreeData>({
    team: ["ops", "engineering"],
    enabled: true,
  });

  const byteSize = useMemo(() => {
    const bytes = new TextEncoder().encode(input).length;
    return `${bytes.toLocaleString()} bytes`;
  }, [input]);

  const validate = () => {
    try {
      const next = JSON.parse(input);
      setParsed(normalizeJsonTree(next));
      setStatus("Valid JSON. Viewer updated.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setStatus(`JSON error: ${message}`);
    }
  };

  const prettify = () => {
    try {
      const next = JSON.parse(input);
      setInput(JSON.stringify(next, null, 2));
      setParsed(normalizeJsonTree(next));
      setStatus("JSON formatted.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JSON";
      setStatus(`JSON error: ${message}`);
    }
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setStatus("Please keep JSON files under 3 MB for browser responsiveness.");
      return;
    }

    const text = await file.text();
    setInput(text);
    setStatus("File loaded. Validate to inspect.");
  };

  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Inspection Tool</p>
        <h1 className="hero-title">JSON Viewer</h1>
        <p className="hero-copy">
          Validate and inspect JSON in a readable tree. Parsing happens entirely in your browser.
        </p>
      </header>

      <div className="tool-panel">
        <label className="field-label" htmlFor="json-file">
          Load JSON File
        </label>
        <input id="json-file" type="file" accept="application/json,.json" onChange={uploadFile} className="input" />

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
        </div>

        <p className="status-note">{status}</p>

        <div className="json-tree-shell">
          <JsonView data={parsed} style={defaultStyles} shouldExpandNode={allExpanded} />
        </div>
      </div>
    </section>
  );
}
