"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/tool-shell";
import CopyButton from "@/components/copy-button";
import {
  splitWords,
  toCamel,
  toConstant,
  toKebab,
  toPascal,
  toSentence,
  toSnake,
  toTitle,
} from "@/lib/case";

export default function CaseConverterPage() {
  const [input, setInput] = useState("convert this string of text");

  const words = useMemo(() => splitWords(input), [input]);

  const cases = useMemo(
    () => [
      { label: "camelCase", value: toCamel(words) },
      { label: "PascalCase", value: toPascal(words) },
      { label: "snake_case", value: toSnake(words) },
      { label: "kebab-case", value: toKebab(words) },
      { label: "CONSTANT_CASE", value: toConstant(words) },
      { label: "Title Case", value: toTitle(words) },
      { label: "Sentence case", value: toSentence(words) },
      { label: "UPPERCASE", value: input.toUpperCase() },
      { label: "lowercase", value: input.toLowerCase() },
    ],
    [words, input],
  );

  return (
    <ToolShell
      eyebrow="Text Tool"
      title="Case Converter"
      description="Transform a string into common naming conventions. Updates as you type."
    >
      <label className="field-label" htmlFor="case-input">
        Input
      </label>
      <textarea
        id="case-input"
        rows={4}
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
        className="textarea"
      />

      <div className="grid-two">
        {cases.map((entry) => (
          <div className="field-block" key={entry.label}>
            <span className="field-label">{entry.label}</span>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <input className="input" readOnly value={entry.value} />
              <CopyButton value={entry.value} label="Copy" />
            </div>
          </div>
        ))}
      </div>
    </ToolShell>
  );
}
