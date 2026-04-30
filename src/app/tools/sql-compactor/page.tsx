"use client";

import { useState } from "react";
import { format } from "sql-formatter";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

const languageOptions = ["sql", "mysql", "postgresql", "sqlite", "transactsql", "bigquery", "snowflake"];

export default function SqlCompactorPage() {
  const [language, setLanguage] = useState("sql");
  const [input, setInput] = useState(
    "SELECT customer_id, created_at FROM orders WHERE status = 'pending' ORDER BY created_at DESC;",
  );
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const compact = () => {
    if (!input.trim()) {
      setStatus("Enter SQL first.");
      setStatusKind("info");
      return;
    }

    try {
      const pretty = format(input, { language: language as never });
      const oneLine = pretty.replace(/\s+/g, " ").trim();
      setOutput(oneLine);
      setStatus("SQL compacted to one line.");
      setStatusKind("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to parse SQL.";
      setStatus(`Compaction failed: ${message}`);
      setStatusKind("error");
    }
  };

  const prettyFormat = () => {
    if (!input.trim()) return;
    try {
      const pretty = format(input, { language: language as never });
      setOutput(pretty);
      setStatus("SQL formatted.");
      setStatusKind("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to parse SQL.";
      setStatus(`Formatting failed: ${message}`);
      setStatusKind("error");
    }
  };

  return (
    <ToolShell
      eyebrow="Database Tool"
      title="SQL Compactor"
      description="Format or flatten SQL into a single-line query for environment variables, logs, and scripts."
    >
      <label className="field-label" htmlFor="sql-language">
        SQL Dialect
      </label>
      <select
        id="sql-language"
        className="input"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {languageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Input SQL</span>
          <textarea
            rows={14}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="textarea"
          />
        </label>
        <label className="field-block">
          <span className="field-label">Output</span>
          <textarea rows={14} value={output} readOnly className="textarea" />
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="button-link" onClick={compact}>
          Compact To One Line
        </button>
        <button type="button" className="button-link button-ghost" onClick={prettyFormat}>
          Pretty Format
        </button>
        <CopyButton value={output} label="Copy Output" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
