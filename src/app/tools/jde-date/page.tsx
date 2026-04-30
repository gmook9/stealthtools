"use client";

import { useEffect, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import { dateToJde, parseJdeDate } from "@/lib/jde-date";

export default function JdeDatePage() {
  const [today, setToday] = useState<Date | null>(null);
  const [jdeInput, setJdeInput] = useState("");
  const [gregorianInput, setGregorianInput] = useState("");
  const [jdeFromGregorian, setJdeFromGregorian] = useState("");
  const [gregorianFromJde, setGregorianFromJde] = useState("");
  const [status, setStatus] = useState("Enter a JDE Julian (CYYDDD) or a Gregorian date.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  useEffect(() => {
    const now = new Date();
    setToday(now);
    setJdeInput(dateToJde(now));
    setGregorianInput(now.toISOString().slice(0, 10));
  }, []);

  const convertJdeToGregorian = () => {
    const result = parseJdeDate(jdeInput);
    if (!result) {
      setGregorianFromJde("");
      setStatus("Invalid JDE Julian date. Format must be CYYDDD (5 or 6 digits).");
      setStatusKind("error");
      return;
    }
    setGregorianFromJde(`${result.iso}  (day ${result.dayOfYear} of ${result.year})`);
    setStatus("Converted locally.");
    setStatusKind("success");
  };

  const convertGregorianToJde = () => {
    const date = new Date(`${gregorianInput}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) {
      setJdeFromGregorian("");
      setStatus("Invalid Gregorian date. Use YYYY-MM-DD.");
      setStatusKind("error");
      return;
    }
    const value = dateToJde(date);
    if (!value) {
      setJdeFromGregorian("");
      setStatus("Year out of supported JDE range (1900-2899).");
      setStatusKind("error");
      return;
    }
    setJdeFromGregorian(value);
    setStatus("Converted locally.");
    setStatusKind("success");
  };

  return (
    <ToolShell
      eyebrow="Time Tool"
      title="JDE Julian Date Converter"
      description="Convert between JD Edwards CYYDDD Julian dates (e.g. 110131) and standard Gregorian dates."
    >
      {today ? (
        <p className="meta-note">
          Today: <strong>{today.toISOString().slice(0, 10)}</strong> &middot; JDE:{" "}
          <strong>{dateToJde(today)}</strong>
        </p>
      ) : null}

      <div className="grid-two">
        <div className="field-block">
          <span className="field-label">JDE Julian (CYYDDD)</span>
          <input
            className="input"
            value={jdeInput}
            onChange={(ev) => setJdeInput(ev.target.value)}
            inputMode="numeric"
            maxLength={6}
            placeholder="110131"
          />
          <div className="button-row">
            <button type="button" className="button-link" onClick={convertJdeToGregorian}>
              Convert to Gregorian
            </button>
          </div>
          <input
            className="input"
            readOnly
            value={gregorianFromJde}
            placeholder="Gregorian result"
          />
          <CopyButton value={gregorianFromJde} label="Copy" />
        </div>

        <div className="field-block">
          <span className="field-label">Gregorian (YYYY-MM-DD)</span>
          <input
            className="input"
            type="date"
            value={gregorianInput}
            onChange={(ev) => setGregorianInput(ev.target.value)}
          />
          <div className="button-row">
            <button type="button" className="button-link" onClick={convertGregorianToJde}>
              Convert to JDE
            </button>
          </div>
          <input
            className="input"
            readOnly
            value={jdeFromGregorian}
            placeholder="JDE Julian result"
          />
          <CopyButton value={jdeFromGregorian} label="Copy" />
        </div>
      </div>

      <p className="meta-note">
        Format: <code>CYYDDD</code> where C is century offset from 1900 (0=1900s, 1=2000s),
        YY is the year within the century, and DDD is the day of the year (001-366).
      </p>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
