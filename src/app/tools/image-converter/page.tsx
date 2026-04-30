"use client";

import { ChangeEvent, useMemo, useState } from "react";
import imageCompression from "browser-image-compression";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import { downloadBlob } from "@/lib/download";
import { sanitizeFileName } from "@/lib/sanitize";

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

const formatExt: Record<OutputFormat, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const MAX_BYTES = 20 * 1024 * 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read image file."));
    };

    image.src = objectUrl;
  });
}

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(0.92);
  const [optimizeInput, setOptimizeInput] = useState(true);
  const [status, setStatus] = useState("Select an image to begin.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");
  const [busy, setBusy] = useState(false);

  const fileInfo = useMemo(() => {
    if (!file) return "No file selected";
    return `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
  }, [file]);

  const setMessage = (text: string, kind: "info" | "success" | "error" = "info") => {
    setStatus(text);
    setStatusKind(kind);
  };

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) {
      setFile(null);
      setMessage("Select an image to begin.");
      return;
    }

    if (!selected.type.startsWith("image/")) {
      setMessage("Only image files are supported.", "error");
      return;
    }

    if (selected.size > MAX_BYTES) {
      setMessage("Please choose an image under 20 MB.", "error");
      return;
    }

    setFile(selected);
    setMessage("Ready to convert.", "info");
  };

  const convertImage = async () => {
    if (!file) {
      setMessage("Please pick an image first.", "error");
      return;
    }

    setBusy(true);
    setMessage("Converting locally...");

    try {
      let workingFile = file;

      if (optimizeInput) {
        workingFile = await imageCompression(file, {
          maxSizeMB: 8,
          maxWidthOrHeight: 4000,
          initialQuality: quality,
          useWebWorker: true,
        });
      }

      const img = await loadImage(workingFile);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas is not available in this browser.");
      }

      context.drawImage(img, 0, 0);

      const convertedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to convert image."));
              return;
            }
            resolve(blob);
          },
          outputFormat,
          quality,
        );
      });

      const cleanName = sanitizeFileName(file.name, "converted-image");
      downloadBlob(convertedBlob, `${cleanName}.${formatExt[outputFormat]}`);
      setMessage("Converted successfully. File downloaded.", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Conversion failed.";
      setMessage(message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ToolShell
      eyebrow="Image Tool"
      title="Image Converter"
      description="Convert and optimize images directly in your browser. Files never leave your machine."
    >
      <label className="field-label" htmlFor="image-file">
        Source Image
      </label>
      <input
        id="image-file"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
        onChange={handleFile}
        className="input"
      />
      <p className="meta-note">{fileInfo}</p>

      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Output Format</span>
          <select
            value={outputFormat}
            onChange={(event) => setOutputFormat(event.target.value as OutputFormat)}
            className="input"
          >
            <option value="image/png">PNG</option>
            <option value="image/jpeg">JPG</option>
            <option value="image/webp">WEBP</option>
          </select>
        </label>

        <label className="field-block">
          <span className="field-label">Quality ({Math.round(quality * 100)}%)</span>
          <input
            type="range"
            min={0.4}
            max={1}
            step={0.01}
            value={quality}
            onChange={(event) => setQuality(Number(event.target.value))}
          />
        </label>
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={optimizeInput}
          onChange={(event) => setOptimizeInput(event.target.checked)}
        />
        <span>Optimize before conversion for smaller output files</span>
      </label>

      <div className="button-row">
        <button type="button" onClick={convertImage} className="button-link" disabled={busy}>
          {busy ? "Working..." : "Convert And Download"}
        </button>
      </div>

      <StatusNote status={status} kind={statusKind} />
    </ToolShell>
  );
}
