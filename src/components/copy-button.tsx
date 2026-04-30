"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

type CopyButtonProps = {
  value: string;
  label?: string;
  className?: string;
  disabled?: boolean;
};

export default function CopyButton({
  value,
  label = "Copy",
  className,
  disabled,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={className ?? "button-link button-ghost"}
      disabled={disabled || !value}
      aria-label={label}
    >
      {copied ? <FiCheck aria-hidden /> : <FiCopy aria-hidden />}
      <span style={{ marginLeft: "0.4rem" }}>{copied ? "Copied" : label}</span>
    </button>
  );
}
