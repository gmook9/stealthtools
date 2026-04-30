"use client";

import { useMemo, useState } from "react";
import { XMLBuilder, XMLParser } from "fast-xml-parser";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import { downloadText } from "@/lib/download";

type Direction = "json-to-xml" | "xml-to-json";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true,
  processEntities: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressBooleanAttributes: false,
});

const MAX_INPUT_BYTES = 1_000_000;

export default function JsonXmlPage() {
  const [direction, setDirection] = useState<Direction>("json-to-xml");
  const [input, setInput] = useState('{\n  "order": {\n    "id": 32,\n    "status": "pending"\n  }\n}');
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const placeholder = useMemo(() => {
    if (direction === "json-to-xml") {
      return '{\n  "employee": {\n    "name": "Taylor"\n  }\n}';
    }
    return "<employee><name>Taylor</name></employee>";
  }, [direction]);

  const setMessage = (text: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const convert = () => {
    if (new TextEncoder().encode(input).length > MAX_INPUT_BYTES) {
      setMessage("Input exceeds 1 MB browser limit.", "error");
      return;
    }

    try {
      if (direction === "json-to-xml") {
        const parsed = JSON.parse(input);
        setOutput(builder.build(parsed));
        setMessage("Converted to XML locally.", "success");
      } else {
        const parsed = parser.parse(input);
        setOutput(JSON.stringify(parsed, null, 2));
        setMessage("Converted to JSON locally.", "success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid input format.";
      setMessage(`Conversion failed: ${message}`, "error");
    }
  };

  const download = () => {
    if (!output.trim()) return;
    const fileName = direction === "json-to-xml" ? "translated.xml" : "translated.json";
    downloadText(output, fileName);
  };

  return (
    <ToolShell
      eyebrow="Translation Tool"
      title="JSON / XML Translator"
      description="Convert payloads between JSON and XML in the browser with no external API."
    >
      <label className="field-label" htmlFor="direction-select">
        Direction
      </label>
      <select
        id="direction-select"
        className="input"
        value={direction}
        onChange={(event) => setDirection(event.target.value as Direction)}
      >
        <option value="json-to-xml">JSON to XML</option>
        <option value="xml-to-json">XML to JSON</option>
      </select>

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Input</span>
          <textarea
            rows={14}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className="textarea"
            placeholder={placeholder}
          />
        </label>
        <label className="field-block">
          <span className="field-label">Output</span>
          <textarea
            rows={14}
            value={output}
            readOnly
            className="textarea"
            placeholder="Converted result appears here"
          />
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
