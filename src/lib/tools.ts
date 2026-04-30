import type { ComponentType } from "react";
import {
  FiCode,
  FiCommand,
  FiDatabase,
  FiFileText,
  FiHash,
  FiImage,
  FiKey,
  FiLink,
  FiLock,
  FiRefreshCw,
  FiSearch,
  FiShield,
  FiClock,
  FiGrid,
  FiType,
} from "react-icons/fi";

export type ToolCategory =
  | "Data"
  | "Encoding"
  | "Generators"
  | "Text"
  | "Time"
  | "Image";

export type ToolItem = {
  path: string;
  title: string;
  summary: string;
  tags: string[];
  category: ToolCategory;
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

export const toolItems: ToolItem[] = [
  {
    path: "/tools/image-converter",
    title: "Image Converter",
    summary:
      "Convert PNG, JPG, and WEBP images locally with optional optimization.",
    tags: ["Image", "Local", "Canvas"],
    category: "Image",
    Icon: FiImage,
  },
  {
    path: "/tools/qr-generator",
    title: "QR Generator",
    summary:
      "Generate downloadable QR codes from text or URLs without sending content anywhere.",
    tags: ["QR", "Marketing", "Local"],
    category: "Generators",
    Icon: FiGrid,
  },
  {
    path: "/tools/json-xml",
    title: "JSON / XML Translator",
    summary:
      "Translate structured payloads between JSON and XML directly on your machine.",
    tags: ["Data", "Integration"],
    category: "Data",
    Icon: FiRefreshCw,
  },
  {
    path: "/tools/json-viewer",
    title: "JSON Viewer",
    summary:
      "Validate, prettify, and explore nested JSON with a tree visualization.",
    tags: ["Debug", "Viewer"],
    category: "Data",
    Icon: FiSearch,
  },
  {
    path: "/tools/sql-compactor",
    title: "SQL Compactor",
    summary: "Format then flatten SQL to one line for logs, configs, and scripts.",
    tags: ["SQL", "One-line"],
    category: "Data",
    Icon: FiDatabase,
  },
  {
    path: "/tools/csv-json",
    title: "CSV / JSON Converter",
    summary: "Convert CSV to JSON and back with delimiter and header controls.",
    tags: ["CSV", "Data"],
    category: "Data",
    Icon: FiFileText,
  },
  {
    path: "/tools/base64",
    title: "Base64 Utility",
    summary: "Encode and decode text or small files to Base64 in your browser.",
    tags: ["Encoding", "Files"],
    category: "Encoding",
    Icon: FiCode,
  },
  {
    path: "/tools/url-encoder",
    title: "URL Encoder / Decoder",
    summary: "Encode and decode URI components and full URLs safely.",
    tags: ["URL", "Encoding"],
    category: "Encoding",
    Icon: FiLink,
  },
  {
    path: "/tools/jwt-decoder",
    title: "JWT Decoder",
    summary:
      "Decode JWT header and payload locally. Signature is never validated against any server.",
    tags: ["JWT", "Inspect"],
    category: "Encoding",
    Icon: FiKey,
  },
  {
    path: "/tools/hash",
    title: "Hash Generator",
    summary:
      "Create SHA-1, SHA-256, SHA-384, or SHA-512 hashes using the browser SubtleCrypto API.",
    tags: ["Hash", "Crypto"],
    category: "Encoding",
    Icon: FiHash,
  },
  {
    path: "/tools/uuid",
    title: "UUID Generator",
    summary: "Generate cryptographically random UUIDv4 values, in batches if needed.",
    tags: ["UUID", "ID"],
    category: "Generators",
    Icon: FiCommand,
  },
  {
    path: "/tools/password",
    title: "Password Generator",
    summary:
      "Generate strong random passwords using the browser cryptographic random source.",
    tags: ["Password", "Security"],
    category: "Generators",
    Icon: FiLock,
  },
  {
    path: "/tools/text-diff",
    title: "Text Diff",
    summary: "Compare two text snippets side-by-side and highlight what changed.",
    tags: ["Diff", "Text"],
    category: "Text",
    Icon: FiFileText,
  },
  {
    path: "/tools/regex-tester",
    title: "Regex Tester",
    summary:
      "Test JavaScript regular expressions against sample text with capture group output.",
    tags: ["Regex", "Text"],
    category: "Text",
    Icon: FiSearch,
  },
  {
    path: "/tools/case-converter",
    title: "Case Converter",
    summary: "Convert text between camel, snake, kebab, title, sentence, and constant cases.",
    tags: ["Case", "Text"],
    category: "Text",
    Icon: FiType,
  },
  {
    path: "/tools/timestamp",
    title: "Timestamp Converter",
    summary: "Convert between Unix epoch, ISO 8601, and human readable timestamps.",
    tags: ["Time", "Convert"],
    category: "Time",
    Icon: FiClock,
  },
];

export const toolCategories: ToolCategory[] = [
  "Data",
  "Encoding",
  "Generators",
  "Text",
  "Time",
  "Image",
];

export const categoryDescriptions: Record<ToolCategory, string> = {
  Data: "Inspect and translate structured data formats.",
  Encoding: "Encode, decode, and inspect encoded values.",
  Generators: "Create new identifiers, codes, and credentials safely.",
  Text: "Compare, transform, and analyze text snippets.",
  Time: "Work with timestamps and date conversions.",
  Image: "Convert and optimize images in your browser.",
};

export const categoryIcons: Record<ToolCategory, ComponentType<{ className?: string }>> = {
  Data: FiDatabase,
  Encoding: FiCode,
  Generators: FiCommand,
  Text: FiType,
  Time: FiClock,
  Image: FiImage,
};

export { FiShield };
