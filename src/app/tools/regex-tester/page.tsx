"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";

const MAX_INPUT_LENGTH = 50_000;
const MAX_MATCHES = 500;
const ALLOWED_FLAGS = /^[gimsuy]{0,6}$/;

type MatchResult = {
  match: string;
  index: number;
  groups: string[];
};

function executeRegex(
  pattern: string,
  flags: string,
  input: string,
): { error: string | null; matches: MatchResult[]; truncated: boolean } {
  if (!pattern) {
    return { error: null, matches: [], truncated: false };
  }

  if (!ALLOWED_FLAGS.test(flags)) {
    return { error: "Flags may only contain: g, i, m, s, u, y", matches: [], truncated: false };
  }

  let regex: RegExp;
  try {
    regex = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid regex";
    return { error: message, matches: [], truncated: false };
  }

  const matches: MatchResult[] = [];
  let truncated = false;
  let safetyCounter = 0;
  let last = -1;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(input)) !== null) {
    safetyCounter += 1;
    if (safetyCounter > MAX_MATCHES) {
      truncated = true;
      break;
    }

    if (match.index === last && match[0] === "") {
      regex.lastIndex += 1;
      continue;
    }

    last = match.index;
    matches.push({
      match: match[0],
      index: match.index,
      groups: match.slice(1).map((group) => (group === undefined ? "" : group)),
    });

    if (match[0].length === 0) {
      regex.lastIndex += 1;
    }
  }

  return { error: null, matches, truncated };
}

export default function RegexPage() {
  const [pattern, setPattern] = useState("\\b[A-Z][a-z]+\\b");
  const [flags, setFlags] = useState("g");
  const [input, setInput] = useState(
    "Alice and Bob were testing the Regex tool while Carol watched.",
  );

  const limited = input.length > MAX_INPUT_LENGTH;

  const result = useMemo(
    () =>
      limited
        ? { error: `Input exceeds ${MAX_INPUT_LENGTH.toLocaleString()} characters.`, matches: [], truncated: false }
        : executeRegex(pattern, flags, input),
    [pattern, flags, input, limited],
  );

  return (
    <ToolShell
      eyebrow="Text Tool"
      title="Regex Tester"
      description="Test JavaScript regular expressions against sample text. Execution is sandboxed in your browser tab."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Pattern</span>
          <input
            className="input"
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            spellCheck={false}
          />
        </label>
        <label className="field-block">
          <span className="field-label">Flags</span>
          <input
            className="input"
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
            maxLength={6}
            spellCheck={false}
          />
        </label>
      </div>

      <label className="field-label" htmlFor="regex-text">
        Sample Text
      </label>
      <textarea
        id="regex-text"
        rows={10}
        className="textarea"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      {result.error ? (
        <StatusNote status={result.error} kind="error" />
      ) : (
        <StatusNote
          status={`${result.matches.length} match(es)${result.truncated ? " (truncated for safety)" : ""}.`}
          kind="success"
        />
      )}

      {result.matches.length > 0 ? (
        <div className="json-tree-shell">
          <ol style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {result.matches.map((m, index) => (
              <li key={index} style={{ marginBottom: "0.4rem" }}>
                <code>{m.match}</code> at index {m.index}
                {m.groups.length > 0 ? (
                  <span className="meta-note" style={{ marginLeft: "0.4rem" }}>
                    groups: [{m.groups.map((group) => JSON.stringify(group)).join(", ")}]
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </ToolShell>
  );
}
