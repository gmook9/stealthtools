"use client";

import { useState } from "react";
import { format } from "sql-formatter";

const languageOptions = ["sql", "mysql", "postgresql", "sqlite", "transactsql"];

export default function SqlCompactorPage() {
  const [language, setLanguage] = useState("sql");
  const [input, setInput] = useState("SELECT customer_id, created_at FROM orders WHERE status = 'pending' ORDER BY created_at DESC;");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");

  const compact = () => {
    if (!input.trim()) {
      setStatus("Enter SQL first.");
      return;
    }

    try {
      const pretty = format(input, { language: language as never });
      const oneLine = pretty.replace(/\s+/g, " ").trim();
      setOutput(oneLine);
      setStatus("SQL compacted to one line.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to parse SQL.";
      setStatus(`Compaction failed: ${message}`);
    }
  };

  const copyOutput = async () => {
    if (!output) return;

    await navigator.clipboard.writeText(output);
    setStatus("Compacted SQL copied to clipboard.");
  };

  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Database Tool</p>
        <h1 className="hero-title">SQL Compactor</h1>
        <p className="hero-copy">
          Flatten SQL into a single-line query for environment variables, logs, and scripts.
        </p>
      </header>

      <div className="tool-panel">
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
            <span className="field-label">One-line SQL</span>
            <textarea rows={14} value={output} readOnly className="textarea" />
          </label>
        </div>

        <div className="button-row">
          <button type="button" className="button-link" onClick={compact}>
            Compact SQL
          </button>
          <button type="button" className="button-link button-ghost" onClick={copyOutput}>
            Copy Output
          </button>
        </div>

        <p className="status-note">{status}</p>
      </div>
    </section>
  );
}
