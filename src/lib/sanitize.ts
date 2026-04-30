/**
 * Sanitize a user-provided file name to prevent path traversal,
 * shell special characters, and overly long names.
 */
export function sanitizeFileName(name: string, fallback = "file"): string {
  const stripped = name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 80);

  return stripped || fallback;
}
