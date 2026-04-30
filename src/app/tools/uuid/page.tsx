"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

const MAX_BATCH = 100;

function generate(count: number): string[] {
  const out: string[] = [];
  for (let index = 0; index < count; index += 1) {
    out.push(crypto.randomUUID());
  }
  return out;
}

export default function UuidPage() {
  const [count, setCount] = useState(5);
  const [items, setItems] = useState<string[]>(() => generate(5));
  const [status, setStatus] = useState("Ready");

  const regenerate = (size: number) => {
    const safe = Math.min(Math.max(1, size), MAX_BATCH);
    setItems(generate(safe));
    setStatus(`Generated ${safe} UUIDs locally with crypto.randomUUID().`);
  };

  return (
    <ToolShell
      eyebrow="Generator"
      title="UUID Generator"
      description="Generate cryptographically random UUIDv4 values using the browser Web Crypto API."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Batch Size ({count})</span>
          <input
            type="range"
            min={1}
            max={MAX_BATCH}
            value={count}
            onChange={(event) => {
              const next = Number(event.target.value);
              setCount(next);
            }}
          />
        </label>
        <div className="field-block" style={{ justifyContent: "flex-end" }}>
          <span className="field-label">Action</span>
          <button
            type="button"
            className="button-link"
            onClick={() => regenerate(count)}
          >
            Generate
          </button>
        </div>
      </div>

      <label className="field-label" htmlFor="uuid-output">
        Output
      </label>
      <textarea
        id="uuid-output"
        rows={Math.min(items.length + 1, 14)}
        value={items.join("\n")}
        readOnly
        className="textarea"
      />

      <div className="button-row">
        <CopyButton value={items.join("\n")} label="Copy All" />
      </div>

      <StatusNote status={status} kind="info" />
    </ToolShell>
  );
}
