"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";

type DecodedJwt = {
  header: unknown;
  payload: unknown;
  signature: string;
};

function base64UrlDecode(segment: string): string {
  const padded = segment + "=".repeat((4 - (segment.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function tryParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    throw new Error("Token does not have three dot-separated segments.");
  }

  return {
    header: tryParse(base64UrlDecode(parts[0])),
    payload: tryParse(base64UrlDecode(parts[1])),
    signature: parts[2],
  };
}

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("Paste a JWT to inspect locally.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const decoded = useMemo<DecodedJwt | null>(() => {
    if (!token.trim()) return null;
    try {
      const result = decodeJwt(token);
      return result;
    } catch {
      return null;
    }
  }, [token]);

  const handleDecode = () => {
    if (!token.trim()) {
      setStatus("Paste a JWT to inspect locally.");
      setStatusKind("info");
      return;
    }

    try {
      decodeJwt(token);
      setStatus("Decoded locally. Signature is NOT verified by this tool.");
      setStatusKind("success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid JWT.";
      setStatus(message);
      setStatusKind("error");
    }
  };

  const claims =
    decoded && typeof decoded.payload === "object" && decoded.payload !== null
      ? (decoded.payload as Record<string, unknown>)
      : null;

  return (
    <ToolShell
      eyebrow="Inspection Tool"
      title="JWT Decoder"
      description="Decode JWT header and payload locally. This tool never validates the signature against any key."
    >
      <label className="field-label" htmlFor="jwt-input">
        JWT
      </label>
      <textarea
        id="jwt-input"
        rows={6}
        value={token}
        onChange={(event) => setToken(event.target.value)}
        className="textarea"
        placeholder="eyJhbGciOi..."
      />

      <div className="button-row">
        <button type="button" className="button-link" onClick={handleDecode}>
          Decode
        </button>
      </div>

      <StatusNote status={status} kind={statusKind} />

      {decoded ? (
        <div className="grid-two">
          <div className="field-block">
            <span className="field-label">Header</span>
            <textarea
              rows={10}
              readOnly
              className="textarea"
              value={JSON.stringify(decoded.header, null, 2)}
            />
          </div>
          <div className="field-block">
            <span className="field-label">Payload</span>
            <textarea
              rows={10}
              readOnly
              className="textarea"
              value={JSON.stringify(decoded.payload, null, 2)}
            />
          </div>
        </div>
      ) : null}

      {claims ? (
        <div className="meta-note">
          {formatTimestamp(claims.iat) ? <p>Issued at: {formatTimestamp(claims.iat)}</p> : null}
          {formatTimestamp(claims.nbf) ? <p>Not before: {formatTimestamp(claims.nbf)}</p> : null}
          {formatTimestamp(claims.exp) ? <p>Expires at: {formatTimestamp(claims.exp)}</p> : null}
        </div>
      ) : null}
    </ToolShell>
  );
}
