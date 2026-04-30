"use client";

import { useEffect, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import {
  buildAlphabet,
  estimateEntropyBits,
  generatePassword,
  type PasswordOptions,
} from "@/lib/password";

export default function PasswordPage() {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 20,
    lower: true,
    upper: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: true,
  });
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const generate = (current: PasswordOptions = options) => {
    const next = generatePassword(current);
    if (!next) {
      setStatus("Select at least one character set.");
      setStatusKind("error");
      setValue("");
      return;
    }
    setValue(next);
    const alphabetSize = buildAlphabet(current).length;
    const bits = estimateEntropyBits(current.length, alphabetSize);
    setStatus(`Generated locally. Estimated entropy ~${bits} bits.`);
    setStatusKind("success");
  };

  useEffect(() => {
    generate(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = <K extends keyof PasswordOptions>(key: K, val: PasswordOptions[K]) => {
    setOptions((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <ToolShell
      eyebrow="Generator"
      title="Password Generator"
      description="Generate strong random passwords in the browser using crypto.getRandomValues()."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Length ({options.length})</span>
          <input
            type="range"
            min={8}
            max={128}
            value={options.length}
            onChange={(ev) => update("length", Number(ev.target.value))}
          />
        </label>
        <div className="field-block">
          <span className="field-label">Generated Password</span>
          <input
            className="input"
            value={value}
            readOnly
            spellCheck={false}
            style={{ fontFamily: "var(--font-plex-mono), monospace" }}
          />
        </div>
      </div>

      <div className="grid-two">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={options.lower}
            onChange={(ev) => update("lower", ev.target.checked)}
          />
          <span>Lowercase letters</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={options.upper}
            onChange={(ev) => update("upper", ev.target.checked)}
          />
          <span>Uppercase letters</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={options.digits}
            onChange={(ev) => update("digits", ev.target.checked)}
          />
          <span>Digits</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={options.symbols}
            onChange={(ev) => update("symbols", ev.target.checked)}
          />
          <span>Symbols</span>
        </label>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={options.excludeAmbiguous}
            onChange={(ev) => update("excludeAmbiguous", ev.target.checked)}
          />
          <span>Exclude ambiguous characters</span>
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="button-link" onClick={() => generate()}>
          Generate
        </button>
        <CopyButton value={value} label="Copy Password" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
