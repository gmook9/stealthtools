export type ToolItem = {
  path: string;
  title: string;
  summary: string;
  tags: string[];
};

export const toolItems: ToolItem[] = [
  {
    path: "/tools/image-converter",
    title: "Image Converter",
    summary:
      "Convert PNG, JPG, and WEBP images locally in your browser with optional optimization.",
    tags: ["Image", "Offline", "Safe"],
  },
  {
    path: "/tools/qr-generator",
    title: "QR Generator",
    summary:
      "Generate downloadable QR codes from text or URLs without sending content to a server.",
    tags: ["QR", "Marketing", "Offline"],
  },
  {
    path: "/tools/json-xml",
    title: "JSON <> XML Translator",
    summary:
      "Translate structured payloads between JSON and XML formats directly on your machine.",
    tags: ["Data", "Integration", "Transform"],
  },
  {
    path: "/tools/json-viewer",
    title: "JSON Viewer",
    summary:
      "Validate, pretty-print, and inspect nested JSON quickly with tree visualization.",
    tags: ["Debug", "Viewer", "Validation"],
  },
  {
    path: "/tools/sql-compactor",
    title: "SQL Compactor",
    summary:
      "Flatten SQL to one line for logs and config while preserving query semantics.",
    tags: ["SQL", "One-Line", "Formatting"],
  },
  {
    path: "/tools/base64",
    title: "Base64 Utility",
    summary:
      "Encode and decode text or files to Base64 with local browser processing.",
    tags: ["Encoding", "Utility", "Client-side"],
  },
];
