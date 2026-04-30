"use client";

import { ChangeEvent, useState } from "react";
import Papa from "papaparse";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import { downloadText } from "@/lib/download";

type Direction = "csv-to-json" | "json-to-csv";
type StatusKind = "info" | "success" | "error";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

export default function CsvJsonPage() {
  const [direction, setDirection] = useState<Direction>("csv-to-json");
  const [delimiter, setDelimiter] = useState(",");
  const [hasHeader, setHasHeader] = useState(true);
  const [input, setInput] = useState("name,role\nAlice,Manager\nBob,Engineer");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<StatusKind>("info");

  const setMessage = (text: string, kind: StatusKind = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const convert = () => {
    try {
      if (direction === "csv-to-json") {
        const parsed = Papa.parse(input, {
          header: hasHeader,
          delimiter,
          skipEmptyLines: true,
        });

        if (parsed.errors.length > 0) {
          setMessage(`CSV parse error: ${parsed.errors[0].message}`, "error");
          return;
        }

        setOutput(JSON.stringify(parsed.data, null, 2));
        setMessage(`Converted ${parsed.data.length} rows to JSON.`, "success");
      } else {
        const data = JSON.parse(input);
        if (!Array.isArray(data)) {
          setMessage("JSON must be an array of objects to convert to CSV.", "error");
          return;
        }
        const csv = Papa.unparse(data, { delimiter });
        setOutput(csv);
        setMessage(`Converted ${data.length} rows to CSV.`, "success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion failed.";
      setMessage(message, "error");
    }
  };

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_BYTES) {
      setMessage("Please keep files under 5 MB.", "error");
      return;
    }

    const text = await file.text();
    setInput(text);
    setMessage("File loaded.", "info");
  };

  const download = () => {
    if (!output.trim()) return;
    const fileName = direction === "csv-to-json" ? "converted.json" : "converted.csv";
    const mime = direction === "csv-to-json" ? "application/json" : "text/csv";
    downloadText(output, fileName, `${mime};charset=utf-8`);
  };

  return (
    <ToolShell
      eyebrow="Data Tool"
      title="CSV / JSON Converter"
      description="Convert tabular data between CSV and JSON in your browser using a strict, locally executed parser."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Direction</span>
          <select
            className="input"
            value={direction}
            onChange={(event) => setDirection(event.target.value as Direction)}
          >
            <option value="csv-to-json">CSV to JSON</option>
            <option value="json-to-csv">JSON to CSV</option>
          </select>
        </label>
        <label className="field-block">
          <span className="field-label">Delimiter</span>
          <select
            className="input"
            value={delimiter}
            onChange={(event) => setDelimiter(event.target.value)}
          >
            <option value=",">Comma</option>
            <option value=";">Semicolon</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe</option>
          </select>
        </label>
      </div>

      {direction === "csv-to-json" ? (
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(event) => setHasHeader(event.target.checked)}
          />
          <span>First row contains column names</span>
        </label>
      ) : null}

      <label className="field-label" htmlFor="csv-file">
        Load File
      </label>
      <input
        id="csv-file"
        type="file"
        accept=".csv,.json,text/csv,application/json,text/plain"
        onChange={uploadFile}
        className="input"
      />

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Input</span>
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
        <button type="button" className="button-link" onClick={convert}>
          Convert
        </button>
        <button type="button" className="button-link button-ghost" onClick={download}>
          Download Result
        </button>
        <CopyButton value={output} label="Copy Output" />
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
