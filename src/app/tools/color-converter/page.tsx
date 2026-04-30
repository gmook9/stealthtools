"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import CopyButton from "@/components/copy-button";
import {
  hslToRgb,
  parseHex,
  parseHslString,
  parseRgbString,
  rgbToHex,
  rgbToHsl,
  type Hsl,
  type Rgb,
} from "@/lib/color";

type ColorState = { hex: string; rgb: Rgb; hsl: Hsl };

const initialRgb: Rgb = { r: 242, g: 111, b: 95 };
const initial: ColorState = {
  hex: rgbToHex(initialRgb),
  rgb: initialRgb,
  hsl: rgbToHsl(initialRgb),
};

export default function ColorConverterPage() {
  const [color, setColor] = useState<ColorState>(initial);
  const [hexInput, setHexInput] = useState(initial.hex);
  const [rgbInput, setRgbInput] = useState(`rgb(${initialRgb.r}, ${initialRgb.g}, ${initialRgb.b})`);
  const [hslInput, setHslInput] = useState(`hsl(${initial.hsl.h}, ${initial.hsl.s}%, ${initial.hsl.l}%)`);
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const apply = (rgb: Rgb) => {
    const hex = rgbToHex(rgb);
    const hsl = rgbToHsl(rgb);
    setColor({ hex, rgb, hsl });
    setHexInput(hex);
    setRgbInput(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
    setHslInput(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    setStatus("Converted locally.");
    setStatusKind("success");
  };

  const fail = (message: string) => {
    setStatus(message);
    setStatusKind("error");
  };

  const convertFromHex = () => {
    const rgb = parseHex(hexInput);
    if (!rgb) return fail("Invalid hex color. Use #rgb or #rrggbb.");
    apply(rgb);
  };

  const convertFromRgb = () => {
    const rgb = parseRgbString(rgbInput);
    if (!rgb) return fail("Invalid RGB string. Try rgb(255, 0, 0).");
    apply(rgb);
  };

  const convertFromHsl = () => {
    const hsl = parseHslString(hslInput);
    if (!hsl) return fail("Invalid HSL string. Try hsl(180, 50%, 50%).");
    apply(hslToRgb(hsl));
  };

  const cssHex = color.hex.toUpperCase();
  const cssRgb = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  const cssHsl = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;

  return (
    <ToolShell
      eyebrow="Generator"
      title="Color Converter"
      description="Convert between HEX, RGB, and HSL color notations and preview the result."
    >
      <div className="grid-two">
        <div className="field-block">
          <span className="field-label">Preview</span>
          <div
            style={{
              background: cssHex,
              border: "1px solid var(--color-line)",
              borderRadius: "11px",
              minHeight: "120px",
            }}
            aria-label={`Preview of ${cssHex}`}
          />
          <input
            type="color"
            value={color.hex}
            onChange={(ev) => apply(parseHex(ev.target.value)!)}
            aria-label="Color picker"
          />
        </div>

        <div className="field-block">
          <div className="field-block">
            <span className="field-label">HEX</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input
                className="input"
                value={hexInput}
                onChange={(ev) => setHexInput(ev.target.value)}
              />
              <button type="button" className="button-link button-ghost" onClick={convertFromHex}>
                Convert
              </button>
            </div>
            <CopyButton value={cssHex} label="Copy HEX" />
          </div>
          <div className="field-block">
            <span className="field-label">RGB</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input
                className="input"
                value={rgbInput}
                onChange={(ev) => setRgbInput(ev.target.value)}
              />
              <button type="button" className="button-link button-ghost" onClick={convertFromRgb}>
                Convert
              </button>
            </div>
            <CopyButton value={cssRgb} label="Copy RGB" />
          </div>
          <div className="field-block">
            <span className="field-label">HSL</span>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              <input
                className="input"
                value={hslInput}
                onChange={(ev) => setHslInput(ev.target.value)}
              />
              <button type="button" className="button-link button-ghost" onClick={convertFromHsl}>
                Convert
              </button>
            </div>
            <CopyButton value={cssHsl} label="Copy HSL" />
          </div>
        </div>
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
