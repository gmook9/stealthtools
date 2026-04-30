"use client";

import { useEffect, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import {
  type ParsedTimestamp,
  parseDateString,
  parseEpochInput,
} from "@/lib/timestamp";

type Mode = "epoch" | "iso";

export default function TimestampPage() {
  const [now, setNow] = useState(() => new Date());
  const [mode, setMode] = useState<Mode>("epoch");
  const [input, setInput] = useState(String(Math.floor(Date.now() / 1000)));
  const [parsed, setParsed] = useState<ParsedTimestamp | null>(() =>
    parseEpochInput(String(Math.floor(Date.now() / 1000))),
  );
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const convert = (raw: string = input, current: Mode = mode) => {
    const result = current === "epoch" ? parseEpochInput(raw) : parseDateString(raw);
    if (!result) {
      setParsed(null);
      setStatus("Unable to parse input.");
      setStatusKind("error");
      return;
    }
    setParsed(result);
    setStatus("Converted locally.");
    setStatusKind("success");
  };

  const useNow = () => {
    const next = mode === "epoch" ? String(Math.floor(Date.now() / 1000)) : new Date().toISOString();
    setInput(next);
    convert(next, mode);
  };

  const switchMode = (next: Mode) => {
    setMode(next);
    convert(input, next);
  };

  return (
    <ToolShell
      eyebrow="Time Tool"
      title="Timestamp Converter"
      description="Convert between Unix epoch seconds, milliseconds, ISO 8601, and human-readable formats."
    >
      <p className="meta-note">
        Current epoch: <strong>{Math.floor(now.getTime() / 1000)}</strong> &middot; ISO:{" "}
        <strong>{now.toISOString()}</strong>
      </p>

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Input Type</span>
          <select className="input" value={mode} onChange={(ev) => switchMode(ev.target.value as Mode)}>
            <option value="epoch">Unix Epoch (seconds or ms)</option>
            <option value="iso">ISO 8601 / Date String</option>
          </select>
        </label>
        <div className="field-block">
          <span className="field-label">Quick Action</span>
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
        onChange={(ev) => setInput(ev.target.value)}
        placeholder={mode === "epoch" ? "1761000000" : "2026-04-30T12:00:00Z"}
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={() => convert()}>
          Convert
        </button>
      </div>

      <div className="grid-two">
        <div className="field-block">
          <span className="field-label">Epoch (seconds)</span>
          <input className="input" readOnly value={parsed ? String(parsed.epochSeconds) : ""} />
        </div>
        <div className="field-block">
          <span className="field-label">Epoch (milliseconds)</span>
          <input className="input" readOnly value={parsed ? String(parsed.epochMillis) : ""} />
        </div>
        <div className="field-block">
          <span className="field-label">ISO 8601 (UTC)</span>
          <input className="input" readOnly value={parsed ? parsed.iso : ""} />
        </div>
        <div className="field-block">
          <span className="field-label">Local</span>
          <input className="input" readOnly value={parsed ? parsed.date.toString() : ""} />
        </div>
      </div>

      <div className="button-row">
        <CopyButton value={parsed ? parsed.iso : ""} label="Copy ISO" />
        <CopyButton value={parsed ? String(parsed.epochSeconds) : ""} label="Copy Epoch (s)" />
        <CopyButton value={parsed ? String(parsed.epochMillis) : ""} label="Copy Epoch (ms)" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
