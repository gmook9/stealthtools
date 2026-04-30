"use client";

import { useEffect, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

const AMBIGUOUS = /[O0Il1|`'"]/g;

function generatePassword(options: {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}): string {
  let alphabet = "";
  if (options.lower) alphabet += SETS.lower;
  if (options.upper) alphabet += SETS.upper;
  if (options.digits) alphabet += SETS.digits;
  if (options.symbols) alphabet += SETS.symbols;

  if (options.excludeAmbiguous) {
    alphabet = alphabet.replace(AMBIGUOUS, "");
  }

  if (!alphabet) {
    return "";
  }

  const bytes = new Uint32Array(options.length);
  crypto.getRandomValues(bytes);

  let result = "";
  for (let index = 0; index < options.length; index += 1) {
    result += alphabet[bytes[index] % alphabet.length];
  }
  return result;
}

function estimateEntropy(length: number, alphabetSize: number): number {
  if (alphabetSize <= 1 || length <= 0) return 0;
  return Math.round(length * Math.log2(alphabetSize));
}

export default function PasswordPage() {
  const [length, setLength] = useState(20);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("Ready");

  const generate = () => {
    const next = generatePassword({ length, lower, upper, digits, symbols, excludeAmbiguous });
    if (!next) {
      setStatus("Select at least one character set.");
      return;
    }
    setValue(next);

    let alphabetSize = 0;
    if (lower) alphabetSize += SETS.lower.length;
    if (upper) alphabetSize += SETS.upper.length;
    if (digits) alphabetSize += SETS.digits.length;
    if (symbols) alphabetSize += SETS.symbols.length;
    if (excludeAmbiguous) alphabetSize = Math.max(1, alphabetSize - 9);

    const bits = estimateEntropy(length, alphabetSize);
    setStatus(`Generated locally. Estimated entropy ~${bits} bits.`);
  };

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToolShell
      eyebrow="Generator"
      title="Password Generator"
      description="Generate strong random passwords in the browser using crypto.getRandomValues()."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Length ({length})</span>
          <input
            type="range"
            min={8}
            max={128}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
          />
        </label>
        <div className="field-block">
          <span className="field-label">Generated Password</span>
          <input className="input" value={value} readOnly />
        </div>
      </div>

      <div className="grid-two">
        <label className="checkbox-row">
          <input type="checkbox" checked={lower} onChange={(event) => setLower(event.target.checked)} />
          <span>Lowercase letters</span>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={upper} onChange={(event) => setUpper(event.target.checked)} />
          <span>Uppercase letters</span>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={digits} onChange={(event) => setDigits(event.target.checked)} />
          <span>Digits</span>
        </label>
        <label className="checkbox-row">
          <input type="checkbox" checked={symbols} onChange={(event) => setSymbols(event.target.checked)} />
          <span>Symbols</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(event) => setExcludeAmbiguous(event.target.checked)}
          />
          <span>Exclude ambiguous characters</span>
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="button-link" onClick={generate}>
          Generate
        </button>
        <CopyButton value={value} label="Copy Password" />
      </div>

      <StatusNote status={status} kind="info" />
    </ToolShell>
  );
}
