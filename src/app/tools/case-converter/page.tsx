"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/tool-shell";
import CopyButton from "@/components/copy-button";

function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-./\\]+/g, " ")
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function toCamel(words: string[]): string {
  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join("");
}

function toPascal(words: string[]): string {
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("");
}

function toSnake(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join("_");
}

function toKebab(words: string[]): string {
  return words.map((word) => word.toLowerCase()).join("-");
}

function toConstant(words: string[]): string {
  return words.map((word) => word.toUpperCase()).join("_");
}

function toTitle(words: string[]): string {
  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}

function toSentence(words: string[]): string {
  if (words.length === 0) return "";
  const lower = words.map((word) => word.toLowerCase());
  lower[0] = lower[0].charAt(0).toUpperCase() + lower[0].slice(1);
  return lower.join(" ");
}

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
      description="Transform a string into common naming conventions. Pure string operations, fully local."
    >
      <label className="field-label" htmlFor="case-input">
        Input
      </label>
      <textarea
        id="case-input"
        rows={4}
        value={input}
        onChange={(event) => setInput(event.target.value)}
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
