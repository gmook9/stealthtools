"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import CopyButton from "@/components/copy-button";
import StatusNote from "@/components/status-note";
import { generateLorem } from "@/lib/lorem";

type Unit = "words" | "sentences" | "paragraphs";

export default function LoremPage() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<Unit>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState(() =>
    generateLorem({ count: 3, unit: "paragraphs", startWithLorem: true }),
  );
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const generate = () => {
    if (count < 1 || count > 50) {
      setStatus("Count must be between 1 and 50.");
      setStatusKind("error");
      return;
    }
    setOutput(
      generateLorem({ count, unit, startWithLorem }, Math.floor(Math.random() * 1_000_000)),
    );
    setStatus("Generated locally.");
    setStatusKind("success");
  };

  return (
    <ToolShell
      eyebrow="Text Tool"
      title="Lorem Ipsum Generator"
      description="Generate placeholder text in words, sentences, or paragraphs."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Count</span>
          <input
            className="input"
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(ev) => setCount(Number(ev.target.value))}
          />
        </label>
        <label className="field-block">
          <span className="field-label">Unit</span>
          <select
            className="input"
            value={unit}
            onChange={(ev) => setUnit(ev.target.value as Unit)}
          >
            <option value="words">Words</option>
            <option value="sentences">Sentences</option>
            <option value="paragraphs">Paragraphs</option>
          </select>
        </label>
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={startWithLorem}
          onChange={(ev) => setStartWithLorem(ev.target.checked)}
        />
        <span>Start with &quot;Lorem ipsum...&quot;</span>
      </label>

      <div className="button-row">
        <button type="button" className="button-link" onClick={generate}>
          Generate
        </button>
        <CopyButton value={output} label="Copy" />
      </div>

      <textarea readOnly rows={12} className="textarea" value={output} />

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
