"use client";

import { useMemo, useState } from "react";
import { XMLBuilder, XMLParser } from "fast-xml-parser";

type Direction = "json-to-xml" | "xml-to-json";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true,
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressBooleanAttributes: false,
});

function downloadText(content: string, fileName: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function JsonXmlPage() {
  const [direction, setDirection] = useState<Direction>("json-to-xml");
  const [input, setInput] = useState('{\n  "order": {\n    "id": 32,\n    "status": "pending"\n  }\n}');
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("Ready");

  const placeholder = useMemo(() => {
    if (direction === "json-to-xml") {
      return '{\n  "employee": {\n    "name": "Taylor"\n  }\n}';
    }

    return "<employee><name>Taylor</name></employee>";
  }, [direction]);

  const convert = () => {
    try {
      if (direction === "json-to-xml") {
        const parsed = JSON.parse(input);
        const xml = builder.build(parsed);
        setOutput(xml);
        setStatus("Converted to XML locally.");
      } else {
        const parsed = parser.parse(input);
        const json = JSON.stringify(parsed, null, 2);
        setOutput(json);
        setStatus("Converted to JSON locally.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid input format.";
      setStatus(`Conversion failed: ${message}`);
    }
  };

  const download = () => {
    if (!output.trim()) return;
    const fileName = direction === "json-to-xml" ? "translated.xml" : "translated.json";
    downloadText(output, fileName);
  };

  return (
    <section className="page-stack">
      <header className="hero-panel">
        <p className="eyebrow">Translation Tool</p>
        <h1 className="hero-title">JSON to XML Translator</h1>
        <p className="hero-copy">
          Convert payloads between JSON and XML in the browser with no external API.
        </p>
      </header>

      <div className="tool-panel">
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
        </div>

        <p className="status-note">{status}</p>
      </div>
    </section>
  );
}
