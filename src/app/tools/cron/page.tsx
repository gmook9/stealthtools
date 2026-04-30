"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import { explainCron } from "@/lib/cron";

const PRESETS = [
  { label: "Every minute", value: "* * * * *" },
  { label: "Every 5 minutes", value: "*/5 * * * *" },
  { label: "Every hour", value: "0 * * * *" },
  { label: "Daily at midnight", value: "0 0 * * *" },
  { label: "Every Monday 9am", value: "0 9 * * 1" },
  { label: "First of month", value: "0 0 1 * *" },
];

export default function CronPage() {
  const [expression, setExpression] = useState("0 9 * * 1");
  const [explanation, setExplanation] = useState(() => explainCron("0 9 * * 1"));
  const [status, setStatus] = useState("Enter a 5-field cron expression then click Explain.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const explain = (value: string = expression) => {
    const result = explainCron(value);
    setExplanation(result);
    if (result.ok) {
      setStatus("Parsed locally.");
      setStatusKind("success");
    } else {
      setStatus(result.error);
      setStatusKind("error");
    }
  };

  return (
    <ToolShell
      eyebrow="Time Tool"
      title="Cron Explainer"
      description="Explain a 5-field cron expression in plain English. Does not compute next-run times."
    >
      <label className="field-label" htmlFor="cron-input">
        Cron Expression
      </label>
      <input
        id="cron-input"
        className="input"
        value={expression}
        onChange={(ev) => setExpression(ev.target.value)}
        spellCheck={false}
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={() => explain()}>
          Explain
        </button>
      </div>

      <div className="button-row">
        {PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            className="button-link button-ghost"
            onClick={() => {
              setExpression(preset.value);
              explain(preset.value);
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <StatusNote status={status} kind={statusKind} />

      {explanation.ok ? (
        <div className="field-block">
          <p>
            <strong>{explanation.summary}</strong>
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {explanation.fields.map((field) => (
              <li key={field.name}>
                <code>{field.raw}</code> &middot; {field.name}: {field.description}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </ToolShell>
  );
}
