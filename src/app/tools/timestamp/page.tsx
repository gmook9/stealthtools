"use client";

import { useEffect, useMemo, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";

type Mode = "epoch" | "iso";

function safeDate(value: Date): Date | null {
  return Number.isNaN(value.getTime()) ? null : value;
}

export default function TimestampPage() {
  const [now, setNow] = useState(() => new Date());
  const [mode, setMode] = useState<Mode>("epoch");
  const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const parsed = useMemo<Date | null>(() => {
    if (!input.trim()) return null;

    if (mode === "epoch") {
      const numeric = Number(input.trim());
      if (!Number.isFinite(numeric)) return null;
      const ms = input.trim().length > 10 ? numeric : numeric * 1000;
      return safeDate(new Date(ms));
    }

    return safeDate(new Date(input.trim()));
  }, [input, mode]);

  const setMessage = (text: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const useNow = () => {
    if (mode === "epoch") {
      setInput(String(Math.floor(Date.now() / 1000)));
    } else {
      setInput(new Date().toISOString());
    }
    setMessage("Loaded current time.", "success");
  };

  return (
    <ToolShell
      eyebrow="Time Tool"
      title="Timestamp Converter"
      description="Convert between Unix epoch seconds, ISO 8601 strings, and human readable formats."
    >
      <p className="meta-note">
        Current epoch: <strong>{Math.floor(now.getTime() / 1000)}</strong> &middot; ISO:{" "}
        <strong>{now.toISOString()}</strong>
      </p>

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Input Type</span>
          <select className="input" value={mode} onChange={(event) => setMode(event.target.value as Mode)}>
            <option value="epoch">Unix Epoch (seconds or ms)</option>
            <option value="iso">ISO 8601 / Date String</option>
          </select>
        </label>
        <div className="field-block">
          <span className="field-label">Action</span>
          <button type="button" className="button-link button-ghost" onClick={useNow}>
            Use Current Time
          </button>
        </div>
      </div>

      <label className="field-label" htmlFor="ts-input">
        Input
      </label>
      <input
        id="ts-input"
        className="input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
      />

      <div className="grid-two">
        <div className="field-block">
          <span className="field-label">Epoch (seconds)</span>
          <input
            className="input"
            readOnly
            value={parsed ? String(Math.floor(parsed.getTime() / 1000)) : ""}
          />
        </div>
        <div className="field-block">
          <span className="field-label">Epoch (milliseconds)</span>
          <input className="input" readOnly value={parsed ? String(parsed.getTime()) : ""} />
        </div>
        <div className="field-block">
          <span className="field-label">ISO 8601 (UTC)</span>
          <input className="input" readOnly value={parsed ? parsed.toISOString() : ""} />
        </div>
        <div className="field-block">
          <span className="field-label">Local</span>
          <input className="input" readOnly value={parsed ? parsed.toString() : ""} />
        </div>
      </div>

      <div className="button-row">
        <CopyButton value={parsed ? parsed.toISOString() : ""} label="Copy ISO" />
      </div>

      <StatusNote status={parsed ? status : "Unable to parse input."} kind={parsed ? statusKind : "error"} />
    </ToolShell>
  );
}
