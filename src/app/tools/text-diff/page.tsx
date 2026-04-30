"use client";

import { useMemo, useState } from "react";
import { diffWordsWithSpace, type Change } from "diff";
import ToolShell from "@/components/tool-shell";
import StatusNote from "@/components/status-note";

const MAX_LENGTH = 200_000;

export default function TextDiffPage() {
  const [left, setLeft] = useState("The quick brown fox jumps over the lazy dog.");
  const [right, setRight] = useState("The quick orange fox leaps over the lazy cat.");
  const [status, setStatus] = useState("Ready");
  const [statusKind, setStatusKind] = useState<"info" | "success" | "error">("info");

  const changes = useMemo<Change[]>(() => {
    if (left.length > MAX_LENGTH || right.length > MAX_LENGTH) {
      return [];
    }
    return diffWordsWithSpace(left, right);
  }, [left, right]);

  const overLimit = left.length > MAX_LENGTH || right.length > MAX_LENGTH;

  const summary = useMemo(() => {
    let added = 0;
    let removed = 0;
    for (const change of changes) {
      if (change.added) added += 1;
      if (change.removed) removed += 1;
    }
    return { added, removed };
  }, [changes]);

  const compute = () => {
    if (overLimit) {
      setStatus(`Inputs exceed ${MAX_LENGTH.toLocaleString()} characters.`);
      setStatusKind("error");
      return;
    }
    setStatus(`Diff computed locally: ${summary.added} additions, ${summary.removed} removals.`);
    setStatusKind("success");
  };

  return (
    <ToolShell
      eyebrow="Text Tool"
      title="Text Diff"
      description="Compare two text snippets and highlight what changed. Computed entirely in your browser."
    >
      <div className="grid-two">
        <label className="field-block">
          <span className="field-label">Original</span>
          <textarea
            rows={12}
            className="textarea"
            value={left}
            onChange={(event) => setLeft(event.target.value)}
          />
        </label>
        <label className="field-block">
          <span className="field-label">Modified</span>
          <textarea
            rows={12}
            className="textarea"
            value={right}
            onChange={(event) => setRight(event.target.value)}
          />
        </label>
      </div>

      <div className="button-row">
        <button type="button" className="button-link" onClick={compute}>
          Compare
        </button>
      </div>

      <StatusNote status={status} kind={statusKind} />

      <div className="diff-output" aria-label="Diff result">
        {overLimit ? (
          <p className="meta-note">Reduce input size to view diff.</p>
        ) : (
          changes.map((change, index) => {
            const className = change.added
              ? "diff-added"
              : change.removed
                ? "diff-removed"
                : "diff-unchanged";
            return (
              <span key={index} className={className}>
                {change.value}
              </span>
            );
          })
        )}
      </div>
    </ToolShell>
  );
}
