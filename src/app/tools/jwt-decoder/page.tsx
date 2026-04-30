"use client";

import { useState } from "react";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";
import { decodeJwt, type DecodedJwt } from "@/lib/jwt";

function formatTimestamp(value: unknown): string | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [status, setStatus] = useState("Paste a JWT then click Decode.");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const handleDecode = () => {
    if (!token.trim()) {
      setStatus("Paste a JWT then click Decode.");
      setStatusKind("info");
      setDecoded(null);
      return;
    }
    try {
      const result = decodeJwt(token);
      setDecoded(result);
      setStatus("Decoded locally. Signature is NOT verified by this tool.");
      setStatusKind("success");
    } catch (error) {
      setDecoded(null);
      setStatus(error instanceof Error ? error.message : "Invalid JWT.");
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
      description="Decode JWT header and payload locally. This tool never validates the signature."
    >
      <label className="field-label" htmlFor="jwt-input">
        JWT
      </label>
      <textarea
        id="jwt-input"
        rows={6}
        value={token}
        onChange={(ev) => setToken(ev.target.value)}
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
