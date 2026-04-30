"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import { runRegex, type RegexMatch } from "@/lib/regex-runner";

export default function RegexPage() {
  const [pattern, setPattern] = useState("\\b[A-Z][a-z]+\\b");
  const [flags, setFlags] = useState("g");
  const [input, setInput] = useState(
    "Alice and Bob were testing the Regex tool while Carol watched.",
  );
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [status, setStatus] = useState("Click Run to evaluate.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");
  const [truncated, setTruncated] = useState(false);

  const run = () => {
    const result = runRegex(pattern, flags, input);
    if (!result.ok) {
      setMatches([]);
      setStatus(result.error);
      setStatusKind("error");
      setTruncated(false);
      return;
    }
    setMatches(result.matches);
    setTruncated(result.truncated);
    setStatus(`${result.matches.length} match(es)${result.truncated ? " (truncated)" : ""}.`);
    setStatusKind("success");
  };

  return (
    <ToolShell
      eyebrow="Text Tool"
      title="Regex Tester"
      description="Test JavaScript regular expressions against sample text. Execution is sandboxed in your browser."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Pattern</span>
          <input
            className="input"
            value={pattern}
            onChange={(ev) => setPattern(ev.target.value)}
            spellCheck={false}
          />
        </label>
        <label className="field-block">
          <span className="field-label">Flags (g, i, m, s, u, y)</span>
          <input
            className="input"
            value={flags}
            onChange={(ev) => setFlags(ev.target.value)}
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
        onChange={(ev) => setInput(ev.target.value)}
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={run}>
          Run
        </button>
      </div>

      <StatusNote status={status} kind={statusKind} />

      {matches.length > 0 ? (
        <div className="json-tree-shell">
          <ol style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {matches.map((m, index) => (
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
          {truncated ? <p className="meta-note">Output truncated for safety.</p> : null}
        </div>
      ) : null}
    </ToolShell>
  );
}
