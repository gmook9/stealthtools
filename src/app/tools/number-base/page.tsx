"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import { convertNumber, type Radix } from "@/lib/number-base";

const RADIX_OPTIONS: { value: Radix; label: string }[] = [
  { value: 2, label: "Binary (2)" },
  { value: 8, label: "Octal (8)" },
  { value: 10, label: "Decimal (10)" },
  { value: 16, label: "Hex (16)" },
];

export default function NumberBasePage() {
  const [input, setInput] = useState("255");
  const [fromRadix, setFromRadix] = useState<Radix>(10);
  const [output, setOutput] = useState<Record<Radix, string> | null>({
    2: "11111111",
    8: "377",
    10: "255",
    16: "ff",
  });
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const convert = () => {
    const result = convertNumber(input, fromRadix);
    if (!result) {
      setOutput(null);
      setStatus("Invalid number for the selected base.");
      setStatusKind("error");
      return;
    }
    setOutput(result);
    setStatus("Converted locally.");
    setStatusKind("success");
  };

  return (
    <ToolShell
      eyebrow="Encoding Tool"
      title="Number Base Converter"
      description="Convert integers between binary, octal, decimal, and hexadecimal. Uses BigInt for arbitrary size."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Input</span>
          <input
            className="input"
            value={input}
            onChange={(ev) => setInput(ev.target.value)}
            spellCheck={false}
          />
        </label>
        <label className="field-block">
          <span className="field-label">Input Base</span>
          <select
            className="input"
            value={fromRadix}
            onChange={(ev) => setFromRadix(Number(ev.target.value) as Radix)}
          >
            {RADIX_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="button-link" onClick={convert}>
          Convert
        </button>
      </div>

      {output ? (
        <div className="grid-two">
          {RADIX_OPTIONS.map((opt) => (
            <div className="field-block" key={opt.value}>
              <span className="field-label">{opt.label}</span>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                <input className="input" readOnly value={output[opt.value]} />
                <CopyButton value={output[opt.value]} label="Copy" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
